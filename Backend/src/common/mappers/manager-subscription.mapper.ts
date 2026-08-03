import { ManagerSubscription } from '../../domain/entities/manager-subscription.entity';
import type { ManagerSubscriptionStatus } from '../enums/manager-subscription-status.enum';

export class ManagerSubscriptionMapper {
  toDomain(doc: Record<string, unknown>): ManagerSubscription {
    return new ManagerSubscription(
      (doc._id as { toString(): string })?.toString() || (doc.id as string) || '',
      (doc.userId as { toString(): string })?.toString() || String(doc.userId || ''),
      doc.plan as string,
      doc.status as ManagerSubscriptionStatus,
      Number(doc.eventLimit || 0),
      Number(doc.eventsUsed || 0),
      doc.startDate as Date,
      doc.endDate as Date,
      doc.createdAt as Date,
      doc.updatedAt as Date,
    );
  }

  toPersistence(entity: ManagerSubscription): Record<string, unknown> {
    return {
      userId: entity.userId,
      plan: entity.plan,
      status: entity.status,
      eventLimit: entity.eventLimit,
      eventsUsed: entity.eventsUsed,
      startDate: entity.startDate,
      endDate: entity.endDate,
    };
  }
}

export const managerSubscriptionMapper = new ManagerSubscriptionMapper();
