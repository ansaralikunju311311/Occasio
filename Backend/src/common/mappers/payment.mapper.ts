import type { PaymentPurpose } from '../enums/payment-purpose.enum';
import type { PaymentStatus } from '../enums/payment-status.enum';
import type { PaymentMethod } from '../enums/payment-method.enum';
import { Payment } from '../../domain/entities/payment.entity';
import type { PaymentResponseDto } from '../../application/dtos/responses/payment-response.dto';
import { BaseMapper } from './base.mapper';

interface PopulatedUser {
  _id: { toString(): string } | string;
  name?: string;
  email?: string;
  picture?: string;
}

interface PopulatedEvent {
  _id: { toString(): string } | string;
  title?: string;
}

export class PaymentMapper extends BaseMapper<Payment, PaymentResponseDto> {
  toResponse(entity: Payment): PaymentResponseDto {
    return {
      id: entity.id ?? '',
      userId: {
        id: entity.userId,
        name: entity.userDetails?.name ?? '',
        email: entity.userDetails?.email ?? '',
        picture: entity.userDetails?.picture,
      },
      purpose: entity.purpose as PaymentResponseDto['purpose'],
      amount: entity.amount,
      currency: entity.currency,
      paymentMethod: entity.paymentMethod as PaymentResponseDto['paymentMethod'],
      paymentStatus: entity.paymentStatus as PaymentResponseDto['paymentStatus'],
      transactionId: entity.transactionId,
      eventId: entity.eventId && entity.eventDetails
        ? {
            id: entity.eventId,
            title: entity.eventDetails.title,
          }
        : undefined,
      bookingId: entity.bookingId,
      paidAt: entity.paidAt,
      createdAt: entity.createdAt,
    };
  }

  toDomain(doc: Record<string, unknown>): Payment {
    let userId = '';
    let userDetails: { name: string; email: string; picture?: string } | undefined = undefined;
    
    if (doc.userId) {
      const rawUser = doc.userId as PopulatedUser;
      if (typeof rawUser === 'object' && rawUser._id) {
        userId = rawUser._id.toString();
        userDetails = {
          name: rawUser.name || '',
          email: rawUser.email || '',
          picture: rawUser.picture,
        };
      } else {
        userId = doc.userId?.toString() || '';
      }
    }

    let eventId: string | undefined = undefined;
    let eventDetails: { title: string } | undefined = undefined;
    
    if (doc.eventId) {
      const rawEvent = doc.eventId as PopulatedEvent;
      if (typeof rawEvent === 'object' && rawEvent._id) {
        eventId = rawEvent._id.toString();
        eventDetails = {
          title: rawEvent.title || '',
        };
      } else {
        eventId = doc.eventId?.toString();
      }
    }

    return new Payment(
      (doc._id as { toString(): string })?.toString() || null,
      userId,
      doc.purpose as PaymentPurpose,
      doc.amount as number,
      doc.currency as string,
      doc.paymentMethod as PaymentMethod | string,
      doc.paymentStatus as PaymentStatus,
      doc.transactionId as string,
      eventId,
      (doc.bookingId as { toString(): string })?.toString(),
      doc.paidAt as Date,
      doc.createdAt as Date,
      doc.updatedAt as Date,
      userDetails,
      eventDetails,
    );
  }

  toPersistence(entity: Payment): Record<string, unknown> {
    return {
      userId: entity.userId,
      purpose: entity.purpose,
      eventId: entity.eventId,
      bookingId: entity.bookingId,
      amount: entity.amount,
      currency: entity.currency,
      paymentMethod: entity.paymentMethod,
      paymentStatus: entity.paymentStatus,
      transactionId: entity.transactionId,
      paidAt: entity.paidAt,
    };
  }
}

export const paymentMapper = new PaymentMapper();
