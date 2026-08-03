import type { IDbSession } from '../../../domain/services/transaction-manager.interface';
import type mongoose from 'mongoose';

import type { IManagerSubscriptionRepository } from '../../../domain/repositories/imanager-subscription.repository';
import { ManagerSubscription } from '../../../domain/entities/manager-subscription.entity';
import {
  ManagerSubscriptionModel,
  type IManagerSubscriptionDocument,
} from '../../database/model/manager-subscription.model';

export class ManagerSubscriptionRepository implements IManagerSubscriptionRepository {
  async create(
    subscription: ManagerSubscription,
    session?: IDbSession,
  ): Promise<ManagerSubscription> {
    const mongoSession = session as unknown as mongoose.ClientSession;
    const createdDocs = await ManagerSubscriptionModel.create(
      [
        {
          userId: subscription.userId as unknown as mongoose.Types.ObjectId,
          plan: subscription.plan,
          status: subscription.status,
          eventLimit: subscription.eventLimit,
          eventsUsed: subscription.eventsUsed,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
        },
      ],
      { session: mongoSession },
    );

    return this._toEntity(createdDocs[0]);
  }

  async findById(id: string): Promise<ManagerSubscription | null> {
    const doc = await ManagerSubscriptionModel.findById(id).exec();
    return doc ? this._toEntity(doc) : null;
  }

  async findByUserId(userId: string): Promise<ManagerSubscription[]> {
    const docs = await ManagerSubscriptionModel.find({ userId }).exec();
    return docs.map((doc) => this._toEntity(doc));
  }

  async update(
    id: string,
    updateData: Partial<ManagerSubscription>,
    session?: IDbSession,
  ): Promise<ManagerSubscription | null> {
    const mongoSession = session as unknown as mongoose.ClientSession;
    const mappedUpdateData: mongoose.UpdateQuery<IManagerSubscriptionDocument> =
      { ...updateData };
    const doc = await ManagerSubscriptionModel.findByIdAndUpdate(
      id,
      mappedUpdateData,
      { new: true, session: mongoSession },
    ).exec();
    return doc ? this._toEntity(doc) : null;
  }

  private _toEntity(
    doc:
      | IManagerSubscriptionDocument
      | mongoose.HydratedDocument<IManagerSubscriptionDocument>
      | Record<string, unknown>,
  ): ManagerSubscription {
    const d = doc as Record<string, unknown>;
    return new ManagerSubscription(
      (d._id as mongoose.Types.ObjectId)?.toString() || (d.id as string) || '',
      (d.userId as mongoose.Types.ObjectId)?.toString() ||
        String(d.userId || ''),
      d.plan as ManagerSubscription['plan'],
      d.status as ManagerSubscription['status'],
      Number(d.eventLimit || 0),
      Number(d.eventsUsed || 0),
      d.startDate as Date,
      d.endDate as Date,
      d.createdAt as Date,
      d.updatedAt as Date,
    );
  }
}
