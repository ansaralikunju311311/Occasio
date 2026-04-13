import { Request, Response } from 'express';
import { HttpStatus } from '../../common/constants/http-status';
import { UserDetailsUseCase } from '../../application/usecases/admin/userDetails/userdetails.usecase';
import { IFindallUseCase } from '@/application/usecases/admin/allUsers/findall.usecase.interface';
import { IUserManageUseCase } from '@/application/usecases/admin/usermanage/usermanage.usecase.interface';
import { IManagerDetailsUseCase } from '@/application/usecases/admin/managerDetails/managerdetails.usecase.interface';
import { IApprovalUseCase } from '@/application/usecases/admin/manageApproval/managerapproval.usecase.interface';
import { IManagerRejectionUseCase } from '@/application/usecases/admin/managerRejection/managerRejection.usecase.interface';
import { catchAsync } from '@/common/utils/catchAsync';

export class AdminController {
  constructor(
    private findallUsecase: IFindallUseCase,
    private userManageUseCase: IUserManageUseCase,
    private userDetailsUseCase: UserDetailsUseCase,
    private pendingmanagerDetailsUseCase: IManagerDetailsUseCase,
    private managerApprovalUseCase: IApprovalUseCase,
    private managerRejectionUseCase: IManagerRejectionUseCase,
    private managerDetailsUseCase: IManagerDetailsUseCase,
  ) {}

  getUsers = catchAsync(async (req: Request, res: Response) => {
    const search = req.query.search as string;
    const role = req.query.role as string;
    const applyingupgrade = req.query.applyingupgrade as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.findallUsecase.execute({
      search,
      role,
      applyingupgrade,
      page,
      limit,
    });
    res.status(HttpStatus.OK).json({
      users: result?.data || [],
      metadata: result?.metadata,
    });
  });

  userManage = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.body;
    const { userId } = req.params;

    const user = await this.userManageUseCase.execute({
      userId: userId as string,
      status,
    });
    res.status(HttpStatus.OK).json({
      user,
    });
  });

  userDetails = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await this.userDetailsUseCase.execute(userId as string);
    res.status(HttpStatus.OK).json({
      user,
    });
  });

  managerDetails = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const manager = await this.managerDetailsUseCase.execute(id as string);
    res.status(HttpStatus.OK).json({
      manager,
    });
  });

  pendingmanagerDetails = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const search = req.query.search as string;

    const user = await this.pendingmanagerDetailsUseCase.execute(
      userId as string,
      search,
    );
    res.status(HttpStatus.OK).json({
      user,
    });
  });

  managerApproval = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const users = await this.managerApprovalUseCase.execute(id as string);
    res.status(HttpStatus.OK).json({
      users,
    });
  });

  managerRejection = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const users = await this.managerRejectionUseCase.execute(id as string, reason);
    res.status(HttpStatus.OK).json({
      users,
    });
  });
}
