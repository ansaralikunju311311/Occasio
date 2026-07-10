import type { Request, Response } from 'express';

import type { ILockSeatsUseCase } from '../../application/usecases/booking/lockseats/lock-seats.usecase.interface';
import type { IMockPaymentUseCase } from '../../application/usecases/booking/mockpayment/mock-payment.usecase.interface';
import type { IConfirmBookingUseCase } from '../../application/usecases/booking/confirmbooking/confirm-booking.interface.usecase';
import type { IFailBookingUseCase } from '../../application/usecases/booking/bookingfailed/fail-booking.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import { HttpStatus } from '../../common/constants/http-status';
import { sendSuccess } from '../../common/utils/response';
import { ICancelBooking } from '../../application/usecases/booking/cancelbooking/cancelbooking.usecase.interface';
import { BookingModel } from '../../infrastructure/database/model/booking.model';
import { calculateRefundPercentage } from '../../common/utils/refund';

export class BookingController {
  constructor(
    private _lockSeatsUseCase: ILockSeatsUseCase,
    private _mockPaymentUseCase: IMockPaymentUseCase,
    private _confirmBookingUseCase: IConfirmBookingUseCase,
    private _failBookingUseCase: IFailBookingUseCase,
    private _cancelBookingUseCase: ICancelBooking,

  ) {}

  lockSeats = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.authUser?.userId;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }
    const { eventId, seatIds } = req.body;

    const result = await this._lockSeatsUseCase.execute(
      userId,
      eventId,
      seatIds,
    );
    sendSuccess(
      res,
      result,
      result.message as string | undefined,
      HttpStatus.OK,
      result,
    );
  });

  createPaymentIntent = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.authUser?.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        return;
      }
      const { eventId, amount } = req.body;

      const result = await this._mockPaymentUseCase.createPaymentIntent(
        userId,
        eventId,
        amount,
      );
      sendSuccess(res, result);
    },
  );

  confirmBooking = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.authUser?.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        return;
      }
      const { eventId, seatIds, paymentId, totalAmount, bookingType } =
        req.body;

      const result = await this._confirmBookingUseCase.execute(
        userId,
        eventId,
        seatIds,
        paymentId,
        totalAmount,
        bookingType,
      );
      sendSuccess(
        res,
        result,
        result.message as string | undefined,
        HttpStatus.OK,
        result,
      );
    },
  );

  failBooking = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.authUser?.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        return;
      }
      const { seatIds } = req.body;

      const result = await this._failBookingUseCase.execute(userId, seatIds);
      sendSuccess(res, result, 'Seats released successfully');
    },
  );
  cancelBooking = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const bookingId = req.params.id as string;
      const userId = req.authUser?.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        return;
      }
      await this._cancelBookingUseCase.execute(bookingId, userId);
      sendSuccess(res, null, 'Booking cancelled successfully');
    }
  );

  getRefundInfo = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const bookingId = req.params.id as string;
      const userId = req.authUser?.userId;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        return;
      }

      const booking = await BookingModel.findById(bookingId).populate('eventId');
      if (!booking) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Booking not found' });
        return;
      }

      if (String(booking.userId) !== String(userId)) {
        res.status(HttpStatus.FORBIDDEN).json({ message: 'Booking does not belong to this user' });
        return;
      }

      const event = booking.eventId as any;
      if (!event) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Associated event not found' });
        return;
      }

      const today = new Date();
      const startTime = new Date(event.startTime);
      const isStarted = today > startTime;

      let refundPercentage = 0;
      let eligible = false;
      let message = '';

      if (isStarted) {
        eligible = false;
        message = 'Cannot cancel booking after the event has started.';
      } else {
        refundPercentage = calculateRefundPercentage(
          event.publishedAt,
          event.startTime,
          today
        );
        if (refundPercentage === 0) {
          eligible = false;
          message = 'Cancellation is not available less than 24 hours before the event starts.';
        } else {
          eligible = true;
          message = 'Eligible for cancellation.';
        }
      }

      const refundAmount = Math.round((booking.totalAmount * refundPercentage) / 100);

      sendSuccess(res, {
        eligible,
        refundPercentage,
        refundAmount,
        totalAmount: booking.totalAmount,
        message
      });
    }
  );
}
