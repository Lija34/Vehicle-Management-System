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

export default router;
