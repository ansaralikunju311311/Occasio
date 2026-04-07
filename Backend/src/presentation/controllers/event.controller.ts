import { NextFunction, Request, Response } from "express-serve-static-core";
import { EventCretionUseCase } from "../../application/usecases/events/eventcreation/eventcreation.usecase";
import { HttpStatus } from "../../common/constants/http-status";
import { GetEventsUseCase } from "../../application/usecases/events/getEvents/getevents.usecase";
import { EventDetailsUseCase } from "../../application/usecases/events/eventdetails/eventdetails.usecase";
import { MyEventsUseCase } from "../../application/usecases/events/myevents/myevents.usecase";
import { UserRole } from "../../common/enums/userrole-enum";
export class EventController {

    constructor(
        private eventCreationUseCase: EventCretionUseCase,
        private getEventsUseCase: GetEventsUseCase,
        private eventDetailsUseCase: EventDetailsUseCase,
        private myEventsUseCase : MyEventsUseCase
    ) { }

    async eventCreation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
  const userId = req.authUser!.userId;
            //   const userId = user.userId;
            console.log("Creating event for UserID:", userId);
            console.log("Request Body:", req.body);
            const creation = await this.eventCreationUseCase.execute(req.body, userId)
            res.status(HttpStatus.OK).json({
                creation
            })
            console.log(creation)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
    
    async allEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.authUser;
            const eventType = req.query.eventType as string;

            const events = await this.getEventsUseCase.execute(eventType);

            if (!events) {
                res.status(HttpStatus.OK).json({ events: [] });
                return;
            }

            
            if (user && user.role === UserRole.ADMIN) {
                res.status(HttpStatus.OK).json({ events });
                return;
            }

            const now = new Date();

            const filteredEvents = events.filter((event: any) => {

                return new Date(event.startTime) > now;
            });

            res.status(HttpStatus.OK).json({
                events: filteredEvents
            });

        } catch (error) {
            next(error);
        }
    }
    async eventDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const events = await this.eventDetailsUseCase.execute(id);
            res.status(HttpStatus.OK).json({
                events
            });
        } catch (error) {
            next(error)
        }
    }
     async myEvents(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            

            const userId = req.authUser!.userId;
            const events = await this.myEventsUseCase.execute(userId);
            res.status(HttpStatus.OK).json({
                events
            })
        } catch (error) {
            next(error)
        }
     }


}