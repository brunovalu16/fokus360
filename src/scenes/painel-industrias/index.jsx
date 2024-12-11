import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Header } from "../../components"; // Certifique-se de que o caminho está correto
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { Divider } from "@mui/material";

const PainelIndustrias = () => {
  // Estado para rastrear qual conteúdo está ativo
  const [activeContent, setActiveContent] = useState("AB Mauri");

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
            {["AB Mauri", "Adoralle", "Ajinomoto", "Bettanin", "M.Dias", "Mars Choco", "Mars Pet", "SCJhonson", "Ypê"].map((label) => (
              <Button
                key={label}
                fullWidth
                variant="contained"
                onClick={() => setActiveContent(label)}
                sx={{
                  mb: 3,
                  borderRadius: "10px",
                  border: "1px solid",
                  boxShadow: "none", // Garante que não há sombra no hover
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
                  teste 4 logística
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 5 logística
                </Button>
                <Button fullWidth variant="contained" sx={mainButtonStyle}>
                  teste 6 logística
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
