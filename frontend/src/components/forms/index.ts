/**
 * Authentication Forms Export Module
 * 
 * This module provides centralized exports for all authentication-related form components.
 * It includes login and registration forms with comprehensive validation and error handling.
 */

export { LoginForm } from './LoginForm';
export { RegisterForm } from './RegisterForm';

// Re-export types for convenience
export type { LoginFormData, RegisterFormData } from '@/schemas';