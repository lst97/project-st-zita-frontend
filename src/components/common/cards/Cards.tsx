import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
    StyledAvatar,
    StyledCard,
    StyledCardContent,
    StyledCheckIcon
} from './cards.style';
import { useState } from 'react';
import StaffCardContent from '../../../models/scheduler/StaffCardContent';
import { Typography } from '@mui/material';

const StaffCard = ({
    onClick,
    onDelete,
    data,
    isSelected
}: {
    onClick: () => void;
    onDelete: (staff: StaffCardContent) => void | null;
    isSelected: boolean;
    data: { name: string; description: string };
}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event: any) => {
        // Open menu only if onDelete callback is provided
        if (onDelete != null) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        handleMenuClose();
        if (onDelete) {
            onDelete(data); // Call the provided onDelete function with the staff data
        }
    };

    return (
        <StyledCard isSelected={isSelected}>
            <CardActionArea
                style={{ display: 'flex', width: '100%' }}
                onClick={onClick}
            >
                <StyledAvatar>S</StyledAvatar>
                <StyledCardContent>
                    <Typography variant="h6">{data.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {data.description}
                    </Typography>
                </StyledCardContent>
                {isSelected && <StyledCheckIcon />}
            </CardActionArea>
            {onDelete != null && (
                <>
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleMenuClick}
                        style={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            )}
        </StyledCard>
    );
};

export default StaffCard;
