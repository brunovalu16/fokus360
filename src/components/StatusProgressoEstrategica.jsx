import { calcularProgressoEstrategica } from "../utils/progressoUtils";
import { Box, Typography, CircularProgress } from "@mui/material";




const StatusProgressoEstrategica = ({ estrategica }) => {
  const progresso = calcularProgressoEstrategica(estrategica);

  let color = "#F44336";
  let text = "Não iniciada";

  if (progresso === 100) {
    color = "#4CAF50";
    text = "Concluído";
  } else if (progresso > 0) {
    color = "#FF9800";
    text = `${progresso}% concluído`;
  }

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: "10px", marginTop: "20px" }}>
      <CircularProgress variant="determinate" value={progresso} sx={{ color }} thickness={10} size={40} />
      <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#9d9d9c" }}>
        {text}
      </Typography>
    </Box>
  );
};

export default StatusProgressoEstrategica;
