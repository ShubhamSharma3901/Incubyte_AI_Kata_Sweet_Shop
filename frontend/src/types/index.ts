// Core entity interfaces
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
}

export interface Sweet {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
}

// Authentication form data types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Sweet management form data types
export interface CreateSweetData {
    name: string;
    category: string;
    price: number;
    quantity: number;
}

export interface UpdateSweetData {
    name?: string;
    category?: string;
    price?: number;
    quantity?: number;
}

// Filter and search types
export interface SweetFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
}

// API response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    code?: string;
    field?: string;
    details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Purchase related types
export interface PurchaseRequest {
    sweetId: string;
    quantity: number;
}

export interface PurchaseResponse {
    success: boolean;
    message: string;
    updatedSweet: Sweet;
}