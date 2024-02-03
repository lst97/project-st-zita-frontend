import { styled } from '@mui/material/styles';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';

// Define the types for the additional props
interface TimeTableCellProps {
    selected?: boolean;
    disabled?: boolean;
}

export const StyledTimeTableCell = styled(
    WeekView.TimeTableCell
)<TimeTableCellProps>(({ theme, selected, disabled }) => ({
    '&&:hover': {
        backgroundColor: disabled
            ? theme.palette.action.disabled
            : theme.palette.primary.main
    },

    backgroundColor: disabled
        ? theme.palette.action.disabled
        : selected
          ? theme.palette.success.main
          : theme.palette.background.paper,
    cursor: disabled ? 'not-allowed' : 'pointer'
}));
