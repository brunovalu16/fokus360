import React from "react";
import { Box, useMediaQuery, useTheme, Typography, CircularProgress  } from "@mui/material";
import  StatBox  from "../../src/components/StatBox";
import { Email, PersonAdd, PointOfSale } from "@mui/icons-material";
import { tokens } from "../theme";
import Lista from "../components/Lista";
import PaidIcon from '@mui/icons-material/Paid';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

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
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap="15px"
          paddingBottom="20px"
          paddingTop="20px"
          borderRadius="20px"
          sx={{
            overflowX: "hidden",
          }}
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
              subtitle: "Total de diretrizes",
              progress: 30,
              increase: "+5%",
              icon: (
                <AssignmentTurnedInIcon
                  sx={{ color: "#fff", fontSize: "40px" }}
                />
              ),
              progressColor: "#2196f3",
            },
            {
              title: "7,890",
              subtitle: "Total de tarefas",
              progress: 45,
              increase: "+10%",
              icon: (
                <AssignmentTurnedInIcon
                  sx={{ color: "#fff", fontSize: "40px" }}
                />
              ),
              progressColor: "#f44336",
            },
          ].map((item, index) => (
            <Box
              key={index}
              boxShadow={3}
              borderRadius="20px"
              bgcolor="#312783"
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              padding="15px"
              minWidth="200px"
              sx={{
                textAlign: "center",
                overflow: "hidden",
                minHeight: "140px",
                flexShrink: 0,
                maxWidth: "100%", // Garante adaptação ao tamanho da tela
              }}
            >
              {/* Ícone à Esquerda */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  minWidth: "50px",
                  height: "50px",
                }}
              >
                {item.icon}
              </Box>

              {/* Linha Vertical */}
              <Box
                sx={{
                  width: "2px",
                  height: "80%",
                  backgroundColor: "#ffffff4d",
                  margin: "0 10px",
                }}
              />

              {/* Conteúdo ao Centro */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                sx={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="h6"
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

              {/* Gráfico Circular à Direita */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "50px",
                  height: "50px",
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={item.progress}
                  size={50}
                  thickness={5}
                  sx={{
                    color: item.progressColor,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/** COMPONENTE */}
        <Lista />
      </Box>
    </>
  );
}

export default DadosProjeto;
