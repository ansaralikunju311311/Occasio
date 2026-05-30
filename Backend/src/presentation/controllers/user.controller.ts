import { Request, Response } from 'express';
import { HttpStatus } from '../../common/constants/http-status';
import { SuccessMessage } from '../../common/enums/message-enum';
import { IUpgradeUseCase } from '../../application/usecases/user/upgraderole/upgaradeRole.usecase.interface';
import { IReapplyUseCase } from '../../application/usecases/user/reapply/reapply.usecase.interface';
import { IEditProfileUseCase } from '../../application/usecases/user/editProfile/editprofile.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';

import { SubscribeUseCase } from '../../application/usecases/user/subscribe/subscribe.usecase';

export class UserController {
  constructor(
    private UpgradeUseCase: IUpgradeUseCase,
    private ReapplyUseCase: IReapplyUseCase,
    private EditProfileUseCase: IEditProfileUseCase,
    private SubscribeUseCase: SubscribeUseCase,
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

    const users = await this.UpgradeUseCase.execute({
      email,
      fullName,
      organizationName,
      aboutEvents,
      certificate,
      documentReference,
      experienceLevel,
      socialLinks,
      organizationType,
    });

    res.status(HttpStatus.OK).json({
      message: SuccessMessage.UPGRADE_REQUEST_SENT,
      users,
    });
  });

  subscribe = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.authUser || !req.authUser.userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const userId = req.authUser.userId;
      const { planId } = req.body;
      if (!planId) {
        res.status(400).json({ success: false, message: 'Plan ID is required' });
        return;
      }

      const subscribeUseCase = (this as any).SubscribeUseCase;
      if (!subscribeUseCase) {
        res.status(500).json({ success: false, message: 'SubscribeUseCase not injected' });
        return;
      }

      const updatedUser = await subscribeUseCase.execute(userId, planId);
      res.status(200).json({ success: true, message: 'Subscribed successfully', user: updatedUser });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  reapply = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;

    const users = await this.ReapplyUseCase.execute(userId);
    res.status(HttpStatus.OK).json({
      message: SuccessMessage.REAPPLY_REQUEST_SENT,
      users,
    });
  });

  editProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;
    const { name } = req.body;

    const profile = await this.EditProfileUseCase.execute({ userId, name });

    res.status(HttpStatus.OK).json({
      profile,
    });
  });
}
