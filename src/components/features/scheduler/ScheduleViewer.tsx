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
import { Appointment, AppointmentContent } from './Appointments';
import {
    dateGroupToAppointments,
    groupContinuesTime,
    sortDates
} from '../../../utils/SchedulerHelpers';
import { IosShare } from '@mui/icons-material';
import ShareAppointmentDialog from './ShareAppointmentDialog';
import { useEffect, useState } from 'react';
import React from 'react';
import { exportComponentAsImage } from '../../../utils/ImageUtils';
import { getISOWeekNumberFromDate } from '../../../utils/DateTimeUtils';
import ExportAsExcelDialog from './ExportAsExcelDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { ReactTokenServiceInstance } from '@lst97/common-services';

const ScheduleViewer = ({
    data,
    focusStaffName,
    selectedStaffNames,
    currentDate,
    onCurrentDateChange,
    currentViewName,
    onCurrentViewNameChange,
    onDelete,
    tooltipVisibility,
    onTooltipVisibilityChange
}: {
    data: StaffScheduleMap;
    focusStaffName?: string | null;
    selectedStaffNames?: string[];
    currentDate: Date;
    onCurrentDateChange?: (date: Date) => void;
    currentViewName: string;
    onCurrentViewNameChange?: (viewName: string) => void;
    onDelete?: (appointment: StaffAppointment) => void;
    tooltipVisibility?: boolean;
    onTooltipVisibilityChange?: (visibility: boolean) => void;
}) => {
    const theme = useTheme();
    const [shareLinkDialogOpen, setShareLinkDialogOpen] = useState(false);
    const [exportAsExcelDialogOpen, setExportAsExcelDialogOpen] =
        useState(false);

    const [appointments, setAppointments] = useState<
        Map<string, StaffAppointment[]>
    >(new Map());

    const viewerComponentRef = React.useRef<HTMLDivElement>(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const [dxReactAppointments, setDxReactAppointments] = useState<
        StaffAppointment[]
    >([]);

    const handleMenuClick = (event: any) => {
        // Open menu only if onDelete callback is provided
        if (onDelete != null) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteAppointment = (appointment: StaffAppointment) => {
        if (onDelete) {
            onDelete(appointment);
        }
    };

    useEffect(() => {
        setDxReactAppointments(Array.from(appointments.values()).flat());
    }, [appointments]);

    useEffect(() => {
        const allAppointments = calculateAppointments(data);

        let displayedAppointments;

        if (selectedStaffNames && selectedStaffNames.length > 0) {
            // Only display selected staff appointments
            displayedAppointments = filterBySelectedStaff(
                allAppointments,
                selectedStaffNames
            );
            if (
                focusStaffName &&
                !selectedStaffNames.includes(focusStaffName)
            ) {
                console.log('TODO: add preview for focusStaffName');
            }
        } else if (focusStaffName) {
            // all appointments are displayed, but focus staff is highlighted
            displayedAppointments = adjustFocusStaffOpacity(
                allAppointments,
                focusStaffName
            );
        } else {
            // not selected any staff nor focus staff
            // display all appointments without any opacity adjustment
            displayedAppointments = allAppointments;
        }

        setAppointments(displayedAppointments);
    }, [data, focusStaffName, selectedStaffNames]);

    const calculateAppointments = (data: StaffScheduleMap) => {
        const appointments = new Map<string, StaffAppointment[]>();

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

        return appointments;
    };

    const filterBySelectedStaff = (
        appointments: Map<string, StaffAppointment[]>,
        selectedStaffNames: string[]
    ) => {
        const filteredAppointments = new Map<string, StaffAppointment[]>();

        appointments.forEach((appointments, staffName) => {
            if (selectedStaffNames.includes(staffName)) {
                filteredAppointments.set(staffName, appointments);
            }
        });

        return filteredAppointments;
    };

    const adjustFocusStaffOpacity = (
        appointments: Map<string, StaffAppointment[]>,
        focusStaffName: string
    ) => {
        const adjustedAppointments = new Map<string, StaffAppointment[]>();

        appointments.forEach((appointments, staffName) => {
            if (staffName !== focusStaffName) {
                appointments.forEach((appointment) => {
                    appointment.opacity = 0.1;
                });
                adjustedAppointments.set(staffName, appointments);
            } else {
                adjustedAppointments.set(staffName, appointments);
            }
        });

        return adjustedAppointments;
    };

    const handleShareScheduleOpenDialog = () => {
        setAnchorEl(null);
        setShareLinkDialogOpen(true);
    };

    const handleShareScheduleCloseDialog = () => {
        setShareLinkDialogOpen(false);
    };

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

    const handleExportAsExcelClick = async () => {
        setAnchorEl(null);
        setExportAsExcelDialogOpen(true);
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
                    visible={tooltipVisibility}
                    onVisibilityChange={onTooltipVisibilityChange}
                    showCloseButton={true}
                    headerComponent={(props) => (
                        <AppointmentTooltip.Header
                            className="appointment-header"
                            {...props}
                        >
                            <IconButton
                                onClick={() => {
                                    handleDeleteAppointment(
                                        props.appointmentData as StaffAppointment
                                    );
                                    onTooltipVisibilityChange?.(false);
                                }}
                            >
                                <DeleteIcon sx={{ margin: 0.5 }} />
                            </IconButton>
                        </AppointmentTooltip.Header>
                    )}
                />
            </Scheduler>

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
                    {ReactTokenServiceInstance().getToken('accessToken') && (
                        <MenuItem onClick={handleShareClick}>
                            Share Link
                        </MenuItem>
                    )}
                    {ReactTokenServiceInstance().getToken('accessToken') && (
                        <MenuItem onClick={handleExportAsExcelClick}>
                            Export as Excel
                        </MenuItem>
                    )}

                    <MenuItem onClick={handleExportAsImageClick}>
                        Export as Image
                    </MenuItem>
                </Menu>
                <ShareAppointmentDialog
                    open={shareLinkDialogOpen}
                    onRemove={handleShareScheduleCloseDialog}
                    onDone={handleShareScheduleCloseDialog}
                />
                <ExportAsExcelDialog
                    open={exportAsExcelDialogOpen}
                    onDone={() => setExportAsExcelDialogOpen(false)}
                />
            </React.Fragment>
        </Paper>
    );
};

export default ScheduleViewer;
