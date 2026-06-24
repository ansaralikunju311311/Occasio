import type { PaymentPurpose } from '../../common/enums/payment-purpose.enum';
import type { PaymentStatus } from '../../common/enums/payment-status.enum';
import type { PaymentMethod } from '../../common/enums/payment-method.enum';

export class Payment {
  constructor(
    public readonly id: string | null,
    public userId: string,
    public purpose: PaymentPurpose,
    public amount: number,
    public currency: string,
    public paymentMethod: PaymentMethod | string,
    public paymentStatus: PaymentStatus,
    public transactionId: string,
    public eventId?: string,
    public bookingId?: string,
    public paidAt?: Date,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
