import { CartDTO, toCartDTO } from '../../dtos/cart-dto'
import { Cart } from '../../../domain/entities/cart'
import { CartItem } from '../../../domain/entities/cart-item'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, TransactionContext } from '../../../domain/managers/ITransactionManager'
import { CartRepository } from '../../../domain/repositories/cart-repository'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface AddItemToCartRequest {
    userId: string
    productId: string
    quantity: number
}

/**
 * Factories usadas para vincular os repositorios a transacao em execucao.
 * Isso mantem o caso de uso independente da implementacao do banco de dados.
 */
type CartRepositoryFactory = (tx: TransactionContext) => CartRepository
type ProductRepositoryFactory = (tx: TransactionContext) => ProductRepository

/**
 * Adiciona um produto ao carrinho do usuario.
 *
 * Regras de negocio:
 * - O produto precisa existir.
 * - A quantidade solicitada nao pode ser maior que o estoque disponivel.
 * - Se o usuario ainda nao tiver carrinho, um novo carrinho e criado.
 * - A criacao do carrinho e a atualizacao dos itens rodam na mesma transacao.
 */
export class AddItemToCartUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private cartRepositoryFactory: CartRepositoryFactory,
        private productRepositoryFactory: ProductRepositoryFactory
    ) {}

    /**
     * Executa o fluxo de adicionar item e retorna o carrinho atualizado como DTO.
     */
    async execute(request: AddItemToCartRequest): Promise<CartDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const cartRepository = this.cartRepositoryFactory(tx)
            const productRepository = this.productRepositoryFactory(tx)
            
            const product = await productRepository.findById(request.productId)

            if (!product) {
                throw new BusinessError('Produto não encontrado.')
            }

            if (product.stock < request.quantity) {
                throw new BusinessError('Stock insuficiente.')
            }

            const existingCart = await cartRepository.findByUserId(request.userId)
            
            const cart = existingCart ?? Cart.create({ userId: request.userId })

            if (!existingCart) {
                await cartRepository.create(cart)
            }

            const item = CartItem.create({
                cartId: cart.id,
                productId: request.productId,
                quantity: request.quantity,
            })

            cart.addItem(item)

            const updatedCart = await cartRepository.update(cart)

            return toCartDTO(updatedCart)
        })
    }
}
