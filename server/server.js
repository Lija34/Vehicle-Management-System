import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import  {removeUnverifiedUsers}  from './controllers/removeUnverifiedUser.js';

dotenv.config();

connectDB();

const app = express();

const corsOptions = {
  origin: 'https://veichle-management-system.netlify.app',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.clearCookie('role', { path: '/' });
  res.status(200).send('Logged out');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

removeUnverifiedUsers();
