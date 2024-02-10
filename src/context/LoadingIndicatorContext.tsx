import React, { createContext, useState } from 'react';

// Define the shape of our Snackbar data
export interface LoadingIndicatorContextData {
    isLoading: boolean;
    isSuccess?: boolean;
    isShow: boolean;
    showIndicator: (isLoading: boolean, isSuccess: boolean) => void;
}

const initialLoadingIndicatorContext: LoadingIndicatorContextData = {
    isLoading: false,
    isSuccess: false,
    isShow: false,
    showIndicator: () => {}
};

// Create the Context
const LoadingIndicatorContext =
    createContext<LoadingIndicatorContextData | null>(
        initialLoadingIndicatorContext
    );

// Custom Snackbar Provider
const LoadingIndicatorProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [isShow, setIsShow] = useState(false);

    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(
        undefined
    );

    const showIndicator = (isLoading: boolean, isSuccess: boolean) => {
        if (isLoading) {
            setIsLoading(true);
            setIsShow(true);
        } else {
            setIsLoading(false);
            setIsSuccess(isSuccess);

            clearTimeout(timeoutId);
            setTimeoutId(
                setTimeout(() => {
                    setIsShow(false);
                }, 3000)
            );
        }
    };

    return (
        <LoadingIndicatorContext.Provider
            value={{ isLoading, isSuccess, isShow, showIndicator }}
        >
            {children}
        </LoadingIndicatorContext.Provider>
    );
};

export { LoadingIndicatorContext, LoadingIndicatorProvider };
