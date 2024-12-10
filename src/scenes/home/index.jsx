import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

export function Home() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    "Acompanhamento Comercial",
    "Intuitivo e Fácil de Operar",
    "Ambiente Seguro e Protegido",
  ];

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar */}
      

      {/* Drawer */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <List>
            {menuItems.map((text, index) => (
              <ListItem button key={index} onClick={() => navigate(`/${text.toLowerCase().replace(/ /g, "-")}`)}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" color="#583cff" gutterBottom>
            A forma mais simples e inteligente de acompanhar o resultado comercial da sua empresa.
          </Typography>
          <Typography variant="subtitle1">
            Menos tempo de operação e mais tempo de análise e planejamento.
          </Typography>
        </Box>

        <Box textAlign="center">
          <img
            src="/assets/img/tela_home_theecopiar.png"
            alt="Tela inicial"
            style={{ maxWidth: "100%", borderRadius: "10px" }}
          />
        </Box>

        <Box mt={4} display="flex" justifyContent="space-around" flexWrap="wrap">
          {menuItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: "100%", sm: "30%" },
                textAlign: "center",
                mb: 3,
                p: 2,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" color="#583cff">
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Footer */}
      <Box mt={6} textAlign="center" py={4} bgcolor="#f5f5f5">
        <img src="/images/logo_footer.svg" alt="Logo Footer" style={{ maxWidth: "150px" }} />
      </Box>
    </Box>
  );
}
