import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./src/tests/setup.ts"],
		include: ["src/**/*.test.ts"],
		exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
		env: {
			// Dummy DATABASE_URL to prevent Prisma from throwing errors
			DATABASE_URL:
				process.env.DATABASE_URL ||
				"postgresql://dummy:dummy@localhost:5432/dummy",
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"dist/",
				"prisma/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/coverage/**",
			],
		},
	},
});
