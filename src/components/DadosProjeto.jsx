import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Lista from "../components/Lista";

const DadosProjeto = ({ orcamento, valorGasto, totalDiretrizes, totalTarefas }) => {
  const calcularProgressoValorGasto = () => {
    const valorOrcamentoNumerico =
      parseFloat(orcamento.replace("R$", "").replace(".", "").replace(",", ".")) || 0;

    const valorGastoNumerico =
      parseFloat(valorGasto.replace("R$", "").replace(".", "").replace(",", ".")) || 0;

    if (valorOrcamentoNumerico === 0) return 0;

    return (valorGastoNumerico / valorOrcamentoNumerico) * 100;
  };

  const definirCorValorGasto = () => {
    const progresso = calcularProgressoValorGasto();

    if (progresso <= 70) {
      return "#4caf50"; // Verde
    } else if (progresso > 70 && progresso <= 100) {
      return "#ffeb3b"; // Amarelo
    } else {
      return "#f44336"; // Vermelho
    }
  };

  const progressoValorGasto = calcularProgressoValorGasto();

  const items = [
    {
      title: orcamento,
      subtitle: "Orçamento",
      progress: 100,
      icon: <PaidIcon sx={{ color: "#fff", fontSize: "50px" }} />,
      progressColor: "#4caf50",
    },
    {
      title: valorGasto,
      subtitle: "Valor gasto",
      progress: progressoValorGasto,
      icon: <PaidIcon sx={{ color: "#fff", fontSize: "50px" }} />,
      progressColor: definirCorValorGasto(),
    },
    {
      title: totalDiretrizes,
      subtitle: "Total de diretrizes",
      progress: 30,
      icon: (
        <AssignmentTurnedInIcon sx={{ color: "#fff", fontSize: "50px" }} />
      ),
      progressColor: "#2196f3",
    },
    {
      title: totalTarefas,
      subtitle: "Total de tarefas",
      progress: 45,
      icon: (
        <AssignmentTurnedInIcon sx={{ color: "#fff", fontSize: "50px" }} />
      ),
      progressColor: "#f44336",
    },
  ];

  return (
    <Box
      sx={{
        marginLeft: "40px",
        marginTop: "-15px",
        width: "calc(100% - 100px)",
        minHeight: "50vh",
        padding: "15px",
        paddingLeft: "30px",
        borderRadius: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        bgcolor: "#f2f0f0",
        overflowX: "hidden",
      }}
    >
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
        {items.map((item, index) => (
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
              maxWidth: "100%",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                minWidth: "50px",
                height: "50px",
                marginLeft: "10px",
              }}
            >
              {item.icon}
            </Box>

            <Box
              sx={{
                width: "2px",
                height: "80%",
                backgroundColor: "#ffffff4d",
                margin: "0 20px",
              }}
            />

            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              sx={{
                flex: 1,
                textAlign: "center",
                marginLeft: "10px",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#fff", fontSize: "15px" }}
              >
                {item.title}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "#b0b0b0" }}>
                {item.subtitle}
              </Typography>
            </Box>

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
  );
};

export default DadosProjeto;




