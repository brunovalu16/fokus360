// =====================================
// 1) Funções que verificam se está concluído (booleans)
//    Copie exatamente a lógica que você já usa no BaseDiretriz2
// =====================================



// Por exemplo, no final do progressHelpers.js
import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

export function ProgressStatus({ progresso, size = 40 }) {
  let color;
  if (progresso === 100) {
    color = "#4CAF50"; // Verde
  } else if (progresso >= 50) {
    color = "#FF9800"; // Laranja
  } else {
    color = "#F44336"; // Vermelho
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <CircularProgress
        variant="determinate"
        value={progresso}
        sx={{ color }}
        thickness={10}
        size={size}
      />
      <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#9d9d9c" }}>
        {progresso === 100 ? "Concluído" : `${progresso}%`}
      </Typography>
    </Box>
  );
}




export function isOperacionalConcluido(operacional) {
    // Exemplo de lógica “só é concluído se todas as tarefas tiverem .checkboxState.concluida”
    if (!operacional.tarefas || operacional.tarefas.length === 0) {
      return false; // se quiser que Operacional vazia não seja concluída
    }
    for (const tarefa of operacional.tarefas) {
      if (!tarefa?.checkboxState?.concluida) {
        return false;
      }
    }
    return true;
  }
  
  export function isTaticaConcluida(tatica) {
    if (!tatica.operacionais || tatica.operacionais.length === 0) {
      return false; 
    }
    for (const operacional of tatica.operacionais) {
      if (!isOperacionalConcluido(operacional)) {
        return false;
      }
    }
    return true;
  }
  
  export function isDiretrizConcluida(diretriz) {
    if (!diretriz.taticas || diretriz.taticas.length === 0) {
      return false;
    }
    for (const tatica of diretriz.taticas) {
      if (!isTaticaConcluida(tatica)) {
        return false;
      }
    }
    return true;
  }
  
  // =====================================
  // 2) Funções para calcular “progresso” em %
  //    (se você quiser ver parcial, ex: 50%, 70%, etc.)
  // =====================================
  
  // a) Progresso da Tarefa (exemplo simples)
  export function calcularProgressoTarefa(tarefa) {
    // Lógica simples: se tiver "checkboxState.concluida === true", então 100%, senão 0%
    if (tarefa?.checkboxState?.concluida) {
      return 100;
    }
    return 0;
  }
  
  // b) Progresso da Operacional (quantas tarefas concluídas / total de tarefas)
  export function calcularProgressoOperacional(operacional) {
    if (!operacional.tarefas || operacional.tarefas.length === 0) {
      return 0;
    }
    let total = operacional.tarefas.length;
    let concluidas = 0;
    for (const tarefa of operacional.tarefas) {
      if (tarefa?.checkboxState?.concluida) {
        concluidas++;
      }
    }
    return Math.round((concluidas / total) * 100);
  }
  
  // c) Progresso da Tática (quantas Operacionais concluídas / total)
  export function calcularProgressoTatica(tatica) {
    if (!tatica.operacionais || tatica.operacionais.length === 0) {
      return 0;
    }
    let totalOp = tatica.operacionais.length;
    let concluidas = 0;
    for (const op of tatica.operacionais) {
      if (isOperacionalConcluido(op)) {
        concluidas++;
      }
    }
    return Math.round((concluidas / totalOp) * 100);
  }
  
  // d) Progresso da Estratégia (quantas Táticas concluídas / total)
  export function calcularProgressoEstrategica(diretriz) {
    if (!diretriz.taticas || diretriz.taticas.length === 0) {
      return 0;
    }
    let totalTat = diretriz.taticas.length;
    let concluidas = 0;
    for (const tatica of diretriz.taticas) {
      if (isTaticaConcluida(tatica)) {
        concluidas++;
      }
    }
    return Math.round((concluidas / totalTat) * 100);
  }
  