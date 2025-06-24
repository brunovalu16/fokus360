import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Modal } from "@mui/material";
import { Header } from "../../components"; // Certifique-se de que o caminho está correto
import { dbFokus360, storageFokus360 } from "../../data/firebase-config";

import { authFokus360 } from "../../data/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { Divider } from "@mui/material";
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from 'react-router-dom';


const Relatorios = () => {
  const navigate = useNavigate();
  const [activeContent, setActiveContent] = useState("Vendas");
  const [userRole, setUserRole] = useState(""); // Armazena o perfil do usuário logado
  const [visibleLinks, setVisibleLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado do modal


  // Regras para os links baseados no perfil
  const links = {
    "01": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "02": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "03": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "04": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "05": ["Trade", "Indústrias"],
    "06": ["Indústrias"],
    "07": ["Projetos"],
    "08": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "09": ["Trade", "Indústrias"],
    "10": ["Trade", "Indústrias"],
    "11": ["Trade", "Indústrias"],
    "12": ["Projetos"],
    "13": ["Projetos"],
    "14": ["Projetos"],
    "15": ["Projetos"],
    "16": ["Projetos"],
    "17": ["Projetos"],
    "18": ["Projetos"],
    "19": ["Financeiro", "Indústrias"],
    "20": ["Financeiro", "Indústrias"],
    "21": ["Financeiro", "Indústrias"],
    "22": ["Projetos"],
    "23": ["Projetos"],
    "24": ["Projetos"],
    "25": ["Logística", "Indústrias"],
    "26": ["Logística", "Indústrias"],
    "27": ["Logística", "Indústrias"],
    "28": ["Projetos"],
    "29": ["Projetos"],
    "30": ["Projetos"],
    "31": ["Projetos"],
    "32": ["Projetos"],
    "33": ["Projetos"],
    "34": ["Central de monitoramento", "Indústrias"],
    "35": ["Central de monitoramento", "Indústrias"],
    "36": ["Central de monitoramento", "Indústrias"],
    "37": ["Projetos"],
    "38": ["Projetos"],
    "39": ["Projetos"],
    "40": ["Projetos"],
    "41": ["Projetos"],
    "42": ["Projetos"],
    "43": ["Projetos"],
    "44": ["Projetos"],
    "45": ["Projetos"],
    "46": ["Projetos"],
    "47": ["Projetos"],
    "48": ["Projetos"],
    "49": ["Projetos"],
    "50": ["Projetos"],
    "51": ["Projetos"],
  };



  const rolesQueMostramModal = [
  "07", "12", "13", "14", "15", "16", "17", "18", "22", "23", "24", "28", "29", "30",
  "31", "32", "33", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51"
];



  // Obter o perfil do usuário logado
 useEffect(() => {
  const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
    console.log("🧪 Usuário logado:", currentUser); // <--- TESTE

    if (currentUser) {
      try {
        const docRef = doc(dbFokus360, "user", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const roleRaw = docSnap.data().role;
          const role = String(roleRaw).padStart(2, "0");
          console.log("🧪 Role detectado:", role); // <--- TESTE

          setUserRole(role);
          setVisibleLinks(links[role] || []);

          if (rolesQueMostramModal.includes(role)) {
            console.log("✅ Modal deve aparecer"); // <--- TESTE
            setIsModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }
  });

  return () => unsubscribe();
}, []);


  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
              <Typography>GERENCIADOR DE RELATÓRIOS</Typography>
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
          position: "relative", // Permite que o modal fique preso neste container
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
          <Typography color="#858585">RELATÓRIOS</Typography>
        </Box>



        {/* Modal específico da página Relatórios */}
        {isModalOpen && (
          <Box
            sx={{
              position: "absolute", // Modal preso apenas no conteúdo da página
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "400px",
              bgcolor: "background.paper",
              borderRadius: "8px",
              boxShadow: 24,
              p: 4,
              textAlign: "center",
              zIndex: 999, // Garantir que o modal esteja acima do conteúdo
              color: "#737373"
            }}
          >
            <ErrorOutlineIcon sx={{ color: "#dc2626", fontSize: 40 }} />
            <Typography variant="h6" component="h2">
              Nenhum relatório no momento.
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Entre em contato com
              o administrador do sistema para mais informações.
            </Typography>
            {/** 
            <Button
              onClick={handleCloseModal}
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#312783",
                "&:hover": { backgroundColor: "#1e1b4b" },
              }}
            >
              Fechar
            </Button>
            */}
          </Box>
        )}

        

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
            {[
              "Vendas",
              "Financeiro",
              "Logística",
              "Central de monitoramento",
              "Trade",
              "Indústrias",
            ].map(
              (label) =>
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
                      backgroundColor:
                        activeContent === label ? "#312783" : "#f2f0f0",
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
            )}
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
            {activeContent === "Vendas" &&
            visibleLinks.includes("Vendas") && (
              <>
                <Button
                  component={Link} // Define que o botão será um Link do React Router
                  to="/vendasdevolucao"
                  fullWidth
                  variant="contained"
                  sx={mainButtonStyle}
                >
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
            {activeContent === "Financeiro" &&
              visibleLinks.includes("Financeiro") && (
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
            {activeContent === "Logística" &&
              visibleLinks.includes("Logística") && (
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
            {activeContent === "Central de monitoramento" &&
              visibleLinks.includes("Central de monitoramento") && (
                <>
                  <Button
                  component={Link} // Define que o botão será um Link do React Router
                  to="/monitoramentovendedor"
                  fullWidth
                  variant="contained"
                  sx={mainButtonStyle}
                >
                  MONITORAMENTO VENDEDOR
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
            {activeContent === "Trade" &&
            visibleLinks.includes("Trade") && (
              <>
              {/** 
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  Relatório Trade
                </Button>
                */}
                <Button
                  component={Link} // Define que o botão será um Link do React Router
                  to="/relatoriotrade"
                  fullWidth
                  variant="contained"
                  sx={mainButtonStyle}
                >
                  VENDAS POR PROMOTOR
                </Button>
                <Button
                  component={Link} // Define que o botão será um Link do React Router
                  to="/vendastotaltrade"
                  fullWidth
                  variant="contained"
                  sx={mainButtonStyle}
                >
                  VENDAS TOTAL
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
