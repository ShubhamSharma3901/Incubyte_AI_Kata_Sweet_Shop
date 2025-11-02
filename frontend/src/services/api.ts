import axios from 'axios';
import type { LoginCredentials, RegisterData, User, Sweet, CreateSweetData, UpdateSweetData } from '../types';

/**
 * Base URL for the API, defaults to localhost:8000 if not set in environment
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Log the API base URL for debugging (only in development)
if (import.meta.env.DEV) {
    console.log('API Base URL:', API_BASE_URL);
}

/**
 * Axios instance configured for the sweet shop API
 * Includes base URL, JWT token authentication, and JSON headers
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Initialize token from localStorage if available
const token = localStorage.getItem('auth-token');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/**
 * Authentication API methods for user login, registration, and session management
 */
export const authAPI = {
    /**
     * Authenticate user with email and password
     * @param credentials - User login credentials containing email and password
     * @returns Promise resolving to authenticated user data
     * @throws Error if login fails or credentials are invalid
     */
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const response = await api.post('/api/users/login', credentials);
        // Backend returns: { message, token, user }
        const { token, user } = response.data;

        // Store token in localStorage for subsequent requests
        if (token) {
            localStorage.setItem('auth-token', token);
            // Set default authorization header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        return { user, token };
    },

    /**
     * Register a new user account
     * @param userData - Registration data including username, email, password, and confirmPassword
     * @returns Promise resolving to newly created user data
     * @throws Error if registration fails or validation errors occur
     */
    async register(userData: RegisterData): Promise<User> {
        const { confirmPassword, ...data } = userData;
        const response = await api.post('/api/users/register', data);
        // Backend returns: { message, user }
        return response.data.user;
    },

    /**
     * Get current authenticated user information
     * @returns Promise resolving to current user data
     * @throws Error if user is not authenticated or request fails
     */
    async getCurrentUser(): Promise<User> {
        const response = await api.get('/api/users/profile');
        // Backend returns: { user }
        return response.data.user;
    },

    /**
     * Log out the current user and clear session
     * @returns Promise that resolves when logout is complete
     * @throws Error if logout request fails
     */
    async logout(): Promise<void> {
        // Clear token from localStorage and axios headers
        localStorage.removeItem('auth-token');
        delete api.defaults.headers.common['Authorization'];
        return Promise.resolve();
    },
};

/**
 * Sweet shop API methods for managing sweets inventory and purchases
 */
export const sweetAPI = {
    /**
     * Fetch all available sweets from the inventory
     * @returns Promise resolving to array of all sweets
     * @throws Error if request fails or server error occurs
     */
    async getAll(): Promise<Sweet[]> {
        const response = await api.get('/api/sweets');
        console.log(response.data.sweets)
        return response.data.sweets;
    },

    /**
     * Search for sweets with optional filters
     * @param params - Search parameters including query, category, and price range
     * @param params.query - Text search query for sweet name or description
     * @param params.category - Filter by sweet category
     * @param params.minPrice - Minimum price filter
     * @param params.maxPrice - Maximum price filter
     * @returns Promise resolving to array of matching sweets
     * @throws Error if search request fails
     */
    async search(params: { query?: string; category?: string; minPrice?: number; maxPrice?: number }): Promise<Sweet[]> {
        const response = await api.get('/api/sweets/search', { params });
        return response.data.sweets;
    },

    /**
     * Create a new sweet in the inventory (admin only)
     * @param sweetData - Sweet creation data including name, description, price, and quantity
     * @returns Promise resolving to newly created sweet
     * @throws Error if creation fails, validation errors, or insufficient permissions
     */
    async create(sweetData: CreateSweetData): Promise<Sweet> {
        const response = await api.post('/api/sweets', sweetData);
        return response.data.sweet;
    },

    /**
     * Update an existing sweet's information (admin only)
     * @param id - Unique identifier of the sweet to update
     * @param sweetData - Partial sweet data to update
     * @returns Promise resolving to updated sweet
     * @throws Error if update fails, sweet not found, or insufficient permissions
     */
    async update(id: string, sweetData: UpdateSweetData): Promise<Sweet> {
        const response = await api.put(`/api/sweets/${id}`, sweetData);
        return response.data.sweet;
    },

    /**
     * Delete a sweet from the inventory (admin only)
     * @param id - Unique identifier of the sweet to delete
     * @returns Promise that resolves when deletion is complete
     * @throws Error if deletion fails, sweet not found, or insufficient permissions
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/api/sweets/${id}`);
    },

    /**
     * Purchase a sweet, reducing its inventory quantity
     * @param id - Unique identifier of the sweet to purchase
     * @param quantity - Number of items to purchase (defaults to 1)
     * @returns Promise resolving to updated sweet with reduced quantity
     * @throws Error if purchase fails, insufficient stock, or sweet not found
     */
    async purchase(id: string, quantity: number = 1): Promise<Sweet> {
        const response = await api.post(`/api/sweets/${id}/purchase`, { quantity });
        return response.data.sweet;
    },

    /**
     * Restock a sweet, increasing its inventory quantity (admin only)
     * @param id - Unique identifier of the sweet to restock
     * @param quantity - Number of items to add to inventory
     * @returns Promise resolving to updated sweet with increased quantity
     * @throws Error if restock fails, sweet not found, or insufficient permissions
     */
    async restock(id: string, quantity: number): Promise<Sweet> {
        const response = await api.post(`/api/sweets/${id}/restock`, { quantity });
        return response.data.sweet;
    },
};

/**
 * Response interceptor for global error handling
 * Automatically clears token and redirects to login page on 401 Unauthorized responses
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear invalid token
            localStorage.removeItem('auth-token');
            delete api.defaults.headers.common['Authorization'];

            // Handle unauthorized - redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * Default export of the configured axios instance
 * Can be used for custom API calls not covered by authAPI or sweetAPI
 */
export default api;