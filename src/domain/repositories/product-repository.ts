import { Product } from '../entities/product'

export interface ProductRepository {
    
    create(product: Product): Promise<Product>
    
    findById(id: string): Promise<Product | null>

    findByName(name: string): Promise<Product[]>
    
    findAll(): Promise<Product[]>
    
    update(product: Product): Promise<Product>
    
    delete(id: string): Promise<void>
}