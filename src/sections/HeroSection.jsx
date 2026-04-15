import React from "react";
import { Box, Typography, Stack, useTheme, useMediaQuery } from "@mui/material";

import PolaroidFrame from "../components/PolaroidFrame";
import CTAButton from "../components/CTAButton";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      px={{ xs: 2, md: 6 }}
      pt={{ xs: 2.5, md: 5 }}
      pb={{ xs: 4, md: 6 }}
      alignItems="center"
    >
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: { xs: 4, md: 10 },
          height: { xs: 200, sm: 300, md: 400 },
          width: "100%",
        }}
      >
        <Box
          component="video"
          src="/videos/hero.mp4"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          autoPlay
          muted
          loop
          playsInline
        />
      </Box>

      {isMobile ? (
        <Stack mt={4} position="relative" width="100%">
          <Typography
            variant="h1"
            sx={{
              textTransform: "uppercase",
              fontSize: { xs: "28vw", sm: "10vw", md: "2vw" },
              lineHeight: 0.9,
            }}
          >
            Close <br /> Knit <br /> Club
          </Typography>
          <Box
            position="absolute"
            top={{ xs: -10, sm: 0 }}
            right={{ xs: "10%", sm: "10%" }}
            sx={{
              transform: "rotate(-15deg)",
            }}
          >
            <PolaroidFrame
              size={isMobile ? 130 : 170}
              boxShadow="-4px 4px 5px #0000006f"
              cardBorder
            />
          </Box>
        </Stack>
      ) : (
        <Stack mt={6} direction="row" alignItems="center">
          <Typography
            variant="h1"
            sx={{
              textTransform: "uppercase",
              fontSize: { md: "15vw" },
              lineHeight: 0.9,
            }}
          >
            Close Knit Club
          </Typography>
        </Stack>
      )}
      <Stack width="100%" mt={4} px={{ xs: 0, md: 6 }} gap={3}>
        <CTAButton
          href="/events"
          text="Click to book event"
          borderRadius={{ xs: 2, md: 4 }}
          fontSize={isMobile ? "1.15rem" : "1.95rem"}
        />

        <Typography
          variant="body1"
          sx={{
            color: "primary.main",
            fontSize: {
              xs: "1.1rem",
              md: "2rem",
            },
            fontWeight: 800,
            lineHeight: 1.1,
            textAlign: { xs: "justify", md: "left" },
          }}
        >
          The tiny dot in our logo isn’t just a design choice, it’s our ethos.
          It represents the close-knit, meaningful circles we create. Small in
          size, rich in depth. That’s what makes Social Dining unique.
        </Typography>
      </Stack>
    </Stack>
  );
};

export default HeroSection;
