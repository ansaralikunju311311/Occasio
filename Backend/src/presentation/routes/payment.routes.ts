import { Router } from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
import { MakePaymentController } from '../../container/payment.containers';

const router = Router();
const controller = MakePaymentController();

router.post('/order', verifyAccessToken, controller.createOrder);
router.post('/ticket-order', verifyAccessToken, controller.createTicketOrder);
router.post('/verify', verifyAccessToken, controller.verifyPayment);
router.get('/price-breakdown', verifyAccessToken, controller.getPriceBreakdown);
router.get('/my-bookings', verifyAccessToken, controller.getMyBookings);

export default router;
