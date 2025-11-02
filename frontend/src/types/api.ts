// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API endpoint types
export interface ApiEndpoints {
    auth: {
        login: string;
        register: string;
        logout: string;
        me: string;
    };
    sweets: {
        base: string;
        byId: (id: string) => string;
        search: string;
        purchase: (id: string) => string;
        restock: (id: string) => string;
    };
}

// Request configuration
export interface ApiRequestConfig {
    method: HttpMethod;
    url: string;
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
}

// Error response structure from backend
export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: {
        code?: string;
        details?: Record<string, any>;
        field?: string;
    };
}

// Success response structure from backend
export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
}

// Union type for all API responses
export type ApiResponseType<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Authentication response types
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        username: string;
        role: 'USER' | 'ADMIN';
        createdAt: string;
    };
    token?: string;
}

// Sweet search response
export interface SweetSearchResponse {
    sweets: Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        quantity: number;
        imageUrl?: string;
        createdAt: string;
        updatedAt: string;
    }>;
    total: number;
    page?: number;
    limit?: number;
}

// Purchase response
export interface PurchaseApiResponse {
    success: boolean;
    message: string;
    sweet: {
        id: string;
        name: string;
        description: string;
        price: number;
        quantity: number;
        imageUrl?: string;
        createdAt: string;
        updatedAt: string;
    };
}

// Restock response (admin only)
export interface RestockApiResponse {
    success: boolean;
    message: string;
    sweet: {
        id: string;
        name: string;
        description: string;
        price: number;
        quantity: number;
        imageUrl?: string;
        createdAt: string;
        updatedAt: string;
    };
}

// Network error types
export interface NetworkError {
    name: 'NetworkError';
    message: string;
    code?: string;
    status?: number;
}

// Validation error types
export interface ValidationError {
    name: 'ValidationError';
    message: string;
    field?: string;
    errors?: Record<string, string[]>;
}

// Authentication error types
export interface AuthError {
    name: 'AuthError';
    message: string;
    code?: 'UNAUTHORIZED' | 'FORBIDDEN' | 'TOKEN_EXPIRED';
}

// Union type for all error types
export type AppError = NetworkError | ValidationError | AuthError | Error;