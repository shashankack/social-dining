import { useEffect, useRef } from "react";
import aboutVideo from "../assets/videos/about.mp4";
import { Stack, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import gsap from "gsap";
import dot from "../assets/images/dot.svg";
import ImageSlider from "./ImageSlider";

import slide1 from "../assets/images/about_slide/slide_1.png";
import slide2 from "../assets/images/about_slide/slide_2.png";
import slide3 from "../assets/images/about_slide/slide_3.png";
import slide4 from "../assets/images/about_slide/slide_4.png";
import slide5 from "../assets/images/about_slide/slide_5.png";
import slide6 from "../assets/images/about_slide/slide_6.png";

const AboutSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const containerRef = useRef(null);
  const followerRef = useRef(null);
  const sliderRef = useRef(null);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6];

  useEffect(() => {
    const container = containerRef.current;
    const follower = followerRef.current;

    if (!container || !follower) return;

    const followerWidth = follower.offsetWidth;
    const followerHeight = follower.offsetHeight;

    const slider = sliderRef.current;
    if (!slider) return;

    const totalHeight = slider.scrollHeight / 2;

    gsap.to(slider, {
      y: `-=${totalHeight}`,
      duration: 20,
      ease: "linear",
      repeat: -1,
      modifiers: {
        y: gsap.utils.unitize((y) => parseFloat(y) % totalHeight),
      },
    });

    const handleMouseEnter = () => {
      gsap.to(follower, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        display: "block",
      });
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const clampedX = Math.min(
        Math.max(mouseX - followerWidth / 2, 0),
        rect.width - followerWidth
      );
      const clampedY = Math.min(
        Math.max(mouseY - followerHeight / 2, 0),
        rect.height - followerHeight
      );

      gsap.to(follower, {
        x: clampedX,
        y: clampedY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(follower, {
        scale: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <Box overflow="hidden">
      {isMobile || isTablet ? (
        <Box
          height="70vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Stack width="100%" direction="row" p={2} gap={2}>
            <Stack direction="column" width="45%">
              <Typography
                variant="h3"
                fontWeight={700}
                fontSize={isMobile ? 20 : isTablet ? 30 : 50}
              >
                About Us
                <span>
                  <img
                    src={dot}
                    style={{
                      objectFit: "contain",
                      width: "4px",
                      height: "4px",
                      marginLeft: "2px",
                    }}
                  />
                </span>
              </Typography>
              <Typography
                mt={2}
                variant="body2"
                fontSize={isMobile ? "12px" : "20px"}
              >
                A premium social club curating unique experiences for a
                carefully selected circle. <br />
                <br /> Bringing together like-minded individuals from diverse
                industries for networking, fun, and indulgence.
              </Typography>
            </Stack>
            <Box flex={1}>
              <ImageSlider images={slides} direction="" />
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box height="100vh" position="relative">
          <Box
            component="video"
            src={aboutVideo}
            autoPlay
            muted
            playsInline
            loop
          />

          <Box
            right={60}
            top={0}
            width={300}
            height="100vh"
            position="absolute"
            overflow="hidden"
            p={2}
            sx={{
              zIndex: 1,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Box ref={sliderRef} display="flex" flexDirection="column">
              {[...slides, ...slides].map((img, i) => (
                <Box
                  mb={2}
                  key={i}
                  component="img"
                  src={img}
                  alt={`slide-${i}`}
                  sx={{
                    width: "100%",
                    height: "auto",
                    boxShadow: "6px 6px 10px 1px rgba(0,0,0,0.4)",
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box
            ref={containerRef}
            className="about-container"
            position="absolute"
            top="13vh"
            left="10vw"
            width="70%"
            height="75%"
            overflow="hidden"
            sx={{
              cursor: "none",
            }}
          >
            <Box
              ref={followerRef}
              sx={{
                width: "350px",
                height: "450px",
                padding: "20px",
                bgcolor: "black",
                boxShadow: "6.348px 6.348px 0px #B55725",
                position: "absolute",
                top: 0,
                left: 0,
                transform: "scale(0)",
                pointerEvents: "none",
              }}
            >
              <Typography variant="h3" color="white" fontWeight={700}>
                About Us
                <span>
                  <img
                    src={dot}
                    style={{
                      width: "2%",
                      marginLeft: "3px",
                      objectFit: "contain",
                    }}
                    alt="dot"
                  />
                </span>
              </Typography>
              <div data-animate>
                <Typography
                  variant="h5"
                  fontSize={"1.4vw"}
                  fontWeight={300}
                  mt={3}
                  lineHeight={1.1}
                  color="#dddddd"
                  sx={{ "& span": { color: "#B55725" } }}
                >
                  A premium social club curating unique experiences for a
                  carefully selected circle<span>.</span> <br /> <br /> Bringing
                  together like-minded individuals from diverse industries for
                  networking, fun and indulgence<span>.</span>
                </Typography>
              </div>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AboutSection;
