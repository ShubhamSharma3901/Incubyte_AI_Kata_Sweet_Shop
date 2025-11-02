import { create } from 'zustand';
import { sweetAPI } from '../services/api';
import type { Sweet, CreateSweetData, UpdateSweetData, SweetFilters } from '../types';

/**
 * Sweet store state interface
 * Manages sweet inventory and CRUD operations
 */
interface SweetState {
    // State
    /** Array of all sweets in the inventory */
    sweets: Sweet[];
    /** Loading state for sweet operations */
    isLoading: boolean;
    /** Current error message from sweet operations, null if no error */
    error: string | null;
    /** Current search term for local filtering */
    searchTerm: string;
    /** Current filters applied to sweet list */
    filters: SweetFilters;
    /** Computed array of sweets filtered by search term and filters */
    filteredSweets: Sweet[];

    // Actions
    /** Fetch all sweets from the server */
    fetchSweets: () => Promise<void>;
    /**
     * Add a new sweet to inventory (admin only)
     * @param sweetData - Sweet creation data
     */
    addSweet: (sweetData: CreateSweetData) => Promise<void>;
    /**
     * Update an existing sweet (admin only)
     * @param id - Sweet ID to update
     * @param sweetData - Partial sweet data to update
     */
    updateSweet: (id: string, sweetData: UpdateSweetData) => Promise<void>;
    /**
     * Delete a sweet from inventory (admin only)
     * @param id - Sweet ID to delete
     */
    deleteSweet: (id: string) => Promise<void>;
    /**
     * Purchase a sweet, reducing its quantity
     * @param id - Sweet ID to purchase
     * @param quantity - Number of items to purchase (defaults to 1)
     */
    purchaseSweet: (id: string, quantity?: number) => Promise<void>;
    /**
     * Restock a sweet, increasing its quantity (admin only)
     * @param id - Sweet ID to restock
     * @param quantity - Number of items to add to inventory
     */
    restockSweet: (id: string, quantity: number) => Promise<void>;
    /**
     * Search sweets with server-side filtering
     * @param params - Search parameters including query, category, and price range
     */
    searchSweets: (params: { query?: string; category?: string; minPrice?: number; maxPrice?: number }) => Promise<void>;

    // Filter and search actions
    /**
     * Set search term for local filtering
     * @param term - Search term to filter by name and description
     */
    setSearchTerm: (term: string) => void;
    /**
     * Set filters for local filtering
     * @param filters - Partial filters to apply
     */
    setFilters: (filters: Partial<SweetFilters>) => void;
    /** Clear all filters and search term */
    clearFilters: () => void;
    /** Clear current error state */
    clearError: () => void;
    /** Compute and update filtered sweets */
    computeFilteredSweets: () => void;
    /**
     * Manually set loading state
     * @param loading - Loading state to set
     */
    setLoading: (loading: boolean) => void;
}

/**
 * Zustand store for sweet inventory management
 * 
 * Features:
 * - CRUD operations for sweet inventory
 * - Real-time search and filtering
 * - Purchase and restock functionality
 * - Computed filtered results
 * - Error handling and loading states
 * 
 * @example
 * ```tsx
 * const { sweets, fetchSweets, purchaseSweet, filteredSweets } = useSweetStore();
 * 
 * // Fetch all sweets
 * await fetchSweets();
 * 
 * // Purchase a sweet
 * await purchaseSweet('sweet-id', 2);
 * 
 * // Filter sweets
 * setSearchTerm('chocolate');
 * setFilters({ minPrice: 5, maxPrice: 20 });
 * ```
 */
export const useSweetStore = create<SweetState>((set, get) => ({
    // Initial state
    sweets: [],
    isLoading: false,
    error: null,
    searchTerm: '',
    filters: {},
    filteredSweets: [],

    // Helper function to compute filtered sweets
    computeFilteredSweets: () => {
        const { sweets, searchTerm, filters } = get();

        const filtered = sweets.filter((sweet) => {
            // Search term filter (name and description)
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch =
                    sweet.name.toLowerCase().includes(searchLower) ||
                    (sweet.description && sweet.description.toLowerCase().includes(searchLower));
                if (!matchesSearch) return false;
            }

            // Price range filters
            if (filters.minPrice !== undefined && sweet.price < filters.minPrice) {
                return false;
            }
            if (filters.maxPrice !== undefined && sweet.price > filters.maxPrice) {
                return false;
            }

            // In stock filter
            if (filters.inStock && sweet.quantity <= 0) {
                return false;
            }

            return true;
        });

        set({ filteredSweets: filtered });
    },



    // Fetch all sweets
    fetchSweets: async () => {
        set({ isLoading: true, error: null });

        try {
            const sweets = await sweetAPI.getAll();
            set({
                sweets,
                isLoading: false,
                error: null
            });
            get().computeFilteredSweets();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch sweets. Please try again.';
            set({
                sweets: [],
                isLoading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Add new sweet (admin only)
    addSweet: async (sweetData: CreateSweetData) => {
        set({ isLoading: true, error: null });

        try {
            const newSweet = await sweetAPI.create(sweetData);
            set((state) => ({
                sweets: [...state.sweets, newSweet],
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to add sweet. Please try again.';
            set({
                isLoading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Update existing sweet (admin only)
    updateSweet: async (id: string, sweetData: UpdateSweetData) => {
        set({ isLoading: true, error: null });

        try {
            const updatedSweet = await sweetAPI.update(id, sweetData);
            set((state) => ({
                sweets: state.sweets.map(sweet =>
                    sweet.id === id ? updatedSweet : sweet
                ),
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update sweet. Please try again.';
            set({
                isLoading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Delete sweet (admin only)
    deleteSweet: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            await sweetAPI.delete(id);
            set((state) => ({
                sweets: state.sweets.filter(sweet => sweet.id !== id),
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete sweet. Please try again.';
            set({
                isLoading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Purchase sweet
    purchaseSweet: async (id: string, quantity: number = 1) => {
        set({ isLoading: true, error: null });

        try {
            const updatedSweet = await sweetAPI.purchase(id, quantity);
            set((state) => ({
                sweets: state.sweets.map(sweet =>
                    sweet.id === id ? updatedSweet : sweet
                ),
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to purchase sweet. Please try again.';
            set({
                isLoading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Restock sweet (admin only)
    restockSweet: async (id: string, quantity: number) => {
        set({ isLoading: true, error: null });

        try {
            const updatedSweet = await sweetAPI.restock(id, quantity);
            set((state) => ({
                sweets: state.sweets.map(sweet =>
                    sweet.id === id ? updatedSweet : sweet
                ),
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to restock sweet. Please try again.';
            set({
                isLoading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Search sweets with parameters
    searchSweets: async (params: { query?: string; category?: string; minPrice?: number; maxPrice?: number }) => {
        set({ isLoading: true, error: null });

        try {
            const sweets = await sweetAPI.search(params);
            set({
                sweets,
                isLoading: false,
                error: null
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Search failed. Please try again.';
            set({
                sweets: [],
                isLoading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Set search term for local filtering
    setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().computeFilteredSweets();
    },

    // Set filters for local filtering
    setFilters: (newFilters: Partial<SweetFilters>) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }));
        get().computeFilteredSweets();
    },

    // Clear all filters and search
    clearFilters: () => {
        set({
            searchTerm: '',
            filters: {}
        });
        get().computeFilteredSweets();
    },

    // Clear error state
    clearError: () => {
        set({ error: null });
    },

    // Set loading state
    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },
}));