import { toast } from '@/hooks/use-toast';

/**
 * Simple error toast helper
 */
export function showErrorToast(title: string, message?: string) {
    toast({
        variant: 'destructive',
        title,
        description: message,
    });
}

/**
 * Simple success toast helper
 */
export function showSuccessToast(title: string, message?: string) {
    toast({
        variant: 'success',
        title,
        description: message,
    });
}

/**
 * Get error message from API error
 */
export function getErrorMessage(error: any): string {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
}