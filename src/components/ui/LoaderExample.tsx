import React from 'react';
import { useDispatch } from 'react-redux';
import { setLoader, clearLoader } from '../../store/loaderSlice';
import { Button } from './button';

const LoaderExample: React.FC = () => {
    const dispatch = useDispatch();

    const showLoader = () => {
        dispatch(setLoader({
            loading: true,
            message: 'Loading data, please wait...'
        }));

        // Simulate async operation
        setTimeout(() => {
            dispatch(clearLoader());
        }, 3000);
    };

    const showLoaderWithoutMessage = () => {
        dispatch(setLoader({
            loading: true,
            message: ''
        }));

        // Simulate async operation
        setTimeout(() => {
            dispatch(clearLoader());
        }, 2000);
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">Global Loader Example</h3>
            <div className="space-x-2">
                <Button onClick={showLoader}>
                    Show Loader with Message
                </Button>
                <Button onClick={showLoaderWithoutMessage} variant="outline">
                    Show Loader without Message
                </Button>
            </div>
        </div>
    );
};

export default LoaderExample;
