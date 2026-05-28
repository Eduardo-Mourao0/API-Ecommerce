import { describe, expect, it } from 'vitest'
import { CancelOrderUseCase } from '../../../../src/application/use-cases/order/cancel-order'
import { Order } from '../../../../src/domain/entities/order'
import { OrderItem } from '../../../../src/domain/entities/order-item'
import { FakeOrderRepository } from '../../../fakes/fake-order-repository'

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
        const orderRepository = new FakeOrderRepository()
        const cancelOrderUseCase = new CancelOrderUseCase(orderRepository)
        const order = makeOrder()
        orderRepository.orders.push(order)

        const result = await cancelOrderUseCase.execute({ orderId: order.id })

        expect(result.status).toBe('CANCELLED')
        expect(orderRepository.orders[0].status).toBe('CANCELLED')
    })

    it('should throw when order does not exist', async () => {
        const orderRepository = new FakeOrderRepository()
        const cancelOrderUseCase = new CancelOrderUseCase(orderRepository)

        await expect(cancelOrderUseCase.execute({ orderId: 'missing-order' }))
            .rejects.toMatchObject({
                message: 'Pedido nao encontrado.',
                statusCode: 400,
            })
    })
})
