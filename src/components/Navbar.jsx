import React, { useState } from "react";
import {
  AppBar,
  Stack,
  Button,
  Drawer,
  Link,
  ListItem,
  List,
  Box,
} from "@mui/material";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navLinks = [
    { title: "About Us", href: "/about" },
    { title: "Brand Collaboration", href: "/#" },
    { title: "Events Gallery", href: "/gallery" },
    { title: "Join Clubs", href: "/#" },
    { title: "Contact Us", href: "/#" },
  ];

  const navLinkStyles = {
    color: "background.default",
    textDecoration: "none",
    textTransform: "none",
    fontSize: { xs: "36px", md: "40px" },
    fontWeight: 500,
    borderBottom: 3,
    width: "100%",
  };

  const linkStyles = {
    color: "background.default",
    textTransform: "none",
    fontSize: { xs: "20px", md: "26px" },
    fontWeight: 600,
    p: 0,
    mb: { xs: -1, md: -2 },
  };
  return (
    <AppBar position="static" elevation={0}>
      <Stack
        pt={{ xs: 4, md: 6 }}
        pb={{ xs: 2, md: 4 }}
        px={{ xs: 2, md: 6 }}
        width="100%"
        justifyContent="space-between"
        direction="row"
        alignItems="end"
      >
        <Button variant="text" href="/" sx={linkStyles}>
          Home
        </Button>
        <Box
          component="img"
          src="/images/white_logo.png"
          width={{ xs: 120, md: 150 }}
        />
        <Button
          variant="text"
          onClick={() => setIsDrawerOpen(true)}
          sx={linkStyles}
        >
          Menu
        </Button>
      </Stack>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "primary.main",
            color: "background.default",
            width: { xs: "100%", md: 500 },
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="start"
          p={{ xs: 2, md: 4 }}
          height="100%"
        >
          <List sx={{ width: "100%", mt: 5 }}>
            <Box width="100%" display="flex" justifyContent="flex-end" mb={4}>
              <Button
                sx={{ ...linkStyles, mb: 0 }}
                onClick={() => setIsDrawerOpen(false)}
              >
                Close
              </Button>
            </Box>
            {navLinks.map((link) => (
              <ListItem key={link.title} disableGutters>
                <Link
                  href={link.href}
                  sx={navLinkStyles}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {link.title}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
