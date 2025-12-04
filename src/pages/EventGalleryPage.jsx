import React, { useEffect, useState } from "react";
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
  const [fadeIn, setFadeIn] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { slug } = useParams();
  // Fetch only the required fields
  const { activity, loading, error } = useActivityDetails(slug, [
    "name",
    "slug",
    "imageUrls",
    "videoUrls",
    "club",
  ]);

  useEffect(() => {
    if (!loading) {
      setFadeIn(true);
    }
  }, [loading]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!activity) return <div>No event found.</div>;

  // Helper function to safely get media items with cycling fallback
  const getMediaItem = (arr, index) => {
    if (!arr || arr.length === 0) return null;
    return arr[index % arr.length]; // Cycle through available items
  };

  // Flatten all images from both arrays
  const allImages = [
    ...(Array.isArray(activity.imageUrls?.[0]) ? activity.imageUrls[0] : []),
    ...(Array.isArray(activity.imageUrls?.[1]) ? activity.imageUrls[1] : []),
  ].filter(Boolean); // Remove any null/undefined values

  // Get videos array
  const allVideos = Array.isArray(activity.videoUrls) 
    ? activity.videoUrls.filter(Boolean)
    : [];

  // Check if there's any media at all
  const hasMedia = allImages.length > 0 || allVideos.length > 0;

  // Prepare media for the layout - uses cycling if not enough media
  const polaroid1 = getMediaItem(allImages, 0);
  const polaroid2 = getMediaItem(allImages, 1);
  
  const video1 = getMediaItem(allVideos, 0);
  const video2 = allVideos.length > 1 ? getMediaItem(allVideos, 1) : null;
  
  // For gallery images, offset by 2 to avoid repeating polaroid images if possible
  const imageOffset = allImages.length > 6 ? 2 : 0;
  const image1 = getMediaItem(allImages, 0 + imageOffset);
  const image2 = getMediaItem(allImages, 1 + imageOffset);
  const image3 = getMediaItem(allImages, 2 + imageOffset);
  const image4 = getMediaItem(allImages, 3 + imageOffset);

  // If no media, show a message
  if (!hasMedia) {
    return (
      <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease' }}>
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
              width: "100%",
              maxWidth: 600,
              mx: "auto",
              my: 8,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                p: 10,
                border: 2,
                fontSize: { xs: "4vw", md: "1.4vw" },
                borderStyle: "dashed",
                borderRadius: 4,
                borderColor: "primary.main",
                color: "#000",
              }}
            >
              No gallery media available! <br />
              Check back later for photos and videos!📸
            </Typography>
          </Box>
        </Stack>
      </div>
    );
  }

  return (
    <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 0.5s ease' }}>
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
        {polaroid1 && (
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
              img={polaroid1}
            />
          </Box>
        )}
        {polaroid2 && (
          <Box
            bottom={"5%"}
            right={{ xs: "5%", md: "10%" }}
            position="absolute"
            sx={{ transform: "rotate(7deg)" }}
          >
            <PolaroidFrame size={isMobile ? 140 : 280} img={polaroid2} />
          </Box>
        )}
      </Box>

      {/* Gallery Layout */}
      <Box
        sx={{ width: "100%", maxWidth: 900, mx: "auto", my: 4 }}
        p={{ xs: 1, md: 0 }}
      >
        <Stack spacing={{ xs: 1, md: 2 }}>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid height={{ xs: 400, md: 650 }} size={6}>
              {video1 ? (
                <Box
                  component="video"
                  src={video1}
                  autoPlay
                  muted
                  loop
                  playsInline
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : image1 ? (
                <Box overflow="hidden" width="100%" height="100%">
                  <Box
                    component="img"
                    src={image1}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              ) : null}
            </Grid>
            <Grid container direction="column" size={6}>
              <Grid height={{ xs: 196, md: 317 }}>
                {image1 && (
                  <Box overflow="hidden" width="100%" height="100%">
                    <Box
                      component="img"
                      src={image1}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid height={{ xs: 196, md: 317 }}>
                {image2 && (
                  <Box overflow="hidden" width="100%" height="100%">
                    <Box
                      component="img"
                      src={image2}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            <Grid container direction="column" size={6}>
              <Grid height={{ xs: 196, md: 317 }}>
                {image3 && (
                  <Box overflow="hidden" width="100%" height="100%">
                    <Box
                      component="img"
                      src={image3}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid height={{ xs: 196, md: 317 }}>
                {image4 && (
                  <Box overflow="hidden" width="100%" height="100%">
                    <Box
                      component="img"
                      src={image4}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
            <Grid height={{ xs: 400, md: 650 }} size={6}>
              {video2 ? (
                <Box
                  component="video"
                  src={video2}
                  autoPlay
                  muted
                  loop
                  playsInline
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : image4 ? (
                <Box overflow="hidden" width="100%" height="100%">
                  <Box
                    component="img"
                    src={image4}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              ) : null}
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Stack>
    </div>
  );
};

export default EventGalleryPage;
