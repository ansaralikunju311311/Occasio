import type { Request, Response } from 'express';

import { HttpStatus } from '../../common/constants/http-status';
import type { UserStatus } from '../../common/enums/userstatus-enum';
import type { IFindallUseCase } from '../../application/usecases/admin/allUsers/findall.usecase.interface';
import type { IUserManageUseCase } from '../../application/usecases/admin/usermanage/usermanage.usecase.interface';
import type { IManagerDetailsUseCase } from '../../application/usecases/admin/managerDetails/managerdetails.usecase.interface';
import type { IApprovalUseCase } from '../../application/usecases/admin/manageApproval/managerapproval.usecase.interface';
import type { IManagerRejectionUseCase } from '../../application/usecases/admin/managerRejection/managerRejection.usecase.interface';
import type { IGetAllPaymentsUseCase } from '../../application/usecases/payment/getAllPayments/getAllPayments.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import type { IUserdetailsUseCase } from '../../application/usecases/admin/userDetails/userdetails.usecase.interface';

export class AdminController {
  constructor(
    private _findallUsecase: IFindallUseCase,
    private _userManageUseCase: IUserManageUseCase,
    private _userDetailsUseCase: IUserdetailsUseCase,
    private _pendingmanagerDetailsUseCase: IManagerDetailsUseCase,
    private _managerApprovalUseCase: IApprovalUseCase,
    private _managerRejectionUseCase: IManagerRejectionUseCase,
    private _managerDetailsUseCase: IManagerDetailsUseCase,
    private _getAllPaymentsUseCase: IGetAllPaymentsUseCase,
  ) {}

  getUsers = catchAsync(async (req: Request, res: Response) => {
    const search = req.query.search as string;
    const role = req.query.role as string;
    const applyingupgrade = req.query.applyingupgrade as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this._findallUsecase.execute({
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

    const user = await this._userManageUseCase.execute({
      userId: userId as string,
      status: status as UserStatus,
    });
    res.status(HttpStatus.OK).json({
      user,
    });
  });

  userDetails = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await this._userDetailsUseCase.execute(userId as string);
    res.status(HttpStatus.OK).json({
      user,
    });
  });

  managerDetails = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const manager = await this._managerDetailsUseCase.execute(id as string);
    res.status(HttpStatus.OK).json({
      manager,
    });
  });

  pendingmanagerDetails = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const search = req.query.search as string;

    const user = await this._pendingmanagerDetailsUseCase.execute(
      userId as string,
      search,
    );
    res.status(HttpStatus.OK).json({
      user,
    });
  });

  managerApproval = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const users = await this._managerApprovalUseCase.execute(id as string);
    res.status(HttpStatus.OK).json({
      users,
    });
  });

  managerRejection = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const users = await this._managerRejectionUseCase.execute(
      id as string,
      reason,
    );
    res.status(HttpStatus.OK).json({
      users,
    });
  });

  getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this._getAllPaymentsUseCase.execute({ page, limit });
    res.status(HttpStatus.OK).json({
      payments: result?.data || [],
      metadata: result?.metadata,
    });
  });
}
