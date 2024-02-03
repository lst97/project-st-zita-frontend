import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';

function DataSendingIndicator({
    isLoading,
    isSuccess
}: {
    isLoading: boolean;
    isSuccess: boolean;
}) {
    return (
        <div>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end'
                }}
            >
                {isLoading && <CircularProgress size={24} />}
                {isSuccess && (
                    <CheckCircleIcon
                        sx={{ height: 32, width: 32 }}
                        color="success"
                    />
                )}
            </Box>
        </div>
    );
}

export default DataSendingIndicator;
