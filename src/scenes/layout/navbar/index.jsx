import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SearchOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { ToggledContext } from "../../../App";
import { auth, db } from "../../../data/firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const theme = useTheme();
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); // Para redirecionar após logout
 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Buscar username no Firestore
        try {
          const docRef = doc(db, "user", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUsername(docSnap.data().username);
          } else {
            
          }
        } catch (error) {
          
        }
      } else {
        setUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

  

  // Função para deslogar
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
  
  <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={5}
        sx={{
          backgroundColor: "#e8e5e5",
          
        }}
      >
      
      {/* Conteúdo do Box */}

      
      {/* Input */}
      <Box display="flex" alignItems="center" gap={2}>
          {/* Campo de Pesquisa */}
          <Box
            display="flex"
            alignItems="center"
            bgcolor="#ffffff" // Fundo branco para o box
            padding="4px"
            sx={{
              display: `${isXsDevices ? "none" : "flex"}`,
            }}
          >
            <InputBase placeholder="Pesquisar..." sx={{ ml: 2, flex: 1 }} />
          </Box>

          

          {/* Botão de Pesquisa */}
          <IconButton
            type="button"
            sx={{
              p: 0.7,
              bgcolor: "#5f53e5", // Fundo azul
              color: "#ffffff", // Ícone branco
              borderRadius: "1%", // Faz o botão ser circular
              marginLeft: "-7%", // Faz o botão ser
              padding: "8px",
              "&:hover": {
                bgcolor: "#4a43cc", // Efeito hover (opcional)
              },
            }}
          >
            <SearchOutlined />
          </IconButton>
      </Box>

      
      {/* Parte direita */}
      <Box display="flex" alignItems="center" gap={2}>

          {/* Adicionando logo ou imagem */}
          <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="src/assets/images/fokus360cinza.png"
                alt="Logo"
                style={{
                  maxWidth: "150px",
                  height: "auto",
                }}
              />
          </Box>

          {/* Linha vertical */}
          <Box
            sx={{
              width: "1px",
              height: "35px", // Ajuste conforme necessário
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              marginLeft: "20px",
              marginRight: "10px",
            }}
          />

          <IconButton>
            <NotificationsOutlined />
          </IconButton>
          
          <IconButton>
            <SettingsOutlined />
          </IconButton>

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

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={theme.palette.text.secondary}
            >
              {user ? `Olá, ${username}` : "Usuário não logado"}
            </Typography>
          </Box>

          <AppBar
        position="relative"
        sx={{
          width: "100%",
          top: 0,
          width: "80%",
          right: 0,
          zIndex: 1000,
          backgroundColor: "#583cff",
          top: "104px",
        }}
      >
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu">
            <MenuOutlined />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GRUPO FOKUS
          </Typography>
          <IconButton>
            <PersonOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>

      </Box>
  </Box>
  );
};

export default Navbar;


//{user ? `Olá, ${username || user.email}` : "Usuário não logado"}
//boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
//background: "linear-gradient(to right, #d8d8d8, #ffffff)",
