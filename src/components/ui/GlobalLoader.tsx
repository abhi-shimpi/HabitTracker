import React from 'react';
import { useSelector } from 'react-redux';
import { ThreeDotsLoader } from './three-dots-loader';
import { ApiLoader } from './loader';

const GlobalLoader: React.FC = () => {
    const { loading, message } = useSelector((state: any) => state.loaderSlice);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-brightness-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm mx-4">
                <div className="flex flex-col items-center space-y-4">
                    {/* <ThreeDotsLoader size="large" /> */}
                    <ApiLoader message={message} fullScreen={true} showLoader={true} />
                    {/* {message && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                            {message}
                        </p>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default GlobalLoader;
