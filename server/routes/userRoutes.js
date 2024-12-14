import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { requireAuth, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, checkRole(['admin']), getAllUsers);

export default router;
