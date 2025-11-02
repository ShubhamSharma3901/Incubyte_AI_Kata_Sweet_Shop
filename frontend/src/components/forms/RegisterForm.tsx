import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { registerSchema, type RegisterFormData } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

/**
 * RegisterForm component props interface
 */
interface RegisterFormProps {
    /** Optional callback function called after successful registration */
    onSuccess?: () => void;
    /** Optional CSS class name for styling the form container */
    className?: string;
}

/**
 * RegisterForm component for new user registration
 * 
 * Provides a form interface for users to create new accounts with username, email, 
 * password, and password confirmation. Includes comprehensive form validation using 
 * Zod schema, error handling, and success feedback.
 * 
 * Features:
 * - Username, email, and password validation
 * - Password confirmation matching
 * - Real-time form validation feedback
 * - Loading states during registration
 * - Error handling with toast notifications
 * - Automatic redirect to dashboard on success
 * - Link to login form for existing users
 * 
 * @param props - RegisterForm component props
 * @param props.onSuccess - Optional callback executed after successful registration
 * @param props.className - Optional CSS class for form container styling
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <RegisterForm />
 * 
 * // With success callback
 * <RegisterForm onSuccess={() => console.log('User registered!')} />
 * 
 * // With custom styling
 * <RegisterForm className="max-w-lg mx-auto" />
 * ```
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
    onSuccess,
    className = ''
}) => {
    const navigate = useNavigate();
    const { register: registerUser, isLoading, error, clearError } = useAuthStore();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    });

    // Watch password field for real-time confirmation validation
    const password = watch('password');

    /**
     * Handles form submission for user registration
     * 
     * @param data - Validated form data containing username, email, password, and confirmPassword
     */
    const onSubmit = async (data: RegisterFormData) => {
        try {
            // Clear any previous errors
            clearError();

            // Attempt to register the user
            await registerUser(data);

            // Reset form
            reset();

            // Execute success callback if provided
            onSuccess?.();

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (error: any) {
            // Error handling is now done in the auth store
            console.error('Registration error:', error);
        }
    };

    return (
        <Card className={`w-full max-w-md mx-auto safe-area-inset ${className}`}>
            <CardHeader className="space-y-1 p-4 xs:p-6">
                <CardTitle className="text-responsive-xl font-bold text-center">
                    Create Account
                </CardTitle>
                <CardDescription className="text-center text-responsive-sm">
                    Enter your information to create a new account
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-3 p-4 xs:space-y-4 xs:p-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-responsive-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            {...register('name')}
                            className={`h-10 xs:h-11 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-responsive-xs text-red-500 mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

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

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="confirmPassword"
                            className="text-responsive-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Confirm Password
                        </label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            {...register('confirmPassword')}
                            className={`h-10 xs:h-11 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.confirmPassword && (
                            <p className="text-responsive-xs text-red-500 mt-1">
                                {errors.confirmPassword.message}
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
                        {isLoading || isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    <div className="text-center text-responsive-xs">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link
                            to="/login"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
};