import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCartById = async (req, res) => {
  const cart = await Cart.findById(req.params.cid).lean();
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  const cleanedProducts = [];

  for (const item of cart.products) {
    const product = await Product.findById(item.product).lean();
    if (product) {
      cleanedProducts.push({
        product,
        quantity: item.quantity
      });
    }
  }

  if (cleanedProducts.length !== cart.products.length) {
    await Cart.findByIdAndUpdate(req.params.cid, {
      $set: {
        products: cleanedProducts.map(p => ({
          product: p.product._id,
          quantity: p.quantity
        }))
      }
    });
  }

  res.render('cart', { products: cleanedProducts });
};

export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const existingProduct = cart.products.find(p => p.product.toString() === pid);

    if (existingProduct) {
      existingProduct.quantity += parseInt(quantity || 1);
    } else {
      cart.products.push({ product: pid, quantity: parseInt(quantity || 1) });
    }

    await cart.save();
    res.redirect('/?success=true');
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};



export const removeProductFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = cart.products.filter(item => {
      return item.product && item.product.toString() !== req.params.pid;
    });

    await cart.save();
    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
};
