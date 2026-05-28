import { Product } from '../../src/domain/entities/product'
import { ProductRepository } from '../../src/domain/repositories/product-repository'

export class FakeProductRepository implements ProductRepository {
    public products: Product[] = []

    async create(product: Product): Promise<Product> {
        this.products.push(product)
        return product
    }

    async findById(id: string): Promise<Product | null> {
        return this.products.find(product => product.id === id) || null
    }

    async findExactMatch(product: Product): Promise<Product | null> {
        return this.products.find(existingProduct =>
            existingProduct.name.toLowerCase() === product.name.toLowerCase() &&
            existingProduct.description === product.description &&
            existingProduct.price === product.price
        ) || null
    }

    async findByName(name: string): Promise<Product[]> {
        return this.products.filter(product =>
            product.name.toLowerCase().includes(name.toLowerCase())
        )
    }

    async findAll(): Promise<Product[]> {
        return this.products
    }

    async update(product: Product): Promise<Product> {
        const index = this.products.findIndex(existingProduct => existingProduct.id === product.id)

        if (index >= 0) {
            this.products[index] = product
        }

        return product
    }

    async delete(id: string): Promise<void> {
        this.products = this.products.filter(product => product.id !== id)
    }

    async decreaseStock(productId: string, quantity: number): Promise<boolean> {
        const product = await this.findById(productId)

        if (!product || product.stock < quantity) {
            return false
        }

        product.stock -= quantity

        return true
    }
}
