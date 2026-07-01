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
import type { IWalletPayUseCase } from '../../application/usecases/payment/walletPay/walletPay.usecase.interface';
import type { IGetWalletHistoryUseCase } from '../../application/usecases/payment/getWalletHistory/getWalletHistory.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import { AppError } from '../../common/errors/apperror';
import { sendSuccess } from '../../common/utils/response';

export class PaymentController {
  constructor(
    private _createOrderUseCase: ICreateOrderUseCase,
    private _verifyPaymentUseCase: IVerifyPaymentUseCase,
    private _getBreakdownUseCase: IGetBreakdownUseCase,
    private _createSubscriptionOrderUseCase: ICreateSubscriptionOrderUseCase,
    private _verifySubscriptionPaymentUseCase: IVerifySubscriptionPaymentUseCase,
    private _getMybookingUseCase: IGetMyBookingUseCase,
    private _getManagerBookingUseCase: IGetManagerBookingUseCase,
    private _walletPayUseCase: IWalletPayUseCase,
    private _getWalletHistoryUseCase: IGetWalletHistoryUseCase,
  ) {}

  walletPay = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { eventId, amount, selectedSeats, bookingType } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const result = await this._walletPayUseCase.execute(
        eventId,
        userId,
        amount,
        bookingType,
        selectedSeats,
      );

      sendSuccess(res, result, 'Tickets booked successfully using wallet balance', HttpStatus.OK, result);
    },
  );

  createSubscriptionOrder = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { planId } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const order = await this._createSubscriptionOrderUseCase.execute(
        userId,
        planId,
      );

      sendSuccess(res, order, undefined, HttpStatus.OK, { order });
    },
  );

  verifySubscriptionPayment = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = (req as any).authUser?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
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
        throw new AppError(
          'Missing required payment fields',
          HttpStatus.BAD_REQUEST,
        );
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

      sendSuccess(res, result, result.message as string, HttpStatus.OK, result);
    },
  );

  createOrder = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { eventId } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const order = await this._createOrderUseCase.execute(eventId, userId);

      sendSuccess(res, order, undefined, HttpStatus.OK, { order });
    },
  );

  createTicketOrder = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { eventId, amount, selectedSeats, bookingType } = req.body;
      const userId = (req as any).user?.id || (req as any).authUser?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const order = await this._createOrderUseCase.execute(
        eventId,
        userId,
        amount,
        bookingType,
        selectedSeats,
      );

      sendSuccess(res, order, undefined, HttpStatus.OK, { order });
    },
  );

  getPriceBreakdown = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const eventId = req.query.eventId as string;
      const amount = parseFloat(req.query.amount as string);

      if (!eventId || isNaN(amount)) {
        throw new AppError('Invalid query parameters', HttpStatus.BAD_REQUEST);
      }

      const breakdown = await this._getBreakdownUseCase.execute(
        eventId,
        amount,
      );
      sendSuccess(res, breakdown, undefined, HttpStatus.OK, { breakdown });
    },
  );

  getMyBookings = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = (req as any).user?.id || (req as any).authUser?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._getMybookingUseCase.execute(
        userId,
        page,
        limit,
      );
      sendSuccess(res, result.data, undefined, HttpStatus.OK, {
        metadata: result.metadata,
      });
    },
  );

  getManagerBookings = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const managerId = (req as any).user?.id || (req as any).authUser?.userId;
      if (!managerId) {
        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._getManagerBookingUseCase.execute(
        managerId,
        page,
        limit,
      );
      sendSuccess(res, result.data, undefined, HttpStatus.OK, {
        metadata: result.metadata,
      });
    },
  );

  verifyPayment = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = (req as any).authUser?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
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
        throw new AppError(
          'Missing required payment fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      const dto: VerifyPaymentDto = {
        razorpay_order_id: razorpay_order_id as string,
        razorpay_payment_id: razorpay_payment_id as string,
        razorpay_signature: razorpay_signature as string,
        eventId: eventId as string,
      };

      const result = await this._verifyPaymentUseCase.execute(dto, userId);

      sendSuccess(res, result, result.message as string, HttpStatus.OK, result);
    },
  );

  getWalletHistory = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = (req as any).user?.id || (req as any).authUser?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._getWalletHistoryUseCase.execute(
        userId,
        page,
        limit,
      );

      sendSuccess(res, result.data, undefined, HttpStatus.OK, {
        metadata: result.metadata,
      });
    },
  );
}
