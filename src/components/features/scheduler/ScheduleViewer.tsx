import { IconButton, Menu, MenuItem, Paper, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StaffAppointment from '../../../models/scheduler/StaffAppointment';
import {
    AppointmentTooltip,
    Appointments,
    DateNavigator,
    MonthView,
    Scheduler,
    TodayButton,
    Toolbar,
    WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { StaffScheduleMap } from '../../../models/scheduler/ScheduleModel';
import {
    Appointment,
    AppointmentContent,
    AppointmentHeader
} from './Appointments';
import {
    dateGroupToAppointments,
    groupContinuesTime,
    sortDates
} from '../../../utils/SchedulerHelpers';
import { IosShare } from '@mui/icons-material';
import ShareAppointmentDialog from './ShareAppointmentDialog';
import { useState } from 'react';
import { AccessTokenService } from '../../../services/TokenService';
import React from 'react';
import { exportComponentAsImage } from '../../../utils/ImageUtils';
import { getISOWeekNumberFromDate } from '../../../utils/DateTimeUtils';

const handleDeleteAppointment = () => {
    console.log('handleDeleteAppointment');
};

const ScheduleViewer = ({
    data,
    currentDate,
    onCurrentDateChange,
    currentViewName,
    onCurrentViewNameChange,
    onDelete
}: {
    data: StaffScheduleMap;
    currentDate: Date;
    onCurrentDateChange?: (date: Date) => void;
    currentViewName: string;
    onCurrentViewNameChange?: (viewName: string) => void;
    onDelete?: (appointment: StaffAppointment) => void;
}) => {
    const theme = useTheme();
    const [dialogOpen, setDialogOpen] = useState(false);
    const appointments = new Map<string, StaffAppointment[]>();
    const viewerComponentRef = React.useRef<HTMLDivElement>(null);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event: any) => {
        // Open menu only if onDelete callback is provided
        if (onDelete != null) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    Object.entries(data).forEach(([staffName, selectedSchedule]) => {
        if ((selectedSchedule?.schedule?.length ?? 0) === 0) {
            return;
        }

        let sortedDateString = sortDates(selectedSchedule.schedule);
        let groupedDates = groupContinuesTime(sortedDateString);
        appointments.set(
            staffName,
            dateGroupToAppointments(staffName, groupedDates)
        );
    });

    const handleShareScheduleOpenDialog = () => {
        setAnchorEl(null);
        setDialogOpen(true);
    };

    const handleShareScheduleCloseDialog = () => {
        setDialogOpen(false);
    };

    let dxReactAppointments = Array.from(appointments.values()).flat();

    const handleShareClick = async () => {
        handleShareScheduleOpenDialog();
    };

    const handleExportAsImageClick = async () => {
        setAnchorEl(null);
        const weekNumber = getISOWeekNumberFromDate(currentDate);
        exportComponentAsImage(
            viewerComponentRef,
            `schedule_st_zita_week${weekNumber}_${currentDate.toDateString()}`,
            1920,
            1080
        );
    };

    return (
        <Paper
            ref={viewerComponentRef}
            style={{
                userSelect: 'none', // Prevent text selection during drag
                position: 'relative'
            }}
        >
            <Scheduler data={dxReactAppointments}>
                <ViewState
                    currentDate={currentDate}
                    onCurrentDateChange={onCurrentDateChange}
                    currentViewName={currentViewName}
                    onCurrentViewNameChange={onCurrentViewNameChange}
                />
                <WeekView startDayHour={8} endDayHour={16} />
                <MonthView />
                <Appointments
                    appointmentComponent={Appointment}
                    appointmentContentComponent={AppointmentContent}
                />
                <Toolbar />
                <DateNavigator />
                <TodayButton />

                <AppointmentTooltip
                    headerComponent={(props) => (
                        <AppointmentHeader
                            {...props}
                            onDelete={handleDeleteAppointment}
                        />
                    )}
                />
            </Scheduler>
            {AccessTokenService.getToken() && (
                <React.Fragment>
                    <Tooltip title="Share" arrow>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 20,
                                color: theme.palette.primary.main
                            }}
                            onClick={handleMenuClick}
                        >
                            <IosShare />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleShareClick}>Share</MenuItem>

                        <MenuItem onClick={handleExportAsImageClick}>
                            Export as Image
                        </MenuItem>
                    </Menu>
                    <ShareAppointmentDialog
                        open={dialogOpen}
                        onRemove={handleShareScheduleCloseDialog}
                        onDone={handleShareScheduleCloseDialog}
                    />
                </React.Fragment>
            )}
        </Paper>
    );
};

export default ScheduleViewer;
