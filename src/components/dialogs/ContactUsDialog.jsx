import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Alert,
  Snackbar,
} from "@mui/material";

const ContactUsDialog = ({ open, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState({
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSnackbarContent({
        message: "Thank you for reaching out! We'll get back to you soon.",
        severity: "success",
      });
      setOpenSnackbar(true);
      
      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      
      // Close dialog after successful submission
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setSnackbarContent({
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          Contact Us
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
          <form onSubmit={handleSubmit} id="contact-us-form">
            <Box
              sx={{
                bgcolor: "#90BDF5",
                borderRadius: 4,
                py: 4,
                px: 2,
                boxShadow: "none",
              }}
            >
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    margin="dense"
                    autoComplete="off"
                    variant="standard"
                    label="Name"
                    name="name"
                    value={form.name}
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
                    type="email"
                    value={form.email}
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
                    label="Phone (Optional)"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                    inputMode="numeric"
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
                    label="Message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    fullWidth
                    multiline
                    rows={4}
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
              </Grid>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  form="contact-us-form"
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
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </Box>
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

export default ContactUsDialog;