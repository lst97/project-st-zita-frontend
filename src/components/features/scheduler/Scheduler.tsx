import { useContext, useEffect, useState } from 'react';
import StaffCard from '../../common/cards/Cards';
import SchedulePlaner from './SchedulePlaner';
import ScheduleViewer from './ScheduleViewer';
import StaffAccordion from './StaffAccordion';
import StaffCardContent from '../../../models/scheduler/StaffCardContent';
import Grid from '@mui/material/Unstable_Grid2';
import AddStaffDialog from './AddStaffDialog';
import Button from '@mui/material/Button';
import {
    SelectedSchedule,
    StaffScheduleMap
} from '../../../models/scheduler/ScheduleModel';
import StaffData from '../../../models/share/scheduler/StaffData';
import {
    StaffApiService,
    AppointmentApiService,
    ApiAuthenticationErrorHandler
} from '../../../services/ApiService';
import { ColorUtils } from '../../../utils/ColorUtils';
import {
    calculateDateGroupTotalHours,
    calculateWeekViewId,
    fetchAppointmentWeekViewData,
    groupContinuesTime
} from '../../../utils/SchedulerHelpers';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackbarContext } from '../../../context/SnackbarContext';
import { LoadingIndicatorContext } from '../../../context/LoadingIndicatorContext';

const StaffScheduler = () => {
    const [staffDataList, setStaffDataList] = useState<StaffData[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string | null>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlannerCells, setSelectedPlannerCells] = useState<Date[]>(
        []
    );
    const [hoveredStaff, setHoveredStaff] = useState<string | null>(null);

    const [selectedScheduleMap, setSelectedScheduleMap] =
        useState<StaffScheduleMap>({});

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentViewName, setCurrentViewName] = useState('Week');

    const { showSnackbar } = useContext(SnackbarContext)!;
    const { showIndicator } = useContext(LoadingIndicatorContext)!;

    const navigate = useNavigate();

    const [apiAuthErrorHandler] = useState(new ApiAuthenticationErrorHandler());
    apiAuthErrorHandler.useNavigate(navigate);
    apiAuthErrorHandler.useSnackbar(showSnackbar);
    StaffApiService.useIndicator(showIndicator);
    AppointmentApiService.useIndicator(showIndicator);

    // Function to handle the current date change
    const onCurrentDateChange = (date: Date) => {
        setCurrentDate(date);
    };

    // for sync currentViewName between SchedulePlaner and ScheduleViewer
    const onCurrentViewNameChange = (viewName: string) => {
        setCurrentViewName(viewName);
    };

    const handleStaffCardClick = (name: string) => {
        if (selectedStaff === name) {
            setSelectedStaff(null);
        } else {
            setSelectedStaff(name);
        }
    };

    const handleAddStaffOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleAddStaffCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleAddStaff = (newStaff: StaffData) => {
        setStaffDataList((prevStaffDataList) => [
            ...prevStaffDataList,
            newStaff
        ]);

        // API call to add new staff
        StaffApiService.createStaff(newStaff, apiAuthErrorHandler);
    };
    const handleStaffCardHover = (staffCardContent: StaffCardContent) => {
        setHoveredStaff(staffCardContent.name);
    };

    const handleStaffCardLeave = () => {
        setHoveredStaff(null);
    };

    const handleStaffCardDelete = (staffCardContent: StaffCardContent) => {
        // API call

        // TODO:  Asynchronous API Call Handling
        StaffApiService.deleteStaff(staffCardContent.name, apiAuthErrorHandler);

        setStaffDataList((prevStaffDataList) =>
            prevStaffDataList.filter(
                (staffData) => staffData.name !== staffCardContent.name
            )
        );

        setSelectedPlannerCells([]);
        setSelectedStaff(null);

        setSelectedScheduleMap((prevMap) => {
            // Create a copy of the map/object without the staff member
            const { [staffCardContent.name]: _, ...updatedMap } = prevMap;
            return updatedMap;
        });
    };

    // Function to handle the finish of the planner cells selection
    // The function will be called when the mouse is released after selecting the cells
    const handlePlannerCellsSelectionFinish = (
        selectedSchedule: SelectedSchedule
    ) => {
        if (selectedStaff == null) {
            return;
        }

        const staff = staffDataList.find(
            (staff) => staff.name === selectedStaff
        );
        if (!staff) {
            throw new Error(`Staff ${selectedStaff} not found`);
        }

        const weekViewId = calculateWeekViewId(currentDate);

        // TODO: Asynchronous API Call Handling
        AppointmentApiService.replaceAppointmentsData(
            selectedStaff,
            weekViewId,
            selectedSchedule,
            apiAuthErrorHandler
        );

        setSelectedScheduleMap((prevMap) => ({
            ...prevMap,
            [selectedStaff!]: selectedSchedule ?? []
        }));
    };

    // Step 1: fetch staff data
    // Step 2: fetch appointment data base on current scheduler week view (week number, year)
    // Step 3: map the appointments to the scheduleMap

    // When user change the week view, fetch the new schedule data
    useEffect(() => {
        fetchAppointmentWeekViewData({
            currentDate: currentDate,
            apiErrorHandler: apiAuthErrorHandler,
            onUpdate: setSelectedScheduleMap
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    const mapStaffColor = (staffs: StaffData[]) => {
        ColorUtils.clearColorMap();
        for (const staff of staffs) {
            ColorUtils.setColorFor(staff.name, staff.color);
        }
    };
    const fetchStaffData = async () => {
        const staffs =
            await StaffApiService.fetchStaffData(apiAuthErrorHandler);

        // For Schedule Viewer and StaffCard to get the display color of the staff
        mapStaffColor(staffs);

        setStaffDataList(staffs);
    };

    useEffect(() => {
        fetchStaffData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedStaff != null) {
            setSelectedPlannerCells(
                Array.from(
                    new Set(selectedScheduleMap[selectedStaff!]?.schedule)
                ) || []
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStaff]);

    return (
        <Grid container spacing={2}>
            <Grid xs={5}>
                <React.Fragment>
                    <SchedulePlaner
                        currentDate={currentDate}
                        currentViewName={currentViewName}
                        onCurrentDateChange={onCurrentDateChange}
                        onCurrentViewNameChange={onCurrentViewNameChange}
                        isEnabled={selectedStaff != null}
                        data={selectedPlannerCells}
                        onFinish={handlePlannerCellsSelectionFinish}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddStaffOpenDialog}
                        sx={{
                            marginTop: 2,
                            marginBottom: 2,
                            width: '100%'
                        }}
                    >
                        Add Staff
                    </Button>
                    <Grid container spacing={2}>
                        <Grid xs={6}>
                            <StaffAccordion
                                key={`assigned-staff-card-`}
                                title="Assigned"
                                totalCount={staffDataList.length}
                            >
                                {Object.keys(selectedScheduleMap).map(
                                    (staffName) => {
                                        const staff = staffDataList.find(
                                            (staff) => staff.name === staffName
                                        );

                                        const scheduleValue =
                                            selectedScheduleMap[staffName];

                                        let dates = scheduleValue.schedule.map(
                                            (date) => new Date(date)
                                        );

                                        let totalHours =
                                            calculateDateGroupTotalHours(
                                                groupContinuesTime(dates)
                                            );

                                        return staff &&
                                            scheduleValue.schedule.length >
                                                0 ? (
                                            <StaffCard
                                                key={`assigned-staff-card-${staff.name}`}
                                                onDelete={handleStaffCardDelete}
                                                onHover={handleStaffCardHover}
                                                onLeave={handleStaffCardLeave}
                                                data={
                                                    new StaffCardContent({
                                                        name: staff.name,
                                                        totalHours: totalHours,
                                                        color: staff.color,
                                                        image: staff.image,
                                                        phoneNumber:
                                                            staff.phoneNumber
                                                    })
                                                }
                                                onClick={() =>
                                                    handleStaffCardClick(
                                                        staff.name
                                                    )
                                                }
                                                isSelected={
                                                    selectedStaff === staff.name
                                                }
                                            />
                                        ) : null; // If no matching staff data is found, render nothing
                                    }
                                )}
                            </StaffAccordion>
                        </Grid>
                        <Grid xs={6}>
                            <StaffAccordion
                                key={`unassigned-staff-card-`}
                                title="Not Assigned"
                                totalCount={staffDataList.length}
                            >
                                {staffDataList
                                    .filter(
                                        (staff) =>
                                            !(
                                                selectedScheduleMap[staff.name]
                                                    ?.schedule.length > 0
                                            )
                                    )
                                    .map((staff) => (
                                        <StaffCard
                                            key={`unassigned-staff-card-${staff.name}`}
                                            onDelete={handleStaffCardDelete}
                                            data={
                                                new StaffCardContent({
                                                    name: staff.name,
                                                    totalHours: '00:00',
                                                    color: staff.color,
                                                    image: staff.image,
                                                    phoneNumber:
                                                        staff.phoneNumber
                                                })
                                            }
                                            onClick={() =>
                                                handleStaffCardClick(staff.name)
                                            }
                                            isSelected={
                                                selectedStaff === staff.name
                                            }
                                        />
                                    ))}
                            </StaffAccordion>
                        </Grid>
                    </Grid>
                    <AddStaffDialog
                        open={dialogOpen}
                        onClose={handleAddStaffCloseDialog}
                        onAddStaff={handleAddStaff}
                    />
                </React.Fragment>
            </Grid>
            <Grid xs={7}>
                <ScheduleViewer
                    data={selectedScheduleMap}
                    selectedStaffNames={selectedStaff ? [selectedStaff] : []}
                    currentDate={currentDate}
                    currentViewName={currentViewName}
                    onCurrentDateChange={onCurrentDateChange}
                    onCurrentViewNameChange={onCurrentViewNameChange}
                    focusStaffName={hoveredStaff}
                    onDelete={() => {}}
                />
            </Grid>
        </Grid>
    );
};

export default StaffScheduler;
