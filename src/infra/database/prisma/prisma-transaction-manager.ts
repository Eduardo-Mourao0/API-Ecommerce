import type { PrismaClient } from "@prisma/client";
import { ITransactionManager, TransactionCallback, TransactionManagerConfig } from "../../../domain/managers/ITransactionManager";
import { prisma } from "./prisma-client";
import { PrismaRepositoryClient } from "./prisma-repository-client";

const DEFAULT_CONFIG: Required<TransactionManagerConfig> = {
    timeout: 30000,
    isolationLevel: "ReadCommitted"
};

export class PrismaTransactionManager implements ITransactionManager {
    constructor(
        private readonly transactionClient: PrismaClient = prisma as unknown as PrismaClient,
        private readonly config: TransactionManagerConfig = DEFAULT_CONFIG
    ) {}

    async execute<T>(
        action: TransactionCallback<T>,
        timeout?: number
    ): Promise<T> {
        return await this.transactionClient.$transaction(
            (tx: any) => action(tx as PrismaRepositoryClient),
            {
                ...this.config,
                timeout: timeout ?? this.config.timeout
            }
        );
    }
}
