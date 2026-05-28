import { describe, expect, it } from 'vitest'
import { PayOrderUseCase } from '../../../../src/application/use-cases/order/pay-order'
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

describe('PayOrderUseCase', () => {
    it('should pay a pending order', async () => {
        const orderRepository = new FakeOrderRepository()
        const payOrderUseCase = new PayOrderUseCase(orderRepository)
        const order = makeOrder()
        orderRepository.orders.push(order)

        const result = await payOrderUseCase.execute({ orderId: order.id })

        expect(result.status).toBe('PAID')
        expect(orderRepository.orders[0].status).toBe('PAID')
    })

    it('should throw when order does not exist', async () => {
        const orderRepository = new FakeOrderRepository()
        const payOrderUseCase = new PayOrderUseCase(orderRepository)

        await expect(payOrderUseCase.execute({ orderId: 'missing-order' }))
            .rejects.toMatchObject({
                message: 'Pedido nao encontrado.',
                statusCode: 400,
            })
    })
})
