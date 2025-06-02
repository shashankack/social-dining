import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { fetchEvents } from "../services/eventService";
import { getCurrentUser } from "../services/authService";
import { useEventsCache } from "../context/EventsCacheContext";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const { events, setEvents, hasLoaded, setHasLoaded } = useEventsCache();

  const rowRefs = useRef([]);

  useEffect(() => {
    const initEvents = async () => {
      const cached = sessionStorage.getItem("events");

      if (cached) {
        setEvents(JSON.parse(cached));
        setHasLoaded(true);
        return;
      }

      if (!hasLoaded) {
        try {
          const { allEvents = [] } = await fetchEvents();
          setEvents(allEvents);
          setHasLoaded(true);
          sessionStorage.setItem("events", JSON.stringify(allEvents));
          console.log(events);
        } catch (err) {
          console.error("Failed to fetch events:", err);
        }
      }
    };

    initEvents();
  }, [hasLoaded, setEvents, setHasLoaded]);

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

  const handleEventClick = async (eventId) => {
    try {
      const user = await getCurrentUser();
      if (!user || !user.id) {
        navigate("/signup", { state: { from: `/events/${eventId}` } });
        return;
      }
      window.location.href = `/events/${eventId}`;
    } catch (error) {
      navigate("/login", { state: { from: `/events/${eventId}` } });
    }
  };

  if (events.length === 0) {
    return <Box sx={{ minHeight: "100vh", backgroundColor: "#000" }} />;
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
        {events.map((event, index) => (
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
        ))}
      </Grid>
    </Box>
  );
};

export default Events;
