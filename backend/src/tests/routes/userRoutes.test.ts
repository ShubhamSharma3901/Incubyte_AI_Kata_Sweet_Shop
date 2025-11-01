/**
 * @file Integration-style route tests covering User endpoints.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import request from "supertest";

// Mock the database BEFORE importing app
vi.mock("../../config/database", () => {
	const mockUser = {
		findUnique: vi.fn(),
		create: vi.fn(),
	};

	return {
		default: {
			user: mockUser,
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

describe("User Routes", () => {
	beforeEach(() => {
		// Clear mock call history but keep implementations
		vi.clearAllMocks();
	});

	afterEach(() => {
		// Reset mocks after each test
		vi.resetAllMocks();
	});

	describe("POST /api/users/register", () => {
		it("should register a new user", async () => {
			const userData = {
				email: "test@example.com",
				password: "password123",
				name: "Test User",
			};

			const hashedPassword = "hashed_password_123";
			const createdUser = {
				id: "user-123",
				email: userData.email,
				name: userData.name,
				role: "USER",
				createdAt: new Date(),
			};

			// Mock implementations
			mockPrisma.user.findUnique.mockResolvedValue(null);
			mockAuthUtils.hashPassword.mockResolvedValue(hashedPassword);
			mockPrisma.user.create.mockResolvedValue(createdUser);

			const response = await request(app)
				.post("/api/users/register")
				.send(userData)
				.expect(201);

			expect(response.body.message).toBe("User created successfully");
			expect(response.body.user.email).toBe(userData.email);
			expect(response.body.user.name).toBe(userData.name);
		});

		it("should return validation error for invalid email", async () => {
			const userData = {
				email: "invalid-email",
				password: "password123",
			};

			const response = await request(app)
				.post("/api/users/register")
				.send(userData)
				.expect(400);

			expect(response.body.error).toBe("Validation failed");
		});

		it("should return validation error for short password", async () => {
			const userData = {
				email: "test@example.com",
				password: "123",
			};

			const response = await request(app)
				.post("/api/users/register")
				.send(userData)
				.expect(400);

			expect(response.body.error).toBe("Validation failed");
		});
	});

	describe("POST /api/users/login", () => {
		it("should login with valid credentials", async () => {
			const userData = {
				email: "test@example.com",
				password: "password123",
				name: "Test User",
			};

			const dbUser = {
				id: "user-123",
				email: userData.email,
				name: userData.name,
				role: "USER",
				password: "hashed_password",
			};

			const token = "jwt_token_123";

			// Mock implementations for login
			mockPrisma.user.findUnique.mockResolvedValue(dbUser);
			mockAuthUtils.comparePassword.mockResolvedValue(true);
			mockAuthUtils.generateToken.mockReturnValue(token);

			const response = await request(app)
				.post("/api/users/login")
				.send({
					email: userData.email,
					password: userData.password,
				})
				.expect(200);

			expect(response.body.message).toBe("Login successful");
			expect(response.body.token).toBeDefined();
			expect(response.body.user.email).toBe(userData.email);
		});

		it("should return error for invalid credentials", async () => {
			// Mock user not found
			mockPrisma.user.findUnique.mockResolvedValue(null);

			const response = await request(app)
				.post("/api/users/login")
				.send({
					email: "nonexistent@example.com",
					password: "password123",
				})
				.expect(401);

			expect(response.body.error).toBe("Invalid credentials");
		});
	});

	describe("GET /api/users/profile", () => {
		it("should return user profile with valid token", async () => {
			const userData = {
				email: "test@example.com",
				password: "password123",
				name: "Test User",
			};

			const userId = "user-123";
			const token = "valid_jwt_token";
			const decodedToken = {
				id: userId,
				email: userData.email,
				role: "USER",
			};

			const dbUser = {
				id: userId,
				email: userData.email,
				name: userData.name,
				role: "USER",
				createdAt: new Date(),
			};

			// Mock token verification and user lookup
			mockAuthUtils.verifyToken.mockReturnValue(decodedToken);
			mockPrisma.user.findUnique.mockResolvedValue(dbUser);

			const response = await request(app)
				.get("/api/users/profile")
				.set("Authorization", `Bearer ${token}`)
				.expect(200);

			expect(response.body.user.email).toBe(userData.email);
			expect(response.body.user.name).toBe(userData.name);
		});

		it("should return error without token", async () => {
			const response = await request(app).get("/api/users/profile").expect(401);

			expect(response.body.error).toBe("Access denied. No token provided.");
		});

		it("should return error with invalid token", async () => {
			// Mock verifyToken to throw an error for invalid tokens
			mockAuthUtils.verifyToken.mockImplementation(() => {
				throw new Error("Invalid token");
			});

			const response = await request(app)
				.get("/api/users/profile")
				.set("Authorization", "Bearer invalid-token")
				.expect(401);

			expect(response.body.error).toBe("Invalid token.");
		});
	});
});
