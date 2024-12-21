import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Box, Button, Typography, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DiretrizData2 from "./DiretrizData2";
import { mockDiretrizes } from "../data/mockData";


// FUNÇÃO DO GRÁFICO PROGRESS QUE CONTROLA O ESTADO DOS CHECKS
const ProgressStatus = ({ checkState }) => {
  const allChecked = Object.values(checkState).every((value) => value);
  const someChecked = Object.values(checkState).some((value) => value);

  const status = allChecked
    ? { color: "#a3e635", text: "100%" }
    : someChecked
    ? { color: "#fde047", text: "30%" }
    : { color: "#00ebf7", text: "Não iniciado" };

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: "auto", marginRight: "30px" }}>
      <CircularProgress
        variant="determinate"
        value={
          (Object.values(checkState).filter(Boolean).length /
            Object.keys(checkState).length) *
          100
        }
        sx={{ color: status.color }}
        thickness={10} // Ajusta a espessura
        size={30} // Define o tamanho do círculo (diâmetro em pixels)
      />
      <Typography variant="h5" sx={{ color: status.color, fontWeight: "bold" }}>
        {status.text}
      </Typography>
    </Box>
  );
};
 // FIM   FUNÇÃO DO GRÁFICO QUE CONTROLA O ESTADO DOS CHECKS

const BaseDiretriz2 = () => {
  const [checkState, setCheckState] = useState({
    tarefa: false,
    oQue: false,
    porQue: false,
    quando: false,
    onde: false,
    como: false,
    valor: false,
  });

  const handleCheckChange = (field) => {
    setCheckState((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const [diretrizes] = useState(mockDiretrizes || []);

  return (
    <Box>
      {diretrizes.map((item) => (
        <Accordion
          key={item.id}
          disableGutters
          sx={{
            backgroundColor: "transparent",
            borderRadius: "8px",
            boxShadow: "none",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#b7b7b7" }} />}
            sx={{
              marginBottom: "10px",
              borderRadius: "8px",
              backgroundColor: "#5f53e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Button
                disableRipple
                sx={{
                  textAlign: "left",
                  flex: 1,
                  textTransform: "none",
                  color: "#b7b7b7",
                  padding: 0,
                  justifyContent: "flex-start",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <Box>
                  <Typography fontWeight="bold" sx={{ color: "#b7b7b7" }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: "0.9em" }}>
                    {item.description}
                  </Typography>
                </Box>
              </Button>

              <ProgressStatus checkState={checkState} />
              <Button
                disableRipple
                variant="outlined"
                sx={{
                  minWidth: "40px",
                  padding: "5px",
                  border: "none",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    border: "none",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                <DeleteForeverIcon sx={{ fontSize: 24, color: "#b7b7b7" }} />
              </Button>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <DiretrizData2 checkState={checkState} handleCheckChange={handleCheckChange} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default BaseDiretriz2;
