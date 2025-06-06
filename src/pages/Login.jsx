import { Box, Paper, Snackbar, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/Forms/AuthForm";
import { registerForClub } from "../services/clubService";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleLoginSuccess = async (user) => {
    const clubId = location.state?.clubId;

    if (clubId) {
      try {
        await registerForClub(clubId);
        setNotification({
          open: true,
          message: "You've successfully joined the club!",
          severity: "success",
        });
      } catch (error) {
        console.error("Error joining club after login:", error);
        setNotification({
          open: true,
          message: "Login was successful, but joining the club failed.",
          severity: "warning",
        });
      }
    }

    setTimeout(() => navigate(from), clubId ? 1500 : 0);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: "#000",
        backgroundImage: "linear-gradient(to bottom, #1a1a1a, #000)",
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          backgroundColor: "#111",
          borderRadius: 3,
          color: "#fff",
          width: { xs: "90%", sm: "400px" },
          boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.5)",
        }}
        elevation={24}
      >
        <AuthForm onSuccess={handleLoginSuccess} />

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Login;
