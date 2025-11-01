/**
 * @file Integration-style route tests covering Sweet endpoints.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import request from "supertest";

// Mock the database BEFORE importing app
vi.mock("../../config/database", () => {
	const mockUser = {
		findUnique: vi.fn(),
		create: vi.fn(),
	};

	const mockSweet = {
		findUnique: vi.fn(),
		findMany: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	};

	return {
		default: {
			user: mockUser,
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

describe("Sweet Routes", () => {
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
		// Default mock for authenticated requests
		mockAuthUtils.verifyToken.mockReturnValue(userDecodedToken);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe("POST /api/sweets", () => {
		it("should create a new sweet with valid data and authentication", async () => {
			const sweetData = {
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: 100,
				description: "Delicious Indian sweet",
			};

			const createdSweet = {
				id: "sweet-123",
				...sweetData,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			mockPrisma.sweet.findUnique.mockResolvedValue(null);
			mockPrisma.sweet.create.mockResolvedValue(createdSweet);

			const response = await request(app)
				.post("/api/sweets")
				.set("Authorization", `Bearer ${validToken}`)
				.send(sweetData)
				.expect(201);

			expect(response.body.message).toBe("Sweet created successfully");
			expect(response.body.sweet.name).toBe(sweetData.name);
			expect(response.body.sweet.category).toBe(sweetData.category);
			expect(response.body.sweet.price).toBe(sweetData.price);
			expect(response.body.sweet.quantity).toBe(sweetData.quantity);
		});

		it("should return 401 without authentication token", async () => {
			const sweetData = {
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: 100,
			};

			const response = await request(app)
				.post("/api/sweets")
				.send(sweetData)
				.expect(401);

			expect(response.body.error).toBe("Access denied. No token provided.");
		});

		it("should return 401 with invalid token", async () => {
			mockAuthUtils.verifyToken.mockImplementation(() => {
				throw new Error("Invalid token");
			});

			const sweetData = {
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: 100,
			};

			const response = await request(app)
				.post("/api/sweets")
				.set("Authorization", "Bearer invalid-token")
				.send(sweetData)
				.expect(401);

			expect(response.body.error).toBe("Invalid token.");
		});

		it("should return validation error for missing required fields", async () => {
			const invalidData = {
				category: "Traditional",
				price: 50.0,
			};

			const response = await request(app)
				.post("/api/sweets")
				.set("Authorization", `Bearer ${validToken}`)
				.send(invalidData)
				.expect(400);

			expect(response.body.error).toBe("Validation failed");
		});

		it("should return validation error for invalid price", async () => {
			const invalidData = {
				name: "Gulab Jamun",
				category: "Traditional",
				price: -10,
				quantity: 100,
			};

			const response = await request(app)
				.post("/api/sweets")
				.set("Authorization", `Bearer ${validToken}`)
				.send(invalidData)
				.expect(400);

			expect(response.body.error).toBe("Validation failed");
		});

		it("should return validation error for invalid quantity", async () => {
			const invalidData = {
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: -5,
			};

			const response = await request(app)
				.post("/api/sweets")
				.set("Authorization", `Bearer ${validToken}`)
				.send(invalidData)
				.expect(400);

			expect(response.body.error).toBe("Validation failed");
		});

		it("should return error if sweet name already exists", async () => {
			const sweetData = {
				name: "Existing Sweet",
				category: "Traditional",
				price: 50.0,
				quantity: 100,
			};

			const existingSweet = {
				id: "existing-123",
				name: "Existing Sweet",
				category: "Traditional",
				price: 50.0,
				quantity: 100,
			};

			mockPrisma.sweet.findUnique.mockResolvedValue(existingSweet);

			const response = await request(app)
				.post("/api/sweets")
				.set("Authorization", `Bearer ${validToken}`)
				.send(sweetData)
				.expect(400);

			expect(response.body.error).toBe("Sweet with this name already exists");
		});
	});

	describe("GET /api/sweets", () => {
		it("should return list of all sweets with authentication", async () => {
			const sweets = [
				{
					id: "sweet-1",
					name: "Gulab Jamun",
					category: "Traditional",
					price: 50.0,
					quantity: 100,
					description: "Delicious Indian sweet",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "sweet-2",
					name: "Rasgulla",
					category: "Traditional",
					price: 40.0,
					quantity: 150,
					description: "Soft and spongy",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			mockPrisma.sweet.findMany.mockResolvedValue(sweets);

			const response = await request(app)
				.get("/api/sweets")
				.set("Authorization", `Bearer ${validToken}`)
				.expect(200);

			expect(response.body.sweets).toHaveLength(2);
			expect(response.body.sweets[0].name).toBe("Gulab Jamun");
			expect(response.body.sweets[1].name).toBe("Rasgulla");
		});

		it("should return empty array when no sweets exist", async () => {
			mockPrisma.sweet.findMany.mockResolvedValue([]);

			const response = await request(app)
				.get("/api/sweets")
				.set("Authorization", `Bearer ${validToken}`)
				.expect(200);

			expect(response.body.sweets).toEqual([]);
		});

		it("should return 401 without authentication token", async () => {
			const response = await request(app).get("/api/sweets").expect(401);

			expect(response.body.error).toBe("Access denied. No token provided.");
		});

		it("should return 401 with invalid token", async () => {
			mockAuthUtils.verifyToken.mockImplementation(() => {
				throw new Error("Invalid token");
			});

			const response = await request(app)
				.get("/api/sweets")
				.set("Authorization", "Bearer invalid-token")
				.expect(401);

			expect(response.body.error).toBe("Invalid token.");
		});
	});

	describe("GET /api/sweets/search", () => {
		it("should search sweets by name", async () => {
			const searchResults = [
				{
					id: "sweet-1",
					name: "Gulab Jamun",
					category: "Traditional",
					price: 50.0,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			mockPrisma.sweet.findMany.mockResolvedValue(searchResults);

			const response = await request(app)
				.get("/api/sweets/search")
				.query({ name: "Gulab" })
				.set("Authorization", `Bearer ${validToken}`)
				.expect(200);

			expect(response.body.sweets).toHaveLength(1);
			expect(response.body.sweets[0].name).toContain("Gulab");
		});

		it("should search sweets by category", async () => {
			const searchResults = [
				{
					id: "sweet-1",
					name: "Gulab Jamun",
					category: "Traditional",
					price: 50.0,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "sweet-2",
					name: "Rasgulla",
					category: "Traditional",
					price: 40.0,
					quantity: 150,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			mockPrisma.sweet.findMany.mockResolvedValue(searchResults);

			const response = await request(app)
				.get("/api/sweets/search")
				.query({ category: "Traditional" })
				.set("Authorization", `Bearer ${validToken}`)
				.expect(200);

			expect(response.body.sweets).toHaveLength(2);
			expect(response.body.sweets[0].category).toBe("Traditional");
			expect(response.body.sweets[1].category).toBe("Traditional");
		});

		it("should search sweets by price range", async () => {
			const searchResults = [
				{
					id: "sweet-1",
					name: "Gulab Jamun",
					category: "Traditional",
					price: 50.0,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			mockPrisma.sweet.findMany.mockResolvedValue(searchResults);

			const response = await request(app)
				.get("/api/sweets/search")
				.query({ minPrice: 40, maxPrice: 60 })
				.set("Authorization", `Bearer ${validToken}`)
				.expect(200);

			expect(response.body.sweets).toHaveLength(1);
			expect(response.body.sweets[0].price).toBeGreaterThanOrEqual(40);
			expect(response.body.sweets[0].price).toBeLessThanOrEqual(60);
		});

		it("should search sweets with multiple criteria", async () => {
			const searchResults = [
				{
					id: "sweet-1",
					name: "Gulab Jamun",
					category: "Traditional",
					price: 50.0,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			mockPrisma.sweet.findMany.mockResolvedValue(searchResults);

			const response = await request(app)
				.get("/api/sweets/search")
				.query({
					name: "Gulab",
					category: "Traditional",
					minPrice: 40,
					maxPrice: 60,
				})
				.set("Authorization", `Bearer ${validToken}`)
				.expect(200);

			expect(response.body.sweets).toHaveLength(1);
		});

		it("should return empty array when no sweets match search criteria", async () => {
			mockPrisma.sweet.findMany.mockResolvedValue([]);

			const response = await request(app)
				.get("/api/sweets/search")
				.query({ name: "NonExistentSweet" })
				.set("Authorization", `Bearer ${validToken}`)
				.expect(200);

			expect(response.body.sweets).toEqual([]);
		});

		it("should return 401 without authentication token", async () => {
			const response = await request(app)
				.get("/api/sweets/search")
				.query({ name: "Gulab" })
				.expect(401);

			expect(response.body.error).toBe("Access denied. No token provided.");
		});

		it("should return validation error for invalid price range", async () => {
			const response = await request(app)
				.get("/api/sweets/search")
				.query({ minPrice: 100, maxPrice: 50 })
				.set("Authorization", `Bearer ${validToken}`)
				.expect(400);

			expect(response.body.error).toBe("Validation failed");
		});
	});

	describe("PUT /api/sweets/:id", () => {
		it("should update sweet with valid data and authentication", async () => {
			const sweetId = "sweet-123";
			const updateData = {
				name: "Updated Gulab Jamun",
				price: 55.0,
				quantity: 120,
			};

			const existingSweet = {
				id: sweetId,
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: 100,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const updatedSweet = {
				...existingSweet,
				...updateData,
				updatedAt: new Date(),
			};

			// Mock findUnique: first call returns existing sweet (by id), second call returns null (no name conflict)
			mockPrisma.sweet.findUnique
				.mockResolvedValueOnce(existingSweet) // First call: check if sweet exists
				.mockResolvedValueOnce(null); // Second call: check for name conflict
			mockPrisma.sweet.update.mockResolvedValue(updatedSweet);

			const response = await request(app)
				.put(`/api/sweets/${sweetId}`)
				.set("Authorization", `Bearer ${validToken}`)
				.send(updateData)
				.expect(200);

			expect(response.body.message).toBe("Sweet updated successfully");
			expect(response.body.sweet.name).toBe(updateData.name);
			expect(response.body.sweet.price).toBe(updateData.price);
			expect(response.body.sweet.quantity).toBe(updateData.quantity);
		});

		it("should return 404 if sweet does not exist", async () => {
			const sweetId = "non-existent-id";
			const updateData = {
				name: "Updated Sweet",
				price: 55.0,
			};

			mockPrisma.sweet.findUnique.mockResolvedValue(null);

			const response = await request(app)
				.put(`/api/sweets/${sweetId}`)
				.set("Authorization", `Bearer ${validToken}`)
				.send(updateData)
				.expect(404);

			expect(response.body.error).toBe("Sweet not found");
		});

		it("should return 401 without authentication token", async () => {
			const sweetId = "sweet-123";
			const updateData = {
				name: "Updated Sweet",
				price: 55.0,
			};

			const response = await request(app)
				.put(`/api/sweets/${sweetId}`)
				.send(updateData)
				.expect(401);

			expect(response.body.error).toBe("Access denied. No token provided.");
		});

		it("should return validation error for invalid update data", async () => {
			const sweetId = "sweet-123";
			const invalidData = {
				price: -10,
			};

			const existingSweet = {
				id: sweetId,
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: 100,
			};

			mockPrisma.sweet.findUnique.mockResolvedValue(existingSweet);

			const response = await request(app)
				.put(`/api/sweets/${sweetId}`)
				.set("Authorization", `Bearer ${validToken}`)
				.send(invalidData)
				.expect(400);

			expect(response.body.error).toBe("Validation failed");
		});

		it("should return error if updated name conflicts with existing sweet", async () => {
			const sweetId = "sweet-123";
			const updateData = {
				name: "Existing Sweet Name",
			};

			const existingSweet = {
				id: sweetId,
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: 100,
			};

			const conflictingSweet = {
				id: "other-sweet-id",
				name: "Existing Sweet Name",
				category: "Traditional",
				price: 50.0,
				quantity: 100,
			};

			// Mock findUnique: first call returns existing sweet (by id), second call returns conflicting sweet (name conflict)
			mockPrisma.sweet.findUnique
				.mockResolvedValueOnce(existingSweet) // First call: check if sweet exists
				.mockResolvedValueOnce(conflictingSweet); // Second call: check for name conflict - found conflict!

			const response = await request(app)
				.put(`/api/sweets/${sweetId}`)
				.set("Authorization", `Bearer ${validToken}`)
				.send(updateData)
				.expect(400);

			expect(response.body.error).toBe("Sweet with this name already exists");
		});
	});

	describe("DELETE /api/sweets/:id", () => {
		it("should delete sweet successfully with admin authentication", async () => {
			const sweetId = "sweet-123";

			const existingSweet = {
				id: sweetId,
				name: "Gulab Jamun",
				category: "Traditional",
				price: 50.0,
				quantity: 100,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			mockAuthUtils.verifyToken.mockReturnValue(adminDecodedToken);
			mockPrisma.sweet.findUnique.mockResolvedValue(existingSweet);
			mockPrisma.sweet.delete.mockResolvedValue(existingSweet);

			const response = await request(app)
				.delete(`/api/sweets/${sweetId}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.expect(200);

			expect(response.body.message).toBe("Sweet deleted successfully");
			expect(response.body.sweet.id).toBe(sweetId);
		});

		it("should return 403 for regular user (non-admin)", async () => {
			const sweetId = "sweet-123";

			const response = await request(app)
				.delete(`/api/sweets/${sweetId}`)
				.set("Authorization", `Bearer ${validToken}`)
				.expect(403);

			expect(response.body.error).toBe("Access denied. Admin role required.");
		});

		it("should return 404 if sweet does not exist", async () => {
			const sweetId = "non-existent-id";

			mockAuthUtils.verifyToken.mockReturnValue(adminDecodedToken);
			mockPrisma.sweet.findUnique.mockResolvedValue(null);

			const response = await request(app)
				.delete(`/api/sweets/${sweetId}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.expect(404);

			expect(response.body.error).toBe("Sweet not found");
		});

		it("should return 401 without authentication token", async () => {
			const sweetId = "sweet-123";

			const response = await request(app)
				.delete(`/api/sweets/${sweetId}`)
				.expect(401);

			expect(response.body.error).toBe("Access denied. No token provided.");
		});

		it("should return 401 with invalid token", async () => {
			mockAuthUtils.verifyToken.mockImplementation(() => {
				throw new Error("Invalid token");
			});

			const sweetId = "sweet-123";

			const response = await request(app)
				.delete(`/api/sweets/${sweetId}`)
				.set("Authorization", "Bearer invalid-token")
				.expect(401);

			expect(response.body.error).toBe("Invalid token.");
		});
	});
});
