import { Box, MenuItem, Select, Typography  } from "@mui/material";
import StatusProgresso2 from "./StatusProgresso2";
import {
  calcularProgressoTatica,
  calcularProgressoOperacional,
} from "../utils/progressoUtils";
import React, { useMemo } from "react";

const SelectAreaStatus3 = ({ estrategica, areas, value, onChangeArea }) => {
  const taticasDaArea = useMemo(() => {
  if (!value) return [];

  return (estrategica.taticas || []).filter((t) => {
    return (
      t.areaNome?.toLowerCase() === value.toLowerCase() ||
      t.areaNomes?.some?.(
        (nome) => nome?.toLowerCase() === value.toLowerCase()
      ) ||
      t.areasResponsaveis?.some?.((areaId) => {
        const areaObj = areas.find((area) => area.id === areaId);
        return areaObj?.nome?.toLowerCase() === value.toLowerCase();
      })
    );
  });
}, [value, estrategica, areas]);

  const progressoTatica = useMemo(() => {
    if (taticasDaArea.length === 0) return 0;
    const soma = taticasDaArea.reduce((acc, tat) => acc + calcularProgressoTatica(tat), 0);
    return Math.round(soma / taticasDaArea.length);
  }, [taticasDaArea]);

  const progressoOperacional = useMemo(() => {
    const operacionais = taticasDaArea.flatMap(t => t.operacionais || []);
    if (operacionais.length === 0) return 0;
    const soma = operacionais.reduce((acc, op) => acc + calcularProgressoOperacional(op), 0);
    return Math.round(soma / operacionais.length);
  }, [taticasDaArea]);

  const progressoTarefa = useMemo(() => {
    const tarefas = taticasDaArea
      .flatMap(t => t.operacionais || [])
      .flatMap(op => op.tarefas || []);
    if (tarefas.length === 0) return 0;
    const concluidas = tarefas.filter(t => t.status === "concluida").length;
    return Math.round((concluidas / tarefas.length) * 100);
  }, [taticasDaArea]);

  return (
    <Box sx={{ minWidth: 220, display: "flex", alignItems: "center", gap: 1 }}>
      <Box
  sx={{
    minWidth: 320,
    marginLeft: "-50px",
    display: "flex",
    alignItems: "center",
    gap: 1.2,
    px: 1.4,
    py: 0.8,
    borderRadius: "14px",
    background: "#312783",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
  }}
>
  <Typography
    sx={{
      fontSize: "0.72rem",
      fontWeight: 400,
      color: "#fff  ",
      whiteSpace: "nowrap",
      letterSpacing: "0.3px",
    }}
  >
    Selecione Táticas por áreas
  </Typography>

  <Select
    size="small"
    value={value || ""}
    onChange={(e) => onChangeArea(e.target.value)}
    onClick={(e) => e.stopPropagation()}
    displayEmpty
    sx={{
      minWidth: 130,
      height: 32,
      fontSize: "0.75rem",
      fontWeight: 700,
      backgroundColor: "#f2f0f0",
      borderRadius: "10px",
      color: value ? "#312783" : "#969696",

      "& .MuiOutlinedInput-input": {
        padding: "5px 28px 5px 10px",
      },

      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #e5e7eb",
      },

      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#c7c9d9",
      },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#312783",
        borderWidth: "1px",
      },

      "& .MuiSelect-icon": {
        color: "#312783",
        fontSize: "1.1rem",
      },
    }}
  >
    <MenuItem value="" disabled>
      Escolha a área
    </MenuItem>

    {(areas || []).map((area) => (
      <MenuItem key={area.id} value={area.nome}>
        {area.nome}
      </MenuItem>
    ))}
  </Select>
</Box>

      {/* Gráficos lado a lado */}
      {value && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: "#4caf50", fontSize: "0.8rem", minWidth: "50px" }}>
              Tática:
            </Typography>
            <StatusProgresso2 progresso={progressoTatica} tipo="tatica" />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: "#f44336", fontSize: "0.8rem", minWidth: "80px" }}>
              Operacional:
            </Typography>
            <StatusProgresso2 progresso={progressoOperacional} tipo="operacional" />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: "#ffa600", fontSize: "0.8rem", minWidth: "50px" }}>
              Tarefa:
            </Typography>
            <StatusProgresso2 progresso={progressoTarefa} tipo="tarefa" />
          </Box>

        </>
      )}
    </Box>
  );
};

export default SelectAreaStatus3;
