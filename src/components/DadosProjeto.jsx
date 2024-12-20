import React, { useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import  Header  from "./Header";
import  StatBox  from "../../src/components/StatBox";
import { Email, PersonAdd, PointOfSale } from "@mui/icons-material";
import { Divider } from "@mui/material";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { tokens } from "../theme";
import Lista from "../components/Lista";
import InformacoesProjeto from "../components/InformacoesProjeto";

function DadosProjeto() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          marginLeft: "40px",
          paddingTop: "50px",
        }}
      ></Box>

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
        {/* GRID & CHARTS */}
        <Box
          paddingBottom="20px"
          borderRadius="20px"
          paddingTop="20px"
          display="grid"
          gridTemplateColumns={
            isXlDevices
              ? "repeat(12, 1fr)"
              : isMdDevices
              ? "repeat(6, 1fr)"
              : "repeat(6, 1fr)"
          }
          gridAutoRows="140px"
          gap="20px"
        >
          {/* Statistic Items */}

          {[
            {
              title: "11,361",
              subtitle: "Orçamento",
              progress: "0.75",
              increase: "+14%",
              icon: (
                <Email
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              ),
            },
            {
              title: "431,225",
              subtitle: "Custo realizado",
              progress: "0.50",
              increase: "+21%",
              icon: (
                <PointOfSale
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              ),
            },
            {
              title: "32,441",
              subtitle: "Total de tarefas",
              progress: "0.30",
              increase: "+5%",
              icon: (
                <PersonAdd
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              ),
            },
          ].map((item, index) => (
            <Box
              key={index}
              boxShadow="3"
              borderRadius="20px"
              gridColumn="span 4"
              bgcolor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                display: "flex",
                flexWrap: "wrap", // Permite que as caixas "quebrem" para a próxima linha
                justifyContent: "center", // Centraliza as caixas no eixo principal
                marginRight: "7px", //
              }}
            >
              <StatBox
                title={item.title}
                subtitle={item.subtitle}
                progress={item.progress}
                increase={item.increase}
                icon={item.icon}
              />
            </Box>
          ))}
        </Box>
        { /** COMPONENTE */ }  
        <Lista />
      </Box>
    </>
  );
}

export default DadosProjeto;
