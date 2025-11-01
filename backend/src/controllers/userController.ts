import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthenticatedRequest } from '../types';

const userService = new UserService();

export class UserController {
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

    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const user = await userService.getUserById(req.user!.id);
            res.json({ user });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }
}