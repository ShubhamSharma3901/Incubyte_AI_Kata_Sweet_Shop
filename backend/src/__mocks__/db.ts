/**
 * @file Provides a mocked Prisma client for unit testing.
 */
import { PrismaClient } from '@prisma/client'
import { mockDeep } from 'vitest-mock-extended'

/**
 * Deep mock of PrismaClient methods used within the application.
 */
export const prismaClient = mockDeep<PrismaClient>()
