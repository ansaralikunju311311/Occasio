import type { ResponsePlanDto } from '../../application/dtos/responses/responseplan.dto';
import { Subscription } from '../../domain/entities/subscription.entity';
import { BaseMapper } from './base.mapper';

export class SubscriptionMapper extends BaseMapper<Subscription, ResponsePlanDto> {
  toResponse(entity: Subscription): ResponsePlanDto {
    return {
      id: entity.id ?? '',
      name: entity.name,
      price: entity.price,
      eventLimit: entity.eventLimit,
      commissionPercentage: entity.commissionPercentage,
      features: entity.features || [],
      isActive: entity.isActive,
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
    };
  }

  toDomain(doc: Record<string, unknown>): Subscription {
    return new Subscription(
      (doc._id as { toString(): string })?.toString() || (doc.id as string) || null,
      doc.name as string,
      doc.price as number,
      doc.eventLimit as number,
      doc.commissionPercentage as number,
      doc.features as string[],
      doc.isActive as boolean,
      doc.createdAt as Date,
      doc.updatedAt as Date,
    );
  }
}

export const subscriptionMapper = new SubscriptionMapper();

export const mapToResponsePlanDto = (
  plan: Subscription,
): ResponsePlanDto => subscriptionMapper.toResponse(plan);
