// Novo componente para o gráfico de progresso
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProgressStatus = ({ checkState }) => {
  const allChecked = Object.values(checkState).every((value) => value);
  const someChecked = Object.values(checkState).some((value) => value);

  const status = allChecked
    ? { color: "green", text: "Finalizado" }
    : someChecked
    ? { color: "yellow", text: "Em andamento" }
    : { color: "gray", text: "Não iniciado" };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <CircularProgress
        variant="determinate"
        value={
          (Object.values(checkState).filter(Boolean).length / 7) * 100
        }
        sx={{ color: status.color }}
      />
      <Typography
        variant="h6"
        sx={{ color: status.color, fontWeight: "bold" }}
      >
        {status.text}
      </Typography>
    </Box>
  );
};

export default ProgressStatus;
