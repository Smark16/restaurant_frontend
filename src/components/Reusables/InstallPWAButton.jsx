// src/components/InstallPWAButton.jsx
import { useEffect, useState } from 'react';
import {Alert, Snackbar} from '@mui/material'

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // Stop the automatic prompt
      setDeferredPrompt(e); // Save event to trigger later
      setShowButton(true); // Show install button
      setSnackbarOpen(true)
      setSnackbarMessage('Install Smookies!!')
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  return (
    <>
      {showButton && (
  <Snackbar
    open={snackbarOpen}
    onClose={() => setSnackbarOpen(false)}
    anchorOrigin={{ vertical: "top", horizontal: "center" }} // centered for mobile friendliness
    sx={{ maxWidth: "100%", px: 2 }} // add padding on mobile
  >
    <Alert
      onClose={() => setSnackbarOpen(false)}
      severity="success"
      variant="filled"
      sx={{
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <span style={{ fontSize: "16px", fontWeight: 500 }}>
        {snackbarMessage}
      </span>
      <button
        onClick={handleInstallClick}
        style={{
          backgroundColor: "#fff",
          color: "#2e7d32",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        Install App
      </button>
    </Alert>
  </Snackbar>
)}

    </>
  );
};

export default InstallPWAButton;
