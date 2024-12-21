import React from "react";
import { Box, useMediaQuery, useTheme, Typography, CircularProgress } from "@mui/material";
import { tokens } from "../theme";
import Lista from "../components/Lista";
import PaidIcon from '@mui/icons-material/Paid';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

function DadosProjetogeral() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");

  return (
    <>
      {/* Header */}
      <Box sx={{ marginLeft: "40px", paddingTop: "50px" }}></Box>

      {/* Container Principal */}
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
              progress: 75,
              increase: "+14%",
              icon: <PaidIcon sx={{ color: "#fff", fontSize: "40px" }} />,
              progressColor: "#4caf50",
            },
            {
              title: "431,225",
              subtitle: "Custo realizado",
              progress: 50,
              increase: "+21%",
              icon: <PaidIcon sx={{ color: "#fff", fontSize: "40px" }} />,
              progressColor: "#ff9800",
            },
            {
              title: "32,441",
              subtitle: "Total de tarefas",
              progress: 30,
              increase: "+5%",
              icon: <AssignmentTurnedInIcon sx={{ color: "#fff", fontSize: "40px" }} />,
              progressColor: "#2196f3",
            },
          ].map((item, index) => (
            <Box
              key={index}
              boxShadow={3}
              borderRadius="20px"
              gridColumn="span 4"
              bgcolor="#312783"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="20px"
              sx={{ gap: "10px", position: "relative" }}
            >
              {/* Ícone à Esquerda */}
              <Box display="flex" alignItems="center" justifyContent="center" sx={{ minWidth: "60px", height: "60px" }}>
                {item.icon}
              </Box>

              {/* Linha Vertical */}
              <Box
                sx={{
                  width: "2px",
                  height: "80%",
                  backgroundColor: "#ffffff4d",
                  margin: "0 2px",
                }}
              />

              {/* Texto no Meio */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ textAlign: "center", flex: 1 }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
                  {item.title}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "#b0b0b0" }}>
                  {item.subtitle}
                </Typography>
                <Typography variant="body2" sx={{ color: "#8bc34a" }}>
                  {item.increase}
                </Typography>
              </Box>

              {/* Gráfico à Direita */}
              <Box display="flex" alignItems="center" justifyContent="center" sx={{ minWidth: "60px", height: "60px" }}>
                <CircularProgress
                  variant="determinate"
                  value={item.progress}
                  size={60}
                  thickness={6}
                  sx={{ color: item.progressColor }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Lista e Gráfico Lado a Lado */}
        <Box
          display="grid"
          gridTemplateColumns="2fr 1fr"
          gap="20px"
          marginTop="20px"
        >
          {/* Lista */}
          <Box sx={{ width: "800px" }}>
            <Lista />
          </Box>

          {/* Gráfico Horizontal - Projetos por Gerência */}
          <Box
            boxShadow={3}
            borderRadius="20px"
            bgcolor="#312783"
            padding="20px"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px", color: "#fff" }}>
              Projetos por Gerência
            </Typography>

            {/* Gráfico de Barras */}
            {[
              { gerente: "Marcelo", valor: 2 },
              { gerente: "Ana Cristina", valor: 1 },
              { gerente: "Juliana", valor: 1 },
              { gerente: "Leonardo", valor: 1 },
            ].map((item, index) => (
              <Box key={index} display="flex" alignItems="center" gap="10px" sx={{ width: "100%" }}>
                <Typography sx={{ minWidth: "80px", fontWeight: "bold", color: "#fff" }}>
                  {item.gerente}
                </Typography>
                <Box sx={{ flex: 1, backgroundColor: "#e0e0e0", borderRadius: "5px", height: "30px" }}>
                  <Box
                    sx={{
                      width: `${item.valor * 50}px`,
                      backgroundColor: "#1976d2",
                      height: "100%",
                      borderRadius: "5px",
                      textAlign: "center",
                      color: "#fff",
                      lineHeight: "30px",
                    }}
                  >
                    {item.valor}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default DadosProjetogeral;
