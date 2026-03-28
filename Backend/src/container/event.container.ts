import { EventCretionUseCase } from "../modules/events/application/usecase/eventcreation.usecase.js"
import { EventController } from "../modules/events/presentation/event.controller.js"
import { EventRepository } from "../modules/events/infrastructure/database/event.repository.js"
import { GetEventsUseCase } from "../modules/events/application/usecase/getEvents.usecase.js"
import { EventDetailsUseCase } from "../modules/events/application/usecase/eventDetails.usecase.js"
export const MakeEventController=()=>{

   const eventRepository = new EventRepository()
   const eventCretionUseCase = new EventCretionUseCase(eventRepository)
   const getEventsUseCase  = new GetEventsUseCase(eventRepository)

   const eventDetailsUseCase  = new EventDetailsUseCase(eventRepository)

    return new EventController(eventCretionUseCase,getEventsUseCase,eventDetailsUseCase)
}