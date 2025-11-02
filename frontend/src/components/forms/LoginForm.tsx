import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { loginSchema, type LoginFormData } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

/**
 * LoginForm component props interface
 */
interface LoginFormProps {
    /** Optional callback function called after successful login */
    onSuccess?: () => void;
    /** Optional CSS class name for styling the form container */
    className?: string;
}

/**
 * LoginForm component for user authentication
 * 
 * Provides a form interface for users to log into their accounts with email and password.
 * Includes form validation using Zod schema, error handling, and success feedback.
 * 
 * Features:
 * - Email and password validation
 * - Real-time form validation feedback
 * - Loading states during authentication
 * - Error handling with toast notifications
 * - Automatic redirect to dashboard on success
 * - Link to registration form for new users
 * 
 * @param props - LoginForm component props
 * @param props.onSuccess - Optional callback executed after successful login
 * @param props.className - Optional CSS class for form container styling
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <LoginForm />
 * 
 * // With success callback
 * <LoginForm onSuccess={() => console.log('User logged in!')} />
 * 
 * // With custom styling
 * <LoginForm className="max-w-md mx-auto" />
 * ```
 */
export const LoginForm: React.FC<LoginFormProps> = ({
    onSuccess,
    className = ''
}) => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    /**
     * Handles form submission for user login
     * 
     * @param data - Validated form data containing email and password
     */
    const onSubmit = async (data: LoginFormData) => {
        try {
            // Clear any previous errors
            clearError();

            // Attempt to log in the user
            await login(data);

            // Reset form
            reset();

            // Execute success callback if provided
            onSuccess?.();

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (error: any) {
            // Error handling is now done in the auth store
            console.error('Login error:', error);
        }
    };

    return (
        <Card className={`w-full max-w-md mx-auto safe-area-inset ${className}`}>
            <CardHeader className="space-y-1 p-4 xs:p-6">
                <CardTitle className="text-responsive-xl font-bold text-center">
                    Sign In
                </CardTitle>
                <CardDescription className="text-center text-responsive-sm">
                    Enter your email and password to access your account
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-3 p-4 xs:space-y-4 xs:p-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-responsive-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email')}
                            className={`h-10 xs:h-11 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.email && (
                            <p className="text-responsive-xs text-red-500 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-responsive-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password')}
                            className={`h-10 xs:h-11 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.password && (
                            <p className="text-responsive-xs text-red-500 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Display auth store error if present */}
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 p-4 xs:space-y-4 xs:p-6">
                    <Button
                        type="submit"
                        className="touch-target w-full h-10 xs:h-11"
                        disabled={isLoading || isSubmitting}
                    >
                        {isLoading || isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <div className="text-center text-responsive-xs">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link
                            to="/register"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
};