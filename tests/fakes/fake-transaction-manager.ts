import { ITransactionManager, TransactionCallback } from '../../src/domain/managers/ITransactionManager'

export class FakeTransactionManager implements ITransactionManager {
    async execute<T>(action: TransactionCallback<T>): Promise<T> {
        return action({})
    }
}
