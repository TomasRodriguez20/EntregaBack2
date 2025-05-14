import User from '../models/User.js';
import Order from '../models/Order.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find().populate('cart');
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).populate('cart');
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
};

export const createUser = async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json(newUser);
};

export const getProfile = async (req, res) => {
  const user = req.user;

  const orders = await Order.find({ user: user._id }).populate('products.product').lean();

  res.render('profile', { user, orders });
};



export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, email, age } = req.body;

  await User.findByIdAndUpdate(userId, {
    first_name,
    last_name,
    email,
    age,
  });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};