/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ITransactionManager {
  start(): Promise<any>;
  commit(session: any): Promise<void>;
  rollback(session: any): Promise<void>;
}
