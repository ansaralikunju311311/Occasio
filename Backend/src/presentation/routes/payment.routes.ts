import { Router } from 'express';

import { verifyAccessToken } from '../middlewares/verifyAccessToken.middleware';
import { MakePaymentController } from '../../container/payment.containers';
import { ApiEndpoints } from '../../common/constants/api-endpoints';

const router = Router();
const controller = MakePaymentController();

router.post(
  ApiEndpoints.Payments.Order,
  verifyAccessToken,
  controller.createOrder,
);
router.post(
  ApiEndpoints.Payments.TicketOrder,
  verifyAccessToken,
  controller.createTicketOrder,
);
router.post(
  ApiEndpoints.Payments.Verify,
  verifyAccessToken,
  controller.verifyPayment,
);
router.post(
  ApiEndpoints.Payments.WalletPay,
  verifyAccessToken,
  controller.walletPay,
);
router.get(
  ApiEndpoints.Payments.WalletHistory,
  verifyAccessToken,
  controller.getWalletHistory,
);
router.get(
  ApiEndpoints.Payments.PriceBreakdown,
  verifyAccessToken,
  controller.getPriceBreakdown,
);
router.get(
  ApiEndpoints.Payments.MyBookings,
  verifyAccessToken,
  controller.getMyBookings,
);
router.get(
  ApiEndpoints.Payments.ManagerBookings,
  verifyAccessToken,
  controller.getManagerBookings,
);

router.post(
  ApiEndpoints.Payments.SubscriptionOrder,
  verifyAccessToken,
  controller.createSubscriptionOrder,
);
router.post(
  ApiEndpoints.Payments.VerifySubscription,
  verifyAccessToken,
  controller.verifySubscriptionPayment,
);

export default router;
