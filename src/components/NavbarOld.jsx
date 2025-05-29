import { useLocation, Link as RouterLink } from "react-router-dom";
import {
  Box,
  AppBar,
  Typography,
  Stack,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import logo from "../assets/images/logo.png";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [hasPlayed] = useState(sessionStorage.getItem("hasPlayed"));
  const currentPath = location.pathname;
  const navbarRef = useRef(null);

  const logoRef = useRef(null);
  const stackRef = useRef(null);

  useEffect(() => {
    if (hasPlayed === "true") return;

    const tl = gsap.timeline({ defaults: { duration: 0.5 } });
    tl.fromTo(
      navbarRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, ease: "power2.out", delay: 3 }
    );
  }, [hasPlayed]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Events", path: "/events" },
    { label: "Clubs", path: "/clubs" },
  ];

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (window.scrollY > 600) {
        gsap.to(logoRef.current, {
          yPercent: -300,
          duration: 0.3,
          ease: "power1.out",
        });
        gsap.to(stackRef.current, {
          y: -70,
          duration: 0.3,
          ease: "power1.out",
        });
      } else {
        gsap.to(logoRef.current, {
          yPercent: 0,
          duration: 0.3,
          ease: "power1.out",
        });
        gsap.to(stackRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const underLineStyle = {
    position: "relative",
    color: "white",

    fontWeight: 600,
    display: "flex",
    alignItems: "center",

    "&::after": {
      content: '""',
      position: "absolute",
      bottom: -1,
      left: 0,
      width: "100%",
      height: "1px",
      backgroundColor: "#B55725",
      transform: "scaleX(0)",
      transformOrigin: "right",
      transition: "transform 0.3s ease",
    },

    "&:hover::after": {
      transformOrigin: "left",
      transform: "scaleX(1)",
    },
  };

  return isMobile ? (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        mixBlendMode: "exclusion",
        py: 2,
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box component="img" src={logo} width={100} ref={logoRef} />
        <Stack
          ref={stackRef}
          direction="row"
          mt={4}
          spacing={5}
          position="sticky"
          top={10}
          left={0}
        >
          {navItems.map((item) => (
            <Box key={item.path} sx={underLineStyle}>
              <Link
                component={RouterLink}
                to={item.path}
                underline="none"
                sx={{
                  color: currentPath === item.path ? "#B55725" : "white",
                }}
              >
                {item.label}
              </Link>
            </Box>
          ))}
        </Stack>
      </Box>
    </AppBar>
  ) : (
    <AppBar
      ref={navbarRef}
      position="fixed"
      elevation={0}
      color="transparent"
      sx={{
        zIndex: 1,
        height: "60px",
        mixBlendMode: "exclusion",
        px: 3,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box width={150}>
        <Typography
          variant="h4"
          fontWeight={800}
          letterSpacing={-2}
          lineHeight={0.9}
          textAlign="center"
          sx={{
            mixBlendMode: "exclusion",
            "& span": { textTransform: "uppercase", letterSpacing: -3 },
          }}
        >
          social <br /> <span>dining.</span>
        </Typography>
      </Box>

      <Stack direction="row" alignItems="center" spacing={1.5} ml={45}>
        {navItems.map((item) => (
          <Box key={item.path} sx={underLineStyle}>
            <Link
              component={RouterLink}
              to={item.path}
              underline="none"
              sx={{
                color: currentPath === item.path ? "#B55725" : "white",
              }}
            >
              {item.label}
            </Link>
          </Box>
        ))}
      </Stack>

      <Box overflow="hidden" position="relative">
        <Link
          underline="none"
          to="/contact-us"
          component={RouterLink}
          sx={{
            ...underLineStyle,
            color: "white",
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            "& .arrow-icon1, & .arrow-icon2": {
              position: "absolute",
              right: 0,
              transition: "transform 0.3s ease",
            },
            "& .arrow-icon1": {
              transform: "translate(0, 0)",
            },
            "& .arrow-icon2": {
              transform: "translate(-15px, 15px)",
            },
            "&:hover .arrow-icon1": {
              transform: "translate(15px, -15px)",
            },
            "&:hover .arrow-icon2": {
              transform: "translate(0, 0)",
            },
          }}
        >
          Let's talk
          <Box sx={{ position: "relative", width: 16, height: 16 }}>
            <ArrowOutwardIcon className="arrow-icon1" sx={{ fontSize: 16 }} />
            <ArrowOutwardIcon className="arrow-icon2" sx={{ fontSize: 16 }} />
          </Box>
        </Link>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "1px",
            backgroundColor: "white",
            transform: "scaleX(0)",
            transformOrigin: "right",
            transition: "transform 0.3s ease",
            pointerEvents: "none",
            ".MuiLink-root:hover + &": {
              transform: "scaleX(1)",
              transformOrigin: "left",
            },
          }}
        />
      </Box>
    </AppBar>
  );
};

export default Navbar;
