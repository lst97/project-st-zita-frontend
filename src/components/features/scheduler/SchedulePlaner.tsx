import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments
} from '@devexpress/dx-react-scheduler-material-ui';
import { useState } from 'react';
import CustomTimeTableCell from './TimeTableCells';
import { getSelectedCells } from '../../../utils/ScheduleHelpers';

const MyScheduler = () => {
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [initialAction, setInitialAction] = useState<'select' | 'unselect'>(
    'select'
  );

  // Example data
  const appointments = [
    {
      startDate: '2024-01-28T09:45',
      endDate: '2024-01-28T11:00',
      title: 'Meeting'
    },
    {
      startDate: '2024-01-28T09:45',
      endDate: '2024-01-28T11:00',
      title: 'Meeting'
    },
    {
      startDate: '2024-01-28T09:45',
      endDate: '2024-01-28T11:00',
      title: 'Meeting'
    },
    {
      startDate: '2024-01-28',
      endDate: '2024-01-29',
      title: 'All Day Conference',
      allDay: true
    }
    // Add more appointments here
  ];

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
    <div
      onMouseUp={handleMouseUp}
      style={{ userSelect: 'none' }} // Prevent text selection during drag
    >
      <Scheduler data={appointments}>
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
        <Appointments />
      </Scheduler>
    </div>
  );
};

export default MyScheduler;
