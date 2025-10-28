import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { callGetApi } from '../services/apiServices';
import endpoints from '../utils/endpoints';
import { authService } from '../services/authService';
import { useDispatch } from 'react-redux';
import { clearLoader, setLoader } from './loaderSlice';
import { AppDispatch } from './appStore';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any | null;
    token: string | null;
    error: string | null;
    lastChecked: number | null; // Timestamp of last auth check
}

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
    const savedState = authService.getAuthState();
    return {
        isAuthenticated: savedState?.isAuthenticated || false,
        isLoading: false,
        user: savedState?.user || null,
        token: null, // We don't store tokens for cookie-based auth
        error: null,
        lastChecked: null,
    };
};

const initialState: AuthState = getInitialState();

// Async thunk to check authentication
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { authSlice: AuthState };
            const now = Date.now();
            const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

            // Check if we have a recent auth check
            if (state.authSlice.lastChecked &&
                (now - state.authSlice.lastChecked) < CACHE_DURATION) {
                // Return cached result if still valid
                return {
                    authenticated: state.authSlice.isAuthenticated,
                    user: state.authSlice.user,
                    cached: true
                };
            }
            const dispatch = useDispatch<AppDispatch>();
            dispatch(setLoader({
                loading: true,
                message: 'Checking authentication...'
            }));
            const response = await callGetApi(`${endpoints.AUTHENTICATE_USER}`, {});
            dispatch(clearLoader());
            return response?.data;
        } catch (error) {
            return rejectWithValue('Authentication failed');
        }
    }
);

// Async thunk to login
export const login = createAsyncThunk(
    'auth/login',
    async (userData: any, { rejectWithValue }) => {
        try {
            // Your login API call here
            // const response = await callPostApi(endpoints.LOGIN, userData);
            // return response.data;
            return userData; // Placeholder
        } catch (error) {
            return rejectWithValue('Login failed');
        }
    }
);

// Async thunk to logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            // Your logout API call here if needed
            Cookies.remove('token');
            return true;
        } catch (error) {
            return rejectWithValue('Logout failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            // For cookie-based auth, we don't set cookies manually
            // Backend handles this via HTTP-only cookies
        },
        clearAuth: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = null;
            state.lastChecked = null;
            // Clear localStorage
            authService.clearAuthState();
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = action.payload?.authenticated || false;
                state.user = action.payload?.user || null;
                state.lastChecked = Date.now();
                // Save state to localStorage
                authService.setAuthState(state.isAuthenticated, state.user);
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload as string;
                // Clear localStorage on auth failure
                authService.clearAuthState();
            })
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                // Token should be set by the login component
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = null;
            });
    },
});

export const { setToken, clearAuth, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
