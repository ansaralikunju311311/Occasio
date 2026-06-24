import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
import { makebookingController } from '../../container/booking.containers';
const router = Router();
const bookingController =  makebookingController();

// Apply auth middleware to all booking routes
router.use(verifyAccessToken); 

router.post('/lock-seats', bookingController.lockSeats);
router.post('/payment-intent', bookingController.createPaymentIntent);
router.post('/confirm', bookingController.confirmBooking);
router.post('/failed', bookingController.failBooking);

export default router;
