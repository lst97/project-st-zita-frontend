import { Paper } from '@mui/material';
import StaffSchedule from '../../../models/scheduler/StaffSchedule';
import {
    DateNavigator,
    MonthView,
    Scheduler,
    TodayButton,
    Toolbar,
    WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';

const ScheduleViewer = ({ data }: { data: StaffSchedule[] }) => {
    return (
        <Paper
            style={{
                userSelect: 'none' // Prevent text selection during drag
            }}
        >
            <Scheduler>
                <ViewState />
                <WeekView startDayHour={8} endDayHour={16} />
                <MonthView />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
            </Scheduler>
        </Paper>
    );
};

export default ScheduleViewer;
