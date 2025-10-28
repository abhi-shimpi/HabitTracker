import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GlobalLoader from './ui/GlobalLoader';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    // If we're still loading authentication status
    if (isLoading) {
        return <GlobalLoader />;
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the protected component
    return children;
};

export default ProtectedRoute;
