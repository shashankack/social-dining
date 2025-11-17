import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useOrganizerAuth } from '../hooks/useOrganizerAuth';
import { useOrganizerRegistrations } from '../hooks/useOrganizerRegistrations';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { token, logout, isAuthenticated } = useOrganizerAuth();
  const { data, loading, error } = useOrganizerRegistrations(token);

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
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
              <Stack spacing={2}>
                {data.registrations.map((reg, index) => (
                  <Accordion
                    key={reg.activity.id || index}
                    sx={{
                      bgcolor: 'secondary.main',
                      borderRadius: '16px !important',
                      boxShadow: '4px 4px 0 #E25517',
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': {
                        margin: '0 !important',
                        mb: 2,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main', fontSize: 32 }} />}
                      sx={{
                        '& .MuiAccordionSummary-content': {
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 2,
                        },
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
                        {reg.activity.name}
                      </Typography>
                      <Chip
                        label={`${reg.users.length} Registrations`}
                        sx={{
                          bgcolor: 'primary.main',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: { xs: 12, md: 14 },
                        }}
                      />
                    </AccordionSummary>

                    <AccordionDetails sx={{ pt: 0 }}>
                      {reg.users.length === 0 ? (
                        <Typography sx={{ color: '#666', fontStyle: 'italic' }}>
                          No users registered yet.
                        </Typography>
                      ) : (
                        <Stack spacing={2}>
                          {reg.users.map((user) => (
                            <Box
                              key={user.id}
                              sx={{
                                bgcolor: '#90BDF5',
                                borderRadius: 3,
                                p: 2,
                              }}
                            >
                              <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PersonIcon sx={{ color: '#000', fontSize: 20 }} />
                                  <Typography
                                    sx={{
                                      color: '#000',
                                      fontSize: { xs: 16, md: 18 },
                                      fontWeight: 700,
                                    }}
                                  >
                                    {user.firstName} {user.lastName}
                                  </Typography>
                                </Box>

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
                                      }}
                                    >
                                      {user.email}
                                    </a>
                                  </Box>
                                )}

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
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboardPage;
