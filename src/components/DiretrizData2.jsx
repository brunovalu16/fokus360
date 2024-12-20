import React, { useState } from "react";
import {
  Checkbox,
  ListItemText,
  Box,
  Select,
  Typography,
  MenuItem,
  TextField,
  Accordion,
  AccordionDetails,
} from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import Header from "./Header";

const DiretrizData2 = ({ checkState, handleCheckChange }) => {
  const [formValues, setFormValues] = useState({
    nome: "",
    dataInicio: "",
    prazoPrevisto: "",
    cliente: "",
    categoria: [],
    valor: "",
    descricao: "",
  });

  const handleInputChangeReal = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (e) => {
    setFormValues({ ...formValues, categoria: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Accordion
      sx={{
        boxShadow: "none",
        backgroundColor: "transparent",
      }}
    >
      <AccordionDetails>
        <Box sx={{ marginLeft: "40px", paddingTop: "10px" }}>
          <Header
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <PlayCircleFilledWhiteIcon
                  sx={{ color: "#5f53e5", fontSize: 30 }}
                />
                <Typography>TAREFAS CADASTRADAS PARA ESSA DIRETRIZ</Typography>
              </Box>
            }
          />
        </Box>

        {/* Formulário para criar nova tarefa */}
        <Box
          display="flex"
          alignItems="flex-start"
          gap={2}
          marginBottom="30px"
          sx={{
            marginLeft: "70px",
            marginRight: "60px",
            flexGrow: 1,
            flexWrap: "wrap",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ flex: "1 1 30%" }}
          >
            <TextField
              label="Digite uma tarefa..."
              name="nome"
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
                style: {
                  position: "absolute",
                  top: "5px",
                  left: "5px",
                  fontSize: "15px",
                },
              }}
            />
            <Checkbox
              checked={checkState.tarefa}
              onChange={() => handleCheckChange("tarefa")}
            />
          </Box>

          <Box width="320px">
            <Select
              multiple
              name="categoria"
              value={formValues.categoria}
              onChange={handleSelectChange}
              displayEmpty
              fullWidth
              renderValue={(selected) =>
                selected.length === 0
                  ? "Responsáveis para essa tarefa"
                  : selected.join(", ")
              }
            >
              <MenuItem disabled value="">
                <ListItemText primary="Selecione responsáveis pelo projeto" />
              </MenuItem>

              {["financeiro", "rh", "marketing", "ti"].map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox
                    checked={formValues.categoria.indexOf(option) > -1}
                  />
                  <ListItemText
                    primary={
                      option.charAt(0).toUpperCase() + option.slice(1)
                    }
                  />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Outros campos com checkboxes */}
        <Box
          display="flex"
          alignItems="flex-start"
          gap={2}
          marginBottom="30px"
          sx={{
            marginLeft: "70px",
            marginRight: "60px",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "O que", field: "oQue" },
            { label: "Por que", field: "porQue" },
            { label: "Quando", field: "quando" },
            { label: "Onde", field: "onde" },
            { label: "Como", field: "como" },
            { label: "Valor", field: "valor" },
          ].map(({ label, field }) => (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ flex: "1 1 30%" }}
              key={field}
            >
              <TextField
                placeholder={`Digite ${label.toLowerCase()}...`}
                label={label}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: {
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    fontSize: "15px",
                  },
                }}
              />
              <Checkbox
                checked={checkState[field]}
                onChange={() => handleCheckChange(field)}
              />
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default DiretrizData2;
