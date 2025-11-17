import React, { useEffect, useMemo, useState } from "react";
import { formatToIST } from "../lib/dateTimeFormatter";
import { useParams } from "react-router-dom";
import { useActivities, useActivityDetails } from "../hooks/useActivities";
import { Box, Stack, Button, Typography, Grid } from "@mui/material";
import CTAButton from "../components/CTAButton";
import Loader from "../components/Loader";
import { parseHtml } from "../lib/htmlParser";
import EventRegisterDialog from "../components/dialogs/EventRegisterDialog";

const EventDetailsPage = () => {
  const { slug } = useParams();
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  
  const boxStyles = {
    bgcolor: "secondary.main",
    textAlign: "center",
    p: 2,
    fontSize: { xs: "3.8vw", md: "40px" },
    fontWeight: 900,
    pt: 1,
    borderRadius: 4,
  };
  // Fetch details using the slug
  const { activity, loading: detailsLoading, error } = useActivityDetails(slug);

  useEffect(() => {
    if (error) {
      console.error("Error fetching activity details:", error);
    }
  }, [activity, detailsLoading, error]);

  if (detailsLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          Failed to load event details
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {error}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, fontSize: "0.9rem" }}>
          Make sure your backend server is running on{" "}
          {import.meta.env.VITE_API_BASE_URL}
        </Typography>
      </Box>
    );
  }
  if (!activity) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">
          No event details found for "{slug}"
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          The event might not exist or the API might not be responding.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack
      py={{ xs: 6, md: 10 }}
      px={{ xs: 2, md: 6 }}
      spacing={{ xs: 2, md: 4 }}
    >
      <Box
        overflow="hidden"
        borderRadius={{ xs: 4, md: 6 }}
        height={{ xs: 180, sm: 200, md: 300, lg: 400, xl: 600 }}
      >
        <Box
          component="img"
          src={activity.imageUrls?.[0]?.[0] || ""}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Box>
        <Typography
          variant="h1"
          sx={{
            textTransform: "uppercase",
            fontSize: { xs: "10vw", sm: "12vw", md: "7vw" },
            lineHeight: 1,
            "& .dot": {
              display: "inline-block",
              width: { xs: 12, md: "1.4vw" },
              height: { xs: 12, md: "1.4vw" },
              borderRadius: "50%",
              backgroundColor: "primary.main",
              marginLeft: { xs: 0.5, md: 1 },
            },
          }}
        >
          {activity.name || "Event Title"}
          <span>
            <div className="dot" />
          </span>
        </Typography>
        <Typography
          component={"a"}
          variant="h6"
          href={activity.club ? `clubs/${activity.club.slug}` : "#"}
          sx={{
            color: "primary.main",
            textTransform: "uppercase",
            fontSize: { xs: "5vw", sm: "12vw", md: "2vw" },
            textDecoration: "none",
            transition: "all 0.3s ease",
            "&:hover": { color: "secondary.main" },
          }}
        >
          {activity.club?.name || "Club Information"}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 4 }}>
          <Typography sx={boxStyles}>
            Entry Fee{" "}
            {activity.registrationFee
              ? Math.round(activity.registrationFee / 100)
              : "N/A"}
            /-
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Typography sx={boxStyles}>
            {activity.startDateTime
              ? formatToIST(activity.startDateTime)
              : "Date TBA"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Typography sx={boxStyles}>
            {activity.venueName || "Venue TBA"}
          </Typography>
        </Grid>
        <Grid
          size={{ xs: 6, md: 4 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="text"
            disableElevation
            disableRipple
            disableFocusRipple
            sx={{
              position: "relative",
              fontSize: { xs: "1.1rem", md: "2.6rem" },
              fontWeight: 800,
              fontFamily: "League Spartan",
              bgcolor: "transparent",
              transition: "all 0.3s ease",

              "&:hover": { transform: "scale(1.03)" },

              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: { xs: 12, md: 20 },
                width: "100%",
                height: { xs: "2px", md: "4px" },
                backgroundColor: (theme) => theme.palette.secondary.main,
                transform: "scaleX(1)",
                transformOrigin: "center center",
                transition: "transform 0.3s ease",
              },
              "&:hover::after": {
                transform: "scaleX(0)",
              },
            }}
          >
            Open Map
          </Button>
        </Grid>
      </Grid>
      <Box>
        <CTAButton
          text="register"
          primaryColor="primary.main"
          secondaryColor="secondary.main"
          borderRadius={{ xs: 4, md: 4 }}
          fontSize={{ xs: 20, md: 36 }}
          onClick={() => setOpenRegisterDialog(true)}
        />
      </Box>

      <EventRegisterDialog
        open={openRegisterDialog}
        onClose={() => setOpenRegisterDialog(false)}
        activity={activity}
      />
      <Box
        bgcolor="primary.main"
        px={{ xs: 2, md: 4 }}
        py={{ xs: 4, md: 8 }}
        borderRadius={4}
        sx={{
          boxShadow: "6px 6px 0 #90BDF5",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "6vw", md: 40 },
            color: "background.default",
            fontWeight: 600,

            "& span": {
              fontWeight: 400,
              textAlign: "justify",
              fontSize: { xs: 16, md: 20 },
            },
          }}
        >
          About the event <br />
          <span>
            {parseHtml(activity.description, "event-description") ||
              "No description available."}
          </span>
        </Typography>
        <Box width="100%" height={4} bgcolor="secondary.main" my={4} />
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "6vw", md: 40 },
            fontWeight: 600,
            color: "background.default",

            "& span": {
              fontWeight: 400,
              textAlign: "justify",
              fontSize: { xs: 16, md: 20 },

              "& li": {
                ml: 2,
              },
            },
          }}
        >
          Event Details <br />
          <span>
            {parseHtml(activity.additionalInfo, "activity-instructions") ||
              "No additional information available."}
          </span>
        </Typography>
      </Box>
    </Stack>
  );
};

export default EventDetailsPage;
