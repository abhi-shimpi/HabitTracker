import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { userAuth } from '../hooks/userAuth';
import GlobalLoader from './ui/GlobalLoader';
import { useSelector } from 'react-redux';
import { RootState } from '../store/appStore';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    userAuth();
    const isAuthenticated = useSelector((state: RootState) => state.authSlice.isAuthenticated);
    return (
        <>
            {isAuthenticated ? children : <Navigate to="/login" />}
        </>
    );
};

export default ProtectedRoute;
