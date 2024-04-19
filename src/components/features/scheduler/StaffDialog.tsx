// AddStaffDialog.js
import { useContext, useEffect, useState } from 'react';
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
import { Box, CircularProgress } from '@mui/material';
import {
    SnackbarContext,
    SnackbarContextData
} from '@lst97/react-common-accessories';

const StaffDialog = ({
    open,
    data,
    onClose,
    onConfirm,
    isLoading
}: {
    open: boolean;
    data?: StaffData;
    onClose: () => void;
    onConfirm: (staffData: StaffData) => void;
    isLoading?: boolean;
}) => {
    const [staffName, setStaffName] = useState(data?.name ?? '');
    const [staffDescription, setStaffDescription] = useState('');
    const [representColor, setRepresentColor] = useState(
        data?.color ?? ColorUtils.generateRandomColor()
    );
    const [email, setEmail] = useState(data?.email ?? '');
    const [phoneNumber, setPhoneNumber] = useState(data?.phoneNumber ?? '');
    const { showSnackbar }: SnackbarContextData = useContext(SnackbarContext)!;

    useEffect(() => {
        setStaffName(data?.name ?? '');
        setRepresentColor(data?.color ?? ColorUtils.generateRandomColor());
        setEmail(data?.email ?? '');
        setPhoneNumber(data?.phoneNumber ?? '');
    }, [data]);

    const validator = (value: string) => {
        return value.length > 0;
    };

    const handleOnConfirm = () => {
        if (!validator(staffName)) {
            showSnackbar('Staff name is required', 'error');
            return;
        }

        const staffData: StaffData = {
            id: data?.id ?? uuidv4(),
            name: staffName,
            color: representColor,
            email,
            phoneNumber
        };

        onConfirm(staffData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{`${data === undefined ? 'Add Staff' : 'Edit Staff'}`}</DialogTitle>
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
                <Button
                    onClick={handleOnConfirm}
                    color="primary"
                    sx={{ minWidth: 80 }}
                    variant={'contained'}
                >
                    {isLoading && <CircularProgress size={24} />}

                    {isLoading ? null : data === undefined ? 'Add' : 'Edit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const AddStaffDialog = ({
    open,
    onClose,
    onAddStaff,
    isLoading
}: {
    open: boolean;
    onClose: () => void;
    onAddStaff: (staffData: StaffData) => void;
    isLoading?: boolean;
}) => {
    return (
        <StaffDialog
            open={open}
            onClose={onClose}
            onConfirm={onAddStaff}
            isLoading={isLoading}
        />
    );
};

export const EditStaffDialog = ({
    open,
    data,
    onClose,
    onEditStaff,
    isLoading
}: {
    open: boolean;
    data: StaffData;
    onClose: () => void;
    onEditStaff: (staffData: StaffData) => void;
    isLoading?: boolean;
}) => {
    return (
        <StaffDialog
            open={open}
            data={data}
            onClose={onClose}
            onConfirm={onEditStaff}
            isLoading={isLoading}
        />
    );
};
