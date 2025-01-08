import React, { useState } from "react";
import { Box, TextField, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DiretrizData from "./DiretrizData";

/**
 *  BaseDiretriz
 *
 *  Recebe via props:
 *    - diretrizes (array)
 *    - onUpdate(diretrizesAtualizadas): callback para avisar o pai
 */
const BaseDiretriz = ({ diretrizes = [], onUpdate }) => {
  const [novaDiretriz, setNovaDiretriz] = useState("");
  const [descricaoDiretriz, setDescricaoDiretriz] = useState("");

  // --------------------------------------
  // Adicionar nova diretriz no array
  // --------------------------------------
  const handleAddDiretriz = () => {
    if (novaDiretriz.trim() === "" || descricaoDiretriz.trim() === "") {
      alert("Preencha os campos de título e descrição da diretriz!");
      return;
    }

    const nova = {
      id: Date.now(),
      titulo: novaDiretriz,
      descricao: descricaoDiretriz,
      tarefas: [], // começa vazia
    };

    const diretrizesAtualizadas = [...diretrizes, nova];
    onUpdate(diretrizesAtualizadas);

    // Limpa os inputs
    setNovaDiretriz("");
    setDescricaoDiretriz("");
  };

  // --------------------------------------
  // Remover diretriz do array
  // --------------------------------------
  const handleRemoveDiretriz = (id) => {
    const diretrizesAtualizadas = diretrizes.filter((d) => d.id !== id);
    onUpdate(diretrizesAtualizadas);
  };

  // --------------------------------------
  // Atualizar UMA diretriz (quando DiretrizData mexer em tarefas, etc.)
  // --------------------------------------
  const handleUpdateUmaDiretriz = (diretrizAtualizada) => {
    const diretrizesAtualizadas = diretrizes.map((d) =>
      d.id === diretrizAtualizada.id ? diretrizAtualizada : d
    );
    onUpdate(diretrizesAtualizadas);
  };

  // --------------------------------------
  // Render
  // --------------------------------------
  return (
    <Box>
      {/* Input para criar diretriz */}
      <Box display="flex" flexDirection="column" gap={2} marginBottom="20px">
        <TextField
          label="Nome da diretriz..."
          value={novaDiretriz}
          onChange={(e) => setNovaDiretriz(e.target.value)}
          fullWidth
        />

        <TextField
          label="Descrição da diretriz..."
          value={descricaoDiretriz}
          onChange={(e) => setDescricaoDiretriz(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />

        <Button
          onClick={handleAddDiretriz}
          disableRipple
          sx={{
            alignSelf: "flex-start",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&:focus": {
              outline: "none",
            },
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#5f53e5" }} />
        </Button>
      </Box>

      {/* Lista de diretrizes */}
      {diretrizes.map((item) => (
        <Accordion
          key={item.id}
          disableGutters
          sx={{
            backgroundColor: "transparent",
            borderRadius: "8px",
            boxShadow: "none",
            marginBottom: "10px",
          }}
        >
          {/* Cabeçalho do Accordion */}
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#b7b7b7" }} />}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#5f53e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                {item.titulo}
              </Typography>
              <Typography sx={{ color: "#b7b7b7", fontSize: "0.9em" }}>
                {item.descricao}
              </Typography>
            </Box>

            {/* Botão de Remoção da Diretriz */}
            <Button
              disableRipple
              onClick={(e) => {
                e.stopPropagation(); // Evita abrir o accordion ao clicar
                handleRemoveDiretriz(item.id);
              }}
              sx={{
                minWidth: "40px",
                padding: "5px",
                border: "none",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <DeleteForeverIcon sx={{ fontSize: 24, color: "#b7b7b7" }} />
            </Button>
          </AccordionSummary>

          {/* Detalhes (tarefas, 5W2H) */}
          <AccordionDetails>
            <DiretrizData diretriz={item} onUpdate={handleUpdateUmaDiretriz} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default BaseDiretriz;
