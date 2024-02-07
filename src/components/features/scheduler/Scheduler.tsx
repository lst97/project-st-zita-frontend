import { useEffect, useState } from 'react';
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
import { getISOWeekNumberFromDate } from '../../../utils/DateTimeUtils';
import { UserData } from '../../../models/share/UserData';
import { UserApiService } from '../../../services/ApiService';
import { ColorUtils } from '../../../utils/ColorUtils';
import DataSendingIndicator from '../../common/indicators/DataSendingIndicator';
import {
    calculateDateGroupTotalHours,
    calculateWeekViewId,
    groupContinuesTime
} from '../../../utils/SchedulerHelpers';
import { AppointmentData } from '../../../models/share/AppointmentData';
import React from 'react';

const StaffScheduler = () => {
    const [userDataList, setUserDataList] = useState<UserData[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string | null>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlannerCells, setSelectedPlannerCells] = useState<Date[]>(
        []
    );

    const [selectedScheduleMap, setSelectedScheduleMap] =
        useState<StaffScheduleMap>({});

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentViewName, setCurrentViewName] = useState('Week');

    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleAddStaff = (newStaff: UserData) => {
        setUserDataList((prevUserDataList) => [...prevUserDataList, newStaff]);

        // API call to add new staff
        UserApiService.createStaff(newStaff);
    };

    const handleStaffCardDelete = (staff: StaffCardContent) => {
        // API call

        // TODO:  Asynchronous API Call Handling
        UserApiService.deleteStaff(staff.name);

        setUserDataList((prevUserDataList) =>
            prevUserDataList.filter((user) => user.username !== staff.name)
        );

        setSelectedPlannerCells([]);
        setSelectedStaff(null);

        setSelectedScheduleMap((prevMap) => {
            // Create a copy of the map/object without the staff member
            const { [staff.name]: _, ...updatedMap } = prevMap;
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

        const user = userDataList.find(
            (user) => user.username === selectedStaff
        );
        if (!user) {
            throw new Error(`User ${selectedStaff} not found`);
        }

        const weekViewId = calculateWeekViewId(currentDate);

        // TODO: Asynchronous API Call Handling
        UserApiService.replaceAppointmentsData(
            selectedStaff,
            weekViewId,
            selectedSchedule
        );

        setSelectedScheduleMap((prevMap) => ({
            ...prevMap,
            [selectedStaff!]: selectedSchedule ?? []
        }));
    };

    // Step 1: fetch user data
    // Step 2: fetch appointment data base on current scheduler week view (week number, year)
    // Step 3: map the appointments to the scheduleMap

    const fetchAppointmentWeekViewData = async () => {
        const weekNumber = getISOWeekNumberFromDate(currentDate);
        const year = currentDate.getFullYear();
        const weekViewId = calculateWeekViewId(currentDate);

        const appointmentsData =
            await UserApiService.fetchAppointmentsWeekViewData(weekViewId);
        const newSelectedScheduleMap = updateSelectedScheduleMap(
            appointmentsData,
            year,
            weekNumber
        );

        setSelectedScheduleMap(newSelectedScheduleMap);
    };

    function updateSelectedScheduleMap(
        appointmentsData: AppointmentData[],
        year: number,
        weekNumber: number
    ): StaffScheduleMap {
        const newSelectedScheduleMap: StaffScheduleMap = {};

        appointmentsData.forEach((appointment) => {
            const staffName = appointment.username;

            if (!newSelectedScheduleMap[staffName]) {
                newSelectedScheduleMap[staffName] = new SelectedSchedule(
                    year,
                    weekNumber,
                    []
                );
            }

            populateScheduleForStaff(
                newSelectedScheduleMap[staffName].schedule,
                new Date(appointment.startDate),
                new Date(appointment.endDate)
            );
        });

        return newSelectedScheduleMap;
    }

    function populateScheduleForStaff(
        schedule: Date[],
        startDateStr: Date,
        endDateStr: Date
    ) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;

        for (
            let tempDate = startDate;
            tempDate <= endDate;
            tempDate = new Date(tempDate.getTime() + THIRTY_MINUTES_IN_MS)
        ) {
            schedule.push(tempDate);
        }
    }

    // When user change the week view, fetch the new schedule data
    useEffect(() => {
        fetchAppointmentWeekViewData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    const mapUserColor = (users: UserData[]) => {
        ColorUtils.clearColorMap();
        for (const user of users) {
            ColorUtils.setColorFor(user.username, user.color);
        }
    };
    const fetchUserData = async () => {
        const users = await UserApiService.fetchUserData();

        // For Schedule Viewer and StaffCard to get the display color of the user
        mapUserColor(users);

        setUserDataList(users);
    };

    useEffect(() => {
        fetchUserData();

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
                    <DataSendingIndicator
                        isSuccess={isSuccess}
                        isLoading={isLoading}
                    />
                    <SchedulePlaner
                        currentDate={currentDate}
                        currentViewName={currentViewName}
                        onCurrentDateChange={onCurrentDateChange}
                        onCurrentViewNameChange={onCurrentViewNameChange}
                        isEnabled={selectedStaff != null}
                        data={selectedPlannerCells}
                        onFinish={handlePlannerCellsSelectionFinish}
                    />
                    <StaffAccordion title="Assigned">
                        {Object.keys(selectedScheduleMap).map((username) => {
                            // Find the user data in userDataList that matches the current username
                            const staff = userDataList.find(
                                (user) => user.username === username
                            );

                            const scheduleValue = selectedScheduleMap[username];

                            let dates = scheduleValue.schedule.map(
                                (date) => new Date(date)
                            );

                            let totalHours = calculateDateGroupTotalHours(
                                groupContinuesTime(dates)
                            );

                            return staff &&
                                scheduleValue.schedule.length > 0 ? (
                                <StaffCard
                                    key={`staff-card-${staff.username}`}
                                    onDelete={handleStaffCardDelete}
                                    data={
                                        new StaffCardContent(
                                            staff.username,
                                            totalHours,
                                            staff.color,
                                            staff.image,
                                            staff.phoneNumber
                                        )
                                    }
                                    onClick={() =>
                                        handleStaffCardClick(staff.username)
                                    }
                                    isSelected={
                                        selectedStaff === staff.username
                                    }
                                />
                            ) : null; // If no matching staff data is found, render nothing
                        })}
                    </StaffAccordion>

                    <StaffAccordion title="Not Assigned">
                        {userDataList
                            .filter(
                                (staff) =>
                                    !(
                                        selectedScheduleMap[staff.username]
                                            ?.schedule.length > 0
                                    )
                            )
                            .map((staff) => (
                                <StaffCard
                                    key={staff.username}
                                    onDelete={handleStaffCardDelete}
                                    data={
                                        new StaffCardContent(
                                            staff.username,
                                            '00:00',
                                            staff.color,
                                            staff.image,
                                            staff.phoneNumber
                                        )
                                    }
                                    onClick={() =>
                                        handleStaffCardClick(staff.username)
                                    }
                                    isSelected={
                                        selectedStaff === staff.username
                                    }
                                />
                            ))}
                    </StaffAccordion>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddStaffOpenDialog}
                    >
                        Add Staff
                    </Button>
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
                    currentDate={currentDate}
                    currentViewName={currentViewName}
                    onCurrentDateChange={onCurrentDateChange}
                    onCurrentViewNameChange={onCurrentViewNameChange}
                />
            </Grid>
        </Grid>
    );
};

export default StaffScheduler;
