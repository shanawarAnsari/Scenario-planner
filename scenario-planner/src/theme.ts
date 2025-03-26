import { createTheme } from "@mui/material";

export const getDesignTokens = () => ({
  typography: {
    h6: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: "rgb(217, 23, 228)",
    },
    secondary: {
      main: "#000000",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

export const getTheme = () => {
  return createTheme(getDesignTokens());
};
