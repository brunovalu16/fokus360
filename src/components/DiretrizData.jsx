import React, { useState } from "react";
import { Checkbox, ListItemText, Dialog, DialogContent, Box, Button, Alert, Select, Typography, MenuItem, TextField, Accordion, AccordionDetails } from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import  Header  from "../components/Header";

const DiretrizData = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [responsaveis, setResponsaveis] = useState([]);
  const [quem, setQuem] = useState([]);
  const [formValues, setFormValues] = useState({
    nome: "",
    dataInicio: "",
    prazoPrevisto: "",
    cliente: "",
    categoria: [], // Inicializado como array vazio
    valor: "",
    descricao: "",
  });

  // Função do Alert no botão salvar
  const handleButtonClick = () => {
    console.log("Botão clicado!");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Fecha o modal após 3 segundos
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

  const handleInputChangeReal = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Combina os handlers de input e select
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (e) => {
    setFormValues({ ...formValues, categoria: e.target.value });
  };

  return (
    <>
      <Accordion
        sx={{
          boxShadow: "none", // Remove a sombra
          backgroundColor: "transparent",
        }}
      >
        <AccordionDetails>


          {/* Modal com o Alerta */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Dialog
              open={showAlert}
              onClose={() => setShowAlert(false)} // Permite fechar manualmente
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  backgroundColor: "transparent", // Remove o fundo branco
                  boxShadow: "none", // Remove a sombra
                },
              }}
            >
              <DialogContent>
                {console.log("Tarefa salva com sucesso!")}{" "}
                {/* Log no console */}
                <Alert severity="success" sx={{ borderRadius: "12px" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Tarefa salva com sucesso!
                  </Typography>
                </Alert>
              </DialogContent>
            </Dialog>
          </Box>



          <Box sx={{ marginLeft: "40px", paddingTop: "10px" }}>
            <Header
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <PlayCircleFilledWhiteIcon
                    sx={{ color: "#5f53e5", fontSize: 30 }}
                  />
                  <Typography>CADASTRAR TAREFAS PARA ESSA DIRETRIZ</Typography>
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
              flexGrow: 1, // Permite que o Box principal cresça no espaço disponível
              flexWrap: "wrap", // Permite quebrar linha em telas menores
            }}
          >
            {/* TextField */}
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
            </Box>

            {/* Select com Checkboxes */}
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

            {/* Botão de Adicionar 
            <Button
              variant="outlined"
              disableRipple
              sx={{
                minWidth: "40px",
                padding: "5px",
                border: "none",
                marginTop: "5px",
                "&:hover": {
                  boxShadow: "none",
                  border: "none",
                  borderRadius: "50px",
                  backgroundColor: "#f2f0f0",
                },
              }}
            >
              <AddCircleOutlineIcon sx={{ fontSize: 30, color: "#5f53e5" }} />
            </Button>
            */}
          </Box>

          <Box sx={{ marginLeft: "40px", paddingTop: "10px" }}>
            <Header
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <PlayCircleFilledWhiteIcon
                    sx={{ color: "#5f53e5", fontSize: 30 }}
                  />
                  <Typography>
                    CADASTRAR PLANO DE AÇÃO (5W2H) PARA ESSA TAREFA
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Formulário 5W2H - 01*/}

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{
              marginLeft: "50px",
              marginRight: "50px",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {/* Linha 1 */}
            <Box display="flex" gap={2}>
              <TextField
                label="O que"
                placeholder="Descreva o que deve ser feito"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  style: { position: "absolute", top: "5px", left: "5px" },
                }}
              />
              <TextField
                label="Por que"
                placeholder="Justificativa do que será feito"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  style: { position: "absolute", top: "5px", left: "5px" },
                }}
              />
            </Box>

            {/* Linha 2 */}
            <Box display="flex" gap={2}>
              {/* Quem - Select com Checkboxes */}
              <Box sx={{ flex: 1 }}>
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
                  <MenuItem disabled value="">
                    <ListItemText primary="Selecione responsáveis pelo projeto" />
                  </MenuItem>

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

              {/* Quando */}
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Quando"
                  placeholder="Período de execução"
                  fullWidth
                  variant="outlined"
                  InputProps={{ sx: { height: "40px" } }}
                  InputLabelProps={{
                    shrink: true,
                    style: { position: "absolute", top: "5px", left: "5px" },
                  }}
                />
              </Box>
            </Box>

            {/* Linha 3 */}
            <Box display="flex" gap={2}>
              <TextField
                label="Onde"
                placeholder="Local onde será executada"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  style: { position: "absolute", top: "5px", left: "5px" },
                }}
              />
              <TextField
                label="Como"
                placeholder="Metodologia de execução"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  style: { position: "absolute", top: "5px", left: "5px" },
                }}
              />
            </Box>

            {/* Linha 4 */}
            <Box display="flex" gap={2}>
              <TextField
                label="Digite o valor do orçamento para essa tarefa..."
                name="valor"
                value={formValues.valor}
                onChange={(e) => {
                  const valor = e.target.value;
                  // Remove caracteres não numéricos
                  const onlyNumbers = valor.replace(/[^\d]/g, "");
                  // Converte para formato de moeda
                  const formattedValue = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(onlyNumbers / 100);
                  // Atualiza o estado
                  handleInputChangeReal({
                    target: { name: "valor", value: formattedValue },
                  });
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: { position: "absolute", top: "5px", left: "5px" },
                }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" marginTop="20px">
              <Button
                onClick={handleButtonClick}
                variant="contained"
                sx={{
                  marginTop: "20px",
                  backgroundColor: "#5f53e5",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#312783",
                  },
                }}
              >
                SALVAR
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default DiretrizData;
