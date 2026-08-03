import mongoose from 'mongoose';
import type { ITransactionManager } from '../../domain/services/transaction-manager.interface';

export class MongoTransactionManager implements ITransactionManager {
  async start(): Promise<mongoose.ClientSession> {
    const session = await mongoose.startSession();
    session.startTransaction();
    return session;
  }

  async commit(session: mongoose.ClientSession): Promise<void> {
    await session.commitTransaction();
    session.endSession();
  }

  async rollback(session: mongoose.ClientSession): Promise<void> {
    await session.abortTransaction();
    session.endSession();
  }
}
