import { useState } from 'react';
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

const StaffScheduler = () => {
    const [selectedStaff, setSelectedStaff] = useState<string | null>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [assignedStaffList, setAssignedStaffList] = useState<
        StaffCardContent[]
    >([]);
    const [notAssignedStaffList, setNotAssignedStaffList] = useState<
        StaffCardContent[]
    >([
        new StaffCardContent('Tofu', 'TOTAL_HOUR'),
        new StaffCardContent('Kawaii', 'TOTAL_HOUR'),
        new StaffCardContent('Taiwan', 'TOTAL_HOUR'),
        new StaffCardContent('CL', 'TOTAL_HOUR'),
        new StaffCardContent('Sharon', 'TOTAL_HOUR')
    ]);
    const [selectedScheduleMap, setSelectedScheduleMap] =
        useState<StaffScheduleMap>({});

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

    return (
        <Grid container spacing={2}>
            <Grid xs={5}>
                <div>
                    <SchedulePlaner
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
                <ScheduleViewer data={[]} />
            </Grid>
        </Grid>
    );
};

export default StaffScheduler;
