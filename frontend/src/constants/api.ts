import type { ApiEndpoints } from '../types/api';

// Base API URL - should be configured via environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// API endpoints configuration
export const API_ENDPOINTS: ApiEndpoints = {
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        logout: '/api/auth/logout',
        me: '/api/auth/me',
    },
    sweets: {
        base: '/api/sweets',
        byId: (id: string) => `/api/sweets/${id}`,
        search: '/api/sweets/search',
        purchase: (id: string) => `/api/sweets/${id}/purchase`,
        restock: (id: string) => `/api/sweets/${id}/restock`,
    },
};

// HTTP status codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000;

// Default pagination settings
export const DEFAULT_PAGINATION = {
    page: 1,
    limit: 20,
} as const;