import React, { useState } from "react";
import { Box, Checkbox, TextField, ListItemText, Select, MenuItem, Accordion, AccordionDetails } from "@mui/material";



const InformacoesProjeto = () => {
  const [formValues, setFormValues] = useState({
    nome: "",
    dataInicio: "",
    prazoPrevisto: "",
    cliente: "",
    categoria: [], // Inicializado como array vazio
    valor: "",
    descricao: "",
  });

  const handleInputChangeReal = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Função para lidar com inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Função para lidar com seleção múltipla
  const handleSelectChange = (e) => {
    setFormValues({ ...formValues, categoria: e.target.value });
  };

  return (
    <>
      <Box>
        <Accordion disableGutters sx={{ backgroundColor: "transparent" }}>
          <AccordionDetails>
            <Box component="form" display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Nome do projeto..."
                name="nome"
                value={formValues.nome}
                onChange={handleInputChange}
                fullWidth
              />

              {/* Datas e Selects */}
              <Box display="flex" gap={2} flexWrap="wrap">
                {/* Data Início */}
                <TextField
                  label="Data início"
                  name="dataInicio"
                  type="date"
                  value={formValues.dataInicio}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                    style: { position: "absolute", top: "5px", left: "5px" },
                  }}
                  sx={{
                    flex: "1 1 calc(33.33% - 16px)", // 33.33% de largura com espaçamento
                    minWidth: "200px", // Largura mínima
                  }}
                />

                {/* Prazo Previsto */}
                <TextField
                  label="Prazo previsto"
                  name="prazoPrevisto"
                  type="date"
                  value={formValues.prazoPrevisto}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                    style: { position: "absolute", top: "5px", left: "5px" },
                  }}
                  sx={{
                    flex: "1 1 calc(33.33% - 16px)", // 33.33% de largura com espaçamento
                    minWidth: "200px", // Largura mínima
                  }}
                />

                {/* Unidade */}
                <Select
                  name="unidade"
                  value={formValues.cliente}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{
                    flex: "1 1 calc(33.33% - 16px)", // 33.33% de largura com espaçamento
                    minWidth: "200px", // Largura mínima
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecione a unidade do projeto
                  </MenuItem>
                  <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                  <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                  <MenuItem value="MATOGROSSO">MATO GROSSO</MenuItem>
                  <MenuItem value="MATOGROSSODOSUL">
                    MATO GROSSO DO SUL
                  </MenuItem>
                  <MenuItem value="PARA">PARÁ</MenuItem>
                  <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
                </Select>

                {/* Cliente */}
                <Select
                  name="cliente"
                  value={formValues.cliente}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{
                    flex: "1 1 calc(33.33% - 16px)", // 33.33% de largura com espaçamento
                    minWidth: "200px", // Largura mínima
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecione o solicitante do projeto
                  </MenuItem>
                  <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                  <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                </Select>

                {/* Categoria */}
                <Select
                  name="cliente"
                  value={formValues.cliente}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{
                    flex: "1 1 calc(33.33% - 16px)", // 33.33% de largura com espaçamento
                    minWidth: "200px", // Largura mínima
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecione uma categoria ao projeto
                  </MenuItem>
                  <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                  <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                </Select>

                {/* Colaboradores */}
                <Select
                  multiple
                  name="colaboradores"
                  value={formValues.categoria}
                  onChange={handleSelectChange}
                  displayEmpty
                  sx={{
                    flex: "1 1 calc(33.33% - 16px)", // 33.33% de largura com espaçamento
                    minWidth: "200px", // Largura mínima
                  }}
                  renderValue={(selected) =>
                    selected.length === 0
                      ? "Selecione colaboradores ao projeto"
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

              {/* Valor e Descrição */}
              <TextField
                label="Digite o valor do orçamento para esse projeto..."
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
                  style: {
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    fontSize: "15px",
                  },
                }}
              />
              <TextField
                label="Descrição..."
                name="descricao"
                value={formValues.descricao}
                onChange={handleInputChange}
                multiline
                rows={4}
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
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default InformacoesProjeto;
