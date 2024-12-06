import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { BarChartOutlined, CalendarTodayOutlined, DashboardOutlined, DonutLargeOutlined, HelpOutlineOutlined, MenuOutlined, PersonOutlined } from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PieChartIcon from '@mui/icons-material/PieChart';
import ArchiveIcon from '@mui/icons-material/Archive';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Divider } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import SourceIcon from '@mui/icons-material/Source';



import logo from "../../../assets/images/icone_logo.png";
import Item from "./Item";
import { ToggledContext } from "../../../App";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
    <Menu
        menuItemStyles={{
          button: {
            color: "#c2c2c2", // Cor padrão do texto dos itens
            ":hover": {
              color: "#c3c6fd", // Cor ao passar o mouse
              background: "transparent",
              transition: ".4s ease",
            },
          },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "35px 0 15px 10",
            marginTop: "10px",
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
                  style={{ width: "80px", height: "50px", marginLeft: "15px", marginTop: "20px", marginBottom: "10px" }}
                  src={logo}
                  alt="Argon"
                />
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.gray[800]}
                >
                 </Typography>
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

      
          <Box
              sx={{
                my: 2, // Margem vertical
                mx: "auto", // Centraliza horizontalmente
                width: "80%", // Define a largura da linha (80% da largura do container)
              }}
            >
              <Divider sx={{ backgroundColor: colors.blueAccent[1300], height: "1px" }} />
          </Box>


      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
          <Menu
            menuItemStyles={{
              button: {
                color: "#c2c2c2", // Cor padrão dos links
                ":hover": {
                  color: "#e1e2fe", // Cor dos links ao passar o mouse
                  background: "transparent",
                  transition: ".4s ease",
                },
              },
            }}
          >
            
          </Menu>
          
        
        
        <Menu
          menuItemStyles={{
            button: {
              color: "#c2c2c2", // Cor padrão dos links
              //marginBottom: "10px",
              ":hover": {
                color: "#e1e2fe", // Cor dos links ao passar o mouse
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Home"
            path="/relatorios"
            colors={colors}
            icon={<HomeIcon />}
          />
          <Item
            title="Relatórios"
            path="/relatorios"
            colors={colors}
            icon={<AssessmentIcon />}
          />
          <Item
            title="Arquivos"
            path="/contacts"
            colors={colors}
            icon={<SourceIcon />}
            //icon={<ContactsOutlined />}
            
          />
          <Item
            title="Tarefas"
            path="/kanban"
            colors={colors}
            icon={<AssignmentTurnedInIcon />}
          />
          <Item
            title="Usuários "
            path="/contacts"
            colors={colors}
            icon={<PersonIcon />}
            //icon={<ContactsOutlined />}
          />
          <Item
              title="Fokus360"
              path="/dashboard"
              colors={colors}
              icon={<PieChartIcon />}
            />
        </Menu>
        {/* 
        <Typography
          variant="h6"
          color={colors.gray[800]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Pages" : " "}
        </Typography>
        */}
        <Menu
          menuItemStyles={{
            button: {
              color: "#c2c2c2", // Cor padrão dos links
              ":hover": {
                color: "#e1e2fe", // Cor dos links ao passar o mouse
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          
          
          
        </Menu>
        <Menu
          menuItemStyles={{
            button: {
              color: "#c2c2c2", // Cor padrão dos links
              ":hover": {
                color: "#e1e2fe", // Cor dos links ao passar o mouse
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          
            {/* Adicionando linha horizontal de separação */}
            <Box
              sx={{
                my: 2, // Margem vertical
                mx: "auto", // Centraliza horizontalmente
                width: "80%", // Define a largura da linha (80% da largura do container)
              }}
            >
              <Divider sx={{ backgroundColor: colors.blueAccent[1300], height: "1px" }} />
            </Box>

            {/* Adicionando logo ou imagem */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >
              <img
                src="src/assets/images/fokus360-favicon.png" // Caminho atualizado para a nova logo
                alt="Logo"
                style={{
                  maxWidth: "50px", // Ajuste para limitar o tamanho
                  height: "auto", // Manter proporção
                }}
              />
          </Box>
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
