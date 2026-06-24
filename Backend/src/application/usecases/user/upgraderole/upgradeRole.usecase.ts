import { userMapper } from '../../../../common/mappers/user.mapper';
import { IEventManagerRepository } from '../../../../domain/repositories/manger.repository.interface';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UpgraderoleDto } from '../../../dtos/upgraderole.dto';
import { EventManager } from '../../../../domain/entities/manager.entity';
import { UpgradeStatus } from '../../../../common/enums/upgrade-enums';
import { UserResponseDto } from '../../../../application/dtos/responses/user-response.dto';
import { IUpgradeUseCase } from './upgaradeRole.usecase.interface';

export class UpgradeUseCase implements IUpgradeUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _managerRepository: IEventManagerRepository,
  ) {}

  async execute(data: UpgraderoleDto): Promise<UserResponseDto | null> {
    const user = await this._userRepository.findByEmail(data.email);

    if (!user || !user.id) return null;

    console.log('lvefjnjvjsfv');

    const request = new EventManager(
      null,
      user.id,
      data.fullName,
      data.organizationName,
      data.aboutEvents,
      data.certificate,
      data.documentReference,
      data.experienceLevel,
      data.socialLinks,
      data.organizationType,
    );

    console.log('cheking for tthe request');

    await this._managerRepository.createManager(request);

    user.applyingupgrade = UpgradeStatus.PENDING;
    const updatedUser = await this._userRepository.updateUser(user);
    return updatedUser ? userMapper.toResponse(updatedUser) : null;
  }
}
