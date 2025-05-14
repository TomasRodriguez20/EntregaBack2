import express from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { authMiddleware } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
import { getProfile } from '../controllers/userController.js';
const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  const products = await Product.find();
  const user = req.user || null; // En caso de que no esté logueado
  res.render('home', { products, user });
});

router.get('/product/:pid', authMiddleware, async (req, res) => {
  const product = await Product.findById(req.params.pid).lean();
  res.render('product', {
    product,
    user: req.user, // necesario para obtener el ID del carrito
  });
});

router.get('/cart/:cid', authMiddleware, async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
  res.render('cart', { cart, user: req.user });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});


router.get('/profile', authMiddleware, getProfile);


router.get('/profile/edit', authMiddleware, (req, res) => {
  res.render('edit-profile', { user: req.user });
});

router.post('/cart/add/:pid', authMiddleware, async (req, res) => {
  const productId = req.params.pid;
  const user = req.user;

  try {
    let cart = await Cart.findById(user.cart);

    if (!cart) {
      cart = new Cart({ products: [] });
    }

    const existingProduct = cart.products.find(p => p.product.toString() === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    if (!user.cart) {
      user.cart = cart._id;
      await user.save();
    }

    res.redirect('/'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar al carrito');
  }
});

export default router;