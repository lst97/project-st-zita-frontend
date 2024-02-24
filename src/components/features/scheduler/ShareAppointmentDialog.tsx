import { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
    CircularProgress,
    FormControl,
    FormHelperText,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
    colors
} from '@mui/material';
import { Public, SettingsOutlined } from '@mui/icons-material';
import { Permission, PermissionHelper } from '../../../utils/PermissionHelper';
import useTheme from '@mui/material/styles/useTheme';
import { SnackbarContext } from '../../../context/SnackbarContext';
import { AppointmentApiService } from '../../../services/ApiService';

const commonFlexColumnStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start'
};

const ShareAppointmentDialog = ({
    open,
    onRemove,
    onDone
}: {
    open: boolean;
    onRemove: () => void;
    onDone: () => void;
}) => {
    const { showSnackbar } = useContext(SnackbarContext)!;

    const [isLoading, setIsLoading] = useState(false);

    const [switchState, setSwitchState] = useState({
        allTime: true,
        allStaffs: true
    });

    const [selectedPermission, setSelectedPermission] = useState<Permission>(
        Permission.Read
    ); // Or the initial permission

    // TODO: not used
    const [weekViewRange, setWeekViewRange] = useState({
        start: '',
        end: ''
    });
    // TODO: not used
    const [staffs, setStaffs] = useState([]); // [staffName, ... ]

    const theme = useTheme();

    const handleOnSwitchChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSwitchState({
            ...switchState,
            [event.target.name]: event.target.checked
        });
    };

    const handleCopyLinkClick = async () => {
        setIsLoading(true);

        const response = await AppointmentApiService.createShareAppointments(
            selectedPermission.toString()
        );

        setIsLoading(false);

        const link = `${window.location.origin}/scheduler/share/${response.data}`;
        navigator.clipboard.writeText(link);

        showSnackbar('Link copied', 'success');
    };

    const handlePermissionChange = (event: SelectChangeEvent) => {
        setSelectedPermission(parseInt(event.target.value) as Permission);
    };

    return (
        <Dialog open={open} onClose={onDone}>
            <DialogTitle>
                <Grid container spacing={2}>
                    <Grid xs={11}>
                        <Typography variant="h4">Share Schedule</Typography>
                    </Grid>
                    <Grid xs={1}>
                        <IconButton onClick={() => {}}>
                            <SettingsOutlined />
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <FormGroup>
                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <Typography variant="h5">
                                Information to show
                            </Typography>
                        </Grid>
                        <Grid xs={8} sx={commonFlexColumnStyles}>
                            <Typography variant="body1">From</Typography>
                        </Grid>
                        <Grid xs={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={switchState.allTime}
                                        onChange={handleOnSwitchChange}
                                        name="allTime"
                                    />
                                }
                                label="All Time"
                            />
                        </Grid>
                        <Grid xs={8} sx={commonFlexColumnStyles}>
                            <Typography variant="body1">
                                Show Staff Picker
                            </Typography>
                        </Grid>
                        <Grid xs={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={switchState.allStaffs}
                                        onChange={handleOnSwitchChange}
                                        name="allStaffs"
                                    />
                                }
                                label="All Staffs"
                            />
                        </Grid>
                        <Grid xs={12}>
                            <Typography variant="h5">General access</Typography>
                        </Grid>
                        <Grid xs={12}>
                            <Typography variant="body1">Expiry</Typography>
                        </Grid>
                        <Grid xs={1} sx={commonFlexColumnStyles}>
                            <Public
                                sx={{ color: theme.palette.primary.main }}
                            />
                        </Grid>
                        <Grid xs={7}>
                            <FormControl fullWidth variant="standard">
                                <Select
                                    labelId="share-appointment-link-permission-label"
                                    id="share-appointment-link-permission"
                                    value={selectedPermission.toString()}
                                    label="Permission"
                                    onChange={handlePermissionChange}
                                >
                                    <MenuItem value={Permission.Read}>
                                        View
                                    </MenuItem>
                                    <MenuItem value={Permission.Comment}>
                                        Comment
                                    </MenuItem>
                                    <MenuItem value={Permission.Write}>
                                        Edit
                                    </MenuItem>
                                </Select>
                                <FormHelperText>
                                    {PermissionHelper.description(
                                        selectedPermission
                                    )}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid xs={4} sx={commonFlexColumnStyles}>
                            <Button
                                sx={{ minWidth: 120 }}
                                variant="outlined"
                                onClick={handleCopyLinkClick}
                                color="primary"
                                disabled={
                                    switchState.allStaffs === false ||
                                    switchState.allTime === false
                                }
                            >
                                {isLoading === true ? (
                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                ) : isLoading === false &&
                                  (switchState.allStaffs === false ||
                                      switchState.allTime === false) ? (
                                    'Not Support Yet'
                                ) : (
                                    'Copy Link'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onDone} color="primary">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareAppointmentDialog;
