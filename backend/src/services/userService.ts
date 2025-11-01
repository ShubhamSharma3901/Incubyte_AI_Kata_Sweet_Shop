/**
 * @file Service encapsulating business logic for user management.
 */
import prisma from '../config/database';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { CreateUserInput, LoginInput } from '../types';

/**
 * Provides registration, authentication, and profile retrieval operations.
 */
export class UserService {
    /**
     * Registers a new user, hashing the password and enforcing unique email.
     *
     * @param userData Validated registration payload.
     * @returns Promise resolving to the persisted user summary.
     */
    async createUser(userData: CreateUserInput) {
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await hashPassword(userData.password);

        const user = await prisma.user.create({
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

        return user;
    }

    /**
     * Authenticates a user and returns a signed token alongside user details.
     *
     * @param loginData Login credentials provided by the caller.
     * @returns Promise resolving to the token and user information.
     */
    async loginUser(loginData: LoginInput) {
        const user = await prisma.user.findUnique({
            where: { email: loginData.email },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await comparePassword(loginData.password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    /**
     * Retrieves a user by identifier, throwing if the user is missing.
     *
     * @param id Unique identifier for the user.
     * @returns Promise resolving to the user's profile information.
     */
    async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}
