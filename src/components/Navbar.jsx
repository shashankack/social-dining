import {
  AppBar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/?scrollTo=about" },
    { label: "Events", path: "/events" },
    { label: "Clubs", path: "/?scrollTo=clubs" },
  ];

  const navLinkStyles = {
    textDecoration: "none",
    color: "#fff",
    fontWeight: 500,
    mixBlendMode: "difference",
    fontSize: isMobile ? "5vw" : "1.2vw",
  };

  return (
    <AppBar
      elevation={0}
      sx={{
        bgcolor: "transparent",
        display: "flex",
        flexDirection: "row",
        justifyContent: isMobile ? "space-between" : "start",
        alignItems: "center",
        mixBlendMode: "exclusion",
        gap: 4,
        px: isMobile ? 2 : 4,
        py: 4,
      }}
    >
      {navItems.map((item) => (
        <Typography
          key={item.label}
          component="span"
          onClick={() => {
            navigate(item.path);
          }}
          sx={{
            ...navLinkStyles,
            color: currentPath === item.path ? "#B55725" : "white",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "#B55725",
            },
            cursor: "pointer",
          }}
        >
          {item.label}
        </Typography>
      ))}
    </AppBar>
  );
};

export default Navbar;
