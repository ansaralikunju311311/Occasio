export interface PaymentResponseDto {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
    picture?: string;
  };
  purpose: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  eventId?: {
    id: string;
    title: string;
  };
  bookingId?: string;
  paidAt?: Date;
  createdAt?: Date;
}
