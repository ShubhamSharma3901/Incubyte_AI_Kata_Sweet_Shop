import React from 'react';
import { AppRouter } from '@/router';

/**
 * Main App component
 * 
 * The root component that initializes the application with routing.
 * All authentication, layout, and navigation logic is handled by the AppRouter.
 */
function App() {
    return <AppRouter />;
}

export default App;