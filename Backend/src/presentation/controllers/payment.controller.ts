import { Request, Response } from 'express';
import { ICreateOrderUseCase } from '../../application/usecases/payment/createOrder/createOrder.usecase.interface';
import { IVerifyPaymentUseCase } from '../../application/usecases/payment/verifyPayment/verifyPayment.usecase.interface';

export class PaymentController {
  constructor(
    private createOrderUseCase: ICreateOrderUseCase,
    private verifyPaymentUseCase: IVerifyPaymentUseCase
  ) {}

  createOrder = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const order = await this.createOrderUseCase.execute(eventId, userId);

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

  createTicketOrder = async (req: Request, res: Response) => {
    try {
      const { eventId, amount } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const order = await this.createOrderUseCase.execute(eventId, userId, amount);

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

  verifyPayment = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const result = await this.verifyPaymentUseCase.execute(req.body, userId);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };
}
