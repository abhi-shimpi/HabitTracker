import React, { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import GlobalLoader from './ui/GlobalLoader';

interface AuthInitializerProps {
    children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
    const { isAuthenticated, isLoading, checkAuthManually } = useAuth();
    const hasInitialized = useRef(false);

    // Initialize authentication on app start
    useEffect(() => {
        // Only initialize once
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            console.log('AuthInitializer: Checking authentication...');
            checkAuthManually();
        }
    }, [checkAuthManually]);

    // Show loader while checking authentication
    if (isLoading) {
        return <GlobalLoader />;
    }

    return <>{children}</>;
};

export default AuthInitializer;
