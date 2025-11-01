import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { CreateUserSchema, LoginSchema } from '../types';

const router = Router();
const userController = new UserController();

router.post('/register', validate(CreateUserSchema), userController.register);
router.post('/login', validate(LoginSchema), userController.login);
router.get('/profile', authenticate, userController.getProfile);

export default router;