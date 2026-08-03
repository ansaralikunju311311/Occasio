import type { IDbSession } from '../../../domain/services/transaction-manager.interface';
import type mongoose from 'mongoose';

import type { IManagerSubscriptionRepository } from '../../../domain/repositories/imanager-subscription.repository';
import { ManagerSubscription } from '../../../domain/entities/manager-subscription.entity';
import {
  ManagerSubscriptionModel,
  type IManagerSubscriptionDocument,
} from '../../database/model/manager-subscription.model';
import { managerSubscriptionMapper } from '../../../common/mappers/manager-subscription.mapper';

export class ManagerSubscriptionRepository implements IManagerSubscriptionRepository {
  async create(
    subscription: ManagerSubscription,
    session?: IDbSession,
  ): Promise<ManagerSubscription> {
    const mongoSession = session as unknown as mongoose.ClientSession;
    const createdDocs = await ManagerSubscriptionModel.create(
      [
        managerSubscriptionMapper.toPersistence(subscription),
      ],
      { session: mongoSession },
    );

    return managerSubscriptionMapper.toDomain(createdDocs[0].toObject() as unknown as Record<string, unknown>);
  }

  async findById(id: string): Promise<ManagerSubscription | null> {
    const doc = await ManagerSubscriptionModel.findById(id).exec();
    return doc ? managerSubscriptionMapper.toDomain(doc.toObject() as unknown as Record<string, unknown>) : null;
  }

  async findByUserId(userId: string): Promise<ManagerSubscription[]> {
    const docs = await ManagerSubscriptionModel.find({ userId }).exec();
    return docs.map((doc) => managerSubscriptionMapper.toDomain(doc.toObject() as unknown as Record<string, unknown>));
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
    return doc ? managerSubscriptionMapper.toDomain(doc.toObject() as unknown as Record<string, unknown>) : null;
  }


}
