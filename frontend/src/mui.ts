import { createTheme } from "@mui/material";

const theme = createTheme(
  {
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "50px",
          },
        },
      },
    },
  },
  {
    shadows: Array(25).fill("none"),
  }
);

export default theme;
