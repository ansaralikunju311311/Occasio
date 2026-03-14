import { NextFunction,Request,Response } from 'express';
import {FindAllUseCase} from '../application/use-cases/admin/findall.usecase.js'
import { HttpStatus } from '../../../common/constants/http-stattus.js';
// import { PendingManagerUsecase } from '../application/use-cases/admin/pending.usecase.js';
export class AdminController{
    
    constructor(
        private findallUsecase : FindAllUseCase,
        // private pendingManagerUsecase : PendingManagerUsecase
    ){}


    async getUsers(req:Request,res:Response,next:NextFunction){
         console.log('vannoooo arelum evide')

        try {
            const users = await this.findallUsecase.execute();
            res.status(HttpStatus.OK).json({
                users
            })
        } catch (error) {
            next(error)
        }
    }


    // async getPendingManagers(req:Request,res:Response,next:NextFunction){
    //     try {
    //          const managers = await this.pendingManagerUsecase.execute();
    //          res.status(HttpStatus.OK).json({
    //             managers
    //          })
    //     } catch (error) {
    //         next(error)
    //     }
    // }
}