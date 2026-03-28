import { NextFunction, Request, Response } from "express-serve-static-core";
import { EventCretionUseCase } from "../application/usecase/eventcreation.usecase.js";
import { HttpStatus } from "../../../common/constants/http-stattus.js";
import { GetEventsUseCase } from "../application/usecase/getEvents.usecase.js";
import { EventDetailsUseCase } from "../application/usecase/eventDetails.usecase.js";
export class EventController {

    constructor(
        private eventCreationUseCase: EventCretionUseCase,
        private getEventsUseCase: GetEventsUseCase,
        private eventDetailsUseCase: EventDetailsUseCase
    ) { }

    async eventCreation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = (req as any).user;
            const userId = user.userId;
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
            const events = await this.getEventsUseCase.execute();
            res.status(HttpStatus.OK).json({
                events
            })
        } catch (error) {

            next(error)
        }
    }
    async eventDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id } = req.params;
            const events = await this.eventDetailsUseCase.execute(id);
            res.status(HttpStatus.OK).json({
                events
            });
        } catch (error) {
            next(error)
        }
    }



}