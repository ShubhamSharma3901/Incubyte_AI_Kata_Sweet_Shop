import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AuthGuard } from './AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdminGuardProps {
    children: React.ReactNode;
}

/**
 * AdminGuard component for protecting admin-only routes
 * 
 * This component ensures that only users with admin privileges can access admin routes.
 * It first checks authentication (via AuthGuard) and then verifies admin role.
 * 
 * Features:
 * - Inherits authentication protection from AuthGuard
 * - Admin role verification
 * - User-friendly access denied message for non-admin users
 * - Automatic redirect to dashboard for unauthorized access
 * 
 * @param children - The admin-only content to render for authorized users
 * 
 * @example
 * ```tsx
 * <AdminGuard>
 *   <AdminPanel />
 * </AdminGuard>
 * ```
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
    let { isAdmin, user } = useAuthStore();
    isAdmin = user?.role === 'ADMIN';
    return (
        <AuthGuard>
            {isAdmin ? (
                // Render admin content for users with admin role
                <>{children}</>
            ) : (
                // Show access denied message for non-admin users
                <div className="min-h-[60vh] flex items-center justify-center px-4">
                    <Card className="w-full max-w-md text-center">
                        <CardHeader>
                            <CardTitle className="text-xl text-destructive">
                                Access Denied
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                You don't have permission to access this page.
                                Admin privileges are required.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Current role: <span className="font-medium">{user?.role || 'USER'}</span>
                            </p>
                            <Button
                                onClick={() => window.history.back()}
                                variant="outline"
                                className="w-full"
                            >
                                Go Back
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AuthGuard>
    );
};