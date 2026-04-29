import { IPaymentRepository } from '../../../domain/repositories/payment/payment.repository.interface';
import { Payment } from '../../../domain/entities/payment.entity';
import { PaymentModel, IPaymentDocument } from '../../database/model/payment/payment.model';

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
