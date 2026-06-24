export interface ITransactionManager {
  start(): Promise<any>;
  commit(session: any): Promise<void>;
  rollback(session: any): Promise<void>;
}