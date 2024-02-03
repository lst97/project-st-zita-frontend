import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const StyledCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isSelected' // Do not forward 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    display: 'flex',
    alignItems: 'center',
    margin: 8,
    backgroundColor: isSelected
        ? theme.palette.action.selected
        : theme.palette.background.paper,
    position: 'relative' // For absolute positioning of the tick icon
}));

export const StyledCheckIcon = styled(CheckCircleIcon)(({ theme }) => ({
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.success.main
}));

export const StyledAvatar = styled(Avatar)({
    margin: 16,
    backgroundColor: '#1976d2',
    // Adjust the size if needed
    width: 56,
    height: 56
});

export const StyledCardContent = styled(CardContent)({
    flex: '1'
    // Add additional styling if needed
});
