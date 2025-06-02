import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import UpcomingSection from "../components/UpcomingSection";
import ClubSection from "../components/ClubSection";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const location = useLocation();
  const isMobile = window.innerWidth <= 768;
  const aboutRef = useRef(null);
  const upcomingRef = useRef(null);
  const clubRef = useRef(null);

  useEffect(() => {
    if (aboutRef.current && upcomingRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: upcomingRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      tl.to(aboutRef.current, {
        scale: 0.75,
        opacity: 0.5,
        rotate: 10,
        ease: "power1.out",
      });
    }

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get("scrollTo");

    const refsMap = {
      about: aboutRef,
      clubs: clubRef,
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

      if (scrollToRef(ref)) {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 800);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryScroll, 600);
      }
    };

    setTimeout(tryScroll, 600);
  }, [location.search]);

  return (
    <Box>
      <HeroSection />
      <div>
        <div
          style={{ position: "sticky", top: 0 }}
          ref={isMobile ? null : aboutRef}
        >
          <AboutSection />
        </div>
        <div ref={upcomingRef}>
          <UpcomingSection />
        </div>
      </div>
      <div ref={clubRef}>
        <ClubSection />
      </div>
    </Box>
  );
};

export default Home;
