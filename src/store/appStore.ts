import { configureStore } from '@reduxjs/toolkit';
import loaderSlice from './loaderSlice';
import authSlice from './authSlice';

const appStore = configureStore({
    reducer: {
        loaderSlice: loaderSlice,
        authSlice: authSlice,
    },
});

export default appStore;
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;