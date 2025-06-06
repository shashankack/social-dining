import {
  Box,
  Tabs,
  Tab,
  TextField,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
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
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      form.email &&
      form.password &&
      (mode === "signin" || (form.name && form.phone));
    setFormValid(isValid);
  }, [form, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      if (mode === "signin") {
        userSignIn.parse(form);
      } else {
        createUserSchema.parse(form);
      }
      return true;
    } catch (err) {
      if (err.name === "ZodError") {
        const newErrors = {};
        err.issues.forEach((issue) => {
          newErrors[issue.path[0]] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      let res;
      if (mode === "signin") {
        res = await signIn(form.email, form.password);
      } else {
        res = await signUp(form);
      }

      if (res.token) {
        localStorage.setItem("authToken", res.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(mode === "signin" ? res.safeUserLogin : res.user)
        );
      }

      onSuccess(mode === "signin" ? res.safeUserLogin : res.user);
    } catch (err) {
      console.error("Auth error:", err);
      setApiError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && formValid) {
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{ width: "100%", maxWidth: 420 }}
      component="form"
      onSubmit={handleSubmit}
      noValidate
    >
      <Tabs
        value={mode}
        onChange={(e, v) => {
          setMode(v);
          setApiError("");
          setErrors({
            email: "",
            password: "",
            name: "",
            phone: "",
          });
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

      <Stack spacing={3}>
        {mode === "signup" && (
          <>
            <TextField
              variant="standard"
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={!!errors.name}
              helperText={errors.name}
              sx={textFieldSx}
              InputLabelProps={{ sx: { color: "#fff" } }}
              autoComplete="name"
            />
            <TextField
              variant="standard"
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={textFieldSx}
              InputLabelProps={{ sx: { color: "#fff" } }}
              autoComplete="tel"
            />
          </>
        )}

        <TextField
          variant="standard"
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={!!errors.email}
          helperText={errors.email}
          sx={textFieldSx}
          InputLabelProps={{ sx: { color: "#fff" } }}
          autoComplete="email"
        />

        <TextField
          variant="standard"
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={!!errors.password}
          helperText={errors.password}
          sx={textFieldSx}
          InputLabelProps={{ sx: { color: "#fff" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  sx={{ color: "#fff" }}
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
        />

        {apiError && (
          <Typography color="error" fontSize="0.875rem">
            {apiError}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!formValid || loading}
          sx={{
            bgcolor: orange,
            color: "#fff",
            textTransform: "none",
            "&:hover": { bgcolor: "#A04D20" },
            height: 42,
            mt: 2,
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
