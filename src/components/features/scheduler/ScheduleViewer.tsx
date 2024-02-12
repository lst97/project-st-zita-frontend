import { Paper } from '@mui/material';
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
    onCurrentDateChange: (date: Date) => void;
    currentViewName: string;
    onCurrentViewNameChange: (viewName: string) => void;
    onDelete: (appointment: StaffAppointment) => void;
}) => {
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

    let dxReactAppointments = Array.from(appointments.values()).flat();

    return (
        <Paper
            style={{
                userSelect: 'none' // Prevent text selection during drag
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
        </Paper>
    );
};

export default ScheduleViewer;
