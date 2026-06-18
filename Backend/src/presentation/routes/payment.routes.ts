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
router.get('/manager-bookings', verifyAccessToken, controller.getManagerBookings);

router.post('/subscription-order', verifyAccessToken, controller.createSubscriptionOrder);
router.post('/verify-subscription', verifyAccessToken, controller.verifySubscriptionPayment);

export default router;
