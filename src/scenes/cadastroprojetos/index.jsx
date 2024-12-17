import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components";
import { mockDiretrizes } from "../../../src/data/mockData";

const CadastroProjetos = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [diretrizes, setDiretrizes] = useState(mockDiretrizes || []);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    nome: "",
    dataInicio: "",
    prazoPrevisto: "",
    cliente: "",
    categoria: "",
    valor: "",
    descricao: "",
  });

  const handleInputChangeReal = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAddSubDiretriz = (parentId) => {
    const subDiretrizNome = prompt("Digite o nome da subdiretriz:");
    if (subDiretrizNome) {
      setDiretrizes((prev) =>
        prev.map((diretriz) =>
          diretriz.id === parentId
            ? {
                ...diretriz,
                subDiretrizes: [
                  ...(diretriz.subDiretrizes || []),
                  { id: Date.now(), title: subDiretrizNome },
                ],
              }
            : diretriz
        )
      );
    }
  };

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    setDiretrizes(diretrizes.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    console.log("Form Submitted", formValues);
  };

  return (
    <>
      {/* Header */}
      <Box sx={{ marginLeft: "40px", paddingTop: "50px" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <DescriptionIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
              <Typography>CADASTRO DE PROJETOS</Typography>
            </Box>
          }
        />
      </Box>

      {/* Accordion 1: Adicionar Informações */}
      <Accordion
        disableGutters
        sx={{
          marginLeft: "40px",
          width: "calc(100% - 90px)",
          marginTop: "20px",
          borderRadius: "15px",
          backgroundColor: "#f2f0f0",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography display="flex" alignItems="center" gap={1} sx={{ color: "#858585" }}>
            <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
            ADICIONAR INFORMAÇÕES DO PROJETO
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Box component="form" display="flex" flexDirection="column" gap={2}>
            {/* Nome do Projeto */}
            <TextField
              label="Nome do projeto..."
              name="nome"
              value={formValues.nome}
              onChange={handleInputChange}
              fullWidth
            />

            {/* Datas */}
            <Box display="flex" gap={2}>
                <TextField
                  label="Data início"
                  name="dataInicio"
                  type="date"
                  value={formValues.dataInicio}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                    style: { position: 'absolute', top: '5px', left: '5px' }
                  }}
                  
                />
                <TextField
                  label="Prazo previsto"
                  name="prazoPrevisto"
                  type="date"
                  value={formValues.prazoPrevisto}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                    style: { position: 'absolute', top: '5px', left: '5px' }
                  }}
                />
              </Box>

            {/* Cliente e Categoria */}
            <Box display="flex" gap={2}>
              <Select
                name="solicitante"
                value={formValues.cliente}
                onChange={handleInputChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Selecione o solicitante do projeto
                </MenuItem>
                <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                <MenuItem value="GOIÁS">GOIÁS</MenuItem>
              </Select>

              <Select
                name="categoria"
                value={formValues.categoria}
                onChange={handleInputChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Selecione a categoria do projeto
                </MenuItem>
                <MenuItem value="financeiro">Financeiro</MenuItem>
                <MenuItem value="rh">Recursos Humanos</MenuItem>
              </Select>

              <Select
                name="colaborador"
                value={formValues.categoria}
                onChange={handleInputChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Selecione os colaboradores do projeto
                </MenuItem>
                <MenuItem value="financeiro">Financeiro</MenuItem>
                <MenuItem value="rh">Recursos Humanos</MenuItem>
              </Select>
            </Box>

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
                handleInputChangeReal({ target: { name: "valor", value: formattedValue } });
                
              }}
              fullWidth
            />

            {/* Descrição */}
            <TextField
              label="Descrição..."
              name="descricao"
              value={formValues.descricao}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </AccordionDetails>
      </Accordion>



      {/* Accordion 2: Lista de Diretrizes */}



      <Accordion
        disableGutters
        sx={{
          marginLeft: "40px",
          width: "calc(100% - 90px)",
          marginTop: "20px",
          borderRadius: "15px",
          backgroundColor: "#f2f0f0",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography display="flex" alignItems="center" gap={1} sx={{ color: "#5f53e5" }}>
            <PlayCircleFilledIcon sx={{ fontSize: 25 }} />
            LISTA DE DIRETRIZES
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          {/* Campo para Criar Nova Diretriz */}
          <Box display="flex" gap={2} alignItems="center" marginBottom="20px">
            <TextField
              label="Nome da nova diretriz..."
              name="novaDiretriz"
              value={formValues.novaDiretriz || ""}
              onChange={(e) => setFormValues({ ...formValues, novaDiretriz: e.target.value })}
              fullWidth
              sx={{ maxWidth: "80%" }}
            />
            <Button
              variant="contained"
              onClick={() => {
                if (formValues.novaDiretriz) {
                  const novaDiretriz = {
                    id: Date.now(),
                    title: formValues.novaDiretriz,
                    description: "Descrição padrão da nova diretriz", // Subtitle padrão
                    subDiretrizes: [],
                  };
                  setDiretrizes([...diretrizes, novaDiretriz]);
                  setFormValues({ ...formValues, novaDiretriz: "" });
                }
              }}
              sx={{
                backgroundColor: "#5f53e5",
                color: "#fff",
                "&:hover": { backgroundColor: "#312783" },
              }}
            >
              Adicionar Diretriz
            </Button>
          </Box>

          {/* Lista de Diretrizes */}
          {diretrizes.map((item) => (
            <Accordion
              key={item.id}
              expanded={expandedId === item.id}
              onChange={() => handleExpand(item.id)}
              sx={{
                marginBottom: "10px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Cabeçalho da Diretriz */}
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box>
                  <Typography fontWeight="bold" color="#312783">
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#858585", fontSize: "0.9em" }}>
                    {item.description} {/* Subtitle restaurado */}
                  </Typography>
                </Box>
              </AccordionSummary>

              {/* Detalhes da Diretriz */}
              <AccordionDetails>
                {/* Botão de Adicionar Subdiretriz */}
                <Button
                  variant="outlined"
                  onClick={() => handleAddSubDiretriz(item.id)}
                  sx={{
                    marginBottom: "10px",
                    color: "#5f53e5",
                    borderColor: "#5f53e5",
                    "&:hover": { borderColor: "#312783", color: "#312783" },
                  }}
                >
                  Adicionar Subdiretriz
                </Button>

                {/* Lista de Subdiretrizes */}
                {Array.isArray(item.subDiretrizes) && item.subDiretrizes.length > 0 ? (
                  <Box sx={{ marginLeft: "20px" }}>
                    {item.subDiretrizes.map((sub) => (
                      <Typography key={sub.id} sx={{ color: "#555" }}>
                        • {sub.title}
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ color: "#999", marginLeft: "20px" }}>
                    Nenhuma subdiretriz adicionada.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default CadastroProjetos;
