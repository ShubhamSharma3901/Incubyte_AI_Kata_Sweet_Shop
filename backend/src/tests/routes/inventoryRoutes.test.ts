/**
 * @file Integration-style tests for inventory management endpoints.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";

// Mock the database BEFORE importing app
vi.mock("../../config/database", () => {
	const mockSweet = {
		findUnique: vi.fn(),
		update: vi.fn(),
	};

	return {
		default: {
			sweet: mockSweet,
		},
	};
});

// Mock auth utilities BEFORE importing app
vi.mock("../../utils/auth", () => ({
	hashPassword: vi.fn(),
	comparePassword: vi.fn(),
	generateToken: vi.fn(),
	verifyToken: vi.fn(),
}));

// Import app AFTER mocks are set up
import app from "../../index";

// Import the mocked modules
import prisma from "../../config/database";
import * as authUtils from "../../utils/auth";

const mockPrisma = prisma as any;
const mockAuthUtils = authUtils as any;

describe("Inventory Routes", () => {
	const validToken = "valid_jwt_token";
	const adminToken = "admin_jwt_token";
	const userDecodedToken = {
		id: "user-123",
		email: "user@example.com",
		role: "USER",
	};
	const adminDecodedToken = {
		id: "admin-123",
		email: "admin@example.com",
		role: "ADMIN",
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockAuthUtils.verifyToken.mockReturnValue(userDecodedToken);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	/** Inventory purchase endpoint expectations. */
	describe("POST /api/sweets/:id/purchase", () => {
		it("should purchase sweet and reduce quantity when sufficient stock exists", async () => {
			const sweetId = "sweet-123";
			const requestBody = { quantity: 5 };
			const existingSweet = {
				id: sweetId,
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: 10,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const updatedSweet = { ...existingSweet, quantity: existingSweet.quantity - requestBody.quantity };

			mockPrisma.sweet.findUnique.mockResolvedValue(existingSweet);
			mockPrisma.sweet.update.mockResolvedValue(updatedSweet);

			const response = await request(app)
				.post(`/api/sweets/${sweetId}/purchase`)
				.set("Authorization", `Bearer ${validToken}`)
				.send(requestBody)
				.expect(200);

			expect(mockAuthUtils.verifyToken).toHaveBeenCalledWith(validToken);
			expect(response.body.message).toBe("Sweet purchased successfully");
			expect(response.body.sweet.quantity).toBe(updatedSweet.quantity);
		});

		it("should return 400 when purchase quantity exceeds available stock", async () => {
			const sweetId = "sweet-123";
			const requestBody = { quantity: 15 };
			const existingSweet = {
				id: sweetId,
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: 10,
			};

			mockPrisma.sweet.findUnique.mockResolvedValue(existingSweet);

			const response = await request(app)
				.post(`/api/sweets/${sweetId}/purchase`)
				.set("Authorization", `Bearer ${validToken}`)
				.send(requestBody)
				.expect(400);

			expect(response.body.error).toBe("Insufficient quantity available");
		});

		it("should return 404 when purchasing a non-existent sweet", async () => {
			const sweetId = "missing-id";

			mockPrisma.sweet.findUnique.mockResolvedValue(null);

			const response = await request(app)
				.post(`/api/sweets/${sweetId}/purchase`)
				.set("Authorization", `Bearer ${validToken}`)
				.send({ quantity: 1 })
				.expect(404);

			expect(response.body.error).toBe("Sweet not found");
		});

		it("should return 400 for invalid purchase quantity", async () => {
			const sweetId = "sweet-123";

			const response = await request(app)
				.post(`/api/sweets/${sweetId}/purchase`)
				.set("Authorization", `Bearer ${validToken}`)
				.send({ quantity: 0 })
				.expect(400);

			expect(response.body.error).toBe("Validation failed");
		});

		it("should return 401 without authentication token", async () => {
			const sweetId = "sweet-123";

			const response = await request(app)
				.post(`/api/sweets/${sweetId}/purchase`)
				.send({ quantity: 2 })
				.expect(401);

			expect(response.body.error).toBe("Access denied. No token provided.");
		});
	});

	/** Inventory restock endpoint expectations (admin only). */
	describe("POST /api/sweets/:id/restock", () => {
		it("should restock sweet and increase quantity when requested by admin", async () => {
			const sweetId = "sweet-123";
			const requestBody = { quantity: 20 };
			const existingSweet = {
				id: sweetId,
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: 10,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const updatedSweet = { ...existingSweet, quantity: existingSweet.quantity + requestBody.quantity };

			mockAuthUtils.verifyToken.mockReturnValue(adminDecodedToken);
			mockPrisma.sweet.findUnique.mockResolvedValue(existingSweet);
			mockPrisma.sweet.update.mockResolvedValue(updatedSweet);

			const response = await request(app)
				.post(`/api/sweets/${sweetId}/restock`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send(requestBody)
				.expect(200);

			expect(mockAuthUtils.verifyToken).toHaveBeenCalledWith(adminToken);
			expect(response.body.message).toBe("Sweet restocked successfully");
			expect(response.body.sweet.quantity).toBe(updatedSweet.quantity);
		});

		it("should return 403 when non-admin attempts to restock", async () => {
			const sweetId = "sweet-123";

			mockAuthUtils.verifyToken.mockReturnValue(userDecodedToken);

			const response = await request(app)
				.post(`/api/sweets/${sweetId}/restock`)
				.set("Authorization", `Bearer ${validToken}`)
				.send({ quantity: 5 })
				.expect(403);

			expect(response.body.error).toBe("Access denied. Admin role required.");
		});

		it("should return 404 when restocking a non-existent sweet", async () => {
			const sweetId = "missing-id";

			mockAuthUtils.verifyToken.mockReturnValue(adminDecodedToken);
			mockPrisma.sweet.findUnique.mockResolvedValue(null);

			const response = await request(app)
				.post(`/api/sweets/${sweetId}/restock`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ quantity: 10 })
				.expect(404);

			expect(response.body.error).toBe("Sweet not found");
		});

		it("should return 400 for invalid restock quantity", async () => {
			const sweetId = "sweet-123";

			mockAuthUtils.verifyToken.mockReturnValue(adminDecodedToken);

			const response = await request(app)
				.post(`/api/sweets/${sweetId}/restock`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ quantity: 0 })
				.expect(400);

			expect(response.body.error).toBe("Validation failed");
		});

		it("should return 401 when no authentication token is provided", async () => {
			const sweetId = "sweet-123";

			const response = await request(app)
				.post(`/api/sweets/${sweetId}/restock`)
				.send({ quantity: 5 })
				.expect(401);

			expect(response.body.error).toBe("Access denied. No token provided.");
		});
	});
});
