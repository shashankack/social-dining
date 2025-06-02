import { useState, useRef, useEffect } from "react";
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
import { fetchEvents } from "../services/eventService";

import event1 from "../assets/images/event1.png";
import event2 from "../assets/images/event2.png";

import dot from "../assets/images/dot.svg";
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const images = [event1, event2];

gsap.registerPlugin(ScrollTrigger);

const UpcomingSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [upcomingEvents, setUpcomingEvents] = useState([]);

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
      // Logged in, so navigate to the event
      navigate(`/events/${eventId}`);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Error checking user login:", err);
      navigate("/login", { state: { from: `/events/${eventId}` } });
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        setUpcomingEvents(data.allEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  return (
    <Box
      overflow="hidden"
      height="100vh"
      sx={{
        position: "relative",
        bgcolor: "#000",
      }}
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
            style={{
              width: "6px",
              height: "6px",
              marginLeft: "4px",
            }}
          />
        </span>
      </Typography>
      {isMobile ? (
        <Grid
          width="100%"
          container
          height="100%"
          spacing={2}
          alignItems="center"
          justifyContent="end"
        >
          {upcomingEvents.map((event, index) => (
            <Grid size={6} key={index}>
              <Box
                component="img"
                src={event.thumbnail}
                sx={{
                  objectFit: "contain",
                }}
                onClick={() => {
                  handleEventClick(event.id);
                  console.log("Event clicked:", event.eventId);
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Desktop view
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
                onMouseEnter={() => {
                  gsap.to(imageRefs.current[index], {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                    zIndex: 5,
                  });
                }}
                onMouseLeave={() => {
                  gsap.to(imageRefs.current[index], {
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                    zIndex: 1,
                  });
                }}
                key={index}
                ref={addToRefs}
                component="img"
                src={event.thumbnail}
                onClick={() => handleEventClick(event.eventId)}
                sx={{
                  cursor: "pointer",
                  width: 350,
                  height: 400,
                  objectFit: "contain",
                  position: "absolute",
                  left: index === 0 ? "23%" : "47%",
                  transform: index === 0 ? "rotate(-10deg)" : "rotate(7deg)",
                  zIndex: index === 0 ? 1 : 1,
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
            style={{
              width: "3px",
              height: "3px",
              marginLeft: "2px",
            }}
          />
        </span>
      </Link>
    </Box>
  );
};

export default UpcomingSection;
