import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { UserService } from '../../services/userService';

// Mock the database
vi.mock('../../config/database', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    },
}));

// Mock auth utilities
vi.mock('../../utils/auth', () => ({
    hashPassword: vi.fn(),
    comparePassword: vi.fn(),
    generateToken: vi.fn(),
}));

// Import the mocked modules
import prisma from '../../config/database';
import * as authUtils from '../../utils/auth';

describe('UserService', () => {
    let userService: UserService;
    const mockPrisma = prisma as any;
    const mockAuthUtils = authUtils as any;

    beforeEach(() => {
        userService = new UserService();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            const hashedPassword = 'hashed_password_123';
            const createdUser = {
                id: 'user-123',
                email: userData.email,
                name: userData.name,
                role: 'USER',
                createdAt: new Date(),
            };

            // Mock implementations
            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockAuthUtils.hashPassword.mockResolvedValue(hashedPassword);
            mockPrisma.user.create.mockResolvedValue(createdUser);

            const result = await userService.createUser(userData);

            // Verify database calls
            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: userData.email },
            });
            expect(mockAuthUtils.hashPassword).toHaveBeenCalledWith(userData.password);
            expect(mockPrisma.user.create).toHaveBeenCalledWith({
                data: {
                    ...userData,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                },
            });

            expect(result).toEqual(createdUser);
        });

        it('should throw error if user already exists', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            const existingUser = {
                id: 'existing-user-123',
                email: userData.email,
            };

            mockPrisma.user.findUnique.mockResolvedValue(existingUser);

            await expect(userService.createUser(userData)).rejects.toThrow(
                'User already exists'
            );

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: userData.email },
            });
            expect(mockAuthUtils.hashPassword).not.toHaveBeenCalled();
            expect(mockPrisma.user.create).not.toHaveBeenCalled();
        });

        it('should handle database errors during user creation', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockAuthUtils.hashPassword.mockResolvedValue('hashed_password');
            mockPrisma.user.create.mockRejectedValue(new Error('Database error'));

            await expect(userService.createUser(userData)).rejects.toThrow('Database error');
        });

        it('should handle password hashing errors', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockAuthUtils.hashPassword.mockRejectedValue(new Error('Hashing failed'));

            await expect(userService.createUser(userData)).rejects.toThrow('Hashing failed');
        });
    });

    describe('loginUser', () => {
        it('should login user with valid credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123',
            };

            const dbUser = {
                id: 'user-123',
                email: loginData.email,
                name: 'Test User',
                role: 'USER',
                password: 'hashed_password',
            };

            const token = 'jwt_token_123';

            mockPrisma.user.findUnique.mockResolvedValue(dbUser);
            mockAuthUtils.comparePassword.mockResolvedValue(true);
            mockAuthUtils.generateToken.mockReturnValue(token);

            const result = await userService.loginUser(loginData);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: loginData.email },
            });
            expect(mockAuthUtils.comparePassword).toHaveBeenCalledWith(
                loginData.password,
                dbUser.password
            );
            expect(mockAuthUtils.generateToken).toHaveBeenCalledWith({
                id: dbUser.id,
                email: dbUser.email,
                role: dbUser.role,
            });

            expect(result).toEqual({
                token,
                user: {
                    id: dbUser.id,
                    email: dbUser.email,
                    name: dbUser.name,
                    role: dbUser.role,
                },
            });
        });

        it('should throw error with invalid email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(userService.loginUser(loginData)).rejects.toThrow(
                'Invalid credentials'
            );

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: loginData.email },
            });
            expect(mockAuthUtils.comparePassword).not.toHaveBeenCalled();
            expect(mockAuthUtils.generateToken).not.toHaveBeenCalled();
        });

        it('should throw error with invalid password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            const dbUser = {
                id: 'user-123',
                email: loginData.email,
                password: 'hashed_password',
            };

            mockPrisma.user.findUnique.mockResolvedValue(dbUser);
            mockAuthUtils.comparePassword.mockResolvedValue(false);

            await expect(userService.loginUser(loginData)).rejects.toThrow(
                'Invalid credentials'
            );

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: loginData.email },
            });
            expect(mockAuthUtils.comparePassword).toHaveBeenCalledWith(
                loginData.password,
                dbUser.password
            );
            expect(mockAuthUtils.generateToken).not.toHaveBeenCalled();
        });

        it('should handle database errors during login', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123',
            };

            mockPrisma.user.findUnique.mockRejectedValue(new Error('Database connection failed'));

            await expect(userService.loginUser(loginData)).rejects.toThrow(
                'Database connection failed'
            );
        });

        it('should handle password comparison errors', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123',
            };

            const dbUser = {
                id: 'user-123',
                email: loginData.email,
                password: 'hashed_password',
            };

            mockPrisma.user.findUnique.mockResolvedValue(dbUser);
            mockAuthUtils.comparePassword.mockRejectedValue(new Error('Comparison failed'));

            await expect(userService.loginUser(loginData)).rejects.toThrow('Comparison failed');
        });
    });

    describe('getUserById', () => {
        it('should return user by id', async () => {
            const userId = 'user-123';
            const dbUser = {
                id: userId,
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
                createdAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(dbUser);

            const result = await userService.getUserById(userId);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                },
            });

            expect(result).toEqual(dbUser);
        });

        it('should throw error if user not found', async () => {
            const userId = 'nonexistent-id';

            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(userService.getUserById(userId)).rejects.toThrow(
                'User not found'
            );

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                },
            });
        });

        it('should handle database errors during user lookup', async () => {
            const userId = 'user-123';

            mockPrisma.user.findUnique.mockRejectedValue(new Error('Database timeout'));

            await expect(userService.getUserById(userId)).rejects.toThrow('Database timeout');
        });

        it('should handle empty string user id', async () => {
            const userId = '';

            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(userService.getUserById(userId)).rejects.toThrow(
                'User not found'
            );
        });
    });

    describe('Edge cases and error handling', () => {
        it('should handle createUser with minimal data', async () => {
            const userData = {
                email: 'minimal@example.com',
                password: 'password123',
            };

            const hashedPassword = 'hashed_password_123';
            const createdUser = {
                id: 'user-123',
                email: userData.email,
                name: null,
                role: 'USER',
                createdAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockAuthUtils.hashPassword.mockResolvedValue(hashedPassword);
            mockPrisma.user.create.mockResolvedValue(createdUser);

            const result = await userService.createUser(userData);

            expect(result).toEqual(createdUser);
            expect(mockPrisma.user.create).toHaveBeenCalledWith({
                data: {
                    ...userData,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                },
            });
        });

        it('should handle token generation errors during login', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123',
            };

            const dbUser = {
                id: 'user-123',
                email: loginData.email,
                name: 'Test User',
                role: 'USER',
                password: 'hashed_password',
            };

            mockPrisma.user.findUnique.mockResolvedValue(dbUser);
            mockAuthUtils.comparePassword.mockResolvedValue(true);
            mockAuthUtils.generateToken.mockImplementation(() => {
                throw new Error('Token generation failed');
            });

            await expect(userService.loginUser(loginData)).rejects.toThrow(
                'Token generation failed'
            );
        });
    });
});