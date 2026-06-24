import { EventStatus } from "../../../../common/enums/eventstatus-enum";
import { IEventRepository } from "../../../../domain/repositories/event/event.repository.interface";
import { ISeatRepository } from "../../../../domain/repositories/seats/seat.repository.interface"
import { ILockSeatsUseCase } from "./lock-seats.usecase.interface";
export class LockSeatsUseCase implements ILockSeatsUseCase {
  constructor(
    private _eventRepository: IEventRepository,
    private _seatRepository: ISeatRepository
  ) {}

  async execute(userId: string, eventId: string, seatIds: string[]) {
    const event = await this._eventRepository.findByIdEvents(eventId);

    if (!event) throw new Error("Event not found");

    if (event.status === EventStatus.CANCELED) {
      throw new Error("Event is cancelled");
    }

    if (event.createdBy.toString() === userId) {
      throw new Error("Event manager cannot book their own event");
    }

    if (seatIds.length > 5) {
      throw new Error("Maximum 5 seats allowed");
    }

    const now = new Date();
    const lockExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);

    const lockedSeats: any[] = [];

    try {
      for (const seatNumber of seatIds) {
        const updatedSeat = await this._seatRepository.lockSeats(
          userId,
          eventId,
          seatNumber,
          now,
          lockExpiresAt
        );

        if (!updatedSeat) {
          throw new Error(
            `Seat ${seatNumber} already locked/booked`
          );
        }

        lockedSeats.push(updatedSeat);
      }
    } catch (error) {
      await this._seatRepository.releaseSeats(
        lockedSeats.map((seat) => seat._id)
      );
      throw error;
    }

    return {
      message: "Seats locked successfully",
      lockedSeats,
    };
  }
}