import GalleryCard from "../components/GalleryCard";
import {
  Box,
  Typography,
  Grid,
  Stack,
  useTheme,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { useActivities } from "../hooks/useActivities";

const GalleryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { activities, loading, error } = useActivities();

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      py={10}
      spacing={{ xs: 2, md: 6 }}
    >
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
        Events gallery
        <span>
          <div className="dot" />
        </span>
      </Typography>

      {loading && (
        <Grid
          container
          spacing={{ xs: 1, md: 6 }}
          width="100%"
          px={{ xs: 2, md: 10 }}
        >
          {[...Array(4)].map((_, idx) => (
            <Grid size={{ xs: 6, md: 3 }} key={idx}>
              <Skeleton
                animation="wave"
                variant="rectangular"
                sx={{
                  height: { xs: 200, md: 400 },
                  bgcolor: "grey.400",
                  borderRadius: 4,
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && error && (
        <Box
          textAlign="center"
          py={10}
          border={2}
          borderColor="primary.main"
          p={4}
          borderRadius={4}
        >
          <Typography variant="h6" color="primary.main">
            There are no events right now☹️. Please check back later!
          </Typography>
        </Box>
      )}

      {activities.length === 0 && !loading && !error && (
        <Box
          sx={{
            minHeight: "30vh",
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
            There is no event gallery available at the moment. <br /> Please
            check back later! 😊
          </Typography>
        </Box>
      )}

      {!loading && !error && (
        <Box width="100%" px={{ xs: 2, md: 6 }}>
          <Grid container spacing={{ xs: 1, md: 6 }} p={2}>
            {activities.map((activity, idx) => (
              <Grid
                size={{ xs: 6, md: 3 }}
                key={activity.slug || idx}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                gap={2}
                alignItems="center"
              >
                <Box component="a" href={`gallery/event/${activity.slug}`}>
                  <GalleryCard
                    size={isMobile ? "40vw" : 350}
                    strokeWidth={5}
                    href
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    fontSize: { xs: "3.6vw", md: "1vw" },
                    lineHeight: 1.1,
                  }}
                >
                  {activity.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  );
};

export default GalleryPage;
