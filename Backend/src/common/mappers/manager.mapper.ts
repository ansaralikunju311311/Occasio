import { EventManager } from '../../domain/entities/manager.entity';
import type { ManagerResponseDto } from '../../application/dtos/responses/manager-response.dto';

import { BaseMapper } from './base.mapper';

export class ManagerMapper extends BaseMapper<
  EventManager,
  ManagerResponseDto
> {
  toResponse(entity: EventManager): ManagerResponseDto {
    return {
      id: this.mapId(entity.id),
      userId: entity.userId,
      fullName: entity.fullName,
      organizationName: entity.organizationName,
      aboutEvents: entity.aboutEvents,
      certificate: entity.certificate,
      documentReference: entity.documentReference,
      experienceLevel: entity.experienceLevel,
      socialLinks: entity.socialLinks,
      organizationType: entity.organizationType,
    };
  }

  toDomain(doc: Record<string, unknown>): EventManager {
    return new EventManager(
      (doc._id as { toString(): string })?.toString() || (doc.id as string) || '',
      (doc.userId as { toString(): string })?.toString() || String(doc.userId || ''),
      (doc.fullName as string) || '',
      (doc.organizationName as string) || '',
      (doc.aboutEvents as string) || '',
      (doc.certificate as string) || '',
      (doc.documentReference as string) || '',
      (doc.experienceLevel as string) || '',
      (doc.socialLinks as string) || '',
      (doc.organizationType as string) || '',
    );
  }

  toPersistence(entity: EventManager): Record<string, unknown> {
    return {
      userId: entity.userId,
      fullName: entity.fullName,
      certificate: entity.certificate,
      aboutEvents: entity.aboutEvents,
      organizationType: entity.organizationType,
      socialLinks: entity.socialLinks,
      experienceLevel: entity.experienceLevel,
      documentReference: entity.documentReference,
      organizationName: entity.organizationName,
    };
  }
}

export const managerMapper = new ManagerMapper();
