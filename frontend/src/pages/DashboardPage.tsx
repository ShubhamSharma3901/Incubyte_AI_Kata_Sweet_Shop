import React, { useEffect, useMemo } from 'react';
import { DashboardContainer, DashboardHeader, DashboardGrid, StatsCard } from '@/components/ui/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SweetGrid, SweetFilters } from '@/components/sweet';
import { useSweetStore } from '@/store/sweetStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import {
    IconCandy,
    IconPackage,
    IconAlertTriangle,
    IconX
} from '@tabler/icons-react';

/**
 * Main dashboard page component
 * Displays sweet shop inventory with statistics and sweet grid
 * Available to all authenticated users with role-based features
 * 
 * Features:
 * - Real-time sweet inventory display
 * - Statistics cards with computed values
 * - Admin-specific actions and stats
 * - Responsive layout using Aceternity UI components
 * - Error handling and loading states
 */
export const DashboardPage: React.FC = () => {
    const {
        sweets,
        filteredSweets,
        isLoading,
        error,
        fetchSweets,
        clearError
    } = useSweetStore();


    const { toast } = useToast();

    // Fetch sweets on component mount
    useEffect(() => {
        const loadSweets = async () => {
            try {
                await fetchSweets();
            } catch (error: any) {
                toast({
                    title: "Failed to load sweets",
                    description: error.response?.data?.message || "Please try refreshing the page",
                    variant: "destructive",
                });
            }
        };

        loadSweets();
    }, [fetchSweets, toast]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            if (error) {
                clearError();
            }
        };
    }, [error, clearError]);

    // Computed statistics from sweet data
    const stats = useMemo(() => {
        // Ensure sweets is an array before performing operations
        const sweetsArray = Array.isArray(sweets) ? sweets : [];

        const totalSweets = sweetsArray.length;
        const totalValue = sweetsArray.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
        const lowStockItems = sweetsArray.filter(sweet => sweet.quantity > 0 && sweet.quantity <= 5).length;
        const outOfStockItems = sweetsArray.filter(sweet => sweet.quantity === 0).length;
        const inStockItems = sweetsArray.filter(sweet => sweet.quantity > 0).length;

        return {
            totalSweets,
            totalValue,
            lowStockItems,
            outOfStockItems,
            inStockItems,
        };
    }, [sweets]);

    /**
     * Handle refresh action
     */
    const handleRefresh = async () => {
        try {
            await fetchSweets();
            toast({
                title: "Refreshed",
                description: "Sweet inventory has been updated",
            });
        } catch (error: any) {
            toast({
                title: "Refresh Failed",
                description: error.response?.data?.message || "Failed to refresh data",
                variant: "destructive",
            });
        }
    };

    return (
        <DashboardContainer>
            <DashboardHeader
                title="Sweet Shop Dashboard"
                description="Browse our delicious sweet collection"
                action={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Loading...
                                </div>
                            ) : (
                                "Refresh"
                            )}
                        </Button>

                    </div>
                }
            />

            {/* Statistics Cards */}
            <DashboardGrid cols={4}>
                <StatsCard
                    title="Total Sweets"
                    value={stats.totalSweets}
                    description="Items in inventory"
                    icon={<IconCandy className="h-4 w-4" />}
                />
                <StatsCard
                    title="In Stock"
                    value={stats.inStockItems}
                    description="Available for purchase"
                    icon={<IconPackage className="h-4 w-4 text-green-500" />}
                />
                <StatsCard
                    title="Low Stock"
                    value={stats.lowStockItems}
                    description="5 or fewer remaining"
                    icon={<IconAlertTriangle className="h-4 w-4 text-orange-500" />}
                />
                <StatsCard
                    title="Out of Stock"
                    value={stats.outOfStockItems}
                    description="Need restocking"
                    icon={<IconX className="h-4 w-4 text-red-500" />}
                />
            </DashboardGrid>



            {/* Sweet Inventory Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Sweet Inventory</h2>
                </div>

                {/* Search and Filters */}
                <SweetFilters />

                {/* Sweet Grid */}
                <SweetGrid
                    sweets={Array.isArray(filteredSweets) ? filteredSweets : []}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </DashboardContainer>
    );
};