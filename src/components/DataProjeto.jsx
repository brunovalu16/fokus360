// src/scenes/DataProjeto.jsx

import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, ListItemText, Accordion, Checkbox, AccordionSummary, AccordionDetails, TextField, Select, IconButton, MenuItem, Button } from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "dayjs/locale/pt-br"; // define o idioma português para dayjs
import  Header  from "../components/Header";
import DadosProjeto from "../components/DadosProjeto";
import { getFirestore, getDocs, collection } from "firebase/firestore";


 // FUNÇÃO DO GRÁFICO
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

function DataProjeto({ checkState, handleCheckChange }) {
  const [expanded, setExpanded] = useState(false);
  const [users, setUsers] = useState([]);

  // Exemplo de estados locais para cada campo, caso queira manipular
  const [nomeProjeto, setNomeProjeto] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [prazoPrevisto, setPrazoPrevisto] = useState("");
  const [diretriz, setDiretriz] = useState("");
  const [descricao, setDescricao] = useState("");

  const [solicitante, setSolicitante] = useState({solicitante:""});
  const [unidade, setUnidade] = useState({unidade:""});
  const [categoria, setCategoria] = useState({categoria:""});
  const [colaboradores, setColaboradores] = useState({colaboradores:""});
  const [orcamento, setOrcamento] = useState({orcamento:""});
  const [quem, setQuem] = useState({quem:""});
  const [valor, setValor] = useState({valor:""});
  


  const handleChange = (event) => {
    const { name, value } = event.target;
    setUnidade((prev) => ({ ...prev, [name]: value }));
    onUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeSolicitante = (event) => {
    const { name, value } = event.target;
    setSolicitante((prev) => ({ ...prev, [name]: value }));
    //onUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCategoria = (event) => {
    const { name, value } = event.target;
    setCategoria((prev) => ({ ...prev, [name]: value }));
    //onUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeColaboradores = (event) => {
    const { name, value } = event.target;
    setColaboradores((prev) => ({ ...prev, [name]: value }));
    //onUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeQuem = (event) => {
    const { name, value } = event.target;
    setQuem((prev) => ({ ...prev, [name]: value }));
    //onUpdate((prev) => ({ ...prev, [name]: value }));
  };


  // Função de formato monetário para o campo "orçamento"
  const handleCurrencyChange = (event) => {
    const { name, value } = event.target;
    const onlyNumbers = value.replace(/[^\d]/g, "");
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(onlyNumbers / 100);

    setOrcamento((prev) => ({ ...prev, [name]: formattedValue }));
    onUpdate((prev) => ({
      ...prev,
      [name]: Number(onlyNumbers) / 100, // salva como número no pai
    }));
  };

  // Função de formato monetário para o campo "Valor"
  const handleCurrencyChangeValor = (event) => {
    const { name, value } = event.target;
    const onlyNumbers = value.replace(/[^\d]/g, "");
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(onlyNumbers / 100);

    setValor((prev) => ({ ...prev, [name]: formattedValue }));
    onUpdate((prev) => ({
      ...prev,
      [name]: Number(onlyNumbers) / 100, // salva como número no pai
    }));
  };


 // Função de Data - dia/mês/ano
  const handleDataChange = (value, setState) => {
    // Remove tudo que não for número
    const numericValue = value.replace(/\D/g, "");
  
    // Formata no padrão dd/mm/aaaa
    if (numericValue.length <= 2) {
      setState(numericValue); // Apenas o dia
    } else if (numericValue.length <= 4) {
      setState(`${numericValue.slice(0, 2)}/${numericValue.slice(2)}`); // Dia/Mês
    } else if (numericValue.length <= 8) {
      setState(
        `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}` // Dia/Mês/Ano
      );
    }
  };


  // Carregar usuários do Firebase
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const db = getFirestore();
          const querySnapshot = await getDocs(collection(db, "user"));
          const usersList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username,
          }));
          setUsers(usersList);
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
        }
      };
      fetchUsers();
    }, []);

  return (
    <>
      {/* Header */}
      <Box sx={{ marginLeft: "20px", paddingTop: "50px" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <PlayCircleFilledWhiteIcon
                sx={{ color: "#5f53e5", fontSize: 40, marginLeft: "20px" }}
              />
              <Typography>NOME DO PROJETO</Typography>
            </Box>
          }
        />

        {/* Componente DadosProjeto (já existente) */}
        <DadosProjeto />

        {/* Bloco cinza contendo os campos */}
        <Box
          sx={{
            padding: "30px",
            marginTop: "40px",
            backgroundColor: "#f2f0f0",
          }}
        >
          {/* Seção: ADICIONAR INFORMAÇÕES DO PROJETO */}

          <Box mb={3} sx={{ marginBottom: "50px" }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PlayCircleFilledWhiteIcon
                sx={{ color: "#22d3ee", fontSize: 25, marginRight: 1 }}
              />
              <Typography variant="h6">INFORMAÇÕES DO PROJETO</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Nome do projeto"
                placeholder="Nome do projeto"
                value={nomeProjeto}
                onChange={(e) => setNomeProjeto(e.target.value)}
              />

              {/* Campos de datas e selects num row flex */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {/* Data Início */}
                <TextField
                  fullWidth
                  label="Data início"
                  placeholder="dd/mm/aaaa"
                  value={dataInicio}
                  onChange={(e) =>
                    handleDataChange(e.target.value, setDataInicio)
                  }
                  inputProps={{ maxLength: 10 }} // Limita o número de caracteres
                />
                {/* Prazo Previsto */}
                <TextField
                  fullWidth
                  label="Prazo previsto"
                  placeholder="dd/mm/aaaa"
                  value={prazoPrevisto}
                  onChange={(e) =>
                    handleDataChange(e.target.value, setPrazoPrevisto)
                  }
                  inputProps={{ maxLength: 10 }} // Limita o número de caracteres
                />

                {/* Selecione a unidade do projeto */}
                <Select
                  name="unidade"
                  value={unidade.unidade}
                  onChange={handleChange}
                  displayEmpty
                  sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
                >
                  <MenuItem value="" disabled>
                    Unidade do projeto
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
              </Box>

              {/*  solicitante, categoria, colaboradores */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {/* solicitante */}
                <Select
                  name="solicitante"
                  value={solicitante.solicitante}
                  onChange={handleChangeSolicitante}
                  displayEmpty
                  sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
                >
                  <MenuItem value="">Solicitante do projeto</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.username}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>

                {/* categoria */}
                <Select
                  name="categoria"
                  value={categoria.categoria}
                  onChange={handleChangeCategoria}
                  displayEmpty
                  sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
                >
                  <MenuItem value="" disabled>
                    Categoria do projeto
                  </MenuItem>
                  <MenuItem value="ADMINISTRATIVO">ADMINISTRATIVO</MenuItem>
                  <MenuItem value="COMERCIAL">COMERCIAL</MenuItem>
                  <MenuItem value="CONTABILIDADE">CONTABILIDADE</MenuItem>
                  <MenuItem value="CONTROLADORIA">CONTROLADORIA</MenuItem>
                  <MenuItem value="DEPARTAMENTOPESSOAL">
                    DEPARTAMENTO PESSOAL
                  </MenuItem>
                  <MenuItem value="DIRETORIA">DIRETORIA</MenuItem>
                  <MenuItem value="ESTRATEGIADENEGOCIOS">
                    ESTRATÉGIA DE NEGÓCIOS
                  </MenuItem>
                  <MenuItem value="FINANCEIRO">FINANCEIRO</MenuItem>
                  <MenuItem value="RECURSOSHUMANOS">RECURSOS HUMANOS</MenuItem>
                  <MenuItem value="LOGISTICA">LOGÍSTICA</MenuItem>
                </Select>

                {/* colaboradores */}
                <Select
                  multiple
                  name="colaboradores"
                  value={colaboradores.colaboradores || []}
                  onChange={handleChangeColaboradores}
                  displayEmpty
                  sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
                  renderValue={(selected) =>
                    selected.length === 0
                      ? "Colaboradores do projeto"
                      : selected
                          .map(
                            (id) =>
                              users.find((user) => user.id === id)?.username ||
                              "Desconhecido"
                          )
                          .join(", ")
                  }
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Checkbox
                        checked={colaboradores.colaboradores.includes(user.id)}
                      />
                      <ListItemText primary={user.username} />
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <TextField
                fullWidth
                label="Descricao do projeto"
                placeholder="Descricao do projeto"
                multiline
                rows={2}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              <TextField
                label="Orçamento"
                name="orcamento"
                value={orcamento.orcamento}
                onChange={handleCurrencyChange}
                fullWidth
              />
            </Box>
          </Box>

          {/* Seção: DIRETRIZES DO PROJETO */}
          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              <PlayCircleFilledWhiteIcon
                sx={{ color: "#5f53e5", fontSize: 25, marginRight: 1 }}
              />
              <Typography variant="h6">DIRETRIZES DO PROJETO</Typography>
            </Box>

            {/* lista de diretrizes adicionadas  */}

            <Box sx={{ marginTop: 2 }}>
              <Accordion
                disableGutters
                sx={{
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  boxShadow: "none",
                  marginBottom: "10px",
                }}
              >
                {/* Cabeçalho roxo */}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#b7b7b7" }} />}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#5f53e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Título e descrição da diretriz */}
                  <Box sx={{ flex: 1, textAlign: "left" }}>
                    <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                      Diretriz do projeto
                    </Typography>
                    <Typography sx={{ color: "#b7b7b7", fontSize: "0.9em" }}>
                      Descrição da diretriz do projeto
                    </Typography>
                  </Box>
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
                  
                </AccordionSummary>

                {/* Ao expandir, mostra o campo "Digite uma tarefa..." e os 5W2H */}
                <AccordionDetails>
                  {/* Campo para adicionar tarefa */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      marginBottom: "20px",
                    }}
                  >
                    <TextField label="tarefa..." fullWidth />
                    <IconButton sx={{ minWidth: "40px" }}></IconButton>
                  </Box>

                  {/* Seção: 5W2H  */}

                  <Box
                    display="flex"
                    alignItems="center"
                    mb={1}
                    sx={{ marginBottom: "40px", marginTop: "40px" }}
                  >
                    <PlayCircleFilledWhiteIcon
                      sx={{ color: "#5f53e5", fontSize: 25, marginRight: 1 }}
                    />
                    <Typography variant="h6">Plano de Ação (5W2H)</Typography>
                  </Box>

                  {/* Campos 5W2H */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <TextField label="O que?" />
                    <TextField label="Por que?" />

                    {/* Quem... (múltipla seleção) */}
                    <Select
                      multiple
                      name="quem"
                      value={quem.quem || []}
                      onChange={handleChangeQuem}
                      displayEmpty
                      sx={{
                        flex: "1 1 calc(33.33% - 16px)",
                        minWidth: "200px",
                      }}
                      renderValue={(selected) =>
                        selected.length === 0
                          ? "Quem..."
                          : selected
                              .map(
                                (id) =>
                                  users.find((user) => user.id === id)
                                    ?.username || "Desconhecido"
                              )
                              .join(", ")
                      }
                    >
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Checkbox checked={quem.quem.includes(user.id)} />
                          <ListItemText primary={user.username} />
                        </MenuItem>
                      ))}
                    </Select>

                    <TextField label="Quando?" />
                    <TextField label="Onde?" />
                    <TextField label="Como?" />
                    <TextField
                      label="valor"
                      name="valor"
                      value={valor.valor}
                      onChange={handleCurrencyChangeValor}
                      fullWidth
                    />
                  </Box>

                  <Checkbox
                    checked={checkState[field]}
                    onChange={() => handleCheckChange(field)}
                  />

                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default DataProjeto;
