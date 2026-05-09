import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Link,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PaymentIcon from "@mui/icons-material/Payment";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useOrganizerAuth } from "../hooks/useOrganizerAuth";
import { useOrganizerRegistrations } from "../hooks/useOrganizerRegistrations";
import { useManualOrganizerRegistration } from "../hooks/useManualOrganizerRegistration";
import MarkAttendanceButton from "../components/admin/MarkAttendanceButton";

function normalizeAddOns(activity) {
  const rawConfig =
    activity?.pricingConfig ||
    activity?.pricing_config ||
    activity?.additionalInfo?.pricingConfig ||
    activity?.additional_info?.pricing_config;

  if (!rawConfig) return [];

  const config =
    typeof rawConfig === "string"
      ? (() => {
          try {
            return JSON.parse(rawConfig);
          } catch {
            return {};
          }
        })()
      : rawConfig;

  const addOns = config?.addOns || config?.addons || config?.add_ons || [];

  if (!Array.isArray(addOns)) return [];

  return addOns
    .map((addOn) => {
      if (!addOn || typeof addOn !== "object") return null;

      const id =
        typeof addOn.id === "string" && addOn.id.trim()
          ? addOn.id.trim()
          : typeof addOn.code === "string" && addOn.code.trim()
            ? addOn.code.trim()
            : typeof addOn.key === "string" && addOn.key.trim()
              ? addOn.key.trim()
              : "";
      const label =
        typeof addOn.label === "string" && addOn.label.trim()
          ? addOn.label.trim()
          : typeof addOn.name === "string" && addOn.name.trim()
            ? addOn.name.trim()
            : typeof addOn.title === "string" && addOn.title.trim()
              ? addOn.title.trim()
              : id;

      if (!id || !label) return null;

      const priceSource =
        addOn.pricePaise ??
        addOn.price_paise ??
        addOn.price ??
        addOn.amountPaise ??
        addOn.amount_paise;
      const pricePaise = Number(priceSource);
      const maxQuantitySource = addOn.maxQuantity ?? addOn.max_quantity;
      const maxQuantity =
        maxQuantitySource !== undefined
          ? Math.max(1, Number(maxQuantitySource) || 1)
          : 1;

      return {
        id,
        label,
        pricePaise: Number.isFinite(pricePaise) ? pricePaise : 0,
        maxQuantity,
      };
    })
    .filter(Boolean);
}

const AdminDashboardPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const { token, logout, isAuthenticated } = useOrganizerAuth();
  const { data, loading, error, refetch } = useOrganizerRegistrations(token);
  const { createManualRegistration, loading: creatingRegistration } =
    useManualOrganizerRegistration();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualError, setManualError] = useState("");
  const [manualForm, setManualForm] = useState({
    activityId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ticketCount: 1,
    addOns: [],
  });

  const manualFieldSx = {
    backgroundColor: "#fff",
    borderRadius: 2,
    "& .MuiInputBase-input": {
      color: "#111",
    },
    "& .MuiInputLabel-root": {
      color: "#333",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#E25517",
    },
    "& .MuiOutlinedInput-root": {
      color: "#111",
      "& fieldset": {
        borderColor: "rgba(0,0,0,0.3)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0,0,0,0.6)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#E25517",
      },
    },
    "& .MuiSelect-icon": {
      color: "#111",
    },
  };

  useEffect(() => {
    if (!loading) {
      setFadeIn(true);
    }
  }, [loading]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setSearchQuery("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setSearchQuery("");
  };

  const handleOpenManualModal = () => {
    const firstActivityId = data?.activities?.[0]?.id || "";
    setManualForm((current) => ({
      ...current,
      activityId: current.activityId || firstActivityId,
      addOns: current.addOns || [],
    }));
    setManualError("");
    setManualModalOpen(true);
  };

  const handleCloseManualModal = () => {
    setManualModalOpen(false);
    setManualError("");
    setManualForm({
      activityId: data?.activities?.[0]?.id || "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      ticketCount: 1,
      addOns: [],
    });
  };

  const handleManualFieldChange = (event) => {
    const { name, value } = event.target;
    setManualForm((current) => ({
      ...current,
      [name]: name === "ticketCount" ? Number(value) : value,
    }));
  };

  const handleManualAddOnChange = (addOnId, quantity) => {
    setManualForm((current) => {
      const nextAddOns = current.addOns.filter((item) => item.id !== addOnId);

      if (Number(quantity) > 0) {
        nextAddOns.push({ id: addOnId, quantity: Number(quantity) });
      }

      return {
        ...current,
        addOns: nextAddOns,
      };
    });
  };

  const handleManualRegistrationSubmit = async () => {
    try {
      setManualError("");
      await createManualRegistration(token, {
        activityId: manualForm.activityId,
        firstName: manualForm.firstName,
        lastName: manualForm.lastName,
        email: manualForm.email || undefined,
        phone: manualForm.phone || undefined,
        ticketCount: Number(manualForm.ticketCount) || 1,
        addOns: manualForm.addOns,
      });
      await refetch();
      handleCloseManualModal();
    } catch (err) {
      setManualError(
        err.response?.data?.error ||
          err.message ||
          "Failed to add registration",
      );
    }
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!selectedEvent || !searchQuery.trim()) {
      return selectedEvent?.users || [];
    }

    const query = searchQuery.toLowerCase();
    return selectedEvent.users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.includes(query),
    );
  }, [selectedEvent, searchQuery]);

  const selectedActivity = useMemo(
    () =>
      (data?.activities || []).find(
        (activity) => activity.id === manualForm.activityId,
      ) || null,
    [data?.activities, manualForm.activityId],
  );

  const selectedActivityAddOns = useMemo(
    () => normalizeAddOns(selectedActivity),
    [selectedActivity],
  );

  const selectedAddOnQuantities = useMemo(() => {
    return Object.fromEntries(
      manualForm.addOns.map((addOn) => [addOn.id, addOn.quantity]),
    );
  }, [manualForm.addOns]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: "#000",
                fontSize: { xs: 32, md: 56 },
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              Admin Dashboard
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: { xs: 10, md: 16 },
                  height: { xs: 10, md: 16 },
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  ml: { xs: 0.5, md: 1 },
                }}
              />
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: "auto" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleOpenManualModal}
                  disabled={
                    loading || creatingRegistration || !data?.activities?.length
                  }
                  sx={{
                    fontSize: { xs: 14, md: 18 },
                    fontWeight: 700,
                    borderColor: "primary.main",
                    color: "#000",
                    borderWidth: 2,
                    px: 3,
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: "primary.main",
                      bgcolor: "rgba(226, 85, 23, 0.1)",
                    },
                  }}
                >
                  {creatingRegistration
                    ? "Adding..."
                    : "Add Offline Registration"}
                </Button>
              </Grid>

              <Grid size={{ xs: 12, md: "auto" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={refetch}
                  startIcon={<RefreshIcon />}
                  disabled={loading}
                  sx={{
                    fontSize: { xs: 14, md: 18 },
                    fontWeight: 700,
                    borderColor: "primary.main",
                    color: "#000",
                    borderWidth: 2,
                    px: 3,
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: "primary.main",
                      bgcolor: "rgba(226, 85, 23, 0.1)",
                    },
                  }}
                >
                  {loading ? "Loading..." : "Refresh Data"}
                </Button>
              </Grid>

              <Grid size={{ xs: 12, md: "auto" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleLogout}
                  sx={{
                    fontSize: { xs: 14, md: 18 },
                    fontWeight: 700,
                    borderColor: "primary.main",
                    color: "#000",
                    borderWidth: 2,
                    px: 3,
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: "primary.main",
                      bgcolor: "rgba(226, 85, 23, 0.1)",
                    },
                  }}
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Registrations */}
          {data?.registrations && (
            <Box>
              <Typography
                sx={{
                  color: "#000",
                  fontSize: { xs: 20, md: 28 },
                  fontWeight: 800,
                  textTransform: "uppercase",
                  mb: 3,
                }}
              >
                Event Registrations ({data.registrations.length})
              </Typography>

              {data.registrations.length === 0 ? (
                <Alert severity="info">No registrations found.</Alert>
              ) : (
                <Grid container spacing={3}>
                  {data.registrations.map((reg, index) => (
                    <Grid
                      size={{ xs: 12, md: 4 }}
                      key={reg.activity.id || index}
                    >
                      <Card
                        onClick={() => handleOpenModal(reg)}
                        sx={{
                          bgcolor: "secondary.main",
                          borderRadius: "16px",
                          boxShadow: "4px 4px 0 #E25517",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "6px 6px 0 #E25517",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                          <Typography
                            sx={{
                              color: "#000",
                              fontSize: { xs: 18, md: 20 },
                              fontWeight: 800,
                              textTransform: "uppercase",
                              mb: 2,
                            }}
                          >
                            {reg.activity.name}
                          </Typography>

                          <Chip
                            label={`${reg.users.length} Registration${reg.users.length !== 1 ? "s" : ""}`}
                            sx={{
                              bgcolor: "primary.main",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: { xs: 12, md: 14 },
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Registrants Modal */}
          <Dialog
            open={modalOpen}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
              sx: {
                borderRadius: { xs: 0, md: "16px" },
                boxShadow: "4px 4px 0 #E25517",
                height: { xs: "100dvh", md: "auto" },
                maxHeight: { xs: "100dvh", md: "90dvh" },
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              },
            }}
          >
            <DialogTitle
              sx={{
                bgcolor: "secondary.main",
                color: "#000",
                fontSize: { xs: 20, md: 24 },
                fontWeight: 800,
                textTransform: "uppercase",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {selectedEvent?.activity.name}
              <Button
                onClick={handleCloseModal}
                sx={{
                  minWidth: "auto",
                  color: "#000",
                }}
              >
                <CloseIcon />
              </Button>
            </DialogTitle>

            <DialogContent
              sx={{
                pt: 2,
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Search Bar */}
              <Box
                sx={{
                  mt: 1,
                  mb: 3,
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <SearchIcon sx={{ color: "#666", fontSize: 24 }} />
                <TextField
                  fullWidth
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      color: "#111",
                    },
                  }}
                />
              </Box>

              {/* Results Count */}
              <Typography
                sx={{
                  color: "#666",
                  fontSize: 14,
                  mb: 2,
                }}
              >
                {filteredUsers.length} of {selectedEvent?.users.length || 0}{" "}
                registrant{(selectedEvent?.users.length || 0) !== 1 ? "s" : ""}
              </Typography>

              <Stack
                spacing={2}
                sx={{
                  flex: 1,
                  minHeight: 0,
                  maxHeight: { xs: "calc(100dvh - 220px)", md: "500px" },
                  overflowY: "auto",
                  pr: 0.5,
                }}
              >
                {filteredUsers.length === 0 ? (
                  <Typography
                    sx={{
                      color: "#666",
                      fontStyle: "italic",
                      textAlign: "center",
                      py: 4,
                    }}
                  >
                    {searchQuery.trim()
                      ? "No registrants match your search."
                      : "No registrants found."}
                  </Typography>
                ) : (
                  filteredUsers.map((user) => (
                    <Card
                      key={user.id}
                      sx={{
                        bgcolor: "#90BDF5",
                        borderRadius: 2,
                        border: "2px solid #E25517",
                        p: 2,
                        minHeight: { xs: 200, md: 118 },
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: { xs: "stretch", md: "center" },
                          gap: 2,
                          flexDirection: { xs: "column", md: "row" },
                        }}
                      >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <PersonIcon sx={{ color: "#000", fontSize: 20 }} />
                            <Typography
                              sx={{
                                color: "#000",
                                fontSize: 16,
                                fontWeight: 700,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {user.firstName} {user.lastName}
                            </Typography>
                          </Box>

                          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                            {user.email && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  minWidth: 0,
                                }}
                              >
                                <EmailIcon
                                  sx={{ color: "#000", fontSize: 18 }}
                                />
                                <a
                                  href={`mailto:${user.email}`}
                                  style={{
                                    color: "#000",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    minWidth: 0,
                                  }}
                                >
                                  {user.email}
                                </a>
                              </Box>
                            )}

                            {user.phone && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  minWidth: 0,
                                }}
                              >
                                <PhoneIcon
                                  sx={{ color: "#000", fontSize: 18 }}
                                />
                                <a
                                  href={`tel:${user.phone}`}
                                  style={{
                                    color: "#000",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    overflowWrap: "anywhere",
                                  }}
                                >
                                  {user.phone}
                                </a>
                              </Box>
                            )}
                          </Stack>
                        </Box>

                        <Stack
                          spacing={1}
                          sx={{
                            alignItems: { xs: "stretch", md: "flex-end" },
                            width: { xs: "100%", md: 220 },
                            minWidth: 0,
                          }}
                        >
                          <Chip
                            label={
                              user.paymentMethod === "manual"
                                ? "Offline / Manual"
                                : "Online / Paid"
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                user.paymentMethod === "manual"
                                  ? "#FFE7A3"
                                  : "#DFF5E1",
                              color: "#000",
                              fontWeight: 700,
                            }}
                          />
                          <MarkAttendanceButton
                            token={token}
                            registrationId={user.registrationId}
                            status={user.registrationStatus}
                            onMarked={async () => {
                              try {
                                const fresh = await refetch();
                                // update the selectedEvent to the refreshed activity data
                                if (fresh && selectedEvent?.activity?.id) {
                                  const updated = (
                                    fresh.registrations || []
                                  ).find(
                                    (r) =>
                                      r.activity.id ===
                                      selectedEvent.activity.id,
                                  );
                                  if (updated) setSelectedEvent(updated);
                                }
                              } catch (e) {
                                // ignore - refetch already sets error state
                              }
                            }}
                            fullWidth
                          />
                        </Stack>
                      </Box>
                    </Card>
                  ))
                )}
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseModal}
                sx={{
                  fontWeight: 700,
                  color: "#000",
                  "&:hover": {
                    bgcolor: "rgba(226, 85, 23, 0.1)",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={manualModalOpen}
            onClose={handleCloseManualModal}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: "16px",
                boxShadow: "4px 4px 0 #E25517",
              },
            }}
          >
            <DialogTitle
              sx={{
                bgcolor: "secondary.main",
                color: "#000",
                fontSize: { xs: 20, md: 24 },
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              Add Offline Registration
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              {manualError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {manualError}
                </Alert>
              )}

              <Stack spacing={2} py={2}>
                <TextField
                  select
                  label="Activity"
                  name="activityId"
                  value={manualForm.activityId}
                  onChange={handleManualFieldChange}
                  fullWidth
                  required
                  sx={manualFieldSx}
                >
                  {(data?.activities || []).map((activity) => (
                    <MenuItem
                      key={activity.id}
                      value={activity.id}
                      sx={{ color: "primary.main" }}
                    >
                      {activity.name}
                    </MenuItem>
                  ))}
                </TextField>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={manualForm.firstName}
                      onChange={handleManualFieldChange}
                      fullWidth
                      required
                      sx={manualFieldSx}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={manualForm.lastName}
                      onChange={handleManualFieldChange}
                      fullWidth
                      required
                      sx={manualFieldSx}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Email"
                      name="email"
                      value={manualForm.email}
                      onChange={handleManualFieldChange}
                      fullWidth
                      sx={manualFieldSx}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={manualForm.phone}
                      onChange={handleManualFieldChange}
                      fullWidth
                      sx={manualFieldSx}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      type="number"
                      label="Ticket Count"
                      name="ticketCount"
                      value={manualForm.ticketCount}
                      onChange={handleManualFieldChange}
                      inputProps={{ min: 1, max: 4 }}
                      fullWidth
                      required
                      sx={manualFieldSx}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseManualModal}
                sx={{
                  fontWeight: 700,
                  color: "#000",
                  "&:hover": {
                    bgcolor: "rgba(226, 85, 23, 0.1)",
                  },
                }}
              >
                Cancel
              </Button>

              {selectedActivityAddOns.length > 0 && (
                <Box
                  sx={{
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: 2,
                    p: 2,
                    bgcolor: "rgba(255,255,255,0.5)",
                  }}
                >
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>
                    Add-ons for this activity
                  </Typography>
                  <Stack spacing={1.5}>
                    {selectedActivityAddOns.map((addOn) => (
                      <Box
                        key={addOn.id}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", md: "1fr 140px" },
                          gap: 1.5,
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {addOn.label}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "#666" }}>
                            ₹{(addOn.pricePaise / 100).toFixed(2)} per item
                          </Typography>
                        </Box>
                        <TextField
                          type="number"
                          label="Quantity"
                          value={selectedAddOnQuantities[addOn.id] || 0}
                          onChange={(event) =>
                            handleManualAddOnChange(
                              addOn.id,
                              event.target.value,
                            )
                          }
                          inputProps={{ min: 0, max: addOn.maxQuantity || 1 }}
                          fullWidth
                          sx={manualFieldSx}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
              <Button
                onClick={handleManualRegistrationSubmit}
                variant="contained"
                disabled={
                  creatingRegistration ||
                  !manualForm.activityId ||
                  !manualForm.firstName ||
                  !manualForm.lastName ||
                  (!manualForm.email && !manualForm.phone)
                }
                sx={{
                  fontWeight: 800,
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "#cc4614",
                  },
                }}
              >
                {creatingRegistration ? "Saving..." : "Save Registration"}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </div>
  );
};

export default AdminDashboardPage;
