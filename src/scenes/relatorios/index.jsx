import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Header } from "../../components"; // Certifique-se de que o caminho está correto
import { auth, db } from "../../data/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { Divider } from "@mui/material";
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';


const Relatorios = () => {
  const navigate = useNavigate();
  const [activeContent, setActiveContent] = useState("Vendas");
  const [userRole, setUserRole] = useState(""); // Armazena o perfil do usuário logado
  const [visibleLinks, setVisibleLinks] = useState([]);

  // Regras para os links baseados no perfil
  const links = {
    "01": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "02": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Vendas"],
    "03": ["Vendas", "Financeiro", "Logística", "Vendas"],
    "04": ["Vendas", "Indústrias"],
    "05": ["Trade", "Indústrias"],
    "06": ["Indústrias"],
  };

  // Obter o perfil do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "user", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const role = docSnap.data().role;
            setUserRole(role);
            setVisibleLinks(links[role] || []);
          } else {
            console.error("Dados do usuário não encontrados!");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      } else {
        setUserRole("");
        setVisibleLinks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
        {/* Header */}
      <Box
            sx={{
              marginLeft: "40px",
              paddingTop: "50px",
            }}
          >
          <Header
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <AssessmentIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
                  <Typography>
                      GERENCIADOR DE RELATÓRIOS
                  </Typography>
                
              </Box>
            }
          />
      </Box>

      <Box
          sx={{
            marginLeft: "40px",
            marginTop: "-15px",
            width: "calc(100% - 80px)", // Para ajustar à tela considerando o margin de 40px
            minHeight: "50vh",
            padding: "15px",
            paddingLeft: "30px",
            borderRadius: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            bgcolor: "#f2f0f0",
            overflowX: "hidden",
          }}
        >

        <Box display="flex" alignItems="center" gap={1}>
            <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
            <Typography color="#858585">
                RELATÓRIOS
          </Typography>     
        </Box>

          <Box
            sx={{
              position: "relative", // Permite posicionar o ícone sobre o divisor
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "90%", // Largura do divisor
              marginBottom: "10px",
              marginTop: "15px",
            }}
          >
            {/* Divider */}
            <Divider
              sx={{
                position: "absolute", // Para garantir que o ícone fique sobre o divisor
                width: "100%",
                height: "1px",
                backgroundColor: "#ccc", // Cor do divisor
              }}
            />

            {/* Ícone */}
            <LocalGroceryStoreIcon
              sx={{
                color: "#5f53e5",
                fontSize: 25,
                zIndex: 1, // Garante que o ícone fique acima do divisor
                backgroundColor: "#f2f0f0", // Fundo branco para destacar o ícone
                padding: "0 4px", // Espaçamento para o fundo branco
                marginLeft: "103%",
              }}
            />
        </Box>
        

        {/* Conteúdo Principal */}
        <Box
          display="flex"
          borderRadius="20px"
          borderColor="1px solid #000"
          flexDirection={{ xs: "column", md: "row" }}
          width="100%"
          minHeight="calc(60vh - 80px)"
          sx={{
            overflowX: "hidden",
          }}
        >
          {/* Div de Menus */}
          <Box
            sx={{
              width: { xs: "100%", md: "30%" },
              backgroundColor: "f2f0f0",
              padding: { xs: 2, md: 3 },
              borderRight: "1px solid #d6d6d6",
            }}
          >
            {["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"].map((label) => (
              visibleLinks.includes(label) && ( // Exibe apenas os botões permitidos
                <Button
                  key={label}
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setActiveContent(label);
                    if (label === "Indústrias") {
                      navigate("/painelindustrias");
                    }
                  }}
                  sx={{
                    mb: 3,
                    borderRadius: "10px",
                    border: "1px solid",
                    boxShadow: "none",
                    backgroundColor: activeContent === label ? "#312783" : "#f2f0f0",
                    textTransform: "none",
                    borderColor: "#e0e0e0",
                    color: activeContent === label ? "#fff" : "#858585",
                    "&:hover": {
                      backgroundColor: "#312783",
                      color: "#fff",
                      boxShadow: "none",
                    },
                  }}
                >
                  {label}
                </Button>
              )
            ))}
          </Box>

          {/* Main Content */}
          <Box
            flex={1}
            padding={{ xs: 2, md: 3 }}
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            sx={{
              mb: 1,
              boxShadow: "none",
              color: "#727681",
              textTransform: "none",
              maxWidth: "60%",
              minWidth: "60%",
              overflow: "auto",
            }}
          >

            
            
            {activeContent === "Vendas" && visibleLinks.includes("Vendas") &&  (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  VENDAS X DEVOLUÇÃO
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  RELATÓRIO GERAL
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  EM CONSTRUÇÃO
                </Button>
              </>
            )}
            {activeContent === "Financeiro" && visibleLinks.includes("Financeiro") && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 1 financeiro
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 2 financeiro
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 3 financeiro
                </Button>
              </>
            )}
            {activeContent === "Logística" && visibleLinks.includes("Logística") && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 1 financeiro
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 2 financeiro
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 3 financeiro
                </Button>
              </>
            )}
            {activeContent === "Central de monitoramento" && visibleLinks.includes("Central de monitoramento") && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 1 financeiro
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 2 financeiro
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 3 financeiro
                </Button>
              </>
            )}
            {activeContent === "Indústrias" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 1 financeiro
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 2 financeiro
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 3 financeiro
                </Button>
              </>
            )}
            {activeContent === "Trade" && visibleLinks.includes("Trade") &&  (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 11 trade
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 12 trade
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 13 trade
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

// Estilo padrão dos botões principais
const mainButtonStyle = {
  mb: 2,
  backgroundColor: "#312783",
  color: "#fff",
  textTransform: "none",
  maxWidth: "50%",
  minWidth: "50%",
  marginLeft: "-50%",
  borderRadius: "10px",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#d6d6d6",
    boxShadow: "none",
  },
};

export default Relatorios;
