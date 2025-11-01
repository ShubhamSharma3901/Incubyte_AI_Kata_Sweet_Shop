/**
 * @file Shared Zod schemas and TypeScript types used across the application.
 */
import { z } from "zod";
import { Request } from "express";

/** Validation schema for creating a new user. */
export const CreateUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	name: z.string().optional(),
});

/** Validation schema for logging a user in. */
export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Express request augmented with the authenticated user's identity.
 */
export interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		email: string;
		role: string;
	};
}

/** Validation schema for creating a new sweet product. */
export const CreateSweetSchema = z.object({
	name: z.string().min(1, "Name is required"),
	category: z.string().min(1, "Category is required"),
	price: z.number().positive("Price must be positive"),
	quantity: z.number().int().min(0, "Quantity must be non-negative"),
	description: z.string().optional(),
});

/** Validation schema for updating an existing sweet. */
export const UpdateSweetSchema = z.object({
	name: z.string().min(1).optional(),
	category: z.string().min(1).optional(),
	price: z.coerce.number().positive().optional(),
	quantity: z.coerce.number().int().min(0).optional(),
	description: z.string().optional(),
});

/** Validation schema for searching sweets via query parameters. */
export const SearchSweetSchema = z
	.object({
		name: z.string().optional(),
		category: z.string().optional(),
		minPrice: z.coerce.number().positive().optional(),
		maxPrice: z.coerce.number().positive().optional(),
	})
	.refine(
		(data) => {
			if (data.minPrice && data.maxPrice) {
				return data.minPrice <= data.maxPrice;
			}
			return true;
		},
		{
			message: "minPrice must be less than or equal to maxPrice",
			path: ["maxPrice"],
		}
	);

export type CreateSweetInput = z.infer<typeof CreateSweetSchema>;
export type UpdateSweetInput = z.infer<typeof UpdateSweetSchema>;
export type SearchSweetInput = z.infer<typeof SearchSweetSchema>;

/** Validation schema for purchasing inventory. */
export const PurchaseSweetSchema = z.object({
	quantity: z.coerce
		.number()
		.int()
		.positive("Purchase quantity must be greater than zero"),
});

/** Validation schema for restocking inventory. */
export const RestockSweetSchema = z.object({
	quantity: z.coerce
		.number()
		.int()
		.positive("Restock quantity must be greater than zero"),
});

export type PurchaseSweetInput = z.infer<typeof PurchaseSweetSchema>;
export type RestockSweetInput = z.infer<typeof RestockSweetSchema>;
