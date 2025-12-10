import React, { useState } from "react";
import { Box, Typography, Stack, Button, Collapse, useMediaQuery, useTheme } from "@mui/material";

const AboutSection = () => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleReadMore = () => {
    setExpanded(true);
  };

  return (
    <Stack
      spacing={2}
      px={{ xs: 2, md: 6 }}
      pt={{ xs: 2, md: 4 }}
      pb={{ xs: 4, md: 10 }}
      bgcolor="secondary.main"
      mt={10}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          textAlign: { xs: "start", md: "center" },
          fontSize: { xs: "12vw", md: "6rem" },
          fontWeight: 800,
          textShadow: { xs: "3px 3px 0 #D85527", md: "6px 6px 0 #D85527" },
        }}
      >
        About.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: "4.8vw", md: "1.8rem" },
          fontWeight: 600,
          lineHeight: 1.15,
          textAlign: "justify",
        }}
      >
        <strong>
          Social Dining began with a simple idea: to make dining social again.
        </strong>
        <br />
        <br />
        What began as small, intimate dinners has grown into a community built
        on laughter, conversation, and experiences that feel truly special.
        
        {/* Show collapsed content on desktop, or when expanded on mobile */}
        {(!isMobile || expanded) && (
          <>
            <br />
            <br />
            Each event is thoughtfully designed to feel personal and memorable.
            Sometimes it's over a multi-course Vegetarian Omakase, or in a circle of
            founders sharing ideas. Sometimes it's moms taking a well-deserved night
            out or women gathering to inspire and uplift each other. We even come
            together to move, breathe, and celebrate wellness. We offer circles that
            bring people closer through food, culture and shared interests.
            <br />
            <br />
            At social dining, food is only the beginning. The real magic happens in
            connections made, the memories shared and the feeling of being part of
            something close-knit and meaningful.
          </>
        )}
      </Typography>
      
      {/* Collapsible Read More button for mobile */}
      {isMobile && !expanded && (
        <Collapse in={!expanded} timeout={800}>
          <Button
            onClick={handleReadMore}
            sx={{
              color: "primary.main",
              textTransform: "none",
              fontSize: "4.8vw",
              fontWeight: 700,
              padding: 0,
              minWidth: "auto",
              mt: 2,
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Read More →
          </Button>
        </Collapse>
      )}
    </Stack>
  );
};

export default AboutSection;
