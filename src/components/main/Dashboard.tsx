import * as React from 'react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
    guestMainListItems,
    guestSecondaryListItems,
    managerDrawerItems
} from './DrawerItems';
import Copyright from '../common/footers/Copyright';
import { AccessTokenService } from '../../services/TokenService';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        boxSizing: 'border-box',
        ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9)
            }
        })
    }
}));

export default function Dashboard({
    children
}: {
    children?: React.ReactNode;
}) {
    const [open, setOpen] = React.useState(true);
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleOnTabClick = (tabIndex: number) => {
        if (tabIndex === 5) {
            handleLogoutClick();
        }
        setSelectedTabIndex(tabIndex);
    };

    const handleLogoutClick = () => {
        console.log(location.pathname.split('/'));
        AccessTokenService.removeToken();
        navigate('/signin', { replace: true });
    };

    return (
        <React.Fragment>
            {AccessTokenService.getToken() != null ||
            location.pathname.split('/')[2] === 'share' ? (
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar position="absolute" open={open}>
                        <Toolbar
                            sx={{
                                pr: '24px' // keep right padding when drawer closed
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                sx={{
                                    marginRight: '36px',
                                    ...(open && { display: 'none' })
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                sx={{ flexGrow: 1 }}
                            >
                                Dashboard
                            </Typography>
                            {AccessTokenService.getToken() && (
                                <IconButton color="inherit">
                                    <Badge badgeContent={4} color="secondary">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            )}
                        </Toolbar>
                    </AppBar>
                    <Drawer variant="permanent" open={open}>
                        <Toolbar
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: [1]
                            }}
                        >
                            <IconButton onClick={toggleDrawer}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <List
                            component="nav"
                            sx={{ position: 'relative', height: '100%' }}
                        >
                            {AccessTokenService.getToken() ? (
                                <React.Fragment>
                                    {managerDrawerItems(
                                        selectedTabIndex,
                                        handleOnTabClick
                                    )}
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {guestMainListItems}
                                    <Divider sx={{ my: 1 }} />
                                    {guestSecondaryListItems}
                                </React.Fragment>
                            )}
                        </List>
                    </Drawer>
                    <Box
                        component="main"
                        sx={{
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? theme.palette.grey[100]
                                    : theme.palette.grey[900],

                            height: '100vh',
                            flexGrow: 1
                        }}
                    >
                        <Toolbar />
                        <Box sx={{ overflow: 'auto', padding: 2 }}>
                            {children}
                            <Copyright />
                        </Box>
                    </Box>
                </Box>
            ) : (
                <div>Logging out ...</div>
            )}
        </React.Fragment>
    );
}
