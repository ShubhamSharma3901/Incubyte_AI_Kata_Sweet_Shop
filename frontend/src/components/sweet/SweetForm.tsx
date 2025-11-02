import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSweetStore } from '@/store/sweetStore';
import { createSweetSchema, type CreateSweetFormData } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Sweet } from '@/types';

/**
 * SweetForm component props interface
 */
interface SweetFormProps {
    /** Sweet data for editing (undefined for creating new sweet) */
    sweet?: Sweet;
    /** Callback function called after successful form submission */
    onSuccess?: () => void;
    /** Callback function called when form is cancelled */
    onCancel?: () => void;
    /** Optional CSS class name for styling the form container */
    className?: string;
}

/**
 * SweetForm component for adding and editing sweets
 * 
 * Provides a comprehensive form interface for admin users to create new sweets
 * or edit existing ones. Includes validation, error handling, and success feedback.
 * 
 * Features:
 * - Create new sweets with all required fields
 * - Edit existing sweets with pre-populated data
 * - Form validation using Zod schemas
 * - Real-time validation feedback
 * - Loading states during API operations
 * - Error handling with toast notifications
 * - Success feedback and callbacks
 * 
 * @param props - SweetForm component props
 * @param props.sweet - Optional sweet data for editing mode
 * @param props.onSuccess - Callback executed after successful submission
 * @param props.onCancel - Callback executed when form is cancelled
 * @param props.className - Optional CSS class for form container styling
 * 
 * @example
 * ```tsx
 * // Create new sweet
 * <SweetForm onSuccess={() => setShowForm(false)} />
 * 
 * // Edit existing sweet
 * <SweetForm 
 *   sweet={selectedSweet} 
 *   onSuccess={() => setEditMode(false)}
 *   onCancel={() => setEditMode(false)}
 * />
 * ```
 */
export const SweetForm: React.FC<SweetFormProps> = ({
    sweet,
    onSuccess,
    onCancel,
    className = ''
}) => {
    const { addSweet, updateSweet, isLoading } = useSweetStore();
    const { toast } = useToast();
    const isEditMode = !!sweet;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreateSweetFormData>({
        resolver: zodResolver(createSweetSchema),
        mode: 'onBlur',
        defaultValues: isEditMode ? {
            name: sweet.name,
            category: sweet.category,
            description: sweet.description || '',
            price: sweet.price,
            quantity: sweet.quantity,
        } : {
            name: '',
            category: '',
            description: '',
            price: 0,
            quantity: 0,
        }
    });

    /**
     * Handles form submission for creating or updating a sweet
     * 
     * @param data - Validated form data
     */
    const onSubmit = async (data: CreateSweetFormData) => {
        try {
            if (isEditMode && sweet) {
                // Update existing sweet - only send changed fields
                const updateData: any = {};
                if (data.name !== sweet.name) updateData.name = data.name;
                if (data.category !== sweet.category) updateData.category = data.category;
                if (data.description !== sweet.description) updateData.description = data.description;
                if (data.price !== sweet.price) updateData.price = data.price;
                if (data.quantity !== sweet.quantity) updateData.quantity = data.quantity;

                await updateSweet(sweet.id, updateData);

                toast({
                    title: 'Sweet Updated',
                    description: `${data.name} has been successfully updated.`,
                    variant: 'success',
                });
            } else {
                // Create new sweet
                await addSweet(data);

                toast({
                    title: 'Sweet Added',
                    description: `${data.name} has been successfully added to the inventory.`,
                    variant: 'success',
                });

                // Reset form for new entries
                reset();
            }

            // Execute success callback
            onSuccess?.();
        } catch (error: any) {
            // Error handling with toast notification
            const errorMessage = error.response?.data?.message ||
                `Failed to ${isEditMode ? 'update' : 'add'} sweet. Please try again.`;

            toast({
                title: `${isEditMode ? 'Update' : 'Add'} Failed`,
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };

    /**
     * Handles form cancellation
     */
    const handleCancel = () => {
        reset();
        onCancel?.();
    };

    return (
        <Card className={`w-full max-w-2xl mx-auto ${className}`}>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                    {isEditMode ? 'Edit Sweet' : 'Add New Sweet'}
                </CardTitle>
                <CardDescription>
                    {isEditMode
                        ? 'Update the sweet information below'
                        : 'Fill in the details to add a new sweet to your inventory'
                    }
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Sweet Name *
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter sweet name (e.g., Chocolate Chip Cookie)"
                            {...register('name')}
                            className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Category Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="category"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Category *
                        </label>
                        <Input
                            id="category"
                            type="text"
                            placeholder="Enter category (e.g., Cookies, Candies, Chocolates)"
                            {...register('category')}
                            className={errors.category ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.category && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            placeholder="Enter a detailed description of the sweet (optional)"
                            {...register('description')}
                            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''
                                }`}
                            disabled={isLoading || isSubmitting}
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Price and Quantity Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Price Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="price"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Price (₹) *
                            </label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0.01"
                                max="1000"
                                placeholder="0.00"
                                {...register('price', {
                                    valueAsNumber: true,
                                    setValueAs: (value) => value === '' ? undefined : parseFloat(value)
                                })}
                                className={errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                disabled={isLoading || isSubmitting}
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>

                        {/* Quantity Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="quantity"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Quantity in Stock *
                            </label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0"
                                max="10000"
                                placeholder="0"
                                {...register('quantity', {
                                    valueAsNumber: true,
                                    setValueAs: (value) => value === '' ? undefined : parseInt(value, 10)
                                })}
                                className={errors.quantity ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                disabled={isLoading || isSubmitting}
                            />
                            {errors.quantity && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.quantity.message}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row gap-3">
                    <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={isLoading || isSubmitting}
                    >
                        {isLoading || isSubmitting
                            ? (isEditMode ? 'Updating...' : 'Adding...')
                            : (isEditMode ? 'Update Sweet' : 'Add Sweet')
                        }
                    </Button>

                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={handleCancel}
                            disabled={isLoading || isSubmitting}
                        >
                            Cancel
                        </Button>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
};