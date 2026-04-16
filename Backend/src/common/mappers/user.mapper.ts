import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../../application/dtos/responses/user-response.dto';
import { BaseMapper } from './base.mapper';

export class UserMapper extends BaseMapper<User, UserResponseDto> {
  toResponse(entity: User): UserResponseDto {
    return {
      id: this.mapId(entity.id),
      name: entity.name,
      email: entity.email,
      role: entity.role,
      status: entity.status,
      isVerified: entity.isVerified,
      applyingupgrade: entity.applyingupgrade,
      rejectedAt: entity.rejectedAt,
      reapplyAt: entity.reapplyAt,
     
    };
  }

  
  toPreview(entity: User) {
    return {
      id: this.mapId(entity.id),
      name: entity.name,
      role: entity.role,
    };
  }
}

export const userMapper = new UserMapper();
