import { Request, Response } from 'express';
import { ICreateOrderUseCase } from '../../application/usecases/payment/createOrder/createOrder.usecase.interface';
import { IVerifyPaymentUseCase } from '../../application/usecases/payment/verifyPayment/verifyPayment.usecase.interface';
import { IGetBreakdownUseCase } from '../../application/usecases/payment/getBreakdown/getBreakdown.usecase';
import { IBookingRepository } from '../../domain/repositories/booking/booking.repository.interface';

import { ICreateSubscriptionOrderUseCase } from '../../application/usecases/payment/createSubscriptionOrder/createSubscriptionOrder.usecase.interface';
import { IVerifySubscriptionPaymentUseCase } from '../../application/usecases/payment/verifySubscriptionPayment/verifySubscriptionPayment.usecase.interface';
import { HttpStatus } from '../../common/constants/http-status';
import { IGetMyBookingUseCase } from '../../application/usecases/booking/getMybookings/getmybooking.usecase.interface';
import { IGetManagerBookingUseCase } from '../../application/usecases/booking/getManagerbookings/getmanagerbooking.usecase.interface';

export class PaymentController {
  constructor(
    private _createOrderUseCase: ICreateOrderUseCase,
    private _verifyPaymentUseCase: IVerifyPaymentUseCase,
    private _getBreakdownUseCase: IGetBreakdownUseCase,
    private _createSubscriptionOrderUseCase: ICreateSubscriptionOrderUseCase,
    private _verifySubscriptionPaymentUseCase: IVerifySubscriptionPaymentUseCase,
    private _getMybookingUseCase: IGetMyBookingUseCase,
    private _getManagerBookingUseCase: IGetManagerBookingUseCase
  ) {}

  createSubscriptionOrder = async (req: Request, res: Response) => {
    try {
      const { planId } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const order = await this._createSubscriptionOrderUseCase.execute(userId, planId);

      return res.status(HttpStatus.OK).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
    }
  };

  verifySubscriptionPayment = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const result = await this._verifySubscriptionPaymentUseCase.execute(req.body, userId);

      return res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
    }
  };

  createOrder = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const order = await this._createOrderUseCase.execute(eventId, userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
    }
  };

  createTicketOrder = async (req: Request, res: Response) => {
    try {
      const { eventId, amount, selectedSeats, bookingType } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const order = await this._createOrderUseCase.execute(
        eventId,
        userId,
        amount,
        bookingType,
        selectedSeats
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
    }
  };

  getPriceBreakdown = async (req: Request, res: Response) => {
    try {
      const eventId = req.query.eventId as string;
      const amount = parseFloat(req.query.amount as string);

      if (!eventId || isNaN(amount)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid query parameters' });
      }

      const breakdown = await this._getBreakdownUseCase.execute(eventId, amount);
      return res.status(HttpStatus.OK).json({ success: true, breakdown });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
    }
  };

  getMyBookings = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).authUser?.userId;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._getMybookingUseCase.execute(userId,page,limit)
      return res.status(HttpStatus.OK).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
    }
  };

  getManagerBookings = async (req: Request, res: Response) => {
    try {
      const managerId = (req as any).user?.id || (req as any).authUser?.userId;
      if (!managerId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;


      const result = await this._getManagerBookingUseCase.execute(managerId,page,limit)
      return res.status(HttpStatus.OK).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
    }
  };

  verifyPayment = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const result = await this._verifyPaymentUseCase.execute(req.body, userId);

      return res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
    }
  };
}
