import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

export const requireAuth = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    try {
      token = req.cookies.token;
      console.log('Token from cookie:', token); // Debugging
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debugging
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found:', req.user); // Debugging
      next();
    } catch (error) {
      console.error('Token validation error:', error.message); // Debugging
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    console.log('No token found in cookies'); // Debugging
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

export const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    console.log('User role not authorized:', req.user.role); // Debugging
    return res.status(403).json({ error: 'Forbidden: Access is denied' });
  }
  next();
};
