/**
 * @fileoverview Zustand stores for Sweet Shop Frontend
 * 
 * This module exports all Zustand stores used for state management in the Sweet Shop application.
 * 
 * Available stores:
 * - useAuthStore: Authentication and user session management
 * - useSweetStore: Sweet inventory and CRUD operations
 * 
 * @example
 * ```tsx
 * import { useAuthStore, useSweetStore } from './store';
 * 
 * function MyComponent() {
 *   const { user, login } = useAuthStore();
 *   const { sweets, fetchSweets } = useSweetStore();
 *   
 *   // Use stores...
 * }
 * ```
 */

// Export all stores for easy importing
export { useAuthStore } from './authStore';
export { useSweetStore } from './sweetStore';