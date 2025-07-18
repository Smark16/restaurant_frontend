import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleClose = () => {
    setShowAlert(false);
  };

  return (
    <Snackbar
      open={showAlert}
      autoHideDuration={6000} // Hide after 6 seconds
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={isOnline ? 'success' : 'warning'}
        sx={{ width: '100%' }}
      >
        {isOnline ? 'You are now online!' : 'You are offline. Using cached data where available.'}
      </Alert>
    </Snackbar>
  );
}

export default NetworkStatus;