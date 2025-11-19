import React from "react";
import { Box, Typography } from "@mui/material";

const PolaroidFrame = ({
  img = "/images/dummy.jpg",
  size = 300,
  bgcolor = "secondary.main",
  color = "background.default",
  text = "Matcha Event",
  boxShadow,
  cardBorder = false,
}) => {
  return (
    <Box
      mt={10}
      ml={10}
      position="relative"
      height={size * 1.7}
      width={size * 1.4}
      bgcolor={cardBorder ? bgcolor : "transparent"}
      pt={cardBorder ? size * 0.008 : 0}
      px={cardBorder ? size * 0.006 : 0}
      pb={cardBorder ? size * 0.04 : 0}
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
          fontSize={{ xs: size * 0.15, md: size * 0.12 }}
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
