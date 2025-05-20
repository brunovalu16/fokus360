import { Box, MenuItem, Select, Typography } from "@mui/material";
import StatusProgresso4 from "./StatusProgresso4";
import { calcularProgressoTatica } from "../utils/progressoUtils";
import React, { useState, useMemo } from "react";

const SelectAreaStatus5 = ({ estrategica, areas }) => {
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
      onClick={(e) => e.stopPropagation()}
      displayEmpty
      sx={{
        minWidth: 105,
        fontSize: "0.8rem",
        backgroundColor: "#312783",
        borderRadius: 2,
        color: "#fff",
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiSelect-icon': {
      color: '#fff', // ✅ seta branca
    },
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
        <StatusProgresso4 progresso={progresso} />
      )}
    </Box>
  );
};

export default SelectAreaStatus5;
