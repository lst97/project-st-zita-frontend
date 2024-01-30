// AddStaffDialog.js
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AddStaffDialog = ({
  open,
  onClose,
  onAddStaff
}: {
  open: boolean;
  onClose: () => void;
  onAddStaff: (name: string, description: string) => void;
}) => {
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffDescription, setNewStaffDescription] = useState('');

  const handleAddClick = () => {
    onAddStaff(newStaffName, newStaffDescription);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Staff</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          value={newStaffName}
          onChange={(e) => setNewStaffName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          value={newStaffDescription}
          onChange={(e) => setNewStaffDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddClick} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStaffDialog;
