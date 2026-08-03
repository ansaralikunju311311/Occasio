import mongoose from 'mongoose';

import type { ITransactionManager, IDbSession } from '../../domain/services/transaction-manager.interface';

export class MongoTransactionManager implements ITransactionManager {
  async start(): Promise<IDbSession> {
    const session = await mongoose.startSession();
    session.startTransaction();
    return session as unknown as IDbSession;
  }

  async commit(session: IDbSession): Promise<void> {
    const mongoSession = session as unknown as mongoose.ClientSession;
    await mongoSession.commitTransaction();
    mongoSession.endSession();
  }

  async rollback(session: IDbSession): Promise<void> {
    const mongoSession = session as unknown as mongoose.ClientSession;
    await mongoSession.abortTransaction();
    mongoSession.endSession();
  }
}
