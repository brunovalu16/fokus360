import React, { useState } from "react";
import { Box, Button, Typography, TextField, Accordion, AccordionDetails, AccordionSummary, } from "@mui/material";
import { mockDiretrizes } from "../data/mockData";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DiretrizData from "./DiretrizData";


const BaseDiretriz = () => {
  const [diretrizes] = useState(mockDiretrizes || []);

  return (
    <>
      <Box>
        {/* Lista de Diretrizes */}
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
            {/* Cabeçalho do Accordion */}
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
            </AccordionSummary>

            {/* Detalhes do Accordion */}
            <AccordionDetails>
              <DiretrizData />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
};

export default BaseDiretriz;