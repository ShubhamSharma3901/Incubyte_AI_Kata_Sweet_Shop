import React from 'react';
import { SweetCard } from './SweetCard';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import type { Sweet } from '@/types';

interface SweetGridProps {
    /** Array of sweets to display */
    sweets: Sweet[];
    /** Loading state */
    isLoading?: boolean;
    /** Error message to display */
    error?: string | null;
    /** Optional className for styling */
    className?: string;
}

/**
 * SweetGrid component displays sweets in a responsive grid layout
 * 
 * Features:
 * - Responsive grid (1 col mobile, 2 cols tablet, 3+ cols desktop)
 * - Loading state with skeleton cards
 * - Empty state when no sweets available
 * - Error state display
 * - Optimized for various screen sizes
 * 
 * @param sweets - Array of sweet data to display
 * @param isLoading - Whether data is currently loading
 * @param error - Error message to display if any
 * @param className - Optional CSS classes
 */
export const SweetGrid: React.FC<SweetGridProps> = ({
    sweets,
    isLoading = false,
    error = null,
    className = ''
}) => {
    // Loading state - show skeleton cards
    if (isLoading) {
        return (
            <div className={`grid-responsive-cards ${className}`}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <Card className="p-8 text-center">
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-4xl">😞</div>
                        <h3 className="text-lg font-semibold text-destructive">
                            Something went wrong
                        </h3>
                        <p className="text-muted-foreground">
                            {error}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Empty state - no sweets available
    if (!sweets || sweets.length === 0) {
        return (
            <Card className="p-8 text-center">
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-6xl">🍭</div>
                        <h3 className="text-lg font-semibold">
                            No sweets available
                        </h3>
                        <p className="text-muted-foreground">
                            There are currently no sweets in the inventory. Check back later or contact an administrator.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Main grid display
    return (
        <div className={`grid-responsive-cards ${className}`}>
            {sweets.map((sweet, index) => (
                <SweetCard
                    key={sweet.id}
                    sweet={sweet}
                    className={`animate-in fade-in-50 slide-in-from-bottom-4 duration-300`}
                    style={{ animationDelay: `${index * 50}ms` }}
                />
            ))}
        </div>
    );
};

/**
 * Skeleton card component for loading state
 * Mimics the new SweetCard structure with animated placeholders
 */
const SkeletonCard: React.FC = () => {
    return (
        <Card className="h-full flex flex-col overflow-hidden border border-border bg-card">
            <div className="p-6 space-y-4">
                {/* Category badge skeleton */}
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />

                {/* Title skeleton */}
                <div className="h-6 bg-muted rounded animate-pulse" />
            </div>

            <div className="px-6 pb-4 space-y-3">
                {/* Price section skeleton */}
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div className="h-3 w-8 bg-muted rounded animate-pulse" />
                        <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* Stock section skeleton */}
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-muted rounded-full animate-pulse" />
                            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="p-6 pt-2">
                <div className="h-12 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
        </Card>
    );
};