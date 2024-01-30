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
import { ColorUtils } from '../../../utils/ColorUtils';

const APPOINTMENT_LENGTH = 30; // Each time-slot is 30 minutes

function parseAndSortDate(dateStrings: string[]) {
    const dates = dateStrings.map((dateStr) => new Date(dateStr));
    dates.sort((a, b) => a.getTime() - b.getTime());
    return dates;
}

function groupContinuesTime(dates: Date[]): Date[][] {
    const groupedDates = [];
    let tempGroup = [dates[0]];

    for (let i = 1; i < dates.length; i++) {
        const diff =
            (dates[i].getTime() - tempGroup[tempGroup.length - 1].getTime()) /
            1000 /
            60; // Difference in minutes

        if (diff <= APPOINTMENT_LENGTH) {
            tempGroup.push(dates[i]);
        } else {
            groupedDates.push(tempGroup);
            tempGroup = [dates[i]];
        }
    }

    if (tempGroup.length > 0) {
        groupedDates.push(tempGroup);
    }

    return groupedDates;
}

function dateGroupToAppointments(
    staffName: string,
    dateGroup: Date[][]
): StaffAppointment[] {
    const appointments = dateGroup.map((group: Date[], index: number) => {
        const startDate = group[0];
        const endDate = new Date(
            group[group.length - 1].getTime() + APPOINTMENT_LENGTH * 60000
        );
        return new StaffAppointment(
            staffName,
            startDate,
            endDate,
            index,
            '',
            ColorUtils.getColorFor(staffName)
        );
    });

    return appointments;
}

const handleDeleteAppointment = () => {
    console.log('handleDeleteAppointment');
};

const ScheduleViewer = ({
    data,
    currentDate,
    onCurrentDateChange,
    currentViewName,
    onCurrentViewNameChange
}: {
    data: StaffScheduleMap;
    currentDate: Date;
    onCurrentDateChange: (date: Date) => void;
    currentViewName: string;
    onCurrentViewNameChange: (viewName: string) => void;
}) => {
    let appointments = new Map<string, StaffAppointment[]>();

    Object.entries(data).forEach(([staffName, selectedSchedule]) => {
        let sortedDateString = parseAndSortDate(selectedSchedule.schedule);
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
