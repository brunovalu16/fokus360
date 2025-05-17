import { Box, MenuItem, Select } from "@mui/material";
import StatusProgresso2 from "./StatusProgresso2";
import {
  calcularProgressoTatica,
  calcularProgressoOperacional,
} from "../utils/progressoUtils";
import React, { useMemo } from "react";

const SelectAreaStatus3 = ({ estrategica, areas, value, onChangeArea }) => {
  const taticasDaArea = useMemo(() => {
    return estrategica.taticas.filter(
      (t) => value && t.areaNome?.toLowerCase() === value.toLowerCase()
    );
  }, [value, estrategica]);

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
          height: 30,
          padding: 0,
          '& .MuiOutlinedInput-input': {
            padding: '4px 8px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-icon': {
            color: '#a7a7a7',
            fontSize: '1rem',
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

      {/* Gráficos lado a lado */}
      {value && (
        <>
          <StatusProgresso2 progresso={progressoTatica} tipo="tatica" />
          <StatusProgresso2 progresso={progressoOperacional} tipo="operacional" />
          <StatusProgresso2 progresso={progressoTarefa} tipo="tarefa" />
        </>
      )}
    </Box>
  );
};

export default SelectAreaStatus3;
