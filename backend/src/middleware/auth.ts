import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { AuthenticatedRequest } from '../types';

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

export const requireAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ error: 'Access denied. Admin role required.' });
        return;
    }
    next();
};