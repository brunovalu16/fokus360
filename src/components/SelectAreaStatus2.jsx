import { Box, MenuItem, Select } from "@mui/material";
import StatusProgresso from "./StatusProgresso";
import { calcularProgressoTatica } from "../utils/progressoUtils";
import React, { useMemo } from "react";

const SelectAreaStatus2 = ({ estrategica, areas, value, onChangeArea }) => {
  const taticasDaArea = useMemo(() => {
    return estrategica.taticas.filter(
      (t) => value && t.areaNome?.toLowerCase() === value.toLowerCase()
    );
  }, [value, estrategica]);

  const progresso = useMemo(() => {
    if (taticasDaArea.length === 0) return 0;
    const soma = taticasDaArea.reduce((total, tat) => total + calcularProgressoTatica(tat), 0);
    return Math.round(soma / taticasDaArea.length);
  }, [taticasDaArea]);

  return (
    <Box sx={{ minWidth: 220, display: "flex", alignItems: "center", gap: 2 }}>
  <Select
    size="small"
    value={value || ""}
    onChange={(e) => onChangeArea(e.target.value)}
    onClick={(e) => e.stopPropagation()}
    displayEmpty
    sx={{
      minWidth: 105,
      fontSize: "0.75rem",
      backgroundColor: "#f2f0f0",
      borderRadius: 2,
      color: "#969696",
      height: 30, // ✅ reduz a altura do Select
      padding: 0, // ✅ remove padding extra
      '& .MuiOutlinedInput-input': {
        padding: '4px 8px', // ✅ menor padding interno
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
      '& .MuiSelect-icon': {
        color: '#a7a7a7',
        fontSize: '1rem', // opcional: diminui a seta
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

  {value && <StatusProgresso progresso={progresso} />}
</Box>

  );
};

export default SelectAreaStatus2;
