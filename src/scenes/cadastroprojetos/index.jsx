import React, { useState } from "react";
import { Box, Button, Typography, TextField, Checkbox, FormControlLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { Header } from "../../components"; // Certifique-se de que o caminho está correto

const CadastroProjetos = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    nome: "",
    dataInicio: "",
    prazoPrevisto: "",
    dataTermino: "",
    duracaoPrevista: "",
    duracaoReal: "",
    cliente: "",
    custoPrevisto: "",
    custoReal: "",
    projetoAtivo: true,
    projetoModelo: false,
    copiarProjeto: "",
    solicitante: "",
    responsavel: "",
    descricao: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormValues({ ...formValues, [name]: checked });
  };

  const handleSubmit = () => {
    console.log("Form Submitted", formValues);
    // Adicionar lógica para salvar o formulário
  };

  const handleInputChangeReal = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };
  

  return (
    <Box
      sx={{
        padding: "20px",
        bgcolor: "#f2f0f0",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "90%",
        margin: "20px auto",
      }}
    >
      <Header 
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <AssessmentIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
            <Typography sx={{ color: "#858585" }}>Cadastro de Projetos</Typography>
          </Box>
        } 
      />
      <Box display="flex" alignItems="center" gap={1} my={2}>
        <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
        <Typography sx={{ color: "#858585" }}>Relatórios</Typography>
      </Box>

      <Box component="form" noValidate autoComplete="off" display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nome"
          name="nome"
          value={formValues.nome}
          onChange={handleInputChange}
          fullWidth
        />

        <Box display="flex" alignItems="center" gap={1}
          sx={{ marginTop: "20px", marginBottom: "20px"  }}
        >
          <PlayCircleFilledIcon sx={{ color: "#a3e635", fontSize: 25 }} />
          <Typography sx={{ color: "#858585" }}>Datas/Duração do projeto</Typography>
        </Box>

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

        {/**     
        <Box display="flex" gap={2}>
          <TextField
            label="Duração prevista"
            name="duracaoPrevista"
            value={formValues.duracaoPrevista}
            onChange={handleInputChange}
          />
          <TextField
            label="Duração real"
            name="duracaoReal"
            value={formValues.duracaoReal}
            onChange={handleInputChange}
          />
        </Box>
        */}

        <Box display="flex" alignItems="center" gap={1}
          sx={{ marginTop: "20px", marginBottom: "20px"  }}
        >
          <PlayCircleFilledIcon sx={{ color: "#06b6d4", fontSize: 25 }} />
          <Typography sx={{ color: "#858585" }}>Local/Categoria do projeto</Typography>
        </Box>

        <box style={{ display: "flex", justifyContent: "space-between", width: "100%"}} >
          <Select
            label="Cliente"
            name="cliente"
            value={formValues.cliente}
            onChange={handleInputChange}
            displayEmpty
            sx={{ width:"49%" }}
          >
            <MenuItem
              value="" disabled>
              Selecione a Unidade
            </MenuItem>
            <MenuItem value="Cliente A">GOIÁS</MenuItem>
            <MenuItem value="Cliente B">BRASÍLIA</MenuItem>
            <MenuItem value="Cliente B">TOCANTINS</MenuItem>
            <MenuItem value="Cliente B">MATO GROSSO</MenuItem>
            <MenuItem value="Cliente B">MATO GROSSO DO SUL</MenuItem>
            <MenuItem value="Cliente B">PARÁ</MenuItem>
          </Select>

          <Select
            label="Cliente"
            name="cliente"
            value={formValues.cliente}
            onChange={handleInputChange}
            displayEmpty
            sx={{ width:"49%"}}
          >
            <MenuItem
              value="" disabled>
              Selecione a categoria do projeto
            </MenuItem>
            <MenuItem value="Cliente A">Contabilidade</MenuItem>
            <MenuItem value="Cliente B">Controladoria</MenuItem>
            <MenuItem value="Cliente B">RH</MenuItem>
            <MenuItem value="Cliente B">Jurídico</MenuItem>
            <MenuItem value="Cliente B">Financeiro</MenuItem>
            <MenuItem value="Cliente B">Administrativo</MenuItem>
          </Select>
        </box>
        
        {/*
        <Typography variant="h6" sx={{ color: "#858585" }}>Outras configurações</Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="Custo previsto"
            name="custoPrevisto"
            value={formValues.custoPrevisto}
            onChange={handleInputChange}
          />
           
          <TextField
            label="Custo real"
            name="custoReal"
            value={formValues.custoReal}
            onChange={handleInputChange}
          />
          
        </Box>
        */}

        {/** 
        <FormControlLabel
          control={<Checkbox checked={formValues.projetoAtivo} onChange={handleCheckboxChange} name="projetoAtivo" />}
          label="Projeto ativo"
          sx={{ color: "#858585", marginLeft: "5px" }}
        />
        */}

        <Box display="flex" alignItems="center" gap={1}
          sx={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <PlayCircleFilledIcon sx={{ color: "#8b5cf6", fontSize: 25 }} />
          <Typography sx={{ color: "#858585" }}>Solicitantes/Responsáveis/Participantes do projeto</Typography>
        </Box>


        <Box display="flex" gap={2}>
          
          <Select
            label="Solicitante"
            name="solicitante"
            value={formValues.solicitante}
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecione um solicitante
            </MenuItem>
            <MenuItem value="Solicitante A">Solicitante A</MenuItem>
            <MenuItem value="Solicitante B">Solicitante B</MenuItem>
          </Select>
          <Select
            label="Responsável"
            name="responsavel"
            value={formValues.responsavel}
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecione um responsável
            </MenuItem>
            <MenuItem value="Responsável A">Responsável A</MenuItem>
            <MenuItem value="Responsável B">Responsável B</MenuItem>
          </Select>
          <Select
            label="Copiar projeto"
            name="copiarProjeto"
            value={formValues.copiarProjeto}
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Participantes do Projeto
            </MenuItem>
            <MenuItem value="Projeto A">Projeto A</MenuItem>
            <MenuItem value="Projeto B">Projeto B</MenuItem>
          </Select>
          
        </Box>

        <Box display="flex" alignItems="center" gap={1}
          sx={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <PlayCircleFilledIcon sx={{ color: "#db2777", fontSize: 25 }} />
          <Typography sx={{ color: "#858585" }}>Orçamento do projeto</Typography>
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


        <TextField
          label="Descrição"
          name="descricao"
          value={formValues.descricao}
          onChange={handleInputChange}
          multiline
          rows={4}
          fullWidth
        />

        <Box display="flex" marginTop={2}>
          <Button
            ali
            variant="contained"
            onClick={handleSubmit}
            sx={{
              marginRight: "10px",
              boxShadow: "none",
              color: '#fff',
              backgroundColor: '#5f53e5',
              '&:hover': {
                backgroundColor: '#6870fa',
                boxShadow: 'none',
              }
            }}
            >
            Salvar
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              border: "none",
              color: '#fff',
              backgroundColor: '#dc2626',
              '&:hover': {
                backgroundColor: '#db4f4a',
                boxShadow: 'none',
                border: "none",
              }
            }}
            >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CadastroProjetos;
