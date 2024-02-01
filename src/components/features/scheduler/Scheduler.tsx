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

    const [selectedScheduleMap, setSelectedScheduleMap] =
        useState<StaffScheduleMap>({});

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentViewName, setCurrentViewName] = useState('Week');

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
            // Create a new object excluding the key to remove
            const { [keyToRemove]: _, ...rest } = prevMap;
            return rest;
        });
    };

    const handleAddStaff = () => {
        // TODO
        // const user = userDataList?.find(
        //     (user) => user.username === selectedStaff
        // );
        // if (!user) {
        //     throw new Error('User not found');
        // }
        // // Logic to add new staff member to notAssignedStaffList
        // setNotAssignedStaffList((prevNotAssignedStaffList) => {
        //     const isAlreadyPresent = prevNotAssignedStaffList.some(
        //         (staff) => staff.name === selectedStaff
        //     );
        //     if (!isAlreadyPresent) {
        //         return [
        //             ...prevNotAssignedStaffList,
        //             new StaffCardContent(
        //                 selectedStaff!,
        //                 'TOTAL_HOUR',
        //                 user.color,
        //                 user.image
        //             )
        //         ];
        //     }
        //     return prevNotAssignedStaffList;
        // });
    };

    const handleCardDelete = (staff: StaffCardContent) => {
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

        if (selectedSchedule.schedule.length > 0) {
            setSelectedScheduleMap((prevSelectedScheduleMap) => ({
                ...prevSelectedScheduleMap,
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
        const weekNumber = getISOWeekNumberFromDate(currentDate);
        const year = currentDate.getFullYear();

        const weekViewId = weekNumber + '-' + year;

        const appointmentsData =
            await UserApiService.fetchAppointmentsWeekViewData(weekViewId);

        // update selectedScheduleMap form appointmentsData
        const newSelectedScheduleMap: StaffScheduleMap = {};

        for (const appointment of appointmentsData) {
            const staffName = appointment.username;

            if (newSelectedScheduleMap[staffName] == null) {
                newSelectedScheduleMap[staffName] = new SelectedSchedule(
                    year,
                    weekNumber,
                    []
                );
            }

            newSelectedScheduleMap[staffName].schedule.push(
                new Date(appointment.startDate).toISOString(),
                new Date(appointment.endDate).toISOString()
            );
        }

        // Prepare the current state to be saved
        const currentStaffData = {
            assigned: [...assignedStaffList],
            notAssigned: [...notAssignedStaffList],
            staffScheduleMap: { ...selectedScheduleMap }
        };

        let newAssignedList: SetStateAction<StaffCardContent[]>;
        newAssignedList = [];
        let newNotAssignedList: SetStateAction<StaffCardContent[]>;
        newNotAssignedList = [];
        const newKey = `${weekNumber}-${year}`;

        for (const user of userDataList!) {
            if (newSelectedScheduleMap[user.username] == null) {
                newNotAssignedList.push(
                    new StaffCardContent(
                        user.username,
                        'TOTAL_HOUR',
                        user.color,
                        user.image
                    )
                );
            } else {
                newAssignedList.push(
                    new StaffCardContent(
                        user.username,
                        'TOTAL_HOUR',
                        user.color,
                        user.image
                    )
                );
            }
        }

        // TODO: STUDY THIS
        // Update staffCardContentMap with current data and potentially new data
        setStaffCardContentMap({
            ...staffCardContentMap,
            [weekViewId]: currentStaffData,
            ...(newKey !== weekViewId && {
                [newKey]: {
                    assigned: newAssignedList,
                    notAssigned: newNotAssignedList,
                    staffScheduleMap: newSelectedScheduleMap
                }
            })
        });

        setAssignedStaffList(newAssignedList);
        setNotAssignedStaffList(newNotAssignedList);
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
        if (userDataList && userDataList.length > 0) {
            fetchAppointmentWeekViewData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDataList]);

    useEffect(() => {
        if (Object.keys(selectedScheduleMap).length === 0) return;

        for (const userData of userDataList!) {
            if (
                selectedScheduleMap[userData.username] != null &&
                selectedScheduleMap[userData.username].schedule.length > 0
            ) {
                setAssignedStaffList((prevAssignedStaffList) => {
                    const isAlreadyPresent = prevAssignedStaffList.some(
                        (staff) => staff.name === selectedStaff
                    );
                    if (!isAlreadyPresent) {
                        // remove from notAssignedStaffList
                        setNotAssignedStaffList((prevNotAssignedStaffList) => {
                            const isAlreadyPresent =
                                prevNotAssignedStaffList.some(
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
                                userData.color,
                                userData.image
                            )
                        ];
                    }
                    return prevAssignedStaffList;
                });
            } else {
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
                                userData.color,
                                userData.image
                            )
                        ];
                    }
                    return prevNotAssignedStaffList;
                });
            }
        }
    }, [selectedScheduleMap, selectedStaff, userDataList]);

    return (
        <Grid container spacing={2}>
            <Grid xs={5}>
                <div>
                    <SchedulePlaner
                        currentDate={currentDate}
                        currentViewName={currentViewName}
                        onCurrentDateChange={onCurrentDateChange}
                        onCurrentViewNameChange={onCurrentViewNameChange}
                        isEnabled={selectedStaff != null}
                        data={selectedScheduleMap[selectedStaff!]?.schedule}
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
