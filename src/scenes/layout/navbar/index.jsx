import React, { useEffect, useState, useContext } from "react";
import { AppBar, Box, IconButton, InputBase, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { MenuOutlined, NotificationsOutlined, PersonOutlined, SearchOutlined, SettingsOutlined } from "@mui/icons-material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { ToggledContext } from "../../../App";
import { authFokus360, dbFokus360 as db } from "../../../data/firebase-config";
import { updateDoc } from "firebase/firestore"; // IMPORTAR updateDoc
import { NotificationContext } from "../../../context/NotificationContext";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";


import TaskAltIcon from "@mui/icons-material/TaskAlt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { collection, query, where, getDocs  } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import fokus360cinza from "../../../assets/images/fokus360cinza.png";
import { Link } from 'react-router-dom'; // Certifique-se de importar o Link

//Importando o contador de data
import { getDataHojeFormatada } from "../../../utils/formatDate";

const Navbar = () => {
  const theme = useTheme();
  const { notifications, setNotifications } = useContext(NotificationContext);
  const [anchorEl, setAnchorEl] = useState(null);
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



//buscar notificações não lidas para o user.uid
useEffect(() => {
  const fetchNotifications = async () => {
    if (!user) return;

    const q = query(
      collection(db, "notificacoes"),
      where("userId", "==", user.uid),
      where("lido", "==", false)
    );

    const querySnapshot = await getDocs(q);

    setNotifications(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        mensagem: doc.data().mensagem,
      }))
    );
  };

  fetchNotifications();
}, [user, setNotifications]);



// função que carrega as notificações na caixa de mensagens
const handleNotificationsClick = async (event) => {
  setAnchorEl(event.currentTarget);

  if (!user?.uid) return;

  const q = query(
    collection(db, "notificacoes"),
    where("userId", "==", user.uid),
    where("lido", "==", false)
  );

  const querySnapshot = await getDocs(q);

  setNotifications(
    querySnapshot.docs.map((doc) => ({
      id: doc.id,
      mensagem: doc.data().mensagem,
    }))
  );
};


// Fechar popup
const handleNotificationsClose = () => {
  setAnchorEl(null);
};

const open = Boolean(anchorEl);


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
  

// função para marcar notificação como lida
  const handleMarkAsRead = async (notificationId) => {
    try {
      const notifRef = doc(db, "notificacoes", notificationId);
      await updateDoc(notifRef, { lido: true });
  
      // Atualizar localmente (remove a notificação da lista atual)
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };


  return (
    <>



{/* CAIXA DE MENSAGEM */}

<Popover
  open={open}
  anchorEl={anchorEl}
  onClose={handleNotificationsClose}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "right",
  }}
  transformOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
  slotProps={{
  paper: {
    sx: {
      mt: 1.5,
      width: 390,
      maxHeight: 460,
      borderRadius: "18px",
      overflow: "visible",
      boxShadow: "0 18px 45px rgba(15, 23, 42, 0.22)",
      border: "1px solid rgba(49, 39, 131, 0.10)",
    },
  },
}}
>
  <Box
    sx={{
      background: "linear-gradient(135deg, #312783 0%, #4f46e5 55%, #00bcd4 130%)",
      px: 2.3,
      py: 2,
      color: "#fff",
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center" gap={1.3}>
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: "rgba(255,255,255,0.16)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <NotificationsActiveIcon fontSize="small" />
        </Avatar>

        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 800, lineHeight: 1 }}>
            Central de Notificações
          </Typography>

          <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.78)", mt: 0.5 }}>
            Atualizações recentes do FOKUS 360
          </Typography>
        </Box>
      </Box>

      <Chip
        label={`${notifications.length} nova${notifications.length === 1 ? "" : "s"}`}
        size="small"
        sx={{
          bgcolor: "rgba(255,255,255,0.18)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 11,
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      />
    </Box>
  </Box>

  <List
    sx={{
      p: 0,
      maxHeight: 360,
      overflowY: "auto",
      bgcolor: "#f8fafc",
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#cbd5e1",
        borderRadius: "10px",
      },
    }}
  >
    {notifications.length === 0 ? (
      <Box
        sx={{
          px: 3,
          py: 4,
          textAlign: "center",
          bgcolor: "#fff",
        }}
      >
        <Avatar
          sx={{
            width: 52,
            height: 52,
            mx: "auto",
            mb: 1.5,
            bgcolor: "#eef2ff",
            color: "#312783",
          }}
        >
          <CheckCircleOutlineIcon />
        </Avatar>

        <Typography sx={{ fontWeight: 800, color: "#1e293b", fontSize: 15 }}>
          Nenhuma notificação
        </Typography>

        <Typography sx={{ color: "#64748b", fontSize: 13, mt: 0.5 }}>
          Você está em dia com suas atualizações.
        </Typography>
      </Box>
    ) : (
      notifications.map((noti, index) => (
        <React.Fragment key={noti.id}>
          <ListItem
          component="button"
            onClick={() => handleMarkAsRead(noti.id)}
            sx={{
              px: 2,
              py: 1.6,
              cursor: "pointer",
              bgcolor: "#fff",
              transition: "all 0.2s ease",
              alignItems: "flex-start",
              "&:hover": {
                bgcolor: "#f1f5ff",
                transform: "translateX(2px)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                mr: 1.5,
                bgcolor: "#eef2ff",
                color: "#312783",
                boxShadow: "0 6px 14px rgba(49, 39, 131, 0.12)",
              }}
            >
              <TaskAltIcon fontSize="small" />
            </Avatar>

            <ListItemText
              primary={
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: "#1e293b",
                    }}
                  >
                    Nova atualização
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#94a3b8",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Agora
                  </Typography>
                </Box>
              }
              secondary={
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    mt: 0.4,
                    fontSize: 12.5,
                    lineHeight: 1.45,
                    color: "#475569",
                  }}
                >
                  {noti.mensagem}
                </Typography>
              }
            />

            <Tooltip title="Marcar como lida">
              <CheckCircleOutlineIcon
                sx={{
                  ml: 1,
                  mt: 0.4,
                  fontSize: 18,
                  color: "#94a3b8",
                  "&:hover": {
                    color: "#312783",
                  },
                }}
              />
            </Tooltip>
          </ListItem>

          {index < notifications.length - 1 && <Divider sx={{ borderColor: "#eef2f7" }} />}
        </React.Fragment>
      ))
    )}
  </List>
</Popover>



      

      <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={5} // Diminui padding
          sx={{
            backgroundColor: "#e8e5e5",
            height: "60px", // Altura menor
          }}
      >
        {/* Conteúdo do Box */}

        
        <Box display="flex" alignItems="center" gap={2}>
          {/* Campo de Pesquisa */}


          {/* 

          //campo pesquisa global
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
          */}
          

          
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

          <IconButton onClick={handleNotificationsClick}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsOutlined />
            </Badge>
          </IconButton>


          {userRole === "08" && (
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
            height: "25px", // Define a altura fixa
            minHeight: "20px", // Define a altura mínima
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
              fontSize: "15px",
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
            fontSize: "10px",
            marginBottom: "3px",
          }}
        >
          GRUPO FOKUS | www.grupofokus.com.br
        </Typography>

        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <CalendarMonthIcon
            sx={{
              color: "#00ebf7",
              marginLeft: "15px",
              fontSize: "18px",
              marginLeft: "38px",
            }}
          />
        </IconButton>

        <Typography variant="body2" sx={{ color: "#c8c6c6", flexGrow: 0.05 }}>
              Data atual: {getDataHojeFormatada().split("-").reverse().join("/")}
            </Typography>
      </Toolbar>
    </>
  );
};

export default Navbar;

//{user ? `Olá, ${username || user.email}` : "Usuário não logado"}
//boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
//background: "linear-gradient(to right, #d8d8d8, #ffffff)",
