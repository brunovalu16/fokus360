import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Checkbox,
  CircularProgress,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Select,
  IconButton,
  MenuItem,
  Button,
} from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { useSearchParams } from "react-router-dom"; // Importar para capturar o ID da URL
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Link } from "react-router-dom";
import "dayjs/locale/pt-br"; // define o idioma português para dayjs
import Header from "../components/Header";
//import DadosProjeto from "../components/DadosProjeto";

import { useParams } from "react-router-dom";



// Firestore
import { getFirestore, getDocs, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { dbFokus360  } from "../data/firebase-config";

import BaseDiretriz2 from "./BaseDiretriz2";
import DadosProjeto from "../components/DadosProjeto";

// FUNÇÃO DO GRÁFICO
const ProgressStatus = ({ tarefaCheckState }) => {
  const totalFields = 1; // Número fixo de checkbox por tarefa
  const relevantKeys = Object.keys(tarefaCheckState || {}).slice(0, totalFields);
  const completedFields = relevantKeys.filter((key) => tarefaCheckState[key]).length;

  const status =
    completedFields === 0
      ? { color: "#fff", text: "Em andamento" }
      : completedFields === totalFields
      ? { color: "#98f713", text: "Finalizado" }
      : { color: "#00f6fc", text: "Em andamento" };

  return (
    <Box
      marginTop="30px"
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        justifyContent: "center",
        maxWidth: "25%",
        marginLeft: "auto",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#5f53e5",
        transform: "scale(0.7)",
        transformOrigin: "center",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={(completedFields / totalFields) * 100}
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

function DataProjeto() {
  const [users, setUsers] = useState([]);

  const { id: projectId } = useParams();


  // Estados para as datas
  const [dataInicio, setDataInicio] = useState(""); // Valor puro do banco (ISO)
  const [prazoPrevisto, setPrazoPrevisto] = useState(""); // Valor puro do banco (ISO)

  // Estados temporários para o campo de entrada
  const [dataInicioFormatada, setDataInicioFormatada] = useState("");
  const [prazoPrevistoFormatada, setPrazoPrevistoFormatada] = useState("");

  // Estados locais para cada campo, para manipular
  const [nomeProjeto, setNomeProjeto] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");
  const [solicitanteEmail, setSolicitanteEmail] = useState("");
  const [checkState, setCheckState] = useState({});
  const [oQue, setOque] = useState("");
  const [como, setComo] = useState("");
  const [porQue, setPorQue] = useState("");
  const [solicitante, setSolicitante] = useState({ solicitante: "" });
  const [unidade, setUnidade] = useState({ unidade: [] });
  const [categoria, setCategoria] = useState({ categoria: [] });
  const [colaboradores, setColaboradores] = useState({ colaboradores: [] });
  const [orcamento, setOrcamento] = useState({ orcamento: "" });
  const [quem, setQuem] = useState({ quem: [] });
  const [valor, setValor] = useState({ valor: "" });
  const [tituloTarefa, setTituloTarefa] = useState("");
  const [quando, setQuando] = useState("");
  const [onde, setOnde] = useState("");
  const [diretrizTitulo, setDiretrizTitulo] = useState("");
  const [diretrizDescricao, setDiretrizDescricao] = useState("");
  

  // Armazenar todas as diretrizes
  const [diretrizes, setDiretrizes] = useState([]);





  // Função para garantir que cada diretriz possua tarefas como array
  function normalizarDiretrizes(diretrizesDoBanco = []) {
    return diretrizesDoBanco.map((diretriz) => ({
      ...diretriz,
      tarefas: Array.isArray(diretriz.tarefas) ? diretriz.tarefas : [],
    }));
  }

  // Buscar os dados do projeto usando o projectId
  useEffect(() => {
    if (!projectId) return;

    const fetchProjectData = async () => {
      try {
        const docRef = doc(dbFokus360, "projetos2", projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Atualiza os estados básicos
          setNomeProjeto(data.nome || "");
          setDataInicio(data.dataInicio || "");
          setDataFim(data.dataFim || "");
          setPrazoPrevisto(data.prazoPrevisto || "");
          setUnidade({ unidade: data.unidade || "" });
          setCategoria({ categoria: data.categoria || "" });
          setSolicitante({ solicitante: data.solicitante || "" });
          setDescricao(data.descricao || "");
          setSolicitanteEmail(data.solicitanteEmail || "");
          setOrcamento({ orcamento: data.orcamento || "" });
          setColaboradores({ colaboradores: data.colaboradores || [] });

          // Normaliza diretrizes para garantir que "tarefas" seja um array
          const diretrizesNormalizadas = normalizarDiretrizes(data.diretrizes);
          setDiretrizes(diretrizesNormalizadas);

          // Reconstrói o estado dos checkboxes
          const restoredCheckState = {};
          diretrizesNormalizadas.forEach((diretriz, diretrizIndex) => {
            const tarefas = diretriz.tarefas || [];
            tarefas.forEach((tarefa, tarefaIndex) => {
              const taskKey = `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}`;
              restoredCheckState[taskKey] = tarefa.checkboxState || {};
            });
          });

          setCheckState(restoredCheckState); // Atualiza o estado dos checkboxes
        } else {
          console.error("Documento não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do projeto:", error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  // Atualizar o estado local das diretrizes quando o usuário altera um campo
  const handleDiretrizChange = (index, field, value) => {
    const updatedDiretrizes = [...diretrizes];
    updatedDiretrizes[index][field] = value;
    setDiretrizes(updatedDiretrizes);
  };

  // Atualizar tarefas dentro de uma diretriz
  const handleTarefaChange = (diretrizIndex, tarefaIndex, fieldPath, value) => {
    setDiretrizes((prevDiretrizes) => {
      const updatedDiretrizes = [...prevDiretrizes];
      const fieldKeys = fieldPath.split(".");
      // Protege se "tarefas" estiver ausente
      const tarefas = updatedDiretrizes[diretrizIndex].tarefas || [];
      let current = tarefas[tarefaIndex];

      for (let i = 0; i < fieldKeys.length - 1; i++) {
        current = current[fieldKeys[i]];
      }
      current[fieldKeys[fieldKeys.length - 1]] = value;
      return updatedDiretrizes;
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUnidade((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeSolicitante = (event) => {
    const { name, value } = event.target;
    setSolicitante((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCategoria = (event) => {
    const { name, value } = event.target;
    setCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeColaboradores = (event) => {
    const { name, value } = event.target;
    setColaboradores((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeQuem = (event) => {
    const { name, value } = event.target;
    setQuem((prev) => ({ ...prev, [name]: value }));
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
  };

  // Converte de ISO para DD/MM/AAAA
  const formatarDataParaBrasileiro = (dataISO) => {
    if (!dataISO || dataISO.length !== 10) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Converte de DD/MM/AAAA para ISO
  const formatarDataParaISO = (dataBR) => {
    if (!dataBR || dataBR.length !== 10) return "";
    const [dia, mes, ano] = dataBR.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  // Formatar datas do banco para exibição no formato brasileiro
  useEffect(() => {
    setDataInicioFormatada(formatarDataParaBrasileiro(dataInicio));
    setPrazoPrevistoFormatada(formatarDataParaBrasileiro(prazoPrevisto));
  }, [dataInicio, prazoPrevisto]);

  // Função de Data - dia/mês/ano
  const handleDataChange = (value, setState) => {
    // Remove tudo que não for número
    const numericValue = value.replace(/\D/g, "");

    // Formata no padrão dd/mm/aaaa
    if (numericValue.length <= 2) {
      setState(numericValue);
    } else if (numericValue.length <= 4) {
      setState(`${numericValue.slice(0, 2)}/${numericValue.slice(2)}`);
    } else {
      setState(
        `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`
      );
    }
  };

  // Carregar usuários do Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = dbFokus360; // Usa a instância correta do Firestore

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

  // Função para alternar o estado do checkbox
  const handleCheckChange = (diretrizIndex, tarefaIndex, key) => {
    const taskKey = `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}`;
    setCheckState((prevState) => {
      const updatedState = {
        ...prevState,
        [taskKey]: {
          ...prevState[taskKey],
          [key]: !prevState[taskKey]?.[key],
        },
      };

      // Atualiza o progresso
      const totalFields = 1;
      const relevantKeys = Object.keys(updatedState[taskKey] || {}).slice(0, totalFields);
      const completedFields = relevantKeys.filter((k) => updatedState[taskKey][k]).length;
      const progresso = (completedFields / totalFields) * 100;

      // Atualiza o progresso no estado das diretrizes
      setDiretrizes((prevDiretrizes) => {
        const updatedDiretrizes = [...prevDiretrizes];
        const tarefas = updatedDiretrizes[diretrizIndex]?.tarefas || [];
        if (!tarefas[tarefaIndex]) return updatedDiretrizes;

        tarefas[tarefaIndex].progresso = progresso;
        tarefas[tarefaIndex].checkboxState = updatedState[taskKey];
        return updatedDiretrizes;
      });

      return updatedState;
    });
  };

  // Função para salvar as alterações no Firestore
  const handleSave = async () => {
    try {
      if (!projectId) {
        alert("Projeto não encontrado!");
        return;
      }
  
      // Pegamos o estado mais recente antes de salvar
      setDiretrizes((prevDiretrizes) => {
        const diretrizesSeguras = prevDiretrizes.map((diretriz) => ({
          ...diretriz,
          tarefas: Array.isArray(diretriz.tarefas) ? diretriz.tarefas : [],
        }));
  
        const updatedDiretrizes = diretrizesSeguras.map((diretriz, diretrizIndex) => ({
          ...diretriz,
          tarefas: diretriz.tarefas.map((tarefa, tarefaIndex) => {
            const taskKey = `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}`;
            const tarefaCheckState = checkState[taskKey] || {};
            const totalFields = 1;
            const relevantKeys = Object.keys(tarefaCheckState).slice(0, totalFields);
            const completedFields = relevantKeys.filter((key) => tarefaCheckState[key]).length;
            const progresso = (completedFields / totalFields) * 100;
  
            return {
              ...tarefa,
              tituloTarefa: tarefa.tituloTarefa || "",
              planoDeAcao: {
                ...tarefa.planoDeAcao,
                oQue: tarefa.planoDeAcao?.oQue || "",
                porQue: tarefa.planoDeAcao?.porQue || "",
                quem: tarefa.planoDeAcao?.quem || [],
                quando: tarefa.planoDeAcao?.quando || "",
                onde: tarefa.planoDeAcao?.onde || "",
                como: tarefa.planoDeAcao?.como || "",
                valor: tarefa.planoDeAcao?.valor || "",
              },
              checkboxState: tarefaCheckState,
              progresso,
            };
          }),
        }));
  
        // Agora atualiza o Firestore com os dados mais recentes
        const docRef = doc(dbFokus360, "projetos2", projectId);
        updateDoc(docRef, {
          nome: nomeProjeto || "",
          dataInicio: dataInicio || "",
          dataFim: dataFim || "",
          prazoPrevisto: prazoPrevisto || "",
          unidade: unidade.unidade || "",
          categoria: categoria.categoria || "",
          solicitante: solicitante.solicitante || "",
          descricao: descricao || "",
          solicitanteEmail: solicitanteEmail || "",
          orcamento: orcamento.orcamento || "",
          colaboradores: colaboradores.colaboradores || [],
          diretrizes: updatedDiretrizes,
        })
          .then(() => {
            alert("Dados salvos com sucesso!");
          })
          .catch((error) => {
            console.error("Erro ao salvar os dados:", error);
            alert("Erro ao salvar os dados. Tente novamente.");
          });
  
        return updatedDiretrizes; // Retorna o estado atualizado
      });
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      alert("Erro ao salvar os dados. Tente novamente.");
    }
  };
  

  // Funções de cálculo (tarefas concluídas, progresso, orçamento, etc.)
  const calcularTotalTarefasConcluidas = () => {
    let totalConcluidas = 0;
  
    if (diretrizes && Array.isArray(diretrizes)) {
      diretrizes.forEach((diretriz) => {
        diretriz.taticas?.forEach((tatica) => {
          tatica.operacionais?.forEach((operacional) => {
            operacional.tarefas?.forEach((tarefa) => {
              if (tarefa.checkboxState?.concluida) {
                totalConcluidas += 1; // Conta apenas tarefas com checkbox marcado
              }
            });
          });
        });
      });
    }
  
    return totalConcluidas;
  };
  
  

  const calcularProgressoGeral = (diretrizIndex) => {
    if (!Array.isArray(diretrizes) || diretrizes.length === 0) return 0; // 🔹 Verifica se `diretrizes` é um array válido
  
    const diretriz = diretrizes[diretrizIndex]; 
    if (!diretriz || !Array.isArray(diretriz.tarefas) || diretriz.tarefas.length === 0) return 0; // 🔹 Evita erro se `diretriz` ou `tarefas` forem undefined
  
    const progressoTotal = diretriz.tarefas.reduce((acc, tarefa) => acc + (tarefa.progresso || 0), 0);
    return Math.round(progressoTotal / diretriz.tarefas.length);
  };
  

  const calcularValorGasto = () => {
    let totalGasto = 0;
  
    if (diretrizes && Array.isArray(diretrizes)) {
      diretrizes.forEach((diretriz) => {
        diretriz.taticas?.forEach((tatica) => {
          tatica.operacionais?.forEach((operacional) => {
            operacional.tarefas?.forEach((tarefa) => {
              const valor = tarefa.planoDeAcao?.valor || "R$ 0,00";
              const somenteNumeros =
                parseFloat(valor.replace("R$", "").replace(/\./g, "").replace(",", ".")) || 0;
              totalGasto += somenteNumeros;
            });
          });
        });
      });
    }
  
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(totalGasto);
  };
  

  const calcularTotalDiretrizes = () => {
    return diretrizes.length;
  };

  const calcularTotalTarefas = () => {
    let totalTarefas = 0;
  
    if (diretrizes && Array.isArray(diretrizes)) {
      diretrizes.forEach((diretriz) => {
        diretriz.taticas?.forEach((tatica) => {
          tatica.operacionais?.forEach((operacional) => {
            totalTarefas += operacional.tarefas?.length || 0;
          });
        });
      });
    }
  
    return totalTarefas;
  };
  

  const handleDiretrizesUpdate = (diretrizesAtualizadas) => {
    // Se houver alguma estrutura "setInformacoesProjeto" 
    // ou manipulação de estado pai, inclua aqui
  };

  const calcularOrcamento = () => {
    return orcamento.orcamento || "R$ 0,00"; // 🔹 Verifica se `orcamento.orcamento` tem valor, caso contrário, retorna "R$ 0,00"
  };
  

  return (
    <>
      {/* Botão voltar painel de projetos */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          color="primary"
          onClick={""}
          sx={{
            marginRight: "70px",
            fontSize: "10px",
            fontWeight: "bold",
            borderRadius: "5px",
            padding: "10px 20px",
            backgroundColor: "#3f2cb2",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#3f2cb2" },
          }}
        >
          <KeyboardReturnIcon sx={{ marginRight: "8px", fontSize: "30px" }} />
          Voltar para o painel de projetos
        </Button>
      </Box>

      {/* Header */}
      <Box sx={{ marginLeft: "20px", paddingTop: "50px" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <PlayCircleFilledWhiteIcon
                sx={{ color: "#5f53e5", fontSize: 40, marginLeft: "20px" }}
              />
              <Typography>{nomeProjeto || "Nome do projeto não definido"}</Typography>
            </Box>
          }
        />

        
         
      <DadosProjeto
        orcamento={calcularOrcamento()}
        valorGasto={calcularValorGasto()}
        totalDiretrizes={calcularTotalDiretrizes()}
        totalTarefas={calcularTotalTarefas()}
        tarefasConcluidas={calcularTotalTarefasConcluidas()} // ✅ Adicionado
        diretrizes={diretrizes}
      />




        
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

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  fullWidth
                  label="Data início"
                  placeholder="dd/mm/aaaa"
                  value={dataInicioFormatada}
                  InputProps={{
                    readOnly: true,
                  }}
                  inputProps={{ maxLength: 10 }}
                />

                <TextField
                  fullWidth
                  label="Prazo previsto"
                  placeholder="dd/mm/aaaa"
                  value={prazoPrevistoFormatada}
                  onChange={(e) => {
                    const valor = e.target.value;
                    handleDataChange(valor, setPrazoPrevistoFormatada);
                  }}
                  onBlur={() => {
                    setPrazoPrevisto(formatarDataParaISO(prazoPrevistoFormatada));
                  }}
                  inputProps={{ maxLength: 10 }}
                />

                <Select
                  name="unidade"
                  value={unidade.unidade}
                  onChange={(e) => setUnidade({ unidade: e.target.value })}
                  displayEmpty
                  sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
                >
                  <MenuItem value="" disabled>
                    Unidade do projeto
                  </MenuItem>
                  <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                  <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                  <MenuItem value="MATOGROSSO">MATO GROSSO</MenuItem>
                  <MenuItem value="MATOGROSSODOSUL">MATO GROSSO DO SUL</MenuItem>
                  <MenuItem value="PARA">PARÁ</MenuItem>
                  <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
                </Select>
              </Box>

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
                fullWidth
                label="Email do Solicitante"
                placeholder="Digite o email do solicitante"
                multiline
                rows={2}
                value={solicitanteEmail}
                onChange={(e) => setSolicitanteEmail(e.target.value)}
              />
              <TextField
                label="Orçamento"
                name="orcamento"
                value={orcamento.orcamento}
                onChange={handleCurrencyChange}
                fullWidth
              />
              <TextField
                fullWidth
                label="Data de finalização do projeto"
                placeholder="dd/mm/aaaa"
                value={dataFim}
                onChange={(e) => handleDataChange(e.target.value, setDataFim)}
                inputProps={{ maxLength: 10 }}
              />
            </Box>
          </Box>

          {/* Seção: DIRETRIZES DO PROJETO */}
          <Box>
          {projectId && (
            <BaseDiretriz2 projectId={projectId} onDiretrizesUpdate={setDiretrizes} />
          )}

          </Box>

          {/* Botão Salvar Alterações */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 5,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave} // Chama a função handleSave
              sx={{
                backgroundColor: "#5f54e7",
                fontSize: "10px",
                fontWeight: "bold",
                borderRadius: "5px",
                padding: "10px 20px",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#3f2cb2" },
              }}
            >
              Salvar Alterações
            </Button>


          </Box>
        </Box>
      </Box>
    </>
  );
}

export default DataProjeto;
