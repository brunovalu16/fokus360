import React, { useState } from "react";
import { Box, Button, IconButton, Typography, useMediaQuery, useTheme, Checkbox, TextField, ListItemText, Select, MenuItem, AccordionDetails, } from "@mui/material";
import { Header, StatBox, LineChart, ProgressCircle, BarChart, GeographyChart } from "../../components";
import { DownloadOutlined, Email, PersonAdd, PointOfSale, Traffic } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Divider } from "@mui/material";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import { mockDiretrizes } from "../../../src/data/mockData";


function DashboardProjeto() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [diretrizes, setDiretrizes] = useState(mockDiretrizes || []);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
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
      <Box
        sx={{
          marginLeft: "40px",
          paddingTop: "50px",
        }}
      >
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <PlayCircleFilledWhiteIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
              <Typography>NOME DO PROJETO</Typography>
            </Box>
          }
        />
      </Box>

      <Box
        sx={{
          marginLeft: "40px",
          marginTop: "-15px",
          width: "calc(100% - 80px)",
          minHeight: "50vh",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
          overflowX: "hidden",
        }}
      >

        {/* GRID & CHARTS */}
        <Box
          borderRadius="20px"
          paddingTop="20px"
          display="grid"
          gridTemplateColumns={
            isXlDevices
              ? "repeat(12, 1fr)"
              : isMdDevices
              ? "repeat(6, 1fr)"
              : "repeat(6, 1fr)"
          }
          gridAutoRows="140px"
          gap="20px"
        >
          {/* Statistic Items */}
          {[{
            title: "11,361",
            subtitle: "Orçamento",
            progress: "0.75",
            increase: "+14%",
            icon: <Email sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
          }, {
            title: "431,225",
            subtitle: "Custo realizado",
            progress: "0.50",
            increase: "+21%",
            icon: <PointOfSale sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
          }, {
            title: "32,441",
            subtitle: "Total de tarefas",
            progress: "0.30",
            increase: "+5%",
            icon: <PersonAdd sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
          } ].map((item, index) => (
            <Box
              key={index}
              boxShadow="2"
              borderRadius="20px"
              gridColumn="span 3"
              bgcolor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={item.title}
                subtitle={item.subtitle}
                progress={item.progress}
                increase={item.increase}
                icon={item.icon}
              />
            </Box>
          ))}

          {/* Line Chart */}
          <Box
            boxShadow="2"
            borderRadius="20px"
            gridColumn={isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 6"}
            gridRow="span 2"
            bgcolor={colors.primary[400]}
          >
            <Box mt="25px" px="30px" display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h5" fontWeight="600" color={colors.gray[700]}>
                  Revenue Generated
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={colors.blueAccent[700]}>
                  $59,342.32
                </Typography>
              </Box>
              <IconButton>
                <DownloadOutlined sx={{ fontSize: "26px", color: colors.blueAccent[700] }} />
              </IconButton>
            </Box>
            <Box height="250px" mt="-20px">
              <LineChart isDashboard={true} />
            </Box>
          </Box>
        </Box>

          







        {/* Divider */}








        <Box sx={{ paddingTop: "50px" }}>
          <Header
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <PlayCircleFilledWhiteIcon sx={{ color: "#22d3ee", fontSize: 30 }} />
                <Typography
                  fontSize="15px"
                >
                  INFORMAÇÕES DO PROJETO
                  </Typography>
              </Box>
              }
          />
        </Box>

        <Divider
          sx={{
            
            width: "calc(100% - 5px)", // Mesma largura calculada
            height: "1px",
            backgroundColor: "#ccc", // Cor do divisor
            marginBottom: "50px",
          }}
        />

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
        






        {/* Divider */}







            <Box sx={{ paddingTop: "50px" }}>
              <Header
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <PlayCircleFilledWhiteIcon sx={{ color: "#5f53e5", fontSize: 30 }} />
                    <Typography
                      fontSize="15px"
                    >
                      DIRETRIZES DO PROJETO
                      </Typography>
                  </Box>
                  }
              />
            </Box>

            <Divider
              sx={{
                
                width: "calc(100% - 5px)", // Mesma largura calculada
                height: "1px",
                backgroundColor: "#ccc", // Cor do divisor
                marginBottom: "50px",
              }}
            />



             {/* Lista de Diretrizes */}



            <AccordionDetails>
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
      </Box>
    </>
  );
}

export default DashboardProjeto;
