import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar, NavbarKanban } from "./scenes";
import { Outlet, useLocation } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext"; // Importado

export const ToggledContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  const location = useLocation(); // Pegando a rota atual

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider> {/* Notification Provider AQUI */}
          <ToggledContext.Provider value={values}>
            <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
              <SideBar />
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  maxWidth: "100%",
                }}
              >

                {/* Navbar condicional */}
                {location.pathname === "/kanban" ? <NavbarKanban /> : <Navbar />}

                <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                  <Outlet />
                </Box>
              </Box>
            </Box>
          </ToggledContext.Provider>
        </NotificationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
