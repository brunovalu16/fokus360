import { createTheme } from "@mui/material";
import { createContext, useMemo, useState } from "react";

// Color Design Tokens
export const tokens = (mode) => ({
  gray: {
    100: "#141414",
    200: "#292929",
    300: "#3d3d3d",
    400: "#525252",
    500: "#666666",
    600: "#858585",
    700: "#a3a3a3",
    800: "#c2c2c2",
    900: "#e0e0e0",
  },
  primary: {
    100: "#040509",
    200: "#080b12",
    300: "#0c101b",
    400: "#fcfcfc",
    500: "#f2f0f0",
    600: "#434957",
    700: "#727681",
    800: "#a1a4ab",
    900: "#d0d1d5",
  },
  greenAccent: {
    100: "#0f2922",
    200: "#1e5245",
    300: "#2e7c67",
    400: "#3da58a",
    500: "#4cceac",
    600: "#5f53e5", //#70d8bd
    700: "#94e2cd",
    800: "#b7ebde",
    900: "#dbf5ee",
  },
  redAccent: {
    100: "#2c100f",
    200: "#58201e",
    300: "#832f2c",
    400: "#af3f3b",
    500: "#db4f4a",
    600: "#dc2626",
    700: "#e99592",
    800: "#f1b9b7",
    900: "#f8dcdb",
  },
  blueAccent: {
    100: "#e1e2fe",
    200: "#c3c6fd",
    300: "#a4a9fc",
    400: "#868dfb",
    500: "#6870fa",
    600: "#03c3f9",
    700: "#312783", //#583cff
    800: "#2a2d64",
    900: "#151632",
    1000: "#312783", //#5f53e5
    1100: "#6953fc",
    1200: "#6b62e0",
    1300: "#8a83f7",
    1400: "#312783"
  },
});

// Mui Theme Settings
export const themeSettings = () => {
  const colors = tokens("light"); // Sempre usa o tema claro

  return {
    palette: {
      mode: "light", // Força o modo claro
      primary: {
        main: colors.primary[100],
      },
      secondary: {
        main: colors.greenAccent[500],
      },
      neutral: {
        dark: colors.gray[700],
        main: colors.gray[500],
        light: colors.gray[100],
      },
      background: {
        default: colors.primary[500],
      },
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// Contexto para o Tema (fixo como claro)
export const ColorModeContext = createContext({
  toggleColorMode: () => {}, // Função desativada
});

export const useMode = () => {
  const [mode, setMode] = useState("light"); // Tema fixo como claro

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {}, // Função desabilitada
  }));

  const theme = useMemo(() => createTheme(themeSettings()), []);

  return [theme, colorMode];
};
