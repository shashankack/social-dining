import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import dot from "../assets/images/dot.svg";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../services/eventService";
import { isAuthenticated } from "../services/authService";

gsap.registerPlugin(ScrollTrigger);

const UpcomingSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const handleEventClick = (eventId) => {
    if (isAuthenticated()) {
      navigate(`/events/${eventId}`);
      window.scrollTo(0, 0);
    } else {
      navigate("/login", {
        state: { from: `/events/${eventId}` },
      });
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const cachedEvents = localStorage.getItem("events");

        if (cachedEvents) {
          const parsedEvents = JSON.parse(cachedEvents);
          setUpcomingEvents(parsedEvents);
          console.log("Using cached events:", parsedEvents);
          return;
        }

        const events = await fetchEvents();
        setUpcomingEvents(events);
        localStorage.setItem("events", JSON.stringify(events));
        console.log("Fetched and cached events:", events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchUpcomingEvents();
  }, []);

  return (
    <Box
      overflow="hidden"
      height="100vh"
      sx={{ position: "relative", bgcolor: "#000" }}
      display="flex"
      alignItems={isMobile ? "start" : "center"}
      justifyContent="start"
      flexDirection="column"
      py={10}
      px={2}
    >
      <Typography
        textAlign={isMobile ? "start" : "center"}
        width="100%"
        fontSize={40}
        fontWeight={700}
        mb={5}
      >
        Upcoming Events
        <span>
          <img
            src={dot}
            style={{ width: "6px", height: "6px", marginLeft: "4px" }}
            alt="dot"
          />
        </span>
      </Typography>

      {isMobile ? (
        <Grid container spacing={2} width="100%" alignItems="center">
          {upcomingEvents.map((event) => (
            <Grid item xs={6} key={event.id}>
              <Box
                component="img"
                src={event.thumbnail}
                sx={{ objectFit: "contain", width: "100%" }}
                onClick={() => handleEventClick(event.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          width="100%"
          overflow="hidden"
        >
          <Box
            width="100%"
            maxWidth="1200px"
            mt={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            height={500}
          >
            {upcomingEvents.slice(0, 2).map((event, index) => (
              <Box
                key={event.id}
                component="img"
                src={event.thumbnail}
                onClick={() => handleEventClick(event.id)}
                sx={{
                  cursor: "pointer",
                  width: 350,
                  height: 400,
                  objectFit: "contain",
                  position: "absolute",
                  left: index === 0 ? "23%" : "47%",
                  transform: index === 0 ? "rotate(-10deg)" : "rotate(7deg)",
                  transition: "transform 0.3s ease",
                  zIndex: 1,
                  "&:hover": {
                    transform:
                      index === 0
                        ? "rotate(-10deg) scale(1.03)"
                        : "rotate(7deg) scale(1.03)",
                    zIndex: 2,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box
        position="relative"
        sx={{
          "& a": {
            display: "inline-block",
            transition: "all 0.3s ease",
            cursor: "pointer",
            color: "white",
            letterSpacing: "0.05em",
          },
          "& a:before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "3px",
            backgroundColor: "#B55725",
            bottom: -2,
            transform: "scaleX(1)",
            transition: "transform 0.3s ease",
          },
          "& a:hover:before": {
            transform: "scaleX(0)",
          },
          "& a:hover": {
            transform: "scale(1.05)",
            color: "#B55725",
          },
        }}
      >
        <Link underline="none" variant="h5" fontWeight={600} href="/events">
          see more{" "}
          <span>
            <img
              src={dot}
              style={{
                height: "6px",
                width: "6px",
                marginLeft: "-4px",
                objectFit: "contain",
              }}
            />
          </span>
        </Link>
      </Box>
    </Box>
  );
};

export default UpcomingSection;
