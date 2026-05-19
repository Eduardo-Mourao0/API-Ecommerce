import { z } from 'zod'

export const createUserSchema = z.object({
    name: z.string().trim().min(3).max(100),
    email: z.email(),
    password: z.string().min(4).max(100),
})

export const loginUserSchema = z.object({
    email: z.email(),
    password: z.string().min(4).max(100),
})