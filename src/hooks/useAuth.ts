import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/appStore';
import { checkAuth, login, logout, setToken, clearAuth } from '../store/authSlice';
import { useEffect } from 'react';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.authSlice);

    // Remove the automatic auth check from useAuth
    // This will be handled by AuthInitializer only

    const checkAuthManually = () => {
        dispatch(checkAuth());
    };

    const loginUser = async (userData: any) => {
        return dispatch(login(userData));
    };

    const logoutUser = async () => {
        return dispatch(logout());
    };

    const setAuthToken = (token: string) => {
        dispatch(setToken(token));
    };

    const clearAuthData = () => {
        dispatch(clearAuth());
    };

    return {
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        user: auth.user,
        token: auth.token,
        error: auth.error,
        loginUser,
        logoutUser,
        setAuthToken,
        clearAuthData,
        checkAuthManually,
    };
};
