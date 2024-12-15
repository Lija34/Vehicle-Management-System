import User from '../models/user.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { generateToken, generateVerificationToken } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {transporter} from '../config/nodemailer.js';

dotenv.config();

// User Authentication
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: false, path: '/' });
    res.cookie('role', user.role, { httpOnly: true, sameSite: 'strict', secure: false, path: '/' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateVerificationToken();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    isVerified: false
  });

  if (user) {
    const verificationUrl = `${process.env.FRONTEND_DOMAIN}/verify/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Email Verification',
      text: `Please click the following link to verify your email: ${verificationUrl}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Nodemailer Error:', error);
        return res.status(500).json({ error: 'Error sending verification email' });
      }
      console.log('Nodemailer Response:', info);

      const token = generateToken(user._id, user.role);
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.cookie('role', user.role, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
        role: user.role
      });
    });
  } else {
    res.status(400).json({ error: 'Invalid user data' });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const resetToken = generateVerificationToken();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.FRONTEND_DOMAIN}/reset/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Password Reset',
    text: `Please click the following link to reset your password: ${resetUrl}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Nodemailer Error:', error);
      return res.status(500).json({ error: 'Error sending password reset email' });
    }
    console.log('Nodemailer Response:', info);
    res.status(200).json({ message: 'Password reset email sent successfully' });
  });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({ message: 'Email verified successfully' });
};


export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(400);
      throw new Error('Invalid token or user does not exist');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400);
    throw new Error('Invalid token');
  }
});



export const getUserInfo = async (req, res) => {
  const user = req.user;
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};


export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

