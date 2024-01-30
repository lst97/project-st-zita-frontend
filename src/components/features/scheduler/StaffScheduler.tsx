import { useState } from 'react';
import StaffCard from '../../common/cards/Cards';
import SchedulePlaner from './SchedulePlaner';
import ScheduleViewer from './ScheduleViewer';
import StaffAccordion from './StaffAccordion';
import StaffCardContent from '../../../models/StaffCardContent';
import Grid from '@mui/material/Unstable_Grid2';
import AddStaffDialog from './AddStaffDialog';
import Button from '@mui/material/Button';

const StaffScheduler = () => {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignedStaffList, setAssignedStaffList] = useState<
    StaffCardContent[]
  >([
    new StaffCardContent('CL', 'Boss'),
    new StaffCardContent('Sharon', 'Manager')
  ]);
  const [notAssignedStaffList, setNotAssignedStaffList] = useState<
    StaffCardContent[]
  >([
    new StaffCardContent('Tofu', 'Manager'),
    new StaffCardContent('Kawaii', 'Staff'),
    new StaffCardContent('Taiwan', 'Staff')
  ]);

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

  const handleAddStaff = (name: string, description: string) => {
    // Logic to add new staff member to notAssignedStaffList
    setNotAssignedStaffList((prevNotAssignedStaffList) => [
      ...prevNotAssignedStaffList,
      new StaffCardContent(name, description)
    ]);
  };

  const handleCardDelete = (staff: StaffCardContent) => {
    // Check if the staff member is in the assignedStaffList
    if (assignedStaffList.some((item) => item.name === staff.name)) {
      // Remove from assignedStaffList
      setAssignedStaffList((prevAssignedStaffList) =>
        prevAssignedStaffList.filter((item) => item.name !== staff.name)
      );
    } else {
      // Remove from notAssignedStaffList
      setNotAssignedStaffList((prevNotAssignedStaffList) =>
        prevNotAssignedStaffList.filter((item) => item.name !== staff.name)
      );
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid xs={5}>
        <div>
          <SchedulePlaner />
          <StaffAccordion title="Assigned">
            {assignedStaffList.map((staff) => (
              <StaffCard
                key={staff.name}
                onDelete={handleCardDelete}
                data={staff}
                onClick={() => handleCardClick(staff.name)}
                isSelected={selectedStaff === staff.name}
              />
            ))}
          </StaffAccordion>
          <StaffAccordion title="Not Assigned">
            {notAssignedStaffList.map((staff) => (
              <StaffCard
                key={staff.name}
                onDelete={handleCardDelete}
                data={staff}
                onClick={() => handleCardClick(staff.name)}
                isSelected={selectedStaff === staff.name}
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
        <ScheduleViewer />
      </Grid>
    </Grid>
  );
};

export default StaffScheduler;
