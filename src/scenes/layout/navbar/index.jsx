import React, { useEffect, useState } from "react";
import { AppBar, Box, IconButton, InputBase, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { MenuOutlined, NotificationsOutlined, PersonOutlined, SearchOutlined, SettingsOutlined } from "@mui/icons-material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { ToggledContext } from "../../../App";
import { authFokus360, dbFokus360 as db } from "../../../data/firebase-config";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import colibri from "../../../assets/images/colibri.png";
import fokus360cinza from "../../../assets/images/fokus360cinza.png";
import { Link } from 'react-router-dom'; // Certifique-se de importar o Link
import { Avatar } from "@mui/material";

const Navbar = () => {
  const theme = useTheme();
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); // Para redirecionar após logout
   const [userRole, setUserRole] = useState(""); // Armazena o perfil do usuário logado
   const [userName, setUserName] = useState("");
   const [formValues, setFormValues] = useState({
     username: "",
     email: "",
     role: "",
     unidade: "",
     photoURL: "",
   });
     

   // esconde o botão do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {

      if (currentUser) {
        try {
          const docRef = doc(db, 'user', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserRole(data.role);
          } else {
            console.error('Dados do usuário não encontrados!');
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        setUserRole('');
      }
    });

    return () => unsubscribe();
  }, []);


// pega os dados do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
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
        } catch (error) {}
      } else {
        setUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);


//FUNÇÃO PARA BUSCAR A FOTO DO USUÁRIO NO BANCO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "user", currentUser.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormValues({
              photoURL: data.photoURL || "",    // Define o photoURL no estado
              username: data.username || "",
              // ...outros campos, se necessário
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      }
    });
  
    return () => unsubscribe();
  }, []);
  


  return (
    <>
      <Toolbar
        sx={{
          backgroundColor: "#f2f0f0",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <KeyboardDoubleArrowRightIcon
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ color: "#312783", marginRight: "10px" }}
        />

        <Typography
          variant="h8"
          component="div"
          sx={{ color: "#7f7f7f", fontSize: "10px" }}
        >
          Copyright © 2024 | Grupo Fokus
        </Typography>

        <Typography
          variant="h8"
          component="div"
          sx={{
            color: "#7f7f7f",
            display: "flex",
            alignItems: "flex-end",
            
            transform: "scale(0.7)",
          }}
        >
          Desenvolvido por:
          <img
            //src={colibri}
            //alt="Logo Colibri"
            style={{
              width: "100px",
              height: "auto",
              marginLeft: "-110px",
              marginRight: "20px",
            }}
          />
          Flow | Sistemas inteligentes
        </Typography>
      </Toolbar>

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
              bgcolor: "#312783", // Fundo azul
              color: "#00ebf7", // Ícone branco
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
              src={fokus360cinza}
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

          {userRole !== "01" &&
            userRole !== "02" &&
            userRole !== "03" &&
            userRole !== "04" &&
            userRole !== "05" &&
            userRole !== "06" &&
            userRole !== "07" &&
            userRole !== "09" &&
            userRole !== "10" &&
            userRole !== "11" && (
              <IconButton
                component={Link}
                to="/contacts"
                sx={{
                  color: "#312783",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <SettingsOutlined />
              </IconButton>
            )}

          <Avatar
            src={formValues.photoURL || ""}
            sx={{
              width: 45,
              height: 45,
              border: "2px solid #9d9d9c",
              borderRadius: 3,  // Define formato quadrado
            }}
          />


          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={theme.palette.text.secondary}
            >
              {user ? `Olá, ${username}` : ""}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Toolbar
        sx={{
          "&.MuiToolbar-root": {
            // &.MUI É A BIBLIOTECA
            height: "40px", // Define a altura fixa
            minHeight: "40px", // Define a altura mínima
            padding: "0", // Remove o padding
          },
          alignSelf: "center",
          backgroundColor: "#312783",
          width: "100%",
        }}
      >
        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <ArrowCircleRightIcon
            sx={{
              color: "#00ebf7",
              marginLeft: "15px",
              fontSize: "17px",
              marginLeft: "38px",
            }}
          />
        </IconButton>
        <Typography
          variant="h8"
          component="div"
          marginTop="3px"
          sx={{
            flexGrow: 1,
            color: "#c2c2c2",
            fontSize: "12px",
            marginBottom: "3px",
          }}
        >
          GRUPO FOKUS | www.grupofokus.com.br
        </Typography>
      </Toolbar>
    </>
  );
};

export default Navbar;

//{user ? `Olá, ${username || user.email}` : "Usuário não logado"}
//boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
//background: "linear-gradient(to right, #d8d8d8, #ffffff)",
