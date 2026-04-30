import type { Prisma, PrismaClient } from "@prisma/client";

export type PrismaTransactionClient = Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export type TransactionCallback<T> = (tx: PrismaTransactionClient) => Promise<T>;

interface Config {
    timeout?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
}

export interface ITransactionManager {
    execute<T>(action: TransactionCallback<T>, timeout?: number): Promise<T>;
}

export type TransactionManagerConfig = Config;