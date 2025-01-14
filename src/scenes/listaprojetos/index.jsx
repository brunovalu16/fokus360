import React, { useEffect, useState } from "react";
import { Box, Typography, Button, } from "@mui/material";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import Lista from "../../components/Lista";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { Link } from 'react-router-dom';




const Projetos = () => {

  const theme = useTheme(); // Inicializa o tema
  const colors = tokens(theme.palette.mode); // Obtém as cores do tema atual
  
  


  return (
    <>
      <Box
        sx={{
          marginRight: "45px",
          display: "flex", // Define um layout flexível
          justifyContent: "space-between", // Espaça os elementos horizontalmente
          alignItems: "center", // Alinha verticalmente os elementos
          marginLeft: "40px",
          paddingTop: "50px",
          paddingBottom: "40px",
        }}
      >
              {/* Primeiro Box - Ícone e Título */}
        <Box display="flex" alignItems="center" gap={1}>
          <PermContactCalendarIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
          <Typography sx={{ color:"#858585" }}>GERENCIADOR DE PROJETOS</Typography>
        </Box>

        {/* Segundo Box - Botão */}
        <Box>
          <Button
            component={Link} // Define que o botão será um Link do React Router
            to="/cadastroprojetos"
            variant="contained"
            sx={{
              marginTop: "10px",
              fontSize: "10px",
              fontWeight: "bold",
              borderRadius: "5px",
              padding: "10px 20px",
              backgroundColor: colors.blueAccent[1000], // Mantido como no original
              boxShadow: "none",
              "&:hover": { backgroundColor: "#3f2cb2" },
            }}
          >
            NOVO PROJETO
          </Button>
        </Box>
      </Box>


      <Box
        sx={{
          marginLeft: "40px",
          marginTop: "-15px",
          width: "calc(100% - 80px)",
          minHeight: "50vh",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
          overflowX: "hidden",
        }}
      >
        <Lista />
      </Box>
    </>
  );
};

export default Projetos;
