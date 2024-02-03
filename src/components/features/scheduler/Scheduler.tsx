import { SetStateAction, useEffect, useState } from 'react';
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
    StaffCardContentMap,
    StaffScheduleMap
} from '../../../models/scheduler/ScheduleModel';
import { getISOWeekNumberFromDate } from '../../../utils/DateTimeUtils';
import { UserData } from '../../../models/share/UserData';
import { UserApiService } from '../../../services/ApiService';
import { ColorUtils } from '../../../utils/ColorUtils';
import DataSendingIndicator from '../../common/indicators/DataSendingIndicator';
import {
    calculateDateGroupTotalHours,
    groupContinuesTime
} from '../../../utils/SchedulerHelpers';

const StaffScheduler = () => {
    const [userDataList, setUserDataList] = useState<UserData[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string | null>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlannerCells, setSelectedPlannerCells] = useState<string[]>(
        []
    );

    const [selectedScheduleMap, setSelectedScheduleMap] =
        useState<StaffScheduleMap>({});

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentViewName, setCurrentViewName] = useState('Week');

    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const initialKey =
        getISOWeekNumberFromDate(currentDate).toString() +
        '-' +
        currentDate.getFullYear().toString();
    const [staffCardContentMap, setStaffCardContentMap] =
        useState<StaffCardContentMap>({
            [initialKey]: {
                assigned: [],
                notAssigned: [],
                staffScheduleMap: {}
            }
        });
    // Function to handle the current date change
    const onCurrentDateChange = (date: Date) => {
        setCurrentDate(date);
    };

    // Function to handle the view name change
    const onCurrentViewNameChange = (viewName: string) => {
        setCurrentViewName(viewName);
    };

    const handleCardClick = (name: string) => {
        if (selectedStaff === name) {
            setSelectedStaff(null);
        } else {
            setSelectedStaff(name);
        }
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleAddStaff = (newStaff: UserData) => {
        setUserDataList((prevUserDataList) => [...prevUserDataList, newStaff]);

        // API call to add new staff
        UserApiService.createStaff(newStaff);
    };

    const handleCardDelete = (staff: StaffCardContent) => {
        // API call

        UserApiService.deleteStaff(staff.name);

        const newUserDataList = userDataList.filter(
            (user) => user.username !== staff.name
        );

        setUserDataList(newUserDataList);

        setSelectedPlannerCells([]);
        setSelectedStaff(null);

        setSelectedScheduleMap((prevMap) => {
            // Create a copy of the map/object without the staff member
            const { [staff.name]: _, ...updatedMap } = prevMap;
            return updatedMap;
        });
    };

    const handleSelectionFinish = (selectedSchedule: SelectedSchedule) => {
        const user = userDataList?.find(
            (user) => user.username === selectedStaff
        );

        if (!user) {
            throw new Error('User not found');
        }

        // API call to remove appointment

        if (selectedStaff) {
            const weekNumber = getISOWeekNumberFromDate(currentDate).toString();
            const year = currentDate.getFullYear().toString();
            const weekViewId = weekNumber + '-' + year;

            UserApiService.replaceAppointmentsData(
                selectedStaff,
                weekViewId,
                selectedSchedule
            );

            setSelectedScheduleMap((prevMap) => ({
                ...prevMap,
                [selectedStaff!]: selectedSchedule ?? []
            }));
        }
    };
    // Step 1: fetch user data
    // Step 2: fetch appointment data base on current scheduler week view (week number, year)
    // Step 3: put the user to different lists based on their availability for the week
    // Step 4: map the appointments to the scheduleMap
    const fetchAppointmentWeekViewData = async () => {
        const weekNumber = getISOWeekNumberFromDate(currentDate).toString();
        const year = currentDate.getFullYear().toString();

        const weekViewId = weekNumber + '-' + year;

        const appointmentsData =
            await UserApiService.fetchAppointmentsWeekViewData(weekViewId);

        // update selectedScheduleMap form appointmentsData
        const newSelectedScheduleMap: StaffScheduleMap = {};

        for (const appointment of appointmentsData) {
            const staffName = appointment.username;

            if (newSelectedScheduleMap[staffName] == null) {
                newSelectedScheduleMap[staffName] = new SelectedSchedule(
                    parseInt(year),
                    parseInt(weekNumber),
                    []
                );
            }

            const startDate = new Date(appointment.startDate);
            const endDate = new Date(appointment.endDate);

            // Temporary variable to hold the current date being processed
            let currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                // Push the current date in ISO format to the schedule array
                newSelectedScheduleMap[staffName].schedule.push(
                    currentDate.toISOString()
                );

                // Increment the current date by 30 minutes
                currentDate = new Date(currentDate.getTime() + 30 * 60 * 1000); // 30 minutes in milliseconds
            }
        }

        let newAssignedList: SetStateAction<StaffCardContent[]>;
        newAssignedList = [];
        let newNotAssignedList: SetStateAction<StaffCardContent[]>;
        newNotAssignedList = [];
        const newKey = `${weekNumber}-${year}`;

        for (const user of userDataList) {
            const staffName = user.username;
            if (newSelectedScheduleMap[staffName] != null) {
                newAssignedList.push(
                    new StaffCardContent(
                        staffName,
                        'TOTAL_HOUR',
                        user.color,
                        user.image
                    )
                );
            } else {
                newNotAssignedList.push(
                    new StaffCardContent(
                        staffName,
                        'TOTAL_HOUR',
                        user.color,
                        user.image
                    )
                );
            }
        }

        if (selectedStaff != null) {
            setSelectedPlannerCells(
                newSelectedScheduleMap[selectedStaff]?.schedule || []
            );
        }

        setStaffCardContentMap({
            ...staffCardContentMap,
            [newKey]: {
                assigned: newAssignedList,
                notAssigned: newNotAssignedList,
                staffScheduleMap: newSelectedScheduleMap
            }
        });

        setSelectedScheduleMap(newSelectedScheduleMap);
    };

    useEffect(() => {
        fetchAppointmentWeekViewData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    const fetchUserData = async () => {
        const users = await UserApiService.fetchUserData();
        const newStaffCardList = new Array<StaffCardContent>();
        for (const user of users) {
            newStaffCardList.push(
                new StaffCardContent(
                    user.username,
                    'TOTAL_HOUR',
                    user.color,
                    user.image
                )
            );
            ColorUtils.setColorFor(user.username, user.color);
        }
        setUserDataList(users);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (selectedStaff != null) {
            setSelectedPlannerCells(
                selectedScheduleMap[selectedStaff!]?.schedule || []
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStaff]);

    return (
        <Grid container spacing={2}>
            <Grid xs={5}>
                <div>
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
                        onFinish={handleSelectionFinish}
                    />
                    <StaffAccordion title="Assigned">
                        {Object.keys(selectedScheduleMap).map((username) => {
                            // Find the user data in userDataList that matches the current username
                            const staff = userDataList.find(
                                (user) => user.username === username
                            );

                            const scheduleValue = selectedScheduleMap[username];

                            let dates = new Array<Date>();
                            for (const date of scheduleValue.schedule) {
                                dates.push(new Date(date));
                            }

                            let totalHours = calculateDateGroupTotalHours(
                                groupContinuesTime(dates)
                            );

                            return staff &&
                                scheduleValue.schedule.length > 0 ? (
                                <StaffCard
                                    key={staff.username}
                                    onDelete={handleCardDelete}
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
                                        handleCardClick(staff.username)
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
                                        selectedScheduleMap[staff.username] &&
                                        selectedScheduleMap[staff.username]
                                            .schedule.length > 0
                                    )
                            )
                            .map((staff) => (
                                <StaffCard
                                    key={staff.username}
                                    onDelete={handleCardDelete}
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
                                        handleCardClick(staff.username)
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
                        onClick={handleOpenDialog}
                    >
                        Add Staff
                    </Button>
                    <AddStaffDialog
                        open={dialogOpen}
                        onClose={handleCloseDialog}
                        onAddStaff={handleAddStaff}
                    />
                </div>
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
