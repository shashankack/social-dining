import {
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Typography,
  Button,
} from "@mui/material";

import dot from "../assets/images/dot.svg";
import { eventsData } from "../assets/data";

import { useParams } from "react-router-dom";
import EventRegister from "./Forms/EventRegister";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);

  const { slug } = useParams();
  const data = eventsData.find((e) => e.redirect === `/events/${slug}`);

  const containerRef = useRef(null);
  const textGroupRef = useRef([]);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Fade in + stagger text
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

    // Image slide from top
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
  }, [slug]);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    let hour = parseInt(timeStr, 10);
    const minute = "00";
    if (hour === 24 || hour === 0) hour = 0;
    const suffix = hour >= 12 ? "pm" : "am";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${displayHour}:${minute} ${suffix}`;
  };

  if (!data) return <div>Loading... </div>;

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
          Rs {data.registrationFee}/-
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
            Date: {data.date}
          </Typography>
          <Typography
            ref={(el) => (textGroupRef.current[4] = el)}
            color="#B55725"
            fontWeight={600}
            fontSize={isMobile ? "4vw" : "1.1vw"}
          >
            Venue: {data.venue}
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
          fullWidth={isMobile ? true : false}
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
          src={data.thumbnail}
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
