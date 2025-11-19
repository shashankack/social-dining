import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box
      minHeight="100vh"
      position="fixed"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
      width="100%"
      zIndex={5000}
      top={0}
      left={0}
      bottom={0}
      right={0}
    >
      <CircularProgress size={50} />
    </Box>
  );
};

export default Loader;
