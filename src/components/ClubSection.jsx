import {
  Box,
  Button,
  Typography,
  Stack,
  useTheme,
  Grid,
  useMediaQuery,
} from "@mui/material";
import dot from "../assets/images/dot.svg";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";

import hotMomClub from "../assets/images/clubs/hotMom.png";
import foudnersClub from "../assets/images/clubs/founders/thumbnail.png";
import fitnessClub from "../assets/images/clubs/fitness.png";
import supperClub from "../assets/images/clubs/supper.png";

import clubVideo from "../assets/videos/club.mp4";
import { getClubs } from "../services/clubService";

gsap.registerPlugin(ScrollTrigger);

const clubData = [
  {
    thumbnail: hotMomClub,
    title: "Hot Mom Club",
    description:
      "Welcome to the Hot Moms Club! Kids play, moms unwind. Connect, relax, and enjoy!",
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

  const [clubList, setClubList] = useState([]);

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

  const handleNavigate = (clubId) => {
    navigate(`/club/${clubId}`);
  };

  return isMobile ? (
    <Stack
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      sx={{ position: "relative", backgroundColor: "#000" }}
    >
      {/* Background Video */}
      <Box
        component="video"
        src={clubVideo}
        autoPlay
        muted
        loop
        playsInline
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          filter: "brightness(1)",
        }}
      />

      {/* Title */}
      <Typography
        fontSize="14vw"
        fontWeight={800}
        textAlign="center"
        color="#fff"
        mb={4}
        zIndex={2}
      >
        Clubs
        <span>
          <img
            src={dot}
            alt="dot"
            style={{ width: "15px", height: "15px", marginLeft: "6px" }}
          />
        </span>
      </Typography>

      {/* Swiper Carousel */}
      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        style={{
          width: "90%",
          height: "480px",
          zIndex: 2,
          overflow: "hidden",
          paddingBottom: "20px",
        }}
      >
        {clubList.map((club, index) => (
          <SwiperSlide
            key={index}
            style={{
              background: "#000",
              border: "2px solid #B55725",
              borderRadius: "12px",
              padding: "16px",
              width: "80%", // important for coverflow to work well
              boxSizing: "border-box",
            }}
          >
            <Stack height="100%" spacing={2} overflow="hidden">
              <Box
                component="img"
                src={club.thumbnail}
                alt={club.title}
                sx={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />

              <Typography fontWeight={700} fontSize="5vw" color="#fff" noWrap>
                {club.title}
              </Typography>

              <Typography
                fontSize="4vw"
                color="#ccc"
                lineHeight={1.4}
                sx={{
                  flexGrow: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {club.description}
              </Typography>

              <Button
                variant="contained"
                onClick={() => handleNavigate(club.id)}
                fullWidth
                sx={{
                  backgroundColor: "#B55725",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "4vw",
                  textTransform: "none",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "#a7491c",
                  },
                }}
              >
                Learn More
              </Button>
            </Stack>
          </SwiperSlide>
        ))}
      </Swiper>
    </Stack>
  ) : (
    <Box position="relative">
      <Box
        component="video"
        src={clubVideo}
        autoPlay
        muted
        loop
        playsInline
        sx={{ maxHeight: "150vh", width: "100%", objectFit: "cover" }}
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
                <Box
                  className="slide-top"
                  sx={{
                    position: "absolute",
                    top: "30%",
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
                <Box
                  className="slide-left"
                  sx={{
                    position: "absolute",
                    transform: "translateX(-30px)",
                    top: "45%",
                    left: 0,
                    width: "100%",
                    px: 2,
                    color: "#fff",
                    opacity: 0,
                    transition: "all 0.4s ease",
                  }}
                >
                  <Typography fontSize="1vw" fontWeight={400}>
                    {club.description}
                  </Typography>
                </Box>
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
                    onClick={() => handleNavigate(club.id)}
                    sx={{
                      backgroundColor: "#B55725",
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#a7491c" },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ClubSection;
