import type { Payment } from '../../domain/entities/payment.entity';
import type { PaymentResponseDto } from '../../application/dtos/responses/payment-response.dto';
import { BaseMapper } from './base.mapper';

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
}

export const paymentMapper = new PaymentMapper();
