import { BusinessError } from '../../../domain/errors/business-error'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface DeleteProductRequest {
    id: string
}
export class DeleteProductUseCase {
    constructor(
        private productRepository: ProductRepository
    ) {}

    async execute(request: DeleteProductRequest): Promise<void> {
        
        const product = await this.productRepository.findById(request.id)

        if (!product) {
            throw new BusinessError('Produto nao encontrado.')
        }

        await this.productRepository.delete(request.id)
    }
}
