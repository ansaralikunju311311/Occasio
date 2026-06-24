import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import passport from 'passport';

import { errorMiddleware } from '../src/presentation/middlewares/error.middleware';
import adminRoutes from '../src/presentation/routes/admin.routes';
import authRoutes from '../src/presentation/routes/auth.routes';
import eventRoutes from '../src/presentation/routes/event.routes';
import planRoutes from '../src/presentation/routes/plans.routes';

import bookingRoutes from './presentation/routes/booking.routes';
import paymentRoutes from './presentation/routes/payment.routes';
import userRoutes from './presentation/routes/user.routes';
import { ApiEndpoints } from './common/constants/api-endpoints';
import './shared/config/passport/google.strategy';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(ApiEndpoints.Auth.Base, authRoutes);
app.use(ApiEndpoints.User.Base, userRoutes);
app.use(ApiEndpoints.Admin.Base, adminRoutes);
app.use(ApiEndpoints.Events.Base, eventRoutes); // Restore original
app.use(ApiEndpoints.Payments.Base, paymentRoutes);
app.use(ApiEndpoints.Plans.Base, planRoutes);
app.use(ApiEndpoints.Bookings.Base, bookingRoutes);
app.use((_req, res) => {
  res.status(404).json({ message: 'the page not found' });
});
app.use(errorMiddleware);
export default app;
