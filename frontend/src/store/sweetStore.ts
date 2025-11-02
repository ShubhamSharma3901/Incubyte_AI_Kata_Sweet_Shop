import { create } from 'zustand';
import { sweetAPI } from '../services/api';
import { showErrorToast, showSuccessToast, getErrorMessage } from '../utils/errorHandling';
import type { Sweet, CreateSweetData, UpdateSweetData, SweetFilters } from '../types';

/**
 * Sweet store state interface
 */
interface SweetState {
    // State
    sweets: Sweet[];
    isLoading: boolean;
    error: string | null;
    searchTerm: string;
    filters: SweetFilters;
    filteredSweets: Sweet[];

    // Actions
    fetchSweets: () => Promise<void>;
    addSweet: (sweetData: CreateSweetData) => Promise<void>;
    updateSweet: (id: string, sweetData: UpdateSweetData) => Promise<void>;
    deleteSweet: (id: string) => Promise<void>;
    purchaseSweet: (id: string, quantity?: number) => Promise<void>;
    restockSweet: (id: string, quantity: number) => Promise<void>;
    searchSweets: (params: { query?: string; category?: string; minPrice?: number; maxPrice?: number }) => Promise<void>;
    setSearchTerm: (term: string) => void;
    setFilters: (filters: Partial<SweetFilters>) => void;
    clearFilters: () => void;
    clearError: () => void;
    computeFilteredSweets: () => void;
    setLoading: (loading: boolean) => void;
}

/**
 * Zustand store for sweet inventory management
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
            const errorMessage = getErrorMessage(error);
            set({
                sweets: [],
                isLoading: false,
                error: errorMessage
            });
            showErrorToast('Failed to load sweets', errorMessage);
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
            get().computeFilteredSweets();

            showSuccessToast('Sweet Added', `${newSweet.name} has been added to the inventory.`);
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            set({
                isLoading: false,
                error: errorMessage
            });
            showErrorToast('Failed to add sweet', errorMessage);
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
            get().computeFilteredSweets();

            showSuccessToast('Sweet Updated', `${updatedSweet.name} has been updated successfully.`);
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            set({
                isLoading: false,
                error: errorMessage
            });
            showErrorToast('Failed to update sweet', errorMessage);
            throw error;
        }
    },

    // Delete sweet (admin only)
    deleteSweet: async (id: string) => {
        set({ isLoading: true, error: null });

        const sweetToDelete = get().sweets.find(sweet => sweet.id === id);
        const sweetName = sweetToDelete?.name || 'Sweet';

        try {
            await sweetAPI.delete(id);
            set((state) => ({
                sweets: state.sweets.filter(sweet => sweet.id !== id),
                isLoading: false,
                error: null
            }));
            get().computeFilteredSweets();

            showSuccessToast('Sweet Deleted', `${sweetName} has been removed from the inventory.`);
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            set({
                isLoading: false,
                error: errorMessage
            });
            showErrorToast('Failed to delete sweet', errorMessage);
            throw error;
        }
    },

    // Purchase sweet
    purchaseSweet: async (id: string, quantity: number = 1) => {
        set({ isLoading: true, error: null });

        const sweetToPurchase = get().sweets.find(sweet => sweet.id === id);
        const sweetName = sweetToPurchase?.name || 'Sweet';

        try {
            const updatedSweet = await sweetAPI.purchase(id, quantity);

            if (!updatedSweet || typeof updatedSweet.price !== 'number' || isNaN(updatedSweet.price)) {
                console.error('Invalid sweet data received from API:', updatedSweet);
                throw new Error('Invalid sweet data received from server');
            }

            set((state) => ({
                sweets: state.sweets.map(sweet =>
                    sweet.id === id ? updatedSweet : sweet
                ),
                isLoading: false,
                error: null
            }));
            get().computeFilteredSweets();

            showSuccessToast('Purchase Successful', `You purchased ${quantity} ${sweetName}${quantity > 1 ? 's' : ''}!`);
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            set({
                isLoading: false,
                error: errorMessage
            });
            showErrorToast('Failed to purchase sweet', errorMessage);
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
            get().computeFilteredSweets();

            showSuccessToast('Sweet Restocked', `${updatedSweet.name} has been restocked.`);
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            set({
                isLoading: false,
                error: errorMessage
            });
            showErrorToast('Failed to restock sweet', errorMessage);
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
            get().computeFilteredSweets();
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            set({
                sweets: [],
                isLoading: false,
                error: errorMessage
            });
            showErrorToast('Search failed', errorMessage);
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