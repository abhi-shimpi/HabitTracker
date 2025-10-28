import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import GlobalLoader from "./components/ui/GlobalLoader";

export const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    // If we're still loading authentication status
    if (isLoading) {
        return <GlobalLoader />;
    }

    // If user is authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // If not authenticated, allow access to public routes
    return children;
};


