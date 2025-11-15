import React from "react";
import { Navigate } from "react-router-dom";
import { userAuth } from "./hooks/userAuth";
import GlobalLoader from "./components/ui/GlobalLoader";
import { useSelector } from "react-redux";
import { RootState } from "./store/appStore";

export const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    userAuth();
    const isAuthenticated = useSelector((state: RootState) => state.authSlice.isAuthenticated);

    return (
        <>
            {isAuthenticated ? <Navigate to="/dashboard" replace /> : children}
        </>
    );
};


