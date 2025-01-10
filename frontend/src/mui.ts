import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    message: React.CSSProperties;
  }

  // allow configuration using `createTheme()`
  interface TypographyVariantsOptions {
    message?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    message: true;
  }
}

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
    custom: Palette["primary"];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
    custom?: PaletteOptions["primary"];
  }
}

const theme = createTheme(
  {
    typography: {
      message: {
        fontSize: 12,
        color: "#959393",
      },
    },
    palette: {
      primary: {
        main: "#ef930e", // couleur orange
        light: "#FFBF38",
        dark: "#cc8b3d", // couleur orange foncé (hover)
      },
      secondary: {
        main: "#949e80", // couleur vert
        dark: "#7f8a6f", // couleur vert foncé (hover)
      },
      tertiary: {
        main: "#EDEAE4", // couleur blanc cassé
        dark: "#e8eae3", // couleur blanc cassé foncé
      },
      text: {
        primary: "#333333", // couleur noir
        secondary: "#666666", // couleur gris
      },
      common: {
        white: "#ffffff",
        black: "#000000",
      },
      custom: {
        main: "#E0E0E0", // couleur gris clair
        dark: "#AFACAC", // couleur gris foncé
      },
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "50px",
            minWidth: "unset",
            color: "white",
            textTransform: "none",
          },
        },
        defaultProps: {
          variant: "contained",
        },
      },
      MuiStack: {
        defaultProps: {
          spacing: 2,
        },
      },
      MuiLink: {
        defaultProps: {
          fontFamily: "roboto",
        },
      },
      MuiTypography: {
        defaultProps: {
          fontFamily: "roboto",
        },
      },
      MuiPaper: {
        defaultProps: {
          variant: "outlined",
          square: true,
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              backgroundColor: "white",
              borderRadius: "20px",
            },
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            backgroundColor: "#ffbf38",
            fontWeight: 700,
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
