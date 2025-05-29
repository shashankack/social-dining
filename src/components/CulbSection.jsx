import {
  Box,
  Button,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import dot from "../assets/images/dot.svg";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import ClubRegister from "./Forms/ClubRegister";

import morningClub from "../assets/images/clubs/morning.png";
import foudnersClub from "../assets/images/clubs/founders.png";
import fitnessClub from "../assets/images/clubs/fitness.png";
import supperClub from "../assets/images/clubs/supper.png";

import clubVideo from "../assets/videos/club.mp4";

gsap.registerPlugin(ScrollTrigger);
const clubData = [
  {
    thumbnail: morningClub,
    title: "Morning Club",
    description:
      "A space for early risers to connect over breakfast and meaningful conversation calm, bright, and nourishing.",
  },
  {
    thumbnail: foudnersClub,
    title: "Founders Club",
    description:
      "For builders and dreamers who gather to share ideas, stories, and a seat at the table.",
  },
  {
    thumbnail: fitnessClub,
    title: "Fitness Club",
    description:
      "Where movement meets mindful meals  energizing conversations after a good sweat.",
  },
  {
    thumbnail: supperClub,
    title: "Supper Club",
    description:
      "Evenings of clinking glasses, shared plates, and effortless connection as the day winds down.",
  },
];

const CulbSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const imageRefs = useRef([]);
  const textRefs = useRef([]);

  const addToImageRefs = (el) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
  };

  const addToTextRefs = (el) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  useEffect(() => {
    const boxes = imageRefs.current;

    boxes.forEach((imageBox) => {
      gsap.from(imageBox, {
        xPercent: -100,
        duration: 0.6,
        scrollTrigger: {
          trigger: imageBox,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    const textBoxes = textRefs.current;
    textBoxes.forEach((textBox) => {
      gsap.from(textBox, {
        xPercent: 100,
        duration: 0.6,
        scrollTrigger: {
          trigger: textBox,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  });

  const handleOpen = (club) => {
    setSelectedClub(club);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClub(null);
  };

  return isMobile ? (
    <Box
      height="110vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <Box component="video" src={clubVideo} autoPlay muted loop playsInline />

      <Stack
        direction="column"
        gap={2}
        position="absolute"
        width="94%"
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography textAlign="center" fontSize="14vw" mb={4}>
          Clubs
          <span>
            <img
              src={dot}
              style={{
                width: "6px",
                height: "6px",
                marginLeft: "3px",
              }}
            />
          </span>
        </Typography>
        {clubData.map((club, index) => (
          <Stack direction="row" gap={2} height={140} key={index}>
            <Box component="img" src={club.thumbnail} width={120} />
            <Stack
              alignItems="start"
              height="100%"
              justifyContent={"space-between"}
            >
              <Typography fontWeight={800}>{club.title}</Typography>
              <Typography fontSize="4vw" lineHeight={1.2}>
                {club.description}
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleOpen(club)}
                sx={{
                  backgroundColor: "#B55725",
                  fontSize: isMobile ? 10 : 14,
                  borderRadius: 0,
                  mt: isMobile ? 0 : 2,
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#B55725" },
                }}
              >
                Join the club
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <video
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",

          objectFit: "cover",
        }}
        src={clubVideo}
        loop
        muted
        autoPlay
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      <Box position="absolute">
        <Typography
          fontSize={40}
          fontWeight={700}
          textAlign="center"
          width="100%"
          mb={5}
        >
          Clubs
          <span>
            <img
              src={dot}
              style={{
                width: "6px",
                height: "6px",
                marginLeft: "3px",
              }}
            />
          </span>
        </Typography>

        <Box width="100%" overflow="hidden">
          {clubData.map((club, index) => (
            <Box
              gap={2}
              key={index}
              mb={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              overflow="hidden"
            >
              <Box
                component="img"
                src={club.thumbnail}
                width={180}
                ref={addToImageRefs}
              />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="start"
                alignItems="start"
                height={180}
                ref={addToTextRefs}
              >
                <Typography
                  mb={2}
                  variant="h5"
                  fontFamily="Darker Grotesque"
                  fontWeight={700}
                  sx={{
                    "& span": {
                      color: "#B55725",
                    },
                  }}
                >
                  {club.title}
                  <span>.</span>
                </Typography>
                <Typography
                  width={300}
                  fontSize={18}
                  fontFamily="Darker Grotesque"
                  fontWeight={600}
                >
                  {club.description}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleOpen(club)}
                  sx={{
                    backgroundColor: "#B55725",
                    fontSize: isMobile ? 10 : 14,
                    borderRadius: 0,
                    mt: isMobile ? 0 : 2,
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#B55725" },
                  }}
                >
                  Join the club
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <ClubRegister open={open} handleClose={handleClose} club={selectedClub} />
    </Box>
  );
};

export default CulbSection;
