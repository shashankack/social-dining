import { Box, Typography, Container, Button, Stack } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, useEffect } from "react";

const PaymentSuccessPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Get payment details from URL params
  const paymentId = searchParams.get("payment_id");
  const orderId = searchParams.get("order_id");
  const signature = searchParams.get("signature");

  return (
    <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease' }}>
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: "secondary.main",
            borderRadius: 6,
            boxShadow: "8px 8px 0 #E25517",
            p: { xs: 4, md: 8 },
            textAlign: "center",
          }}
        >
          {/* Success Icon */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: 80, md: 120 },
              height: { xs: 80, md: 120 },
              borderRadius: "50%",
              bgcolor: "primary.main",
              mb: 3,
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)", opacity: 1 },
                "50%": { transform: "scale(1.05)", opacity: 0.9 },
              },
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: { xs: 50, md: 80 },
                color: "#fff",
              }}
            />
          </Box>

          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              color: "#000",
              fontSize: { xs: 32, md: 56 },
              fontWeight: 900,
              textTransform: "uppercase",
              mb: 2,
              letterSpacing: "0.02em",
            }}
          >
            Payment Successful
            <span>
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
            </span>
          </Typography>

          {/* Subtext */}
          <Typography
            sx={{
              color: "text.primary",
              fontSize: { xs: 16, md: 22 },
              fontWeight: 600,
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Your registration has been confirmed! 🎉
            <br />
            Thank you for registering, we look forward to seeing you at the venue 😊.
          </Typography>

          {/* Payment Details */}
          <Box
            sx={{
              bgcolor: "#90BDF5",
              borderRadius: 4,
              p: 3,
              mb: 4,
              textAlign: "left",
            }}
          >
            <Typography
              sx={{
                color: "#000",
                fontSize: { xs: 14, md: 18 },
                fontWeight: 700,
                mb: 2,
                textTransform: "uppercase",
              }}
            >
              Transaction Details
            </Typography>
            <Stack spacing={1.5}>
              {orderId && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    sx={{ color: "#000", fontSize: { xs: 12, md: 16 }, fontWeight: 600 }}
                  >
                    Order ID:
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000",
                      fontSize: { xs: 12, md: 16 },
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    {orderId.substring(0, 20)}...
                  </Typography>
                </Box>
              )}
              {paymentId && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    sx={{ color: "#000", fontSize: { xs: 12, md: 16 }, fontWeight: 600 }}
                  >
                    Payment ID:
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000",
                      fontSize: { xs: 12, md: 16 },
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    {paymentId.substring(0, 20)}...
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{ color: "#000", fontSize: { xs: 12, md: 16 }, fontWeight: 600 }}
                >
                  Status:
                </Typography>
                <Typography
                  sx={{
                    color: "primary.main",
                    fontSize: { xs: 12, md: 16 },
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                >
                  ✓ Confirmed
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
              sx={{
                fontSize: { xs: 18, md: 28 },
                fontWeight: 800,
                fontFamily: "League Spartan",
                borderRadius: { xs: 2, md: 4 },
                py: { xs: 1, md: 1.5 },
                px: { xs: 3, md: 5 },
                textTransform: "uppercase",
              }}
            >
              Go to Home
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/events")}
              sx={{
                fontSize: { xs: 18, md: 28 },
                fontWeight: 800,
                fontFamily: "League Spartan",
                borderRadius: { xs: 2, md: 4 },
                py: { xs: 1, md: 1.5 },
                px: { xs: 3, md: 5 },
                textTransform: "uppercase",
                borderColor: "primary.main",
                borderWidth: { xs: 2, md: 3 },
                color: "#000",
                "&:hover": {
                  borderWidth: { xs: 2, md: 3 },
                  borderColor: "primary.main",
                  bgcolor: "rgba(226, 85, 23, 0.1)",
                },
              }}
            >
              View All Events
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
    </div>
  );
};

export default PaymentSuccessPage;
