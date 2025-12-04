import React, { useState } from "react";
import {
  Grid,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  InputAdornment,
  DialogContent,
  DialogTitle,
  Alert,
  Snackbar,
} from "@mui/material";
import { useRegisterClub } from "../../hooks/useRegisterClub";
import { useClubs } from "../../hooks/useClubs";

const RegisterClubDialog = ({ open, onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const { clubs, loading: clubsLoading } = useClubs();
  const [selectedClubs, setSelectedClubs] = useState([]);
  const { registerClub, loading, error, result } = useRegisterClub();

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState({
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    if (error) {
      setSnackbarContent({ message: error, severity: "error" });
      setOpenSnackbar(true);
    } else if (result && result.message) {
      setSnackbarContent({ message: result.message, severity: "success" });
      setOpenSnackbar(true);
    }
  }, [error, result]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClubChange = (clubId) => {
    setSelectedClubs((prev) =>
      prev.includes(clubId)
        ? prev.filter((id) => id !== clubId)
        : [...prev, clubId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Map stored keys back to actual club.id when available (fallback to slug or key)
    for (const key of selectedClubs) {
      const match = clubs.find((c, i) => (c.id ?? c.slug ?? String(i)) === key);
      const clubIdToSend = match ? match.id ?? match.slug : key;
      await registerClub(clubIdToSend, form);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle
          variant="h1"
          sx={{
            color: "#000",
            fontSize: { xs: 30, md: 50 },
            textTransform: "uppercase",
            "& .dot": {
              display: "inline-block",
              width: { xs: 12, md: 14 },
              height: { xs: 12, md: 14 },
              borderRadius: "50%",
              backgroundColor: "primary.main",
              marginLeft: { xs: 0.5, md: 1 },
            },
          }}
        >
          Select your club
          <span>
            <div className="dot" />
          </span>
        </DialogTitle>
        <DialogContent
          sx={{
            mx: 4,
            mb: 5,
            boxShadow: "4px 4px 0 #E25517",
            borderRadius: 6,
            bgcolor: "secondary.main",
          }}
        >
          <form onSubmit={handleSubmit} id="register-club-form">
            <Box
              sx={{
                bgcolor: "#90BDF5",
                borderRadius: 4,
                py: 4,
                px: 2,
                boxShadow: "none",
              }}
            >
              <FormGroup>
                {clubsLoading ? (
                  <Typography>Loading clubs...</Typography>
                ) : (
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      py: 2,
                      borderRadius: 4,
                    }}
                  >
                    {clubs.map((club, idx) => {
                      const clubKey = club.id ?? club.slug ?? String(idx);
                      return (
                        <FormControlLabel
                          key={clubKey}
                          control={
                            <Checkbox
                              checked={selectedClubs.includes(clubKey)}
                              onChange={() => handleClubChange(clubKey)}
                              sx={{
                                bgcolor: "background.default",
                                borderRadius: "50%",
                                p: 0.5,
                                mr: 2,
                                "& .MuiSvgIcon-root": {
                                  borderRadius: "50%",
                                },
                                "&.Mui-checked": {
                                  color: "#E25517",
                                },
                              }}
                              icon={
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    border: 0,
                                    background: "transparent",
                                    boxSizing: "border-box",
                                  }}
                                />
                              }
                              checkedIcon={
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    border: "2px solid #E25517",
                                    background: "#E25517",
                                    boxSizing: "border-box",
                                  }}
                                />
                              }
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: { xs: 14, md: 18 },
                                textTransform: "uppercase",
                              }}
                            >
                              {club.name}
                            </Typography>
                          }
                          sx={{
                            borderRadius: 3,
                            px: 2,
                            py: 0.5,
                            mb: 1.2,
                            mx: 0,
                            width: "100%",
                            "& .MuiTypography-root": { color: "#fff" },
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              </FormGroup>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  margin="dense"
                  autoComplete="off"
                  variant="standard"
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    width: "100%",
                    background: "transparent",
                    mb: 2,
                    fontSize: { xs: 18, md: 22 },
                    "& .MuiInputBase-input": {
                      fontSize: { xs: 18, md: 22 },
                    },
                    "& .MuiInput-underline:before": {
                      borderBottom: "2px solid #E25517",
                    },
                    "& .MuiInput-underline:after": {
                      borderColor: "#E25517",
                    },
                    "& .MuiInputBase-root": {
                      background: "transparent",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: { xs: 18, md: 22 },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  margin="dense"
                  autoComplete="off"
                  variant="standard"
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    width: "100%",
                    background: "transparent",
                    mb: 2,
                    fontSize: { xs: 18, md: 22 },
                    "& .MuiInputBase-input": {
                      fontSize: { xs: 18, md: 22 },
                    },
                    "& .MuiInput-underline:before": {
                      borderBottom: "2px solid #E25517",
                    },
                    "& .MuiInput-underline:after": {
                      borderColor: "#E25517",
                    },
                    "& .MuiInputBase-root": {
                      background: "transparent",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: { xs: 18, md: 22 },
                    },
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  margin="dense"
                  autoComplete="off"
                  variant="standard"
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    width: "100%",
                    background: "transparent",
                    mb: 2,
                    fontSize: { xs: 18, md: 22 },
                    "& .MuiInputBase-input": {
                      fontSize: { xs: 18, md: 22 },
                    },
                    "& .MuiInput-underline:before": {
                      borderBottom: "2px solid #E25517",
                    },
                    "& .MuiInput-underline:after": {
                      borderColor: "#E25517",
                    },
                    "& .MuiInputBase-root": {
                      background: "transparent",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: { xs: 18, md: 22 },
                    },
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  margin="dense"
                  autoComplete="off"
                  variant="standard"
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                  inputMode="numeric"
                  pattern="[0-9]*"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" color="inherit">
                          <span
                            style={{
                              color: "background.default",
                              fontWeight: 700,
                            }}
                          >
                            +91
                          </span>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    width: "100%",
                    background: "transparent",
                    mb: 2,
                    fontSize: { xs: 18, md: 22 },
                    "& .MuiInputBase-input": {
                      fontSize: { xs: 18, md: 22 },
                    },
                    "& .MuiInput-underline:before": {
                      borderBottom: "2px solid #E25517",
                    },
                    "& .MuiInput-underline:after": {
                      borderColor: "#E25517",
                    },
                    "& .MuiInputBase-root": {
                      background: "transparent",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: { xs: 18, md: 22 },
                    },
                    "& .MuiInputAdornment-root": {
                      color: "#fff",
                      fontWeight: 700,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                form="register-club-form"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                sx={{
                  fontSize: { xs: 16, md: 30 },
                  fontWeight: 800,
                  fontFamily: "League Spartan",
                  borderRadius: { xs: 6, md: 4 },
                  pt: 1,
                  pb: 0,
                }}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarContent.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarContent.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegisterClubDialog;
