export interface ICancelBooking {
  execute(bookingId: string, userId: string): Promise<void>;
}
