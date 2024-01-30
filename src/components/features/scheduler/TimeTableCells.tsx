import { styled } from '@mui/material/styles';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';

const StyledTimeTableCell = styled(WeekView.TimeTableCell)(
  ({ theme, selected }) => ({
    backgroundColor: selected ? 'lightgreen' : theme.palette.background.paper,
    '&:hover': {
      backgroundColor: 'lightblue'
    },
    cursor: 'pointer'
  })
);

const CustomTimeTableCell = ({
  onCellEnter,
  onCellMouseDown,
  selectedCells,
  startDate,
  ...restProps
}: {
  onCellEnter: (date: Date) => void;
  onCellMouseDown: (
    event: React.MouseEvent<HTMLDivElement>,
    date: Date
  ) => void;
  selectedCells: string[];
  startDate: Date;
}) => {
  const isSelected = selectedCells.includes(startDate.toString());

  return (
    <StyledTimeTableCell
      {...restProps}
      selected={isSelected}
      onMouseEnter={() => onCellEnter(startDate)}
      onMouseDown={(event: any) => onCellMouseDown(event, startDate)}
    />
  );
};

export default CustomTimeTableCell;
