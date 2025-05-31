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

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      height={isMobile ? "auto" : "40vh"}
      width="100%"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      px={isMobile ? 2 : 14}
      position="relative"
      py={isMobile ? 4 : 0}
    >
      <Box width={isMobile ? "40vw" : "20vw"}>
        <Box
          component="img"
          src={logo}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
      <Stack direction="column" gap={isMobile ? 3 : 4} alignItems="flex-start">
        <Typography
          color="#B55725"
          fontSize={isMobile ? "3vw" : "2vw"}
          fontWeight={400}
          sx={{
            lineHeight: 1,
          }}
        >
          Lets create unforgettable <br />
          experiences together.
        </Typography>
        <Stack gap={isMobile ? 0 : 1}>
          <Link
            color="#fff"
            fontSize={isMobile ? "3vw" : "2vw"}
            underline="none"
            fontWeight={800}
            href="tel:7760618621"
          >
            +91 77606 18621
          </Link>
          <Link
            color="#fff"
            fontSize={isMobile ? "3vw" : "2vw"}
            underline="none"
            href="mailto:socialdining.office@gmail.com"
          >
            socialdining.office@gmail.com
          </Link>
        </Stack>
      </Stack>
      <Box
        sx={{
          position: "absolute",
          top: isMobile ? 0 : -40,
          right: isMobile ? 0 : 20,
          backgroundColor: "#B55725",
          borderRadius: "50%",
          width: isMobile ? "7vw" : " 3vw",
          height: isMobile ? "7vw" : "3vw",
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
            fontSize: isMobile ? "5vw" : "2vw",
          }}
        />
      </Box>
    </Stack>
  );
};

export default Footer;
