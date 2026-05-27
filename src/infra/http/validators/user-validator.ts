import { z } from 'zod'

const createUserShape = {
    name: z.string().trim().min(3).max(100),
    email: z.email(),
    password: z.string().min(4).max(100),
}

export const createUserSchema = z.object(createUserShape).strict()

export const createUserByAdminSchema = z.object({
    ...createUserShape,
    role: z.enum(['ADMIN', 'CLIENT']),
}).strict()

export const loginUserSchema = z.object({
    email: z.email(),
    password: z.string().min(1).max(100),
}).strict()
