import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { fetchEvents } from "../services/eventService";
import { getCurrentUser } from "../services/authService";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRefs = useRef([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { allEvents = [] } = await fetchEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    if (!loading) {
      rowRefs.current.forEach((el) => {
        if (el) {
          gsap.fromTo(
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
        }
      });
    }
  }, [loading, isMobile]);

  const handleEventClick = async (eventId) => {
    try {
      const user = await getCurrentUser();
      if (!user || !user.id) {
        navigate("/signup", { state: { from: `/events/${eventId}` } });
        return;
      }
      navigate(`/events/${eventId}`);
    } catch (error) {
      navigate("/login", { state: { from: `/events/${eventId}` } });
    }
  };

  if (loading) {
    return (
      <Box
        height="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ bgcolor: "#000" }}
      >
        <CircularProgress sx={{ color: "#B55725" }} />
      </Box>
    );
  }

  return (
    <Box px={isMobile ? 0 : 2} py={8}>
      <Typography
        textAlign="center"
        fontSize="3vw"
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

      <Grid container mt={4} spacing={4} p={4}>
        {events.map((event, index) => (
          <Grid
            item
            key={event.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
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
                src={`https://placehold.co/600x400?text=${encodeURIComponent(
                  event.title
                )}`}
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
