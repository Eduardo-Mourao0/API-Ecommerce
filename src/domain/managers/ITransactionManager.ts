export interface TransactionContext {}

export type TransactionCallback<T> = (tx: TransactionContext) => Promise<T>;

export type TransactionIsolationLevel =
    | 'ReadUncommitted'
    | 'ReadCommitted'
    | 'RepeatableRead'
    | 'Serializable'

interface Config {
    timeout?: number;
    isolationLevel?: TransactionIsolationLevel;
}

export interface ITransactionManager {
    execute<T>(action: TransactionCallback<T>, timeout?: number): Promise<T>;
}

export type TransactionManagerConfig = Config;
