import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        userData: null,
    },
    reducers: {
        setAuthState: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.userData = action.payload.userData;
        },
    },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;