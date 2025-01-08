import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import { Link } from 'react-router-dom';

const Projetos = () => {

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
          <PlayCircleFilledIcon sx={{ color: "#22d3ee", fontSize: 25 }} />
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
              height: "150px",
            }}
          >
            <Link
              to="/cadastroprojetos"
              style={{
                backgroundColor: "transparent",  
                color: "transparent",
                textDecoration: "none",
                fontWeight: "bold",
                marginLeft: "8px",
                alignContent: "center",
                paddingRight: "350px",
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
            <Link
              to="/dashboard"
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
            </Link>
          </Box>


          <Box
            sx={{
              position: "absolute",
              top: "48%", // Posição para "Resumo Projetos"
              right: "6%",
            }}
          >
            <Link
              to="/listaprojetos"
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
            </Link>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default Projetos;
