import { Router } from 'express';

import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
import { makebookingController } from '../../container/booking.containers';
import { ApiEndpoints } from '../../common/constants/api-endpoints';

const router = Router();
const bookingController = makebookingController();

// Apply auth middleware to all booking routes
router.use(verifyAccessToken);

router.post(ApiEndpoints.Bookings.LockSeats, bookingController.lockSeats);
router.post(
  ApiEndpoints.Bookings.PaymentIntent,
  bookingController.createPaymentIntent,
);
router.post(ApiEndpoints.Bookings.Confirm, bookingController.confirmBooking);
router.post(ApiEndpoints.Bookings.Failed, bookingController.failBooking);

export default router;
