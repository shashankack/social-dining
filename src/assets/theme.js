import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#E25517",
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

    h1: {
      fontFamily: "Sink",
      color: "#000",
    },

    h6: {
      fontFamily: "League Spartan",
      color: "#F8F8EE",
    },
    body1: {
      color: "#FFFFF5",
    },
  },
});

export default theme;
