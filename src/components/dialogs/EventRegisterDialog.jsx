import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Alert,
  Snackbar,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useRegisterEvent } from "../../hooks/useRegisterEvent";
import { openRazorpayCheckout } from "../../lib/razorpay";
import api from "../../lib/api";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function makeAddOnId(raw, index) {
  const provided = raw?.id || raw?.code || raw?.key;
  if (typeof provided === "string" && provided.trim()) {
    return provided.trim();
  }

  const label = String(raw?.label || raw?.name || raw?.title || "").trim();
  if (label) {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  return `addon_${index + 1}`;
}

function normalizeAddOns(addOns) {
  if (!Array.isArray(addOns)) return [];

  return addOns
    .map((raw, index) => {
      if (!raw || typeof raw !== "object") return null;

      const label = String(
        raw.label || raw.name || raw.title || "Add-on",
      ).trim();
      const pricePaise = toNumber(
        raw.pricePaise ??
          raw.price_paise ??
          raw.price ??
          raw.amountPaise ??
          raw.amount_paise,
        0,
      );

      return {
        id: makeAddOnId(raw, index),
        label,
        description: raw.description || raw.desc || "",
        pricePaise,
        maxQuantity: Math.max(
          1,
          toNumber(raw.maxQuantity ?? raw.max_quantity, 10),
        ),
      };
    })
    .filter(Boolean);
}

function getPricingConfig(activity) {
  const rawConfig =
    activity?.pricingConfig ||
    activity?.pricing_config ||
    activity?.additionalInfo?.pricingConfig ||
    activity?.additional_info?.pricing_config;

  if (!rawConfig) return {};

  if (typeof rawConfig === "string") {
    try {
      return JSON.parse(rawConfig);
    } catch {
      return {};
    }
  }

  if (typeof rawConfig === "object") {
    const nested = rawConfig?.pricingConfig || rawConfig?.pricing_config;
    return typeof nested === "object" && nested ? nested : rawConfig;
  }

  return {};
}

const EventRegisterDialog = ({ open, onClose, activity }) => {
  const pricingConfig = useMemo(
    () => getPricingConfig(activity),
    [
      activity?.pricingConfig,
      activity?.pricing_config,
      activity?.additionalInfo,
      activity?.additional_info,
    ],
  );
  const addOnDefinitions = useMemo(() => {
    const rawAddOns =
      pricingConfig?.addOns ||
      pricingConfig?.addons ||
      pricingConfig?.add_ons ||
      [];
    return normalizeAddOns(rawAddOns);
  }, [pricingConfig]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ticketCount: 1,
    addOns: [],
  });
  const [phoneError, setPhoneError] = useState("");
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);

  const { registerEvent, loading, error, result } = useRegisterEvent();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState({
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    if (error) {
      setSnackbarContent({ message: error, severity: "error" });
      setOpenSnackbar(true);
    }
  }, [error]);

  React.useEffect(() => {
    if (!open) return;

    setForm((current) => ({
      ...current,
      addOns: addOnDefinitions.map((addon) => ({
        id: addon.id,
        quantity:
          current.addOns?.find((selection) => selection.id === addon.id)
            ?.quantity || 0,
      })),
    }));
  }, [open, addOnDefinitions]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number validation
    if (name === "phone") {
      // Only allow digits
      const digitsOnly = value.replace(/\D/g, "");

      // Limit to 10 digits
      const limitedValue = digitsOnly.slice(0, 10);

      setForm({ ...form, [name]: limitedValue });

      // Validate length
      if (limitedValue.length > 0 && limitedValue.length !== 10) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddOnChange = (addOnId, quantity) => {
    setForm((current) => ({
      ...current,
      addOns: addOnDefinitions.map((addon) =>
        addon.id === addOnId
          ? { id: addOnId, quantity }
          : current.addOns?.find((selection) => selection.id === addon.id) || {
              id: addon.id,
              quantity: 0,
            },
      ),
    }));
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      ticketCount: 1,
      addOns: addOnDefinitions.map((addon) => ({ id: addon.id, quantity: 0 })),
    });
  };

  const selectedAddOns = form.addOns || [];
  const addonAmountPaise = selectedAddOns.reduce((total, selection) => {
    const definition = addOnDefinitions.find(
      (addon) => addon.id === selection.id,
    );
    const pricePaise = Number(definition?.pricePaise ?? definition?.price ?? 0);
    return total + pricePaise * Number(selection.quantity || 0);
  }, 0);
  const baseAmountPaise =
    Number(activity?.registrationFee || 0) * Number(form.ticketCount || 1);
  const totalAmountPaise = baseAmountPaise + addonAmountPaise;
  const totalAmount = totalAmountPaise / 100;
  const shouldHighlightBasePack = activity?.slug === "mothers-day";
  const basePackLabel = pricingConfig?.baseLabel || "Mom + Kid";
  const basePackAmount = Number(activity?.registrationFee || 0) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number before submission
    if (form.phone && form.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    if (!activity || !activity.slug) {
      setSnackbarContent({
        message: "Invalid activity data",
        severity: "error",
      });
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await registerEvent(activity.slug, form);

      // Check if payment is required
      if (response && response.paymentInfo) {
        const { paymentInfo } = response;

        // Handle free events
        if (!response?.feeDetails?.totalAmountPaise) {
          setSnackbarContent({
            message: "Registration successful!",
            severity: "success",
          });
          setOpenSnackbar(true);

          setTimeout(() => {
            onClose();
            resetForm();
          }, 2000);
          return;
        }

        // Handle Razorpay payment
        if (paymentInfo.type === "razorpay") {
          const paymentData = {
            razorpayKeyId: paymentInfo.razorpayKeyId,
            orderId: paymentInfo.orderId,
            amount: paymentInfo.amount,
            currency: paymentInfo.currency,
            activityName: activity.name,
            userName: `${form.firstName} ${form.lastName}`,
            userEmail: form.email,
            userPhone: form.phone,
            description: `Registration for ${activity.name}`,
          };

          // Keep loading state active while Razorpay UI is open
          setIsPaymentInProgress(true);

          openRazorpayCheckout(
            paymentData,
            async (razorpayResponse) => {
              // Payment successful - verify with backend
              console.log("Payment successful, verifying with backend...");

              try {
                // Call backend to verify payment
                const verifyResponse = await api.post("/verify-payment", {
                  razorpay_order_id: razorpayResponse.razorpay_order_id,
                  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                  razorpay_signature: razorpayResponse.razorpay_signature,
                });

                console.log("Payment verified:", verifyResponse.data);

                // Reset payment progress state
                setIsPaymentInProgress(false);

                // Close the dialog immediately
                onClose();

                // Navigate to success page with payment details
                navigate(
                  `/payment-success?payment_id=${razorpayResponse.razorpay_payment_id}&order_id=${razorpayResponse.razorpay_order_id}&signature=${razorpayResponse.razorpay_signature}`,
                );
                window.scrollTo(0, 0);

                // Reset form
                resetForm();
              } catch (error) {
                console.error("Payment verification failed:", error);
                setIsPaymentInProgress(false);
                setSnackbarContent({
                  message:
                    "Payment verification failed. Please contact support.",
                  severity: "error",
                });
                setOpenSnackbar(true);
              }
            },
            (errorMessage) => {
              // Payment failed or cancelled
              console.error("Payment failed:", errorMessage);
              setIsPaymentInProgress(false);
              setSnackbarContent({
                message: errorMessage || "Payment failed. Please try again.",
                severity: "error",
              });
              setOpenSnackbar(true);
            },
          );
        }
        // Handle manual payment (QR code, etc.)
        else if (paymentInfo.type === "manual") {
          setSnackbarContent({
            message: "Registration initiated. Complete payment to confirm.",
            severity: "info",
          });
          setOpenSnackbar(true);

          // Optionally redirect to payment page
          // window.location.href = paymentInfo.paymentPage;
        }
      } else {
        // No payment info - likely a free event
        setSnackbarContent({
          message: response?.message || "Registration successful!",
          severity: "success",
        });
        setOpenSnackbar(true);

        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setSnackbarContent({
        message: err.response?.data?.error || "Registration failed",
        severity: "error",
      });
      setOpenSnackbar(true);
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
          Register for Event
          <span>
            <div className="dot" />
          </span>
        </DialogTitle>
        <DialogContent
          sx={{
            mx: { xs: 2, md: 4 },
            mb: 5,
            boxShadow: "4px 4px 0 #E25517",
            borderRadius: 6,
            bgcolor: "secondary.main",
          }}
        >
          <form onSubmit={handleSubmit} id="event-register-form">
            <Box
              sx={{
                bgcolor: "#90BDF5",
                borderRadius: 4,
                py: { xs: 2, md: 4 },
                px: { xs: 0, md: 2 },
                boxShadow: "none",
              }}
            >
              {/* Event Info */}
              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "primary.main",
                  py: 1,
                  px: { xs: 2, md: 4 },
                  borderRadius: 4,
                }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: { xs: 14, md: 18 },
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  {activity?.name || "Event"}
                </Typography>
                <Typography
                  sx={{
                    color: "background.default",
                    fontSize: { xs: 12, md: 16 },
                  }}
                >
                  Fee: ₹
                  {(activity?.registrationFee
                    ? activity.registrationFee / 100
                    : 0
                  ).toFixed(2)}
                  {addOnDefinitions.length ? " + add-ons" : " per person"}
                </Typography>
              </Stack>
              {shouldHighlightBasePack && (
                <Typography
                  sx={{
                    mt: 1,
                    mx: { xs: 1, md: 2 },
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: "#FFE7A3",
                    color: "#5A260B",
                    fontWeight: 800,
                    fontSize: { xs: 12, md: 14 },
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                >
                  {basePackLabel} ₹{basePackAmount.toFixed(0)}
                </Typography>
              )}

              <Grid container spacing={{ xs: 0, md: 2 }}>
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
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                    inputMode="numeric"
                    error={!!phoneError}
                    helperText={phoneError}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <span
                              style={{
                                color: "#fff",
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
                      "& .MuiFormHelperText-root": {
                        color: "#ff1744",
                        fontWeight: 600,
                      },
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <FormControl
                    variant="standard"
                    fullWidth
                    sx={{
                      mb: 2,
                    }}
                  >
                    <InputLabel
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: { xs: 18, md: 22 },
                        "&.Mui-focused": {
                          color: "#fff",
                        },
                      }}
                    >
                      Number of Tickets
                    </InputLabel>
                    <Select
                      name="ticketCount"
                      value={form.ticketCount}
                      onChange={handleChange}
                      label="Number of Tickets"
                      sx={{
                        fontSize: { xs: 18, md: 22 },
                        color: "#fff",
                        fontWeight: 700,
                        "& .MuiSelect-icon": {
                          color: "#fff",
                        },
                        "&:before": {
                          borderBottom: "2px solid #E25517",
                        },
                        "&:after": {
                          borderColor: "#E25517",
                        },
                      }}
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <MenuItem
                          key={num}
                          value={num}
                          sx={{ color: "#E25517" }}
                        >
                          {num} {num === 1 ? "Ticket" : "Tickets"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {addOnDefinitions.length > 0 && (
                  <Grid size={12}>
                    <Box
                      sx={{
                        bgcolor: "rgba(255,255,255,0.18)",
                        borderRadius: 3,
                        p: { xs: 2, md: 3 },
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: { xs: 14, md: 18 },
                          textTransform: "uppercase",
                          mb: 1.5,
                        }}
                      >
                        Add-ons
                      </Typography>
                      <Stack spacing={2}>
                        {addOnDefinitions.map((addon) => {
                          const selectedQuantity =
                            form.addOns?.find(
                              (selection) => selection.id === addon.id,
                            )?.quantity || 0;
                          const maxQuantity = Math.max(
                            1,
                            Number(addon.maxQuantity || 5),
                          );
                          const addonPricePaise = Number(
                            addon.pricePaise ?? addon.price ?? 0,
                          );

                          return (
                            <Box key={addon.id}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="baseline"
                                spacing={2}
                              >
                                <Box>
                                  <Typography
                                    sx={{
                                      color: "#fff",
                                      fontWeight: 700,
                                      fontSize: { xs: 14, md: 16 },
                                    }}
                                  >
                                    {addon.label}
                                  </Typography>
                                  {addon.description ? (
                                    <Typography
                                      sx={{
                                        color: "rgba(255,255,255,0.8)",
                                        fontSize: { xs: 12, md: 13 },
                                      }}
                                    >
                                      {addon.description}
                                    </Typography>
                                  ) : null}
                                </Box>
                                <Typography
                                  sx={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: { xs: 12, md: 14 },
                                  }}
                                >
                                  ₹{(addonPricePaise / 100).toFixed(2)} each
                                </Typography>
                              </Stack>
                              <FormControl
                                variant="standard"
                                fullWidth
                                sx={{ mt: 1 }}
                              >
                                <InputLabel
                                  sx={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: { xs: 16, md: 18 },
                                    "&.Mui-focused": {
                                      color: "#fff",
                                    },
                                  }}
                                >
                                  Quantity
                                </InputLabel>
                                <Select
                                  value={selectedQuantity}
                                  onChange={(event) =>
                                    handleAddOnChange(
                                      addon.id,
                                      Number(event.target.value),
                                    )
                                  }
                                  label="Quantity"
                                  sx={{
                                    fontSize: { xs: 16, md: 18 },
                                    color: "#fff",
                                    fontWeight: 700,
                                    "& .MuiSelect-icon": {
                                      color: "#fff",
                                    },
                                    "&:before": {
                                      borderBottom: "2px solid #E25517",
                                    },
                                    "&:after": {
                                      borderColor: "#E25517",
                                    },
                                  }}
                                >
                                  {Array.from(
                                    { length: maxQuantity + 1 },
                                    (_, index) => index,
                                  ).map((quantity) => (
                                    <MenuItem
                                      key={quantity}
                                      value={quantity}
                                      sx={{ color: "#E25517" }}
                                    >
                                      {quantity}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  form="event-register-form"
                  variant="contained"
                  color="primary"
                  disabled={loading || isPaymentInProgress}
                  fullWidth
                  sx={{
                    fontSize: { xs: 16, md: 30 },
                    fontWeight: 800,
                    fontFamily: "League Spartan",
                    borderRadius: { xs: 2, md: 4 },
                    pt: 1,
                    pb: 0,
                    position: "relative",
                  }}
                >
                  {loading || isPaymentInProgress ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>Processing</span>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: "3px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                    </Box>
                  ) : totalAmountPaise > 0 ? (
                    `Pay ₹${totalAmount.toFixed(2)}`
                  ) : (
                    "Register Now"
                  )}
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

export default EventRegisterDialog;
