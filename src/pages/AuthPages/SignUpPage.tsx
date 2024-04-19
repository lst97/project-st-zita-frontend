import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { passwordSchema } from '../../schemas/PasswordSchema';
import { emailSchema } from '../../schemas/EmailSchema';
import { AuthApiService } from '../../services/ApiService';
import { useContext, useState } from 'react';
import { SnackbarContext } from '@lst97/react-common-accessories';
import { ColorUtils } from '../../utils/ColorUtils';
import { CircularProgress } from '@mui/material';
import {
    ApiAuthenticationErrorHandler,
    SnackbarApiErrorHandler
} from '@lst97/common-restful';

const passwordValidator = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
        throw Error('Passwords do not match');
    }

    const { error } = passwordSchema.validate(password);
    if (error) {
        throw Error(error.message);
    }

    return true;
};

const emailValidator = (email: string) => {
    const { error } = emailSchema.validate(email);
    if (error) {
        throw Error(error.message);
    }

    return true;
};

export default function SignUp({ onFinish }: { onFinish: () => void }) {
    const [snackbarApiErrorHandler] = useState(new SnackbarApiErrorHandler());
    const [authApiErrorHandler] = useState(new ApiAuthenticationErrorHandler());
    const [isLoading, setIsLoading] = useState(false);
    const { showSnackbar } = useContext(SnackbarContext)!;
    snackbarApiErrorHandler.useSnackbar(showSnackbar);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        try {
            emailValidator(data.get('email') as string);

            passwordValidator(
                data.get('password') as string,
                data.get('confirmPassword') as string
            );
        } catch (error) {
            if (error instanceof Error) {
                showSnackbar(error.message, 'error');
            }
            return;
        }

        // api
        setIsLoading(true);
        AuthApiService.signUp(
            {
                email: data.get('email') as string,
                password: data.get('password') as string,
                firstName: data.get('firstName') as string,
                lastName: data.get('lastName') as string,
                color: ColorUtils.generateRandomColor()
            },
            authApiErrorHandler,
            snackbarApiErrorHandler
        )
            .then((response) => {
                if (response) {
                    showSnackbar(
                        'Account created successfully, please sign in',
                        'success'
                    );
                    onFinish();
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Box
            sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Create an account
            </Typography>
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3, mx: 16 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="confirm-password"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link onClick={onFinish} href="#" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
