/**
 * @file Authentication and authorization middleware helpers.
 */
import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { AuthenticatedRequest } from '../types';

/**
 * Ensures the request contains a valid bearer token and attaches the decoded payload.
 *
 * @param req Express request with optional authenticated user payload.
 * @param res Express response used for returning authentication errors.
 * @param next Invokes the next middleware when authentication succeeds.
 */
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

/**
 * Requires the authenticated user to have an ADMIN role; otherwise responds with 403.
 *
 * @param req Authenticated request expected to include `user` metadata.
 * @param res Express response used for returning authorization errors.
 * @param next Invokes the next middleware when authorization succeeds.
 */
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
