import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import React, { useContext } from 'react';
import {
    SnackbarContext,
    SnackbarContextData
} from '../../context/SnackbarContext';

const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AppSnackbar = () => {
    const { isOpen, message, severity, setIsOpen }: SnackbarContextData =
        useContext(SnackbarContext)!;

    const handleClose = () => {
        if (setIsOpen) {
            setIsOpen(false);
        }
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isOpen}
            autoHideDuration={3000}
            onClose={handleClose}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AppSnackbar;
