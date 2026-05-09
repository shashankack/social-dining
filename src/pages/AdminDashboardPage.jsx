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

function normalizeAddOns(activity) {
  const rawConfig = activity?.pricingConfig || activity?.pricing_config || activity?.additionalInfo?.pricingConfig || activity?.additional_info?.pricing_config;

  if (!rawConfig) return [];

  const config = typeof rawConfig === "string" ? (() => {
    try {
      return JSON.parse(rawConfig);
    } catch {
      return {};
    }
  })() : rawConfig;

  const addOns = config?.addOns || config?.addons || config?.add_ons || [];

  if (!Array.isArray(addOns)) return [];

  return addOns
    .map((addOn) => {
      if (!addOn || typeof addOn !== "object") return null;

      const id = typeof addOn.id === "string" && addOn.id.trim() ? addOn.id.trim() : typeof addOn.code === "string" && addOn.code.trim() ? addOn.code.trim() : typeof addOn.key === "string" && addOn.key.trim() ? addOn.key.trim() : "";
      const label = typeof addOn.label === "string" && addOn.label.trim() ? addOn.label.trim() : typeof addOn.name === "string" && addOn.name.trim() ? addOn.name.trim() : typeof addOn.title === "string" && addOn.title.trim() ? addOn.title.trim() : id;

      if (!id || !label) return null;

      const priceSource = addOn.pricePaise ?? addOn.price_paise ?? addOn.price ?? addOn.amountPaise ?? addOn.amount_paise;
      const pricePaise = Number(priceSource);
      const maxQuantitySource = addOn.maxQuantity ?? addOn.max_quantity;
      const maxQuantity = maxQuantitySource !== undefined ? Math.max(1, Number(maxQuantitySource) || 1) : 1;

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
    () => (data?.activities || []).find((activity) => activity.id === manualForm.activityId) || null,
    [data?.activities, manualForm.activityId],
  );

  const selectedActivityAddOns = useMemo(
    () => normalizeAddOns(selectedActivity),
    [selectedActivity],
  );

  const selectedAddOnQuantities = useMemo(() => {
    return Object.fromEntries(manualForm.addOns.map((addOn) => [addOn.id, addOn.quantity]));
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

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
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

              <Button
                variant="outlined"
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

              <Button
                variant="outlined"
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
            </Box>
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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

            <DialogContent sx={{ pt: 2 }}>
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

              {/* Registrants List */}
              <Stack spacing={2} sx={{ maxHeight: "500px", overflowY: "auto" }}>
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
                        pt: 1.5,
                        pb: { xs: 12, md: 6 },
                        px: 2,
                      }}
                    >
                      <Stack spacing={2}>
                        <Grid container>
                          <Grid size={{ xs: 12, md: 6 }}>
                            {/* Name */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <PersonIcon
                                sx={{ color: "#000", fontSize: 20 }}
                              />
                              <Typography
                                sx={{
                                  color: "#000",
                                  fontSize: 16,
                                  fontWeight: 700,
                                }}
                              >
                                {user.firstName} {user.lastName}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            {/* Email */}
                            {user.email && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <EmailIcon
                                  sx={{ color: "#000", fontSize: 20 }}
                                />
                                <a
                                  href={`mailto:${user.email}`}
                                  style={{
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                  }}
                                >
                                  {user.email}
                                </a>
                              </Box>
                            )}
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            {" "}
                            {/* Phone */}
                            {user.phone && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <PhoneIcon
                                  sx={{ color: "#000", fontSize: 20 }}
                                />
                                <a
                                  href={`tel:${user.phone}`}
                                  style={{
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                  }}
                                >
                                  {user.phone}
                                </a>
                              </Box>
                            )}
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Chip
                              label={
                                user.paymentMethod === "manual"
                                  ? "Offline / Manual"
                                  : "Online / Paid"
                              }
                              size="small"
                              sx={{
                                mt: 1,
                                bgcolor:
                                  user.paymentMethod === "manual"
                                    ? "#FFE7A3"
                                    : "#DFF5E1",
                                color: "#000",
                                fontWeight: 700,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Stack>
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

              <Stack spacing={2}>
                <TextField
                  select
                  label="Activity"
                  name="activityId"
                  value={manualForm.activityId}
                  onChange={handleManualFieldChange}
                  fullWidth
                  required
                >
                  {(data?.activities || []).map((activity) => (
                    <MenuItem key={activity.id} value={activity.id}>
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
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Email"
                      name="email"
                      value={manualForm.email}
                      onChange={handleManualFieldChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={manualForm.phone}
                      onChange={handleManualFieldChange}
                      fullWidth
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
                            onChange={(event) => handleManualAddOnChange(addOn.id, event.target.value)}
                            inputProps={{ min: 0, max: addOn.maxQuantity || 1 }}
                            fullWidth
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
