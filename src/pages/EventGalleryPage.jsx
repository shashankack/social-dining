import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useActivityDetails } from "../hooks/useActivities";
import Loader from "../components/Loader";

import { Box, Typography, Stack, useTheme, useMediaQuery } from "@mui/material";
import PolaroidFrame from "../components/PolaroidFrame";
import NewGallery from "../components/NewGallery";

const EventGalleryPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { slug } = useParams();

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

  const polaroid1 = activity.imageUrls?.[1]?.[0];
  const polaroid2 = activity.imageUrls?.[1]?.[1];

  // Prepare media for gallery (exclude imageUrls[0] which are used for polaroids)
  const galleryMedia = React.useMemo(() => {
    // Only use images from imageUrls[1], exclude imageUrls[0]
    const allImages = (
      Array.isArray(activity.imageUrls?.[1]) ? activity.imageUrls[1] : []
    ).filter(Boolean);

    // Get videos array
    const allVideos = Array.isArray(activity.videoUrls)
      ? activity.videoUrls.filter(Boolean)
      : [];

    // Combine images and videos into media array and shuffle
    const imageItems = allImages.map((src) => ({ type: "image", src }));
    const videoItems = allVideos.map((src) => ({ type: "video", src }));

    // Combine and shuffle to randomize video positions
    return [...imageItems, ...videoItems].sort(() => Math.random() - 0.5);
  }, [activity.imageUrls, activity.videoUrls]);

  return (
    <div style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <Stack my={4}>
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
                text={activity.name}
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

        <NewGallery media={galleryMedia} />
      </Stack>
    </div>
  );
};

export default EventGalleryPage;
