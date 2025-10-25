import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box
      minHeight="100vh"
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={50} />
    </Box>
  );
};

export default Loader;
