import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Header } from "../../components"; // Certifique-se de que o caminho está correto
import { auth, db } from "../../data/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
          marginLeft: "70px",
          paddingTop: "50px",
        }}
      >
        <Header
          title="RELATÓRIOS DO GRUPO FOKUS"
          subtitle="Visualize todos os relatórios do Grupo Fokus por departamentos."
        />
      </Box>

      <Box
        m="50px auto"
        width="90%"
        minHeight="50vh"
        bgcolor="#fff"
        sx={{
          overflowX: "hidden",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Typography variant="h4" mb={3} fontWeight="bold" color="#583cff">
          Relatórios
        </Typography>

        {/* Conteúdo Principal */}
        <Box
          display="flex"
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
              backgroundColor: "#fff",
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
                    backgroundColor: activeContent === label ? "#583cff" : "#fff",
                    textTransform: "none",
                    borderColor: "#e0e0e0",
                    color: activeContent === label ? "#fff" : "#858585",
                    "&:hover": {
                      backgroundColor: "#583cff",
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
  backgroundColor: "#583cff",
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
