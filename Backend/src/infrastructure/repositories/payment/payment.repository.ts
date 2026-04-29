import { IPaymentRepository } from '../../../domain/repositories/payment/payment.repository.interface';
import { Payment } from '../../../domain/entities/payment.entity';
import { PaymentModel, IPaymentDocument } from '../../database/model/payment/payment.model';
import { PaginationParams, PaginatedResponse } from '../../../common/interfaces/pagination.interface';

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

  async getAllPayments(params: PaginationParams): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10 } = params;
    const query: any = {};

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

    return {
      data: payments,
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
      doc.updatedAt
    );
  }
}
