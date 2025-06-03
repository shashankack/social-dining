import { useRef, useEffect, useState } from "react";
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
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useEventsCache } from "../context/EventsCacheContext";
import { fetchEvents } from "../services/eventService";

gsap.registerPlugin(ScrollTrigger);

const UpcomingSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { events, hasLoaded, setEvents, setHasLoaded } = useEventsCache();
  const [ready, setReady] = useState(false);

  const containerRef = useRef(null);
  const imageRefs = useRef([]);

  const addToRefs = (el) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
  };

  const handleEventClick = async (eventId) => {
    try {
      const user = await getCurrentUser();
      if (!user || !user.id) {
        navigate("/login", { state: { from: `/events/${eventId}` } });
        window.scrollTo(0, 0);
        return;
      }
      navigate(`/events/${eventId}`);
      window.scrollTo(0, 0);
    } catch {
      navigate("/login", { state: { from: `/events/${eventId}` } });
      window.scrollTo(0, 0);
    }
  };

  // Load from sessionStorage or fetch if needed
  useEffect(() => {
    const loadData = async () => {
      const cached = sessionStorage.getItem("events");

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setEvents(parsed);
            setHasLoaded(true);
            setReady(true);
            console.log("Loaded from session:", parsed);
            return;
          }
        } catch (err) {
          console.error("Invalid cached events:", err);
        }
      }

      try {
        const { allEvents = [] } = await fetchEvents();
        setEvents(allEvents);
        setHasLoaded(true);
        sessionStorage.setItem("events", JSON.stringify(allEvents));
        console.log("Fetched from API:", allEvents);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setReady(true);
      }
    };

    if (!hasLoaded) loadData();
    else setReady(true);
  }, [hasLoaded, setEvents, setHasLoaded]);

  const now = new Date();
  const upcomingEvents = Array.isArray(events)
    ? events.filter((e) => new Date(e.date) > now)
    : [];

  if (!ready || upcomingEvents.length === 0) {
    return <Box sx={{ minHeight: "100vh", backgroundColor: "#000" }} />;
  }

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
          ref={containerRef}
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
            {upcomingEvents.map((event, index) => (
              <Box
                key={event.id}
                ref={addToRefs}
                component="img"
                src={event.thumbnail}
                onClick={() => handleEventClick(event.id)}
                onMouseEnter={() => {
                  gsap.to(imageRefs.current[index], {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                    onStart: () => (imageRefs.current[index].style.zIndex = 5),
                  });
                }}
                onMouseLeave={() => {
                  gsap.to(imageRefs.current[index], {
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                    onComplete: () =>
                      (imageRefs.current[index].style.zIndex = 1),
                  });
                }}
                sx={{
                  cursor: "pointer",
                  width: 350,
                  height: 400,
                  objectFit: "contain",
                  position: "absolute",
                  left: index === 0 ? "23%" : "47%",
                  transform: index === 0 ? "rotate(-10deg)" : "rotate(7deg)",
                  zIndex: 1,
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
