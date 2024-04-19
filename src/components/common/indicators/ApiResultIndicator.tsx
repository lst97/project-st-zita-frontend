import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LoadingIndicatorContext } from '@lst97/react-common-accessories';
import { useContext } from 'react';
import Alert from '@mui/material/Alert';

const ApiResultIndicator = () => {
    const { isLoading, isSuccess, isShow } = useContext(
        LoadingIndicatorContext
    )!;

    return (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
            {isShow && isLoading && (
                <Alert severity="info" sx={{ position: 'relative', mb: 2 }}>
                    <Typography variant="body1">Saving...</Typography>
                </Alert>
            )}

            {isShow && isSuccess && !isLoading && (
                <Alert severity="success" sx={{ position: 'relative', mb: 2 }}>
                    <Typography variant="body1">Saved!</Typography>
                </Alert>
            )}

            {isShow && !isSuccess && !isLoading && (
                <Alert severity="error" sx={{ position: 'relative', mb: 2 }}>
                    <Typography variant="body1">Failed!</Typography>
                </Alert>
            )}
        </Box>
    );
};

export default ApiResultIndicator;
