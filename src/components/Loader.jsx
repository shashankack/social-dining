import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";

// spin animation for the circle
const rotation = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// pulsing keyframes for each letter
const letterPulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.6;
  }
`;

const Loader = () => {
  const text = "Loading...";

  return (
    <Box
      sx={{
        position: "fixed",          // ensure it covers the viewport
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.85)", // semi-dark backdrop
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        zIndex: 9999,               // make sure it’s on top of everything
      }}
    >
      {/* Spinner circle */}
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "2px solid #B55725",
          position: "relative",
          boxSizing: "border-box",
          animation: `${rotation} 1s linear infinite`,
          "&::after": {
            content: '""',
            position: "absolute",
            left: 4,
            top: 4,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "#B55725",
            boxSizing: "border-box",
          },
        }}
      />

      {/* Pulsing letters, one after another */}
      <Box
        component="h3"
        sx={{
          display: "flex",
          gap: "0.25ch",
          fontSize: "1.25rem",
          fontWeight: 500,
          color: "#B55725",
          letterSpacing: "0.05em",
        }}
      >
        {text.split("").map((char, idx) => (
          <Box
            key={idx}
            component="span"
            sx={{
              display: "inline-block",
              animation: `${letterPulse} 1s ease-in-out infinite`,
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            {char}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Loader;
