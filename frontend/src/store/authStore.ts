import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI } from '../services/api';
import type { User, LoginCredentials, RegisterData } from '../types';

/**
 * Authentication store state interface
 * Manages user authentication, session persistence, and auth-related UI states
 */
interface AuthState {
    // State
    /** Current authenticated user data, null if not logged in */
    user: User | null;
    /** Boolean indicating if user is currently authenticated */
    isAuthenticated: boolean;
    /** Loading state for auth operations (login, register, logout, checkAuth) */
    isLoading: boolean;
    /** Current error message from auth operations, null if no error */
    error: string | null;

    // Computed getters
    /** Computed property indicating if current user has admin privileges */
    isAdmin: boolean;

    // Actions
    /**
     * Authenticate user with email and password
     * @param credentials - User login credentials containing email and password
     * @throws Error if login fails or credentials are invalid
     */
    login: (credentials: LoginCredentials) => Promise<void>;
    /**
     * Register a new user account
     * @param userData - Registration data including username, email, password, and confirmPassword
     * @throws Error if registration fails or validation errors occur
     */
    register: (userData: RegisterData) => Promise<void>;
    /**
     * Log out current user and clear session
     * Continues with local logout even if API call fails
     */
    logout: () => Promise<void>;
    /**
     * Check current authentication status with server
     * Validates stored session and updates user data
     */
    checkAuth: () => Promise<void>;
    /** Clear current error state */
    clearError: () => void;
    /**
     * Manually set loading state
     * @param loading - Loading state to set
     */
    setLoading: (loading: boolean) => void;
}

/**
 * Zustand store for authentication state management
 * 
 * Features:
 * - User session persistence using localStorage
 * - Automatic session validation
 * - Admin role checking
 * - Error handling for auth operations
 * - Loading states for UI feedback
 * 
 * @example
 * ```tsx
 * const { user, login, logout, isAdmin } = useAuthStore();
 * 
 * // Login user
 * await login({ email: 'user@example.com', password: 'password' });
 * 
 * // Check if user is admin
 * if (isAdmin) {
 *   // Show admin features
 * }
 * ```
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Computed getter for admin status
            get isAdmin() {
                return get().user?.role === 'ADMIN';
            },

            // Login action
            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true, error: null });

                try {
                    const user = await authAPI.login(credentials);
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: errorMessage
                    });
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
                        isLoading: false,
                        error: null
                    });
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: errorMessage
                    });
                    throw error;
                }
            },

            // Logout action
            logout: async () => {
                set({ isLoading: true });

                try {
                    await authAPI.logout();
                } catch (error) {
                    // Continue with logout even if API call fails
                    console.warn('Logout API call failed, but continuing with local logout');
                } finally {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    });
                }
            },

            // Check authentication status
            checkAuth: async () => {
                // Don't check if already loading or if we have a user
                if (get().isLoading) return;

                set({ isLoading: true, error: null });

                try {
                    const user = await authAPI.getCurrentUser();
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } catch (error: any) {
                    // If auth check fails, clear the stored session
                    set({
                        user: null,
                        isAuthenticated: false,
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
            // Only persist user data and authentication status
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            // Skip hydration of loading and error states
            skipHydration: false,
        }
    )
);