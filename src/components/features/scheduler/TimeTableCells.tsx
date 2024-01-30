import { StyledTimeTableCell } from './scheduler.style';

const CustomTimeTableCell = ({
    onCellEnter,
    onCellMouseDown,
    isDisabled,
    selectedCells,
    startDate,
    ...restProps
}: {
    onCellEnter: (date: Date) => void;
    isDisabled: boolean;
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
            disabled={isDisabled}
            onMouseEnter={() => onCellEnter(startDate)}
            onMouseDown={(event: any) => onCellMouseDown(event, startDate)}
        />
    );
};

export default CustomTimeTableCell;
