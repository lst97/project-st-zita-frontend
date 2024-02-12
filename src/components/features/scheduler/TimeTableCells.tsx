import Tooltip from '@mui/material/Tooltip';
import { isDateIncluded } from '../../../utils/SchedulerHelpers';
import { StyledTimeTableCell } from './scheduler.style';

const CustomTimeTableCell = ({
    onCellEnter,
    onCellMouseDown,
    onCellMouseUp,
    isDisabled,
    selectedCells,
    currentCellDate,
    ...restProps
}: {
    onCellEnter: (date: Date) => void;
    isDisabled: boolean;
    onCellMouseUp: () => void;
    onCellMouseDown: (
        event: React.MouseEvent<HTMLDivElement>,
        date: Date
    ) => void;
    selectedCells: Date[];
    currentCellDate: Date;
}) => {
    const isSelected = isDateIncluded(selectedCells, currentCellDate);

    return (
        <Tooltip
            disableFocusListener
            disableTouchListener
            disableInteractive
            title={currentCellDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            })}
        >
            <StyledTimeTableCell
                {...restProps}
                selected={isSelected}
                disabled={isDisabled}
                onMouseEnter={() => onCellEnter(currentCellDate)}
                onMouseDown={(event: any) =>
                    onCellMouseDown(event, currentCellDate)
                }
                onMouseUp={onCellMouseUp}
                sx={{
                    height: '20px',
                    border: '1px solid #e0e0e0'
                }}
            />
        </Tooltip>
    );
};

export default CustomTimeTableCell;
