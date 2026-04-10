import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../common/constants/http-status';
import { UpgradeUseCase } from '../../application/usecases/user/upgraderole/upgradeRole.usecase';
import { SuccessMessage } from '../../common/enums/message-enum';
import { ReapplyUseCase } from '../../application/usecases/user/reapply/reapply.usecase';
import { EditProfileUseCase } from '../../application/usecases/user/editProfile/editprofile.usecase';
import { IUpgradeUseCase } from '@/application/usecases/user/upgraderole/upgaradeRole.usecase.interface';
import { IReapplyUseCase } from '@/application/usecases/user/reapply/reapply.usecase.interface';
import { IEditProfileUseCase } from '@/application/usecases/user/editProfile/editprofile.usecase.interface';
export class UserController {
  constructor(
    private UpgradeUseCase: IUpgradeUseCase,
    private ReapplyUseCase: IReapplyUseCase,
    private EditProfileUseCase: IEditProfileUseCase,
  ) {}

  async upgraderole(req: Request, res: Response, next: NextFunction) {
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
    try {
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
    } catch (error) {
      next(error);
    }
  }

  async reapply(req: Request, res: Response, next: NextFunction) {
    console.log('bjhbjhhjjhbjhbjhb');
    const userId = req.authUser!.userId;
    console.log(userId);

    try {
      const users = await this.ReapplyUseCase.execute(userId);
      res.status(HttpStatus.OK).json({
        message: SuccessMessage.REAPPLY_REQUEST_SENT,
        users,
      });
    } catch (error) {
      next(error);
    }
  }

  async editProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req.authUser!.userId;
    const { name } = req.body;
    console.log('the name', name);

    try {
      const profile = await this.EditProfileUseCase.execute({ userId, name });

      res.status(HttpStatus.OK).json({
        profile,
      });
    } catch (error) {
      next(error);
    }
  }
}
