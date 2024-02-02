import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    MonthView,
    Toolbar,
    DateNavigator,
    TodayButton,
    WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import { useEffect, useRef, useState } from 'react';
import CustomTimeTableCell from './TimeTableCells';
import { getSelectedCells } from '../../../utils/SchedulerHelpers';
import { Paper } from '@mui/material';
import { SelectedSchedule } from '../../../models/scheduler/ScheduleModel';
import { getISOWeekNumberFromDate } from '../../../utils/DateTimeUtils';

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
    const lastEnteredCellRef = useRef<string | null>(null);

    const toDxLocaleString = (date: Date) => {
        // Use toLocaleString to format the date in the desired timezone
        const formattedDateString = date
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

        return `${formattedDateString} ${timezoneAbbreviation}`;
    };
    useEffect(() => {
        // required Sun Jan 28 2024 10:30:00 GMT+1100 (Australian Eastern Daylight Time)
        if (!data) return;

        let dates = Array.from(new Set(data));
        const dxDateString = new Array<string>();
        for (let date of dates) {
            // Create a Date object from the ISO string
            const dateString = toDxLocaleString(new Date(date));
            dxDateString.push(dateString);
        }
        setSelectedCells(dxDateString);
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

        const dateString = currentDate.toString();
        if (lastEnteredCellRef.current === dateString) {
            // Do not update the state if the mouse has not moved to a new cell
            return;
        }

        // Update the last entered cell
        lastEnteredCellRef.current = dateString;

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

    const filterInvalidSelectedCells = (selectedCells: string[]): string[] => {
        return selectedCells.filter((cell) => {
            const date = new Date(cell);
            // Extract minutes
            const minutes = date.getMinutes();
            // Check if minutes are exactly on the hour (00) or half-hour (30)
            return minutes === 0 || minutes === 30;
        });
    };

    const handleMouseUp = () => {
        if (!isEnabled) return;
        let year = currentDate.getFullYear();
        let weekNumber = getISOWeekNumberFromDate(currentDate);

        let selectedSchedule = new SelectedSchedule(
            year,
            weekNumber,
            // Filter out invalid selected cells, maybe the user dragged too fast or bug which
            // caused the cells is not in 30 minutes interval
            filterInvalidSelectedCells(selectedCells)
        );

        onFinish(selectedSchedule);

        setIsDragging(false);
        setDragStart(null);
    };

    const handleCurrentDateChange = (date: Date) => {
        setSelectedCells([]);
        onCurrentDateChange(date);
    };

    return (
        <Paper
            style={{
                userSelect: 'none', // Prevent text selection during drag
                height: '500px' // Adjust height as needed
            }}
        >
            <Scheduler>
                <ViewState
                    currentDate={currentDate}
                    onCurrentDateChange={handleCurrentDateChange}
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
                            onCellMouseUp={handleMouseUp}
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
