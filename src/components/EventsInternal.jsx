import {
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import dot from "../assets/images/dot.svg";
import EventRegister from "./Forms/EventRegister";
import { fetchEventById } from "../services/eventService"; // ✅ use your service

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const textGroupRef = useRef([]);
  const imageRef = useRef(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await fetchEventById(id);
        setData(event);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
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
        stagger: 0.11,
        duration: 0.8,
      }
    );

    tl.fromTo(
      imageRef.current,
      { xPercent: 400, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 1, ease: "back.out(.6)" },
      "-=1.7"
    );

    return () => {
      gsap.killTweensOf(textGroupRef.current);
      gsap.killTweensOf(imageRef.current);
    };
  }, [data]);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    let hour = parseInt(timeStr, 10);
    const minute = "00";
    const suffix = hour >= 12 ? "pm" : "am";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minute} ${suffix}`;
  };

  if (loading) {
    return (
      <Box
        height="70vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress sx={{ color: "#B55725" }} />
      </Box>
    );
  }

  if (!data) return <div>Event not found.</div>;

  return (
    <Stack
      ref={containerRef}
      my={isMobile ? 0 : 10}
      flexDirection={isMobile ? "column-reverse" : "row"}
      justifyContent={isMobile ? "center" : "space-between"}
      alignItems="start"
      padding={isMobile ? 2 : 4}
    >
      <Stack
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
        >
          {data.title}
          <span>
            <img
              src={dot}
              style={{
                width: isMobile ? "1.6vw" : ".6vw",
                height: isMobile ? "1.6vw" : ".6vw",
                objectFit: "contain",
              }}
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
          justifyContent={isMobile ? "space-between" : ""}
        >
          <Typography
            ref={(el) => (textGroupRef.current[3] = el)}
            color="#B55725"
            fontWeight={600}
            fontSize={isMobile ? "4vw" : "1.1vw"}
          >
            Date: {new Date(data.date).toLocaleDateString()}
          </Typography>
          <Typography
            ref={(el) => (textGroupRef.current[4] = el)}
            color="#B55725"
            fontWeight={600}
            fontSize={isMobile ? "4vw" : "1.1vw"}
          >
            Venue: {data.location}
          </Typography>
          <Typography
            ref={(el) => (textGroupRef.current[5] = el)}
            color="#B55725"
            fontWeight={600}
            fontSize={isMobile ? "4vw" : "1.1vw"}
          >
            Time: {formatTime(data.startTime)} - {formatTime(data.endTime)}
          </Typography>
        </Stack>

        <Button
          ref={(el) => (textGroupRef.current[6] = el)}
          onClick={() => setOpen(true)}
          variant="contained"
          fullWidth={isMobile}
          sx={{
            backgroundColor: "#B55725",
            color: "white",
            fontWeight: 700,
            textTransform: "none",
            fontSize: isMobile ? "4vw" : "1.2vw",
            padding: isMobile ? "1vw 2vw" : "0.5vw 2vw",
            borderRadius: "5px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#B55725",
            },
          }}
        >
          Book Now
        </Button>
      </Stack>

      <Box
        ref={imageRef}
        mt={isMobile ? 6 : 0}
        width={isMobile ? "100%" : "40vw"}
        height={isMobile ? "50vh" : "auto"}
        overflow="hidden"
      >
        <Box
          component="img"
          src={data.thumbnail || "https://placehold.co/600x400"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      <EventRegister
        open={open}
        handleClose={() => setOpen(false)}
        event={data}
      />
    </Stack>
  );
};

export default Events;
