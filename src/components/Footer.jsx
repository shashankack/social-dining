import {
  Stack,
  Box,
  Typography,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import logo from "../assets/images/sd_logo.svg";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const navLinks = [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Cancellation & Refunds", path: "/cancellation-policy" },
    { label: "Terms & Conditions", path: "/terms-and-conditions" },
    { label: "Shipping Policy", path: "/shipping-policy" },
  ];

  return (
    <Stack
      width="100%"
      bgcolor="#000"
      px={isMobile ? 2 : 14}
      py={isMobile ? 6 : 8}
      direction={isMobile ? "column" : "row"}
      justifyContent="space-between"
      alignItems={"center"}
      spacing={isMobile ? 6 : 0}
      position="relative"
      overflow="hidden"
    >
      {/* Logo Section */}
      <Box width={isMobile ? "60vw" : "20vw"}>
        <Box
          component="img"
          src={logo}
          alt="Social Dining Logo"
          sx={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Text + Contact Section */}
      <Stack spacing={3}>
        <Typography
          color="#B55725"
          fontSize={isMobile ? "4vw" : "1.5vw"}
          fontWeight={500}
          lineHeight={1.4}
        >
          Let’s create unforgettable <br />
          experiences together.
        </Typography>

        <Stack spacing={1}>
          <Link
            textAlign={isMobile ? "center" : "left"}
            href="tel:7760618621"
            underline="none"
            color="#fff"
            fontSize={isMobile ? "4vw" : "1.3vw"}
            fontWeight={700}
            sx={{
              transition: "color 0.3s ease",
              "&:hover": { color: "#B55725" },
            }}
          >
            +91 77606 18621
          </Link>
          <Link
            textAlign={isMobile ? "center" : "left"}
            href="mailto:socialdining.office@gmail.com"
            underline="none"
            color="#fff"
            fontSize={isMobile ? "3.5vw" : "1.2vw"}
            sx={{
              transition: "color 0.3s ease",
              "&:hover": { color: "#B55725" },
            }}
          >
            socialdining.office@gmail.com
          </Link>
        </Stack>
      </Stack>

      {/* Policy Links */}
      <Stack spacing={1} mt={isMobile ? 4 : 0}>
        {navLinks.map((link) => (
          <Typography
            key={link.label}
            onClick={() => navigate(link.path)}
            textAlign={isMobile ? "center" : "left"}
            sx={{
              fontSize: isMobile ? "3.5vw" : "1.1vw",
              color: "#fff",
              cursor: "pointer",
              transition: "color 0.3s ease",
              "&:hover": { color: "#B55725" },
              fontWeight: 500,
            }}
          >
            {link.label}
          </Typography>
        ))}
      </Stack>

      {/* Scroll to Top Button */}
      <Box
        sx={{
          position: "absolute",
          bottom: isMobile ? 12 : 24,
          right: isMobile ? 12 : 24,
          width: isMobile ? 48 : 52,
          height: isMobile ? 48 : 52,
          borderRadius: "50%",
          backgroundColor: "#B55725",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#a04b1f",
            transform: "scale(1.1)",
          },
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <KeyboardArrowUpIcon
          sx={{
            fontSize: isMobile ? 24 : 28,
            color: "#fff",
          }}
        />
      </Box>
    </Stack>
  );
};

export default Footer;
