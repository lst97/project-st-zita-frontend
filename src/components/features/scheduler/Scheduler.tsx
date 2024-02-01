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
import UserData from '../../../models/share/UserData';
import { UserApiService } from '../../../services/ApiService';

const STAFF_MEMBERS = [
    new StaffCardContent('Tofu', 'TOTAL_HOUR'),
    new StaffCardContent('Kawaii', 'TOTAL_HOUR'),
    new StaffCardContent('Taiwan', 'TOTAL_HOUR'),
    new StaffCardContent('CL', 'TOTAL_HOUR'),
    new StaffCardContent('Sharon', 'TOTAL_HOUR')
];

const StaffScheduler = () => {
    const [userData, setUserData] = useState<UserData>();
    const [selectedStaff, setSelectedStaff] = useState<string | null>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [assignedStaffList, setAssignedStaffList] = useState<
        StaffCardContent[]
    >([]);
    const [notAssignedStaffList, setNotAssignedStaffList] =
        useState<StaffCardContent[]>(STAFF_MEMBERS);

    const [selectedScheduleMap, setSelectedScheduleMap] =
        useState<StaffScheduleMap>({});

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentViewName, setCurrentViewName] = useState('Week');

    const initialKey =
        getISOWeekNumberFromDate(currentDate).toString() +
        currentDate.getFullYear().toString();
    const [staffCardContentMap, setStaffCardContentMap] =
        useState<StaffCardContentMap>({
            [initialKey]: {
                assigned: [],
                notAssigned: [...STAFF_MEMBERS],
                staffScheduleMap: {}
            }
        });
    // Function to handle the current date change
    const onCurrentDateChange = (date: Date) => {
        const currentKey =
            getISOWeekNumberFromDate(currentDate).toString() +
            currentDate.getFullYear().toString();

        // Prepare the current state to be saved
        const currentStaffData = {
            assigned: [...assignedStaffList],
            notAssigned: [...notAssignedStaffList],
            staffScheduleMap: { ...selectedScheduleMap }
        };

        const weekNumber = getISOWeekNumberFromDate(date);
        const year = date.getFullYear();
        const newKey = `${weekNumber}${year}`;

        let newAssignedList: SetStateAction<StaffCardContent[]>,
            newNotAssignedList,
            newSelectedScheduleMap;

        if (!staffCardContentMap[newKey]) {
            // Set new values for the new key
            newAssignedList = [];
            newNotAssignedList = [...STAFF_MEMBERS];
            newSelectedScheduleMap = {};

            setAssignedStaffList(newAssignedList);
            setNotAssignedStaffList(newNotAssignedList);
            setSelectedScheduleMap(newSelectedScheduleMap);
        } else {
            // Use existing values for the new key
            newAssignedList = staffCardContentMap[newKey].assigned;
            newNotAssignedList = staffCardContentMap[newKey].notAssigned;
            newSelectedScheduleMap =
                staffCardContentMap[newKey].staffScheduleMap;

            setAssignedStaffList(newAssignedList);
            setNotAssignedStaffList(newNotAssignedList);
            setSelectedScheduleMap(newSelectedScheduleMap);
        }

        // TODO: STUDY THIS
        // Update staffCardContentMap with current data and potentially new data
        setStaffCardContentMap({
            ...staffCardContentMap,
            [currentKey]: currentStaffData,
            ...(newKey !== currentKey && {
                [newKey]: {
                    assigned: newAssignedList,
                    notAssigned: newNotAssignedList,
                    staffScheduleMap: newSelectedScheduleMap
                }
            })
        });

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

    const handleAddStaff = (name: string, description: string) => {
        // Logic to add new staff member to notAssignedStaffList
        setNotAssignedStaffList((prevNotAssignedStaffList) => [
            ...prevNotAssignedStaffList,
            new StaffCardContent(name, description)
        ]);
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
                        new StaffCardContent(selectedStaff!, 'TOTAL_HOUR')
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
                        new StaffCardContent(selectedStaff!, 'TOTAL_HOUR')
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

    const handleFetchedUserData = () => {};

    useEffect(() => {
        const fetchUserData = async () => {
            setUserData(await UserApiService.fetchUserData());
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        handleFetchedUserData();
    }, [userData]);

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
