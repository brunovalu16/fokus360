import React, { useState } from "react";
import { CircularProgress, Checkbox, ListItemText, Box, Select, Typography, MenuItem, TextField, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "./Header";

// FUNÇÃO DO GRÁFICO PROGRESS QUE CONTROLA O ESTADO DOS CHECKS
const ProgressStatus = ({ checkState }) => {
  const allChecked = Object.values(checkState).every((value) => value);
  const someChecked = Object.values(checkState).some((value) => value);

  const status = allChecked
    ? { color: "#84cc16", text: "Finalizado" }
    : someChecked
    ? { color: "#4338ca", text: "Em andamento" }
    : { color: "#57534e", text: "Não iniciado" };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{ marginLeft: "auto", marginRight: "30px" }}
    >
      <CircularProgress
        variant="determinate"
        value={
          (Object.values(checkState).filter(Boolean).length /
            Object.keys(checkState).length) *
          100
        }
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

// FIM DA FUNÇÃO DO GRÁFICO

const DiretrizData2 = ({ checkState, handleCheckChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [responsaveis, setResponsaveis] = useState([]);
  const [quem, setQuem] = useState([]);
  // Este estado guardará os valores do formulário, incluindo "valor"
  const [formValues, setFormValues] = useState({});

  

  // Função do Accordion
  const handleAccordionToggle = () => {
    setExpanded(!expanded);
  };

  // Manipulador para "Responsáveis"
  const handleResponsaveisChange = (event) => {
    const value = event.target.value;
    setResponsaveis(typeof value === "string" ? value.split(",") : value);
  };

  // Manipulador para "Quem"
  const handleQuemChange = (event) => {
    const value = event.target.value;
    setQuem(typeof value === "string" ? value.split(",") : value);
  };

  // Função de input genérico (se precisar usar para outros campos)
  const handleInputChangeReal = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Função que formata em moeda
  const handleCurrencyChange = (event) => {
    const { name, value } = event.target;
    // 1) Extrai somente dígitos
    const onlyNumbers = value.replace(/[^\d]/g, "");
    // 2) Formata como moeda
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(onlyNumbers / 100);

    // 3) Atualiza o estado local
    setFormValues((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionToggle}
      sx={{
        boxShadow: "none",
        backgroundColor: "transparent",
      }}
    >
      {/* TAREFA 01*/}
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: "#FFF",
          borderRadius: "10px",
          paddingLeft: "10px",
          paddingRight: "10px",
          boxShadow: "none",
          border: "none",
          cursor: "pointer",
          userSelect: "none",
          position: "relative", // Define o contexto para posicionamento absoluto
        }}
      >
        {/* Ícone com posição fixa horizontal */}
        <PlayCircleFilledWhiteIcon
          sx={{
            color: "#5f53e5",
            fontSize: 30,
            position: "absolute", // Fixa a posição do ícone
            left: "40px", // Define a distância fixa da borda esquerda
            top: "50%", // Centraliza verticalmente
            transform: "translateY(-50%)", // Ajuste fino na centralização
            zIndex: 10, // Garante que o ícone fique acima de outros elementos
          }}
        />

        {/* Título do Accordion */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#5f54e7",
            marginLeft: "80px", // Espaço para evitar sobreposição com o ícone
            marginTop: "5px",
          }}
        >
          Desenvolver sistema Fokus360 para o Grupo Fokus
        </Typography>

        {/* Campo de Valor (exemplo fixo) */}
        <Typography
          variant="body1"
          sx={{
            marginLeft: "auto", // Empurra para a direita
            marginRight: "10px", // Espaçamento à direita antes do Checkbox
            fontWeight: "500",
            color: "#5f54e7",
            alignSelf: "center", // Centraliza verticalmente
          }}
        >
          R$ 5.000,00
        </Typography>

        {/* Progresso */}
        <ProgressStatus checkState={checkState} />

        {/* Checkbox */}
        <Checkbox
          checked={checkState.tarefa}
          onChange={() => handleCheckChange("tarefa")}
          sx={{
            marginLeft: "0", // Espaçamento padrão
            marginTop: "-2px",
          }}
        />
      </AccordionSummary>

      <AccordionDetails>
        <Box sx={{ marginLeft: "40px", paddingTop: "10px" }}>
          <Header
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <PlayCircleFilledWhiteIcon
                  sx={{ color: "#5f53e5", fontSize: 30 }}
                />
                <Typography>PLANO DE AÇÃO (5W2H) PARA ESSA TAREFA</Typography>
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
          <Box width="320px">
            <Select
              multiple
              name="responsaveis"
              value={responsaveis}
              onChange={handleResponsaveisChange}
              displayEmpty
              fullWidth
              renderValue={(selected) =>
                selected.length === 0
                  ? "Responsáveis para essa tarefa"
                  : selected.join(", ")
              }
            >
              {["financeiro", "rh", "marketing", "ti"].map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={responsaveis.indexOf(option) > -1} />
                  <ListItemText
                    primary={option.charAt(0).toUpperCase() + option.slice(1)}
                  />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Campos adicionais */}
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
            { label: "Quem", field: "quem" },
            { label: "Onde", field: "onde" },
            { label: "Como", field: "como" },
            { label: "Valor gasto", field: "valor" },
          ].map(({ label, field }) => (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ flex: "1 1 30%" }}
              key={field}
            >
              {/* Se for "valor", exibimos o TextField + checkbox */}
              {field === "valor" ? (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{ flex: "1 1 30%" }}
                >
                  <TextField
                    label="Valor do orçamento para essa tarefa..."
                    name="valor"
                    value={formValues.valor}
                    onChange={handleCurrencyChange} // A FUNÇÃO DE FORMATAÇÃO
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                      style: { position: "absolute", top: "5px", left: "5px" },
                    }}
                  />
                  {/* Checkbox do campo "valor" */}
                  <Checkbox
                    checked={checkState[field]}
                    onChange={() => handleCheckChange(field)}
                  />
                </Box>
              ) : field === "quem" ? (
                // Se for "quem", exibimos o multiple Select
                <Box sx={{ flex: 1, marginRight: 5.4 }}>
                  <Select
                    multiple
                    name="quem"
                    value={quem}
                    onChange={handleQuemChange}
                    displayEmpty
                    fullWidth
                    renderValue={(selected) =>
                      selected.length === 0 ? "Quem..." : selected.join(", ")
                    }
                    sx={{ height: "40px" }}
                  >
                    {["financeiro", "rh", "marketing", "ti"].map((option) => (
                      <MenuItem key={option} value={option}>
                        <Checkbox checked={quem.indexOf(option) > -1} />
                        <ListItemText
                          primary={
                            option.charAt(0).toUpperCase() + option.slice(1)
                          }
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              ) : (
                // Caso contrário, campos normais + checkbox
                <>
                  <TextField
                    placeholder={`${label.toLowerCase()}...`}
                    label={label}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        position: "absolute",
                        top: "5px",
                        left: "1px",
                        fontSize: "15px",
                      },
                    }}
                  />
                  <Checkbox
                    checked={checkState[field]}
                    onChange={() => handleCheckChange(field)}
                  />
                </>
              )}
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default DiretrizData2;
