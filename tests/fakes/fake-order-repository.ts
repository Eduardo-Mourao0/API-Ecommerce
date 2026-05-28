import { Order } from '../../src/domain/entities/order'
import { IOrderRepository } from '../../src/domain/repositories/order-repository'

export class FakeOrderRepository implements IOrderRepository {
    public orders: Order[] = []

    async create(order: Order): Promise<Order> {
        this.orders.push(order)
        return order
    }

    async findById(id: string): Promise<Order | null> {
        return this.orders.find(order => order.id === id) || null
    }

    async findByUserId(userId: string): Promise<Order[]> {
        return this.orders.filter(order => order.userId === userId)
    }

    async update(order: Order): Promise<Order> {
        const index = this.orders.findIndex(existingOrder => existingOrder.id === order.id)

        if (index >= 0) {
            this.orders[index] = order
        }

        return order
    }
}
