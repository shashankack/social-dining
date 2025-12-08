import React, { useEffect, useState } from "react";
import { useActivities } from "../hooks/useActivities";

import { Box, Typography, Skeleton, Grid } from "@mui/material";
import CTAButton from "../components/CTAButton";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const { activities, loading, error } = useActivities();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Separate active and completed events
  const activeEvents = activities.filter(
    (activity) => activity.currentStatus !== "completed"
  );
  const completedEvents = activities.filter(
    (activity) => activity.currentStatus === "completed"
  );

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
    <div style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.5s ease" }}>
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
            {/* Active Events Section */}
            {activeEvents.length > 0 && (
              <Box>
                {activeEvents.map((activity) => (
                  <Box key={activity.slug} sx={{ my: 2 }}>
                    <Box
                      sx={{
                        overflow: "hidden",
                        borderRadius: { xs: 3, md: 6 },
                        border: {
                          xs: "3px solid #E25517",
                          md: "6px solid #E25517",
                        },
                        height: { xs: 180, sm: 200, md: 300, lg: 400, xl: 600 },
                      }}
                    >
                      <Box
                        component="img"
                        src={activity.imageUrls[0][0]}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
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

            {/* Completed Events Section */}
            {completedEvents.length > 0 && (
              <Box sx={{ mt: { xs: 6, md: 10 } }}>
                <Typography
                  variant="h1"
                  sx={{
                    textTransform: "uppercase",
                    fontSize: { xs: "13vw", sm: "12vw", md: "12vw" },
                    lineHeight: 1,
                    mb: 2,
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
                  Past Events
                  <span>
                    <div className="dot" />
                  </span>
                </Typography>
                <Grid container spacing={{ xs: 2, md: 4 }}>
                  {completedEvents.map((activity) => (
                    <Grid
                      size={{ xs: 12, md: 3 }}
                      key={activity.slug}
                      sx={{ my: 2 }}
                    >
                      <Link to={`/event/${activity.slug}`}>
                        <Box
                          sx={{
                            overflow: "hidden",
                            borderRadius: { xs: 3, md: 6 },
                            border: {
                              xs: "3px solid #E25517",
                              md: "6px solid #E25517",
                            },
                            height: {
                              xs: 540,
                              sm: 200,
                              md: 300,
                              lg: 400,
                              xl: 600,
                            },
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(.99)",
                              cursor: "pointer",

                              "& img": {
                                transform: "scale(1.02)",
                                filter: "blur(2px)",
                              },
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={activity.imageUrls[0][1]}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "all 0.3s ease",
                            }}
                          />
                        </Box>
                      </Link>
                      <Box sx={{ mt: { xs: 2, md: 2 } }}>
                        <CTAButton
                          text={activity.name}
                          fontSize={{ xs: 20, md: 26 }}
                          borderRadius={{ xs: 2, md: 4 }}
                          href={`/event/${activity.slug}`}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default EventsPage;
