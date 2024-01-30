import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
  WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import { useState } from 'react';
import CustomTimeTableCell from './TimeTableCells';
import { getSelectedCells } from '../../../utils/ScheduleHelpers';
import { Paper } from '@mui/material';

const SchedulePlaner = () => {
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [initialAction, setInitialAction] = useState<'select' | 'unselect'>(
    'select'
  );

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    date: Date
  ) => {
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
    if (isDragging && dragStart) {
      setSelectedCells((prevSelectedCells) => {
        const newSelectedCells = getSelectedCells(dragStart, currentDate);

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
        <ViewState />
        <WeekView
          startDayHour={8}
          endDayHour={16}
          timeTableCellComponent={(props) => (
            <CustomTimeTableCell
              {...props}
              startDate={props.startDate!}
              onCellEnter={handleMouseEnter}
              onCellMouseDown={handleMouseDown} // Pass this new prop
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
