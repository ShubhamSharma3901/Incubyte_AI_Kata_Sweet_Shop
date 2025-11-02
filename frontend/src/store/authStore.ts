import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI } from '../services/api';
import { showErrorToast, showSuccessToast, getErrorMessage } from '../utils/errorHandling';
import type { User, LoginCredentials, RegisterData } from '../types';

/**
 * Authentication store state interface
 */
interface AuthState {
    // State
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isAdmin: boolean;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
}

/**
 * Zustand store for authentication state management
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            isAdmin: false,

            // Login action
            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true, error: null });

                try {
                    const { user } = await authAPI.login(credentials);
                    set({
                        user,
                        isAuthenticated: true,
                        isAdmin: user.role === 'ADMIN',
                        isLoading: false,
                        error: null
                    });

                    showSuccessToast('Login Successful', `Welcome back, ${user.name}!`);
                } catch (error: any) {
                    const errorMessage = getErrorMessage(error);
                    set({
                        user: null,
                        isAuthenticated: false,
                        isAdmin: false,
                        isLoading: false,
                        error: errorMessage
                    });
                    showErrorToast('Login Failed', errorMessage);
                    throw error;
                }
            },

            // Register action
            register: async (userData: RegisterData) => {
                set({ isLoading: true, error: null });

                try {
                    const user = await authAPI.register(userData);
                    set({
                        user,
                        isAuthenticated: true,
                        isAdmin: user.role === 'ADMIN',
                        isLoading: false,
                        error: null
                    });

                    showSuccessToast('Registration Successful', `Welcome to Sweet Shop, ${user.name}!`);
                } catch (error: any) {
                    const errorMessage = getErrorMessage(error);
                    set({
                        user: null,
                        isAuthenticated: false,
                        isAdmin: false,
                        isLoading: false,
                        error: errorMessage
                    });
                    showErrorToast('Registration Failed', errorMessage);
                    throw error;
                }
            },

            // Logout action
            logout: async () => {
                set({ isLoading: true });

                try {
                    await authAPI.logout();
                    showSuccessToast('Logged Out', 'You have been successfully logged out.');
                } catch (error) {
                    console.warn('Logout API call failed, but continuing with local logout');
                } finally {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isAdmin: false,
                        isLoading: false,
                        error: null
                    });
                }
            },

            // Check authentication status
            checkAuth: async () => {
                if (get().isLoading) return;

                const token = localStorage.getItem('auth-token');
                if (!token) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isAdmin: false,
                        isLoading: false,
                        error: null
                    });
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const user = await authAPI.getCurrentUser();
                    set({
                        user,
                        isAuthenticated: true,
                        isAdmin: user.role === 'ADMIN',
                        isLoading: false,
                        error: null
                    });
                } catch (error: any) {
                    localStorage.removeItem('auth-token');
                    set({
                        user: null,
                        isAuthenticated: false,
                        isAdmin: false,
                        isLoading: false,
                        error: null
                    });
                }
            },

            // Clear error state
            clearError: () => {
                set({ error: null });
            },

            // Set loading state
            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                isAdmin: state.isAdmin,
            }),
            onRehydrateStorage: () => (state) => {
                if (state?.isAuthenticated) {
                    const token = localStorage.getItem('auth-token');
                    if (token) {
                        import('../services/api').then(({ default: api }) => {
                            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        });
                        if (state.user) {
                            state.isAdmin = state.user.role === 'ADMIN';
                        }
                    } else {
                        state.user = null;
                        state.isAuthenticated = false;
                        state.isAdmin = false;
                    }
                }
            },
        }
    )
);