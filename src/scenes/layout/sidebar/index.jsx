import React, { useContext, useState } from "react";
import { Box, IconButton, Button, Divider, useTheme } from "@mui/material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  MenuOutlined,
  Home as HomeIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
  Source as SourceIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  PowerSettingsNew as LogoutIcon,
} from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../assets/images/icone_logo.png";
import { tokens } from "../../../theme";
import { auth } from "../../../data/firebase-config";
import { ToggledContext } from "../../../App";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <Sidebar
      backgroundColor="#f2f0f0"
      rootStyles={{
        border: 0,
        height: "100vh",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: collapsed ? "60px" : "250px", // Ajusta dinamicamente
        transition: "width 0.3s ease", // Transição suave
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      {/* Botão de Recolher */}
      <IconButton
        onClick={() => setCollapsed(!collapsed)}
        sx={{
          color: "#312783",
          margin: "10px auto", // Centraliza horizontalmente
          marginLeft: "20px",
          transition: "all 0.3s ease", // Suaviza a transição
        }}
      >
        <MenuOutlined />
      </IconButton>

      {/* Imagem no Topo */}
      {!collapsed && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            transition: "all 0.8s ease", // Transição suave
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "100px", // Tamanho da logo
              height: "auto",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          />
        </Box>
      )}

      <Divider
        sx={{
          backgroundColor: colors.gray[1000],
          height: "1px",
          width: "50%",
          margin: "20px auto",
        }}
      />

      {/* Itens do Menu */}
      <Box
        mb={5}
        pl={collapsed ? undefined : "19%"}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          marginLeft: "7px",
        }}
      >
        <Menu
          menuItemStyles={{
            button: {
              color: "#312783",
              ":hover": {
                color: "#00ebf7",
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
                gap: "20px",
              }}
            >
              <HomeIcon />
              Home
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              to="/relatorios"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "20px",
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
                gap: "20px",
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
                gap: "20px",
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
                gap: "20px",
              }}
            >
              <PermContactCalendarIcon />
              Usuários
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              to="/projetos"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <PieChartIcon />
              Fokus360
            </Link>
          </MenuItem>
        </Menu>
      </Box>

      {/* Rodapé */}
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
            marginBottom: "10px",
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              width: collapsed ? "3px" : "50%",
              borderRadius: "5px",
              height: "40px",
              padding: "10px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#f2f0f0",
              boxShadow: "none",
              transition: "all 0.1s ease", // Transição suave
              ":hover": {
                backgroundColor: "#f2f0f0",
                boxShadow: "none",
                color: "#00ebf7"
              },
            }}
          >
            <LogoutIcon
              sx={{
                fontSize: "25px",
                color: "#312783",
                ":hover": {
                  boxShadow: "none",
                  color: "#00ebf7",
                  transition: "all 0.3s ease", // Transição suave
              },
              }}
            />
            {!collapsed && ""}
          </Button>
        </Box>

        <Divider
          sx={{
            backgroundColor: colors.gray[1000],
            height: "1px",
            width: "50%",
            margin: "10px auto",
          }}
        />

        {/* Imagem no Rodapé */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <img
            src="src/assets/images/icon_logo.png"
            alt="Logo"
            style={{
              maxWidth: "30px",
              height: "auto",
            }}
          />
        </Box>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
