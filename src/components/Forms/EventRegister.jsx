import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  Stack,
  IconButton,
  Grow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../utils/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  bgcolor: "#000",
  color: "#fff",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const textFieldStyle = {
  input: { color: "#fff" },
  "& .MuiInput-underline:before": { borderBottomColor: "#B55725" },
  "& .MuiInput-underline:after": { borderBottomColor: "#B55725" },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: "#B55725",
  },
};

const EventRegister = ({ open, handleClose, event, setSnackbar }) => {
  const [form, setForm] = useState({
    Name: "",
    Contact: "",
    Email: "",
    Instagram: "",
    Locality: "",
    Questions: "",
  });

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!open) return;

    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me", { withCredentials: true });
        const user = res.data.user || res.data.safeUserLogin || {};
        setUserId(user.id || null);
        setForm((prev) => ({
          ...prev,
          Name: user.name || "",
          Contact: user.phone || "",
          Email: user.email || "",
        }));
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setUserId(null);
      }
    };

    fetchUser();
    setSuccessMsg("");
    setErrorMsg("");
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      setErrorMsg("User not authenticated");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        eventId: event.id,
        instagram: form.Instagram,
        linkedIn: form.Locality,
      };

      // Step 1: Create booking and get Razorpay order
      const res = await api.post("/booking/protected/book", payload, {
        withCredentials: true,
      });

      console.log("Booking response:", res.data);

      const { bookingId, razorpayOrderId, amount, currency, eventTitle } =
        res.data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        name: "Social Dining",
        description: eventTitle,
        order_id: razorpayOrderId,
        bookingId: bookingId,

        handler: async (paymentRes) => {
          try {
            // Step 3: Verify payment with backend
            const verifyRes = await api.put(
              "/booking/protected/book",
              {
                razorpay_order_id: paymentRes.razorpay_order_id,
                razorpay_payment_id: paymentRes.razorpay_payment_id,
                razorpay_signature: paymentRes.razorpay_signature,
                bookingId: bookingId,
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              setSuccessMsg("Payment successful!");
              setSnackbar?.({
                open: true,
                message: "Payment successful!",
                severity: "success",
              });
              handleClose();
            } else {
              setErrorMsg("Payment verification failed.");
              setSnackbar?.({
                open: true,
                message: "Invalid payment signature",
                severity: "error",
              });
            }
          } catch (err) {
            setSnackbar?.({
              open: true,
              message: "Payment verification failed",
              severity: "error",
            });
          }
        },
        prefill: {
          name: form.Name,
          email: form.Email,
          contact: form.Contact,
        },
        theme: {
          color: "#B55725",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setSnackbar?.({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to book the event. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const labels = [
    "Name",
    "Contact",
    "Email",
    "Instagram",
    "What is your business about?",
    "Any questions to ask?",
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slotProps={{
        backdrop: {
          style: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        },
      }}
    >
      <Box sx={style}>
        <Grow in={open} timeout={400}>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="bold">
                {event.title}
              </Typography>
              <IconButton onClick={handleClose} sx={{ color: "#B55725" }}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Stack spacing={2} mt={2}>
              {labels.map((label) => {
                let key = label.replace(/\s+/g, "");
                if (label === "Any questions to ask?") key = "Questions";

                return (
                  <TextField
                    key={label}
                    label={label}
                    variant="standard"
                    fullWidth
                    name={key}
                    value={form[key] || ""}
                    onChange={handleChange}
                    autoComplete="off"
                    InputProps={{ disableUnderline: false }}
                    InputLabelProps={{ style: { color: "#fff" } }}
                    sx={textFieldStyle}
                  />
                );
              })}

              {errorMsg && (
                <Typography color="error" fontSize="0.9rem">
                  {errorMsg}
                </Typography>
              )}
              {successMsg && (
                <Typography color="success.main" fontSize="0.9rem">
                  {successMsg}
                </Typography>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  mt: 2,
                  bgcolor: "#B55725",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#B55725" },
                }}
              >
                {loading ? "Booking..." : `Submit & Pay ₹${event.price}/-`}
              </Button>
            </Stack>
          </Box>
        </Grow>
      </Box>
    </Modal>
  );
};

export default EventRegister;
