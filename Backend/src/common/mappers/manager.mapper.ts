import { EventManager } from '../../domain/entities/manager.entity';
import { ManagerResponseDto } from '../../application/dtos/responses/manager-response.dto';
import { BaseMapper } from './base.mapper';

export class ManagerMapper extends BaseMapper<EventManager, ManagerResponseDto> {
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
}

export const managerMapper = new ManagerMapper();
