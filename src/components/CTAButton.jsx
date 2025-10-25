import React from "react";
import { Box, Button } from "@mui/material";

const CTAButton = ({
  href,
  primaryColor = "primary.main",
  secondaryColor = "secondary.main",
  color = "background.default",
  text = "Click Me",
  onClick,
  borderRadius,
  fontSize,
}) => {
  return (
    <Box width={"100%"}>
      <Button
        fullWidth
        disableElevation
        href={href}
        onClick={onClick}
        variant="contained"
        sx={{
          width: "100%",
          fontSize,
          fontFamily: "League Spartan, sans-serif",
          backgroundColor: primaryColor,
          color,
          fontWeight: 800,
          padding: { xs: "8px 24px 0px", md: "10px 24px 0px" },
          borderRadius,
          transition: "all 0.3s ease",
          boxShadow: (theme) => {
            let color = secondaryColor;
            if (
              typeof secondaryColor === "string" &&
              secondaryColor.includes(".")
            ) {
              const [paletteKey, shade] = secondaryColor.split(".");
              color = theme.palette?.[paletteKey]?.[shade] ?? secondaryColor;
            }
            return `4px 4px 0px ${color}`;
          },
          "&:hover": {
            boxShadow: "none",
          },
        }}
      >
        {text}
      </Button>
    </Box>
  );
};

export default CTAButton;
