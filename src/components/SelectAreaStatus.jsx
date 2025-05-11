import { Box, MenuItem, Select, Typography } from "@mui/material";
import StatusProgresso from "./StatusProgresso";
import { calcularProgressoTatica } from "../utils/progressoUtils";
import React, { useState, useMemo } from "react";

const SelectAreaStatus = ({ estrategica, areas }) => {
  const [areaSelecionada, setAreaSelecionada] = useState("");

  const taticasDaArea = useMemo(() => {
    return estrategica.taticas.filter((t) => t.areaNome === areaSelecionada);
  }, [areaSelecionada, estrategica]);

  const progresso = useMemo(() => {
    if (taticasDaArea.length === 0) return 0;

    const soma = taticasDaArea.reduce((total, tat) => {
      return total + calcularProgressoTatica(tat);
    }, 0);

    return Math.round(soma / taticasDaArea.length);
  }, [taticasDaArea]);

  return (
    <Box sx={{ minWidth: 220, display: "flex", alignItems: "center", gap: 2 }}>
     <Select
      size="small"
      value={areaSelecionada}
      onChange={(e) => setAreaSelecionada(e.target.value)}
      onClick={(e) => e.stopPropagation()} // 👈 esta linha é o segredo
      displayEmpty
      sx={{
        minWidth: 105,
        fontSize: "0.8rem",
        backgroundColor: "#2d19e5",
        borderRadius: 2,
        color: "#fff"
      }}
    >
        <MenuItem value="" disabled>
          Progresso:
        </MenuItem>
        {areas.map((area) => (
          <MenuItem key={area.id} value={area.nome}>
            {area.nome}
          </MenuItem>
        ))}
      </Select>

      {areaSelecionada && (
        <StatusProgresso progresso={progresso} />
      )}
    </Box>
  );
};

export default SelectAreaStatus;
