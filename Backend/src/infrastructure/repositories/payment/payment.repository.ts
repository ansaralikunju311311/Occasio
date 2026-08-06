import type mongoose from 'mongoose';

import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';
import type { IPaymentRepository } from '../../../domain/repositories/payment/payment.repository.interface';
import type { IPaymentDocument } from '../../database/model/payment/payment.model';
import type { Payment } from '../../../domain/entities/payment.entity';
import { PaymentModel } from '../../database/model/payment/payment.model';
import { BookingModel } from '../../database/model/booking.model';
import { paymentMapper } from '../../../common/mappers/payment.mapper';

export class PaymentRepository implements IPaymentRepository {
  async savePayment(payment: Payment): Promise<Payment> {
    const paymentDoc = new PaymentModel(paymentMapper.toPersistence(payment));

    const saved = await paymentDoc.save();
    return paymentMapper.toDomain(
      saved.toObject() as unknown as Record<string, unknown>,
    );
  }

  async getAllPayments(
    params: PaginationParams,
  ): Promise<PaginatedResponse<Payment>> {
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

    const mappedData = payments.map((rawDoc) =>
      paymentMapper.toDomain(
        rawDoc.toObject() as unknown as Record<string, unknown>,
      ),
    );

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
    return doc
      ? paymentMapper.toDomain(
          doc.toObject() as unknown as Record<string, unknown>,
        )
      : null;
  }

  async getWalletHistory(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Payment>> {
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

    const mappedData = payments.map((rawDoc) =>
      paymentMapper.toDomain(
        rawDoc.toObject() as unknown as Record<string, unknown>,
      ),
    );

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
