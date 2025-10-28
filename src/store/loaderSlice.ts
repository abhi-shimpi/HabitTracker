import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
    name: 'loader',
    initialState: {
        loading: false,
        message: '',
    },
    reducers: {
        setLoader: (state, action) => {
            state.loading = action.payload.loading;
            state.message = action.payload.message || '';
        },
        clearLoader: (state) => {
            state.loading = false;
            state.message = '';
        },
    },
});

export const { setLoader, clearLoader } = loaderSlice.actions;
export default loaderSlice.reducer;