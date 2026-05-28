import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';

const router = Router();
const bookingController = new BookingController();

// Apply auth middleware to all booking routes
router.use(verifyAccessToken); 

router.post('/lock-seats', bookingController.lockSeats);
router.post('/payment-intent', bookingController.createPaymentIntent);
router.post('/confirm', bookingController.confirmBooking);
router.post('/failed', bookingController.failBooking);

export default router;
