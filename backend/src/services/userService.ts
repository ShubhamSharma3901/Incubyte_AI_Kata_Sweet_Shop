import prisma from '../config/database';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { CreateUserInput, LoginInput } from '../types';

export class UserService {
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