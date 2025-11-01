/**
 * @file Creates a singleton Prisma client instance for database access.
 */
import { PrismaClient } from '@prisma/client';

declare global {
    var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = prisma;
}

/**
 * Reusable Prisma client for interacting with the database.
 */
export default prisma;
