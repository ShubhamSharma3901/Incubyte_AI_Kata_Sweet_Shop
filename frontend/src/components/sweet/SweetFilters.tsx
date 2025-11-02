import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSweetStore } from '@/store/sweetStore';
import {
    IconSearch,
    IconFilter,
    IconX,
    IconAdjustments
} from '@tabler/icons-react';

/**
 * SweetFilters component provides search and filtering functionality
 * 
 * Features:
 * - Real-time search with debouncing
 * - Price range filtering
 * - In-stock availability filter
 * - Clear filters functionality
 * - Active filter indicators
 * - Responsive design
 */
export const SweetFilters: React.FC = () => {
    const {
        searchTerm,
        filters,
        setSearchTerm,
        setFilters,
        clearFilters,
        filteredSweets,
        sweets
    } = useSweetStore();

    // Local state for controlled inputs
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice?.toString() || '');
    const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice?.toString() || '');
    const [showFilters, setShowFilters] = useState(false);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchTerm(localSearchTerm);
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [localSearchTerm, setSearchTerm]);

    // Sync local state with store state
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        setLocalMinPrice(filters.minPrice?.toString() || '');
        setLocalMaxPrice(filters.maxPrice?.toString() || '');
    }, [filters.minPrice, filters.maxPrice]);

    /**
     * Handle price filter changes
     */
    const handlePriceFilterChange = useCallback((type: 'min' | 'max', value: string) => {
        const numValue = value === '' ? undefined : parseFloat(value);

        if (type === 'min') {
            setLocalMinPrice(value);
            setFilters({ minPrice: numValue });
        } else {
            setLocalMaxPrice(value);
            setFilters({ maxPrice: numValue });
        }
    }, [setFilters]);

    /**
     * Handle in-stock filter toggle
     */
    const handleInStockToggle = useCallback(() => {
        setFilters({ inStock: !filters.inStock });
    }, [filters.inStock, setFilters]);

    /**
     * Clear all filters and search
     */
    const handleClearAll = useCallback(() => {
        setLocalSearchTerm('');
        setLocalMinPrice('');
        setLocalMaxPrice('');
        clearFilters();
    }, [clearFilters]);

    /**
     * Check if any filters are active
     */
    const hasActiveFilters = searchTerm ||
        filters.minPrice !== undefined ||
        filters.maxPrice !== undefined ||
        filters.inStock;

    /**
     * Get active filter count for badge
     */
    const activeFilterCount = [
        searchTerm,
        filters.minPrice !== undefined,
        filters.maxPrice !== undefined,
        filters.inStock
    ].filter(Boolean).length;

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search sweets by name or description..."
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    {localSearchTerm && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setLocalSearchTerm('')}
                        >
                            <IconX className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative"
                >
                    <IconFilter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge
                            variant="secondary"
                            className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <IconAdjustments className="h-5 w-5" />
                                Advanced Filters
                            </CardTitle>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Price Range Filters */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm">Price Range</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">
                                        Min Price ($)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={localMinPrice}
                                        onChange={(e) => handlePriceFilterChange('min', e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">
                                        Max Price ($)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="999.99"
                                        value={localMaxPrice}
                                        onChange={(e) => handlePriceFilterChange('max', e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Availability Filter */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm">Availability</h4>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={filters.inStock ? "default" : "outline"}
                                    size="sm"
                                    onClick={handleInStockToggle}
                                    className="text-sm"
                                >
                                    In Stock Only
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                    Showing {filteredSweets.length} of {sweets.length} sweets
                    {hasActiveFilters && (
                        <span className="ml-1">(filtered)</span>
                    )}
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2">
                        <span>Active filters:</span>
                        <div className="flex gap-1">
                            {searchTerm && (
                                <Badge variant="secondary" className="text-xs">
                                    Search: "{searchTerm}"
                                </Badge>
                            )}
                            {filters.minPrice !== undefined && (
                                <Badge variant="secondary" className="text-xs">
                                    Min: ${filters.minPrice}
                                </Badge>
                            )}
                            {filters.maxPrice !== undefined && (
                                <Badge variant="secondary" className="text-xs">
                                    Max: ${filters.maxPrice}
                                </Badge>
                            )}
                            {filters.inStock && (
                                <Badge variant="secondary" className="text-xs">
                                    In Stock
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* No Results State */}
            {filteredSweets.length === 0 && sweets.length > 0 && hasActiveFilters && (
                <Card className="p-8 text-center">
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-4xl">🔍</div>
                            <h3 className="text-lg font-semibold">
                                No sweets match your criteria
                            </h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search terms or filters to find what you're looking for.
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleClearAll}
                                className="mt-4"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};