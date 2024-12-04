import {
  Box,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import {
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SearchOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { useContext } from "react";
import { ToggledContext } from "../../../App";

const Navbar = () => {
  const theme = useTheme();
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isXsDevices = useMediaQuery("(max-width:466px)");

  const avatar = "link-do-avatar.png"; // Substitua pelo caminho correto do avatar

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" p={5}>
      {/* Menu e barra de busca */}
      <Box display="flex" alignItems="center" gap={2}>
        {/* Botão para alternar Sidebar */}
        <IconButton
          onClick={() => setToggled(!toggled)} // Alterna o estado do Sidebar
          sx={{ color: "#292929" }}
        >
          <MenuOutlined />
        </IconButton>

        {/* Barra de busca */}
        <Box
          display="flex"
          alignItems="center"
          bgcolor="#e0e0e0"
          borderRadius="3px"
          sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
        >
          <InputBase placeholder="Pesquisar..." sx={{ ml: 2, flex: 1 }} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchOutlined />
          </IconButton>
        </Box>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        gap={2}
        padding="5px"
        paddingRight="20px"
        paddingLeft="20px"
        sx={{
          borderLeft: "1px solid #a1a4ab",
          height: "30px", 
          paddingLeft: "30px",
        }}
      >
        <IconButton>
          <NotificationsOutlined />
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton>

        {/* Adicionando Avatar com Ícone Sobreposto */}
        <Box display="flex" alignItems="center" gap={2} position="relative">
          {/* Ícone em vez do Avatar */}
          <Box
            sx={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: "#5f53e5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PersonOutlined sx={{ fontSize: "24px", color: "#fff" }} />
          </Box>
        </Box>

        {/* Texto ao lado do Avatar */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={theme.palette.text.secondary}
          >
            Olá, Elton
          </Typography>
          <Typography
            variant="body2"
            fontWeight="500"
            color={theme.palette.primary.main}
          >
            {/*Bem-vindo*/}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
