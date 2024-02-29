import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider } from '@mui/material';

export function managerDrawerItems(
    selectedTabIndex: number,
    onTabClick: (tabIndex: number) => void
) {
    return (
        <React.Fragment>
            <React.Fragment>
                <ListItemButton
                    tabIndex={0}
                    selected={selectedTabIndex === 0}
                    onClick={(event) => {
                        onTabClick(event.currentTarget.tabIndex);
                    }}
                >
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Staff Schedule" />
                </ListItemButton>
                <ListItemButton
                    tabIndex={1}
                    selected={selectedTabIndex === 1}
                    onClick={(event) => {
                        onTabClick(event.currentTarget.tabIndex);
                    }}
                >
                    <ListItemIcon>
                        <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ingredient Order" />
                </ListItemButton>
                <ListItemButton
                    tabIndex={2}
                    selected={selectedTabIndex === 2}
                    onClick={(event) => {
                        onTabClick(event.currentTarget.tabIndex);
                    }}
                >
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Stock Management" />
                </ListItemButton>
                <ListItemButton
                    tabIndex={3}
                    selected={selectedTabIndex === 3}
                    onClick={(event) => {
                        onTabClick(event.currentTarget.tabIndex);
                    }}
                >
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </ListItemButton>
                <Divider sx={{ my: 1 }} />
                <ListSubheader component="div" inset>
                    Saved reports
                </ListSubheader>
                <ListItemButton
                    tabIndex={4}
                    selected={selectedTabIndex === 4}
                    onClick={(event) => {
                        onTabClick(event.currentTarget.tabIndex);
                    }}
                >
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Current month" />
                </ListItemButton>
                <ListItemButton
                    tabIndex={5}
                    sx={{ position: 'absolute', bottom: 0, width: '100%' }}
                    onClick={(event) => {
                        onTabClick(event.currentTarget.tabIndex);
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </React.Fragment>
        </React.Fragment>
    );
}

export const guestMainListItems = (
    <React.Fragment>
        <ListItemButton selected={true}>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Shared Schedule" />
        </ListItemButton>
    </React.Fragment>
);

export const guestSecondaryListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            Other
        </ListSubheader>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Feedback" />
        </ListItemButton>
    </React.Fragment>
);
