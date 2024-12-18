import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Button,
  Typography,
  TextField,
  ListItemText,
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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { Divider } from "@mui/material";
import { Header } from "../../components";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { mockDiretrizes } from "../../../src/data/mockData";

const CadastroProjetos = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [diretrizes, setDiretrizes] = useState(mockDiretrizes || []);
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

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    setDiretrizes(diretrizes.filter((item) => item.id !== id));
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

  {/* Caixa com borda cinza e botões */}
  <Box
    sx={{
      padding: "30px",
      margin: "40px",
      //border: "1px solid #c0c0c0", // Borda cinza
      borderRadius: "10px", // Arredondamento da borda
      backgroundColor: "#f2f0f0",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    }}
  >

      <Box sx={{ paddingTop: "50px" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <PlayCircleFilledWhiteIcon sx={{ color: "#5f53e5", fontSize: 30 }} />
              <Typography
                fontSize="15px"
              >
                ADICIONE UM PROJETO
                </Typography>
            </Box>
            }
        />
      </Box>


      {/* Divider */}
      <Divider
        sx={{
          
          width: "calc(100% - 5px)", // Mesma largura calculada
          height: "1px",
          backgroundColor: "#ccc", // Cor do divisor
        }}
      />



    {/* Accordion 1 */}


    <Accordion disableGutters
      sx={{ backgroundColor: "#fff",
            borderRadius: "10px",
            //boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            boxShadow: "none",
            marginTop: "20px"
            }}>


      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography display="flex" alignItems="center" gap={1} sx={{ color: "#858585" }}>
          <PlayCircleFilledIcon sx={{ color: "#22d3ee", fontSize: 25 }} />
          ADICIONAR INFORMAÇÕES DO PROJETO
        </Typography>
      </AccordionSummary>

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
    <MenuItem value="MATOGROSSODOSUL">MATO GROSSO DO SUL</MenuItem>
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
        <Checkbox checked={formValues.categoria.indexOf(option) > -1} />
        <ListItemText
          primary={option.charAt(0).toUpperCase() + option.slice(1)}
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
            handleInputChangeReal({ target: { name: "valor", value: formattedValue } });
          }}
          fullWidth
          InputLabelProps={{
            shrink: true,
            style: { position: 'absolute', top: '5px', left: '5px', fontSize: "15px" }
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
              style: { position: 'absolute', top: '5px', left: '5px', fontSize: "15px" }
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>



    {/* Accordion 2 */}


    <Accordion disableGutters
      sx={{ backgroundColor: "#fff",
            borderRadius: "15px",
            //boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            boxShadow: "none",
            top: "20px",
            borderRadius: "10px"
            }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography display="flex" alignItems="center" gap={1} sx={{ color: "#858585" }}>
          <PlayCircleFilledIcon sx={{ fontSize: 25, color: "#5f53e5" }} />
          ADICIONAR DIRETRIZES DO PROJETO
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box display="flex"
            gap={2}
            marginBottom="20px"
            sx={{ paddingBottom: "20px" }}
            >
          <TextField label="Nome da diretriz..." fullWidth />
          <Button
            disableRipple
            sx={{
              backgroundColor: "transparent", // Mantém o fundo transparente
              "&:hover": {
                backgroundColor: "transparent", // Remove o fundo ao passar o mouse
                boxShadow: "none", // Remove qualquer sombra
              },
              "&:focus": {
                outline: "none", // Remove o contorno de foco
              },
            }}
          >
            <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#5f53e5" }} />
           </Button>
        </Box>


        {/* Lista de Diretrizes */}

        {diretrizes.map((item) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#5f53e5",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Button
              onClick={() => console.log(`Diretriz clicada: ${item.title}`)}
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
                <Typography fontWeight="bold">{item.title}</Typography>
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
                backgroundColor: "transparent", // Garante que o fundo seja transparente
                "&:hover": {
                  backgroundColor: "transparent", // Remove qualquer fundo ao passar o mouse
                  boxShadow: "none", // Remove a sombra
                  border: "none", // Remove qualquer borda ao hover
                },
                "&:focus": {
                  outline: "none", // Remove o contorno de foco
                },
              }}
            >
              <DeleteForeverIcon sx={{ fontSize: 24, color: "#b7b7b7" }} />
            </Button>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Botão Salvar */}
    <Box display="flex" justifyContent="flex-end" marginTop="20px"
      sx={{ paddingTop: "30px"}}
    >
      <Button
        variant="contained"
        sx={{
          fontSize: "9px",
          boxShadow: "none", // Remove
          backgroundColor: "#5f53e5",
          color: "#fff",
          "&:hover": { backgroundColor: "#312783" },
        }}
      >
        ADICIONAR PROJETO
      </Button>
    </Box>
  </Box>
</>

  );
};

export default CadastroProjetos;
