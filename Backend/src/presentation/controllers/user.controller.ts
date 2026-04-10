import { Request, Response } from 'express';
import { HttpStatus } from '../../common/constants/http-status';
import { SuccessMessage } from '../../common/enums/message-enum';
import { IUpgradeUseCase } from '@/application/usecases/user/upgraderole/upgaradeRole.usecase.interface';
import { IReapplyUseCase } from '@/application/usecases/user/reapply/reapply.usecase.interface';
import { IEditProfileUseCase } from '@/application/usecases/user/editProfile/editprofile.usecase.interface';
import { catchAsync } from '@/common/utils/catchAsync';

export class UserController {
  constructor(
    private UpgradeUseCase: IUpgradeUseCase,
    private ReapplyUseCase: IReapplyUseCase,
    private EditProfileUseCase: IEditProfileUseCase,
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
