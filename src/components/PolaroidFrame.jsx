import React from "react";
import { Box, Typography } from "@mui/material";

const scaleSingleValue = (value, factor) => {
  if (typeof value === "number") {
    return value * factor;
  }

  if (typeof value === "string") {
    return `calc(${value} * ${factor})`;
  }

  return value;
};

const scaleResponsiveValue = (value, factor) => {
  if (Array.isArray(value)) {
    return value.map((entry) =>
      entry === null || entry === undefined
        ? entry
        : scaleSingleValue(entry, factor),
    );
  }

  if (value && typeof value === "object") {
    const scaled = {};
    Object.keys(value).forEach((key) => {
      scaled[key] = scaleSingleValue(value[key], factor);
    });
    return scaled;
  }

  return scaleSingleValue(value, factor);
};

const PolaroidFrame = ({
  img = "/images/dummy.jpg",
  size = 300,
  bgcolor = "secondary.main",
  color = "background.default",
  text = "Matcha Event",
  boxShadow,
  cardBorder = false,
}) => {
  const frameHeight = scaleResponsiveValue(size, 1.7);
  const frameWidth = scaleResponsiveValue(size, 1.4);
  const cardPt = scaleResponsiveValue(size, 0.008);
  const cardPx = scaleResponsiveValue(size, 0.006);
  const cardPb = scaleResponsiveValue(size, 0.04);
  const labelFontSize = scaleResponsiveValue(size, 0.12);

  return (
    <Box
      mt={10}
      ml={10}
      position="relative"
      height={frameHeight}
      width={frameWidth}
      bgcolor={cardBorder ? bgcolor : "transparent"}
      pt={cardBorder ? cardPt : 0}
      px={cardBorder ? cardPx : 0}
      pb={cardBorder ? cardPb : 0}
      boxShadow={boxShadow}
    >
      <Box
        component="img"
        src={img}
        sx={{ width: "100%", objectFit: "cover", height: "100%" }}
      />
      {cardBorder && (
        <Typography
          variant="h1"
          width="100%"
          color={color}
          textAlign="center"
          fontSize={labelFontSize}
          sx={{
            position: "absolute",
            bottom: { xs: "4%", md: "6%" },
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default PolaroidFrame;
