// User roles
export const USER_ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'sweet_shop_auth_token',
    USER_DATA: 'sweet_shop_user_data',
    THEME: 'sweet_shop_theme',
    SEARCH_HISTORY: 'sweet_shop_search_history',
} as const;

// Form validation constants
export const VALIDATION_RULES = {
    USERNAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 50,
        PATTERN: /^[a-zA-Z0-9_]+$/,
    },
    PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 100,
    },
    SWEET_NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
    },
    DESCRIPTION: {
        MIN_LENGTH: 10,
        MAX_LENGTH: 500,
    },
    PRICE: {
        MIN: 0.01,
        MAX: 1000,
    },
    QUANTITY: {
        MIN: 0,
        MAX: 10000,
    },
    PURCHASE_QUANTITY: {
        MIN: 1,
        MAX: 100,
    },
    SEARCH_QUERY: {
        MAX_LENGTH: 100,
    },
} as const;

// UI constants
export const UI_CONSTANTS = {
    DEBOUNCE_DELAY: 300, // milliseconds for search debouncing
    TOAST_DURATION: 5000, // milliseconds for toast notifications
    LOADING_DELAY: 200, // milliseconds before showing loading state
} as const;

// Responsive breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
} as const;

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again later.',
    OUT_OF_STOCK: 'This item is currently out of stock.',
    INSUFFICIENT_QUANTITY: 'Not enough items in stock for your request.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Successfully logged in!',
    REGISTER_SUCCESS: 'Account created successfully!',
    LOGOUT_SUCCESS: 'Successfully logged out!',
    SWEET_CREATED: 'Sweet added successfully!',
    SWEET_UPDATED: 'Sweet updated successfully!',
    SWEET_DELETED: 'Sweet deleted successfully!',
    PURCHASE_SUCCESS: 'Purchase completed successfully!',
    RESTOCK_SUCCESS: 'Sweet restocked successfully!',
} as const;