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
        <StyledTimeTableCell
            {...restProps}
            selected={isSelected}
            disabled={isDisabled}
            onMouseEnter={() => onCellEnter(currentCellDate)}
            onMouseDown={(event: any) =>
                onCellMouseDown(event, currentCellDate)
            }
            onMouseUp={onCellMouseUp}
        />
    );
};

export default CustomTimeTableCell;
