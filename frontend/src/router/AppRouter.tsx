import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AuthGuard, AdminGuard } from '@/components/guards';
import { AppLayout } from '@/components/layout';
import {
    LoginPage,
    RegisterPage,
    DashboardPage,
    SweetsPage,
    AdminPage
} from '@/pages';
import { Toaster } from '@/components/ui/toaster';
import { NotFoundError } from '@/components/ui/error';

/**
 * Main application router component
 */
export const AppRouter: React.FC = () => {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const [isInitialized, setIsInitialized] = React.useState(false);

    // Check authentication status on app initialization
    useEffect(() => {
        const initializeAuth = async () => {
            await checkAuth();
            setIsInitialized(true);
        };

        initializeAuth();
    }, [checkAuth]);

    const handleSearch = (term: string) => {
        console.log('Search term:', term);
    };

    // Show loading screen while initializing
    if (!isInitialized || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Root route - redirect based on authentication status */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ?
                            <Navigate to="/dashboard" replace /> :
                            <Navigate to="/login" replace />
                    }
                />

                {/* Public authentication routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes wrapped in AppLayout */}
                <Route
                    path="/dashboard"
                    element={
                        <AuthGuard>
                            <AppLayout onSearch={handleSearch} showSidebar={true}>
                                <DashboardPage />
                            </AppLayout>
                        </AuthGuard>
                    }
                />

                <Route
                    path="/sweets"
                    element={
                        <AuthGuard>
                            <AppLayout onSearch={handleSearch} showSidebar={true}>
                                <SweetsPage />
                            </AppLayout>
                        </AuthGuard>
                    }
                />

                {/* Admin-only routes */}
                <Route
                    path="/admin"
                    element={
                        <AdminGuard>
                            <AppLayout onSearch={handleSearch} showSidebar={true}>
                                <AdminPage />
                            </AppLayout>
                        </AdminGuard>
                    }
                />

                {/* Additional admin routes */}
                <Route
                    path="/analytics"
                    element={
                        <AdminGuard>
                            <AppLayout onSearch={handleSearch} showSidebar={true}>
                                <div className="p-6">
                                    <h1 className="text-2xl font-bold mb-4">Analytics</h1>
                                    <p className="text-neutral-600 dark:text-neutral-400">Analytics dashboard coming soon...</p>
                                </div>
                            </AppLayout>
                        </AdminGuard>
                    }
                />

                <Route
                    path="/inventory"
                    element={
                        <AdminGuard>
                            <AppLayout onSearch={handleSearch} showSidebar={true}>
                                <div className="p-6">
                                    <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
                                    <p className="text-neutral-600 dark:text-neutral-400">Inventory management coming soon...</p>
                                </div>
                            </AppLayout>
                        </AdminGuard>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <AdminGuard>
                            <AppLayout onSearch={handleSearch} showSidebar={true}>
                                <div className="p-6">
                                    <h1 className="text-2xl font-bold mb-4">User Management</h1>
                                    <p className="text-neutral-600 dark:text-neutral-400">User management coming soon...</p>
                                </div>
                            </AppLayout>
                        </AdminGuard>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <AuthGuard>
                            <AppLayout onSearch={handleSearch} showSidebar={true}>
                                <div className="p-6">
                                    <h1 className="text-2xl font-bold mb-4">Profile</h1>
                                    <p className="text-neutral-600 dark:text-neutral-400">Profile page coming soon...</p>
                                </div>
                            </AppLayout>
                        </AuthGuard>
                    }
                />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFoundError />} />
            </Routes>

            {/* Global toast notifications */}
            <Toaster />
        </BrowserRouter>
    );
};