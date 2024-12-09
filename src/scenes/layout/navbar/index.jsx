import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Button,
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
  const { toggled, setToggled } = useContext(ToggledContext);
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
    <Box display="flex" alignItems="center" justifyContent="space-between" p={5}>
      {/* Parte esquerda */}
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          onClick={() => setToggled(!toggled)}
          sx={{ color: "#292929" }}
        >
          <MenuOutlined />
        </IconButton>

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

      {/* Parte direita */}
      <Box display="flex" alignItems="center" gap={2}>
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
      </Box>
    </Box>
  );
};

export default Navbar;


//{user ? `Olá, ${username || user.email}` : "Usuário não logado"}
