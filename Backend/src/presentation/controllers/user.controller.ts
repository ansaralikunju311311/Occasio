import { Request, Response } from 'express';
import { HttpStatus } from '../../common/constants/http-status';
import { SuccessMessage } from '../../common/enums/message-enum';
import { IUpgradeUseCase } from '../../application/usecases/user/upgraderole/upgaradeRole.usecase.interface';
import { IReapplyUseCase } from '../../application/usecases/user/reapply/reapply.usecase.interface';
import { IEditProfileUseCase } from '../../application/usecases/user/editProfile/editprofile.usecase.interface';
import { catchAsync } from '../../common/utils/catchAsync';

import { IGetMySubscriptionUseCase } from '../../application/usecases/user/getMySubscription/get-mysub.usecase.interface';
import { ISubscribeUseCase } from '../../application/usecases/user/subscribe/subscribe.usecase.interface';

export class UserController {
  constructor(
    private UpgradeUseCase: IUpgradeUseCase,
    private ReapplyUseCase: IReapplyUseCase,
    private EditProfileUseCase: IEditProfileUseCase,
    private SubscribeUseCase: ISubscribeUseCase,
    private GetMySubscriptionUseCase: IGetMySubscriptionUseCase
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

  subscribe = catchAsync(async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.authUser || !req.authUser.userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
        return;
      }
      
      const userId = req.authUser.userId;
      const { planId } = req.body;
      if (!planId) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'Plan ID is required' });
        return;
      }

      // const subscribeUseCase = (this as any).SubscribeUseCase;
      const updatedUser = await this.SubscribeUseCase.execute(userId, planId);
      

      



      res.status(HttpStatus.OK).json({ success: true, message: 'Subscribed successfully', user: updatedUser });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
    }
  });

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

  getMySubscription = catchAsync(async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;
    // const getMySubscriptionUseCase = (this as any).GetMySubscriptionUseCase;
           const subscription = await this.GetMySubscriptionUseCase.execute(userId);

   


    res.status(HttpStatus.OK).json({
      success: true,
      subscription,
    });
  });
}
