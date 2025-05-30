import { Box, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../components/Forms/Auth"; // ✅ import your AuthForm component

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLoginSuccess = (user) => {
    console.log("Logged in:", user);
    navigate(from); // ✅ redirect to intended page
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
