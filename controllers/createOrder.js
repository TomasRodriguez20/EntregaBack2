import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findById(req.user.cart).populate('products.product');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: 'Tu carrito está vacío' });
    }

    let totalPrice = 0;
    cart.products.forEach(item => {
      totalPrice += item.product.price * item.quantity;
    });

    const newOrder = new Order({
      user: req.user._id,
      products: cart.products.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalPrice,
      paymentMethod: 'simulado', 
    });

await newOrder.save();

await newOrder.populate('products.product');

cart.products = [];
await cart.save();

res.render('order-confirmation', { order: newOrder });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la orden de compra' });
  }
};
