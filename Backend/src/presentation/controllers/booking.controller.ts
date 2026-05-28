import { Request, Response } from 'express';
import { LockSeatsUseCase } from '../../application/usecases/booking/lock-seats.usecase';
import { MockPaymentUseCase } from '../../application/usecases/booking/mock-payment.usecase';
import { ConfirmBookingUseCase } from '../../application/usecases/booking/confirm-booking.usecase';
import { FailBookingUseCase } from '../../application/usecases/booking/fail-booking.usecase';

export class BookingController {
  private lockSeatsUseCase: LockSeatsUseCase;
  private mockPaymentUseCase: MockPaymentUseCase;
  private confirmBookingUseCase: ConfirmBookingUseCase;
  private failBookingUseCase: FailBookingUseCase;

  constructor() {
    this.lockSeatsUseCase = new LockSeatsUseCase();
    this.mockPaymentUseCase = new MockPaymentUseCase();
    this.confirmBookingUseCase = new ConfirmBookingUseCase();
    this.failBookingUseCase = new FailBookingUseCase();
  }

  lockSeats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { eventId, seatIds } = req.body;
      const userId = (req as any).authUser?.userId;
      
      const result = await this.lockSeatsUseCase.execute(userId, eventId, seatIds);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { eventId, amount } = req.body;
      const userId = (req as any).authUser?.userId;
      
      const result = await this.mockPaymentUseCase.createPaymentIntent(userId, eventId, amount);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  confirmBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { eventId, seatIds, paymentId, totalAmount, bookingType } = req.body;
      const userId = (req as any).authUser?.userId;

      const result = await this.confirmBookingUseCase.execute(
        userId, eventId, seatIds, paymentId, totalAmount, bookingType
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  failBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { seatIds } = req.body;
      const userId = (req as any).authUser?.userId;

      const result = await this.failBookingUseCase.execute(userId, seatIds);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
