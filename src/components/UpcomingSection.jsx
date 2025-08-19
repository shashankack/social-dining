import { useEffect, useState } from "react";
import { Box, Typography, Link, useTheme, useMediaQuery } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";

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

          return;
        }

        const events = await fetchEvents();
        setUpcomingEvents(events);
        sessionStorage.setItem("events", JSON.stringify(events));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchUpcomingEvents();
  }, []);

  return (
    <Box
      overflow="hidden"
      minHeight="100vh"
      sx={{ position: "relative", bgcolor: "#000" }}
      display="flex"
      alignItems={isMobile ? "start" : "center"}
      justifyContent="start"
      flexDirection="column"
      py={10}
      px={2}
    >
      <Typography
        textAlign="center"
        width="100%"
        fontSize={isMobile ? "9vw" : 48}
        fontWeight={800}
        mb={6}
        color="#fff"
      >
        Upcoming Events
        <span>
          <img
            src={dot}
            style={{
              width: isMobile ? "1.5vw" : "6px",
              height: isMobile ? "1.5vw" : "6px",
              marginLeft: "0.5vw",
              objectFit: "contain",
            }}
            alt="dot"
          />
        </span>
      </Typography>

      {isMobile ? (
        <Box
          width="100%"
          sx={{
            "@keyframes swipeRight": {
              "0%": { transform: "translateX(0)" },
              "50%": { transform: "translateX(8px)" },
              "100%": { transform: "translateX(0)" },
            },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
            sx={{
              color: "#B55725",
              fontWeight: 600,
              fontSize: "4vw",
              gap: 1.2,
            }}
          >
            <Typography fontSize="4vw" fontWeight={600}>
              Swipe to explore
            </Typography>
            <Box
              component="svg"
              viewBox="0 0 50 24"
              sx={{
                width: "6vw",
                height: "auto",
                fill: "none",
                stroke: "#B55725",
                strokeWidth: 2,
                animation: "swipeRight 1.4s infinite ease-in-out",
              }}
            >
              <path d="M0 12h44" />
              <path d="M38 6l6 6-6 6" />
            </Box>
          </Box>

          <Swiper
            effect="cards"
            grabCursor
            modules={[EffectCards]}
            style={{ maxWidth: "85%", padding: "2vw 0" }}
          >
            {upcomingEvents.map((event) => (
              <SwiperSlide key={event.id}>
                <Box
                  onClick={() => handleEventClick(event.id)}
                  sx={{
                    width: "100%",
                    height: "60vh",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "3px solid #B55725",
                    boxShadow: 4,
                    cursor: "pointer",
                    backgroundColor: "#111",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={event.thumbnail}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          mt={4}
        >
          <Box
            sx={{
              position: "relative",
              width: "90%",
              height: 500,
              maxWidth: "1300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {upcomingEvents.slice(0, 3).map((event, index) => {
              const offsets = [
                { left: "22%", rotate: "-10deg", zIndex: 1 },
                { left: "38%", rotate: "0deg", zIndex: 2 },
                { left: "54%", rotate: "8deg", zIndex: 1 },
              ];

              const style = offsets[index] || {};

              return (
                <Box
                  key={event.id}
                  component="img"
                  src={event.thumbnail}
                  onClick={() => handleEventClick(event.id)}
                  sx={{
                    width: 320,
                    height: 440,
                    objectFit: "cover",
                    borderRadius: 2,
                    position: "absolute",
                    top: 0,
                    left: style.left,
                    transform: `rotate(${style.rotate})`,
                    transition: "transform 0.3s ease, z-index 0.3s",
                    zIndex: style.zIndex,
                    boxShadow: 4,
                    cursor: "pointer",
                    "&:hover": {
                      transform: `rotate(${style.rotate}) scale(1.05)`,
                      zIndex: 3,
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}

      <Box
        mt={6}
        position="relative"
        sx={{
          "& a": {
            display: "inline-block",
            transition: "all 0.3s ease",
            cursor: "pointer",
            color: "white",
            letterSpacing: "0.05em",
            fontWeight: 600,
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
        <Link underline="none" variant="h5" href="/events">
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
              alt="dot"
            />
          </span>
        </Link>
      </Box>
    </Box>
  );
};

export default UpcomingSection;
