import React, { useEffect } from "react";
import { useActivities } from "../hooks/useActivities";

import { Box, Typography, Skeleton } from "@mui/material";
import CTAButton from "../components/CTAButton";

const EventsPage = () => {
  const { activities, loading, error } = useActivities();

  useEffect(() => {
    if (!loading && activities.length > 0) {
      const sorted = [...activities].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0);
        const dateB = new Date(b.date || b.createdAt || 0);
        return dateB - dateA;
      });
      // console.log("Sorted Events:", sorted);
    }
  }, [activities, loading]);

  return (
    <Box sx={{ px: { xs: 2, sm: 6, md: 10 }, py: { xs: 2, md: 14 } }}>
      <Typography
        variant="h1"
        sx={{
          textTransform: "uppercase",
          fontSize: { xs: "13vw", sm: "12vw", md: "12vw" },
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
        Events available for booking
        <span>
          <div className="dot" />
        </span>
      </Typography>
      {loading && (
        <>
          {[...Array(3)].map((_, idx) => (
            <Box key={`skeleton-${idx}`}>
              <Skeleton
                variant="rectangular"
                width="100%"
                animation="wave"
                sx={{
                  height: { xs: 180, sm: 200, md: 300, lg: 400, xl: 600 },
                  my: 2,
                  bgcolor: "grey.300",
                  borderRadius: 4,
                }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                animation="wave"
                sx={{
                  height: { xs: 40, md: 60 },
                  my: 2,
                  bgcolor: "grey.300",
                  borderRadius: 2,
                }}
              />
            </Box>
          ))}
        </>
      )}

      {!loading && !error && activities.length > 0 && (
        <Box>
          {activities.map((activity) => (
            <Box key={activity.slug} sx={{ my: 2 }}>
              <Box
                sx={{
                  overflow: "hidden",
                  borderRadius: { xs: 3, md: 6 },
                  border: { xs: "3px solid #E25517", md: "6px solid #E25517" },
                  height: { xs: 180, sm: 200, md: 300, lg: 400, xl: 600 },
                }}
              >
                <Box
                  component="img"
                  src={activity.imageUrls[0][0]}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Box sx={{ mt: { xs: 2, md: 4 } }}>
                <CTAButton
                  text={activity.name}
                  fontSize={{ xs: 20, md: 30 }}
                  borderRadius={{ xs: 2, md: 4 }}
                  href={`/event/${activity.slug}`}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EventsPage;
