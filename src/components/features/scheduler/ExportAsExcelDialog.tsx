import { useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import { addDays, endOfWeek, set, startOfWeek } from 'date-fns';

import FormGroup from '@mui/material/FormGroup';
import {
    CircularProgress,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import { SettingsOutlined } from '@mui/icons-material';
import { SnackbarContext } from '../../../context/SnackbarContext';
import { DateRangePicker, Preview, RangeKeyDict } from 'react-date-range';
import { useTheme } from '@mui/material';
import { ExportAsExcelForm } from '../../../models/forms/scheduler/ExportAsExcelForm';
import { AppointmentApiService } from '../../../services/ApiService';
import { da } from 'date-fns/locale';
import { color } from 'html2canvas/dist/types/css/types/color';
import { AxiosHeaders } from 'axios';

const commonFlexColumnStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start'
};

interface Range {
    startDate?: Date; // Make startDate optional
    endDate?: Date; // Make endDate optional
    key: string;
}

const ExportAsExcelDialog = ({
    open,
    onDone
}: {
    open: boolean;
    onDone: () => void;
}) => {
    const { showSnackbar } = useContext(SnackbarContext)!;

    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();

    const [exportFormat, setExportFormat] = useState<
        'weekly' | 'monthly' | 'yearly'
    >('weekly'); // Or the initial permission

    const [dateRangeState, setDateRangeState] = useState<Range[]>([
        {
            startDate: startOfWeek(new Date(), { weekStartsOn: 0 }), // Sunday as start of week
            endDate: addDays(endOfWeek(new Date(), { weekStartsOn: 0 }), 0), // Sat as end of week
            key: 'selection'
        }
    ]);

    const [previewDateRangeState, setPreviewDateRangeState] = useState<Range[]>(
        [
            {
                startDate: startOfWeek(new Date(), { weekStartsOn: 0 }), // Sunday as start of week
                endDate: addDays(endOfWeek(new Date(), { weekStartsOn: 0 }), 0), // Sat as end of week
                key: 'selection'
            }
        ]
    );

    const [showPreviewState, setShowPreviewState] = useState<boolean>(false);

    const handleDateRangeChange = (item: RangeKeyDict) => {
        setDateRangeState([
            {
                startDate: startOfWeek(
                    new Date(item.selection.startDate ?? new Date()),
                    { weekStartsOn: 0 }
                ), // Sunday as start of week
                endDate: addDays(
                    endOfWeek(
                        new Date(item.selection.startDate ?? new Date()),
                        { weekStartsOn: 0 }
                    ),
                    0
                ), // Sat as end of week
                key: 'selection'
            }
        ]);
    };

    const handleOnPreviewChange = (date: Date | Preview | undefined) => {
        if (!(date instanceof Date)) {
            setShowPreviewState(false);
            return;
        }

        setShowPreviewState(true);

        setPreviewDateRangeState([
            {
                startDate: startOfWeek(date, { weekStartsOn: 0 }), // Sunday as start of week
                endDate: addDays(endOfWeek(date, { weekStartsOn: 0 }), 0), // Sat as end of week
                key: 'selection'
            }
        ]);
    };

    const handleExportFormatChange = (event: SelectChangeEvent) => {
        setExportFormat(event.target.value as 'weekly' | 'monthly' | 'yearly');
    };

    const handleExportClick = async () => {
        setIsLoading(true);
        // send api request and wait for the response
        // add one day to start date

        const response = await AppointmentApiService.exportAsExcel(
            addDays(dateRangeState[0].startDate!, 1),
            dateRangeState[0].endDate!,
            exportFormat
        );

        if (!response) {
            setIsLoading(false);
            showSnackbar('Export failed', 'error');
            return;
        }

        const decodedArrayBuffer = Uint8Array.from(
            atob(response.data.buffer || ''),
            (c) => c.charCodeAt(0)
        );

        const blob = new Blob([decodedArrayBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        link.download = response.data.fileName ?? 'schedule.xlsx';

        link.click();

        setIsLoading(false);
        showSnackbar('Exported successfully', 'success');
        onDone();
    };

    return (
        <Dialog open={open} onClose={onDone} maxWidth={false}>
            <DialogTitle>
                <Grid container spacing={2}>
                    <Grid xs={1}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="40"
                            height="40"
                            viewBox="0 0 50 50"
                        >
                            <path d="M 28.875 0 C 28.855469 0.0078125 28.832031 0.0195313 28.8125 0.03125 L 0.8125 5.34375 C 0.335938 5.433594 -0.0078125 5.855469 0 6.34375 L 0 43.65625 C -0.0078125 44.144531 0.335938 44.566406 0.8125 44.65625 L 28.8125 49.96875 C 29.101563 50.023438 29.402344 49.949219 29.632813 49.761719 C 29.859375 49.574219 29.996094 49.296875 30 49 L 30 44 L 47 44 C 48.09375 44 49 43.09375 49 42 L 49 8 C 49 6.90625 48.09375 6 47 6 L 30 6 L 30 1 C 30.003906 0.710938 29.878906 0.4375 29.664063 0.246094 C 29.449219 0.0546875 29.160156 -0.0351563 28.875 0 Z M 28 2.1875 L 28 6.53125 C 27.867188 6.808594 27.867188 7.128906 28 7.40625 L 28 42.8125 C 27.972656 42.945313 27.972656 43.085938 28 43.21875 L 28 47.8125 L 2 42.84375 L 2 7.15625 Z M 30 8 L 47 8 L 47 42 L 30 42 L 30 37 L 34 37 L 34 35 L 30 35 L 30 29 L 34 29 L 34 27 L 30 27 L 30 22 L 34 22 L 34 20 L 30 20 L 30 15 L 34 15 L 34 13 L 30 13 Z M 36 13 L 36 15 L 44 15 L 44 13 Z M 6.6875 15.6875 L 12.15625 25.03125 L 6.1875 34.375 L 11.1875 34.375 L 14.4375 28.34375 C 14.664063 27.761719 14.8125 27.316406 14.875 27.03125 L 14.90625 27.03125 C 15.035156 27.640625 15.160156 28.054688 15.28125 28.28125 L 18.53125 34.375 L 23.5 34.375 L 17.75 24.9375 L 23.34375 15.6875 L 18.65625 15.6875 L 15.6875 21.21875 C 15.402344 21.941406 15.199219 22.511719 15.09375 22.875 L 15.0625 22.875 C 14.898438 22.265625 14.710938 21.722656 14.5 21.28125 L 11.8125 15.6875 Z M 36 20 L 36 22 L 44 22 L 44 20 Z M 36 27 L 36 29 L 44 29 L 44 27 Z M 36 35 L 36 37 L 44 37 L 44 35 Z"></path>
                        </svg>
                    </Grid>
                    <Grid xs={10}>
                        <Typography variant="h4">Export As Excel</Typography>
                    </Grid>
                    <Grid xs={1}>
                        <IconButton onClick={() => {}}>
                            <SettingsOutlined />
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent sx={{ width: 700 }}>
                <FormGroup>
                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <Typography variant="h5">Select range</Typography>
                        </Grid>

                        <Grid xs={12} sx={commonFlexColumnStyles}>
                            <Paper
                                elevation={2}
                                sx={{ p: 2, m: 3, borderRadius: 1 }}
                            >
                                <DateRangePicker
                                    showMonthAndYearPickers={false}
                                    showPreview={showPreviewState}
                                    preview={previewDateRangeState[0]}
                                    onPreviewChange={handleOnPreviewChange}
                                    dragSelectionEnabled={false}
                                    showDateDisplay={false}
                                    color={theme.palette.primary.main}
                                    ranges={dateRangeState}
                                    onChange={handleDateRangeChange}
                                />
                            </Paper>
                        </Grid>

                        <Grid
                            xs={12}
                            sx={{ commonFlexColumnStyles, marginInline: 3 }}
                        >
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="demo-simple-select-helper-label">
                                    Formats
                                </InputLabel>
                                <Select
                                    labelId="excel-export-format"
                                    id="excel-export-format"
                                    value={exportFormat}
                                    label="Export Format"
                                    onChange={handleExportFormatChange}
                                >
                                    <MenuItem value={'weekly'}>
                                        <Typography variant="body1">
                                            Weekly
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={'monthly'}>
                                        <Typography variant="body1">
                                            Monthly
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={'yearly'}>
                                        <Typography variant="body1">
                                            Yearly
                                        </Typography>
                                    </MenuItem>
                                </Select>
                                <FormHelperText>
                                    Select how you want the schedule to present
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={handleExportClick}
                    color="primary"
                    sx={{ minWidth: 100 }}
                    disabled={exportFormat !== 'weekly'}
                >
                    {isLoading === true ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        <Typography>{`${exportFormat !== 'weekly' ? 'Unsupported' : 'Export'}`}</Typography>
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportAsExcelDialog;
