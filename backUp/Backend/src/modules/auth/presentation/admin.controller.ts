import { NextFunction,Request,Response } from 'express';
import {FindAllUseCase} from '../application/use-cases/admin/findall.usecase.js'
import { HttpStatus } from '../../../common/constants/http-stattus.js';
import { UserManageUseCase } from '../application/use-cases/admin/usermange.usecase.js';
// import { PendingManagerUsecase } from '../application/use-cases/admin/pending.usecase.js';
import { UserDetailsUseCase } from '../application/use-cases/admin/userdetails.usecase.js';
 import { PendingmanagerDetailsUseCase } from '../application/use-cases/admin/pendingmanager.usecase.js';
import { ManagerApprovalUseCase } from '../application/use-cases/admin/managerapproval.usecase.js';
import { ManagerRejectionUseCase } from '../application/use-cases/admin/managerrejection.usecase.js';
import { ManagerDetailsUseCase } from '../application/use-cases/admin/managerdetails.usecase.js';
export class AdminController{
    
    constructor(
        private findallUsecase : FindAllUseCase,
        private userManageUseCase:UserManageUseCase,
        private userDetailsUseCase:UserDetailsUseCase,
        private pendingmanagerDetailsUseCase:PendingmanagerDetailsUseCase,
        private managerApprovalUseCase:ManagerApprovalUseCase,
         private managerRejectionUseCase:ManagerRejectionUseCase,
         private managerDetailsUseCase:ManagerDetailsUseCase  
    

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


    async managerDetails(req:Request,res:Response,next:NextFunction){
        const {id} = req.params;
        try {
             const manager = await this.managerDetailsUseCase.execute(id as string);
             res.status(HttpStatus.OK).json({
                manager
             })
        } catch (error) {
             next(error)
        }
    }






    async pendingmanagerDetails(req:Request,res:Response,next:NextFunction)
       
           {

               const {userId} = req.params;
               console.log("ethiyooooo",userId)
               try {
                console.log("we reached here")
                  const user = await this.pendingmanagerDetailsUseCase.execute(userId as string);
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

    async managerApproval(req:Request,res:Response,next:NextFunction){
        try {
            const {id} = req.params;

            const users = await this.managerApprovalUseCase.execute(id as string);
            res.status(HttpStatus.OK).json({
                users
            })
            console.log('helloo')
        } catch (error) {
             next(error)
        }
    }



    async managerRejection(req:Request,res:Response,next:NextFunction){
        try {
            const {id} = req.params;
            const {reason} = req.body;
            console.log("id",id,"reason",reason)
            const users = await this.managerRejectionUseCase.execute(id as string, reason);
            res.status(HttpStatus.OK).json({
                users
            })
            console.log("users list for the rejection purpose",users)
        } catch (error) {
            next(error)
        }
    }
}