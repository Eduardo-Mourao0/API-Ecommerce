import { z } from 'zod'

export const createProductSchema = z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().min(2).max(255),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
})

export const updateProductSchema = createProductSchema.partial().refine(
    data => Object.keys(data).length > 0,
    { message: 'Informe ao menos um campo para atualizar.' }
)
