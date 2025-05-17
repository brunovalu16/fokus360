import { Box, LinearProgress, Typography } from "@mui/material";

const StatusProgresso2 = ({ progresso, tipo, cor: corPersonalizada }) => {
  let cor = corPersonalizada;

  if (!corPersonalizada) {
    if (progresso === 100) {
      cor = "#00ff08"; // verde para 100%
    } else {
      // cores padrão por tipo, sem alterar lógica original
      switch (tipo) {
        case "tatica":
          cor = "#4caf50"; // azul escuro
          break;
        case "operacional":
          cor = "#f44336"; // verde
          break;
        case "tarefa":
          cor = "#ffbb00"; // amarelo
          break;
        default:
          cor = "#9ca3af"; // cinza padrão
      }
    }
  }

  return (
    <Box sx={{ minWidth: 60, mr: 2, textAlign: "center" }}>
      <Typography sx={{ fontSize: "0.75rem", color: "#747474", mb: 0.5 }}>
        {progresso}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progresso}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor: "#ccc",
          "& .MuiLinearProgress-bar": {
            backgroundColor: cor,
          },
        }}
      />
    </Box>
  );
};

export default StatusProgresso2;
