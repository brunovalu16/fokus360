import React, { useEffect, useState } from "react";
import { Box, Typography,
  ListItemText,
  Checkbox,
  Button,
  TextField,
  Modal,
  Select,
  MenuItem,
  IconButton,
  Divider, } from "@mui/material";
import { getDocs, collection } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import FilterListIcon from "@mui/icons-material/FilterList"; // Ícone para o Select
import ClearAllIcon from "@mui/icons-material/ClearAll"; // Ícone para limpar filtro
import AddIcon from "@mui/icons-material/Add"; // ✅ Importação correta

import FiltrosPlanejamento2 from "../../components/FiltrosPlanejamento2";




const LinhaItem = ({ cor, texto, onClick, style = {}, tipo, porcentagem   }) => (
  <Box mb={1} style={style}>
    {tipo && (
      <Typography fontWeight={400} sx={{ fontSize: "10px", marginBottom: "-5px" }}>
        {tipo}:
      </Typography>
    )}
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box
        sx={{
          width: "100%",
          height: "10px",
          backgroundColor: cor,
          borderRadius: "2px",
        }}
      />
      <Box ml={1}>
        <IconButton size="small" onClick={onClick}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>

    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        borderTop: "none",
        padding: "-2px",
        borderRadius: "0 0 4px 4px",
      }}
    >
      <Typography fontWeight={400} sx={{ fontSize: "11px" }}>
        {texto}
      </Typography>
      {porcentagem != null && (
        <Typography fontSize="10px" sx={{ color: "#888" }}>
          {porcentagem}%
        </Typography>
      )}
    </Box>
  </Box>
);


//PEgar todas as tarefas do banco
const extrairTarefas = (estrategicas) => {
  return estrategicas
    .flatMap(e => (e.taticas || []))
    .flatMap(t => (t.operacionais || []))
    .flatMap(o => (o.tarefas || []));
};


//Funções de calculos de progresso
const calcularProgressoTarefas = (tarefas = []) => {
  if (!tarefas.length) return 0;
  const concluidas = tarefas.filter(t => t.status === "concluida").length;
  return Math.round((concluidas / tarefas.length) * 100);
};

const calcularProgressoOperacional = (operacional) => {
  return calcularProgressoTarefas(operacional?.tarefas || []);
};

const calcularProgressoTatica = (tatica) => {
  const ops = tatica?.operacionais || [];
  if (!ops.length) return 0;
  const total = ops.reduce((acc, op) => acc + calcularProgressoOperacional(op), 0);
  return Math.round(total / ops.length);
};

const calcularProgressoEstrategica = (estrategica) => {
  const taticas = estrategica?.taticas || [];
  if (!taticas.length) return 0;
  const total = taticas.reduce((acc, tat) => acc + calcularProgressoTatica(tat), 0);
  return Math.round(total / taticas.length);
};





const Eapplanejamento = () => {
  const [projects, setProjects] = useState([]); // Todos os projetos
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [allCards, setAllCards] = useState([]); // 🔥 Armazena todos os cards para aplicar os filtros depois
  const [columns, setColumns] = useState([]);

  //estados para o fluxo grama
  const [expandedEstrategicas, setExpandedEstrategicas] = useState({});
  const [expandedTaticas, setExpandedTaticas] = useState({});
  const [expandedOperacionais, setExpandedOperacionais] = useState({});

  const [ativo, setAtivo] = useState({
    estrategicaId: null,
    taticaId: null,
    operacionalId: null,
  });
  

  const [expanded, setExpanded] = useState({
    estrategicas: {},
    taticas: {},
    operacionais: {}
  });
  

  


    const getColumnBorderColor = (columnId) => {
      switch (columnId) {
        case 1:
          return "#60a5fa";
        case 2:
          return "#4caf50";
        case 3:
          return "#fa4f58";
        case 4:
          return "#f28e2b";
        case 5:
          return "#34d399";
      }
    };



//buscar os projetos da coleção projetos
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const querySnapshot = await getDocs(collection(dbFokus360, "projetos"));
          const lista = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            nome: doc.data().nome || "Sem nome", // ou outro campo
          }));
          setProjects(lista); // atualiza o estado com os projetos
        } catch (error) {
          console.error("Erro ao buscar projetos:", error);
        }
      };
    
      fetchProjects();
    }, []);


    //funções do fluxograma
    const toggleExpand = (level, id) => {
      if (level === 'estrategica') {
        setExpandedEstrategicas(prev => ({ ...prev, [id]: !prev[id] }));
      }
      if (level === 'tatica') {
        setExpandedTaticas(prev => ({ ...prev, [id]: !prev[id] }));
      }
      if (level === 'operacional') {
        setExpandedOperacionais(prev => ({ ...prev, [id]: !prev[id] }));
      }
    };
    
 //função auxiliar deve Diminuir Opacidade
    const deveDiminuirOpacidade = (id, tipo) => {
      if (tipo === "Estratégicas") return ativo.estrategicaId && ativo.estrategicaId !== id;
      if (tipo === "Táticas") return ativo.taticaId && ativo.taticaId !== id;
      if (tipo === "Operacionais") return ativo.operacionalId && ativo.operacionalId !== id;
      return false;
    };
    

  

  return (
    <>
          <Box
            sx={{
              marginLeft: "40px",
              marginTop: "15px",
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
            {/* Container principal para alinhar Filtro, Botão e Contador */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between", // 🔥 Mantém os itens alinhados lado a lado
                flexWrap: "wrap", // 🔥 Ajuste automático em telas menores
                marginBottom: "15px",
                width: "100%", // 🔹 Garante que ocupe toda a largura
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start", // 🔹 Mantém alinhado à esquerda
                  gap: "10px", // 🔥 Espaçamento entre os elementos
                  minHeight: "50px", // 🔹 Garante um tamanho mínimo
                }}
              >



                {/* Caixa de seleção de filtro */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: "70%",
                    maxWidth: "100%",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FilterListIcon sx={{ color: "#757575", mr: 1 }} />
                  <Select
                    fullWidth
                    displayEmpty
                    value={selectedFilter || ""}
                    onChange={async (e) => {
                      const selectedValue = e.target.value;
                      setSelectedFilter(selectedValue);
                    
                      try {
                        const docRef = await getDocs(collection(dbFokus360, "projetos"));
                        const projetoSelecionado = docRef.docs.find(doc => doc.id === selectedValue);
                        if (!projetoSelecionado) return;
                    
                        const data = projetoSelecionado.data();
                    
                        const estrategicas = data.estrategicas || [];
                        const taticas = estrategicas.flatMap(e => e.taticas || []);
                        const operacionais = taticas.flatMap(t => t.operacionais || []);
                        const tarefas = extrairTarefas(estrategicas);
                    
                        const novaEstrutura = [
                          { id: 1, title: "Estratégicas", cards: estrategicas },
                          { id: 2, title: "Táticas", cards: taticas },
                          { id: 3, title: "Operacionais", cards: operacionais },
                          { id: 4, title: "Tarefas", cards: tarefas },
                        ];
                    
                        setColumns(novaEstrutura);
                        setAllCards([...estrategicas, ...taticas, ...operacionais, ...tarefas]);
                      } catch (error) {
                        console.error("Erro ao buscar projeto selecionado:", error);
                      }
                    }}                    
                    sx={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "5px",
                      height: "40px",
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&:focus": { outline: "none" },
                      "&.Mui-focused": { boxShadow: "none" },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Selecione um projeto:
                    </MenuItem>
                    {projects.map((projeto) => (
                      <MenuItem key={projeto.id} value={projeto.id}>
                        {projeto.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

    
                {/* Botão de limpar filtro */}
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedFilter(null);
                    applyFilter(null);
                  }}
                  sx={{
                    height: "40px",
                    minWidth: "140px", // 🔥 Define um tamanho mínimo para não sobrepor a caixa de seleção
                    backgroundColor: "#f44336",
                    color: "white",
                    whiteSpace: "nowrap", // 🔥 Impede quebra de linha no botão
                    flexShrink: 0, // 🔥 Impede que o botão diminua ao reduzir a tela
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                      boxShadow: "none",
                    },
                    "&:focus": { outline: "none" },
                  }}
                >
                  <ClearAllIcon sx={{ fontSize: "20px", mr: 1 }} />
                  Limpar Filtro
                </Button>
              </Box>
    
              {/* Contador de Tarefas */}
              <Box
                sx={{
                  width: "55%", // 🔥 Ocupa 40% da largura
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center", // 🔥 Alinha na horizontal
                  justifyContent: "space-between", // 🔥 Mantém espaçamento uniforme
                  gap: 2,
                }}
              >
                {/* Total de Tarefas */}
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total: <strong>{allCards.length}</strong>
                </Typography>
    
                {/* Quantidade de cards por status */}
                {columns.map((column) => (
                  <Box
                    key={column.id}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {/* 🔥 Bolinha colorida correspondente à coluna */}
                    <Box
                      sx={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: getColumnBorderColor(column.id),
                      }}
                    />
                    <Typography variant="body2">
                      {column.title}: <strong>{column.cards.length}</strong>
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
    
    
    
            <Box display="flex" alignItems="center" gap={1} sx={{ marginTop: "50px", marginBottom: "20px" }}>
              <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
              <Typography color="#858585">
                EAP do Projeto:
              </Typography>
            </Box>






<Box sx={{ marginBottom: "50px" }}>
  <FiltrosPlanejamento2 projetoSelecionado={selectedFilter} />
</Box>






























 {/** FLUXOGRAMA */}

























 




  <Box display="flex" gap={4} mt={4} sx={{ marginBottom: "50px" }}>
  {/* Estratégicas */}
  <Box minWidth="200px">
  {columns.find(col => col.title === "Estratégicas")?.cards.map((estrategica, index) => (
  <LinhaItem
    key={estrategica.id}
    cor="#0069f7"
    texto={estrategica.titulo || "Sem título"}
    tipo={index === 0 ? "Estratégicas" : null}
    porcentagem={calcularProgressoEstrategica(estrategica)}
    style={{
      opacity: deveDiminuirOpacidade(estrategica.id, "Estratégicas") ? 0.3 : 1
    }}
    onClick={() => {
      setExpandedEstrategicas(prev => ({
        ...prev,
        [estrategica.id]: !prev[estrategica.id],
      }));
      setAtivo({
        estrategicaId: estrategica.id,
        taticaId: null,
        operacionalId: null
      });
    }}
  />
))}


  </Box>

  {/* Táticas (somente das estratégicas expandidas) */}
  <Box minWidth="200px">
  {columns.find(col => col.title === "Estratégicas")?.cards
  .filter(e => expandedEstrategicas[e.id])
  .flatMap(e => e.taticas || [])
  .map((tatica, index) => (
    <LinhaItem
      key={tatica.id}
      cor="#4caf50"
      texto={tatica.titulo || "Sem título"}
      tipo={index === 0 ? "Táticas" : null}
      porcentagem={calcularProgressoTatica(tatica)}
      style={{
        opacity: deveDiminuirOpacidade(tatica.id, "Táticas") ? 0.3 : 1
      }}
      onClick={() => {
        setExpandedTaticas(prev => ({
          ...prev,
          [tatica.id]: !prev[tatica.id],
        }));
        setAtivo(prev => ({
          ...prev,
          taticaId: tatica.id
        }));
      }}
    />
  ))}
  

  </Box>

  {/* Operacionais (somente das táticas expandidas) */}
  <Box minWidth="200px">
  {columns.find(col => col.title === "Estratégicas")?.cards
  .flatMap(e => e.taticas || [])
  .filter(t => expandedTaticas[t.id])
  .flatMap(t => t.operacionais || [])
  .map((op, index) => (
    <LinhaItem
      key={op.id}
      cor="#f44336"
      texto={op.titulo || "Sem título"}
      tipo={index === 0 ? "Operacionais" : null}
      porcentagem={calcularProgressoOperacional(op)}
      style={{
        opacity: deveDiminuirOpacidade(op.id, "Operacionais") ? 0.3 : 1
      }}
      onClick={() => {
        setExpandedOperacionais(prev => ({
          ...prev,
          [op.id]: !prev[op.id],
        }));
        setAtivo(prev => ({
          ...prev,
          operacionalId: op.id
        }));
      }}
    />
  ))}
  

  </Box>

  {/* Tarefas (somente das operacionais expandidas) */}
  <Box minWidth="200px">
  {columns.find(col => col.title === "Estratégicas")?.cards
    .flatMap(e => e.taticas || [])
    .flatMap(t => t.operacionais || [])
    .filter(o => expandedOperacionais[o.id])
    .flatMap(o => o.tarefas || [])
    .map((tarefa, index) => (
      <Box key={tarefa.id} mb={1}>
        {index === 0 && (
          <Typography fontWeight={400} sx={{ fontSize: "10px" }}>
            Tarefas:
          </Typography>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box
            sx={{
              width: "100%",
              height: "10px",
              backgroundColor: "#ffbb00",
              borderRadius: "2px",
            }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={400} sx={{ fontSize: "11px" }}>
            {tarefa.tituloTarefa || "Sem título"}
          </Typography>

          <Checkbox
            size="small"
            checked={tarefa.status === "concluida"}
            onChange={() => {
              const novoStatus = tarefa.status === "concluida" ? "" : "concluida";
              const hoje = new Date();
              const [ano, mes, dia] = tarefa?.finalizacao?.split("-") || [];
              const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia));
              const statusVisual = novoStatus === "concluida"
                ? hoje <= prazo ? "no_prazo" : "atrasada"
                : "";

              setColumns((prev) =>
                prev.map((coluna) => {
                  if (coluna.title !== "Estratégicas") return coluna;

                  return {
                    ...coluna,
                    cards: coluna.cards.map((e) => ({
                      ...e,
                      taticas: e.taticas.map((t) => ({
                        ...t,
                        operacionais: t.operacionais.map((o) => ({
                          ...o,
                          tarefas: o.tarefas.map((tarefaItem) =>
                            tarefaItem.id === tarefa.id
                              ? {
                                  ...tarefaItem,
                                  status: novoStatus,
                                  statusVisual,
                                }
                              : tarefaItem
                          ),
                        })),
                      })),
                    })),
                  };
                })
              );
            }}
            sx={{
              color: "#888888",
              "&.Mui-checked": { color: "#888888" },
              padding: 0,
            }}
          />
        </Box>
      </Box>
    ))}
</Box>
</Box>
















          
          

          


            
          </Box>
        </>
      );
    };
    export default Eapplanejamento;