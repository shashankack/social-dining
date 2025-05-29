import { Box } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";

const Intro = ({ NextComponent }) => {
  const [hasPlayed] = useState(() => {
    return sessionStorage.getItem("hasPlayed") === "true";
  });
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const nextComponentRef = useRef(null);

  useEffect(() => {
    if (hasPlayed) return;

    const typeSplit = new SplitType(textRef.current, {
      types: "lines, words, chars",
      tagName: "span",
    });

    const tl = gsap.timeline({ defaults: { duration: 1 } });

    tl.from(textRef.current.querySelectorAll(".word"), {
      y: "100%",
      opacity: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.3,
    })

      .to(
        containerRef.current,
        { y: "100vh", duration: 1, ease: "sine.out" },
        "+=0.5"
      )
      .fromTo(
        nextComponentRef.current,
        { top: "-100%", opacity: 0, duration: 1 },
        { top: "0", opacity: 1, duration: 1 },
        "<"
      )
      .add(() => {
        containerRef.current.style.display = "none";
        sessionStorage.setItem("hasPlayed", "true");
      });

    return () => {
      typeSplit.revert();
    };
  }, [hasPlayed]);

  if (hasPlayed) {
    return (
      <Box>
        <NextComponent />
      </Box>
    );
  }
  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f0f0",
          overflow: "hidden",
        }}
      >
        <h1
          ref={textRef}
          style={{
            mixBlendMode: "difference",
          }}
        >
          A Close-Knit Social Club.
        </h1>
      </Box>

      <Box
        ref={nextComponentRef}
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
      >
        <NextComponent />
      </Box>
    </>
  );
};

export default Intro;
