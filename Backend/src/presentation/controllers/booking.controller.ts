import type { Request, Response } from 'express';

import type { ILockSeatsUseCase } from '../../application/usecases/booking/lockseats/lock-seats.usecase.interface';
import type { IMockPaymentUseCase } from '../../application/usecases/booking/mockpayment/mock-payment.usecase.interface';
import type { IConfirmBookingUseCase } from '../../application/usecases/booking/confirmbooking/confirm-booking.interface.usecase';
import type { IFailBookingUseCase } from '../../application/usecases/booking/bookingfailed/fail-booking.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import { HttpStatus } from '../../common/constants/http-status';
import { sendSuccess } from '../../common/utils/response';

export class BookingController {
  constructor(
    private _lockSeatsUseCase: ILockSeatsUseCase,
    private _mockPaymentUseCase: IMockPaymentUseCase,
    private _confirmBookingUseCase: IConfirmBookingUseCase,
    private _failBookingUseCase: IFailBookingUseCase,
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
}
