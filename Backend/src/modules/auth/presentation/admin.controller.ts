import { NextFunction,Request,Response } from 'express';
import {FindAllUseCase} from '../application/use-cases/admin/findall.usecase.js'
import { HttpStatus } from '../../../common/constants/http-stattus.js';
import { UserManageUseCase } from '../application/use-cases/admin/usermange.usecase.js';
import { PendingManagerUsecase } from '../application/use-cases/admin/pending.usecase.js';
import { UserDetailsUseCase } from '../application/use-cases/admin/userdetails.usecase.js';
 import { PendingmanagerDetailsUseCase } from '../application/use-cases/admin/pendingmanager.usecase.js';
export class AdminController{
    
    constructor(
        private findallUsecase : FindAllUseCase,
        private userManageUseCase:UserManageUseCase,
        private userDetailsUseCase:UserDetailsUseCase,
        private pendingmanagerDetailsUseCase:PendingmanagerDetailsUseCase,
                             
    

    //    private pendingManagerUsecase : PendingManagerUsecase
    ){}


    async getUsers(_req:Request,res:Response,next:NextFunction){
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




    async userManage(req:Request,res:Response,next:NextFunction){
        try {
              console.log("fjb");
              const {status} = req.body;
              const {userId} = req.params;
              console.log(userId,status)
               
            //   const users = await this.findUser.execute()
              const user = await this.userManageUseCase.execute({userId: userId as string, status});
              res.status(HttpStatus.OK).json({
                user
              })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }


    async userDetails(req:Request,res:Response,next:NextFunction){

        const {userId} =  req.params;
        try {
            
              const user = await this.userDetailsUseCase.execute(userId as string);
              console.log(user)
              res.status(HttpStatus.OK).json({
                user
              })

        } catch (error) {
            
            console.log(error);
            next(error)
        }
    }






    async pendingmanagerDetails(req:Request,res:Response,next:NextFunction)
       
           {

               const {userId} = req.params;
               console.log("ethiyooooo",userId)
               try {
                console.log("we reached here")
                  const user = await this.pendingmanagerDetailsUseCase.execute(userId);
                  console.log('the cliked manager details',user)
                  res.status(HttpStatus.OK).json({
                    user
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