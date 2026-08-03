import { User } from '../../domain/entities/user.entity';
import type { UserResponseDto } from '../../application/dtos/responses/user-response.dto';

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
      activeSubscription: entity.activeSubscription,
      eventsCreated: entity.eventsCreated,
      walletBalance: entity.walletBalance,
    };
  }

  toPreview(entity: User) {
    return {
      id: this.mapId(entity.id),
      name: entity.name,
      role: entity.role,
    };
  }

  toDomain(doc: Record<string, unknown>): User {
    let activeSubStr: string | undefined = undefined;
    if (doc.activeSubscription) {
      const sub = doc.activeSubscription as Record<string, unknown>;
      activeSubStr =
        (sub._id as { toString(): string })?.toString() || sub.toString();
    }

    return new User(
      (doc._id as { toString(): string })?.toString() || (doc.id as string) || '',
      doc.name as string,
      doc.email as string,
      doc.password as string,
      doc.role as User['role'],
      doc.status as User['status'],
      Boolean(doc.isVerified),
      doc.applyingupgrade as User['applyingupgrade'],
      doc.rejectedAt ? (doc.rejectedAt as Date) : null,
      doc.reapplyAt ? (doc.reapplyAt as Date) : null,
      activeSubStr,
      Number(doc.eventsCreated || 0),
      Number(doc.walletBalance || 0),
    );
  }

  toPersistence(entity: User): Record<string, unknown> {
    return {
      name: entity.name,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      status: entity.status,
      isVerified: entity.isVerified,
      applyingupgrade: entity.applyingupgrade,
      rejectedAt: entity.rejectedAt || undefined,
      reapplyAt: entity.reapplyAt || undefined,
      eventsCreated: entity.eventsCreated,
      activeSubscription: entity.activeSubscription,
      walletBalance: entity.walletBalance,
    };
  }
}

export const userMapper = new UserMapper();
