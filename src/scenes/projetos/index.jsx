import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Header } from "../../components";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";

const Projetos = () => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Adicione qualquer lógica relacionada à autenticação ou ao usuário, se necessário
  }, []);

  return (
    <>
      {/* Cabeçalho */}
      <Box sx={{ marginLeft: "40px", paddingTop: "50px" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <AssessmentIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
              <Typography>GERENCIADOR DE RELATÓRIOS</Typography>
            </Box>
          }
        />
      </Box>

      {/* Conteúdo Principal */}
      <Box
        m="40px"
        width="90%"
        minHeight="50vh"
        sx={{
          overflowX: "hidden",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
          <Typography color="#858585">RELATÓRIOS | VENDAS X DEVOLUÇÃO</Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            marginBottom: "10px",
            marginTop: "15px",
          }}
        >
          <Divider
            sx={{
              position: "absolute",
              width: "100%",
              height: "1px",
              backgroundColor: "#ccc",
            }}
          />
          <LocalGroceryStoreIcon
            sx={{
              color: "#5f53e5",
              fontSize: 25,
              zIndex: 1,
              backgroundColor: "#f2f0f0",
              padding: "0 4px",
              marginLeft: "103%",
            }}
          />
        </Box>

        {/* Estrutura da Imagem */}
        <div style={{ position: "relative", width: "100%" }}>
          <img
            src="src/assets/images/capasistema360.webp" // Caminho da imagem
            alt="Relatório de Vendas e Devoluções"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          />
          {/* Links sobrepostos */}
          <Box
            sx={{
              position: "absolute",
              top: "75%", // Posição para "Novo Projeto"
              left: "10%",
              height: "100%",
            }}
          >
            <a
              href="/novo-projeto"
              style={{
                padding: "45px",
                backgroundColor: "transparent",
                color: "transparent",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                marginLeft: "8px",
              }}
            >
              Novo Projeto
            </a>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "35%", // Posição para "Resumo Geral"
              right: "15%",
            }}
          >
            <a
              href="/resumo-geral"
              style={{
                padding: "10px 20px",
                backgroundColor: "#5f53e5",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Resumo Geral
            </a>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "45%", // Posição para "Resumo Projetos"
              right: "15%",
            }}
          >
            <a
              href="/resumo-projetos"
              style={{
                padding: "10px 20px",
                backgroundColor: "#5f53e5",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Resumo Projetos
            </a>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default Projetos;
