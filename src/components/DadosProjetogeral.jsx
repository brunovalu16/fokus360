import React from "react";
import { Box, useMediaQuery, useTheme, Typography, CircularProgress } from "@mui/material";
import { tokens } from "../theme";
import PaidIcon from "@mui/icons-material/Paid";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import Lista from "../components/Lista";

function DadosProjetogeral() {
  const theme = useTheme();
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");

  return (
    <>
      {/* Header */}
      <Box sx={{ marginLeft: "40px", paddingTop: "10px" }}></Box>

      {/* Container Principal */}
      <Box
        sx={{
          marginLeft: "40px",
          width: "calc(100% - 80px)",
          minHeight: "50vh",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
          overflow: "visible",
          marginBottom: "30px",
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
              icon: (
                <AssignmentTurnedInIcon
                  sx={{ color: "#fff", fontSize: "40px" }}
                />
              ),
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
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ minWidth: "60px", height: "60px" }}
              >
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
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
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
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ minWidth: "60px", height: "60px" }}
              >
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










        {/* Gráfico Horizontal - Projetos por Gerência */}
        <Box
          padding="50px"
          sx={{
            gap: "20px",
            gridColumn: "span 12",
            alignItems: "stretch",
          }}
        >
          {/* Coluna Esquerda - Título */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            marginLeft="10px"
          >
            <Box
              sx={{
                display: "flex", // Alinha os elementos em linha
                alignItems: "center", // Alinha verticalmente ao centro
                gap: "10px", // Espaço entre os elementos
                marginBottom: "30px", //
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "#312783",
                  whiteSpace: "nowrap", // Evita quebra de linha
                }}
              >
                Projetos
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#afaeae",
                  whiteSpace: "nowrap", // Evita quebra de linha
                }}
              >
                por Gerência
              </Typography>
            </Box>

          </Box>

          {/* Coluna Direita - Gráficos com Linhas e Bolinhas */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px", // Espaço entre os elementos
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            {[
              { gerente: "Marcelo", valor: 2, color: "#4caf50" },
              { gerente: "Ana Cristina", valor: 1, color: "#ff9800" },
              { gerente: "Juliana", valor: 3, color: "#1976d2" },
              { gerente: "Leonardo", valor: 1, color: "#9c27b0" },
            ].map((item, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap="10px"
                sx={{ width: "100%" }}
              >
                {/* Nome do Gerente */}
                <Typography
                  sx={{
                    minWidth: "120px",
                    color: "#9d9d9c",
                  }}
                >
                  {item.gerente}
                </Typography>

                {/* Linha de Progresso */}
                <Box
                  sx={{
                    flex: 1,
                    height: "3px",
                    backgroundColor: "#e8e5e5",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: `${item.valor * 25}%`,
                      backgroundColor: item.color,
                      height: "100%",
                      borderRadius: "4px",
                    }}
                  >
                    {/* Bolinha no Final */}
                    <Box
                      sx={{
                        width: "10px",
                        height: "10px",
                        backgroundColor: item.color,
                        borderRadius: "50%",
                        position: "absolute",
                        right: "-7px",
                        transform: "translateY(-50%)",
                        marginRight: "10px",
                      }}
                    />

                  <Box
                      sx={{
                        width: "14px",
                        height: "14px",
                        backgroundColor: item.color,
                        borderRadius: "50%",
                        position: "absolute",
                        transform: "translateY(-50%)",
                      }}
                    />        
                  </Box>
                </Box>

                {/* Caixa com Número */}
                <Box
                  sx={{
                    minWidth: "25px",
                    Height: "25px",
                    backgroundColor: item.color,
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    lineHeight: "24px",
                    borderRadius: "50%",
                    marginTop: "5px", // Espaçamento vertical superior
                    marginBottom: "5px", // Espaçamento vertical inferior
                  }}
                >
                  {item.valor}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        {/** COMPONENTE */}
        <Box marginTop="20px" marginLeft="40px" marginRight="40px">
          <Lista />
        </Box>
      </Box>
    </>
  );
}

export default DadosProjetogeral;
