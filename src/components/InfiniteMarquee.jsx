import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";

const InfiniteMarquee = ({
  text = "Social Dining",
  separator = "•",
  color = "#fff",
  bgcolor = "#121212",
  textShadow = "2px 2px 4px rgba(0,0,0,0.5)",
  fontSize = "2rem",
  height = "60px",
  direction = "left",
  speed = 20,
  rotate = 0,
  pauseOnHover = false,
}) => {
  const marqueeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const container = marqueeRef.current;
    const totalWidth = container.scrollWidth / 2;

    animationRef.current = gsap.to(container, {
      x: direction === "left" ? -totalWidth : totalWidth,
      duration: speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    return () => animationRef.current?.kill();
  }, [direction, speed]);

  useEffect(() => {
    if (!pauseOnHover) return;
    const el = marqueeRef.current;

    const handleMouseEnter = () => animationRef.current?.pause();
    const handleMouseLeave = () => animationRef.current?.play();

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [pauseOnHover]);

  const repeatedText = Array(20).fill(`${text} ${separator} `).join("");

  return (
    <Box
      sx={{
        width: "110%",
        overflow: "hidden",
        backgroundColor: bgcolor,
        height,
        display: "flex",
        alignItems: "center",
        position: "relative",
        left: "-2%",
        boxShadow: "0px 6px 0 #E25517",
        transform: `rotate(${rotate}deg)`,
        cursor: pauseOnHover ? "pointer" : "default",
      }}
    >
      <Typography
        variant="h6"
        ref={marqueeRef}
        sx={{
          whiteSpace: "nowrap",
          fontSize,
          color,
          textShadow,
          fontWeight: "bold",
          display: "inline-block",
          userSelect: "none",
        }}
      >
        {repeatedText}
      </Typography>
    </Box>
  );
};

export default InfiniteMarquee;
