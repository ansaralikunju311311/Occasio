/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PaymentResponseDto } from '../../../application/dtos/responses/payment-response.dto';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';
import type { IPaymentRepository } from '../../../domain/repositories/payment/payment.repository.interface';
import type { IPaymentDocument } from '../../database/model/payment/payment.model';
import { Payment } from '../../../domain/entities/payment.entity';
import { PaymentModel } from '../../database/model/payment/payment.model';
import { BookingModel } from '../../database/model/booking.model';

export class PaymentRepository implements IPaymentRepository {
  async savePayment(payment: Payment): Promise<Payment> {
    const paymentDoc = new PaymentModel({
      userId: payment.userId,
      purpose: payment.purpose,
      eventId: payment.eventId,
      bookingId: payment.bookingId,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      transactionId: payment.transactionId,
      paidAt: payment.paidAt,
    });

    const saved = await paymentDoc.save();
    return this.toEntity(saved);
  }

  async getAllPayments(
    params: PaginationParams,
  ): Promise<PaginatedResponse<PaymentResponseDto>> {
    const { page = 1, limit = 10, purpose } = params;
    const query: any = {};
    if (purpose) {
      query.purpose = purpose;
    }

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      PaymentModel.find(query)
        .populate('userId', 'name email picture') // Assuming user has these fields
        .populate('eventId', 'title') // Assuming event has title
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      PaymentModel.countDocuments(query).exec(),
    ]);

    const mappedData: PaymentResponseDto[] = payments.map((doc: any) => ({
      id: doc._id.toString(),
      userId: {
        id: doc.userId?._id?.toString() ?? '',
        name: doc.userId?.name ?? '',
        email: doc.userId?.email ?? '',
        picture: doc.userId?.picture,
      },
      purpose: doc.purpose,
      amount: doc.amount,
      currency: doc.currency,
      paymentMethod: doc.paymentMethod,
      paymentStatus: doc.paymentStatus,
      transactionId: doc.transactionId,
      eventId: doc.eventId
        ? {
            id: doc.eventId._id.toString(),
            title: doc.eventId.title,
          }
        : undefined,
      bookingId: doc.bookingId?.toString(),
      paidAt: doc.paidAt,
      createdAt: doc.createdAt,
    }));

    return {
      data: mappedData,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private toEntity(doc: IPaymentDocument): Payment {
    return new Payment(
      doc._id?.toString() || null,
      doc.userId.toString(),
      doc.purpose,
      doc.amount,
      doc.currency,
      doc.paymentMethod,
      doc.paymentStatus,
      doc.transactionId,
      doc.eventId?.toString(),
      doc.bookingId?.toString(),
      doc.paidAt,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async getOnlineBookedCount(eventId: string): Promise<number> {
    return await BookingModel.countDocuments({
      eventId,
      bookingType: 'online',
      status: 'CONFIRMED',
    });
  }

  async findPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    const doc = await PaymentModel.findOne({ bookingId, paymentStatus: 'SUCCESS' });
    return doc ? this.toEntity(doc) : null;
  }
}
