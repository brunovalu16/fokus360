import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Header } from "../../components"; // Certifique-se de que o caminho está correto

const Relatorios = () => {
  return (
    <Box 
      m="60px auto" 
      width="80%" 
      minHeight="50vh" 
      bgcolor="#f2f0f0" 
      sx={{
        overflowX: "hidden", // Remove a rolagem horizontal
      }}
    >
      {/* Header */}
      <Header title="DASHBOARD DE RELATÓRIOS" subtitle="Visualize todos os relatórios do Grupo Fokus" />

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
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: "20%" },
            backgroundColor: "#5f53e5",
            padding: { xs: 2, md: 5 },
          }}
        >
          <Typography variant="h6" mb={2} fontWeight="bold" color="#d0d1d5">
            Relatórios
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{
              mb: 4,
              boxShadow: "none", // Garante que não há sombra no hover
              backgroundColor: "#c2c2c2",
              color: "#583cff",
              textTransform: "none",
            }}
          >
            Vendas
          </Button>
          <Button
            fullWidth
            variant="contained"
            disabled
            sx={{
              mb: 2,
              backgroundColor: "#c2c2c2",
              color: "#fff",
              textTransform: "none",
            }}
          >
            Financeiro
          </Button>
          <Button
            fullWidth
            variant="contained"
            disabled
            sx={{
              mb: 2,
              boxShadow: "none", // Garante que não há sombra no hover
              backgroundColor: "#d6d6d6",
              color: "#fff",
              textTransform: "none",
            }}
          >
            Logística
          </Button>
          <Button
            fullWidth
            variant="contained"
            disabled
            sx={{
              mb: 2,
              backgroundColor: "#d6d6d6",
              color: "#fff",
              textTransform: "none",
            }}
          >
            Central de monitoramento
          </Button>
          <Button
            fullWidth
            variant="contained"
            disabled
            sx={{
              mb: 2,
              backgroundColor: "#d6d6d6",
              color: "#fff",
              textTransform: "none",
            }}
          >
            Trade
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              boxShadow: "none", // Garante que não há sombra no hover
              backgroundColor: "#c2c2c2",
              color: "#583cff",
              textTransform: "none",
            }}
          >
            Indústrias
          </Button>
        </Box>

        {/* Main Content */}
        <Box
          flex={1}
          padding={{ xs: 2, md: 4 }}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            mb: 2,
            boxShadow: "none", // Garante que não há sombra no hover
            color: "#727681",
            textTransform: "none",
            maxWidth: "60%", // Certifica-se de que o conteúdo se ajuste
            minWidth: "50%",
            height: "450px",
            overflow: "auto",
            border: "1px solid #d0d1d5",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={1}
            mt={4}
            color="#583cff"
            textAlign="center"
          >
            {/* Título do Relatório */}
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mb: 2,
              backgroundColor: "#583cff",
              color: "#fff",
              textTransform: "none",
              maxWidth: "50%",
              minWidth: "50%",
              marginLeft: "-50%",
              borderRadius: "5px",
              boxShadow: "none", // Remove a sombra
              "&:hover": {
                backgroundColor: "#d6d6d6", // Mantém a cor sem mudanças ao passar o mouse
                boxShadow: "none", // Garante que não há sombra no hover
              },
            }}
          >
            VENDAS X DEVOLUÇÃO
          </Button>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mb: 2,
              backgroundColor: "#583cff",
              color: "#fff",
              textTransform: "none",
              maxWidth: "50%",
              minWidth: "50%",
              borderRadius: "5px",
              marginLeft: "-50%",
              boxShadow: "none", // Remove a sombra
              "&:hover": {
                backgroundColor: "#d6d6d6", // Mantém a cor sem mudanças ao passar o mouse
                boxShadow: "none", // Garante que não há sombra no hover
              },
            }}
          >
            RELATÓRIO GERAL
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              mb: 2,
              backgroundColor: "#583cff",
              color: "#fff",
              textTransform: "none",
              maxWidth: "50%",
              minWidth: "50%",
              borderRadius: "5px",
              marginLeft: "-50%",
              boxShadow: "none", // Remove a sombra
              "&:hover": {
                backgroundColor: "#d6d6d6", // Mantém a cor sem mudanças ao passar o mouse
                boxShadow: "none", // Garante que não há sombra no hover
              },
            }}
          >
            EM CONSTRUÇÃO
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Relatorios;
