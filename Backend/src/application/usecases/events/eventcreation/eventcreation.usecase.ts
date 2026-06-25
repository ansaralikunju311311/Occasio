import mongoose from 'mongoose';

import { EventStatus } from '../../../../common/enums/eventstatus-enum';
import { Events } from '../../../../domain/entities/event.entity';
import type { IEventRepository } from '../../../../domain/repositories/event/event.repository.interface';
import { eventMapper } from '../../../../common/mappers/event.mapper';
import type { EventDto } from '../../../dtos/event.dto';
import type { EventResponseDto } from '../../../../application/dtos/responses/event-response.dto';
import { getLocationName } from '../../../../common/services/location.service';
import { normalizeCoordinates } from '../../../../common/utils/geo.utils';
import type { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import type { ISubscriptionRepository } from '../../../../domain/repositories/subscription/subscription.repository.interface';
import type { IManagerSubscriptionRepository } from '../../../../domain/repositories/imanager-subscription.repository';
import type { ManagerSubscription } from '../../../../domain/entities/manager-subscription.entity';





import type { IEventCreationUseCase } from './eventcreation.usecase.interface';

export class EventCretionUseCase implements IEventCreationUseCase {
  constructor(
    private _eventRepository: IEventRepository,
    private _userRepository: IUserRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _managerSubscriptionRepository: IManagerSubscriptionRepository,
  ) {}

  async execute(
    data: EventDto,
    userId: string,
  ): Promise<EventResponseDto | null> {
    const user = await this._userRepository.findByIdUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let activeSub: ManagerSubscription | null = null;
    if (user.activeSubscription) {
      activeSub = await this._managerSubscriptionRepository.findById(
        user.activeSubscription,
      );

      if (activeSub) {
        if (
          activeSub.eventLimit !== 0 &&
          activeSub.eventsUsed >= activeSub.eventLimit
        ) {
          throw new Error(
            'Event creation limit reached. Please upgrade your subscription plan.',
          );
        }

        if (activeSub.endDate && new Date() > new Date(activeSub.endDate)) {
          throw new Error(
            'Your subscription plan has expired. Please renew or upgrade.',
          );
        }
      }
    } else {
      // Logic for users without an active subscription
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

        data.location = {
          type: 'Point',
          coordinates: [longitude, latitude],
          address,
        };
      }

      let status = EventStatus.DRAFT;
      if (activeSub && activeSub.plan.toUpperCase() !== 'FREE') {
        status = EventStatus.LIVE;
      }


      let location = data.location;

      if (data.eventType !== 'ONLINE') {
        const { longitude, latitude } = normalizeCoordinates(
          location?.coordinates?.[0] ?? 0,
          location?.coordinates?.[1] ?? 0,
        );

        const conflict = await this._eventRepository.findExactConflict(
          longitude,
          latitude,
          data.startTime,
          data.endTime,
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
        data.startTime,
        data.endTime,
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

      const event = await this._eventRepository.createEvent(
        eventEntity,
        session,
      );

      if (data.eventType !== 'ONLINE') {
        if (!data.layout?.blocks) {
          throw new Error('Seat layout blocks are required');
        }

        const layout = await this._eventRepository.createSeatLayout(
          {
            eventId: event.id,
            blocks: data.layout.blocks,
          },
          session,
        );

        if (!event.id) {
          throw new Error('Event ID not generated');
        }

        await this._eventRepository.updateEventLayout(
          event.id,
          layout._id,
          session,
        );
      }

      user.eventsCreated = (user.eventsCreated || 0) + 1;
      await this._userRepository.updateUser(user, session);

      if (activeSub && activeSub.id) {
        activeSub.eventsUsed = (activeSub.eventsUsed || 0) + 1;
        await this._managerSubscriptionRepository.update(
          activeSub.id,
          { eventsUsed: activeSub.eventsUsed },
          session,
        );
      }

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
