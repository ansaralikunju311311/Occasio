export class Payment {
  constructor(
    public readonly id: string | null,
    public userId: string,
    public purpose: 'EVENT_PUBLISH' | 'BOOKING' | 'SUBSCRIPTION',
    public amount: number,
    public currency: string,
    public paymentMethod: string,
    public paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED',
    public transactionId: string,
    public eventId?: string,
    public bookingId?: string,
    public paidAt?: Date,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
