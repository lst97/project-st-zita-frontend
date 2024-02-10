import React, { createContext, useState } from 'react';

// Define the shape of our Snackbar data
export interface SnackbarContextData {
    isOpen: boolean;
    message: string;
    severity: 'error' | 'success' | 'warning' | 'info';
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    showSnackbar: (
        message: string,
        severity: 'error' | 'success' | 'warning' | 'info'
    ) => void;
}

const initialSnackbarContext: SnackbarContextData = {
    isOpen: false,
    message: '',
    severity: 'info',
    showSnackbar: () => {}
};

// Create the Context
const SnackbarContext = createContext<SnackbarContextData | null>(
    initialSnackbarContext
);

// Custom Snackbar Provider
const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<
        'error' | 'success' | 'warning' | 'info'
    >('info');

    initialSnackbarContext.setIsOpen = setIsOpen;

    const showSnackbar = (
        message: string,
        severity: 'error' | 'success' | 'warning' | 'info'
    ) => {
        setMessage(message);
        setSeverity(severity);
        setIsOpen(true);

        setTimeout(() => {
            setIsOpen(false);
        }, 3000);
    };

    return (
        <SnackbarContext.Provider
            value={{ isOpen, message, severity, showSnackbar }}
        >
            {children}
        </SnackbarContext.Provider>
    );
};

export { SnackbarContext, SnackbarProvider };
