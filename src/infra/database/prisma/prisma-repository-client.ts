import type { PrismaClient } from '@prisma/client'

export type PrismaRepositoryClient = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>
