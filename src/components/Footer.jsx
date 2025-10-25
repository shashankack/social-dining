import React from "react";
import { Stack, Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Stack
      bgcolor="#000"
      justifyContent="center"
      alignItems="center"
      py={{ xs: 8, md: 10 }}
      gap={3}
    >
      <Box
        component="img"
        src="/images/logo.svg"
        width={{ xs: 120, md: 230 }}
        mb={2}
      />
      <Typography
        variant="h6"
        color="primary.main"
        textAlign="center"
        lineHeight={1}
      >
        Let’s create unforgettable <br />
        experiences together.
      </Typography>

      <Stack direction="row" gap={1}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "background.default",
          }}
        />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "secondary.main",
          }}
        />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "primary.main",
          }}
        />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "secondary.main",
          }}
        />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "background.default",
          }}
        />
      </Stack>

      <Stack alignItems="center">
        <Typography
          variant="h6"
          component="a"
          href="tel:+91776xxxxxxx"
          sx={{
            textDecoration: "none",
            fontSize: { xs: 20, md: 30 },
            transition: "color 0.3s ease",
            "&:hover": { color: "primary.main" },
          }}
        >
          +91 776xxxxxxx
        </Typography>
        <Typography
          variant="h6"
          component="a"
          href="mailto:socialdining.office@gmail.com"
          sx={{
            textDecoration: "none",
            fontSize: { xs: 20, md: 30 },
            transition: "color 0.3s ease",
            "&:hover": { color: "primary.main" },
          }}
        >
          socialdining.office@gmail.com
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Footer;
