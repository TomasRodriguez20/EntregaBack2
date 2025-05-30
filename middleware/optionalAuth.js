import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const optionalAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).lean();
    if (user) req.user = user;
  } catch (err) {
  }

  next();
};