import { Request, Response } from 'express';
import { ICreateOrderUseCase } from '../../application/usecases/payment/createOrder/createOrder.usecase.interface';
import { IVerifyPaymentUseCase } from '../../application/usecases/payment/verifyPayment/verifyPayment.usecase.interface';
import { IGetBreakdownUseCase } from '../../application/usecases/payment/getBreakdown/getBreakdown.usecase';
import { IBookingRepository } from '../../domain/repositories/booking/booking.repository.interface';

export class PaymentController {
  constructor(
    private createOrderUseCase: ICreateOrderUseCase,
    private verifyPaymentUseCase: IVerifyPaymentUseCase,
    private getBreakdownUseCase: IGetBreakdownUseCase,
    private bookingRepository: IBookingRepository
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
      const { eventId, amount, selectedSeats, bookingType } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const order = await this.createOrderUseCase.execute(
        eventId,
        userId,
        amount,
        bookingType,
        selectedSeats
      );

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

  getPriceBreakdown = async (req: Request, res: Response) => {
    try {
      const eventId = req.query.eventId as string;
      const amount = parseFloat(req.query.amount as string);

      if (!eventId || isNaN(amount)) {
        return res.status(400).json({ message: 'Invalid query parameters' });
      }

      const breakdown = await this.getBreakdownUseCase.execute(eventId, amount);
      return res.status(200).json({ success: true, breakdown });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

  getMyBookings = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).authUser?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.bookingRepository.getBookingsByUser(userId, { page, limit });
      return res.status(200).json({ success: true, ...result });
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
