import type mongoose from 'mongoose';

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

    const mappedData = payments.map((rawDoc) => this.toEntity(rawDoc));

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
    const raw = doc as any;
    
    let userId = '';
    let userDetails: any = undefined;
    if (raw.userId) {
      if (typeof raw.userId === 'object' && raw.userId._id) {
        userId = raw.userId._id.toString();
        userDetails = {
          name: raw.userId.name || '',
          email: raw.userId.email || '',
          picture: raw.userId.picture,
        };
      } else {
        userId = raw.userId.toString();
      }
    }

    let eventId: string | undefined = undefined;
    let eventDetails: any = undefined;
    if (raw.eventId) {
      if (typeof raw.eventId === 'object' && raw.eventId._id) {
        eventId = raw.eventId._id.toString();
        eventDetails = {
          title: raw.eventId.title || '',
        };
      } else {
        eventId = raw.eventId.toString();
      }
    }

    return new Payment(
      raw._id?.toString() || null,
      userId,
      raw.purpose,
      raw.amount,
      raw.currency,
      raw.paymentMethod,
      raw.paymentStatus,
      raw.transactionId,
      eventId,
      raw.bookingId?.toString(),
      raw.paidAt,
      raw.createdAt,
      raw.updatedAt,
      userDetails,
      eventDetails,
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

    const mappedData = payments.map((rawDoc) => this.toEntity(rawDoc));

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
