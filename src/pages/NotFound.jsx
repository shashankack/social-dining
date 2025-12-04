import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <Box
        sx={{
          minHeight: "80vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 80, md: 120 },
                fontWeight: 900,
                color: "primary.main",
                lineHeight: 1,
              }}
            >
              404
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 32, md: 48 },
                fontWeight: 800,
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              Page Not Found
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 16, md: 20 },
                mb: 4,
                color: "text.secondary",
              }}
            >
              The page you're looking for doesn't exist.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
              sx={{
                fontSize: { xs: 18, md: 24 },
                fontWeight: 800,
                fontFamily: "League Spartan",
                borderRadius: 4,
                py: 1.5,
                px: 4,
              }}
            >
              Go to Home
            </Button>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default NotFound;
