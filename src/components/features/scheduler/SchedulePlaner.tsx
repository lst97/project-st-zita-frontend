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
import {
    getSelectedCellsFromDragging,
    isDateIncluded
} from '../../../utils/SchedulerHelpers';
import { Paper } from '@mui/material';
import { SelectedSchedule } from '../../../models/scheduler/ScheduleModel';
import { getISOWeekNumberFromDate } from '../../../utils/DateTimeUtils';

const SchedulePlaner = ({
    isEnabled,
    onFinish,
    data,
    currentDate,
    onCurrentDateChange,
    currentViewName,
    onCurrentViewNameChange
}: {
    isEnabled: boolean;
    data?: Date[];
    onFinish: (selectedCells: SelectedSchedule) => void;
    currentDate: Date;
    onCurrentDateChange: (date: Date) => void;
    currentViewName: string;
    onCurrentViewNameChange: (viewName: string) => void;
}) => {
    // 1. Optimize mobile user experience
    // Consider how the app will work on mobile devices. The drag-and-drop interaction may not be as intuitive on touch screens.

    // TODO - Build 2: Optimize Array Manipulations,  Use Set for Performance
    const [selectedCells, setSelectedCells] = useState<Date[]>([]);

    const lastEnteredCellRef = useRef<Date | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Date | null>(null);
    const [initialAction, setInitialAction] = useState<'select' | 'unselect'>(
        'select'
    );

    useEffect(() => {
        if (data) {
            setSelectedCells(data);
        }
    }, [data]);

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement>,
        selectedDate: Date
    ) => {
        if (!isEnabled) {
            return;
        }

        event.preventDefault();
        setIsDragging(true);
        setDragStart(selectedDate);

        if (isDateIncluded(selectedCells, selectedDate)) {
            // If the cell is already selected, the initial action is to unselect
            setSelectedCells((prevSelectedCells) =>
                prevSelectedCells.filter(
                    (date) => date.getTime() !== selectedDate.getTime()
                )
            );
            setInitialAction('unselect');
        } else {
            // If the cell is not selected, the initial action is to select
            setSelectedCells((prevSelectedCells) => [
                ...prevSelectedCells,
                selectedDate
            ]);
            setInitialAction('select');
        }
    };

    const handleMouseEnter = (currentDate: Date) => {
        if (!isEnabled) return;

        if (lastEnteredCellRef.current === currentDate) {
            // Do not update the state if the mouse has not moved to a new cell
            return;
        }

        // Update the last entered cell
        lastEnteredCellRef.current = currentDate;

        // TODO: If the mouse moving too fast, isDragging && dragStart may not be updated yet due to the async nature of state updates
        if (isDragging && dragStart) {
            setSelectedCells((prevSelectedCells) => {
                const newSelectedCells = getSelectedCellsFromDragging(
                    dragStart,
                    currentDate
                );

                if (initialAction === 'unselect') {
                    // Unselect mode - remove cells from the selection
                    return prevSelectedCells.filter(
                        (cellDate) =>
                            !isDateIncluded(newSelectedCells, cellDate)
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

    // Filter out invalid selected cells, incorrect time will be selected if the user dragged outside the schedule planner
    const filterInvalidSelectedCells = (selectedCells: Date[]): Date[] => {
        return selectedCells.filter((cell) => {
            const date = cell;
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
            filterInvalidSelectedCells(selectedCells)
        );

        onFinish(selectedSchedule);

        setIsDragging(false);
        setDragStart(null);
    };

    const handleCurrentDateChange = (date: Date) => {
        onCurrentDateChange(date);
    };

    return (
        <Paper
            onMouseLeave={() => {
                handleMouseUp();
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
                    timeScaleLayoutComponent={() => null}
                    timeTableCellComponent={(props) => (
                        <CustomTimeTableCell
                            {...props}
                            isDisabled={!isEnabled}
                            currentCellDate={props.startDate!}
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
