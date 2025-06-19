import {
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import dot from "../assets/images/dot.svg";
import EventRegister from "./Forms/EventRegister";
import { fetchEventById, fetchEvents } from "../services/eventService";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import ScrollTrigger from "gsap/ScrollTrigger";

import { getCurrentUser } from "../services/authService";

gsap.registerPlugin(ScrollTrigger);

const EventsInternal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [otherEvents, setOtherEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWomenFounder, setIsWomenFounder] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const containerRef = useRef(null);
  const textGroupRef = useRef([]);
  const imageRef = useRef(null);

  useEffect(() => {
    const loadOtherEvents = async () => {
      try {
        const events = await fetchEvents();
        const filtered = events.filter((e) => e.id !== id);
        setOtherEvents(filtered);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    // Fetch the main event by its ID
    const loadEvent = async () => {
      try {
        const event = await fetchEventById(id);
        setData(event);
        if (id === "cmc2yf9zb00013u0vljst8plq") {
          setIsWomenFounder(true);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
      }
    };

    loadEvent();
    loadOtherEvents();
  }, [id]);

  useEffect(() => {
    if (!data) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      textGroupRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        delay: 0.6,
      }
    );

    tl.fromTo(
      imageRef.current,
      { yPercent: -400, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "back.out(.8)",
      },
      "-=1.7"
    );

    return () => {
      gsap.killTweensOf(textGroupRef.current);
      gsap.killTweensOf(imageRef.current);
    };
  }, [data]);

  if (data === null) {
    return <Box sx={{ minHeight: "100vh", backgroundColor: "#000" }} />;
  }

  const eventDate = new Date(data.date);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Check if the token exists and the user is authenticated
  const checkAuthentication = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login", { state: { from: `/events/${id}` } });
      return false;
    }

    return true;
  };

  const handleEventRegistration = () => {
    if (!checkAuthentication()) return;
    setOpen(true); // Just open modal
  };

  return (
    <Stack
      ref={containerRef}
      my={isMobile ? 0 : 4}
      minHeight="100vh"
      flexDirection="column-reverse"
      justifyContent="center"
      alignItems="start"
      padding={isMobile ? 2 : 4}
      gap={isMobile ? 2 : 4}
    >
      <Accordion
        sx={{
          width: "100%",
          mt: 4,
          bgcolor: "#000",
          color: "#fff",
          border: "4px solid #B55725",
          boxShadow: "none",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#B55725" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography fontSize={isMobile ? "5vw" : "1.5vw"} fontWeight={600}>
            Other Events
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack gap={2}>
            {otherEvents.length === 0 ? (
              <Typography>No other events found.</Typography>
            ) : (
              otherEvents.map((event) => (
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={2}
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <Box
                    component="img"
                    src={event.thumbnail || "https://placehold.co/100x100"}
                    alt={event.title}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "2px solid #B55725",
                    }}
                  />
                  <Stack>
                    <Typography fontWeight={700} color="#fff">
                      {event.title}
                    </Typography>
                    <Typography fontSize="0.9rem" color="#B55725">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </Stack>
                </Stack>
              ))
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Stack
        width="100%"
        direction="column"
        justifyContent="start"
        alignItems="start"
        mt={isMobile ? 4 : 0}
        gap={isMobile ? 2 : 3}
      >
        <Typography
          ref={(el) => (textGroupRef.current[0] = el)}
          variant="h3"
          fontSize={isMobile ? "8vw" : "4vw"}
          fontWeight={700}
          textTransform="capitalize"
        >
          {data.title}
          <span>
            <img
              src={dot}
              style={{
                width: isMobile ? "1.6vw" : ".6vw",
                height: isMobile ? "1.6vw" : ".6vw",
                objectFit: "contain",
                marginLeft: isMobile ? "1vw" : "0.2vw",
              }}
              alt="dot"
            />
          </span>
        </Typography>

        <Typography
          ref={(el) => (textGroupRef.current[1] = el)}
          textAlign="justify"
          fontSize={isMobile ? "4vw" : "1.2vw"}
          width={isMobile ? "100%" : "70%"}
        >
          {data.description}
        </Typography>

        <Typography
          ref={(el) => (textGroupRef.current[2] = el)}
          fontWeight={700}
          fontSize={isMobile ? "4vw" : "1.4vw"}
        >
          Rs {data.price}/-
        </Typography>

        <Stack
          mt={isMobile ? 1 : 0}
          direction={isMobile ? "column" : "row"}
          gap={isMobile ? 1 : 4}
          width="100%"
          justifyContent={isMobile ? "space-between" : undefined}
        >
          <Typography
            ref={(el) => (textGroupRef.current[3] = el)}
            color="#B55725"
            fontWeight={600}
            fontSize={isMobile ? "4vw" : "1.1vw"}
          >
            Date: {formattedDate}
          </Typography>

          <Typography
            ref={(el) => (textGroupRef.current[4] = el)}
            color="#B55725"
            fontWeight={600}
            fontSize={isMobile ? "4vw" : "1.1vw"}
          >
            Time: {formattedTime}
          </Typography>

          <Typography
            ref={(el) => (textGroupRef.current[5] = el)}
            color="#B55725"
            fontWeight={600}
            fontSize={isMobile ? "4vw" : "1.1vw"}
            textTransform="capitalize"
          >
            Venue: {data.location}
          </Typography>
        </Stack>

        <Button
          ref={(el) => (textGroupRef.current[6] = el)}
          onClick={() =>
            isWomenFounder
              ? (window.location.href = "https://lu.ma/b78th7lb")
              : handleEventRegistration()
          }
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: "#B55725",
            color: "white",
            fontWeight: 700,
            textTransform: "none",
            fontSize: isMobile ? "4vw" : "1.2vw",
            padding: isMobile ? "1vw 2vw" : "0.5vw 2vw",
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "#B55725",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#B55725" }} />
          ) : (
            "Book Now"
          )}
        </Button>
      </Stack>

      <Box
        mt={isMobile ? 6 : 0}
        width="100%"
        height={isMobile ? "50vh" : 500}
        overflow="hidden"
      >
        <Box
          ref={imageRef}
          component="img"
          src={data.thumbnail || "https://placehold.co/600x400"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt="Event Thumbnail"
        />
      </Box>

      <EventRegister
        open={open}
        handleClose={() => setOpen(false)}
        event={data}
        setSnackbar={setSnackbar}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            backgroundColor:
              snackbar.severity === "success" ? "#B55725" : "#D32F2F",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 2,
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default EventsInternal;
