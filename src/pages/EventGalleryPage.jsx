import React from "react";
import { useParams } from "react-router-dom";
import { useActivityDetails } from "../hooks/useActivities";
import Loader from "../components/Loader";

import {
  Box,
  Grid,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PolaroidFrame from "../components/PolaroidFrame";

const EventGalleryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const activity = {
  //   name: "Sample Event",
  //   slug: "sample-event",
  //   club: "Sample Club",
  //   imageUrls: [
  //     ["/images/gallery/image1.png", "/images/gallery/image2.png"],
  //     [
  //       "/images/gallery/image3.png",
  //       "/images/gallery/image4.png",
  //       "/images/gallery/image5.png",
  //       "/images/gallery/image6.png",
  //     ],
  //   ],
  //   videoUrls: ["/videos/FITNESS.mp4", "/videos/FOUNDERS.mp4"],
  // };
  // const { loading, error } = false;
  const { slug } = useParams();
  // Fetch only the required fields
  const { activity, loading, error } = useActivityDetails(slug, [
    "name",
    "slug",
    "imageUrls",
    "videoUrls",
    "club",
  ]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!activity) return <div>No event found.</div>;

  return (
    <Stack>
      <Box mt={4} mb={2} textAlign="center">
        <Typography
          variant="h1"
          sx={{
            textTransform: "uppercase",
            fontSize: { xs: "13vw", sm: "12vw", md: "10vw" },
            lineHeight: 1,

            "& .dot": {
              display: "inline-block",
              width: { xs: 12, md: "2vw" },
              height: { xs: 12, md: "2vw" },
              borderRadius: "50%",
              backgroundColor: "primary.main",
              marginLeft: { xs: 0.5, md: 1 },
            },
          }}
        >
          {activity.name}
          <span>
            <div className="dot" />
          </span>
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          fontSize={{ xs: 18, md: 30 }}
          mt={{ xs: -1, md: -2 }}
        >
          Hosted by {activity.club}
        </Typography>
      </Box>
      <Box
        sx={{
          mx: "auto",
          maxWidth: 900,
          width: "100%",
          height: { xs: 450, md: 850 },
          position: "relative",
        }}
      >
        <Box
          position="absolute"
          top={{ xs: "-10%", md: "-5%" }}
          left={{ xs: "-10%", md: 0 }}
          zIndex={10}
          sx={{ transform: "rotate(-5deg)" }}
        >
          <PolaroidFrame
            cardBorder
            size={isMobile ? 140 : 270}
            img={activity.imageUrls[1][0]}
          />
        </Box>
        <Box
          bottom={"5%"}
          right={{ xs: "5%", md: "10%" }}
          position="absolute"
          sx={{ transform: "rotate(7deg)" }}
        >
          <PolaroidFrame size={isMobile ? 140 : 280} />
        </Box>
      </Box>

      {/* Gallery Layout */}
      <Box
        sx={{ width: "100%", maxWidth: 900, mx: "auto", my: 4 }}
        p={{ xs: 1, md: 0 }}
      >
        <Stack spacing={{ xs: 1, md: 2 }}>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid height={{ xs: 400, md: 650 }} size={6}>
              <Box
                component="video"
                src={activity.videoUrls[0]}
                controls
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Grid>
            <Grid container direction="column" size={6}>
              <Grid height={{ xs: 196, md: 317 }}>
                <Box overflow="hidden" width="100%" height="100%">
                  <Box
                    component="img"
                    src={activity.imageUrls[1][0]}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </Grid>
              <Grid height={{ xs: 196, md: 317 }}>
                <Box overflow="hidden" width="100%" height="100%">
                  <Box
                    component="img"
                    src={activity.imageUrls[1][1]}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid container direction="column" size={6}>
              <Grid height={{ xs: 196, md: 317 }}>
                <Box overflow="hidden" width="100%" height="100%">
                  <Box
                    component="img"
                    src={activity.imageUrls[1][2]}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </Grid>
              <Grid height={{ xs: 196, md: 317 }}>
                <Box overflow="hidden" width="100%" height="100%">
                  <Box
                    component="img"
                    src={activity.imageUrls[1][3]}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid height={{ xs: 400, md: 650 }} size={6}>
              <Box
                component="video"
                src={activity.videoUrls[1]}
                controls
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Stack>
  );
};

export default EventGalleryPage;
