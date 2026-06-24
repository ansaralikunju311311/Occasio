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
    const creation = await this._eventCreationUseCase.execute(req.body, userId);

    res.status(HttpStatus.OK).json({
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

    const result = await this._updateEventsUseCase.execute(
      id,
      managerId,
      req.body,
    );
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
