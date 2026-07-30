import { Router } from 'express';

import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
import { makebookingController } from '../../container/booking.containers';
import { ApiEndpoints } from '../../common/constants/api-endpoints';

const router = Router();
const bookingController = makebookingController();

// Apply auth middleware to all booking routes
// router.use(verifyAccessToken);

router.post(
  ApiEndpoints.Bookings.LockSeats,
  verifyAccessToken,
  bookingController.lockSeats,
);
router.post(
  ApiEndpoints.Bookings.PaymentIntent,
  verifyAccessToken,
  bookingController.createPaymentIntent,
);
router.post(
  ApiEndpoints.Bookings.Confirm,
  verifyAccessToken,
  bookingController.confirmBooking,
);
router.post(
  ApiEndpoints.Bookings.Failed,
  verifyAccessToken,
  bookingController.failBooking,
);

router.patch(
  ApiEndpoints.Bookings.cancel,
  verifyAccessToken,
  bookingController.cancelBooking,
);

router.get(
  ApiEndpoints.Bookings.RefundInfo,
  verifyAccessToken,
  bookingController.getRefundInfo,
);

export default router;
