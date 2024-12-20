import React, { useState } from "react";
import { Box, Button, Typography, TextField, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { Divider } from "@mui/material";
import { Header } from "../../components";
import BaseDiretriz from "../../components/BaseDiretriz";
import InformacoesProjeto  from "../../components/InformacoesProjeto";



const CadastroProjetos = () => {
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
                <PlayCircleFilledWhiteIcon
                  sx={{ color: "#5f53e5", fontSize: 30 }}
                />
                <Typography fontSize="15px">ADICIONE UM PROJETO</Typography>
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

        <Accordion
          disableGutters
          sx={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            //boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            boxShadow: "none",
            marginTop: "20px",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ color: "#858585" }}
            >
              <PlayCircleFilledIcon sx={{ color: "#22d3ee", fontSize: 25 }} />
              ADICIONAR INFORMAÇÕES DO PROJETO
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <InformacoesProjeto />
          </AccordionDetails>
        </Accordion>

        {/* Accordion 2 */}

        <Accordion
          disableGutters
          sx={{
            backgroundColor: "#fff",
            borderRadius: "15px",
            //boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            boxShadow: "none",
            top: "20px",
            borderRadius: "10px",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ color: "#858585" }}
            >
              <PlayCircleFilledIcon sx={{ fontSize: 25, color: "#5f53e5" }} />
              ADICIONAR DIRETRIZES DO PROJETO
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Box display="flex" gap={2} marginBottom="20px">
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

            {/* Lista de Diretrizes  AQUI ENTRA O COMPONENTE <BaseDiretriz /> */}

            <BaseDiretriz />
          </AccordionDetails>
        </Accordion>

        {/* Botão Salvar */}

        <Box
          display="flex"
          justifyContent="flex-end"
          marginTop="20px"
          sx={{ paddingTop: "30px" }}
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
