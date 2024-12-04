import { createTheme } from "@mui/material";

declare module '@mui/material/styles' {
  interface TypographyVariants {
    message: React.CSSProperties;
  }

  // allow configuration using `createTheme()`
  interface TypographyVariantsOptions {
    message?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    message: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}


const theme = createTheme({
  typography: {
    message: {
      fontSize: 12,
      color: '#959393',
    },
  },
  palette: {
    primary: {
      main: "#ef930e", // couleur orange
      light: "FFBF38",
    },
    secondary: {
      main: "#949e80" // couleur vert
    },
    tertiary: {
      main: "#EDEAE4" // couleur blanc cassé
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          minWidth: "unset",
          color: "white",
          textTransform: "none"
        },
      },
      defaultProps: {
        variant: "contained"
      }
    },
    MuiStack: {
      defaultProps: {
        spacing: 2,
      }
    },
    MuiLink: {
      defaultProps: {
        fontFamily: "roboto"
      }
    },
    MuiTypography: {
      defaultProps: {
        fontFamily: "roboto",
      }
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
        square: true
      }
    }
  },
},

{
  shadows: Array(25).fill("none"),
}

);

export default theme;
