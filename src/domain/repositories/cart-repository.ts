import { Cart } from '../entities/cart'

export interface CartRepository {
  
    create(cart: Cart): Promise<Cart>
  
    findByUserId(userId: string): Promise<Cart | null>
  
    update(cart: Cart): Promise<Cart>
  
    clear(cartId: string): Promise<void>
}