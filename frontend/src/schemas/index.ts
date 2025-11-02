import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters long'),
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Name is required')
            .min(2, 'Name must be at least 2 characters long')
            .max(50, 'Name must be less than 50 characters'),
        email: z
            .email('Please enter a valid email address')
            .min(1, 'Email is required'),
        password: z
            .string()
            .min(1, 'Password is required')
            .min(6, 'Password must be at least 6 characters long')
            .max(100, 'Password must be less than 100 characters'),
        confirmPassword: z
            .string()
            .min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

// Sweet management schemas
export const createSweetSchema = z.object({
    name: z
        .string()
        .min(1, 'Sweet name is required')
        .min(2, 'Sweet name must be at least 2 characters long')
        .max(100, 'Sweet name must be less than 100 characters'),
    category: z
        .string()
        .min(1, 'Category is required')
        .min(2, 'Category must be at least 2 characters long')
        .max(50, 'Category must be less than 50 characters'),
    price: z
        .number()
        .min(0.01, 'Price must be greater than 0')
        .max(1000, 'Price must be less than $1000'),
    quantity: z
        .number()
        .int('Quantity must be a whole number')
        .min(0, 'Quantity cannot be negative')
        .max(10000, 'Quantity must be less than 10,000'),
});

export const updateSweetSchema = z.object({
    name: z
        .string()
        .min(2, 'Sweet name must be at least 2 characters long')
        .max(100, 'Sweet name must be less than 100 characters')
        .optional(),
    category: z
        .string()
        .min(2, 'Category must be at least 2 characters long')
        .max(50, 'Category must be less than 50 characters')
        .optional(),
    price: z
        .number()
        .min(0.01, 'Price must be greater than 0')
        .max(1000, 'Price must be less than $1000')
        .optional(),
    quantity: z
        .number()
        .int('Quantity must be a whole number')
        .min(0, 'Quantity cannot be negative')
        .max(10000, 'Quantity must be less than 10,000')
        .optional(),
});

// Search and filter schemas
export const sweetFiltersSchema = z.object({
    category: z.string().optional(),
    minPrice: z
        .number()
        .min(0, 'Minimum price cannot be negative')
        .optional(),
    maxPrice: z
        .number()
        .min(0, 'Maximum price cannot be negative')
        .optional(),
    inStock: z.boolean().optional(),
}).refine((data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
    }
    return true;
}, {
    message: 'Minimum price cannot be greater than maximum price',
    path: ['minPrice'],
});

export const searchSchema = z.object({
    query: z
        .string()
        .max(100, 'Search query must be less than 100 characters')
        .optional(),
});

// Purchase schema
export const purchaseSchema = z.object({
    sweetId: z
        .string()
        .min(1, 'Sweet ID is required'),
    quantity: z
        .number()
        .int('Quantity must be a whole number')
        .min(1, 'Quantity must be at least 1')
        .max(100, 'Cannot purchase more than 100 items at once'),
});

// Type exports for use with react-hook-form
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateSweetFormData = z.infer<typeof createSweetSchema>;
export type UpdateSweetFormData = z.infer<typeof updateSweetSchema>;
export type SweetFiltersFormData = z.infer<typeof sweetFiltersSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type PurchaseFormData = z.infer<typeof purchaseSchema>;