import { EventCretionUseCase } from "../modules/events/application/usecase/eventcreation.usecase.js"
import { EventController } from "../modules/events/presentation/event.controller.js"
import { EventRepository } from "../modules/events/infrastructure/database/event.repository.js"
export const MakeEventController=()=>{

   const eventRepository = new EventRepository()
   const eventCretionUseCase = new EventCretionUseCase(eventRepository)

    return new EventController(eventCretionUseCase)
}