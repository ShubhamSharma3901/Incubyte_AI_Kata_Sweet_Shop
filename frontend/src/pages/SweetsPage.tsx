import React, { useEffect } from 'react';
import { DashboardContainer, DashboardHeader } from '@/components/ui/dashboard';
import { Button } from '@/components/ui/button';
import { SweetGrid, SweetFilters } from '@/components/sweet';
import { useSweetStore } from '@/store/sweetStore';
import { useToast } from '@/hooks/use-toast';

/**
 * Sweets browsing page component
 * Displays all available sweets for browsing and purchasing
 * Available to all authenticated users
 * 
 * Features:
 * - Real-time search and filtering
 * - Sweet grid display with purchase functionality
 * - Responsive design
 * - Error handling and loading states
 */
export const SweetsPage: React.FC = () => {
    const {
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
                title="Browse Sweets"
                description="Discover and purchase delicious sweets from our collection"
                action={
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="touch-target w-full xs:w-auto"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                <span className="text-responsive-sm">Loading...</span>
                            </div>
                        ) : (
                            <span className="text-responsive-sm">Refresh</span>
                        )}
                    </Button>
                }
            />

            <div className="space-responsive">
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
