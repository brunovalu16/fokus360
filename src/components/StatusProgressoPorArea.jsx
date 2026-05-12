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
  <Box
    sx={{
      marginLeft: "-45px",
      marginBottom: "20px",
      display: "flex",
      gap: 1.2,
      flexWrap: "nowrap",
      width: "fit-content",
      padding: "10px 14px",
      borderRadius: "18px",
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(246,247,251,0.95) 100%)",
      border: "1px solid rgba(226,232,240,0.9)",
      boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
      backdropFilter: "blur(10px)",
      overflowX: "auto",
      overflowY: "hidden",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    }}
  >
    {Object.entries(progressoPorArea).map(([area, progresso]) => (
      <Box
        key={area}
        sx={{
          minWidth: "210px",
          height: "100px",
          borderRadius: "18px",
          px: 1.8,
          py: 1.2,
          position: "relative",
          overflow: "hidden",

          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",

          border: "1px solid rgba(226,232,240,0.8)",

          boxShadow: `
            0 8px 24px rgba(15,23,42,0.06),
            inset 0 1px 0 rgba(255,255,255,0.8)
          `,

          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",

          transition: "all 0.25s ease",

          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: `
              0 14px 32px rgba(49,39,131,0.12),
              inset 0 1px 0 rgba(255,255,255,0.9)
            `,
          },

          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background:
              progresso >= 80
                ? "linear-gradient(90deg, #4caf50, #66bb6a)"
                : progresso >= 50
                ? "linear-gradient(90deg, #ff9800, #ffb74d)"
                : "linear-gradient(90deg, #f44336, #ef5350)",
          },
        }}
      >
        {/* Topo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.68rem",
              fontWeight: 800,
              color: "#312783",
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              maxWidth: "140px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {area}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 900,
              color:
                progresso >= 80
                  ? "#4caf50"
                  : progresso >= 50
                  ? "#ff9800"
                  : "#f44336",
            }}
          >
            {progresso}%
          </Typography>
        </Box>

        {/* Barra */}
        <Box
          sx={{
            width: "100%",
            height: "8px",
            borderRadius: "999px",
            backgroundColor: "#edf2f7",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: `${progresso}%`,
              height: "100%",
              borderRadius: "999px",
              transition: "all 0.4s ease",

              background:
                progresso >= 80
                  ? "linear-gradient(90deg, #4caf50, #66bb6a)"
                  : progresso >= 50
                  ? "linear-gradient(90deg, #ff9800, #ffb74d)"
                  : "linear-gradient(90deg, #f44336, #ef5350)",

              boxShadow:
                progresso >= 80
                  ? "0 0 12px rgba(76,175,80,0.45)"
                  : progresso >= 50
                  ? "0 0 12px rgba(255,152,0,0.45)"
                  : "0 0 12px rgba(244,67,54,0.45)",
            }}
          />
        </Box>

        {/* Status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.62rem",
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: "0.3px",
            }}
          >
            PERFORMANCE
          </Typography>

          <StatusProgresso4 progresso={progresso} />
        </Box>
      </Box>
    ))}
  </Box>
);
};

export default StatusProgressoPorArea;
