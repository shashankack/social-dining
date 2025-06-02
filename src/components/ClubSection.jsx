import {
  Box,
  Button,
  Typography,
  Stack,
  useTheme,
  Grid,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
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

import { registerForClub, getClubs } from "../services/clubService";
import { getCurrentUser } from "../services/authService";
import { useLocation, useNavigate } from "react-router-dom";

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

const ClubSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubList, setClubList] = useState([]);
  const [loading, setLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
    getClubs().then((data) => {
      const clubIds = data.getAllClubs.map((club) => club.id);
      const clubDetails = clubIds.map((id, index) => ({
        id,
        thumbnail: clubData[index].thumbnail,
        title: clubData[index].title,
        description: clubData[index].description,
      }));
      setClubList(clubDetails);
    });
  }, []);

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

  const handleOpen = async (club) => {
    setLoading(club.id);

    try {
      await getCurrentUser();
      await registerForClub(club.id);
      setSnackbar({
        open: true,
        message: `You have successfully joined ${club.title}`,
        severity: "success",
      });
    } catch (error) {
      navigate("/login", {
        state: {
          from: location.pathname,
          clubId: club.id,
        },
      });
    } finally {
      setLoading(null);
    }
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
        {clubList.map((club, index) => (
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
                fullWidth
                onClick={() => handleOpen(club)}
                disabled={loading === club.id}
                sx={{
                  backgroundColor: "#B55725",
                  color: "#fff",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#a7491c",
                  },
                }}
              >
                {loading === club.id ? (
                  <CircularProgress size={20} sx={{ color: "#b55725" }} />
                ) : (
                  "Join Now"
                )}
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <ClubRegister open={open} handleClose={handleClose} club={selectedClub} />
    </Box>
  ) : (
    <Box position="relative">
      <Box
        component="video"
        src={clubVideo}
        autoPlay
        muted
        loop
        playsInline
        sx={{
          maxHeight: "150vh",
          width: "100%",
          objectFit: "cover",
        }}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
      >
        <Typography
          textAlign="center"
          fontSize={80}
          color="#fff"
          fontWeight={800}
        >
          Clubs
        </Typography>
        <Grid
          margin="0 auto"
          container
          maxWidth={1000}
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          {clubList.map((club, index) => (
            <Grid size={6} key={index}>
              <Box
                position="relative"
                height={450}
                sx={{
                  overflow: "hidden",
                  bgcolor: "#000",
                  "&:hover .club-image": {
                    transform: "scale(1.1)",
                    filter: "brightness(0.4)",
                  },
                  "&:hover .slide-top": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                  "&:hover .slide-left": {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                  "&:hover .slide-bottom": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                }}
              >
                {/* Image */}
                <Box
                  component="img"
                  src={club.thumbnail}
                  className="club-image"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease, filter 0.4s ease",
                  }}
                />

                {/* Title - Slide from Top */}
                <Box
                  className="slide-top"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    px: 2,
                    py: 1,
                    color: "#fff",
                    opacity: 0,
                    transform: "translateY(-30px)",
                    transition: "all 0.4s ease",
                  }}
                >
                  <Typography fontSize="2vw" fontWeight={800}>
                    {club.title}
                  </Typography>
                </Box>

                {/* Description - Slide from Left */}
                <Box
                  className="slide-left"
                  sx={{
                    position: "absolute",
                    top: "40%",
                    left: 0,
                    width: "100%",
                    px: 2,
                    transform: "translateX(-30px) translateY(-60%)",
                    color: "#fff",
                    opacity: 0,
                    transition: "all 0.4s ease",
                  }}
                >
                  <Typography fontSize="1vw" fontWeight={400}>
                    {club.description}
                  </Typography>
                </Box>

                {/* Button - Slide from Bottom */}
                <Box
                  className="slide-bottom"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    px: 2,
                    pb: 2,
                    color: "#fff",
                    opacity: 0,
                    transform: "translateY(30px)",
                    transition: "all 0.4s ease",
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleOpen(club)}
                    disabled={loading === club.id}
                    sx={{
                      backgroundColor: "#B55725",
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#a7491c",
                      },
                    }}
                  >
                    {loading === club.id ? (
                      <CircularProgress size={20} sx={{ color: "#b55725" }} />
                    ) : (
                      "Join Now"
                    )}
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <ClubRegister open={open} handleClose={handleClose} club={selectedClub} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          iconMapping={{
            success: (
              <img
                src={dot}
                alt="dot"
                style={{ width: 10, height: 10, marginRight: 8 }}
              />
            ),
          }}
          sx={{
            width: "100%",
            backgroundColor: "#000", // background
            color: "#fff", // text
            border: "1px solid #B55725",
            fontWeight: 600,
          }}
          icon={false} // optional: remove icon
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClubSection;
