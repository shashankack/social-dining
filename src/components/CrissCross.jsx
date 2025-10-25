import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CrissCross = ({
  text = [
    "Social Events",
    "That Made The",
    "Days Memorable",
    "Social Dining",
    "Fun Experiences",
  ],
  fontSize,
  color = "#000",
  baseSensitivity = 800, // base distance each line moves
  variance = 300, // maximum random deviation from baseSensitivity
  lineHeight,
}) => {
  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const lines = lineRefs.current;

    lines.forEach((line, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const sensitivity =
        baseSensitivity + (Math.random() - 0.5) * 2 * variance;
      const randomStartOffset = (Math.random() - 0.5) * sensitivity;

      gsap.fromTo(
        line,
        { x: direction * (-sensitivity + randomStartOffset) },
        {
          x: direction * (sensitivity + randomStartOffset),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "-1000 top",
            end: "bottom+=2000 bottom",
            scrub: 2,
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [baseSensitivity, variance]);

  return (
    <Box
      ref={containerRef}
      sx={{
        overflow: "hidden",
        width: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {text.map((line, i) => (
        <Box
          key={i}
          ref={(el) => (lineRefs.current[i] = el)}
          sx={{
            whiteSpace: "nowrap",
            willChange: "transform",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              lineHeight,
              fontSize,
              color,
              textTransform: "uppercase",
              display: "inline-block",
            }}
          >
            {Array(12).fill(line).join(" ")}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CrissCross;
