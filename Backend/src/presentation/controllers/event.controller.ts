import { Request, Response } from 'express-serve-static-core';
import { HttpStatus } from '../../common/constants/http-status';
import { UserRole } from '../../common/enums/userrole-enum';
import { IEventCreationUseCase } from '@/application/usecases/events/eventcreation/eventcreation.usecase.interface';
import { IGetEventsUseCase } from '@/application/usecases/events/getEvents/getEvents.usecase.interface';
import { IEventDetailsUseCase } from '@/application/usecases/events/eventdetails/eventdetails.usecase.interface';
import { IMyEventsUseCase } from '@/application/usecases/events/myevents/myevents.usecase.interface';
import { catchAsync } from '@/common/utils/catchAsync';

export class EventController {
  constructor(
    private eventCreationUseCase: IEventCreationUseCase,
    private getEventsUseCase: IGetEventsUseCase,
    private eventDetailsUseCase: IEventDetailsUseCase,
    private myEventsUseCase: IMyEventsUseCase,
  ) {}

  eventCreation = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;
    const creation = await this.eventCreationUseCase.execute(req.body, userId);
    
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

    const result = await this.getEventsUseCase.execute({ eventType, search, page, limit });

    if (!result) {
      return res.status(HttpStatus.OK).json({ events: [], metadata: { total: 0, page, limit, totalPages: 0 } });
    }

    let events = result.data;

    if (user && user.role === UserRole.ADMIN) {
      return res.status(HttpStatus.OK).json({
        events,
        metadata: result.metadata,
      });
    }

    const now = new Date();
    const filteredEvents = events.filter((event: any) => {
      return new Date(event.startTime) > now;
    });

    res.status(HttpStatus.OK).json({
      events: filteredEvents,
      metadata: result.metadata,
    });
  });

  eventDetails = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const events = await this.eventDetailsUseCase.execute(id);
    res.status(HttpStatus.OK).json({
      events,
    });
  });

  myEvents = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.myEventsUseCase.execute(userId, { search, page, limit });
    res.status(HttpStatus.OK).json({
      events: result?.data || [],
      metadata: result?.metadata,
    });
  });
}
