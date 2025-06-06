import {
  Box,
  Typography,
  useMediaQuery,
  Stack,
  Button,
  CircularProgress,
  Grid,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

import morningClub from "../assets/images/clubs/morning.png";
import foudnersClub from "../assets/images/clubs/founders.png";
import fitnessClub from "../assets/images/clubs/fitness.png";
import supperClub from "../assets/images/clubs/supper.png";

import reel from "../assets/images/clubs/internal/reel.mp4";
import sd1 from "../assets/images/clubs/internal/sd-1.jpg";
import sd2 from "../assets/images/clubs/internal/sd-2.jpg";
import sd3 from "../assets/images/clubs/internal/sd-3.jpg";
import sd4 from "../assets/images/clubs/internal/sd-4.jpg";

import { getClubs } from "../services/clubService";

const clubData = [
  {
    thumbnail: morningClub,
    reel: "",
    title: "Hot Moms Club",
    description:
      "Welcome to the Hot Moms Club a space where moms can unwind, connect, and have fun. While your little ones enjoy their own playground area, you get to mingle, share stories, and make new friends. Whether you’re bonding with your kids or enjoying some “me-time,” there’s something for everyone!",
    whatWeOffer: `<ul>
          <li>
            <strong>Kids’ Playground:</strong> A safe space for your little ones
            to play and bond while you relax and connect with other moms.
          </li>
          <li>
            <strong>Mom-Focused Activities:</strong> Take a break with events
            designed just for you—whether it’s a wellness session, creative
            workshop, or simply a chance to recharge
          </li>
          <li>
            <strong>Delicious Meals:</strong> Enjoy curated dining experiences
            with healthy, delicious food that’s sure to satisfy
          </li>
          <li>
            <strong>Fun Experiences:</strong> Whether it’s tarot readings, group
            activities, or a surprise experience, we add a little magic and fun
            to every gathering.
          </li>
          <li>
            <strong>Great Music & Vibes:</strong> Enjoy good music and a relaxed
            atmosphere that makes it easy to connect and unwind.
          </li>
        </ul>
        The Hot Moms Club is all about celebrating you connecting with other
        amazing moms, having fun with your kids, and taking some time for
        yourself`,
    images: [sd1, sd2, sd3, sd4],
  },
  {
    thumbnail: foudnersClub,
    title: "Founders Club",
    description:
      "The Founders Club is a dynamic space where visionary entrepreneurs, startup founders, and business creators come together to share ideas, collaborate, and inspire one another. This is not just a club; it’s a thriving ecosystem for growth, innovation, and success",
    whatWeOffer: `<ul>
        <li>
          <strong>Engaging Conversations:</strong> Interact with fellow founders
          and entrepreneurs who are shaping the future. Exchange ideas,
          challenges, and solutions in a relaxed, open environment
        </li>
        <li>
          <strong>Vibrant Atmosphere:</strong> Enjoy great music, delectable
          food, and drinks while networking and building meaningful connections.
        </li>
        <li>
          <strong>Networking and Idea Sharing:</strong> Expand your circle with
          like-minded individuals and spark collaborations that could take your
          business to the next level.
        </li>
      </ul>
      The Founders Club is more than just a space; it’s an opportunity to build,
      connect, and grow with the leaders of tomorrow`,
    images: [sd1, sd2, sd3, sd4],
  },
  {
    thumbnail: fitnessClub,
    title: "Fitness Club",
    description:
      "Get ready to elevate your fitness journey with our Fitness Club, where we focus on holistic well-being body, mind and soul. Our exclusive offerings are tailored to help you achieve your fitness goals while enjoying a supportive and fun community.",
    whatWeOffer: `<ul>
        <li>
        <strong>Fitness & Wellness Programs:</strong> From yoga to strength training, our fitness programs are curated to help you stay active, healthy, and strong. Whether you’re a fitness newbie or a seasoned pro, there’s something for everyone.
        </li>
        <li>
          <strong>Healthy & Delicious Food:</strong> Fuel your body with nutritious, tasty meals
          designed to complement your workout. Enjoy wholesome, delicious food
          that keeps you feeling energized.
        </li>
        <li>
          <strong>Fun Group Activities:</strong> Fitness isn’t just about working out—it’s about
          enjoying the process! Participate in group activities like fitness
          challenges, dance classes, and outdoor events that keep you moving and
          having fun.
        </li>
        <li>
          <strong>Supportive Community:</strong> Join a community that’s as committed to wellness
          as you are. Whether you’re aiming for weight loss, toning, or simply
          leading a healthier lifestyle, the Fitness Club provides a space for
          you to thrive.
        </li>
      </ul>
      In the Fitness Club, we focus on fun, fitness, and well-being, making
      every session enjoyable and every achievement worth celebrating`,
    images: [sd1, sd2, sd3, sd4],
  },
  {
    thumbnail: supperClub,
    title: "Supper Club",
    description:
      "The Supper Club is where food, conversation, and fun activities collide. Every event is a curated dining experience, designed not only to satisfy your palate but also to offer you the chance to mingle, have fun, and create lasting memories",
    whatWeOffer: `<ul>
        <li>
          <strong>Curated Dinner Experiences:</strong> Thoughtfully prepared
          dinners, featuring everything from gourmet meals to casual yet
          delicious bites, prepared by top chefs
        </li>
        <li>
          <strong>Fun Conversations & Networking:</strong> This is more than
          just a meal. It’s an opportunity to meet interesting people, share
          experiences, and perhaps even collaborate on something exciting
        </li>
        <li>
          <strong>Relaxed Vibes:</strong> Set in intimate, cozy spaces, our
          supper club is the perfect environment to unwind, relax and let loose
        </li>
      </ul>
      The Supper Club is your go-to for delightful conversations, memorable
      moments, and a great time with great food.`,
    images: [sd1, sd2, sd3, sd4],
  },
];

const ClubsInternal = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [club, setClub] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const data = await getClubs();
        const clubIds = data.getAllClubs.map((club) => club.id);
        const clubDetails = clubIds.map((clubId, index) => ({
          id: clubId,
          ...clubData[index],
        }));
        const selected = clubDetails.find((c) => c.id === id);
        setClub(selected);
      } catch (err) {
        console.error("Failed to load club:", err);
      }
    };

    fetchClub();
  }, [id]);

  if (!club) return <Box>Club not found</Box>;

  return (
    <Stack px={isMobile ? 0 : 10} py={10} flexDirection="column">
      <Stack
        direction={isMobile ? "column" : "row"}
        bgcolor="#B55725"
        height={isMobile ? "auto" : 600}
        width="100%"
        p={isMobile ? 0 : 2}
        gap={isMobile ? 0 : 2}
      >
        <Box height="100%" width={isMobile ? "100%" : 500}>
          <Box component="video" src={reel} autoPlay muted loop playsInline />
        </Box>
        <Stack
          justifyContent="space-between"
          alignItems="start"
          gap={isMobile ? 2 : 0}
          width="100%"
          p={1}
        >
          <Stack
            justifyContent="start"
            alignItems="start"
            gap={isMobile ? 2 : 0}
          >
            <Typography fontWeight={700} fontSize={isMobile ? "6vw" : "3vw"}>
              {club.title}.
            </Typography>
            <Typography
              fontSize={isMobile ? "4vw" : "1.4vw"}
              fontWeight={200}
              textAlign={isMobile ? "justify" : "left"}
            >
              {club.description}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            fullWidth
            endIcon={
              <ArrowOutwardIcon
                sx={{
                  scale: isMobile ? "1.5" : "2",
                }}
              />
            }
            sx={{
              color: "#B55725",
              bgcolor: "#fff",
              boxShadow: "none",
              justifyContent: "space-between",
              fontWeight: 700,
              fontSize: 20,
              transition: "all 0.3s ease",

              "&:hover": {
                transform: "scaleX(.99)",
                boxShadow: "none",
              },
            }}
          >
            Join Now
          </Button>
        </Stack>
      </Stack>
      {/* Accordion */}
      <Accordion
        sx={{
          width: "100%",
          mt: 4,
          background: "linear-gradient(200deg, #000 0%, #222 100%)",

          color: "#fff",
          boxShadow: "none",
          mb: 10,
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ color: "#B55725", fontSize: 40 }} />
          }
          aria-controls="club-content"
          id="club-header"
        >
          <Typography fontWeight={700} fontSize={isMobile ? "5vw" : "3vw"}>
            What We Offer
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            component="div"
            dangerouslySetInnerHTML={{ __html: club.whatWeOffer }}
            sx={{
              fontSize: isMobile ? "3.5vw" : "1.2vw",
              lineHeight: isMobile ? "5vw" : "1.6",
              textAlign: "left",
              "& ul": {
                paddingLeft: isMobile ? "2vw" : 2,
                listStyle: "none",
              },
              "& ul li": {
                position: "relative",
                paddingLeft: isMobile ? "5vw" : "1.5vw",
                mb: 1,
              },
              "& ul li::before": {
                content: '"\\27A4"', // ➤
                position: "absolute",
                left: 0,
                color: "#B55725",
                fontSize: isMobile ? "3vw" : "1vw",
                top: "0.1em",
              },
            }}
          />
        </AccordionDetails>
      </Accordion>
      <Grid
        container
        p={isMobile ? 0.5 : 0}
        spacing={isMobile ? 0.5 : 2}
        sx={{
          width: isMobile ? "100%" : "90%",
          margin: "0 auto",
        }}
      >
        {club.images.map((image, index) => (
          <Grid
            key={index}
            size={index === 0 || index === 3 ? 7 : 5}
            sx={{
              height: isMobile ? 200 : 500,
              transition: "all 0.3s ease",
              overflow: "hidden",
              "&:hover": {
                transform: "scale(.97)",

                "& img": {
                  transform: "scale(1.03)",
                },
              },
            }}
          >
            <Box
              component="img"
              src={image}
              sx={{
                transition: "all 0.3s ease",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default ClubsInternal;
