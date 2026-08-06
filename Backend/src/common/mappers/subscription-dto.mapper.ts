import type { CreatePlanDto } from '../../application/dtos/createplan.dto';

export class SubscriptionDtoMapper {
  static fromRequest(body: Record<string, unknown>): CreatePlanDto {
    return {
      name: String(body.name),
      price: Number(body.price),
      eventLimit: Number(body.eventLimit),
      commissionPercentage: Number(body.commissionPercentage),
      features: Array.isArray(body.features) ? (body.features as string[]) : [],
    };
  }

  static toUpdateDto(body: Record<string, unknown>): Partial<CreatePlanDto> {
    const dto: Partial<CreatePlanDto> = {};
    if (body.name !== undefined) {
      dto.name = String(body.name);
    }
    if (body.price !== undefined) {
      dto.price = Number(body.price);
    }
    if (body.eventLimit !== undefined) {
      dto.eventLimit = Number(body.eventLimit);
    }
    if (body.commissionPercentage !== undefined) {
      dto.commissionPercentage = Number(body.commissionPercentage);
    }
    if (Array.isArray(body.features)) {
      dto.features = body.features as string[];
    }
    return dto;
  }
}
