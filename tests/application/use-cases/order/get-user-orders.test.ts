import { describe, expect, it, vi } from 'vitest'
import { GetUserOrdersUseCase } from '../../../../src/application/use-cases/order/get-all-order'
import { Order } from '../../../../src/domain/entities/order'
import { OrderItem } from '../../../../src/domain/entities/order-item'
import { IOrderRepository } from '../../../../src/domain/repositories/order-repository'

function makeRepository(): IOrderRepository {
    return {
        create: vi.fn(),
        findById: vi.fn(),
        findByUserId: vi.fn(),
        update: vi.fn(),
    }
}

describe('GetUserOrdersUseCase', () => {
    it('should return user orders', async () => {
        const orderRepository = makeRepository()
        const getUserOrdersUseCase = new GetUserOrdersUseCase(orderRepository)
        const order = Order.create({
            userId: 'user-1',
            total: 200,
            items: [OrderItem.create({
                productId: 'product-1',
                quantity: 2,
                price: 100,
            })],
        })
        vi.mocked(orderRepository.findByUserId).mockResolvedValue([order])

        const orders = await getUserOrdersUseCase.execute({ userId: 'user-1' })

        expect(orders).toHaveLength(1)
        expect(orders[0]).toHaveProperty('userId', 'user-1')
        expect(orderRepository.findByUserId).toHaveBeenCalledWith('user-1')
    })

    it('should throw when user has no orders', async () => {
        const orderRepository = makeRepository()
        const getUserOrdersUseCase = new GetUserOrdersUseCase(orderRepository)
        vi.mocked(orderRepository.findByUserId).mockResolvedValue([])

        await expect(getUserOrdersUseCase.execute({ userId: 'user-1' }))
            .rejects.toMatchObject({
                message: 'Voce nao possui pedidos.',
                statusCode: 400,
            })
    })
})
