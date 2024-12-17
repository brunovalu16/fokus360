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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from "react-router-dom";
import { Header } from "../../components";
import { mockDiretrizes } from "../../../src/data/mockData"; // Importa a lista de diretrizes


const CadastroProjetos = () => {
  const [inputs, setInputs] = useState({});
  const [expandedId, setExpandedId] = useState(null); 
  const [diretrizes] = useState(mockDiretrizes);
  const [setDiretrizes] = useState([]); // Lista de diretrizes
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

  const handleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id)); // Alterna expansão
  };

  const handleDelete = (id) => {
    // Remove a diretriz pelo id
    setDiretrizes(diretrizes.filter((item) => item.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleInputChangeReal = (e) => {
    const { name, value } = e.target;
    const onlyNumbers = value.replace(/[^\d]/g, "");
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(onlyNumbers / 100);
    setFormValues({ ...formValues, [name]: formattedValue });
  };

  const handleSubmit = () => {
    console.log("Form Submitted", formValues);
  };


  // Adiciona nova diretriz
  const handleAddDiretriz = () => {
    if (formValues.nome && formValues.descricao) {
      setDiretrizes([...diretrizes, formValues]); // Adiciona nova diretriz ao estado
      setFormValues({ nome: "", descricao: "" }); // Reseta formulário
    }
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

      {/* Accordion INFORMAÇÕES DO PROJETO */}
      <Accordion
        //defaultExpanded
        disableGutters
        sx={{
          marginLeft: "40px", // Mantém posição fixa
          width: "calc(100% - 90px)", // Largura fixa
          marginTop: "20px",
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#f2f0f0",
        }}
      >
        {/* Cabeçalho */}
        <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: "50px", // Altura fixa
                "&.Mui-expanded": { minHeight: "50px" }, // Mesmo expandido, mantém altura
              }}
            >
              <Box sx={{ paddingTop: "10px" }}>
                <Header
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
                      <Typography>ADICIONAR INFORMAÇÕES DO PROJETO</Typography>
                    </Box>
                  }
                />
              </Box>
        </AccordionSummary>

        {/* Conteúdo */}
        <AccordionDetails
          sx={{
            padding: "0px", // Remove padding extra
            marginLeft: "0px", // Alinha corretamente
          }}
        >
          <Box
            sx={{
              padding: "20px",
              bgcolor: "#f2f0f0",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            {/** 
            <Box display="flex" alignItems="center" gap={1} my={2}>
              <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
              <Typography sx={{ color: "#858585" }}>Nome do projeto</Typography>
            </Box>
            */}

<Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nome do projeto..."
          name="nome"
          value={formValues.nome}
          onChange={handleInputChange}
          fullWidth
        />

        {/** 
        <Box display="flex" alignItems="center" gap={1}
          sx={{ marginTop: "20px", marginBottom: "20px"  }}
        >
          <PlayCircleFilledIcon sx={{ color: "#a3e635", fontSize: 25 }} />
          <Typography sx={{ color: "#858585" }}>Datas/Duração do projeto</Typography>
        </Box>
        */}

        <Box display="flex" gap={2} sx={{ marginTop: "15px" }}>
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
          <Select
                  label="Solicitante"
                  name="solicitante"
                  value={formValues.cliente}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{ width: "49%", marginRight: "10px" }}
                >
                  <MenuItem value="" disabled>
                    Selecione um solicitante
                  </MenuItem>
                  <MenuItem value="elton">Elton</MenuItem>
                  <MenuItem value="lucinete">Lucinete</MenuItem>
                  <MenuItem value="orlando">Orlando</MenuItem>
                </Select>
        </Box>

              <Box display="flex" justifyContent="space-between" width="100%" my={2}>
              <Select
                  label="Cliente"
                  name="cliente"
                  value={formValues.cliente}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{ width: "49%", marginRight: "10px" }}
                >
                  <MenuItem value="" disabled>
                    Selecione a Unidade
                  </MenuItem>
                  <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                  <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                  <MenuItem value="MATOGROSSO">MATO GROSSO</MenuItem>
                  <MenuItem value="MATOGROSSODOSUL">MATO GROSSO DO SUL</MenuItem>
                  <MenuItem value="PARA">PARÁ</MenuItem>
                  <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
                </Select>

                <Select
                  label="Categoria"
                  name="categoria"
                  value={formValues.categoria}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{ width: "49%", marginRight: "10px" }}
                >
                  <MenuItem value="" disabled>
                    Selecione a categoria do projeto
                  </MenuItem>
                  <MenuItem value="rh">Recursos Humanos</MenuItem>
                  <MenuItem value="juridico">Jurídico</MenuItem>
                  <MenuItem value="financeiro">Financeiro</MenuItem>
                  <MenuItem value="contabilidade">Contabilidade</MenuItem>
                  <MenuItem value="dp">Departamento Pessoal</MenuItem>
                </Select>

                <Select
                  label="Participantes"
                  name="participantes"
                  value={formValues.categoria}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{ width: "49%" }}
                >
                  <MenuItem value="" disabled>
                    Selecione os participantes desse projeto
                  </MenuItem>
                  <MenuItem value="elton">Elton</MenuItem>
                  <MenuItem value="lucinete">Lucinete</MenuItem>
                  <MenuItem value="orlando">Orlando</MenuItem>
                </Select>
              
              </Box>

              <TextField
                label="Digite o valor do orçamento..."
                name="valor"
                value={formValues.valor}
                onChange={handleInputChangeReal}
                fullWidth
              />

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
          </Box>
        </AccordionDetails>
      </Accordion>






      {/* Accordion DIRETRIZES */}
      <Accordion disableGutters
        sx={{ marginLeft: "40px",
        width: "calc(100% - 90px)",
        marginTop: "20px", borderRadius: "15px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#f2f0f0" }}>
        {/* Cabeçalho */}
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: "50px", "&.Mui-expanded": { minHeight: "50px" } }}>
          <Box sx={{ paddingTop: "10px" }}>
            <Typography display="flex" alignItems="center" gap={1} sx={{ color: "#858585"  }}>
              <PlayCircleFilledIcon sx={{ color: "#4ade80", fontSize: 25 }} />
              ADICIONAR DIRETRIZES DO PROJETO
            </Typography>
          </Box>
        </AccordionSummary>

        {/* Conteúdo */}
        <AccordionDetails sx={{ padding: "0px", marginLeft: "0px" }}>
          <Box sx={{  padding: "20px", bgcolor: "#f2f0f0", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", width: "100%" }}>
            {/* Formulário */}
            <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
                {/* Input e botão lado a lado */}
                <Box display="flex" gap={4} alignItems="center">
                  <TextField
                    label="Adicione uma diretriz..."
                    name="nome"
                    value={formValues.nome}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginLeft: "20px" }}
                  />
                  {/* Botão de exclusão */}
                  <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    marginRight: "20px",
                    boxShadow: "none",
                    backgroundColor: "#5f53e5",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#312783",
                      color: "#fff",
                      boxShadow: "none",
                      borderColor: "#312783",
                    },
                  }}
                >
                  Adicionar
                </Button>
                </Box>
              </Box>


            { /**LISTA DE DIRETRIZES */ }   
               
           
            
            <Box sx={{ padding: "20px" }}>
            {diretrizes.length > 0 ? (
              diretrizes.map((item) => (
                <Accordion
                  key={item.id}
                  expanded={expandedId === item.id}
                  onChange={() => handleExpand(item.id)}
                  sx={{
                    marginBottom: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                  }}
                >
        
                {/* Cabeçalho da Diretriz */}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                {/* Botão de exclusão fora do expandIcon */}
                <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que o clique afete a expansão
                      handleDelete(item.id);
                    }}
                      >
                  <DeleteForeverIcon sx={{ fontSize: 30 }} />
                </IconButton>

            
                <Box display="flex" alignItems="center" gap={2} width="100%">
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="#312783">
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{ color: "#858585" }}
                    >{item.description}</Typography>
                  </Box>
                </Box>
            </AccordionSummary>

              {/* Campos de Input ao Expandir */}
              <AccordionDetails>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Detalhe adicional"
                    value={inputs[item.id]?.detail || ""}
                    onChange={(e) => handleInputChange(item.id, "detail", e.target.value)}
                    fullWidth
                  />
                  {/** 
                  <TextField
                    label="Observações"
                    value={inputs[item.id]?.observation || ""}
                    onChange={(e) => handleInputChange(item.id, "observation", e.target.value)}
                    fullWidth
                  />
                  */}
                </Box>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    fontSize: "8px",
                    width: "12%",
                    marginRight: "20px",
                    marginTop: "20px",
                    boxShadow: "none",
                    backgroundColor: "#5f53e5",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#312783",
                      color: "#fff",
                      boxShadow: "none",
                      borderColor: "#312783",
                    },
                  }}
                >
                  Adicionar tarefa
                </Button>
              </AccordionDetails>
          </Accordion>
              ))
            ) : (
              <Typography>Nenhuma diretriz cadastrada.</Typography>
            )}
          </Box>

          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Accordion LISTA DE DIRETRIZES */}
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
          <Box display="flex" alignItems="center" gap={1}>
            <PlayCircleFilledIcon sx={{ color: "#f59e0b", fontSize: 25 }} />
            <Typography>LISTA DE DIRETRIZES</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ padding: "20px" }}>
            {diretrizes.length > 0 ? (
              diretrizes.map((item) => (
                <Box
                  key={item.id}
                  padding="10px"
                  marginBottom="10px"
                  bgcolor="#fff"
                  borderRadius="8px"
                  boxShadow="0px 2px 5px rgba(0,0,0,0.1)"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="#4ade80">
                      {item.title}
                    </Typography>
                    <Typography>{item.description}</Typography>
                  </Box>
                  <IconButton color="error" onClick={() => handleDelete(item.id)}>
                    <DeleteForeverIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </Box>
              ))
            ) : (
              <Typography>Nenhuma diretriz cadastrada.</Typography>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Box display="flex" marginTop={2}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    marginRight: "10px",
                    boxShadow: "none",
                    backgroundColor: "#5f53e5",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#312783",
                      color: "#fff",
                      boxShadow: "none",
                      borderColor: "#312783",
                    },
                  }}
                >
                  Salvar
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{
                    backgroundColor: "#dc2626",
                    color: "#fff",
                    borderColor: "#dc2626",
                    "&:hover": {
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      boxShadow: "none",
                      borderColor: "#dc2626",
                    },
                  }}
                >
                  Cancelar
                </Button>
              </Box>
      
      
</>
);
};

export default CadastroProjetos;
