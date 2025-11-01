/**
 * @file Express router defining authentication and profile endpoints for users.
 */
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { CreateUserSchema, LoginSchema } from '../types';

/** Router managing user authentication flows. */
const router = Router();
const userController = new UserController();

/** POST /api/users/register: Register a new user account. */
router.post('/register', validate(CreateUserSchema), userController.register);
/** POST /api/users/login: Authenticate an existing user. */
router.post('/login', validate(LoginSchema), userController.login);
/** GET /api/users/profile: Fetch the authenticated user's profile. */
router.get('/profile', authenticate, userController.getProfile);

export default router;
