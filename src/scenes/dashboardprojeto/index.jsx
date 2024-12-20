import React, { useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import  Header  from "../../components/Header";
import { Divider } from "@mui/material";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import BaseDiretriz from "../../components/BaseDiretriz";
import  DadosProjeto   from "../../components/DadosProjeto";
import InformacoesProjeto from "../../components/InformacoesProjeto";

function DashboardProjeto() {
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
              <PlayCircleFilledWhiteIcon
                sx={{ color: "#5f53e5", fontSize: 40 }}
              />
              <Typography>NOME DO PROJETO</Typography>
            </Box>
          }
        />

        {/* Componente */}
        <DadosProjeto />

        <Box sx={{ paddingTop: "70px", marginLeft: "40px" }}>
          <Header
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <PlayCircleFilledWhiteIcon
                  sx={{ color: "#22d3ee", fontSize: 30 }}
                />
                <Typography fontSize="15px">INFORMAÇÕES DO PROJETO</Typography>
              </Box>
            }
          />
        </Box>
        {/* Divider */}
        <Divider
          sx={{
            width: "calc(100% - 100px)", // Mesma largura calculada
            height: "1px",
            marginLeft: "40px",
            marginBottom: "50px",
            backgroundColor: "#ccc", // Cor do divisor
          }}
        />


        {/* Componente */}
        <Box sx={{ marginLeft: "20px", marginRight: "40px"}}>
          <InformacoesProjeto />
        </Box>



        <Box sx={{ paddingTop: "70px", marginLeft: "40px"  }}>
          <Header
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <PlayCircleFilledWhiteIcon
                  sx={{ color: "#5f53e5", fontSize: 30 }}
                />
                <Typography fontSize="15px">DIRETRIZES DO PROJETO</Typography>
              </Box>
            }
          />
        </Box>
        {/* Divider */}
        <Divider
          sx={{
            width: "calc(100% - 100px)", // Mesma largura calculada
            height: "1px",
            marginLeft: "40px",
            marginBottom: "50px",
            backgroundColor: "#ccc", // Cor do divisor
          }}
        />

        {/* Componente */}
        <Box sx={{ marginLeft: "35px", marginRight: "55px", marginBottom: "50px"}}>
          <BaseDiretriz />
        </Box>
        


      </Box>
    </>
  );
}

export default DashboardProjeto;
