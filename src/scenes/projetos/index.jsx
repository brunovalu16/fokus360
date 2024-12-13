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
      

      {/* Conteúdo Principal */}
      <Box
        sx={{
          marginLeft: "40px",
          marginTop: "10px",
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
            <Typography
                color="#858585">FOKUS 360 | PROJETOS
            </Typography>
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
        <div style={{ position: "relative", width: "100%", top: "-40px" }}>
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
              height: "80px",
            }}
          >
            <a
              href="/novo-projeto"
              style={{
                padding: "45px",
                backgroundColor: "transparent",  
                color: "transparent",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
                marginLeft: "8px",
                padding: "95px",
                alignContent: "center",
              }}
            >
              Novo Projeto
            </a>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "36%", // Posição para "Resumo Geral"
              right: "7%",
              height: "60px",
            }}
          >
            <a
              href="/resumo-geral"
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "transparent",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                padding: "50px",
              }}
            >
              Resumo Geral
            </a>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "48%", // Posição para "Resumo Projetos"
              right: "6%",
              height: "75px",
            }}
          >
            <a
              href="/resumo-projetos"
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "transparent",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                padding: "50px",
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
