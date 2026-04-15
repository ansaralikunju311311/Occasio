import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { Events } from '@/domain/entities/event.entity';
import { IUpdateEventUseCase } from './updatevent.usecase.interface';
import { UpdateEventDTO } from '@/application/dtos/updateevent.dto';
import mongoose from 'mongoose';
import { SeatStatus } from '../../../../common/enums/searstatus-enum';
import { EventType } from '../../../../common/enums/event-type';
import { getLocationName } from '../../../../common/services/location.service';
import { normalizeCoordinates } from '../../../../common/utils/geo.utils';

export class UpdateEventUseCase implements IUpdateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventId: string, managerId: string, data: UpdateEventDTO): Promise<Events | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const event = await this.eventRepository.findByIdEvents(eventId);

      if (!event) {
        await session.abortTransaction();
        session.endSession();
        return null;
      }

      if (new Date(event.startTime) <= new Date()) {
        await session.abortTransaction();
        session.endSession();
        throw new Error('Event has already started and cannot be edited.');
      }

      if (event.createdBy.toString() !== managerId) {
        await session.abortTransaction();
        session.endSession();
        return null;
      }

      const currentEventType = data.eventType || event.eventType;
      const unsetData: any = {};

      if (currentEventType === EventType.ONLINE) {
        unsetData.location = '';
        unsetData.seatLayoutId = '';
        delete data.location;
      } else {
        const address = data.location?.address;
        if (address) {
          const loc = await getLocationName(address);
          if (loc) {
            const { longitude, latitude } = normalizeCoordinates(
              loc.longitude,
              loc.latitude,
            );
            data.location = {
              type: 'Point',
              coordinates: [longitude, latitude],
              address,
            };
          }
        }

        if (currentEventType === EventType.OFFLINE) {
          unsetData.maxOnlineUsers = '';
          delete data.maxOnlineUsers;
        }
      }

      await this.eventRepository.updateEvent(eventId, data, session, unsetData);

      if (currentEventType === EventType.ONLINE) {
        await this.eventRepository.deleteSeatsByEventId(eventId, session);
        await this.eventRepository.deleteLayoutByEventId(eventId, session);

        await this.eventRepository.updateEventLayout(eventId, null, session);
      }

      if (
        currentEventType === EventType.OFFLINE ||
        currentEventType === EventType.HYBRID
      ) {
        if (data.layout) {
          await this.eventRepository.deleteSeatsByEventId(eventId, session);
          await this.eventRepository.deleteLayoutByEventId(eventId, session);

          const layout = await this.eventRepository.createSeatLayout(
            {
              eventId: eventId,
              blocks: data.layout.blocks,
            },
            session,
          );

          const seats: any[] = [];

          for (const block of data.layout.blocks) {
            for (const row of block.rows) {
              const totalColumns = Number(row.columns);

              if (!totalColumns || totalColumns <= 0) {
                console.log("Skipping row due to invalid columns:", row);
                continue;
              }

              for (let c = 1; c <= totalColumns; c++) {
                seats.push({
                  eventId: eventId,
                  layoutId: layout._id,
                  block: block.blockName,
                  row: row.rowNumber,
                  column: c,
                  seatNumber: `${block.blockName}-${row.rowNumber}-${c}`,

                  categoryName: block.category?.name || "General",
                  price: Number(block.category?.price) || 0,

                  status: SeatStatus.AVAILABLE,
                  holdExpiresAt: null,
                });
              }
            }
          }

          // Insert seats
          if (seats.length > 0) {
            await this.eventRepository.createSeats(seats, session);
          }

          // Update event with layout id
          await this.eventRepository.updateEventLayout(
            eventId,
            layout._id,
            session,
          );
        }
      }

      await session.commitTransaction();
      session.endSession();

      return await this.eventRepository.findByIdEvents(eventId);

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}