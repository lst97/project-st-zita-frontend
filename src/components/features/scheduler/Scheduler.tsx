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

const StaffScheduler = () => {
    const [userDataList, setUserDataList] = useState<UserData[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string | null>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [assignedStaffList, setAssignedStaffList] = useState<
        StaffCardContent[]
    >([]);
    const [notAssignedStaffList, setNotAssignedStaffList] = useState<
        StaffCardContent[]
    >([]);
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

    const removeSchedule = (keyToRemove: string) => {
        setSelectedScheduleMap((prevMap) => {
            const { [keyToRemove]: _, ...newMap } = prevMap;
            return { ...newMap };
        });
    };

    const handleAddStaff = (newStaff: UserData) => {
        setUserDataList((prevUserDataList) => [...prevUserDataList, newStaff]);

        // API call to add new staff
        UserApiService.createStaff(newStaff);

        // Logic to add new staff member to notAssignedStaffList
        setNotAssignedStaffList((prevNotAssignedStaffList) => {
            const isAlreadyPresent = prevNotAssignedStaffList.some(
                (staff) => staff.name === selectedStaff
            );
            if (!isAlreadyPresent) {
                return [
                    ...prevNotAssignedStaffList,
                    new StaffCardContent(
                        newStaff.username,
                        '00:00',
                        newStaff.color,
                        newStaff.image,
                        newStaff.phoneNumber
                    )
                ];
            }
            return prevNotAssignedStaffList;
        });
    };

    const handleCardDelete = (staff: StaffCardContent) => {
        // API call
        UserApiService.deleteStaff(staff.name);

        removeFromAssignedStaff(staff);
        removeFromNotAssignedStaff(staff);
    };

    const removeFromAssignedStaff = (staff: StaffCardContent) => {
        setAssignedStaffList((prevAssignedStaffList) =>
            prevAssignedStaffList.filter((item) => item.name !== staff.name)
        );
        removeSchedule(staff.name);
        setSelectedStaff(null);
    };

    const removeFromNotAssignedStaff = (staff: StaffCardContent) => {
        setNotAssignedStaffList((prevNotAssignedStaffList) =>
            prevNotAssignedStaffList.filter((item) => item.name !== staff.name)
        );
    };

    const handleSelectionFinish = (selectedSchedule: SelectedSchedule) => {
        const user = userDataList?.find(
            (user) => user.username === selectedStaff
        );

        if (!user) {
            throw new Error('User not found');
        }

        if (selectedSchedule.schedule.length > 0 && selectedStaff) {
            // API call to add appointment
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
                [selectedStaff!]: selectedSchedule
            }));

            // Logic to add new staff member to assignedStaffList
            setAssignedStaffList((prevAssignedStaffList) => {
                const isAlreadyPresent = prevAssignedStaffList.some(
                    (staff) => staff.name === selectedStaff
                );
                if (!isAlreadyPresent) {
                    // remove from notAssignedStaffList
                    setNotAssignedStaffList((prevNotAssignedStaffList) => {
                        const isAlreadyPresent = prevNotAssignedStaffList.some(
                            (staff) => staff.name === selectedStaff
                        );
                        if (isAlreadyPresent) {
                            return prevNotAssignedStaffList.filter(
                                (staff) => staff.name !== selectedStaff
                            );
                        }
                        return prevNotAssignedStaffList;
                    });

                    return [
                        ...prevAssignedStaffList,
                        new StaffCardContent(
                            selectedStaff!,
                            'TOTAL_HOUR',
                            user.color,
                            user.image
                        )
                    ];
                }
                return prevAssignedStaffList;
            });
        } else {
            // API call to remove appointment

            const weekNumber = getISOWeekNumberFromDate(currentDate).toString();
            const year = currentDate.getFullYear().toString();
            const weekViewId = weekNumber + '-' + year;

            if (selectedStaff) {
                UserApiService.replaceAppointmentsData(
                    selectedStaff,
                    weekViewId,
                    selectedSchedule
                );
            }

            setNotAssignedStaffList((prevNotAssignedStaffList) => {
                const isAlreadyPresent = prevNotAssignedStaffList.some(
                    (staff) => staff.name === selectedStaff
                );
                if (!isAlreadyPresent) {
                    return [
                        ...prevNotAssignedStaffList,
                        new StaffCardContent(
                            selectedStaff!,
                            'TOTAL_HOUR',
                            user.color,
                            user.image
                        )
                    ];
                }
                return prevNotAssignedStaffList;
            });

            removeSchedule(selectedStaff!);
        }
    };
    // Step 1: fetch user data
    // Step 2: fetch appointment data base on current scheduler week view (week number, year)
    // Step 3: put the user to different lists based on their availability for the week
    // Step 4: map the appointments to the scheduleMap
    const fetchAppointmentWeekViewData = async () => {
        if (userDataList == null || userDataList.length === 0) return;

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

    useEffect(() => {
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

        fetchUserData();
    }, []);

    useEffect(() => {
        if (userDataList == null || userDataList.length === 0) return;
        if (Object.entries(staffCardContentMap).length === 0) return;

        const key =
            getISOWeekNumberFromDate(currentDate).toString() +
            '-' +
            currentDate.getFullYear().toString();
        const staffCardContent = staffCardContentMap[key];

        if (
            staffCardContent.assigned.length > 0 ||
            staffCardContent.notAssigned.length > 0
        ) {
            setAssignedStaffList(staffCardContent.assigned);
            setNotAssignedStaffList(staffCardContent.notAssigned);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staffCardContentMap]);

    useEffect(() => {
        if (selectedStaff != null) {
            setSelectedPlannerCells(
                selectedScheduleMap[selectedStaff!]?.schedule || []
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStaff]);

    useEffect(() => {
        if (userDataList && userDataList.length > 0) {
            fetchAppointmentWeekViewData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDataList]);

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
                        {assignedStaffList.map((staff) =>
                            selectedScheduleMap[staff.name] != null ? (
                                <StaffCard
                                    key={staff.name}
                                    onDelete={handleCardDelete}
                                    data={staff}
                                    onClick={() => handleCardClick(staff.name)}
                                    isSelected={selectedStaff === staff.name}
                                />
                            ) : (
                                <></>
                            )
                        )}
                    </StaffAccordion>
                    <StaffAccordion title="Not Assigned">
                        {notAssignedStaffList.map((staff) =>
                            selectedScheduleMap[staff.name] != null ? (
                                <></>
                            ) : (
                                <StaffCard
                                    key={staff.name}
                                    onDelete={handleCardDelete}
                                    data={staff}
                                    onClick={() => handleCardClick(staff.name)}
                                    isSelected={selectedStaff === staff.name}
                                />
                            )
                        )}
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
