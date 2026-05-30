import { describe, expect, it, vi } from 'vitest'
import { CancelOrderUseCase } from '../../../../src/application/use-cases/order/cancel-order'
import { Order } from '../../../../src/domain/entities/order'
import { OrderItem } from '../../../../src/domain/entities/order-item'
import { IOrderRepository } from '../../../../src/domain/repositories/order-repository'

function makeRepository(): IOrderRepository {
    return {
        create: vi.fn(),
        findById: vi.fn(),
        findByUserId: vi.fn(),
        update: vi.fn(async order => order),
    }
}

function makeOrder() {
    return Order.create({
        userId: 'user-1',
        total: 200,
        items: [OrderItem.create({
            productId: 'product-1',
            quantity: 2,
            price: 100,
        })],
    })
}

describe('CancelOrderUseCase', () => {
    it('should cancel a pending order', async () => {
        const orderRepository = makeRepository()
        const cancelOrderUseCase = new CancelOrderUseCase(orderRepository)
        const order = makeOrder()
        vi.mocked(orderRepository.findById).mockResolvedValue(order)

        const result = await cancelOrderUseCase.execute({ orderId: order.id })

        expect(result.status).toBe('CANCELLED')
        expect(orderRepository.findById).toHaveBeenCalledWith(order.id)
        expect(orderRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            status: 'CANCELLED',
        }))
    })

    it('should throw when order does not exist', async () => {
        const orderRepository = makeRepository()
        const cancelOrderUseCase = new CancelOrderUseCase(orderRepository)
        vi.mocked(orderRepository.findById).mockResolvedValue(null)

        await expect(cancelOrderUseCase.execute({ orderId: 'missing-order' }))
            .rejects.toMatchObject({
                message: 'Pedido nao encontrado.',
                statusCode: 400,
            })
        expect(orderRepository.update).not.toHaveBeenCalled()
    })
})
