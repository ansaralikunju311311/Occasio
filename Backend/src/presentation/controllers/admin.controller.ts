import { NextFunction, Request, Response } from 'express';
import { FindAllUseCase } from '../../application/usecases/admin/allUsers/findall.usecase';
import { HttpStatus } from '../../common/constants/http-status';
import { UserManageUseCase } from '../../application/usecases/admin/usermanage/usermanage.usecase';
// import { PendingManagerUsecase } from '../application/use-cases/admin/pending.usecase.js';
import { UserDetailsUseCase } from '../../application/usecases/admin/userDetails/userdetails.usecase';
import { PendingmanagerDetailsUseCase } from '../../application/usecases/admin/pendingmanager/pendingmanager.usecase';
import { ManagerApprovalUseCase } from '../../application/usecases/admin/manageApproval/managerapproval.usecase';
import { ManagerRejectionUseCase } from '../../application/usecases/admin/managerRejection/managerRejection.usecase';
import { ManagerDetailsUseCase } from '../../application/usecases/admin/managerDetails/managerdetails.usecase';
export class AdminController {
  constructor(
    private findallUsecase: FindAllUseCase,
    private userManageUseCase: UserManageUseCase,
    private userDetailsUseCase: UserDetailsUseCase,
    private pendingmanagerDetailsUseCase: PendingmanagerDetailsUseCase,
    private managerApprovalUseCase: ManagerApprovalUseCase,
    private managerRejectionUseCase: ManagerRejectionUseCase,
    private managerDetailsUseCase: ManagerDetailsUseCase,

    //    private pendingManagerUsecase : PendingManagerUsecase
  ) {}

  async getUsers(req: Request, res: Response, next: NextFunction) {
    console.log('vannoooo arelum evide');

    const search = req.query.search as string;

    try {
      const users = await this.findallUsecase.execute(search);
      res.status(HttpStatus.OK).json({
        users,
      });
    } catch (error) {
      next(error);
    }
  }

  async userManage(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('fjb');
      const { status } = req.body;
      const { userId } = req.params;
      console.log(userId, status);

      //   const users = await this.findUser.execute()
      const user = await this.userManageUseCase.execute({
        userId: userId as string,
        status,
      });
      res.status(HttpStatus.OK).json({
        user,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async userDetails(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    try {
      const user = await this.userDetailsUseCase.execute(userId as string);
      console.log(user);
      res.status(HttpStatus.OK).json({
        user,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async managerDetails(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const manager = await this.managerDetailsUseCase.execute(id as string);
      res.status(HttpStatus.OK).json({
        manager,
      });
    } catch (error) {
      next(error);
    }
  }

  async pendingmanagerDetails(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;

    const search = req.query.search as string;

    console.log('ethiyooooo', userId);
    try {
      console.log('we reached here');
      const user = await this.pendingmanagerDetailsUseCase.execute(
        userId as string,
        search,
      );
      console.log('the cliked manager details', user);
      res.status(HttpStatus.OK).json({
        user,
      });
    } catch (error) {
      next(error);
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

  async managerApproval(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const users = await this.managerApprovalUseCase.execute(id as string);
      res.status(HttpStatus.OK).json({
        users,
      });
      console.log('helloo');
    } catch (error) {
      next(error);
    }
  }

  async managerRejection(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      console.log('id', id, 'reason', reason);
      const users = await this.managerRejectionUseCase.execute(
        id as string,
        reason,
      );
      res.status(HttpStatus.OK).json({
        users,
      });
      console.log('users list for the rejection purpose', users);
    } catch (error) {
      next(error);
    }
  }
}
