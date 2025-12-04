import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Alert } from '@mui/material';
import { useOrganizerAuth } from '../hooks/useOrganizerAuth';

const AdminLoginPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated } = useOrganizerAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setFadeIn(true);
  }, []);

  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease' }}>
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: 'secondary.main',
            borderRadius: 6,
            boxShadow: '8px 8px 0 #E25517',
            p: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: '#000',
              fontSize: { xs: 32, md: 48 },
              fontWeight: 900,
              textTransform: 'uppercase',
              mb: 4,
              textAlign: 'center',
            }}
          >
            Admin Login
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: { xs: 10, md: 14 },
                height: { xs: 10, md: 14 },
                borderRadius: '50%',
                bgcolor: 'primary.main',
                ml: 1,
              }}
            />
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="standard"
              sx={{
                mb: 3,
                '& .MuiInput-underline:before': {
                  borderBottom: '2px solid #E25517',
                },
                '& .MuiInput-underline:after': {
                  borderColor: '#E25517',
                },
                '& .MuiInputLabel-root': {
                  color: '#000',
                  fontWeight: 700,
                  fontSize: { xs: 16, md: 20 },
                },
                '& .MuiInputBase-input': {
                  fontSize: { xs: 16, md: 20 },
                  color: '#000',
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="standard"
              sx={{
                mb: 4,
                '& .MuiInput-underline:before': {
                  borderBottom: '2px solid #E25517',
                },
                '& .MuiInput-underline:after': {
                  borderColor: '#E25517',
                },
                '& .MuiInputLabel-root': {
                  color: '#000',
                  fontWeight: 700,
                  fontSize: { xs: 16, md: 20 },
                },
                '& .MuiInputBase-input': {
                  fontSize: { xs: 16, md: 20 },
                  color: '#000',
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{
                fontSize: { xs: 18, md: 28 },
                fontWeight: 800,
                fontFamily: 'League Spartan',
                borderRadius: { xs: 2, md: 4 },
                py: { xs: 1, md: 1.5 },
                textTransform: 'uppercase',
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
    </div>
  );
};

export default AdminLoginPage;
