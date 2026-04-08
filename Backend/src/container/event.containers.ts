import { EventCretionUseCase } from '../application/usecases/events/eventcreation/eventcreation.usecase';
import { EventController } from '../presentation/controllers/event.controller';
import { EventRepository } from '../infrastructure/repositories/event/event.repository';
import { GetEventsUseCase } from '../application/usecases/events/getEvents/getevents.usecase';
import { EventDetailsUseCase } from '../application/usecases/events/eventdetails/eventdetails.usecase';
import { MyEventsUseCase } from '../application/usecases/events/myevents/myevents.usecase';
export const MakeEventController = () => {
  const eventRepository = new EventRepository();
  const eventCretionUseCase = new EventCretionUseCase(eventRepository);
  const getEventsUseCase = new GetEventsUseCase(eventRepository);
  const myEventsUseCase = new MyEventsUseCase(eventRepository);

  const eventDetailsUseCase = new EventDetailsUseCase(eventRepository);

  return new EventController(
    eventCretionUseCase,
    getEventsUseCase,
    eventDetailsUseCase,
    myEventsUseCase,
  );
};
