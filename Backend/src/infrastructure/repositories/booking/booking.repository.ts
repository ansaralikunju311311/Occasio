/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IBookingRepository } from '../../../domain/repositories/booking/booking.repository.interface';
import { Booking } from '../../../domain/entities/booking.entity';
import { BookingModel } from '../../database/model/booking.model';
import type {
  PaginationParams,
  PaginatedResponse,
} from '../../../common/interfaces/pagination.interface';

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
    const EventModel =
      require('../../database/model/events/event.model').EventModel;
    const managerEvents = await EventModel.find({
      createdBy: managerId,
    }).select('_id');
    const eventIds = managerEvents.map((e: any) => e._id);

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

  private toEntity(doc: any): Booking {
    return new Booking(
      doc._id?.toString() || null,
      doc.userId,
      doc.eventId,
      doc.seats,
      doc.bookingType,
      doc.totalAmount,
      doc.commissionAmount,
      doc.organizerRevenue,
      doc.status,
      doc.paymentId,
      doc.qrCodeData,
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
}
