import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import StatusProgresso4 from "./StatusProgresso4";
import { calcularProgressoTatica } from "../utils/progressoUtils";

const StatusProgressoPorArea = ({ estrategica }) => {
  const progressoPorArea = useMemo(() => {
    const mapa = {};

    // 🔹 Adiciona a área da própria estratégica
    if (estrategica?.areaNome) {
      if (!mapa[estrategica.areaNome]) mapa[estrategica.areaNome] = [];
    }

    // 🔹 Adiciona as táticas por área
    estrategica?.taticas?.forEach((tatica) => {
      const area = tatica.areaNome;
      if (!area) return;

      if (!mapa[area]) mapa[area] = [];
      mapa[area].push(tatica);
    });

    // 🔹 Adiciona uma entrada vazia para a área da estratégica (se ainda não tiver tática associada)
    if (estrategica?.areaNome && mapa[estrategica.areaNome]?.length === 0) {
      mapa[estrategica.areaNome] = [];
    }

    // 🔹 Calcula progresso médio por área
    const resultado = {};
    for (const area in mapa) {
      const taticas = mapa[area];
      const total = taticas.reduce((soma, tat) => soma + calcularProgressoTatica(tat), 0);
      const media = taticas.length > 0 ? Math.round(total / taticas.length) : 0;

      resultado[area] = media;
    }

    return resultado;
  }, [estrategica]);

  return (
    <Box sx={{
      display: "flex",
      gap: 2,
      flexWrap: "nowrap",         // 🔒 tudo em uma linha
      width: "fit-content",       // ✅ permite expansão automática
      paddingBottom: "5px",
    }}>
      {Object.entries(progressoPorArea).map(([area, progresso]) => (
        <Box
          key={area}
          sx={{
            borderRadius: "10px",
            padding: "5px 10px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: "170px",
            whiteSpace: "nowrap"
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#8d8d8d", fontWeight: 600, fontSize: "0.55rem" }}
          >
            {area}
          </Typography>
          <StatusProgresso4 progresso={progresso} />
        </Box>
      ))}
    </Box>
  );
};

export default StatusProgressoPorArea;
