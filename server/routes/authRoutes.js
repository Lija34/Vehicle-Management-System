import express from 'express';
import { authUser, registerUser, getUserInfo, verifyEmail, requestPasswordReset, resetPassword } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/userinfo', requireAuth, getUserInfo);
router.get('/verify/:token', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

router.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

export default router;
