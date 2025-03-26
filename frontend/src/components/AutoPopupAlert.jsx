import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AutoPopupAlert = () => {
  const [open, setOpen] = useState(true); // Always open initially
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(true); // Ensures it remains open every time the component mounts
  }, []);

  const handleNavigate = () => {
    navigate('/alert');
  };

  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(true)} // Prevent closing
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
