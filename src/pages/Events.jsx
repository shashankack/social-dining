import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../services/eventService";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Loader from "../components/Loader";
import { isAuthenticated } from "../services/authService";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowRefs = useRef([]);

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
    const fetchEventsData = async () => {
      try {
        const cachedEvents = sessionStorage.getItem("events");
        if (cachedEvents) {
          const parsedEvents = JSON.parse(cachedEvents);
          setEvents(parsedEvents);
          setLoading(false);
          return;
        }
        const eventsData = await fetchEvents();
        setEvents(eventsData);
        sessionStorage.setItem("events", JSON.stringify(eventsData));
        setLoading(false);
      } catch (error) {
        console.error("Error parsing cached events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventsData();
  }, []);

  // Scale and fade-in animation
  useEffect(() => {
    const triggers = [];

    rowRefs.current.forEach((el) => {
      if (el) {
        const animation = gsap.fromTo(
          el,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top 80%" : "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
        triggers.push(animation.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((t) => t && t.kill());
    };
  }, [events, isMobile]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box px={isMobile ? 0 : 2} py={8} minHeight="100vh">
      <Typography
        textAlign="center"
        fontSize={isMobile ? "6vw" : "3vw"}
        textTransform="uppercase"
        sx={{
          textDecoration: "underline",
          textDecorationColor: "#B55725",
          textUnderlineOffset: "10px",
          textDecorationThickness: "4px",
        }}
      >
        Events
      </Typography>

      <Grid container mt={isMobile ? 0 : 4} spacing={4} p={4}>
        {events && events.length > 0 ? (
          events.map((event, index) => (
            <Grid
              key={event.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              }}
              ref={(el) => (rowRefs.current[index] = el)}
            >
              <Box
                height="100%"
                onClick={() => handleEventClick(event.id)}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.01)", cursor: "pointer" },
                }}
              >
                <Box
                  component="img"
                  src={event.thumbnail}
                  alt={event.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
          ))
        ) : (
          <Box>No events found.</Box>
        )}
      </Grid>
    </Box>
  );
};

export default Events;
