import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProgressStatus = ({ checkState }) => {
  const totalChecks = Object.keys(checkState).length; // Total de campos no estado
  const completedChecks = Object.values(checkState).filter(Boolean).length; // Quantos estão marcados

  const allChecked = completedChecks === totalChecks;
  const someChecked = completedChecks > 0 && !allChecked;

  const status = allChecked
    ? { color: "#84cc16", text: "Finalizado" } // Verde
    : someChecked
    ? { color: "#4338ca", text: "Em andamento" } // Azul
    : { color: "#57534e", text: "Não iniciado" }; // Cinza

  const progressValue = (completedChecks / totalChecks) * 100; // Progresso dinâmico

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{ marginLeft: "auto", marginRight: "30px" }}
    >
      <CircularProgress
        variant="determinate"
        value={progressValue}
        sx={{ color: status.color }}
        thickness={10}
        size={30}
      />
      <Typography variant="h5" sx={{ color: status.color, fontWeight: "bold" }}>
        {status.text}
      </Typography>
    </Box>
  );
};


export default ProgressStatus;
