import type { Request, Response } from 'express';

import { HttpStatus } from '../../common/constants/http-status';
import { SuccessMessage } from '../../common/enums/message-enum';
import type { ExperienceLevel } from '../../common/enums/experience-level.enum';
import type { OrganizationType } from '../../common/enums/organization-type.enum';
import type { IUpgradeUseCase } from '../../application/usecases/user/upgraderole/upgaradeRole.usecase.interface';
import type { IReapplyUseCase } from '../../application/usecases/user/reapply/reapply.usecase.interface';
import type { IEditProfileUseCase } from '../../application/usecases/user/editProfile/editprofile.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';
import type { IGetMySubscriptionUseCase } from '../../application/usecases/user/getMySubscription/get-mysub.usecase.interface';
import type { ISubscribeUseCase } from '../../application/usecases/user/subscribe/subscribe.usecase.interface';

export class UserController {
  constructor(
    private _upgradeUseCase: IUpgradeUseCase,
    private _reapplyUseCase: IReapplyUseCase,
    private _editProfileUseCase: IEditProfileUseCase,
    private _subscribeUseCase: ISubscribeUseCase,
    private _getMySubscriptionUseCase: IGetMySubscriptionUseCase,
  ) {}

  upgraderole = catchAsync(async (req: Request, res: Response) => {
    const {
      email,
      fullName,
      organizationName,
      aboutEvents,
      certificate,
      documentReference,
      experienceLevel,
      socialLinks,
      organizationType,
    } = req.body;

    const users = await this._upgradeUseCase.execute({
      email,
      fullName,
      organizationName,
      aboutEvents,
      certificate,
      documentReference,
      experienceLevel: experienceLevel as ExperienceLevel,
      socialLinks,
      organizationType: organizationType as OrganizationType,
    });

    res.status(HttpStatus.OK).json({
      message: SuccessMessage.UPGRADE_REQUEST_SENT,
      users,
    });
  });

  subscribe = catchAsync(async (req: Request, res: Response): Promise<void> => {
    if (!req.authUser || !req.authUser.userId) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userId = req.authUser.userId;
    const { planId } = req.body;
    if (!planId) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: 'Plan ID is required' });
      return;
    }

    const updatedUser = await this._subscribeUseCase.execute(userId, planId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Subscribed successfully',
      user: updatedUser,
    });
  });

  reapply = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser?.userId;
    if (!userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const users = await this._reapplyUseCase.execute(userId);
    res.status(HttpStatus.OK).json({
      message: SuccessMessage.REAPPLY_REQUEST_SENT,
      users,
    });
  });

  editProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser?.userId;
    if (!userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }
    const { name } = req.body;

    const profile = await this._editProfileUseCase.execute({ userId, name });

    res.status(HttpStatus.OK).json({
      profile,
    });
  });

  getMySubscription = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser?.userId;
    if (!userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }
    const subscription = await this._getMySubscriptionUseCase.execute(userId);

    res.status(HttpStatus.OK).json({
      success: true,
      subscription,
    });
  });
}
