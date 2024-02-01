import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    MonthView,
    Toolbar,
    DateNavigator,
    TodayButton,
    WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import { useEffect, useState } from 'react';
import CustomTimeTableCell from './TimeTableCells';
import { getSelectedCells } from '../../../utils/SchedulerHelpers';
import { Paper } from '@mui/material';
import { SelectedSchedule } from '../../../models/scheduler/ScheduleModel';
import { getISOWeekNumberFromDateString } from '../../../utils/DateTimeUtils';

const SchedulePlaner = ({
    isEnabled,
    data,
    onFinish,
    currentDate,
    onCurrentDateChange,
    currentViewName,
    onCurrentViewNameChange
}: {
    isEnabled: boolean;
    data?: string[];
    onFinish: (selectedCells: SelectedSchedule) => void;
    currentDate: Date;
    onCurrentDateChange: (date: Date) => void;
    currentViewName: string;
    onCurrentViewNameChange: (viewName: string) => void;
}) => {
    const [selectedCells, setSelectedCells] = useState<string[]>([]);

    useEffect(() => {
        // required Sun Jan 28 2024 10:30:00 GMT+1100 (Australian Eastern Daylight Time)
        if (!data) return;

        let dates = Array.from(new Set(data));

        for (let date of dates) {
            // Create a Date object from the ISO string
            const dateObj = new Date(date);

            // Use toLocaleString to format the date in the desired timezone
            const formattedDateString = dateObj
                .toLocaleString('en-US', {
                    timeZone: 'Australia/Melbourne',
                    weekday: 'short', // "Sun"
                    year: 'numeric', // "2024"
                    month: 'short', // "Jan"
                    day: '2-digit', // "28"
                    hour: '2-digit', // "10"
                    minute: '2-digit', // "00"
                    second: '2-digit', // "00"
                    hour12: false // Use 24-hour time
                })
                .replace(/,/g, '');

            // Since toLocaleString may not include the timezone abbreviation directly,
            const timezoneAbbreviation =
                'GMT+1100 (Australian Eastern Daylight Time)';

            setSelectedCells((prevSelectedCells) => [
                ...prevSelectedCells,
                `${formattedDateString} ${timezoneAbbreviation}`
            ]);
        }
    }, [data]); // Dependency array, useEffect runs when `data` changes

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Date | null>(null);
    const [initialAction, setInitialAction] = useState<'select' | 'unselect'>(
        'select'
    );

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement>,
        date: Date
    ) => {
        if (!isEnabled) {
            return;
        }

        event.preventDefault();
        const dateString = date.toString();
        setIsDragging(true);
        setDragStart(date);

        if (selectedCells.includes(dateString)) {
            // If the cell is already selected, the initial action is to unselect
            setSelectedCells((prevSelectedCells) =>
                prevSelectedCells.filter((date) => date !== dateString)
            );
            setInitialAction('unselect');
        } else {
            // If the cell is not selected, the initial action is to select
            setSelectedCells((prevSelectedCells) => [
                ...prevSelectedCells,
                dateString
            ]);
            setInitialAction('select');
        }
    };

    const handleMouseEnter = (currentDate: Date) => {
        if (!isEnabled) return;

        if (isDragging && dragStart) {
            setSelectedCells((prevSelectedCells) => {
                const newSelectedCells = getSelectedCells(
                    dragStart,
                    currentDate
                );

                if (initialAction === 'unselect') {
                    // Unselect mode - remove cells from the selection
                    return prevSelectedCells.filter(
                        (cell) => !newSelectedCells.includes(cell)
                    );
                } else {
                    // Select mode - add new cells to the selection
                    return Array.from(
                        new Set([...prevSelectedCells, ...newSelectedCells])
                    );
                }
            });
        }
    };

    const handleMouseUp = () => {
        if (!isEnabled) return;
        let year = parseInt(currentViewName.slice(-4), 10);
        let weekNumber = getISOWeekNumberFromDateString(currentViewName);
        let selectedSchedule = new SelectedSchedule(
            year,
            weekNumber,
            selectedCells
        );
        onFinish(selectedSchedule);
        setIsDragging(false);
        setDragStart(null);
    };

    return (
        <Paper
            onMouseUp={handleMouseUp}
            style={{
                userSelect: 'none', // Prevent text selection during drag
                height: '500px' // Adjust height as needed
            }}
        >
            <Scheduler>
                <ViewState
                    currentDate={currentDate}
                    onCurrentDateChange={onCurrentDateChange}
                    currentViewName={currentViewName}
                    onCurrentViewNameChange={onCurrentViewNameChange}
                />
                <WeekView
                    startDayHour={8}
                    endDayHour={16}
                    timeTableCellComponent={(props) => (
                        <CustomTimeTableCell
                            {...props}
                            isDisabled={!isEnabled}
                            startDate={props.startDate!}
                            onCellEnter={handleMouseEnter}
                            onCellMouseDown={handleMouseDown}
                            selectedCells={selectedCells}
                        />
                    )}
                />
                <MonthView />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
            </Scheduler>
        </Paper>
    );
};

export default SchedulePlaner;
