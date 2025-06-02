import { useRef, useEffect } from "react";
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

gsap.registerPlugin(ScrollTrigger);

const UpcomingSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const { events, hasLoaded } = useEventsCache();
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
    } catch (err) {
      console.error("Error checking user login:", err);
      navigate("/login", { state: { from: `/events/${eventId}` } });
      window.scrollTo(0, 0);
    }
  };

  // Filter only future events
  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) > now);

  useEffect(() => {
    if (!hasLoaded || upcomingEvents.length === 0) return;

    imageRefs.current.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
        }
      );
    });
  }, [hasLoaded, upcomingEvents]);

  // Wait for cache to load
  if (!hasLoaded || upcomingEvents.length === 0) {
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
        <Grid
          container
          spacing={2}
          height="100%"
          width="100%"
          alignItems="center"
          justifyContent="end"
        >
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

      <Link
        mt={5}
        mr={5}
        textAlign="end"
        underline="none"
        href="/events"
        fontSize={30}
        color="#fff"
      >
        see more
        <span>
          <img
            src={dot}
            style={{ width: "3px", height: "3px", marginLeft: "2px" }}
            alt="dot"
          />
        </span>
      </Link>
    </Box>
  );
};

export default UpcomingSection;
