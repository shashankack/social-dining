import {
  AppBar,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const currentPath = location.pathname;

  const [drawerOpen, setDrawerOpen] = useState(false);

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
    cursor: "pointer",
  };

  const handleNavigate = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const logoutButton = (
    <Typography
      onClick={() => {
        localStorage.removeItem("authToken");
        navigate("/login");
      }}
      sx={{
        ...navLinkStyles,
        display: "flex",
        alignItems: "center",
        gap: 1,
        border: 2,
        borderRadius: 2,
        borderColor: "#B55725",
        color: "#fff",
        fontWeight: 600,
        fontSize: ".8rem",
        px: 2,
        py: 0.5,
        transition: "all 0.3s ease",
        "&:hover": {
          color: "#B55725",
        },
      }}
    >
      <LogoutIcon fontSize="small" />
      Logout
    </Typography>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "transparent",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          mixBlendMode: "exclusion",
          px: isMobile ? 2 : 4,
          py: 3,
        }}
      >
        {isMobile ? (
          <>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: "#fff", fontSize: 30 }} />
            </IconButton>
            {logoutButton}
          </>
        ) : (
          <>
            <Box display="flex" flexDirection="row" gap={4}>
              {navItems.map((item) => (
                <Typography
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  sx={{
                    ...navLinkStyles,
                    color:
                      currentPath === item.path
                        ? "#B55725"
                        : navLinkStyles.color,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#B55725",
                    },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
            {logoutButton}
          </>
        )}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 280,
            height: "100%",
            background: "linear-gradient(160deg, #000 0%, #111 100%)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            py: 3,
            px: 2,
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              fontWeight={700}
              fontSize="1.4rem"
              color="#fff"
              fontFamily="League Spartan"
            >
              Social Dining
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

          {/* Nav Links */}
          <List sx={{ mt: 4 }}>
            {navItems.map((item) => (
              <ListItem
                key={item.label}
                disableGutters
                onClick={() => handleNavigate(item.path)}
                sx={{
                  py: 1,
                  px: 1,
                  borderLeft:
                    currentPath === item.path
                      ? "4px solid #B55725"
                      : "4px solid transparent",
                  backgroundColor:
                    currentPath === item.path ? "#111" : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#1a1a1a",
                    borderLeft: "4px solid #B55725",
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "1.1rem",
                    color: "#fff",
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Logout Button */}
          <Box textAlign="center" mt="auto">
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                localStorage.removeItem("authToken");
                navigate("/login");
              }}
              sx={{
                borderColor: "#B55725",
                color: "#B55725",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#B55725",
                  color: "#000",
                },
              }}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
