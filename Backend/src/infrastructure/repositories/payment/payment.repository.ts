import type mongoose from 'mongoose';

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
    const query: mongoose.FilterQuery<IPaymentDocument> = {};
    if (purpose) {
      query.purpose = purpose as IPaymentDocument['purpose'];
    }

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      PaymentModel.find(query)
        .populate('userId', 'name email picture')
        .populate('eventId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      PaymentModel.countDocuments(query).exec(),
    ]);

    const mappedData: PaymentResponseDto[] = payments.map((rawDoc) => {
      const doc = rawDoc as unknown as Record<string, unknown>;
      const u = (doc.userId || {}) as Record<string, unknown>;
      const e = doc.eventId as Record<string, unknown> | undefined;
      return {
        id: (doc._id as mongoose.Types.ObjectId)?.toString() || '',
        userId: {
          id: (u._id as mongoose.Types.ObjectId)?.toString() ?? '',
          name: (u.name as string) ?? '',
          email: (u.email as string) ?? '',
          picture: u.picture as string | undefined,
        },
        purpose: doc.purpose as PaymentResponseDto['purpose'],
        amount: Number(doc.amount || 0),
        currency: (doc.currency as string) || 'INR',
        paymentMethod: doc.paymentMethod as PaymentResponseDto['paymentMethod'],
        paymentStatus: doc.paymentStatus as PaymentResponseDto['paymentStatus'],
        transactionId: doc.transactionId as string,
        eventId: e
          ? {
              id: (e._id as mongoose.Types.ObjectId)?.toString() || '',
              title: (e.title as string) || '',
            }
          : undefined,
        bookingId: (doc.bookingId as mongoose.Types.ObjectId)?.toString(),
        paidAt: doc.paidAt as Date | undefined,
        createdAt: doc.createdAt as Date,
      };
    });

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
    const doc = await PaymentModel.findOne({
      bookingId,
      paymentStatus: 'SUCCESS',
    });
    return doc ? this.toEntity(doc) : null;
  }

  async getWalletHistory(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<PaymentResponseDto>> {
    const query: mongoose.FilterQuery<IPaymentDocument> = {
      userId: userId as unknown as mongoose.Types.ObjectId,
      $or: [{ paymentMethod: 'WALLET' }, { purpose: 'REFUND' }],
    };

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      PaymentModel.find(query)
        .populate('userId', 'name email picture')
        .populate('eventId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      PaymentModel.countDocuments(query).exec(),
    ]);

    const mappedData: PaymentResponseDto[] = payments.map((rawDoc) => {
      const doc = rawDoc as unknown as Record<string, unknown>;
      const u = (doc.userId || {}) as Record<string, unknown>;
      const e = doc.eventId as Record<string, unknown> | undefined;
      return {
        id: (doc._id as mongoose.Types.ObjectId)?.toString() || '',
        userId: {
          id: (u._id as mongoose.Types.ObjectId)?.toString() ?? '',
          name: (u.name as string) ?? '',
          email: (u.email as string) ?? '',
          picture: u.picture as string | undefined,
        },
        purpose: doc.purpose as PaymentResponseDto['purpose'],
        amount: Number(doc.amount || 0),
        currency: (doc.currency as string) || 'INR',
        paymentMethod: doc.paymentMethod as PaymentResponseDto['paymentMethod'],
        paymentStatus: doc.paymentStatus as PaymentResponseDto['paymentStatus'],
        transactionId: doc.transactionId as string,
        eventId: e
          ? {
              id: (e._id as mongoose.Types.ObjectId)?.toString() || '',
              title: (e.title as string) || '',
            }
          : undefined,
        bookingId: (doc.bookingId as mongoose.Types.ObjectId)?.toString(),
        paidAt: doc.paidAt as Date | undefined,
        createdAt: doc.createdAt as Date,
      };
    });

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
}
