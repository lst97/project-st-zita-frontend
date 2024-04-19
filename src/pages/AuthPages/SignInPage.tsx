import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Copyright from '../../components/common/footers/Copyright';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AuthApiService } from '../../services/ApiService';
import { ReactTokenServiceInstance } from '@lst97/common-services';
import CircularProgress from '@mui/material/CircularProgress';
import { SnackbarContext } from '@lst97/react-common-accessories';
import React from 'react';
import { Fade } from '@mui/material';
import SignUp from './SignUpPage';

export default function SignInSide() {
    const [isLoading, setIsLoading] = useState(false);
    const { showSnackbar } = useContext(SnackbarContext)!;

    const [isVisible, setIsVisible] = useState(true);

    const { setAuth } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true);

        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const jwtToken = await AuthApiService.signIn(
            data.get('email') as string,
            data.get('password') as string
        );

        if (!jwtToken) {
            showSnackbar('Invalid credentials', 'error');
            setIsLoading(false);
            return;
        }

        setAuth(true);

        // Check if the token is valid before navigating if necessary
        ReactTokenServiceInstance().addTokenKey(
            'accessToken',
            (_token) => true
        );
        navigate('/');
    };

    const handleSignUpClick = () => {
        setIsVisible(false);
    };

    const handleSignUpFinish = () => {
        setIsVisible(true);
    };

    return (
        <React.Fragment>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage:
                            'url(https://source.unsplash.com/random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light'
                                ? t.palette.grey[50]
                                : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                    sx={{ overflow: 'hidden' }}
                >
                    <React.Fragment>
                        {isVisible ? (
                            <Fade
                                in={isVisible}
                                timeout={500}
                                unmountOnExit={true}
                            >
                                <div>
                                    <Box
                                        sx={{
                                            my: 8,
                                            mx: 4,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                m: 1,
                                                bgcolor: 'secondary.main'
                                            }}
                                        >
                                            <LockOutlinedIcon />
                                        </Avatar>
                                        <Typography component="h1" variant="h5">
                                            Sign in
                                        </Typography>
                                        <Box
                                            component="form"
                                            noValidate
                                            onSubmit={handleSubmit}
                                            sx={{ mt: 1 }}
                                        >
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="email"
                                                label="Email Address"
                                                name="email"
                                                autoComplete="email"
                                                autoFocus
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="password"
                                                label="Password"
                                                type="password"
                                                id="password"
                                                autoComplete="current-password"
                                            />

                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                            >
                                                {isLoading ? (
                                                    <CircularProgress
                                                        size={24}
                                                        color="inherit"
                                                    />
                                                ) : (
                                                    'Sign In'
                                                )}
                                            </Button>
                                            <Grid container>
                                                <Grid item xs>
                                                    <Link
                                                        href="#"
                                                        variant="body2"
                                                    >
                                                        Forgot password?
                                                    </Link>
                                                </Grid>
                                                <Grid item>
                                                    <Link
                                                        onClick={
                                                            handleSignUpClick
                                                        }
                                                        href="#"
                                                        variant="body2"
                                                    >
                                                        {
                                                            "Don't have an account? Sign Up"
                                                        }
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </div>
                            </Fade>
                        ) : (
                            <Fade
                                in={!isVisible}
                                timeout={500}
                                unmountOnExit={true}
                            >
                                <div>
                                    <SignUp onFinish={handleSignUpFinish} />
                                </div>
                            </Fade>
                        )}
                        <Copyright />
                    </React.Fragment>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
