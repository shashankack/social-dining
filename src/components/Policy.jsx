import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import {
  cancellationPolicy,
  privacyPolicy,
  shippingPolicy,
  termsAndConditions,
} from "../assets/policies";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Policy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const path = location.pathname.split("/").pop();

  const policyMap = {
    "privacy-policy": privacyPolicy,
    "cancellation-policy": cancellationPolicy,
    "terms-and-conditions": termsAndConditions,
    "shipping-policy": shippingPolicy,
  };

  const policyData = policyMap[path];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!policyData) {
    return (
      <Box
        bgcolor="#000"
        color="#fff"
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        p={4}
      >
        <Typography variant="h5" fontWeight={600}>
          Policy not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      bgcolor="#000"
      color="#fff"
      minHeight="100vh"
      px={isMobile ? 3 : 12}
      py={8}
    >
      <Typography
        variant={isMobile ? "h4" : "h3"}
        fontWeight={700}
        color="#B55725"
        gutterBottom
      >
        {policyData.title}
      </Typography>

      <Typography
        variant="body1"
        textAlign="justify"
        lineHeight={1.8}
        fontSize={isMobile ? "3.2vw" : "1.1vw"}
        sx={{
          a: {
            color: "#B55725",
            textDecoration: "underline",
          },
        }}
        dangerouslySetInnerHTML={{ __html: policyData.description }}
      />
    </Box>
  );
};

export default Policy;
