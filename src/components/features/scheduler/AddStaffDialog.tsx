// AddStaffDialog.js
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import StaffData from '../../../models/share/scheduler/StaffData';
import { v4 as uuidv4 } from 'uuid';
import Grid from '@mui/material/Unstable_Grid2';
import { StyledAvatar } from '../../common/cards/cards.style';
import { ColorUtils } from '../../../utils/ColorUtils';
import ColorPicker from '../../common/colors/ColorPicker';
import { Box } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const AddStaffDialog = ({
    open,
    onClose,
    onAddStaff
}: {
    open: boolean;
    onClose: () => void;
    onAddStaff: (staffData: StaffData) => void;
}) => {
    const [staffName, setStaffName] = useState('');
    const [staffDescription, setStaffDescription] = useState('');
    const [representColor, setRepresentColor] = useState(
        ColorUtils.generateRandomColor()
    );
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [dialogBoxMessage, setDialogBoxMessage] = React.useState('');

    const handleSnackbarClose = (_event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    const validator = (value: string) => {
        return value.length > 0;
    };

    const handleAddClick = () => {
        if (!validator(staffName)) {
            setDialogBoxMessage('Staff name is required');
            setSnackbarOpen(true);
            return;
        }

        ColorUtils.setColorFor(staffName, representColor);

        const newStaff: StaffData = {
            id: uuidv4(),
            name: staffName,
            email: email,
            color: representColor,
            phoneNumber: phoneNumber,
            image: 'NOT_IMPLEMENTED_YET'
        };

        onAddStaff(newStaff);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid xs={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%'
                            }}
                        >
                            <StyledAvatar
                                alt="Avatar"
                                sx={{
                                    backgroundColor: representColor,
                                    width: 80,
                                    height: 80,
                                    mb: 4
                                }}
                            >
                                {staffName[0] ?? 'CL'}
                            </StyledAvatar>
                            <ColorPicker
                                onChange={setRepresentColor}
                                initialColor={representColor}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={8}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Staff Name"
                            fullWidth
                            required
                            value={staffName}
                            onChange={(e) => setStaffName(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            value={staffDescription}
                            onChange={(e) =>
                                setStaffDescription(e.target.value)
                            }
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Phone Number"
                            fullWidth
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAddClick} color="primary">
                    Add
                </Button>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message={dialogBoxMessage}
                    action={
                        <React.Fragment>
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={setSnackbarOpen.bind(this, false)}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </DialogActions>
        </Dialog>
    );
};

export default AddStaffDialog;
