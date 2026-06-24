/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

import type { ITransactionManager } from '../../domain/services/transaction-manager.interface';

export class MongoTransactionManager implements ITransactionManager {
  async start() {
    const session = await mongoose.startSession();
    session.startTransaction();
    return session;
  }

  async commit(session: any): Promise<void> {
    await session.commitTransaction();
    session.endSession();
  }

  async rollback(session: any): Promise<void> {
    await session.abortTransaction();
    session.endSession();
  }
}
