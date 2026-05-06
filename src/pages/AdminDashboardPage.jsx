import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PaymentIcon from '@mui/icons-material/Payment';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useOrganizerAuth } from '../hooks/useOrganizerAuth';
import { useOrganizerRegistrations } from '../hooks/useOrganizerRegistrations';

const AdminDashboardPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const { token, logout, isAuthenticated } = useOrganizerAuth();
  const { data, loading, error, refetch } = useOrganizerRegistrations(token);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      setFadeIn(true);
    }
  }, [loading]);

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setSearchQuery('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setSearchQuery('');
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!selectedEvent || !searchQuery.trim()) {
      return selectedEvent?.users || [];
    }
    
    const query = searchQuery.toLowerCase();
    return selectedEvent.users.filter(user => 
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone?.includes(query)
    );
  }, [selectedEvent, searchQuery]);

  return (
    <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease' }}>
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: '#000',
              fontSize: { xs: 32, md: 56 },
              fontWeight: 900,
              textTransform: 'uppercase',
            }}
          >
            Admin Dashboard
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: { xs: 10, md: 16 },
                height: { xs: 10, md: 16 },
                borderRadius: '50%',
                bgcolor: 'primary.main',
                ml: { xs: 0.5, md: 1 },
              }}
            />
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={refetch}
              startIcon={<RefreshIcon />}
              disabled={loading}
              sx={{
                fontSize: { xs: 14, md: 18 },
                fontWeight: 700,
                borderColor: 'primary.main',
                color: '#000',
                borderWidth: 2,
                px: 3,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(226, 85, 23, 0.1)',
                },
              }}
            >
              Refresh
            </Button>

            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                fontSize: { xs: 14, md: 18 },
                fontWeight: 700,
                borderColor: 'primary.main',
                color: '#000',
                borderWidth: 2,
                px: 3,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(226, 85, 23, 0.1)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Organization Info */}
        {data?.organizer && (
          <Box
            sx={{
              bgcolor: '#90BDF5',
              borderRadius: 4,
              p: 3,
              mb: 4,
            }}
          >
            <Typography
              sx={{
                color: '#000',
                fontSize: { xs: 18, md: 24 },
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              {data.organizer.organizationName}
            </Typography>
            <Typography
              sx={{
                color: '#000',
                fontSize: { xs: 14, md: 16 },
                fontWeight: 600,
              }}
            >
              {data.organizer.organizerEmail}
            </Typography>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
          </Box>
        )}

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
                color: '#000',
                fontSize: { xs: 20, md: 28 },
                fontWeight: 800,
                textTransform: 'uppercase',
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
                  <Grid item xs={12} sm={6} md={4} key={reg.activity.id || index}>
                    <Card
                      sx={{
                        bgcolor: 'secondary.main',
                        borderRadius: '16px',
                        boxShadow: '4px 4px 0 #E25517',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '6px 6px 0 #E25517',
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Typography
                          sx={{
                            color: '#000',
                            fontSize: { xs: 18, md: 20 },
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            mb: 2,
                          }}
                        >
                          {reg.activity.name}
                        </Typography>

                        <Chip
                          label={`${reg.users.length} Registration${reg.users.length !== 1 ? 's' : ''}`}
                          sx={{
                            bgcolor: 'primary.main',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: { xs: 12, md: 14 },
                          }}
                        />
                      </CardContent>

                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleOpenModal(reg)}
                          sx={{
                            bgcolor: 'primary.main',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: { xs: 14, md: 16 },
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: '#D64500',
                            },
                          }}
                        >
                          View Registrants
                        </Button>
                      </Box>
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
            sx={{
              borderRadius: '16px',
              boxShadow: '4px 4px 0 #E25517',
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: 'secondary.main',
              color: '#000',
              fontSize: { xs: 20, md: 24 },
              fontWeight: 800,
              textTransform: 'uppercase',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {selectedEvent?.activity.name}
            <Button
              onClick={handleCloseModal}
              sx={{
                minWidth: 'auto',
                color: '#000',
              }}
            >
              <CloseIcon />
            </Button>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            {/* Search Bar */}
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                gap: 1,
                alignItems: 'center',
              }}
            >
              <SearchIcon sx={{ color: '#666', fontSize: 24 }} />
              <TextField
                fullWidth
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Results Count */}
            <Typography
              sx={{
                color: '#666',
                fontSize: 14,
                mb: 2,
              }}
            >
              {filteredUsers.length} of {selectedEvent?.users.length || 0} registrant{(selectedEvent?.users.length || 0) !== 1 ? 's' : ''}
            </Typography>

            {/* Registrants List */}
            <Stack spacing={2} sx={{ maxHeight: '500px', overflowY: 'auto' }}>
              {filteredUsers.length === 0 ? (
                <Typography
                  sx={{
                    color: '#666',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    py: 4,
                  }}
                >
                  {searchQuery.trim() ? 'No registrants match your search.' : 'No registrants found.'}
                </Typography>
              ) : (
                filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    sx={{
                      bgcolor: '#90BDF5',
                      borderRadius: 2,
                      p: 2,
                      border: '2px solid #E25517',
                    }}
                  >
                    <Stack spacing={1.5}>
                      {/* Name */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: '#000', fontSize: 20 }} />
                        <Typography
                          sx={{
                            color: '#000',
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          {user.firstName} {user.lastName}
                        </Typography>
                      </Box>

                      {/* Email */}
                      {user.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ color: '#000', fontSize: 20 }} />
                          <a
                            href={`mailto:${user.email}`}
                            style={{
                              color: '#000',
                              fontSize: '14px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            {user.email}
                          </a>
                        </Box>
                      )}

                      {/* Phone */}
                      {user.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ color: '#000', fontSize: 20 }} />
                          <a
                            href={`tel:${user.phone}`}
                            style={{
                              color: '#000',
                              fontSize: '14px',
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            {user.phone}
                          </a>
                        </Box>
                      )}

                      {/* Payment ID */}
                      {user.paymentId && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PaymentIcon sx={{ color: '#000', fontSize: 20 }} />
                          <Typography
                            sx={{
                              color: '#000',
                              fontSize: '12px',
                              fontWeight: 600,
                              fontFamily: 'monospace',
                              wordBreak: 'break-all',
                            }}
                          >
                            {user.paymentId}
                          </Typography>
                        </Box>
                      )}
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
                color: '#000',
                '&:hover': {
                  bgcolor: 'rgba(226, 85, 23, 0.1)',
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
    </div>
  );
};

export default AdminDashboardPage;
