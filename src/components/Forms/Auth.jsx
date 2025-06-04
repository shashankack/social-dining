import { Box, Tabs, Tab, TextField, Typography, Stack, IconButton, InputAdornment, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { userSignIn, createUserSchema } from "event-book-baw";
import { signIn, signUp } from "../../services/authService";

const orange = "#B55725";

const textFieldSx = {
  input: { color: "#fff" },
  "& .MuiInput-underline:before": { borderBottomColor: orange },
  "& .MuiInput-underline:after": { borderBottomColor: orange },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: orange,
  },
  "& .MuiInputBase-input": { color: "#fff" },
  "& .Mui-focused": { color: orange },
  "& label.Mui-focused": { color: orange },
};

const AuthForm = ({ onSuccess }) => {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "signin") {
        userSignIn.parse(form);
        const res = await signIn(form.email, form.password);

        // Storing token manually (without Safari check)
        if (res.token) localStorage.setItem("authToken", res.token);

        onSuccess(res.safeUserLogin);
      } else {
        createUserSchema.parse(form);
        const res = await signUp(form);

        // Storing token manually (without Safari check)
        if (res.token) localStorage.setItem("authToken", res.token);

        onSuccess(res.user);
      }
    } catch (err) {
      if (err.name === "ZodError") {
        setError(err.issues[0]?.message || "Invalid input");
      } else {
        setError(err?.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 420 }}>
      <Tabs
        value={mode}
        onChange={(e, v) => {
          setMode(v);
          setError("");
        }}
        textColor="inherit"
        indicatorColor="secondary"
        centered
        sx={{
          mb: 2,
          "& .MuiTab-root": {
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
          },
          "& .Mui-selected": {
            color: orange,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: orange,
          },
        }}
      >
        <Tab value="signin" label="Sign In" />
        <Tab value="signup" label="Sign Up" />
      </Tabs>

      <Stack spacing={2}>
        {mode === "signup" && (
          <>
            <TextField
              variant="standard"
              label="Name"
              autoComplete="off"
              name="name"
              value={form.name}
              onChange={handleChange}
              sx={textFieldSx}
              InputLabelProps={{ sx: { color: "#fff" } }}
            />
            <TextField
              variant="standard"
              label="Phone"
              autoComplete="off"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              sx={textFieldSx}
              InputLabelProps={{ sx: { color: "#fff" } }}
            />
          </>
        )}

        <TextField
          variant="standard"
          label="Email"
          autoComplete="off"
          name="email"
          value={form.email}
          onChange={handleChange}
          sx={textFieldSx}
          InputLabelProps={{ sx: { color: "#fff" } }}
        />

        <TextField
          variant="standard"
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          sx={textFieldSx}
          InputLabelProps={{ sx: { color: "#fff" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  sx={{ color: "#fff" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography color="error" fontSize="0.875rem">
            {error}
          </Typography>
        )}

        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            bgcolor: orange,
            color: "#fff",
            textTransform: "none",
            "&:hover": { bgcolor: orange },
            height: 42,
          }}
        >
          {loading ? (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          ) : mode === "signin" ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default AuthForm;
