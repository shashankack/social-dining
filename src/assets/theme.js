import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#B55725",
    },
    secondary: {
      main: "#90BDF5",
    },
    background: {
      default: "#FFFFF5",
    },

    text: {
      primary: "#FFFFF5",
      secondary: "#000000",
    },
  },
  typography: {
    fontFamily: "Darker Grotesque",
    htmlFontSize: 15,

    h1: {
      fontFamily: "Sink",
      color: "#000",
      fontSize: "clamp(2.1rem, 8vw, 5.5rem)",
      lineHeight: 0.95,
    },

    h6: {
      fontFamily: "League Spartan",
      color: "#F8F8EE",
      fontSize: "clamp(1rem, 2.2vw, 1.5rem)",
    },
    body1: {
      color: "#FFFFF5",
      fontSize: "clamp(0.95rem, 1.6vw, 1.2rem)",
      lineHeight: 1.35,
    },
  },
});

export default theme;
