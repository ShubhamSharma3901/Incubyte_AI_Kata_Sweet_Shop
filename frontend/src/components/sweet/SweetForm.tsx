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
        <Card className={`w-full max-w-2xl mx-auto safe-area-inset ${className}`}>
            <CardHeader className="space-y-1 p-4 xs:p-6">
                <CardTitle className="text-responsive-xl font-bold">
                    {isEditMode ? 'Edit Sweet' : 'Add New Sweet'}
                </CardTitle>
                <CardDescription className="text-responsive-sm">
                    {isEditMode
                        ? 'Update the sweet information below'
                        : 'Fill in the details to add a new sweet to your inventory'
                    }
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 p-4 xs:space-y-6 xs:p-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-responsive-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Sweet Name *
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter sweet name"
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

                    {/* Category Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="category"
                            className="text-responsive-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Category *
                        </label>
                        <Input
                            id="category"
                            type="text"
                            placeholder="Enter category"
                            {...register('category')}
                            className={`h-10 xs:h-11 ${errors.category ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.category && (
                            <p className="text-responsive-xs text-red-500 mt-1">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="description"
                            className="text-responsive-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            placeholder="Enter description (optional)"
                            {...register('description')}
                            className={`flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-responsive-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 xs:min-h-[80px] ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''
                                }`}
                            disabled={isLoading || isSubmitting}
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-responsive-xs text-red-500 mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Price and Quantity Row */}
                    <div className="grid grid-cols-1 gap-4 xs:grid-cols-2">
                        {/* Price Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="price"
                                className="text-responsive-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                                className={`h-10 xs:h-11 ${errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                disabled={isLoading || isSubmitting}
                            />
                            {errors.price && (
                                <p className="text-responsive-xs text-red-500 mt-1">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>

                        {/* Quantity Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="quantity"
                                className="text-responsive-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                                className={`h-10 xs:h-11 ${errors.quantity ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                disabled={isLoading || isSubmitting}
                            />
                            {errors.quantity && (
                                <p className="text-responsive-xs text-red-500 mt-1">
                                    {errors.quantity.message}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2 p-4 xs:gap-3 xs:p-6 sm:flex-row">
                    <Button
                        type="submit"
                        className="touch-target w-full h-10 xs:h-11 sm:w-auto"
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
                            className="touch-target w-full h-10 xs:h-11 sm:w-auto"
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