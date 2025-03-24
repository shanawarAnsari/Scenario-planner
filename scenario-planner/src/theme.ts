import { createTheme } from "@mui/material";

export const getDesignTokens = () => ({
  typography: {
    fontFamily: "'Lato', sans-serif",
  },
  palette: {
    primary: {
      main: "#092acd",
    },
    secondary: {
      main: "#9c27b0",
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
