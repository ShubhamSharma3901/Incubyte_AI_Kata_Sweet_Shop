import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Check if body exists
            if (!req.body || Object.keys(req.body).length === 0) {
                res.status(400).json({
                    error: 'Validation failed',
                    message: 'Request body is required'
                });
                return;
            }

            schema.parse(req.body);
            next();
        } catch (error: any) {
            res.status(400).json({
                error: 'Validation failed',
                details: error.errors,
            });
        }
    };
};