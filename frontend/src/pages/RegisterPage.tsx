import React from 'react';
import { Navigate } from 'react-router-dom';
import { RegisterForm } from '@/components/forms';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Registration page component
 * Displays registration form for new users
 * Redirects authenticated users to dashboard
 */
export const RegisterPage: React.FC = () => {
    const { isAuthenticated } = useAuthStore();

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>
                        Join Sweet Shop and start exploring delicious treats
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
            </Card>
        </div>
    );
};