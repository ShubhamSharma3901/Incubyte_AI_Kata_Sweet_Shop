/**
 * @file Controller translating user-related service operations into HTTP responses.
 */
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthenticatedRequest } from '../types';

const userService = new UserService();

/**
 * Handles user onboarding and authentication endpoints.
 */
export class UserController {
    /**
     * Creates a new user account from the request payload.
     *
     * @param req Express request containing registration details.
     * @param res Express response returning the newly created user.
     */
    async register(req: Request, res: Response) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json({
                message: 'User created successfully',
                user,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Authenticates a user and issues a JWT token.
     *
     * @param req Express request containing login credentials.
     * @param res Express response returning the token and user summary.
     */
    async login(req: Request, res: Response) {
        try {
            const result = await userService.loginUser(req.body);
            res.json({
                message: 'Login successful',
                ...result,
            });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    /**
     * Returns the profile of the currently authenticated user.
     *
     * @param req Express request augmented with authenticated user metadata.
     * @param res Express response returning the user profile.
     */
    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const user = await userService.getUserById(req.user!.id);
            res.json({ user });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }
}
