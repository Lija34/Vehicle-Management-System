import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

export { generateToken, generateVerificationToken };
