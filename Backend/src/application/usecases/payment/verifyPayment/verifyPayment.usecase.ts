import { IVerifyPaymentUseCase } from './verifyPayment.usecase.interface';
import { IPaymentGateway } from '../../../../domain/services/payment-gateway.interface';
import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { IPaymentRepository } from '../../../../domain/repositories/payment/payment.repository.interface';
import { IBookingRepository } from '../../../../domain/repositories/booking/booking.repository.interface';
import { Payment } from '../../../../domain/entities/payment.entity';
import { PaymentPurpose } from '../../../../common/enums/payment-purpose.enum';
import { PaymentStatus } from '../../../../common/enums/payment-status.enum';
import { PaymentMethod } from '../../../../common/enums/payment-method.enum';
import { BookingStatus } from '../../../../infrastructure/database/model/booking.model';
import { SeatModel } from '../../../../infrastructure/database/model/events/seat.model';
import { SeatStatus } from '../../../../common/enums/searstatus-enum';

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    private _paymentGateway: IPaymentGateway,
    private _eventRepository: IEventRepository,
    private _paymentRepository: IPaymentRepository,
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(
    data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      eventId: string;
    },
    userId: string
  ): Promise<any> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId } = data;

    // 1. Verify Razorpay Signature
    const isValid = this._paymentGateway.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      throw new Error('Invalid payment signature');
    }

    // 2. Check if a pending booking exists for this order
    const booking = await this._bookingRepository.findBookingByPaymentId(razorpay_order_id);

    if (booking) {
      // TICKET BOOKING FLOW
      // Update booking to SUCCESS
      await this._bookingRepository.updateBookingStatus(booking.id!, BookingStatus.CONFIRMED);

      // If physical booking, update/insert seat statuses to BOOKED in DB
      if (booking.bookingType === 'physical' && booking.seats && booking.seats.length > 0) {
        const event = await this._eventRepository.findByIdEvents(booking.eventId);
        const layoutId = event?.seatLayoutId;
        const layout = event?.SeatLayout;

        for (const seatStr of booking.seats) {
          const parts = seatStr.split('-');
          const block = parts[0] || 'Unknown';
          const row = parseInt(parts[1]) || 1;
          const column = parseInt(parts[2]) || 1;

          let price = event?.price || 0;
          let categoryName = 'General';

          if (layout && layout.blocks) {
            const blockDetails = layout.blocks.find(
              (b: any) => b.blockName.trim().toUpperCase() === block.trim().toUpperCase()
            );
            if (blockDetails) {
              price = blockDetails.category?.price ?? price;
              categoryName = blockDetails.category?.name ?? categoryName;
            }
          }

          // Upsert Seat document as BOOKED
          await SeatModel.findOneAndUpdate(
            { eventId: booking.eventId, seatNumber: seatStr },
            {
              eventId: booking.eventId,
              layoutId: layoutId,
              block,
              row,
              column,
              seatNumber: seatStr,
              price,
              categoryName,
              status: SeatStatus.BOOKED,
            },
            { upsert: true, new: true }
          );
        }
      }

      // Save payment details with Booking reference
      const payment = new Payment(
        null,
        userId,
        PaymentPurpose.BOOKING,
        booking.totalAmount,
        'INR',
        PaymentMethod.RAZORPAY,
        PaymentStatus.SUCCESS,
        razorpay_payment_id,
        eventId,
        booking.id!,
        new Date(),
        undefined,
        undefined
      );

      await this._paymentRepository.savePayment(payment);

      return {
        success: true,
        message: 'Tickets booked successfully',
        bookingId: booking.id,
      };
    } else {
      // EVENT PUBLISHING FLOW
      // Update event to LIVE
      await this._eventRepository.publishEvent(eventId);

      // Save payment details
      const payment = new Payment(
        null,
        userId,
        PaymentPurpose.EVENT_PUBLISH,
        99, // default fixed price for publishing an event
        'INR',
        PaymentMethod.RAZORPAY,
        PaymentStatus.SUCCESS,
        razorpay_payment_id,
        eventId,
        undefined,
        new Date(),
        undefined,
        undefined
      );

      await this._paymentRepository.savePayment(payment);

      return {
        success: true,
        message: 'Payment verified and event published successfully',
      };
    }
  }
}
