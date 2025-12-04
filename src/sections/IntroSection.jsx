import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const IntroSection = ({ onComplete }) => {
  const [showIntro, setShowIntro] = useState(false);
  const [showText, setShowText] = useState(false);
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    // Check if intro has been shown in this session
    const hasShownIntro = sessionStorage.getItem("introShown");

    if (!hasShownIntro) {
      setShowIntro(true);
      sessionStorage.setItem("introShown", "true");

      // Animation sequence
      const textTimer = setTimeout(() => {
        setShowText(true);
      }, 800);

      const shrinkTimer = setTimeout(() => {
        setShrink(true);
      }, 2500); // Show text for 1.7 seconds

      const completeTimer = setTimeout(() => {
        setShowIntro(false);
        if (onComplete) onComplete();
      }, 3300); // Complete immediately after shrink animation (2500 + 800ms shrink duration)

      return () => {
        clearTimeout(textTimer);
        clearTimeout(shrinkTimer);
        clearTimeout(completeTimer);
      };
    } else {
      // Skip intro, call onComplete immediately
      if (onComplete) onComplete();
    }
  }, [onComplete]);

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ scale: 1, width: "200vmax", height: "200vmax" }}
          animate={{
            scale: shrink ? 0.05 : 1,
            width: shrink ? "100px" : "200vmax",
            height: shrink ? "100px" : "200vmax",
          }}
          transition={{
            duration: shrink ? 0.8 : 0,
            ease: shrink ? [0.43, 0.13, 0.23, 0.96] : "linear",
          }}
          style={{
            backgroundColor: "#E25517",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <AnimatePresence>
            {showText && !shrink && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: { xs: 2, md: 3 },
                  alignItems: "center",
                  overflow: "hidden",
                  flexWrap: "nowrap",
                }}
              >
                {["A", "Close-Knit", "Social", "Club"].map((word, index) => (
                  <motion.div
                    key={word}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.43, 0.13, 0.23, 0.96],
                    }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        color: "#FFFFF5",
                        fontSize: { xs: "5vw", md: "3.5vw" },
                        fontWeight: 900,
                        textAlign: "center",
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {word}
                    </Typography>
                  </motion.div>
                ))}
              </Box>
            )}
          </AnimatePresence>
        </motion.div>
      </Box>
    </AnimatePresence>
  );
};

export default IntroSection;
