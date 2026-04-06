import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../common/constants/http-stattus";
import { UpgradeUseCase } from "../../application/use-cases/users/upgrade.usecase.js";
import { SuccessMessage } from "../../../../common/enums/message.enum.js";
 import { ReapplyUseCase } from "../../application/use-cases/users/reapply.usecase.js"
import { EditProfileUseCase } from "../../application/use-cases/users/editProfileusecase.js";
export class UserController {
    constructor(
        private UpgradeUseCase: UpgradeUseCase,
         private ReapplyUseCase: ReapplyUseCase,
         private EditProfileUseCase:EditProfileUseCase
    ) { }


    async upgraderole(req: Request, res: Response, next: NextFunction) {
        const { email, fullName, organizationName, aboutEvents, certificate, documentReference, experienceLevel, socialLinks, organizationType } = req.body;
        try {
            const users = await this.UpgradeUseCase.execute({ email, fullName, organizationName, aboutEvents, certificate, documentReference, experienceLevel, socialLinks, organizationType })
            res.status(HttpStatus.OK).json({
                message: SuccessMessage.UPGRADE_REQUEST_SENT,
                users
            })

        } catch (error) {
            next(error)
        }
    }

    async reapply(req: Request, res: Response, next: NextFunction) {
        console.log("bjhbjhhjjhbjhbjhb")
        const userId = req.user?.userId;
        console.log(userId)

        try {

            const users = await this.ReapplyUseCase.execute( userId );
            res.status(HttpStatus.OK).json({
                message: SuccessMessage.REAPPLY_REQUEST_SENT,
                users
            })
        } catch (error) {
            next(error)
        }
    }

    async editProfile(req:Request,res:Response,next:NextFunction){
        const userId = req.user?.userId;
        const {name} = req.body;
        console.log("the name",name)

        try {
            const profile = await this.EditProfileUseCase.execute(userId,name);





            res.status(HttpStatus.OK).json({
                profile
            })
        } catch (error) {
            next(error)
        }
    }
}