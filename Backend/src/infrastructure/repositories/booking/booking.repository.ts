import mongoose from 'mongoose';

import type {
  IBookingRepository,
  RefundInfoResult,
} from '../../../domain/repositories/booking/booking.repository.interface';
import type { Booking } from '../../../domain/entities/booking.entity';
import { BookingModel } from '../../database/model/booking.model';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';
import { EventModel } from '../../database/model/events/event.model';
import type {
  IBookingDocument,
  BookingStatus,
} from '../../database/model/booking.model';
import { bookingMapper } from '../../../common/mappers/booking.mapper';
import { calculateRefundPercentage } from '../../../common/utils/refund';

export class BookingRepository implements IBookingRepository {
  async saveBooking(booking: Booking): Promise<Booking> {
    const bookingDoc = new BookingModel(bookingMapper.toPersistence(booking));

    const saved = await bookingDoc.save();
    return bookingMapper.toDomain(saved as unknown as Record<string, unknown>);
  }

  async findBookingById(id: string): Promise<Booking | null> {
    const doc = await BookingModel.findById(id).populate('eventId');
    return doc
      ? bookingMapper.toDomain(doc as unknown as Record<string, unknown>)
      : null;
  }

  async findBookingByPaymentId(paymentId: string): Promise<Booking | null> {
    const doc = await BookingModel.findOne({ paymentId }).populate('eventId');
    return doc
      ? bookingMapper.toDomain(doc as unknown as Record<string, unknown>)
      : null;
  }

  async updateBookingStatus(
    id: string,
    status: string,
  ): Promise<Booking | null> {
    const updated = await BookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    return updated
      ? bookingMapper.toDomain(updated as unknown as Record<string, unknown>)
      : null;
  }

  async getBookingsByUser(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Booking>> {
    const { page = 1, limit = 10 } = params;
    const query = { userId };
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      BookingModel.find(query)
        .populate('eventId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      BookingModel.countDocuments(query).exec(),
    ]);

    const data = bookings.map((b) =>
      bookingMapper.toDomain(b as unknown as Record<string, unknown>),
    );

    return {
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBookingsByEvent(
    eventId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Booking>> {
    const { page = 1, limit = 10 } = params;
    const query = { eventId };
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      BookingModel.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      BookingModel.countDocuments(query).exec(),
    ]);

    const data = bookings.map((b) =>
      bookingMapper.toDomain(b as unknown as Record<string, unknown>),
    );

    return {
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getManagerBookings(
    managerId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Booking>> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    // Find all events created by this manager
    const managerEvents = await EventModel.find({
      createdBy: managerId,
    }).select('_id');
    const eventIds = managerEvents.map((e) => e._id);

    const query = { eventId: { $in: eventIds } };

    const [bookings, total] = await Promise.all([
      BookingModel.find(query)
        .populate('eventId')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      BookingModel.countDocuments(query).exec(),
    ]);

    const data = bookings.map((b) =>
      bookingMapper.toDomain(b as unknown as Record<string, unknown>),
    );

    return {
      data,
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
  async findConfirmedBookingsByEventId(eventId: string): Promise<Booking[]> {
    const filter: mongoose.FilterQuery<IBookingDocument> = {
      status: {
        $in: [
          'CONFIRMED',
          'confirmed',
          'SUCCESS',
          'success',
          'COMPLETED',
          'completed',
        ] as BookingStatus[],
      },
    };

    if (mongoose.Types.ObjectId.isValid(eventId)) {
      filter.$or = [
        { eventId: eventId as unknown as mongoose.Types.ObjectId },
        { eventId: new mongoose.Types.ObjectId(eventId) },
      ];
    } else {
      filter.eventId = eventId as unknown as mongoose.Types.ObjectId;
    }

    const docs = await BookingModel.find(filter);
    return docs.map((doc) =>
      bookingMapper.toDomain(doc as unknown as Record<string, unknown>),
    );
  }
  async hasBookings(eventId: string): Promise<boolean> {
    const count = await BookingModel.countDocuments({
      eventId,
      status: { $in: ['CONFIRMED', 'PENDING'] },
    });
    return count > 0;
  }

  async getRefundInfo(
    bookingId: string,
    userId: string,
  ): Promise<RefundInfoResult> {
    const booking = await BookingModel.findById(bookingId).populate('eventId');
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (String(booking.userId) !== String(userId)) {
      throw new Error('Booking does not belong to this user');
    }

    const event = booking.eventId as unknown as {
      startTime: Date;
      publishedAt?: Date;
    };
    if (!event) {
      throw new Error('Associated event not found');
    }

    const today = new Date();
    const startTime = new Date(event.startTime);
    const isStarted = today > startTime;

    let refundPercentage = 0;
    let eligible = false;
    let message = '';

    if (isStarted) {
      eligible = false;
      message = 'Cannot cancel booking after the event has started.';
    } else {
      refundPercentage = calculateRefundPercentage(
        event.publishedAt,
        event.startTime,
        today,
      );
      if (refundPercentage === 0) {
        eligible = false;
        message =
          'Cancellation is not available less than 24 hours before the event starts.';
      } else {
        eligible = true;
        message = 'Eligible for cancellation.';
      }
    }

    const refundAmount = Math.round(
      (booking.totalAmount * refundPercentage) / 100,
    );

    return {
      eligible,
      refundPercentage,
      refundAmount,
      totalAmount: booking.totalAmount,
      message,
    };
  }
}
