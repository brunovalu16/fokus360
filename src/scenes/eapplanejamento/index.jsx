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

import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import FilterListIcon from "@mui/icons-material/FilterList"; // Ícone para o Select
import ClearAllIcon from "@mui/icons-material/ClearAll"; // Ícone para limpar filtro
import AddIcon from "@mui/icons-material/Add"; // ✅ Importação correta

import { doc, updateDoc, getFirestore, collection, getDocs, setDoc, onSnapshot   } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config";


import FiltrosPlanejamento2 from "../../components/FiltrosPlanejamento2";
import SelectAreaStatus3 from "../../components/SelectAreaStatus3";
import StatusProgressoPorArea from "../../components/StatusProgressoPorArea";



import {
  calcularProgressoPorArea,
  calcularProgressoTatica,
  calcularProgressoOperacional,
  calcularProgressoEstrategica,
  calcularProgressoArea,
  calcularMediaProgressoGeral
} from "../../utils/progressoUtils";





const LinhaItem = ({ cor, texto, onClick, style = {}, tipo, porcentagem }) => (
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
  justifyContent="space-between"
  alignItems="flex-start"
  sx={{
    borderTop: "none",
    paddingTop: "4px",
    borderRadius: "0 0 4px 4px",
    gap: 1,
  }}
>
  <Box sx={{ maxWidth: "180px", wordBreak: "break-word" }}>
    <Typography
      fontWeight={400}
      sx={{
        fontSize: "11px",
        whiteSpace: "normal",
        lineHeight: 1.2,
      }}
    >
      {texto}
    </Typography>
  </Box>

  {porcentagem != null && (
    <Typography fontSize="10px" sx={{ color: "#888", whiteSpace: "nowrap" }}>
      {Math.round(porcentagem)}%
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









const Eapplanejamento = () => {
  const [projects, setProjects] = useState([]); // Todos os projetos
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [allCards, setAllCards] = useState([]); // 🔥 Armazena todos os cards para aplicar os filtros depois
  const [columns, setColumns] = useState([]);

  //estados para o fluxo grama
  const [expandedEstrategicas, setExpandedEstrategicas] = useState({});
  const [expandedTaticas, setExpandedTaticas] = useState({});
  const [expandedOperacionais, setExpandedOperacionais] = useState({});
  
  // buscar areas
  const [areaSelecionada, setAreaSelecionada] = useState({});
  const [areasDisponiveis, setAreasDisponiveis] = useState([]);
  const [areas, setAreas] = useState([]);

const [estrategicasBase, setEstrategicasBase] = useState([]);



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
  


//Buscar areas do banco
useEffect(() => {
  const fetchAreas = async () => {
    const querySnapshot = await getDocs(collection(dbFokus360, "areas"));
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      nome: doc.data().nome
    })).filter(area => area.nome);
    setAreas(lista);
  };

  fetchAreas();
}, []);





  


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
                    minWidth: "60%",
                    maxWidth: "60%",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FilterListIcon sx={{ color: "#757575", mr: 1, maxWidth: "50%", }} />
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
                      maxWidth: "180px",
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
                    minWidth: "130px", // 🔥 Define um tamanho mínimo para não sobrepor a caixa de seleção
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
                  width: "50%", // 🔥 Ocupa 40% da largura
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center", // 🔥 Alinha na horizontal
                  gap: 1,
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






<Box sx={{ marginBottom: "70px" }}>
  <FiltrosPlanejamento2 projetoSelecionado={selectedFilter} />
</Box>






























 {/** FLUXOGRAMA */}

























 




  <Box display="flex" gap={4} mt={4} sx={{ marginBottom: "40px" }}>
  {/* Estratégicas */}
 <Box minWidth="200px" sx={{ marginTop: "90px" }}>
  {columns.find(col => col.title === "Estratégicas")?.cards.map((estrategica, index) => {
    const estrategicaAtualizada = columns
      .find(col => col.title === "Estratégicas")
      ?.cards.find(e => e.id === estrategica.id);

    return (
      <LinhaItem
        key={estrategica.id}
        cor="#0069f7"
        texto={estrategicaAtualizada?.titulo || "Sem título"}
        tipo={index === 0 ? "Estratégicas" : null}
        porcentagem={calcularProgressoEstrategica(estrategicaAtualizada)}
        style={{
          opacity: deveDiminuirOpacidade(estrategica.id, "Estratégicas") ? 0.3 : 1
        }}
        onClick={() => {
          const estaAberta = expandedEstrategicas[estrategica.id];

          if (estaAberta) {
            // Fecha somente a atual
            const taticasIds = (estrategica.taticas || []).map(t => t.id);
            const operacionaisIds = estrategica.taticas?.flatMap(t => t.operacionais || []).map(op => op.id) || [];

            setExpandedEstrategicas(prev => ({ ...prev, [estrategica.id]: false }));
            setExpandedTaticas(prev => {
              const novo = { ...prev };
              taticasIds.forEach(id => delete novo[id]);
              return novo;
            });
            setExpandedOperacionais(prev => {
              const novo = { ...prev };
              operacionaisIds.forEach(id => delete novo[id]);
              return novo;
            });
            setAreaSelecionada(prev => {
              const novo = { ...prev };
              delete novo[estrategica.id];
              return novo;
            });
            setAtivo({ estrategicaId: null, taticaId: null, operacionalId: null });

          } else {
            // Fecha todas e abre só a nova
            const novaArea = estrategica.areaNome || ""; // ou um valor padrão se necessário

            setExpandedEstrategicas({ [estrategica.id]: true });
            setExpandedTaticas({});
            setExpandedOperacionais({});
            setAreaSelecionada({ [estrategica.id]: novaArea });
            setAtivo({ estrategicaId: estrategica.id, taticaId: null, operacionalId: null });
          }
        }}

      />
    );
  })}
</Box>




  {/* Táticas (somente das estratégicas expandidas) */}
 {/* Táticas com filtro por área */}
<Box minWidth="100px" maxWidth="250px">
  {columns.find(col => col.title === "Estratégicas")?.cards
    .filter(e => expandedEstrategicas[e.id]) // Estratégicas abertas
    .map(estrategica => {
      const area = areaSelecionada[estrategica.id];
      const todasTaticas = estrategica.taticas || [];
      const taticas = area ? todasTaticas.filter(t => t.areaNome === area) : [];

      return (
        <Box key={estrategica.id} sx={{ mb: 3 }}>
          {/* Filtro de área por Estratégica */}
          <Box sx={{  
            backgroundColor: "transparent",
            //border: "1px solid #a0a0a0",
            width: "100%",
            minWidth: "600px", // 🔥 aumenta a largura mínima
            borderRadius: "17px",
            padding: "10px",
            marginTop: "-45px",
            boxSizing: "border-box",
            marginBottom: "20px"
           }}>

           <Box sx={{ maxWidth: "210px", borderRadius: "10px", marginBottom: "15px" }}>
            <StatusProgressoPorArea estrategica={estrategica} />
           </Box>


            <SelectAreaStatus3
              estrategica={estrategica}
              areas={areas}
              value={areaSelecionada[estrategica.id] || ""}
              onChangeArea={(novaArea) =>
                setAreaSelecionada((prev) => ({
                  ...prev,
                  [estrategica.id]: novaArea
                }))
              }
            />
          </Box>

          {/* Lista de Táticas da área filtrada */}
          {taticas.map((tatica, index) => (
            <Box key={tatica.id} mb={1}>
              {index === 0 && (
                <Typography fontWeight={400} sx={{ fontSize: "10px" }}>
                  Táticas:
                </Typography>
              )}

              {/* Barra + botão + checkbox */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box sx={{ width: "100%", height: "10px", backgroundColor: "#4caf50", borderRadius: "2px" }} />

                <IconButton
                  size="small"
                  onClick={() => {
                    setExpandedTaticas(prev => ({
                      ...prev,
                      [tatica.id]: !prev[tatica.id]
                    }));
                    setAtivo(prev => ({
                      ...prev,
                      taticaId: tatica.id
                    }));
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>

                <Checkbox
                  size="small"
                  checked={tatica.status === "concluida"}
                  onChange={() => {
                    const novoStatus = tatica.status === "concluida" ? "" : "concluida";
                    const hoje = new Date();
                    const [ano, mes, dia] = tatica?.prazo?.split("-") || [];
                    const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia));
                    const statusVisual = novoStatus === "concluida"
                      ? hoje <= prazo ? "no_prazo" : "atrasada"
                      : "";

                    setColumns(prev =>
                      prev.map(coluna => {
                        if (coluna.title !== "Estratégicas") return coluna;
                        return {
                          ...coluna,
                          cards: coluna.cards.map(e => ({
                            ...e,
                            taticas: e.taticas.map(t =>
                              t.id === tatica.id
                                ? { ...t, status: novoStatus, statusVisual }
                                : t
                            )
                          }))
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

              {/* Título e Progresso */}
              
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ borderTop: "none", padding: "-2px", borderRadius: "0 0 4px 4px" }}
              >
                <Box sx={{ maxWidth: "180px", wordBreak: "break-word" }}>
                  <Typography
                    fontWeight={400}
                    sx={{
                      fontSize: "11px",
                      whiteSpace: "normal",
                      lineHeight: 1.2,
                    }}
                  >
                    {tatica.titulo || "Sem título"}
                  </Typography>
                </Box>
                {(() => {
                  const taticaAtualizada = columns
                    .find(col => col.title === "Táticas")?.cards
                    .find(t => t.id === tatica.id);

                  return (
                    <Typography fontSize="10px" sx={{ color: "#888" }}>
                      {calcularProgressoTatica(tatica)}%
                    </Typography>
                  );
                })()}
              </Box>
            </Box>
          ))}
        </Box>
      );
    })}
</Box>




  {/* Operacionais (somente das táticas expandidas) */}
<Box minWidth="100px" maxWidth="250px" sx={{ marginTop: "90px" }}>
  {columns.find(col => col.title === "Estratégicas")?.cards
    .flatMap(e => e.taticas || [])
    .filter(t => expandedTaticas[t.id])
    .flatMap(t => t.operacionais || [])
    .map((op, index) => (
      <Box key={op.id} mb={1}>
        {index === 0 && (
          <Typography fontWeight={400} sx={{ fontSize: "10px" }}>
            Operacionais:
          </Typography>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Barra de progresso */}
          <Box
            sx={{
              width: "100%",
              height: "10px",
              backgroundColor: "#f44336",
              borderRadius: "2px",
            }}
          />

          {/* Botão "+" para expandir */}
          <IconButton size="small" onClick={() => {
            setExpandedOperacionais(prev => ({
              ...prev,
              [op.id]: !prev[op.id]
            }));
            setAtivo(prev => ({
              ...prev,
              operacionalId: op.id
            }));
          }}>
            <AddIcon fontSize="small" />
          </IconButton>

          {/* Checkbox de status */}
          <Checkbox
            size="small"
            checked={op.status === "concluida"}
            onChange={() => {
              const novoStatus = op.status === "concluida" ? "" : "concluida";
              const hoje = new Date();
              const [ano, mes, dia] = op?.prazo?.split("-") || [];
              const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia));
              const statusVisual = novoStatus === "concluida"
                ? hoje <= prazo ? "no_prazo" : "atrasada"
                : "";

              setColumns(prev =>
                prev.map(coluna => {
                  if (coluna.title !== "Estratégicas") return coluna;
                  return {
                    ...coluna,
                    cards: coluna.cards.map(e => ({
                      ...e,
                      taticas: e.taticas.map(t => ({
                        ...t,
                        operacionais: t.operacionais.map(o =>
                          o.id === op.id
                            ? { ...o, status: novoStatus, statusVisual }
                            : o
                        )
                      }))
                    }))
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

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={400} sx={{ fontSize: "11px" }}>
            {op.titulo || "Sem título"}
          </Typography>
          {(() => {
            const atualizado = columns
              .find(col => col.title === "Estratégicas")?.cards
              .flatMap(e => e.taticas || [])
              .flatMap(t => t.operacionais || [])
              .find(o => o.id === op.id);

            return (
              <Typography fontSize="10px" sx={{ color: "#888" }}>
                {(() => {
                  const atualizado = columns
                    .find(col => col.title === "Operacionais")?.cards
                    .find(o => o.id === op.id);

                  return (
                    <Typography fontSize="10px" sx={{ color: "#888" }}>
                      {calcularProgressoOperacional(op)}%
                    </Typography>
                  );
                })()}
              </Typography>
            );
          })()}


        </Box>
      </Box>
    ))}
</Box>


  {/* Tarefas (somente das operacionais expandidas) */}
  <Box minWidth="200px" sx={{ marginTop: "100px" }}>
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
          <Typography
            fontWeight={400}
            sx={{ fontSize: "11px", whiteSpace: "normal" }}
          >
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