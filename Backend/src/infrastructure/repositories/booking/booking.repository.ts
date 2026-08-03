import mongoose from 'mongoose';
import type { IBookingRepository } from '../../../domain/repositories/booking/booking.repository.interface';
import { Booking } from '../../../domain/entities/booking.entity';
import { BookingModel, BookingStatus } from '../../database/model/booking.model';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';

import { EventModel } from '../../database/model/events/event.model';
import type { IBookingDocument } from '../../database/model/booking.model';

export class BookingRepository implements IBookingRepository {
  async saveBooking(booking: Booking): Promise<Booking> {
    const bookingDoc = new BookingModel({
      userId: booking.userId,
      eventId: booking.eventId,
      seats: booking.seats,
      bookingType: booking.bookingType,
      totalAmount: booking.totalAmount,
      commissionAmount: booking.commissionAmount,
      organizerRevenue: booking.organizerRevenue,
      status: booking.status,
      paymentId: booking.paymentId,
    });

    const saved = await bookingDoc.save();
    return this.toEntity(saved);
  }

  async findBookingById(id: string): Promise<Booking | null> {
    const doc = await BookingModel.findById(id).populate('eventId');
    return doc ? this.toEntity(doc) : null;
  }

  async findBookingByPaymentId(paymentId: string): Promise<Booking | null> {
    const doc = await BookingModel.findOne({ paymentId }).populate('eventId');
    return doc ? this.toEntity(doc) : null;
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
    return updated ? this.toEntity(updated) : null;
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

    const data = bookings.map((b) => this.toEntity(b));

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

    const data = bookings.map((b) => this.toEntity(b));

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

    const data = bookings.map((b) => this.toEntity(b));

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

  private toEntity(doc: IBookingDocument | mongoose.HydratedDocument<IBookingDocument> | Record<string, unknown>): Booking {
    const d = doc as Record<string, unknown>;
    const userIdStr = (d.userId as mongoose.Types.ObjectId)?.toString() || String(d.userId || '');
    const eventIdStr = (d.eventId as mongoose.Types.ObjectId)?.toString() || String(d.eventId || '');
    return new Booking(
      (d._id as mongoose.Types.ObjectId)?.toString() || (d.id as string) || null,
      userIdStr,
      eventIdStr,
      (d.seats as string[]) || [],
      d.bookingType as 'physical' | 'online',
      Number(d.totalAmount || 0),
      Number(d.commissionAmount || 0),
      Number(d.organizerRevenue || 0),
      d.status as BookingStatus,
      d.paymentId as string | undefined,
      d.qrCodeData as string | undefined,
      (d.createdAt as Date) || new Date(),
      (d.updatedAt as Date) || new Date(),
    );
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
      status: { $in: ['CONFIRMED', 'confirmed', 'SUCCESS', 'success', 'COMPLETED', 'completed'] as BookingStatus[] },
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
    return docs.map((doc) => this.toEntity(doc));
  }
  async hasBookings(eventId: string): Promise<boolean> {
    const count = await BookingModel.countDocuments({
      eventId,
      status: { $in: ['CONFIRMED', 'PENDING'] },
    });
    return count > 0;
  }
}
