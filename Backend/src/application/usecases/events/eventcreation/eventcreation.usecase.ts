import { EventStatus } from '../../../../common/enums/eventstatus-enum';
import { Events } from '../../../../domain/entities/event.entity';
import { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { eventMapper } from '../../../../common/mappers/event.mapper';
import { EventDto } from '../../../dtos/event.dto';
import { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';
import { getLocationName } from '../../../../common/services/location.service';
import { normalizeCoordinates } from '../../../../common/utils/geo.utils';
import { SeatStatus } from '../../../../common/enums/searstatus-enum';
import mongoose from 'mongoose';
import { IEventCreationUseCase } from './eventcreation.usecase.interface';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';

export class EventCretionUseCase implements IEventCreationUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(
    data: EventDto,
    userId: string,
  ): Promise<EventResponseDto | null> {
    const user = await this.userRepository.findByIdUser(userId);
    console.log("user details i am showing the time of creation",user)
    if (!user) {
      throw new Error('User not found');
    }

    if (user.activeSubscription) {
      const plan = await this.subscriptionRepository.findPlanById(user.activeSubscription);

      console.log("the event creator have plan", plan)
      if (plan && plan.eventLimit !== 0 && user.eventsCreated >= plan.eventLimit) {
        throw new Error('Event creation limit reached. Please upgrade your subscription plan.');
      }
    } else {
      // Default free plan usually has limit 0 or something. We assume no subscription means 0 limit unless it's handled differently.
      // Let's assume without subscription they can't create, or limit is 1?
      // For now we just enforce it if they have a plan.
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (data.eventType !== 'ONLINE') {
        const { address } = data;

        if (!address) {
          throw new Error('Location address required');
        }
        const loc = await getLocationName(address);
        if (!loc) {
          throw new Error(
            'Could not find coordinates for the provided address',
          );
        }
        const { longitude, latitude } = loc;

        console.log(
          'location',
          data.location,
          'longitude',
          longitude,
          'latitude',
          latitude,
        );

        data.location = {
          type: 'Point',
          coordinates: [longitude, latitude],
          address,
        };
      }

      console.log('thehhehe location', data.location);

      const status = EventStatus.DRAFT;

      console.log('sample', status);

      const { startTime, endTime } = data;
      let location = data.location;

      if (data.eventType !== 'ONLINE') {
        const { longitude, latitude } = normalizeCoordinates(
          location?.coordinates?.[0] ?? 0,
          location?.coordinates?.[1] ?? 0,
        );

        const conflict = await this.eventRepository.findExactConflict(
          longitude,
          latitude,
          new Date(startTime),
          new Date(endTime),
        );

        if (conflict) {
          throw new Error('Duplicate Event at same location and time');
        }

        if (data.location) {
          data.location.coordinates = [longitude, latitude];
        }
      } else {
        data.location = undefined;
      }

      const eventEntity = new Events(
        null,
        data.title,
        data.description,
        data.eventType,
        new Date(data.startTime),
        new Date(data.endTime),
        data.location || undefined,
        data.maxOnlineUsers,
        data.price,
        userId,
        status,
        data.picture,
        undefined, // creatorDetails
        '', // seatLayoutId
        undefined, // SeatLayout
        undefined, // seats
      );

      const event = await this.eventRepository.createEvent(
        eventEntity,
        session,
      );

      if (data.eventType !== 'ONLINE') {
        if (!data.layout?.blocks) {
          throw new Error('Seat layout blocks are required');
        }

        const layout = await this.eventRepository.createSeatLayout(
          {
            eventId: event.id,
            blocks: data.layout.blocks,
          },
          session,
        );

      
        
        if (!event.id) {
          throw new Error('Event ID not generated');
        }

        await this.eventRepository.updateEventLayout(
          event.id,
          layout._id,
          session,
        );
      }

      user.eventsCreated = (user.eventsCreated || 0) + 1;
      await this.userRepository.updateUser(user);

      await session.commitTransaction();
      session.endSession();
      return event ? eventMapper.toResponse(event) : null;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
