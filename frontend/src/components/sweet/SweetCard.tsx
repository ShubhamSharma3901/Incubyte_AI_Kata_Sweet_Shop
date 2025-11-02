import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';
import { useSweetStore } from '@/store/sweetStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import type { Sweet } from '@/types';

interface SweetCardProps {
    /** Sweet data to display */
    sweet: Sweet;
    /** Optional className for styling */
    className?: string;
}

/**
 * SweetCard component displays individual sweet information
 * Shows name, description, price, quantity and purchase/admin actions
 * 
 * Features:
 * - Responsive card layout
 * - Purchase functionality for customers
 * - Admin actions (edit/delete) for admin users
 * - Out of stock handling
 * - Loading states during actions
 * 
 * @param sweet - Sweet data to display
 * @param className - Optional CSS classes
 */
export const SweetCard: React.FC<SweetCardProps> = ({ sweet, className }) => {
    const { purchaseSweet, deleteSweet, isLoading } = useSweetStore();
    const { user, isAdmin } = useAuthStore();
    const { toast } = useToast();

    /**
     * Handle sweet purchase
     * Shows success/error toast messages
     */
    const handlePurchase = async () => {
        try {
            await purchaseSweet(sweet.id, 1);
            toast({
                title: "Purchase Successful!",
                description: `You purchased 1 ${sweet.name}`,
            });
        } catch (error: any) {
            toast({
                title: "Purchase Failed",
                description: error.response?.data?.message || "Failed to purchase sweet. Please try again.",
                variant: "destructive",
            });
        }
    };

    /**
     * Handle sweet deletion (admin only)
     * Shows confirmation and success/error messages
     */
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${sweet.name}"?`)) {
            return;
        }

        try {
            await deleteSweet(sweet.id);
            toast({
                title: "Sweet Deleted",
                description: `${sweet.name} has been removed from inventory`,
            });
        } catch (error: any) {
            toast({
                title: "Delete Failed",
                description: error.response?.data?.message || "Failed to delete sweet. Please try again.",
                variant: "destructive",
            });
        }
    };

    const isOutOfStock = sweet.quantity <= 0;
    const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;

    return (
        <Card className={`h-full flex flex-col transition-all duration-200 hover:shadow-lg ${className}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                        {sweet.name}
                    </CardTitle>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xl font-bold text-primary">
                            ${sweet.price.toFixed(2)}
                        </span>
                        {isOutOfStock ? (
                            <Badge variant="destructive" className="text-xs">
                                Out of Stock
                            </Badge>
                        ) : isLowStock ? (
                            <Badge variant="secondary" className="text-xs">
                                Low Stock
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-xs">
                                In Stock
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-3">
                <div className="space-y-3">
                    {sweet.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {sweet.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="outline" className="text-xs">
                            {sweet.category}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Available:</span>
                        <span className={`font-medium ${isOutOfStock ? 'text-destructive' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                            {sweet.quantity} units
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0 flex flex-col gap-2">
                {/* Customer purchase button */}
                {user && !isAdmin && (
                    <Button
                        onClick={handlePurchase}
                        disabled={isOutOfStock || isLoading}
                        className="w-full"
                        variant={isOutOfStock ? "secondary" : "default"}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </div>
                        ) : isOutOfStock ? (
                            "Out of Stock"
                        ) : (
                            `Purchase - $${sweet.price.toFixed(2)}`
                        )}
                    </Button>
                )}

                {/* Admin actions */}
                {isAdmin && (
                    <div className="flex gap-2 w-full">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                                // TODO: Implement edit functionality in future task
                                toast({
                                    title: "Edit Feature",
                                    description: "Edit functionality will be implemented in a future update",
                                });
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};