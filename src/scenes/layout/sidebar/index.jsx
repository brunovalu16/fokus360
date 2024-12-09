import React, { useContext, useState } from "react";
import { Box, IconButton, Button, Divider, useTheme} from "@mui/material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  MenuOutlined,
  Home as HomeIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
  Source as SourceIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../assets/images/icone_logo.png";
import { tokens } from "../../../theme";
import { auth } from "../../../data/firebase-config";
import { ToggledContext } from "../../../App";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Função para logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Desloga o usuário
      navigate("/login"); // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <Sidebar
        backgroundColor={colors.blueAccent[1000]}
        rootStyles={{
          border: 0,
          height: "100%",
        }}
        collapsed={collapsed}
        onBackdropClick={() => setToggled(false)}
        toggled={toggled}
        breakPoint="md"
      >

        <Divider
            sx={{
              backgroundColor: colors.blueAccent[1300],
              height: "1px",
              width: "50%",
              marginTop: "px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingBottom: "2px"
            }}
          />

        
      

      <Menu
          menuItemStyles={{
            button: {
              color: "#c2c2c2",
              ":hover": {
                color: "#c3c6fd",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
        {/* Cabeçalho do Sidebar */}
        <MenuItem
              rootStyles={{
                margin: "35px 0 15px 10",
                marginTop: "10%",
                paddingBottom: "30%",
                color: colors.gray[100],
              }}
            >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{
                    width: "150px",
                    height: "auto",
                    marginLeft: "15px",
                    marginTop: "50px",
                    
                  }}
                  src={logo}
                  alt="Argon"
                />
              </Box>
            )}
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              sx={{ color: "#d0d1d5" }}
            >
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      {/* Itens do menu */}
      <Box mb={5} pl={collapsed ? undefined : "5%"}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0px",
        }}
      >
        <Menu
          menuItemStyles={{
            button: {
              color: "#c2c2c2",
              ":hover": {
                color: "#e1e2fe",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >



          <MenuItem>
            <Link
              to="/home"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "20px", // Espaço entre o ícone e o texto
                marginLeft: "7px",
              }}
            >
              <HomeIcon />
              Home
            </Link>
          </MenuItem>

          {/* início Links do menu */}

          <MenuItem>
            <Link
              to="/relatorios"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "20px", // Espaço entre o ícone e o texto
                marginLeft: "7px",
              }}
            >
              <AssessmentIcon />
              Relatórios
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              to="/arquivos"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "20px", // Espaço entre o ícone e o texto
                marginLeft: "7px",
              }}
            >
              <SourceIcon />
              Arquivos
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              to="/kanban"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "20px", // Espaço entre o ícone e o texto
                marginLeft: "7px",
              }}
            >
              <AssignmentTurnedInIcon />
              Tarefas
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              to="/contacts"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "20px", // Espaço entre o ícone e o texto
                marginLeft: "7px",
              }}
            >
              <PersonIcon />
              Usuários
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "20px", // Espaço entre o ícone e o texto
                marginLeft: "7px",
              }}
            >
              <PieChartIcon />
              Fokus360
            </Link>
          </MenuItem>
        </Menu>
      </Box>

      {/* fim Links do menu */}

      

      {/* Rodapé fixo */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "10px",
        }}
      >
        {/* Botão de Logout */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              width: "80%",
              paddingBottom: "40px",
              color: "#03c3f9",
              backgroundColor: "#5f53e5",
              boxShadow: "none",
              ":hover": {
                color: "#483dbd",
                background: "#5f53e5",
                transition: ".4s ease",
                boxShadow: "none",
              },
            }}
          >
            <LogoutIcon />
          </Button>
        </Box>

        <Divider
          sx={{
            backgroundColor: colors.blueAccent[1300],
            height: "1px",
            width: "50%",
            marginBottom: "10px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        {/* Adicionando logo ou imagem */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <img
            src="src/assets/images/fokus360-favicon.png"
            alt="Logo"
            style={{
              maxWidth: "50px",
              height: "auto",
            }}
          />
        </Box>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
