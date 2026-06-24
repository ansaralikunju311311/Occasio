/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';

import type { ILockSeatsUseCase } from '../../application/usecases/booking/lockseats/lock-seats.usecase.interface';
import type { IMockPaymentUseCase } from '../../application/usecases/booking/mockpayment/mock-payment.usecase.interface';
import type { IConfirmBookingUseCase } from '../../application/usecases/booking/confirmbooking/confirm-booking.interface.usecase';
import type { IFailBookingUseCase } from '../../application/usecases/booking/bookingfailed/fail-booking.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import { HttpStatus } from '../../common/constants/http-status';

export class BookingController {
  constructor(
    private _lockSeatsUseCase: ILockSeatsUseCase,
    private _mockPaymentUseCase: IMockPaymentUseCase,
    private _confirmBookingUseCase: IConfirmBookingUseCase,
    private _failBookingUseCase: IFailBookingUseCase,
  ) {}

  lockSeats = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { eventId, seatIds } = req.body;
    const userId = (req as any).authUser?.userId;

    const result = await this._lockSeatsUseCase.execute(
      userId,
      eventId,
      seatIds,
    );
    res.status(HttpStatus.OK).json(result);
  });

  createPaymentIntent = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { eventId, amount } = req.body;
      const userId = (req as any).authUser?.userId;

      const result = await this._mockPaymentUseCase.createPaymentIntent(
        userId,
        eventId,
        amount,
      );
      res.status(HttpStatus.OK).json(result);
    },
  );

  confirmBooking = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { eventId, seatIds, paymentId, totalAmount, bookingType } =
        req.body;
      const userId = (req as any).authUser?.userId;

      const result = await this._confirmBookingUseCase.execute(
        userId,
        eventId,
        seatIds,
        paymentId,
        totalAmount,
        bookingType,
      );
      res.status(HttpStatus.OK).json(result);
    },
  );

  failBooking = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { seatIds } = req.body;
      const userId = (req as any).authUser?.userId;

      const result = await this._failBookingUseCase.execute(userId, seatIds);
      res.status(HttpStatus.OK).json(result);
    },
  );
}
