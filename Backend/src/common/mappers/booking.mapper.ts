import type mongoose from 'mongoose';
import { Booking } from '../../domain/entities/booking.entity';
import type { BookingStatus } from '../../infrastructure/database/model/booking.model';

export class BookingMapper {
  toDomain(doc: Record<string, unknown>): Booking {
    const userIdStr =
      (doc.userId as mongoose.Types.ObjectId)?.toString() ||
      String(doc.userId || '');
    const eventIdStr =
      (doc.eventId as mongoose.Types.ObjectId)?.toString() ||
      String(doc.eventId || '');
    return new Booking(
      (doc._id as mongoose.Types.ObjectId)?.toString() ||
        (doc.id as string) ||
        null,
      userIdStr,
      eventIdStr,
      (doc.seats as string[]) || [],
      doc.bookingType as 'physical' | 'online',
      Number(doc.totalAmount || 0),
      Number(doc.commissionAmount || 0),
      Number(doc.organizerRevenue || 0),
      doc.status as BookingStatus,
      doc.paymentId as string | undefined,
      doc.qrCodeData as string | undefined,
      (doc.createdAt as Date) || new Date(),
      (doc.updatedAt as Date) || new Date(),
    );
  }

  toPersistence(entity: Booking): Record<string, unknown> {
    return {
      userId: entity.userId,
      eventId: entity.eventId,
      seats: entity.seats,
      bookingType: entity.bookingType,
      totalAmount: entity.totalAmount,
      commissionAmount: entity.commissionAmount,
      organizerRevenue: entity.organizerRevenue,
      status: entity.status,
      paymentId: entity.paymentId,
    };
  }

  toResponse(entity: Booking): Record<string, unknown> {
    return {
      id: entity.id,
      userId: entity.userId,
      eventId: entity.eventId,
      seats: entity.seats,
      bookingType: entity.bookingType,
      totalAmount: entity.totalAmount,
      commissionAmount: entity.commissionAmount,
      organizerRevenue: entity.organizerRevenue,
      status: entity.status,
      paymentId: entity.paymentId,
      qrCodeData: entity.qrCodeData,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

export const bookingMapper = new BookingMapper();
