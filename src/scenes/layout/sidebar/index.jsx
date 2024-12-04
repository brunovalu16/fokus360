import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
} from "@mui/icons-material";
import { Divider } from "@mui/material";


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
          <Item
            title="Dashboard"
            path="/"
            colors={colors}
            icon={<DashboardOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Data" : " "}
        </Typography>{" "}
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
          <Item
            title="Manage Team"
            path="/team"
            colors={colors}
            icon={<PeopleAltOutlined />}
          />
          <Item
            title="Contacts Information"
            path="/contacts"
            colors={colors}
            icon={<ContactsOutlined />}
          />
          <Item
            title="Invoices Balances"
            path="/invoices"
            colors={colors}
            icon={<ReceiptOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[800]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Pages" : " "}
        </Typography>
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
          <Item
            title="Profile Form"
            path="/form"
            colors={colors}
            icon={<PersonOutlined />}
          />
          <Item
            title="Calendar"
            path="/calendar"
            colors={colors}
            icon={<CalendarTodayOutlined />}
          />
          <Item
            title="FAQ Page"
            path="/faq"
            colors={colors}
            icon={<HelpOutlineOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[800]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Charts" : " "}
        </Typography>
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
          <Item
            title="Bar Chart"
            path="/bar"
            colors={colors}
            icon={<BarChartOutlined />}
          />
          <Item
            title="Pie Chart"
            path="/pie"
            colors={colors}
            icon={<DonutLargeOutlined />}
          />
          <Item
            title="Line Chart"
            path="/line"
            colors={colors}
            icon={<TimelineOutlined />}
          />
          

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
