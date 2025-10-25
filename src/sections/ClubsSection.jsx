import { useEffect, useRef } from "react";
import { useClubs } from "../hooks/useClubs";
import { Box, Stack, Typography } from "@mui/material";
import CTAButton from "../components/CTAButton";

const ClubsSection = () => {
  const sectionRef = useRef(null);
  const { clubs, loading, error } = useClubs();

  return (
    <Box ref={sectionRef} overflow="hidden">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="end"
        width="100%"
        mx={{ xs: 2, md: 14 }}
        mt={6}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#000",
            fontWeight: 800,
            fontSize: { xs: 60, md: 70 },

            "& .dot": {
              display: "inline-block",
              width: { xs: 12, md: 20 },
              height: { xs: 12, md: 20 },
              borderRadius: "50%",
              backgroundColor: "primary.main",
              marginLeft: { xs: 0.5, md: 1 },
            },
          }}
        >
          Clubs
          <span>
            <div className="dot" />
          </span>
        </Typography>
        <Box
          sx={{
            bgcolor: "secondary.main",
            height: { xs: 3, md: 4 },
            borderRadius: 10,
            width: { xs: "55%", sm: "65%", md: "80%" },
            mb: { xs: 4, md: 5 },
          }}
        />
      </Stack>
      <Box
        sx={{
          overflowX: "auto",
          width: "100%",
          px: { xs: 2, md: 0 },
          whiteSpace: "nowrap",
          display: "flex",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 2, md: 6 }}
          mx="auto"
          mt={0}
          mb={{ xs: 4, md: 6 }}
          sx={{
            flexWrap: "nowrap",
            minWidth: "max-content",
          }}
        >
          {loading && <Typography>Loading clubs...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {clubs &&
            clubs.length > 0 &&
            clubs.map((club, idx) => (
              <Box
                key={club.id || idx}
                className="video-card"
                component="a"
                href={club.slug ? `/${club.slug}` : "#"}
                sx={{
                  position: "relative",
                  width: { xs: 200, md: 300 },
                  height: { xs: 600, md: 800 },
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  borderRadius: 6,
                  boxShadow: { xs: "none", md: "6px 6px 0px #90BDF5" },

                  "@media (hover: hover)": {
                    "&:hover": {
                      transform: "scale(.98)",
                      boxShadow: "none",

                      "& .video-title": {
                        right: -120,
                      },

                      "& video": {
                        filter: "brightness(.6) blur(3px)",
                        transform: "scale(1.05)",
                      },
                    },
                  },
                }}
              >
                <Box
                  className="video-title"
                  sx={{
                    width: "100%",
                    position: "absolute",
                    bottom: { xs: 110, md: 140 },
                    right: { xs: -70, md: "-100%" },
                    zIndex: 40,
                    transform: "rotate(-90deg)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "start",
                      fontWeight: 800,
                      fontSize: { xs: 30, md: 44 },
                      color: "background.default",
                    }}
                  >
                    {club.name}
                  </Typography>
                </Box>

                {club.videoUrls && club.videoUrls[0] && (
                  <Box
                    component="video"
                    src={club.videoUrls[0]}
                    playsInline
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "all 0.3s ease",
                      // Mobile: video darker and blurred by default (hover state shown)
                      // Desktop: normal by default
                      filter: { xs: "brightness(.6) blur(3px)", md: "none" },
                      transform: { xs: "scale(1.05)", md: "scale(1)" },
                    }}
                  />
                )}
              </Box>
            ))}
        </Stack>
      </Box>
      <Box px={{ xs: 2, md: 14 }} pb={2}>
        <CTAButton
          text="join clubs"
          primaryColor="primary.main"
          secondaryColor="secondary.main"
          borderRadius={{ xs: 6, md: 8 }}
          fontSize={{ xs: 26, md: 46 }}
        />
      </Box>
    </Box>
  );
};

export default ClubsSection;
