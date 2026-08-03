import type { Request, Response } from 'express-serve-static-core';

import { HttpStatus } from '../../common/constants/http-status';
import { UserRole } from '../../common/enums/userrole-enum';
import type { IEventCreationUseCase } from '../../application/usecases/events/eventcreation/eventcreation.usecase.interface';
import type { IGetEventsUseCase } from '../../application/usecases/events/getEvents/getEvents.usecase.interface';
import type { IEventDetailsUseCase } from '../../application/usecases/events/eventdetails/eventdetails.usecase.interface';
import type { IMyEventsUseCase } from '../../application/usecases/events/myevents/myevents.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import type { IDeleteEventUseCase } from '../../application/usecases/events/deleteevent/deleteevent.usecase.interface';
import type { IUpdateEventUseCase } from '../../application/usecases/events/updatevent/updatevent.usecase.interface';
import type { IStartEventUseCase } from '../../application/usecases/events/startevent/startevent.usecase.interface';
import { sendSuccess } from '../../common/utils/response';
import type { IGetManagerStatsUseCase } from '../../application/usecases/events/managerstats/managerstats.usecase.interface';
import { EventDtoMapper } from '../../common/mappers/event-dto.mapper';

export class EventController {
  constructor(
    private _eventCreationUseCase: IEventCreationUseCase,
    private _getEventsUseCase: IGetEventsUseCase,
    private _eventDetailsUseCase: IEventDetailsUseCase,
    private _myEventsUseCase: IMyEventsUseCase,
    private _updateEventsUseCase: IUpdateEventUseCase,
    private _deleteEventUseCase: IDeleteEventUseCase,
    private _startEventUseCase: IStartEventUseCase,
    private _getManagerStatsUseCase: IGetManagerStatsUseCase,
  ) {}

  eventCreation = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser?.userId;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const dto = EventDtoMapper.fromRequest(req.body);
    const creation = await this._eventCreationUseCase.execute(dto, userId);

    sendSuccess(res, creation, undefined, HttpStatus.CREATED, { creation });
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
      sendSuccess(res, [], undefined, HttpStatus.OK, {
        events: [],
        metadata: { total: 0, page, limit, totalPages: 0 },
      });
      return;
    }

    sendSuccess(res, result.data, undefined, HttpStatus.OK, {
      events: result.data,
      metadata: result.metadata,
    });
  });

  eventDetails = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const events = await this._eventDetailsUseCase.execute(id);
    sendSuccess(res, events, undefined, HttpStatus.OK, { events });
  });

  myEvents = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser?.userId;
    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this._myEventsUseCase.execute(userId, {
      search,
      page,
      limit,
    });
    sendSuccess(res, result?.data || [], undefined, HttpStatus.OK, {
      events: result?.data || [],
      metadata: result?.metadata,
    });
  });

  updateEvents = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const managerId = req.authUser?.userId;
    if (!managerId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const dto = EventDtoMapper.toUpdateDto(req.body);
    const result = await this._updateEventsUseCase.execute(id, managerId, dto);
    sendSuccess(res, result, undefined, HttpStatus.OK, { data: result });
  });

  deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this._deleteEventUseCase.execute(id);
    sendSuccess(res, result);
  });

  getManagerStats = catchAsync(async (req: Request, res: Response) => {
    const managerId = req.authUser?.userId;
    if (!managerId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const stats = await this._getManagerStatsUseCase.execute(managerId);
    sendSuccess(res, undefined, undefined, HttpStatus.OK, { stats });
  });

  startEvent = catchAsync(async (req: Request, res: Response) => {
    const eventId = (req.params.eventId || req.params.id) as string;
    const managerId = req.authUser?.userId;
    if (!managerId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }

    const result = await this._startEventUseCase.execute(eventId, managerId);
    sendSuccess(res, result, 'Event started successfully', HttpStatus.OK, {
      event: result,
    });
  });
}
