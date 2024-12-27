import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { Link } from 'react-router-dom';

const Home = () => {
  const [userRole, setUserRole] = useState("");

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
            marginBottom: "40px",
            marginTop: "15px",
          }}
        >
        </Box>
        

        {/* Estrutura da Imagem */}
        <div style={{ position: "relative", width: "100%", top: "-40px" }}>
          <img
            src="src/assets/images/capasistema360relatorios.webp" // Caminho da imagem
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
              top: "55%", // Posição para "Novo Projeto"
              left: "10%",
              height: "100px",
            }}
          >
            <Link
              to="/relatorios"
              style={{
                backgroundColor: "transparent",  
                color: "transparent",
                textDecoration: "none",
                fontWeight: "bold",
                marginLeft: "8px",
                alignContent: "center",
                paddingRight: "300px",
                paddingBottom: "150px",
              }}
            >
              Novo Projeto
            </Link>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "38%", // Posição para "Resumo Geral"
              right: "5%",
              height: "150px",
            }}
          >
            <a
              href="/dashboard"
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "transparent",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                paddingRight: "250px",
                paddingBottom: "30px",
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
            }}
          >
            <a
              href="/listaprojetos"
              style={{
                backgroundColor: "transparent",
                color: "transparent",
                textDecoration: "none",
                fontWeight: "bold",
                paddingRight: "280px",
                paddingBottom: "50px",
              }}
            >
              Projetos
            </a>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default Home;
