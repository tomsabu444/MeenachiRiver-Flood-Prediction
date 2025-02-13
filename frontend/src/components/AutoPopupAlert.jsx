import React, { useEffect, useState } from 'react';
import { Snackbar, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AutoPopupAlert = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // This will trigger the notification automatically after the component mounts
  useEffect(() => {
    setOpen(true); // Open the notification
  }, []);

  // This handles the user click event on the notification
  const handleClose = () => {
    setOpen(false);
  };

  const handleNavigate = () => {
    navigate('/alert');
    setOpen(false); // Close the notification after navigating
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000} // Auto-close after 6 seconds
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Position the Snackbar
    >
      <Alert 
        onClick={handleNavigate}
        severity="info" 
        sx={{ cursor: 'pointer' }}
      >
        Click here to add alert
      </Alert>
    </Snackbar>
  );
};

export default AutoPopupAlert;
