import React from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Skeleton,
  Typography,
  Stack,
} from "@mui/material";
import InfiniteMarquee from "../components/InfiniteMarquee";
import CTAButton from "../components/CTAButton";

import { useActivities } from "../hooks/useActivities";

const UpcomingSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { activities, loading } = useActivities({
    currentStatus: "upcoming",
    count: 1,
  });

  return (
    <Stack mt={{ xs: 2, md: 10 }} overflow="hidden">
      <Box mt={{ xs: 2, md: 6 }}>
        <InfiniteMarquee
          text="Upcoming Event"
          color="background.default"
          bgcolor="secondary.main"
          textShadow="4px 4px 0 #E25517"
          fontSize={isMobile ? "2.6rem" : "5rem"}
          height={isMobile ? "70px" : "100px"}
          speed={50}
          rotate={isMobile ? -4 : -2}
        />
      </Box>

      {loading ? (
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="80%"
            height="600px"
            sx={{
              width: "100%",
              height: "60vh",
              bgcolor: "grey.300",
              borderRadius: 6,
              mt: { xs: 2, md: 10 },
            }}
          />
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          px={{ xs: 2, md: 10 }}
          pb={{ xs: 4, md: 8 }}
        >
          {activities.length > 0 ? (
            activities.map((activity) => (
              <Box key={activity.slug} mt={{ xs: 6, md: 10 }}>
                {activity.imageUrls && activity.imageUrls[0] && (
                  <Box
                    p={{ xs: 2, md: 4 }}
                    bgcolor="primary.main"
                    borderRadius={{ xs: 4, md: 6 }}
                  >
                    <Box
                      component="img"
                      src={
                        isMobile
                          ? activity.imageUrls[0][1]
                          : activity.imageUrls[0][0]
                      }
                      alt={activity.name}
                      sx={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: { xs: 4, md: 6 },
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 2,
                        fontSize: { xs: "5vw", md: "4rem" },
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      {activity.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: ".9rem", md: "2rem" },
                        fontWeight: 700,
                        textAlign: "justify",
                      }}
                      dangerouslySetInnerHTML={{ __html: activity.description }}
                    />
                  </Box>
                )}

                <Box mt={{ xs: 3, md: 6 }}>
                  <CTAButton
                    href={`/activities/${activity.slug}`}
                    text="know more"
                    primaryColor="secondary.main"
                    secondaryColor="primary.main"
                    borderRadius={{ xs: 4, md: 6 }}
                    fontSize={{ xs: 20, md: 46 }}
                  />
                </Box>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                minHeight: "60vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
