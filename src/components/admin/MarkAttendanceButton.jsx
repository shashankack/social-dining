import { Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useMarkAttendance } from "../../hooks/useMarkAttendance";

const MarkAttendanceButton = ({
  token,
  registrationId,
  status,
  onMarked,
  fullWidth = false,
}) => {
  const { markAttendance, loading } = useMarkAttendance();

  const isAttended = status === "attended";

  const handleClick = async (event) => {
    event.stopPropagation();
    if (isAttended || loading) return;

    try {
      await markAttendance(token, registrationId);
      if (typeof onMarked === "function") {
        onMarked();
      }
    } catch (err) {
      console.error('Failed to mark attendance', err);
      // show a minimal user-visible error via snackbar
      const msg = err.response?.data?.error || err.message || 'Failed to mark attendance';
      setSnackbarMsg(msg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  return (
    <>
      <Button
        variant={isAttended ? "outlined" : "contained"}
        startIcon={isAttended ? <CheckCircleIcon /> : null}
        onClick={handleClick}
        disabled={loading || isAttended || !registrationId}
        fullWidth={fullWidth}
        sx={{
          mt: 1,
          fontWeight: 800,
          borderRadius: 2,
          bgcolor: isAttended ? "#DFF5E1" : "primary.main",
          color: "#000",
          borderColor: isAttended ? "#7CBF8A" : "primary.main",
          "&:hover": {
            bgcolor: isAttended ? "#DFF5E1" : "#cc4614",
          },
        }}
      >
        {isAttended ? "Attended" : loading ? "Marking..." : "Mark Attendance"}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MarkAttendanceButton;
