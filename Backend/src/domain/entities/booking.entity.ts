export class Booking {
  constructor(
    public readonly id: string | null,
    public userId: string,
    public eventId: string,
    public seats: string[],
    public bookingType: 'physical' | 'online',
    public totalAmount: number,
    public commissionAmount: number,
    public organizerRevenue: number,
    public status: string,
    public paymentId?: string,
    public qrCodeData?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
