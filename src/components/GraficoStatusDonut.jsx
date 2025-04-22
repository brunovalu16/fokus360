import React from "react";
import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const GraficoStatusDonut = ({ tipo, diretrizes = [], estrategicas = [] }) => {
  // --- Funções auxiliares ---
  const countAllTaticas = (diretrizes) =>
    diretrizes.reduce((acc, d) => acc + (d.taticas?.length || 0), 0);

  const countAllOperacionais = (diretrizes) =>
    diretrizes.reduce(
      (acc, d) =>
        acc +
        d.taticas?.reduce(
          (acc2, t) => acc2 + (t.operacionais?.length || 0),
          0
        ),
      0
    );

  const countAllTarefas = (diretrizes) =>
    diretrizes.reduce(
      (acc, d) =>
        acc +
        d.taticas?.reduce(
          (acc2, t) =>
            acc2 +
            t.operacionais?.reduce(
              (acc3, o) => acc3 + (o.tarefas?.length || 0),
              0
            ),
          0
        ),
      0
    );

  const countConcluidas = (estrategicas, nivel) => {
    let count = 0;
    estrategicas.forEach((est) => {
      if (nivel === "estrategica" && est.status === "concluida") count++;

      est.taticas?.forEach((tat) => {
        if (nivel === "tatica" && tat.status === "concluida") count++;

        tat.operacionais?.forEach((op) => {
          if (nivel === "operacional" && op.status === "concluida") count++;

          op.tarefas?.forEach((t) => {
            if (nivel === "tarefa" && t.status === "concluida") count++;
          });
        });
      });
    });
    return count;
  };

  const data =
  tipo === "total"
    ? [
        { label: "Diretrizes", value: diretrizes?.length || 0, color: "#4e79a7" },
        { label: "Táticas", value: countAllTaticas(diretrizes), color: "#f28e2b" },
        { label: "Operacionais", value: countAllOperacionais(diretrizes), color: "#e15759" },
        { label: "Tarefas", value: countAllTarefas(diretrizes), color: "#76b7b2" },
      ]
    : [
        { label: "Estratégicas", value: countConcluidas(estrategicas, "estrategica"), color: "#4e79a7" },
        { label: "Táticas", value: countConcluidas(estrategicas, "tatica"), color: "#f28e2b" },
        { label: "Operacionais", value: countConcluidas(estrategicas, "operacional"), color: "#e15759" },
        { label: "Tarefas", value: countConcluidas(estrategicas, "tarefa"), color: "#76b7b2" },
      ];


  // --- Renderização final ---
  return (
    <Box>
      <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
        {tipo === "total" ? "Totais do Projeto" : "Itens Concluídos"}
      </Typography>

      <PieChart
        series={[{ data, innerRadius: 50 }]}
        width={300}
        height={200}
        legend={{
          direction: "row",
          position: { vertical: "bottom", horizontal: "middle" },
        }}
      />

      {/* ✅ Lista abaixo do gráfico */}
      <Box sx={{ mt: 2 }}>
        {data.map((item, index) => (
          <Typography
            key={index}
            sx={{ color: "#fff", fontSize: "13px", textAlign: "left", ml: 2 }}
          >
            {tipo === "total"
              ? `Total de ${item.label}: ${item.value}`
              : `${item.label} concluídas: ${item.value}`}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default GraficoStatusDonut;
