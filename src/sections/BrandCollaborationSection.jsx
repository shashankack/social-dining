import React from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import CrissCross from "../components/CrissCross";
import PolaroidFrame from "../components/PolaroidFrame";
import CTAButton from "../components/CTAButton";
import ImageMarquee from "../components/ImageMarquee";

const animationType = "scale"; // 'scale' or 'position'

const scaleVariants = {
  hidden: { scale: 0, rotate: 0 },
  visible: (img) => ({
    scale: 1,
    rotate: img.rotation || 0,
    transition: { duration: 0.4, ease: "easeOut" },
  }),
};

const positionVariants = {
  hidden: (img) => ({ ...img.fromPositions, rotate: 0 }),
  visible: (img) => ({
    ...img.positions,
    rotate: img.rotation || 0,
    transition: { duration: 0.4, ease: "easeOut" },
  }),
};

const itemVariants =
  animationType === "scale" ? scaleVariants : positionVariants;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const BrandCollaborationSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const images = [
    {
      src: "/images/dummy.jpg",
      fromPositions: { right: "-30%", bottom: 0 },
      positions: { top: -50, right: isMobile ? "15%" : "35%" },
      rotation: 10,
    },
    {
      src: "/images/dummy.jpg",
      fromPositions: { left: "-30%", top: "40%" },
      positions: {
        top: isMobile ? "8%" : "13%",
        left: isMobile ? "5%" : "34%",
      },
      rotation: -20,
    },
    {
      src: "/images/dummy.jpg",
      fromPositions: { right: "-30%", top: "25%" },
      positions: {
        top: isMobile ? "20%" : "25%",
        right: isMobile ? "20%" : "38%",
      },
      rotation: 20,
    },
    {
      src: "/images/dummy.jpg",
      fromPositions: { left: "-30%", bottom: "-20%" },
      positions: { bottom: 10, left: isMobile ? "5%" : "35%" },
      rotation: -15,
    },
  ];

  return (
    <Stack mt={{ xs: 10, md: 20 }}>
      <motion.div
        style={{ position: "relative" }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <CrissCross fontSize={{ xs: "26vw", md: "9vw" }} lineHeight={0.9} />
        {images.map((img, i) => (
          <motion.div
            key={i}
            custom={img}
            variants={itemVariants}
            style={{
              position: "absolute",
              zIndex: 2,
              ...(animationType === "scale" ? img.positions : {}),
            }}
          >
            <PolaroidFrame size={isMobile ? 140 : 220} boxShadow={8} />
          </motion.div>
        ))}
      </motion.div>
      <Box display="flex" justifyContent="center" alignItems="center" mt={6}>
        <Button
          variant="text"
          disableElevation
          disableRipple
          disableFocusRipple
          sx={{
            position: "relative",
            fontSize: { xs: "2rem", md: "4rem" },
            fontWeight: 800,
            fontFamily: "League Spartan",
            bgcolor: "transparent",
            transition: "all 0.3s ease",

            "&:hover": { transform: "scale(1.05)" },

            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: { xs: 15, md: 30 },
              width: "100%",
              height: { xs: "4px", md: "6px" },
              backgroundColor: (theme) => theme.palette.secondary.main,
              transform: "scaleX(1)",
              transformOrigin: "center center",
              transition: "transform 0.3s ease",
            },
            "&:hover::after": {
              transform: "scaleX(0)",
            },
          }}
        >
          Events gallery
        </Button>
      </Box>
      <Stack
        bgcolor="primary.main"
        py={{ xs: 4, md: 8 }}
        px={{ xs: 2, md: 6 }}
        spacing={6}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "11vw", md: "6vw" },
            color: "background.default",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Brand Collaboration
        </Typography>
        <Typography
          sx={{
            mt: 2,
            fontSize: { xs: "4vw", md: "2vw" },
            textAlign: "justify",
            fontWeight: 500,
            lineHeight: 1.2,

            "& strong": {
              mb: { xs: -2, md: -4 },
              display: "block",
              fontWeight: 800,
            },
          }}
        >
          <strong>Every brand has a story. Let’s tell it together.</strong>
          <br />
          At Social Dining, we invite brands to join our journey. We offer more
          than visibility we provide real connection through curated events,
          co-hosted dinners, themed experiences, and fun brand moments.
          Together, we can turn collaborations into meaningful stories and
          memorable impressions.
        </Typography>
        <Box>
          <CTAButton
            text="Collaborate now"
            primaryColor="background.default"
            secondaryColor="secondary.main"
            color="primary.main"
            fontSize={{ xs: "2rem", md: "2.4rem" }}
            borderRadius={{ xs: 6, md: 4 }}
            href="#"
          />
        </Box>
      </Stack>

      <Box py={{ xs: 2, md: 4 }}>
        <ImageMarquee
          size={{ xs: 300, md: 450 }}
          gap={{ xs: 2, md: 4 }}
          borderRadius={{ xs: 2, md: 4 }}
        />
      </Box>
    </Stack>
  );
};

export default BrandCollaborationSection;
