/**
 * @file Provides reusable validation middleware built on Zod schemas.
 */
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type ValidateOptions = {
	query?: boolean;
};

/**
 * Creates an Express middleware that validates the request body or query params.
 *
 * @param schema Zod schema describing the expected payload shape.
 * @param options Optional configuration for targeting query validation.
 * @returns Middleware that responds with HTTP 400 on validation failure.
 */
export const validate = (schema: ZodSchema, options?: ValidateOptions) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		try {
			if (options?.query) {
				// Validate query parameters
				schema.parse(req.query);
			} else {
				// Validate request body
				// For POST requests, body is required
				if (
					req.method === "POST" &&
					(!req.body || Object.keys(req.body).length === 0)
				) {
					res.status(400).json({
						error: "Validation failed",
						message: "Request body is required",
					});
					return;
				}
				// For PUT/PATCH, body might be empty or have optional fields
				// Parse the body (empty object {} is valid if all fields are optional)
				const body = req.body || {};
				schema.parse(body);
			}
			next();
		} catch (error: any) {
			res.status(400).json({
				error: "Validation failed",
				details: error.errors,
			});
		}
	};
};
