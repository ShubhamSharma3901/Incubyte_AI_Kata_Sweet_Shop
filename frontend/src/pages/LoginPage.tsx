import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/forms';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Login page component
 * Displays login form for unauthenticated users
 * Redirects authenticated users to dashboard
 */
export const LoginPage: React.FC = () => {
    const { isAuthenticated } = useAuthStore();

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to your Sweet Shop account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
};