import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/appStore';
import { useEffect, useState } from 'react';
import endpoints from '../utils/endpoints';
import { callGetApi } from '../services/apiServices';
import { setAuthState } from '../store/authSlice';
import { clearLoader, setLoader } from '../store/loaderSlice';

export const userAuth = () => {
    const dispatch = useDispatch<AppDispatch>();

    const alreadyCheckedAuthentication = useSelector((state: RootState) => state.authSlice.isAuthenticated);

    const checkUserAuthentication = async () => {
        if (alreadyCheckedAuthentication) {
            return;
        }
        dispatch(setLoader({ loading: true, message: 'Checking user authentication...' }));
        try {
            const response = await callGetApi(endpoints.AUTHENTICATE_USER, {});
            dispatch(clearLoader());
            if (response.status === 200 && response.authenticated) {
                dispatch(setAuthState({ isAuthenticated: true, userData: response.user }));
            } else {
                dispatch(setAuthState({ isAuthenticated: false, userData: null }));
            }
        } catch (error) {
            console.error(error);
            dispatch(clearLoader());
            dispatch(setAuthState({ isAuthenticated: false, userData: null }));
        }
    }

    useEffect(() => {
        checkUserAuthentication();
    }, []);
};
