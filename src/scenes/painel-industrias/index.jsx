import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Header } from "../../components"; // Certifique-se de que o caminho está correto
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { Divider } from "@mui/material";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Menu, MenuItem, Sidebar, SubMenu  } from "react-pro-sidebar";

import { Link } from "react-router-dom";





//condição de visualização para industrias
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

//condição de visualização para usuarios internos
const rolesComAcessoCompleto = [
  "01", "02", "03", "04", "05", "06", "08", "09", "10", "11", 
  "19", "20", "21", "25", "26", "27", "34", "35", "36"
];


//condição para esconder o botão dos roles logados
const rolesQueEscondemBotaoVoltar = [
  "37", "38", "39", "40", "41", "42", "43", "44",
  "45", "46", "47", "48", "49", "50", "51"
];




const PainelIndustrias = () => {
  // Estado para rastrear qual conteúdo está ativo
  const [activeContent, setActiveContent] = useState("");

  const [userRole, setUserRole] = useState("");
  const [allowedLabel, setAllowedLabel] = useState("");

//isso é uma flag
  const podeVerTudo = rolesComAcessoCompleto.includes(userRole);


//pega o role do usuario logado
useEffect(() => {
  const role = localStorage.getItem("userRole");
  if (role) {
    setUserRole(role);
    const label = roleToLabelMap[role];
    if (label) setAllowedLabel(label);
  }
}, []);


//flag para esconder o botão voltar dos roles definidos
const deveExibirBotaoVoltar = !rolesQueEscondemBotaoVoltar.includes(userRole);


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
                      GERENCIADOR DE RELATÓRIOS  |  INDÚSTRIAS
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
    <Typography color="#858585">RELATÓRIOS</Typography>
  </Box>

  {/* Voltar à direita como botão com Link */}
  <Box>
    {deveExibirBotaoVoltar && (
      <Button
        component={Link}
        to="/relatorios"
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
    )}

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
            {podeVerTudo
  ? Object.values(roleToLabelMap).map((label) => (
      <Button
        key={label}
        fullWidth
        variant="contained"
        onClick={() => setActiveContent(label)}
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
    ))
  : allowedLabel && (
      <Button
        key={allowedLabel}
        fullWidth
        variant="contained"
        onClick={() => setActiveContent(allowedLabel)}
        sx={{
          mb: 3,
          borderRadius: "10px",
          border: "1px solid",
          boxShadow: "none",
          backgroundColor: activeContent === allowedLabel ? "#312783" : "#f2f0f0",
          textTransform: "none",
          borderColor: "#e0e0e0",
          color: activeContent === allowedLabel ? "#fff" : "#858585",
          "&:hover": {
            backgroundColor: "#312783",
            color: "#fff",
            boxShadow: "none",
          },
        }}
      >
        {allowedLabel}
      </Button>
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
              boxShadow: "none", // Garante que não há sombra no hover
              color: "#727681",
              textTransform: "none",
              maxWidth: "60%", // Certifica-se de que o conteúdo se ajuste
              minWidth: "60%",
              overflow: "auto",
            }}
          >
            {activeContent === "AB Mauri" && (
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
            {activeContent === "Adoralle" && (
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
            {activeContent === "Ajinomoto" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  ajinomoto 1
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  ajinomoto 2
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  ajinomoto 3
                </Button>
              </>
            )}
            {activeContent === "Bettanin" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 7 Central
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 8 Central
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 9 Central
                </Button>
              </>
            )}
            {activeContent === "M.Dias" && (
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
            {activeContent === "Mars Choco" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 14 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 15 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 16 indústria
                </Button>
              </>
            )}

            {activeContent === "Mars Pet" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 14 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 15 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 16 indústria
                </Button>
              </>
            )}  

            {activeContent === "SCJhonson" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 14 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 15 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 16 indústria
                </Button>
              </>
            )} 

            {activeContent === "Ypê" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 14 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 15 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 16 indústria
                </Button>
              </>
            )} 

            {activeContent === "UAU Ingleza" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 14 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 15 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 16 indústria
                </Button>
              </>
            )} 

            {activeContent === "Danone" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 14 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 15 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 16 indústria
                </Button>
              </>
            )} 

            {activeContent === "Fini" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 14 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 15 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 16 indústria
                </Button>
              </>
            )} 

            {activeContent === "Heinz" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 14 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 15 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 16 indústria
                </Button>
              </>
            )} 


            {activeContent === "Red Bull" && (
              <>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 14 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 15 indústria
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 16 indústria
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

export default PainelIndustrias;
