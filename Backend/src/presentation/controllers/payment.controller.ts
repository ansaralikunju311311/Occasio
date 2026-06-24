/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';

import type { ICreateOrderUseCase } from '../../application/usecases/payment/createOrder/createOrder.usecase.interface';
import type { IVerifyPaymentUseCase } from '../../application/usecases/payment/verifyPayment/verifyPayment.usecase.interface';
import type { IGetBreakdownUseCase } from '../../application/usecases/payment/getBreakdown/getBreakdown.usecase';
import type { ICreateSubscriptionOrderUseCase } from '../../application/usecases/payment/createSubscriptionOrder/createSubscriptionOrder.usecase.interface';
import type { IVerifySubscriptionPaymentUseCase } from '../../application/usecases/payment/verifySubscriptionPayment/verifySubscriptionPayment.usecase.interface';
import type { VerifyPaymentDto } from '../../application/dtos/verify-payment.dto';
import type { VerifySubscriptionPaymentDto } from '../../application/dtos/verify-subscription-payment.dto';
import { HttpStatus } from '../../common/constants/http-status';
import type { IGetMyBookingUseCase } from '../../application/usecases/booking/getMybookings/getmybooking.usecase.interface';
import type { IGetManagerBookingUseCase } from '../../application/usecases/booking/getManagerbookings/getmanagerbooking.usecase.interface';

export class PaymentController {
  constructor(
    private _createOrderUseCase: ICreateOrderUseCase,
    private _verifyPaymentUseCase: IVerifyPaymentUseCase,
    private _getBreakdownUseCase: IGetBreakdownUseCase,
    private _createSubscriptionOrderUseCase: ICreateSubscriptionOrderUseCase,
    private _verifySubscriptionPaymentUseCase: IVerifySubscriptionPaymentUseCase,
    private _getMybookingUseCase: IGetMyBookingUseCase,
    private _getManagerBookingUseCase: IGetManagerBookingUseCase,
  ) {}

  createSubscriptionOrder = async (req: Request, res: Response) => {
    try {
      const { planId } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const order = await this._createSubscriptionOrderUseCase.execute(
        userId,
        planId,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  verifySubscriptionPayment = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).authUser?.userId;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId,
      } = req.body;
      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !planId
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Missing required payment fields' });
      }

      const dto: VerifySubscriptionPaymentDto = {
        razorpay_order_id: razorpay_order_id as string,
        razorpay_payment_id: razorpay_payment_id as string,
        razorpay_signature: razorpay_signature as string,
        planId: planId as string,
      };

      const result = await this._verifySubscriptionPaymentUseCase.execute(
        dto,
        userId,
      );

      return res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  createOrder = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const order = await this._createOrderUseCase.execute(eventId, userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  createTicketOrder = async (req: Request, res: Response) => {
    try {
      const { eventId, amount, selectedSeats, bookingType } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const order = await this._createOrderUseCase.execute(
        eventId,
        userId,
        amount,
        bookingType,
        selectedSeats,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  getPriceBreakdown = async (req: Request, res: Response) => {
    try {
      const eventId = req.query.eventId as string;
      const amount = parseFloat(req.query.amount as string);

      if (!eventId || isNaN(amount)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid query parameters' });
      }

      const breakdown = await this._getBreakdownUseCase.execute(
        eventId,
        amount,
      );
      return res.status(HttpStatus.OK).json({ success: true, breakdown });
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  getMyBookings = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).authUser?.userId;
      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._getMybookingUseCase.execute(
        userId,
        page,
        limit,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
        metadata: result.metadata,
      });
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  getManagerBookings = async (req: Request, res: Response) => {
    try {
      const managerId = (req as any).user?.id || (req as any).authUser?.userId;
      if (!managerId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._getManagerBookingUseCase.execute(
        managerId,
        page,
        limit,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
        metadata: result.metadata,
      });
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };

  verifyPayment = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).authUser?.userId;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        eventId,
      } = req.body;
      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !eventId
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Missing required payment fields' });
      }

      const dto: VerifyPaymentDto = {
        razorpay_order_id: razorpay_order_id as string,
        razorpay_payment_id: razorpay_payment_id as string,
        razorpay_signature: razorpay_signature as string,
        eventId: eventId as string,
      };

      const result = await this._verifyPaymentUseCase.execute(dto, userId);

      return res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  };
}
