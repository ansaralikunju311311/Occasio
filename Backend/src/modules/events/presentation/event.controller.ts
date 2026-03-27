import { NextFunction,Request,Response } from "express-serve-static-core";
import { EventCretionUseCase } from "../application/usecase/eventcreation.usecase.js";
import { HttpStatus } from "../../../common/constants/http-stattus.js";

export class EventController{

      constructor(
           private eventCreationUseCase:EventCretionUseCase
      ){}

    async eventCreation(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const user = (req as any).user;
            const userId = user.userId;
            console.log("Creating event for UserID:", userId);
            console.log("Request Body:", req.body);

            // const {bannerUrl,description,endTime,eventType,isSeatLayoutEnabled,latitude,location,maxOnlineUsers,price,startTime,title} = req.body;
               
// banner: FileList {0: File, length: 1}
// bannerUrl: "https://res.cloudinary.com/dliraelbo/image/upload/v1774612840/id2iexgjelkqn96z1nda.png"
// description:"wergtyhujklk;kjhtryhteh4yhwergtyhujklk;kjhtryhteh4yhwergtyhujklk;kjhtryhteh4yhwergtyhujklk;kjhtryhteh4yhwergtyhujklk;kjhtryhteh4yhv"
// endTime: Fri Apr 03 2026 17:30:00 GMT+0530 (India Standard Time) {}
// eventType: "ONLINE"
// isSeatLayoutEnabled: false
// latitude: 0
// location: null
// longitude: 0
// maxOnlineUsers: 198
// price: 100
// startTime: Fri Mar 27 2026 19:30:00 GMT+0530 (India Standard Time) {}
// title: "Music"

            // const creation = await this.eventCreationUseCase.execute({userId,bannerUrl,description,endTime,eventType,isSeatLayoutEnabled,latitude,location,maxOnlineUsers,price,startTime,title})
    const creation = await this.eventCreationUseCase.execute(req.body,userId)
            res.status(HttpStatus.OK).json({
                creation
            })
            console.log(creation)
        } catch (error) {
            console.log(error);
            next(error)
        }


    }
}