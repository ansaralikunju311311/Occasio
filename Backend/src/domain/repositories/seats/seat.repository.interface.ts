export interface ISeatRepository {
   lockSeats(
      userId: string,
      eventId: string,
      seatIds: string,
      now: Date,
      lockExpiresAt: Date
   ): Promise<any>;

   releaseSeats(seatIds: string[]): Promise<number>;


     findSeats(
     seatIds: string[],
     eventId: string,
     session?: any
  ): Promise<any[]>;

  markBooked(
    eventId: string,
    seatIds: string[],
    session?: any
  ): Promise<void>;
}