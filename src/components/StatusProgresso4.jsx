import { Box, CircularProgress, Typography } from "@mui/material";

const StatusProgresso4 = ({ progresso, cor: corPersonalizada }) => {
  const cor =
    corPersonalizada ||
    (progresso === 100
      ? "#312783"
      : progresso >= 1
      ? "#312783"
      : "#312783");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 60,
        mr: 2,
        textAlign: "center",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={progresso}
          size={45}
          thickness={7.5}
          sx={{
            color: cor,
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ fontSize: "0.65rem", color: "#000", fontWeight: 600 }}
          >
            {`${progresso}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StatusProgresso4;
