import {z} from 'zod';

export const addItemToCartSchema = z.object({
    productId: z.uuid({ version: 'v4' }),
    quantity: z.number().int().positive(),
})
