import { Box, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../components/Forms/Auth";
import { registerForClub } from "../services/clubService";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLoginSuccess = async (user) => {
    const clubId = location.state?.clubId;

    if (clubId) {
      try {
        await registerForClub(clubId);
        alert("You’ve successfully joined the club!");
      } catch (error) {
        console.error("Error joining club after login:", error);
        alert("Login was successful, but joining the club failed.");
      }
    }

    navigate(from);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: "#000" }}
    >
      <Paper
        sx={{
          p: 4,
          backgroundColor: "#111",
          borderRadius: 2,
          color: "#fff",
        }}
        elevation={10}
      >
        <Auth onSuccess={handleLoginSuccess} />
      </Paper>
    </Box>
  );
};

export default Login;
