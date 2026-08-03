export interface IDbSession {
  // Database-agnostic session marker
}

export interface ITransactionManager {
  start(): Promise<IDbSession>;
  commit(session: IDbSession): Promise<void>;
  rollback(session: IDbSession): Promise<void>;
}
