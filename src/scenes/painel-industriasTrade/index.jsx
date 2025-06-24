import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Header } from "../../components"; // Certifique-se de que o caminho está correto
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { Divider } from "@mui/material";

import { useNavigate } from "react-router-dom";


import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Menu, MenuItem, Sidebar, SubMenu  } from "react-pro-sidebar";

import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { authFokus360, dbFokus360 } from "../../data/firebase-config";



const PainelIndustriasTrade = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  // Estado para rastrear qual conteúdo está ativo
  const [activeContent, setActiveContent] = useState("AB Mauri");
  const [arquivos, setArquivos] = useState([]);

  
const navigate = useNavigate();

//useEffect que escute activeContent (o botão clicado)
  useEffect(() => {
  const fetchArquivos = async () => {
    const roleSelecionado = Object.keys(roleToLabelMap).find(
      (key) => roleToLabelMap[key] === activeContent
    );

    if (!roleSelecionado) return;

    try {
      const q = query(
        collection(dbFokus360, "arquivos"),
        where("role", "==", roleSelecionado)
      );
      const snapshot = await getDocs(q);

      const arquivosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setArquivos(arquivosData);
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
    }
  };

  fetchArquivos();
}, [activeContent]);



//Buscar o role do usuario
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(authFokus360, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(dbFokus360, "user", user.uid));
      if (userDoc.exists()) {
        const dados = userDoc.data();
        setRole(dados.role);
      }
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);


const roleToLabelMap = {
  "37": "Ajinomoto",
  "38": "AB Mauri",
  "39": "Adoralle",
  "40": "Bettanin",
  "41": "Mars Choco",
  "42": "Mars Pet",
  "43": "M.Dias",
  "44": "SCJhonson",
  "45": "UAU Ingleza",
  "46": "Danone",
  "47": "Ypê",
  "48": "Adoralle",
  "49": "Fini",
  "50": "Heinz",
  "51": "Red Bull",
};

const allLabels = [
  "AB Mauri", "Adoralle", "Ajinomoto", "Bettanin", "M.Dias", "Danone", "UAU Ingleza",
  "Mars Choco", "Mars Pet", "SCJhonson", "Ypê", "Adoralle", "Fini", "Heinz", "Red Bull"
];

const isRestrictedRole = Object.keys(roleToLabelMap).includes(role);
const allowedLabels = isRestrictedRole ? [roleToLabelMap[role]] : allLabels;



if (loading) return <Box p={5}>Carregando...</Box>;

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
                <LocalGroceryStoreIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
                  <Typography>
                      GERENCIADOR DE ARQUIVOS  |  INDÚSTRIAS
                  </Typography>
                
              </Box>
            }
          />
      </Box>

      <Box
        m="40px"
        width="90%"
        minHeight="50vh"
        bgcolor="#f2f0f0"
        sx={{
          overflowX: "hidden", // Remove a rolagem horizontal
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Efeito de sombra para o container
          marginTop: "-15px",
        }}
      >
        
 <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
  {/* Relatórios à esquerda */}
  <Box display="flex" alignItems="center" gap={1}>
    <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
    <Typography color="#858585">ARQUIVOS</Typography>
  </Box>

  {/* Voltar à direita como botão com Link */}
  <Box>
    <Button
      component={Link}
      to="/capaarquivos"
      startIcon={<ExitToAppIcon sx={{ color: "#5f53e5", marginRight: "-7px", marginTop: "-3px" }} />}
      sx={{
        padding: "5px 10px",
        fontSize: "13px",
        color: "#858585",
        marginRight: "20px",
        textTransform: "none",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      Voltar
    </Button>
  </Box>
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
          flexDirection={{ xs: "column", md: "row" }}
          width="100%"
          minHeight="calc(60vh - 80px)" // Ajuste para considerar a altura do Header
          sx={{
            overflowX: "hidden", // Garante que nenhum conteúdo cause rolagem horizontal
          }}
        >
          {/* Div de Menus */}
          <Box
            sx={{
              width: { xs: "100%", md: "30%" },
              backgroundColor: "#f2f0f0",
              padding: { xs: 2, md: 3 },
              borderRight: "1px solid #d6d6d6",
            }}
          >
            {allowedLabels.map((label) => (
              <Button
                key={label}
                fullWidth
                variant="contained"
                onClick={() => {
                  const roleSelecionado = Object.keys(roleToLabelMap).find(
                    (key) => roleToLabelMap[key] === label
                  );
                  navigate(`/arquivos?role=${roleSelecionado}`);
                }}

                sx={{
                  mb: 3,
                  borderRadius: "10px",
                  border: "1px solid",
                  boxShadow: "none",
                  backgroundColor: activeContent === label ? "#312783" : "#f2f0f0", // ✅ CORRETO
                  textTransform: "none",
                  borderColor: "#e0e0e0",
                  color: activeContent === label ? "#fff" : "#858585", // ✅ CORRETO
                  "&:hover": {
                    backgroundColor: "#312783",
                    color: "#fff",
                    boxShadow: "none",
                  },
                }}
              >
                {label}
              </Button>
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
              boxShadow: "none", // Garante que não há sombra no hover
              color: "#727681",
              textTransform: "none",
              maxWidth: "60%", // Certifica-se de que o conteúdo se ajuste
              minWidth: "60%",
              overflow: "auto",
            }}
          >
            
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

export default PainelIndustriasTrade;
