import { Request, Response } from 'express';
import { ILockSeatsUseCase } from '../../application/usecases/booking/lockseats/lock-seats.usecase.interface';
import { IMockPaymentUseCase } from '../../application/usecases/booking/mockpayment/mock-payment.usecase.interface';
import { IConfirmBookingUseCase } from '../../application/usecases/booking/confirmbooking/confirm-booking.interface.usecase';
import { IFailBookingUseCase } from '../../application/usecases/booking/bookingfailed/fail-booking.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import { HttpStatus } from '../../common/constants/http-status';
export class BookingController {
  constructor(  private lockSeatsUseCase: ILockSeatsUseCase,
  private mockPaymentUseCase: IMockPaymentUseCase,
  private confirmBookingUseCase: IConfirmBookingUseCase,
  private failBookingUseCase: IFailBookingUseCase) {}

  lockSeats = catchAsync(async (req: Request, res: Response): Promise<void> => {
    
      const { eventId, seatIds } = req.body;
      const userId = (req as any).authUser?.userId;
      
      const result = await this.lockSeatsUseCase.execute(userId, eventId, seatIds);
      res.status(HttpStatus.OK).json(result);
   
  });

  createPaymentIntent = catchAsync(async (req: Request, res: Response): Promise<void> => {
   
      const { eventId, amount } = req.body;
      const userId = (req as any).authUser?.userId;
      
      const result = await this.mockPaymentUseCase.createPaymentIntent(userId, eventId, amount);
      res.status(HttpStatus.OK).json(result);
    
  });

  confirmBooking = catchAsync(async (req: Request, res: Response): Promise<void> => {
   
      const { eventId, seatIds, paymentId, totalAmount, bookingType } = req.body;
      const userId = (req as any).authUser?.userId;

      const result = await this.confirmBookingUseCase.execute(
        userId, eventId, seatIds, paymentId, totalAmount, bookingType
      );
      res.status(HttpStatus.OK).json(result);
    
  });

  failBooking = catchAsync(async (req: Request, res: Response): Promise<void> => {
    
      const { seatIds } = req.body;
      const userId = (req as any).authUser?.userId;

      const result = await this.failBookingUseCase.execute(userId, seatIds);
      res.status(HttpStatus.OK).json(result);
   
  });
}
