import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);
const Events = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const rowRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    rowRefs.current.forEach((el) => {
      if (el) {
        gsap.fromTo(
          el,
          {
            scale: 0.6,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back",
            scrollTrigger: {
              trigger: el,
              start: isMobile ? "top 80%" : "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  }, []);

  return (
    <Box px={isMobile ? 0 : 2} py={8}>
      <Typography
        textAlign="center"
        fontSize="3vw"
        textTransform="uppercase"
        sx={{
          position: "relative",
          textDecoration: "underline",
          textDecorationColor: "#B55725",
          textUnderlineOffset: "10px",
          textDecorationThickness: "4px",
        }}
      >
        Events
      </Typography>
      <Grid container mt={4} spacing={4} p={4}>
        {data.map((event, index) => (
          <Grid
            ref={(el) => (rowRefs.current[index] = el)}
            key={index}
            size={{
              xs: 6,
              sm: 5,
              md: 4,
              lg: 3,
            }}
          >
            <Box height="100%">
              <Box
                onClick={() => navigate(event.redirect)}
                src={event.thumbnail}
                component="img"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.01)",
                    cursor: "pointer",
                  },
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Events;
