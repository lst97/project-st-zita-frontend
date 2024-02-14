import { GitHub } from '@mui/icons-material';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function Copyright(props: any) {
    return (
        <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ pt: 4 }}
        >
            <Grid>
                <GitHub />
            </Grid>
            <Grid>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    verticalAlign="middle"
                    {...props}
                >
                    {'GitHub '}
                    <Link color="inherit" href="https://github.com/lst97">
                        @lst97
                    </Link>
                </Typography>
            </Grid>
        </Grid>
    );
}

export default Copyright;
