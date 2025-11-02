import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/ui/loading';

interface AuthGuardProps {
    children: React.ReactNode;
}

/**
 * AuthGuard component for protecting authenticated routes
 * 
 * This component ensures that only authenticated users can access protected routes.
 * It checks the authentication status and redirects unauthenticated users to the login page.
 * 
 * Features:
 * - Automatic authentication status checking on mount
 * - Loading state while checking authentication
 * - Redirect to login with return URL preservation
 * - Session validation with backend
 * 
 * @param children - The protected content to render for authenticated users
 * 
 * @example
 * ```tsx
 * <AuthGuard>
 *   <DashboardPage />
 * </AuthGuard>
 * ```
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        // Check authentication status on mount if not already authenticated
        if (!isAuthenticated && !isLoading) {
            checkAuth();
        }
    }, [isAuthenticated, isLoading, checkAuth]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated, preserving the intended destination
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // Render protected content for authenticated users
    return <>{children}</>;
};