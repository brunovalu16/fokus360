import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

const GraficosDiretrizes = ({
  quantidadeProjetos,
  totalEstrategicas,
  totalTaticas,
  totalOperacionais,
  totalTarefas,
  totalEstrategicasConcluidas,
  totalTaticasConcluidas,
  totalOperacionaisConcluidos,
  totalTarefasConcluidas
}) => {
  const chartSize = 160;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={6} mt={4}>
      {/* 🔵 Total de Projetos */}
        <Box
          sx={{
            border: "1px solid #999999",
            padding: "20px",
            borderRadius: "10px",
            paddingLeft: "30px",
            paddingRight: "30px"
            }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#3f51b5" }} />
            <Typography fontSize={12}>Total de Projetos: {quantidadeProjetos}</Typography>
          </Box>
      </Box>

      {/* 🟣 Diretrizes Totais */}
      <Box display="flex" alignItems="center" gap={2}>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: totalEstrategicas, color: "#3f51b5" },
                { id: 1, value: totalTaticas, color: "#4caf50" },
                { id: 2, value: totalOperacionais, color: "#f44336" },
                { id: 3, value: totalTarefas, color: "#ff9800" },
              ],
              innerRadius: 40,
              outerRadius: 70,
              paddingAngle: 2,
              cornerRadius: 2,
            },
          ]}
          width={chartSize}
          height={chartSize}
          legend={{ hidden: true }}
        />
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#3f51b5" }} />
            <Typography fontSize={12}>Estratégicas: {totalEstrategicas}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#4caf50" }} />
            <Typography fontSize={12}>Táticas: {totalTaticas}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f44336" }} />
            <Typography fontSize={12}>Operacionais: {totalOperacionais}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff9800" }} />
            <Typography fontSize={12}>Tarefas: {totalTarefas}</Typography>
          </Box>
        </Box>
      </Box>

      {/* ✅ Diretrizes Concluídas */}
      <Box display="flex" alignItems="center" gap={2}>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: totalEstrategicasConcluidas, color: "#3f51b5" },
                { id: 1, value: totalTaticasConcluidas, color: "#4caf50" },
                { id: 2, value: totalOperacionaisConcluidos, color: "#f44336" },
                { id: 3, value: totalTarefasConcluidas, color: "#ff9800" },
              ],
              innerRadius: 40,
              outerRadius: 70,
              paddingAngle: 2,
              cornerRadius: 2,
            },
          ]}
          width={chartSize}
          height={chartSize}
          legend={{ hidden: true }}
        />
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#3f51b5" }} />
            <Typography fontSize={12}>Estratégicas concluídas: {totalEstrategicasConcluidas}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#4caf50" }} />
            <Typography fontSize={12}>Táticas concluídas: {totalTaticasConcluidas}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f44336" }} />
            <Typography fontSize={12}>Operacionais concluídas: {totalOperacionaisConcluidos}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff9800" }} />
            <Typography fontSize={12}>Tarefas concluídas: {totalTarefasConcluidas}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GraficosDiretrizes;
