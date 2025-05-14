import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import Cart from '../models/Cart.js';

dotenv.config();

const router = Router();


router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).send('El usuario ya existe');

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newCart = await Cart.create({ products: [] });

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: newCart._id
    });

    return res.redirect('/login');
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).send('Error al registrar usuario');
  }
});



router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      const message = info?.message || 'Login fallido';
      return res.redirect(`/login?error=${encodeURIComponent(message)}`);
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).redirect('/');
  })(req, res, next);
});


router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }

  const { _id, first_name, last_name, email, age, role } = req.user;
  res.json({ user: { _id, first_name, last_name, email, age, role } });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token').redirect('/');
});

export default router;