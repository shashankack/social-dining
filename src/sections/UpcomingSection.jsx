import React from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Skeleton,
  Typography,
  Stack,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import InfiniteMarquee from "../components/InfiniteMarquee";
import CTAButton from "../components/CTAButton";

import { useActivities } from "../hooks/useActivities";

const UpcomingSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const { activities, loading, error } = useActivities({
    currentStatus: "upcoming",
    count: 4,
    sortBy: "startDateTime",
    order: "asc", // Ascending order to get the closest upcoming events
    skipCache: true,
  });

  const getGridColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  return (
    <Stack mt={{ xs: 2, md: 10 }} overflow="hidden">
      <Box mt={{ xs: 2, md: 6 }}>
        <InfiniteMarquee
          text="Upcoming Events"
          color="background.default"
          bgcolor="secondary.main"
          textShadow="4px 4px 0 #E25517"
          fontSize={isMobile ? "2rem" : "3.6rem"}
          height={isMobile ? "58px" : "84px"}
          speed={50}
          rotate={isMobile ? -4 : -2}
        />
      </Box>

      {loading ? (
        <Box
          display="grid"
          gridTemplateColumns={`repeat(${getGridColumns()}, 1fr)`}
          gap={{ xs: 2, md: 4 }}
          px={{ xs: 2, md: 10 }}
          py={{ xs: 4, md: 8 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              animation="wave"
              width="100%"
              height="400px"
              sx={{
                borderRadius: 6,
              }}
            />
          ))}
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          px={{ xs: 2, md: 10 }}
          pb={{ xs: 4, md: 8 }}
        >
          {error ? (
            <Box
              sx={{
                minHeight: "60vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  p: 10,
                  border: 2,
                  fontSize: { xs: "4vw", md: "1.4vw" },
                  borderStyle: "dashed",
                  borderRadius: 4,
                  borderColor: "error.main",
                  color: "#000",
                }}
              >
                Could not load the upcoming events. <br />
                {error}
              </Typography>
            </Box>
          ) : activities.length > 0 ? (
            <Box
              display="grid"
              gridTemplateColumns={`repeat(${getGridColumns()}, 1fr)`}
              gap={{ xs: 2, md: 4 }}
              width="100%"
              mt={{ xs: 4, md: 8 }}
            >
              {activities.map((activity) => (
                <Box
                  key={activity.slug}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "primary.main",
                      borderRadius: { xs: 4, md: 6 },
                      overflow: "hidden",
                      border: `3px solid ${theme.palette.secondary.main}`,
                      position: "relative",
                    }}
                  >
                    {activity.imageUrls && activity.imageUrls[0] && (
                      <CardMedia
                        component="img"
                        height={isMobile ? "200" : "250"}
                        image={
                          isMobile
                            ? activity.imageUrls[0][1]
                            : activity.imageUrls[0][0]
                        }
                        alt={activity.name}
                        sx={{
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: { xs: 2, md: 3 },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: "1.3rem", md: "1.5rem" },
                          fontWeight: 800,
                          textTransform: "uppercase",
                          mb: 1,
                          color: "#000",
                          lineHeight: 1.2,
                        }}
                      >
                        {activity.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: "0.85rem", md: "0.95rem" },
                          fontWeight: 700,
                          mb: 2,
                          color: "rgba(0, 0, 0, 0.7)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textAlign: "justify",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: activity.description.substring(0, 150) + "...",
                        }}
                      />

                      <Box
                        sx={{
                          mt: "auto",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <CTAButton
                          href={`/event/${activity.slug}`}
                          text="know more"
                          primaryColor="secondary.main"
                          secondaryColor="primary.main"
                          borderRadius={{ xs: 3, md: 4 }}
                          fontSize={{ xs: 14, md: 16 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                minHeight: "60vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  p: 10,
                  border: 2,
                  fontSize: { xs: "4vw", md: "1.4vw" },
                  borderStyle: "dashed",
                  borderRadius: 4,
                  borderColor: "primary.main",
                  color: "#000",
                }}
              >
                No upcoming events! <br />
                Our host is resting. Check back later!😊
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Stack>
  );
};

export default UpcomingSection;
