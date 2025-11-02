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
 * Authentication API methods
 */
export const authAPI = {
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const response = await api.post('/api/users/login', credentials);
        const { token, user } = response.data;

        if (token) {
            localStorage.setItem('auth-token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        return { user, token };
    },

    async register(userData: RegisterData): Promise<User> {
        const { confirmPassword, ...data } = userData;
        const response = await api.post('/api/users/register', data);
        return response.data.user;
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get('/api/users/profile');
        return response.data.user;
    },

    async logout(): Promise<void> {
        localStorage.removeItem('auth-token');
        delete api.defaults.headers.common['Authorization'];
        return Promise.resolve();
    },
};

/**
 * Sweet shop API methods
 */
export const sweetAPI = {
    async getAll(): Promise<Sweet[]> {
        const response = await api.get('/api/sweets');
        return response.data.sweets;
    },

    async search(params: { query?: string; category?: string; minPrice?: number; maxPrice?: number }): Promise<Sweet[]> {
        const response = await api.get('/api/sweets/search', { params });
        return response.data.sweets;
    },

    async create(sweetData: CreateSweetData): Promise<Sweet> {
        const response = await api.post('/api/sweets', sweetData);
        return response.data.sweet;
    },

    async update(id: string, sweetData: UpdateSweetData): Promise<Sweet> {
        const response = await api.put(`/api/sweets/${id}`, sweetData);
        return response.data.sweet;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/api/sweets/${id}`);
    },

    async purchase(id: string, quantity: number = 1): Promise<Sweet> {
        const response = await api.post(`/api/sweets/${id}/purchase`, { quantity });
        return response.data.sweet;
    },

    async restock(id: string, quantity: number): Promise<Sweet> {
        const response = await api.post(`/api/sweets/${id}/restock`, { quantity });
        return response.data.sweet;
    },
};

/**
 * Response interceptor for simple error handling
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth-token');
            delete api.defaults.headers.common['Authorization'];

            if (!window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/register')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;