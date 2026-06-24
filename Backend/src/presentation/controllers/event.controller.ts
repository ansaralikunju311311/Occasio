import type { Request, Response } from 'express-serve-static-core';

import { HttpStatus } from '../../common/constants/http-status';
import { UserRole } from '../../common/enums/userrole-enum';
import type { EventType } from '../../common/enums/event-type';
import type { EventDto } from '../../application/dtos/event.dto';
import type { UpdateEventDTO } from '../../application/dtos/updateevent.dto';
import type { IEventCreationUseCase } from '../../application/usecases/events/eventcreation/eventcreation.usecase.interface';
import type { IGetEventsUseCase } from '../../application/usecases/events/getEvents/getEvents.usecase.interface';
import type { IEventDetailsUseCase } from '../../application/usecases/events/eventdetails/eventdetails.usecase.interface';
import type { IMyEventsUseCase } from '../../application/usecases/events/myevents/myevents.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import type { IDeleteEventUseCase } from '../../application/usecases/events/deleteevent/deleteevent.usecase.interface';
import type { IUpdateEventUseCase } from '../../application/usecases/events/updatevent/updatevent.usecase.interface';

export class EventController {
  constructor(
    private _eventCreationUseCase: IEventCreationUseCase,
    private _getEventsUseCase: IGetEventsUseCase,
    private _eventDetailsUseCase: IEventDetailsUseCase,
    private _myEventsUseCase: IMyEventsUseCase,
    private _updateEventsUseCase: IUpdateEventUseCase,
    private _deleteEventUseCase: IDeleteEventUseCase,
  ) {}

  eventCreation = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser?.userId;
    if (!userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const dto: EventDto = {
      title: req.body.title as string,
      description: req.body.description as string,
      picture: req.body.picture as string,
      eventType: req.body.eventType as EventType,
      startTime: new Date(req.body.startTime as string),
      endTime: new Date(req.body.endTime as string),
      price: Number(req.body.price),
      isSeatLayoutEnabled: Boolean(req.body.isSeatLayoutEnabled),
      maxOnlineUsers:
        req.body.maxOnlineUsers !== undefined &&
        req.body.maxOnlineUsers !== null
          ? Number(req.body.maxOnlineUsers)
          : undefined,
      address: req.body.address as string | undefined,
      layout: req.body.layout,
    };

    const creation = await this._eventCreationUseCase.execute(dto, userId);

    res.status(HttpStatus.CREATED).json({
      creation,
    });
  });

  allEvents = catchAsync(async (req: Request, res: Response) => {
    const user = req.authUser;

    const eventType = req.query.eventType as string;
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const isAdmin = user && user.role === UserRole.ADMIN;
    const result = await this._getEventsUseCase.execute({
      eventType,
      search,
      page,
      limit,
      upcoming: !isAdmin,
    });

    if (!result) {
      return res.status(HttpStatus.OK).json({
        events: [],
        metadata: { total: 0, page, limit, totalPages: 0 },
      });
    }

    res.status(HttpStatus.OK).json({
      events: result.data,
      metadata: result.metadata,
    });
  });

  eventDetails = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const events = await this._eventDetailsUseCase.execute(id);
    res.status(HttpStatus.OK).json({
      events,
    });
  });

  myEvents = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser?.userId;
    if (!userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this._myEventsUseCase.execute(userId, {
      search,
      page,
      limit,
    });
    res.status(HttpStatus.OK).json({
      events: result?.data || [],
      metadata: result?.metadata,
    });
  });

  updateEvents = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const managerId = req.authUser?.userId;
    if (!managerId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const dto: UpdateEventDTO = {};
    if (req.body.title !== undefined) {
      dto.title = req.body.title as string;
    }
    if (req.body.description !== undefined) {
      dto.description = req.body.description as string;
    }
    if (req.body.picture !== undefined) {
      dto.picture = req.body.picture as string;
    }
    if (req.body.eventType !== undefined) {
      dto.eventType = req.body.eventType as EventType;
    }
    if (req.body.startTime !== undefined) {
      dto.startTime = new Date(req.body.startTime as string);
    }
    if (req.body.endTime !== undefined) {
      dto.endTime = new Date(req.body.endTime as string);
    }
    if (req.body.price !== undefined) {
      dto.price = Number(req.body.price);
    }
    if (req.body.maxOnlineUsers !== undefined) {
      dto.maxOnlineUsers = Number(req.body.maxOnlineUsers);
    }
    if (req.body.location !== undefined) {
      dto.location = req.body.location;
    }
    if (req.body.layout !== undefined) {
      dto.layout = req.body.layout;
    }

    const result = await this._updateEventsUseCase.execute(id, managerId, dto);
    res.status(HttpStatus.OK).json({
      data: result,
    });
  });

  deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this._deleteEventUseCase.execute(id);
    res.status(HttpStatus.OK).json({
      success: result,
    });
  });
}
