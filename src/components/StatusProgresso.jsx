import { Box, LinearProgress, Typography } from "@mui/material";

const StatusProgresso = ({ progresso, cor: corPersonalizada }) => {
  const cor =
    corPersonalizada ||
    (progresso === 100
      ? "#00ff08"
      : progresso >= 1
      ? "#312783"
      : "#9ca3af");

  return (
    <Box sx={{ minWidth: 60, mr: 2, textAlign: "center" }}>
      <Typography sx={{ fontSize: "0.75rem", color: "#fff", mb: 0.5 }}>
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

export default StatusProgresso;

