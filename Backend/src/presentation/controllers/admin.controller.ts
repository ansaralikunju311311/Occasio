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
import { sendSuccess } from '../../common/utils/response';
import { UserModel } from '../../infrastructure/database/model/user.model';
import { EventModel } from '../../infrastructure/database/model/events/event.model';
import { BookingModel } from '../../infrastructure/database/model/booking.model';
import { PaymentModel } from '../../infrastructure/database/model/payment/payment.model';


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
    sendSuccess(res, result?.data || [], undefined, HttpStatus.OK, {
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
    sendSuccess(res, user, undefined, HttpStatus.OK, { user });
  });

  userDetails = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await this._userDetailsUseCase.execute(userId as string);
    sendSuccess(res, user, undefined, HttpStatus.OK, { user });
  });

  managerDetails = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const manager = await this._managerDetailsUseCase.execute(id as string);
    sendSuccess(res, manager, undefined, HttpStatus.OK, { manager });
  });

  pendingmanagerDetails = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const search = req.query.search as string;

    const user = await this._pendingmanagerDetailsUseCase.execute(
      userId as string,
      search,
    );
    sendSuccess(res, user, undefined, HttpStatus.OK, { user });
  });

  managerApproval = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const users = await this._managerApprovalUseCase.execute(id as string);
    sendSuccess(res, users, undefined, HttpStatus.OK, { users });
  });

  managerRejection = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const users = await this._managerRejectionUseCase.execute(
      id as string,
      reason,
    );
    sendSuccess(res, users, undefined, HttpStatus.OK, { users });
  });

  getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const purpose = req.query.purpose as string;

    const result = await this._getAllPaymentsUseCase.execute({ page, limit, purpose });
    sendSuccess(res, result?.data || [], undefined, HttpStatus.OK, {
      payments: result?.data || [],
      metadata: result?.metadata,
    });
  });

  getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const totalUsers = await UserModel.countDocuments();
    const eventManagers = await UserModel.countDocuments({ role: 'EVENT_MANAGER' });
    const activeEvents = await EventModel.countDocuments({ status: 'LIVE' });

    // Aggregate booking commissions
    const bookingCommissions = await BookingModel.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: null, total: { $sum: '$commissionAmount' } } },
    ]);

    // Aggregate subscription platform fees
    const subscriptionFees = await PaymentModel.aggregate([
      { $match: { purpose: 'SUBSCRIPTION', paymentStatus: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Aggregate event publishing fees
    const publishingFees = await PaymentModel.aggregate([
      { $match: { purpose: 'EVENT_PUBLISH', paymentStatus: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const commissionRevenue = bookingCommissions[0]?.total || 0;
    const subscriptionRevenue = subscriptionFees[0]?.total || 0;
    const publishingRevenue = publishingFees[0]?.total || 0;
    const totalRevenue = commissionRevenue + subscriptionRevenue + publishingRevenue;

    sendSuccess(res, undefined, undefined, HttpStatus.OK, {
      stats: {
        totalUsers,
        eventManagers,
        activeEvents,
        commissionRevenue: Math.round(commissionRevenue),
        subscriptionRevenue: Math.round(subscriptionRevenue),
        publishingRevenue: Math.round(publishingRevenue),
        totalRevenue: Math.round(totalRevenue),
      },
    });
  });
}


