
import { errorMiddleware } from '../src/presentation/middlewares/error.middleware';

import userRoutes from './presentation/routes/user.routes';
import './shared/config/passport/google.strategy';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from '../src/presentation/routes/auth.routes';
import eventRoutes from '../src/presentation/routes/event.routes';
import adminRoutes from '../src/presentation/routes/admin.routes';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use((_req, res) => {
  res.status(404).json({ message: 'the page not found' });
});
app.use(errorMiddleware);
export default app;
