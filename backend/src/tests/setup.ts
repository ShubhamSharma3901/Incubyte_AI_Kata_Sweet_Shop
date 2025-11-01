import { afterAll } from "vitest";

// Only create PrismaClient if DATABASE_URL is set (not in CI/test environments)
// In tests, we use mocks instead of real database connections
if (process.env.DATABASE_URL) {
	const { PrismaClient } = require("@prisma/client");
	const prisma = new PrismaClient();

	afterAll(async () => {
		await prisma.$disconnect();
	});
}
