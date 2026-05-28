import { describe, expect, it } from 'vitest'
import { Product } from '../../../src/domain/entities/product'
import { BusinessError } from '../../../src/domain/errors/business-error'
import { InvalidNameError } from '../../../src/domain/errors/invalid-name-error'

describe('Product', () => {
    it('should create a valid product', () => {
        const product = Product.create({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })

        expect(product).toHaveProperty('id')
        expect(product.name).toBe('Keyboard')
        expect(product.description).toBe('Mechanical keyboard')
        expect(product.price).toBe(250)
        expect(product.stock).toBe(10)
        expect(product.createdAt).toBeInstanceOf(Date)
    })

    it('should update a product with valid data', () => {
        const product = Product.create({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })

        product.update({
            name: 'Mouse',
            price: 120,
            stock: 5,
        })

        expect(product.name).toBe('Mouse')
        expect(product.description).toBe('Mechanical keyboard')
        expect(product.price).toBe(120)
        expect(product.stock).toBe(5)
    })

    it('should throw InvalidNameError when name is empty', () => {
        expect(() => Product.create({
            name: '',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })).toThrow(InvalidNameError)
    })

    it('should throw BusinessError when description is empty', () => {
        expect(() => Product.create({
            name: 'Keyboard',
            description: '',
            price: 250,
            stock: 10,
        })).toThrow(BusinessError)
    })

    it('should throw BusinessError when stock is negative', () => {
        expect(() => Product.create({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: -1,
        })).toThrow(BusinessError)
    })
})
