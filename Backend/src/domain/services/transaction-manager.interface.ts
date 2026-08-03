import type mongoose from 'mongoose';

export interface ITransactionManager {
  start(): Promise<mongoose.ClientSession>;
  commit(session: mongoose.ClientSession): Promise<void>;
  rollback(session: mongoose.ClientSession): Promise<void>;
}
