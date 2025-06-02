import { useLocation, Link as RouterLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Link,
  Stack,
  AppBar,
  useTheme,
  Typography,
  useMediaQuery,
} from "@mui/material";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

import logo from "../assets/images/logo_no_dot.png";
import desktopVideo from "../assets/videos/hero_desktop.mp4";
import mobileVideo from "../assets/videos/hero_mobile.mp4";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [hasPlayed] = useState(() => {
    return sessionStorage.getItem("hasPlayed") === "true";
  });

  const location = useLocation();
  const currentPath = location.pathname;

  const dotRef = useRef(null);
  const introTextRef = useRef(null);
  const introTextContainerRef = useRef(null);
  const textRef = useRef(null);
  const bookRef = useRef(null);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/?scrollTo=about" },
    { label: "Events", path: "/events" },
    { label: "Clubs", path: "/?scrollTo=clubs" },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get("scrollTo");

    const refsMap = {
      book: bookRef,
    };

    let attempts = 0;
    const maxAttempts = 15;

    const scrollToRef = (ref) => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    const tryScroll = () => {
      if (!target) return;
      const key = target.toLowerCase();
      const ref = refsMap[key];
      if (!ref) return;

      if (!scrollToRef(ref)) {
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 500);
        }
      }
    };

    setTimeout(tryScroll, 500);
  }, [location.search]);

  // Intro animation
  useEffect(() => {
    if (hasPlayed) {
      gsap.set(introTextContainerRef.current, {
        display: "none",
        opacity: 0,
      });
      gsap.set(dotRef.current, {
        scale: 1,
      });
      return;
    }

    document.body.style.overflow = "hidden";

    const typeSplit = new SplitType(introTextRef.current, {
      types: "lines, words, chars",
      tagName: "span",
    });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    gsap.set(dotRef.current, {
      scale: 200,
      delay: 1.5,
    });

    tl.from(introTextRef.current.querySelectorAll(".word"), {
      y: "100%",
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.2,
      delay: 1,
    });

    tl.to(introTextContainerRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "sine.out",
    })
      .set(introTextContainerRef.current, { display: "none" })
      .to(
        dotRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "back.out(.3)",
        },
        "<"
      )
      .add(() => {
        document.body.style.overflow = "auto";
        sessionStorage.setItem("hasPlayed", "true");
      });

    return () => {
      tl.kill();
      document.body.style.overflow = "auto";
    };
  }, [hasPlayed]);

  // Animated text gradient
  useEffect(() => {
    if (!textRef.current) return;

    // Delay to ensure DOM is painted
    const timeout = setTimeout(() => {
      const split = new SplitType(textRef.current, {
        types: "words",
        tagName: "span",
      });

      gsap.fromTo(
        split.words,
        {
          y: 30,
          opacity: 0,
          color: "#fff",
        },
        {
          y: 0,
          opacity: 1,
          color: "#B55725",
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    }, 100);

    return () => {
      split?.revert();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* Intro animation */}
      <Box
        ref={introTextContainerRef}
        overflow="hidden"
        width="100%"
        position="absolute"
        sx={{
          cursor: "none",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      >
        <Typography
          fontWeight={500}
          variant="h4"
          textAlign="center"
          color="white"
          ref={introTextRef}
        >
          A close-knit Social Club.
        </Typography>
      </Box>

      {/* Logo + Navigation */}
      <AppBar
        position="absolute"
        elevation={0}
        color="transparent"
        sx={{
          zIndex: 1,
          top: 30,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box width={200} position="relative">
          <Box component="img" src={logo} />
          <Box
            sx={{
              cursor: "none",
              transform: "scale(200)",
              transformOrigin: "center center",
              transformBox: "fill-box",
            }}
            ref={dotRef}
            position="absolute"
            bottom={5}
            right={-25}
            component="svg"
            width=".15"
            height=".15"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="4" cy="4" r="4" fill="#B55725" />
          </Box>
        </Box>

        <Stack mt={2} sx={{ borderLeft: 5, borderColor: "#B55725" }}>
          {navItems.map((item) => (
            <Box key={item.path} sx={{ fontSize: 28, px: 2, py: 0.5 }}>
              <Link
                component={RouterLink}
                to={item.path}
                underline="none"
                sx={{
                  color: currentPath === item.path ? "#B55725" : "white",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#B55725",
                  },
                }}
              >
                {item.label}
              </Link>
            </Box>
          ))}
        </Stack>
      </AppBar>

      {/* Hero Video & Book Now */}
      <Box
        width="100%"
        display="flex"
        justifyContent="start"
        alignItems="center"
        flexDirection="column"
      >
        <Box
          position="relative"
          height="100vh"
          component="video"
          src={isMobile ? mobileVideo : desktopVideo}
          autoPlay
          muted
          playsInline
          loop
        />

        <Box
          ref={bookRef}
          id="book"
          position="absolute"
          bottom={50}
          sx={{
            "& a": {
              display: "inline-block",
              transition: "all 0.3s ease",
              cursor: "pointer",
              color: "white",
              letterSpacing: "0.05em",
            },
            "& a:before": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "6px",
              backgroundColor: "#B55725",
              bottom: 0,
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
          <Link underline="none" variant="h3" fontWeight={700} href="#book">
            Book Now
          </Link>
        </Box>

        <Box
          px={isMobile || isTablet ? 2 : 0}
          position={isMobile || isTablet ? "absolute" : ""}
          my={isMobile || isTablet ? 0 : 10}
          bottom={isMobile || isTablet ? 140 : ""}
          left={isMobile || isTablet ? "0" : ""}
          width="100%"
          mx="auto"
        >
          <Box
            ref={isMobile || isTablet ? null : textRef}
            component="div"
            sx={{
              fontSize: isMobile ? 16 : "2.3vw",
              lineHeight: "100.6%",
              textTransform: isMobile ? "none" : "uppercase",
              fontWeight: 400,
              textAlign: "center",
              color: "#fff",
              width: "100%",
            }}
          >
            The tiny dot in our logo isn’t just a design choice—it’s our ethos.
            It represents the close-knit, meaningful circles we create. Small in
            size, rich in depth. That’s what makes Social Dining unique.
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HeroSection;
