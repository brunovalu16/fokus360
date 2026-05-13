import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import StatusProgresso4 from "./StatusProgresso4";
import { calcularProgressoTatica } from "../utils/progressoUtils";

const StatusProgressoPorArea = ({ estrategicas = [] }) => {
  const coresAreas = {
    "ADMIN/FINAN": "#4254fb",
    "ADM/FINAN": "#4254fb",
    "ADM/FINAN, COMERCIAL, LOGÍSTICA": "#4254fb",
    "LOGÍSTICA": "#00c48c",
    "LOGISTICA": "#00c48c",
    "COMERCIAL": "#fa4f58",
  };

  const progressoPorArea = useMemo(() => {

    const mapa = {};

    // 🔥 percorre TODAS as estratégicas do projeto
    estrategicas.forEach((estrategica) => {

      (estrategica.taticas || []).forEach((tatica) => {

        const area = tatica.areaNome;

        if (!area) return;

        if (!mapa[area]) {
          mapa[area] = [];
        }

        mapa[area].push(tatica);

      });

    });

    // 🔥 calcula média REAL do projeto inteiro
    const resultado = {};

    Object.keys(mapa).forEach((area) => {

      const taticas = mapa[area];

      const soma = taticas.reduce(
        (acc, tat) => acc + calcularProgressoTatica(tat),
        0
      );

      resultado[area] =
        taticas.length > 0
          ? Math.round(soma / taticas.length)
          : 0;

    });

    return resultado;

  }, [estrategicas]);

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

            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "4px",

              background: `linear-gradient(90deg, ${coresAreas[area]}, ${coresAreas[area]})`,
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
                textTransform: "uppercase",
              }}
            >
              {area}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.85rem",
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
            }}
          >
            <Box
              sx={{
                width: `${progresso}%`,
                height: "100%",
                borderRadius: "999px",

                background:
                  progresso >= 80
                    ? "linear-gradient(90deg, #4caf50, #66bb6a)"
                    : progresso >= 50
                    ? "linear-gradient(90deg, #ff9800, #ffb74d)"
                    : "linear-gradient(90deg, #f44336, #ef5350)",
              }}
            />
          </Box>

          {/* Rodapé */}
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
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: "0.3px",
              }}
            >
              PERFORMANCE GERAL
            </Typography>

            <StatusProgresso4 progresso={progresso} />
          </Box>

        </Box>

      ))}
    </Box>
  );
};

export default StatusProgressoPorArea;