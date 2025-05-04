import React, { useRef, useState, useEffect  } from "react";
import { Box, Typography, CircularProgress, TextField  } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import FlagIcon from '@mui/icons-material/Flag';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

import { dbFokus360 as db } from "../data/firebase-config";

import { getDocs, collection, doc, updateDoc  } from "firebase/firestore";
import { dbFokus360, storageFokus360  } from "../data/firebase-config"; // ajuste conforme seu path


import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


// IMPORTS
import { PieChart } from '@mui/x-charts/PieChart'; // ✅ importante! precisa ter esse pacote instalado


import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


const FiltrosPlanejamento = ({ estrategicas,  }) => {
    //Essa parte pertence ao painel de filtros 
      const [value, setValue] = React.useState("");
      const scrollRef = useRef(null);
      const [isDragging, setIsDragging] = useState(false);
      const [startX, setStartX] = useState(0);
      const [scrollLeft, setScrollLeft] = useState(0);
      const [projetoData, setProjetoData] = useState("");
      const [todosProjetos, setTodosProjetos] = useState([]);


      const [estrategicasAtrasadas, setEstrategicasAtrasadas] = useState([]);
      const [taticasAtrasadas, setTaticasAtrasadas] = useState([]);
      const [operacionaisAtrasadas, setOperacionaisAtrasadas] = useState([]);
      const [tarefasAtrasadas, setTarefasAtrasadas] = useState([]);



      const [estrategicasConcluidasAtrasadas, setEstrategicasConcluidasAtrasadas] = useState([]);
      const [taticasConcluidasAtrasadas, setTaticasConcluidasAtrasadas] = useState([]);
      const [operacionaisConcluidasAtrasadas, setOperacionaisConcluidasAtrasadas] = useState([]);
      const [tarefasConcluidasAtrasadas, setTarefasConcluidasAtrasadas] = useState([]);

      const [projetosFiltrados, setProjetosFiltrados] = useState([]);

      const [areaSelecionada, setAreaSelecionada] = useState("");
      const [areas, setAreas] = useState([]);




      const [unidades, setUnidades] = useState([]);
      const [unidadeSelecionada, setUnidadeSelecionada] = useState("");



      

     

const buscarTodosProjetos = async () => {
  try {
    const querySnapshot = await getDocs(collection(dbFokus360, "projetos"));
    const projetos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTodosProjetos(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
  }
};

useEffect(() => {
  buscarTodosProjetos();
}, []);




      useEffect(() => {
        const carregarProjetos = async () => {
          const projetosSnapshot = await getDocs(collection(dbFokus360, "projetos"));
          const todosProjetos = [];
      
          projetosSnapshot.forEach(doc => {
            const data = doc.data();
            todosProjetos.push({ id: doc.id, ...data });
          });
      
          // Aplica o filtro por área
          const filtrados = todosProjetos.filter(proj => {
            return proj.estrategicas?.some(est =>
              (est.areasResponsaveis || []).includes(areaSelecionada) ||
              est.taticas?.some(t =>
                (t.areasResponsaveis || []).includes(areaSelecionada) ||
                t.operacionais?.some(op =>
                  (op.areasResponsaveis || []).includes(areaSelecionada) ||
                  op.tarefas?.some(tar =>
                    (tar.areasResponsaveis || []).includes(areaSelecionada)
                  )
                )
              )
            );
          });
      
          setProjetosFiltrados(filtrados);
        };
      
        if (areaSelecionada) {
          carregarProjetos();
        }
      }, [areaSelecionada]);




      useEffect(() => {
        const fetchUnidades = async () => {
          const querySnapshot = await getDocs(collection(dbFokus360, "unidade"));
          const lista = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUnidades(lista);
        };
      
        fetchUnidades();
      }, []);


      useEffect(() => {
        const fetchAreas = async () => {
          const querySnapshot = await getDocs(collection(dbFokus360, "areas"));
          const lista = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAreas(lista);
        };
      
        fetchAreas();
      }, []);


useEffect(() => {
  const buscarAtrasadas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "projetos"));

      const est = [];
      const tat = [];
      const op = [];
      const tar = [];

      snapshot.forEach((docSnap) => {
        const projeto = docSnap.data();
        const estrategicas = projeto.estrategicas || [];

        estrategicas.forEach((estrategica) => {
          if (estrategica.statusVisual === "atrasada" && estrategica.status !== "concluida") {
            est.push(estrategica);
          }

          (estrategica.taticas || []).forEach((tatica) => {
            if (tatica.statusVisual === "atrasada" && tatica.status !== "concluida") {
              tat.push(tatica);
            }

            (tatica.operacionais || []).forEach((opItem) => {
              if (opItem.statusVisual === "atrasada" && opItem.status !== "concluida") {
                op.push(opItem);
              }

              (opItem.tarefas || []).forEach((tarefa) => {
                if (tarefa.statusVisual === "atrasada" && tarefa.status !== "concluida") {
                  tar.push(tarefa);
                }
              });
            });
          });
        });
      });

      setEstrategicasAtrasadas(est);
      setTaticasAtrasadas(tat);
      setOperacionaisAtrasadas(op);
      setTarefasAtrasadas(tar);
    } catch (error) {
      console.error("❌ Erro ao buscar diretrizes atrasadas:", error);
    }
  };

  buscarAtrasadas();
}, []);




useEffect(() => {
  const buscarConcluidasAtrasadas = async () => {
    const snapshot = await getDocs(collection(db, "projetos"));

    const est = [], tat = [], op = [], tar = [];

    snapshot.forEach((doc) => {
      const projeto = doc.data();
      const estrategicas = projeto.estrategicas || [];

      estrategicas.forEach((estrategica) => {
        if (estrategica.status === "concluida" && estrategica.statusVisual === "atrasada") {
          est.push(estrategica);
        }

        (estrategica.taticas || []).forEach((tatica) => {
          if (tatica.status === "concluida" && tatica.statusVisual === "atrasada") {
            tat.push(tatica);
          }

          (tatica.operacionais || []).forEach((opItem) => {
            if (opItem.status === "concluida" && opItem.statusVisual === "atrasada") {
              op.push(opItem);
            }

            (opItem.tarefas || []).forEach((tarefa) => {
              if (tarefa.status === "concluida" && tarefa.statusVisual === "atrasada") {
                tar.push(tarefa);
              }
            });
          });
        });
      });
    });

    setEstrategicasConcluidasAtrasadas(est);
    setTaticasConcluidasAtrasadas(tat);
    setOperacionaisConcluidasAtrasadas(op);
    setTarefasConcluidasAtrasadas(tar);
  };

  buscarConcluidasAtrasadas();
}, []);




    
    //useEffect para buscar os projetos
      useEffect(() => {
        const fetchProjetos = async () => {
          const querySnapshot = await getDocs(collection(db, "projetos"));
          const projetos = [];
          querySnapshot.forEach((doc) => {
            projetos.push({ id: doc.id, ...doc.data() });
          });
          setTodosProjetos(projetos);
        };
      
        fetchProjetos();
      }, []);
    
    
    
    return (
        <>
        <Box>

            {/**FILTROS */}
            
            
            <Box
                  sx={{
                    border: "1px solid #9b9b9b",
                    borderRadius: "10px",
                    backgroundColor: "transparent",
                    padding: 2,
                    marginBottom: "30px",
                  }}
                >
                  <Box
                    sx={{
                      top: "20px", // distância do topo
                      marginLeft: "10px",
                      paddingX: "6px",
                      fontSize: "15px",
                      marginBottom: "10px",
                      fontWeight: "bold",
                      color: "#312783",
                      zIndex: 1,
                    }}
                  >
                    Variáveis globais de projetos:
                  </Box>


                  <TabContext value={value}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        scrollBehavior: "smooth",
                        "& .MuiTabs-scroller": {
                          scrollBehavior: "smooth",
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#312783",
                          height: "3px",
                        },
                        "& .MuiTab-root": {
                          color: "#505050",
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "12px",
                          "&:hover": {
                            color: "#312783",
                          },
                        },
                        "& .Mui-selected": {
                          color: "#312783 !important",
                        },
                        "& .MuiTabs-scrollButtons": {
                          width: 50,
                          height: 50,
                          fontSize: "3rem",
                          color: "#312783",
                        },
                        "& .Mui-disabled": {
                          opacity: 0.3,
                        },
                        "& .MuiTabPanel-root": {
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          padding: 2,
                          marginTop: 2,
                        },
                      }}
                    >


                      <TabList
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        aria-label="lab API tabs example"
                      >
                        <Tab value="1" label="Diretrizes"  onClick={() => setValue(value === "1" ? "" : "1")} />
                        <Tab value="2" label="Tarefas" onClick={() => setValue(value === "2" ? "" : "2")} />
                        <Tab value="3" label="Não iniciadas" onClick={() => setValue(value === "3" ? "" : "3")} />
                        <Tab value="4" label="Em andamento" onClick={() => setValue(value === "4" ? "" : "4")} />
                        <Tab value="5" label="Concluídas" onClick={() => setValue(value === "5" ? "" : "5")} />
                        <Tab value="6" label="Em atraso" onClick={() => setValue(value === "6" ? "" : "6")} />
                        <Tab value="7" label="Concluídas em atraso" onClick={() => setValue(value === "7" ? "" : "7")} />
                        <Tab value="8" label="Por áreas" onClick={() => setValue(value === "8" ? "" : "8")} />
                        <Tab value="9" label="Por unidades" onClick={() => setValue(value === "9" ? "" : "9")} />
                      </TabList>
                    </Box>






















 <TabPanel value="1">
  {todosProjetos.map((projeto, pIndex) => (
    <Box key={projeto.id} sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ color: "#000", mb: 1 }}>
        📁 Projeto: <strong>{projeto.nome || "Sem nome"}</strong>
      </Typography>

      {/* Estratégicas */}
      {projeto.estrategicas?.map((estrategica, eIndex) => (
        <Box
          key={`est-${pIndex}-${eIndex}`}
          sx={{
            backgroundColor: eIndex % 2 === 0 ? "#ededed" : "#e5e5e5",
            px: 2,
            py: 1,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
              <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
              <Typography variant="h6" sx={{ color: "#312783" }}>
                Estratégicas:
              </Typography>
            </Box>
          <Typography variant="body2" sx={{ flex: 1 }}>
            {estrategica.titulo}
          </Typography>

          <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

          <Typography variant="body2" sx={{ flex: 2 }}>
            <strong>Responsáveis:</strong>{" "}
            <span style={{ fontStyle: "italic", color: "#555" }}>
              {(estrategica.emails || []).join(", ")}
            </span>
          </Typography>

          <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <TextField
              label="Data início"
              type="date"
              size="small"
              value={projeto?.dataInicio || ""}
              InputLabelProps={{ shrink: true }}
              disabled
              sx={{ minWidth: "100px", maxWidth: "120px" }}
            />
            <TextField
              label="Prazo previsto"
              type="date"
              size="small"
              value={projeto?.prazoPrevisto || ""}
              InputLabelProps={{ shrink: true }}
              disabled
              sx={{ minWidth: "100px", maxWidth: "120px" }}
            />
          </Box>
        </Box>
      ))}

      {/* Táticas */}
      {projeto.estrategicas?.flatMap((estrategica, eIndex) =>
        estrategica.taticas?.map((tatica, tIndex) => (
          <Box
            key={`tat-${pIndex}-${eIndex}-${tIndex}`}
            sx={{
              backgroundColor: tIndex % 2 === 0 ? "#f0f0f0" : "#e0e0e0",
              px: 4,
              py: 1,
              borderBottom: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
                <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
                <Typography variant="h6" sx={{ color: "#00796b" }}>
                  Táticas:
                </Typography>
              </Box>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {tatica.titulo}
            </Typography>

            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

            <Typography variant="body2" sx={{ flex: 2 }}>
              <strong>Responsáveis:</strong>{" "}
              <span style={{ fontStyle: "italic", color: "#555" }}>
                {(tatica.emails || []).join(", ")}
              </span>
            </Typography>

            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Data início"
                type="date"
                size="small"
                value={projeto?.dataInicio || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
              <TextField
                label="Prazo previsto"
                type="date"
                size="small"
                value={projeto?.prazoPrevisto || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
            </Box>
          </Box>
        ))
      )}

      {/* Operacionais */}
      {projeto.estrategicas?.flatMap((estrategica, eIndex) =>
        estrategica.taticas?.flatMap((tatica, tIndex) =>
          tatica.operacionais?.map((op, oIndex) => (
            <Box
              key={`op-${pIndex}-${eIndex}-${tIndex}-${oIndex}`}
              sx={{
                backgroundColor: oIndex % 2 === 0 ? "#f9f9f9" : "#ececec",
                px: 6,
                py: 1,
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                  <DoubleArrowIcon sx={{ color: "#f30c0c", mr: 1 }} />
                  <Typography variant="h6" sx={{ color: "#f30c0c" }}>
                    Operacionais:
                  </Typography>
                </Box>
              <Typography variant="body2" sx={{ flex: 1 }}>
                 {op.titulo}
              </Typography>

              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

              <Typography variant="body2" sx={{ flex: 2 }}>
                <strong>Responsáveis:</strong>{" "}
                <span style={{ fontStyle: "italic", color: "#555" }}>
                  {(op.emails || []).join(", ")}
                </span>
              </Typography>

              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TextField
                  label="Data início"
                  type="date"
                  size="small"
                  value={projeto?.dataInicio || ""}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
                <TextField
                  label="Prazo previsto"
                  type="date"
                  size="small"
                  value={projeto?.prazoPrevisto || ""}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
              </Box>
            </Box>
          ))
        )
      )}
    </Box>
  ))}
</TabPanel>





























                      
            
            
<TabPanel value="2">
  {/* Tarefas de TODOS os projetos */}
  {todosProjetos.map((projeto, pIndex) => (
    <Box key={projeto.id} sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ color: "#000", mb: 1 }}>
        📁 Projeto: <strong>{projeto.nome || "Sem nome"}</strong>
      </Typography>

      {projeto.estrategicas?.flatMap((estrategica, eIndex) =>
        estrategica.taticas?.flatMap((tatica, tIndex) =>
          tatica.operacionais?.flatMap((operacional, oIndex) =>
            operacional.tarefas?.map((tarefa, i) => {
              const responsaveis = tarefa?.planoDeAcao?.quemEmail
                ? Array.isArray(tarefa.planoDeAcao.quemEmail)
                  ? tarefa.planoDeAcao.quemEmail.join(", ")
                  : tarefa.planoDeAcao.quemEmail
                : "Nenhum responsável";

              return (
                <Box
                  key={`tarefa-${pIndex}-${eIndex}-${tIndex}-${oIndex}-${i}`}
                  sx={{
                    backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
                    px: 2,
                    py: 1,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                      <DoubleArrowIcon sx={{ color: "#f57c00", mr: 1 }} />
                      <Typography variant="h6" sx={{ color: "#f57c00" }}>
                        Tarefas:
                      </Typography>
                    </Box>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                     {tarefa.tituloTarefa || "-"}
                  </Typography>

                  <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

                  <Typography variant="body2" sx={{ flex: 2 }}>
                    <strong>Responsáveis:</strong>{" "}
                    <span style={{ fontStyle: "italic", color: "#555" }}>
                      {responsaveis}
                    </span>
                  </Typography>

                  <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <TextField
                      label="Data início"
                      type="date"
                      size="small"
                      value={projeto?.dataInicio || ""}
                      InputLabelProps={{ shrink: true }}
                      disabled
                      sx={{ minWidth: "100px", maxWidth: "120px" }}
                    />
                    <TextField
                      label="Prazo previsto"
                      type="date"
                      size="small"
                      value={projeto?.prazoPrevisto || ""}
                      InputLabelProps={{ shrink: true }}
                      disabled
                      sx={{ minWidth: "100px", maxWidth: "120px" }}
                    />
                  </Box>
                </Box>
              );
            })
          )
        )
      )}
    </Box>
  ))}
</TabPanel>

            






































            
            
            
<TabPanel value="3">
  {todosProjetos.map((projeto, pIndex) => (
    <Box key={projeto.id} sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ color: "#000", mb: 1 }}>
        📁 Projeto: <strong>{projeto.nome || "Sem nome"}</strong>
      </Typography>

      {/* Estratégicas não iniciadas */}
      {projeto.estrategicas
        ?.filter((e) => e.status === "" || e.statusVisual === "nao_iniciada")
        .map((estrategica, i) => (
          <Box
            key={`nao-est-${pIndex}-${i}`}
            sx={{
              backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
              px: 2,
              py: 1,
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
              <Typography variant="h6" sx={{ color: "#312783" }}>
                Estratégicas:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ flex: 1 }}>
               {estrategica.titulo}
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Typography variant="body2" sx={{ flex: 2 }}>
              <strong>Responsáveis:</strong>{" "}
              <span style={{ fontStyle: "italic", color: "#555" }}>
                {(estrategica.emails || []).join(", ")}
              </span>
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Data início"
                type="date"
                size="small"
                value={projeto?.dataInicio || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
              <TextField
                label="Prazo previsto"
                type="date"
                size="small"
                value={projeto?.prazoPrevisto || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
            </Box>
          </Box>
        ))}

      {/* Táticas não iniciadas */}
      {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas
          ?.filter((tatica) => tatica.status === "" || tatica.statusVisual === "nao_iniciada")
          .map((tatica, tIndex) => (
            <Box
              key={`nao-tat-${pIndex}-${estIndex}-${tIndex}`}
              sx={{
                backgroundColor: tIndex % 2 === 0 ? "#ededed" : "#e5e5e5",
                px: 4,
                py: 1,
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
                <Typography variant="h6" sx={{ color: "#00796b" }}>
                  Táticas:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ flex: 1 }}>
                 {tatica.titulo}
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Typography variant="body2" sx={{ flex: 2 }}>
                <strong>Responsáveis:</strong>{" "}
                <span style={{ fontStyle: "italic", color: "#555" }}>
                  {(tatica.emails || []).join(", ")}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TextField
                  label="Data início"
                  type="date"
                  size="small"
                  value={projeto?.dataInicio || ""}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
                <TextField
                  label="Prazo previsto"
                  type="date"
                  size="small"
                  value={projeto?.prazoPrevisto || ""}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
              </Box>
            </Box>
          ))
      )}

      {/* Operacionais não iniciadas */}
      {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas?.flatMap((tatica, tatIndex) =>
          tatica.operacionais
            ?.filter((op) => op.status === "" || op.statusVisual === "nao_iniciada")
            .map((op, oIndex) => (
              <Box
                key={`nao-op-${pIndex}-${estIndex}-${tatIndex}-${oIndex}`}
                sx={{
                  backgroundColor: oIndex % 2 === 0 ? "#ededed" : "#e5e5e5",
                  px: 6,
                  py: 1,
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <DoubleArrowIcon sx={{ color: "#f30c0c", mr: 1 }} />
                  <Typography variant="h6" sx={{ color: "#f30c0c" }}>
                    Operacionais:
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ flex: 1 }}>
                   {op.titulo}
                </Typography>
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Typography variant="body2" sx={{ flex: 2 }}>
                  <strong>Responsáveis:</strong>{" "}
                  <span style={{ fontStyle: "italic", color: "#555" }}>
                    {(op.emails || []).join(", ")}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <TextField
                    label="Data início"
                    type="date"
                    size="small"
                    value={projeto?.dataInicio || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                  <TextField
                    label="Prazo previsto"
                    type="date"
                    size="small"
                    value={projeto?.prazoPrevisto || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                </Box>
              </Box>
            ))
        )
      )}

      {/* Tarefas não iniciadas */}
      {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas?.flatMap((tatica, tatIndex) =>
          tatica.operacionais?.flatMap((op, opIndex) =>
            op.tarefas
              ?.filter((tarefa) => tarefa.status === "" || tarefa.statusVisual === "nao_iniciada")
              .map((tarefa, i) => {
                const responsaveis = Array.isArray(tarefa?.planoDeAcao?.quemEmail)
                  ? tarefa.planoDeAcao.quemEmail.join(", ")
                  : tarefa?.planoDeAcao?.quemEmail || "Nenhum responsável";

                return (
                  <Box
                    key={`nao-tarefa-${pIndex}-${estIndex}-${tatIndex}-${opIndex}-${i}`}
                    sx={{
                      backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
                      px: 8,
                      py: 1,
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <DoubleArrowIcon sx={{ color: "#f57c00", mr: 1 }} />
                      <Typography variant="h6" sx={{ color: "#f57c00" }}>
                        Tarefas:
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                       {tarefa.tituloTarefa || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                    <Typography variant="body2" sx={{ flex: 2 }}>
                      <strong>Responsáveis:</strong>{" "}
                      <span style={{ fontStyle: "italic", color: "#555" }}>
                        {responsaveis}
                      </span>
                    </Typography>
                    <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <TextField
                        label="Data início"
                        type="date"
                        size="small"
                        value={projeto?.dataInicio || ""}
                        InputLabelProps={{ shrink: true }}
                        disabled
                        sx={{ minWidth: "100px", maxWidth: "120px" }}
                      />
                      <TextField
                        label="Prazo previsto"
                        type="date"
                        size="small"
                        value={projeto?.prazoPrevisto || ""}
                        InputLabelProps={{ shrink: true }}
                        disabled
                        sx={{ minWidth: "100px", maxWidth: "120px" }}
                      />
                    </Box>
                  </Box>
                );
              })
          )
        )
      )}
    </Box>
  ))}
</TabPanel>




































            
            
            
            
            
<TabPanel value="4">
  {todosProjetos.map((projeto, pIndex) => (
    <Box key={projeto.id} sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ color: "#000", mb: 1 }}>
        📁 Projeto: <strong>{projeto.nome || "Sem nome"}</strong>
      </Typography>

      {/* Estratégicas em andamento */}
      {projeto.estrategicas
        ?.filter((e) => e.status === "andamento")
        .map((estrategica, i) => (
          <Box
            key={`and-est-${pIndex}-${i}`}
            sx={{
              backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
              px: 2,
              py: 1,
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
              <Typography variant="h6" sx={{ color: "#312783" }}>
                Estratégicas:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ flex: 1 }}>
             {estrategica.titulo}
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Typography variant="body2" sx={{ flex: 2 }}>
              <strong>Responsáveis:</strong>{" "}
              <span style={{ fontStyle: "italic", color: "#555" }}>
                {(estrategica.emails || []).join(", ")}
              </span>
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Data início"
                type="date"
                size="small"
                value={projeto?.dataInicio || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
              <TextField
                label="Prazo previsto"
                type="date"
                size="small"
                value={projeto?.prazoPrevisto || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
            </Box>
          </Box>
        ))}

      {/* Táticas em andamento */}
      {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas
          ?.filter((tatica) => tatica.status === "andamento")
          .map((tatica, tIndex) => (
            <Box
              key={`and-tat-${pIndex}-${estIndex}-${tIndex}`}
              sx={{
                backgroundColor: tIndex % 2 === 0 ? "#ededed" : "#e5e5e5",
                px: 4,
                py: 1,
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
                <Typography variant="h6" sx={{ color: "#00796b" }}>
                  Táticas:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ flex: 1 }}>
                 {tatica.titulo}
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Typography variant="body2" sx={{ flex: 2 }}>
                <strong>Responsáveis:</strong>{" "}
                <span style={{ fontStyle: "italic", color: "#555" }}>
                  {(tatica.emails || []).join(", ")}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TextField
                  label="Data início"
                  type="date"
                  size="small"
                  value={projeto?.dataInicio || ""}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
                <TextField
                  label="Prazo previsto"
                  type="date"
                  size="small"
                  value={projeto?.prazoPrevisto || ""}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
              </Box>
            </Box>
          ))
      )}

      {/* Operacionais em andamento */}
      {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas?.flatMap((tatica, tatIndex) =>
          tatica.operacionais
            ?.filter((op) => op.status === "andamento")
            .map((op, oIndex) => (
              <Box
                key={`and-op-${pIndex}-${estIndex}-${tatIndex}-${oIndex}`}
                sx={{
                  backgroundColor: oIndex % 2 === 0 ? "#ededed" : "#e5e5e5",
                  px: 6,
                  py: 1,
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <DoubleArrowIcon sx={{ color: "#f30c0c", mr: 1 }} />
                  <Typography variant="h6" sx={{ color: "#f30c0c" }}>
                    Operacionais:
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ flex: 1 }}>
                   {op.titulo}
                </Typography>
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Typography variant="body2" sx={{ flex: 2 }}>
                  <strong>Responsáveis:</strong>{" "}
                  <span style={{ fontStyle: "italic", color: "#555" }}>
                    {(op.emails || []).join(", ")}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <TextField
                    label="Data início"
                    type="date"
                    size="small"
                    value={projeto?.dataInicio || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                  <TextField
                    label="Prazo previsto"
                    type="date"
                    size="small"
                    value={projeto?.prazoPrevisto || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                </Box>
              </Box>
            ))
        )
      )}

      {/* Tarefas em andamento */}
      {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas?.flatMap((tatica, tatIndex) =>
          tatica.operacionais?.flatMap((op, opIndex) =>
            op.tarefas
              ?.filter((tarefa) => tarefa.status === "andamento")
              .map((tarefa, i) => {
                const responsaveis = Array.isArray(tarefa?.planoDeAcao?.quemEmail)
                  ? tarefa.planoDeAcao.quemEmail.join(", ")
                  : tarefa?.planoDeAcao?.quemEmail || "Nenhum responsável";

                return (
                  <Box
                    key={`and-tarefa-${pIndex}-${estIndex}-${tatIndex}-${opIndex}-${i}`}
                    sx={{
                      backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
                      px: 8,
                      py: 1,
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <DoubleArrowIcon sx={{ color: "#f57c00", mr: 1 }} />
                      <Typography variant="h6" sx={{ color: "#f57c00" }}>
                        Tarefas:
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                       {tarefa.tituloTarefa || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                    <Typography variant="body2" sx={{ flex: 2 }}>
                      <strong>Responsáveis:</strong>{" "}
                      <span style={{ fontStyle: "italic", color: "#555" }}>
                        {responsaveis}
                      </span>
                    </Typography>
                    <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <TextField
                        label="Data início"
                        type="date"
                        size="small"
                        value={projeto?.dataInicio || ""}
                        InputLabelProps={{ shrink: true }}
                        disabled
                        sx={{ minWidth: "100px", maxWidth: "120px" }}
                      />
                      <TextField
                        label="Prazo previsto"
                        type="date"
                        size="small"
                        value={projeto?.prazoPrevisto || ""}
                        InputLabelProps={{ shrink: true }}
                        disabled
                        sx={{ minWidth: "100px", maxWidth: "120px" }}
                      />
                    </Box>
                  </Box>
                );
              })
          )
        )
      )}
    </Box>
  ))}
</TabPanel>












































            
            
<TabPanel value="5">
  {todosProjetos.map((projeto, pIndex) => (
    <Box key={projeto.id} sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ color: "#000", mb: 1 }}>
        📁 Projeto: <strong>{projeto.nome || "Sem nome"}</strong>
      </Typography>
      {/* Estratégicas concluídas */}
      {projeto.estrategicas
        ?.filter((e) => e.status === "concluida")
        .map((estrategica, i) => (
          <Box
            key={`est-conc-${pIndex}-${i}`}
            sx={{
              backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
              px: 2,
              py: 1,
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
              <Typography variant="h6" sx={{ color: "#312783" }}>
                Estratégicas:
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ flex: 1 }}>
               {estrategica.titulo}
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Typography variant="body2" sx={{ flex: 2 }}>
              <strong>Responsáveis:</strong>{" "}
              <span style={{ fontStyle: "italic", color: "#555" }}>
                {(estrategica.emails || []).join(", ")}
              </span>
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Data início"
                type="date"
                size="small"
                value={projeto?.dataInicio || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
              <TextField
                label="Prazo previsto"
                type="date"
                size="small"
                value={projeto?.prazoPrevisto || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
            </Box>
          </Box>
        ))}

      {/* Táticas concluídas */}
      {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas
          ?.filter((tatica) => tatica.status === "concluida")
          .map((tatica, tIndex) => (
            <Box
              key={`tat-conc-${pIndex}-${estIndex}-${tIndex}`}
              sx={{
                backgroundColor: tIndex % 2 === 0 ? "#ededed" : "#e5e5e5",
                px: 4,
                py: 1,
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
                <Typography variant="h6" sx={{ color: "#00796b" }}>
                  Táticas:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ flex: 1 }}>
                 {tatica.titulo}
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Typography variant="body2" sx={{ flex: 2 }}>
                <strong>Responsáveis:</strong>{" "}
                <span style={{ fontStyle: "italic", color: "#555" }}>
                  {(tatica.emails || []).join(", ")}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TextField
                  label="Data início"
                  type="date"
                  size="small"
                  value={projeto?.dataInicio || ""}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
                <TextField
                  label="Prazo previsto"
                  type="date"
                  size="small"
                  value={projeto?.prazoPrevisto || ""}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
              </Box>
            </Box>
          ))
      )}

      {/* Operacionais concluídas */}
      {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas?.flatMap((tatica, tatIndex) =>
          tatica.operacionais
            ?.filter((op) => op.status === "concluida")
            .map((op, oIndex) => (
              <Box
                key={`op-conc-${pIndex}-${estIndex}-${tatIndex}-${oIndex}`}
                sx={{
                  backgroundColor: oIndex % 2 === 0 ? "#ededed" : "#e5e5e5",
                  px: 6,
                  py: 1,
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <DoubleArrowIcon sx={{ color: "#f30c0c", mr: 1 }} />
                  <Typography variant="h6" sx={{ color: "#f30c0c" }}>
                    Operacionais:
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ flex: 1 }}>
                   {op.titulo}
                </Typography>
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Typography variant="body2" sx={{ flex: 2 }}>
                  <strong>Responsáveis:</strong>{" "}
                  <span style={{ fontStyle: "italic", color: "#555" }}>
                    {(op.emails || []).join(", ")}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <TextField
                    label="Data início"
                    type="date"
                    size="small"
                    value={projeto?.dataInicio || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                  <TextField
                    label="Prazo previsto"
                    type="date"
                    size="small"
                    value={projeto?.prazoPrevisto || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                </Box>
              </Box>
            ))
        )
      )}

      {/* Tarefas concluídas */}
      {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas?.flatMap((tatica, tatIndex) =>
          tatica.operacionais?.flatMap((op, opIndex) =>
            op.tarefas
              ?.filter((tarefa) => tarefa.status === "concluida")
              .map((tarefa, i) => {
                const responsaveis = Array.isArray(tarefa?.planoDeAcao?.quemEmail)
                  ? tarefa.planoDeAcao.quemEmail.join(", ")
                  : tarefa?.planoDeAcao?.quemEmail || "Nenhum responsável";

                return (
                  <Box
                    key={`tarefa-conc-${pIndex}-${estIndex}-${tatIndex}-${opIndex}-${i}`}
                    sx={{
                      backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
                      px: 8,
                      py: 1,
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <DoubleArrowIcon sx={{ color: "#f57c00", mr: 1 }} />
                      <Typography variant="h6" sx={{ color: "#f57c00" }}>
                        Tarefas:
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {tarefa.tituloTarefa || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                    <Typography variant="body2" sx={{ flex: 2 }}>
                      <strong>Responsáveis:</strong>{" "}
                      <span style={{ fontStyle: "italic", color: "#555" }}>
                        {responsaveis}
                      </span>
                    </Typography>
                    <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <TextField
                        label="Data início"
                        type="date"
                        size="small"
                        value={projeto?.dataInicio || ""}
                        InputLabelProps={{ shrink: true }}
                        disabled
                        sx={{ minWidth: "100px", maxWidth: "120px" }}
                      />
                      <TextField
                        label="Prazo previsto"
                        type="date"
                        size="small"
                        value={projeto?.prazoPrevisto || ""}
                        InputLabelProps={{ shrink: true }}
                        disabled
                        sx={{ minWidth: "100px", maxWidth: "120px" }}
                      />
                    </Box>
                  </Box>
                );
              })
          )
        )
      )}
    </Box>
  ))}
</TabPanel>










































            
            
            
            
            
<TabPanel value="6">
  {/* Estratégicas Atrasadas */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#312783" }}>
        Estratégicas
      </Typography>
    </Box>
    {estrategicasAtrasadas.map((estrategica, i) => (
      <Box
        key={`est-atrasada-${i}`}
        sx={{
          backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
          px: 2,
          py: 1,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>
          {estrategica.titulo}
        </Typography>

        <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

        <Typography variant="body2" sx={{ flex: 2 }}>
          <strong>Responsáveis:</strong>{" "}
          <span style={{ fontStyle: "italic", color: "#555" }}>
            {(estrategica.emails || []).join(", ")}
          </span>
        </Typography>
      </Box>
    ))}
  </Box>

  {/* Táticas Atrasadas */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#00796b" }}>
        Táticas
      </Typography>
    </Box>
    {taticasAtrasadas.map((tatica, i) => (
      <Box
        key={`tat-atrasada-${i}`}
        sx={{
          backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
          px: 2,
          py: 1,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>
          {tatica.titulo}
        </Typography>

        <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

        <Typography variant="body2" sx={{ flex: 2 }}>
          <strong>Responsáveis:</strong>{" "}
          <span style={{ fontStyle: "italic", color: "#555" }}>
            {(tatica.emails || []).join(", ")}
          </span>
        </Typography>
      </Box>
    ))}
  </Box>

  {/* Operacionais Atrasadas */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#ff9800", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#ff9800" }}>
        Operacionais
      </Typography>
    </Box>
    {operacionaisAtrasadas.map((op, i) => (
      <Box
        key={`op-atrasada-${i}`}
        sx={{
          backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
          px: 2,
          py: 1,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>
          {op.titulo}
        </Typography>

        <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

        <Typography variant="body2" sx={{ flex: 2 }}>
          <strong>Responsáveis:</strong>{" "}
          <span style={{ fontStyle: "italic", color: "#555" }}>
            {(op.emails || []).join(", ")}
          </span>
        </Typography>
      </Box>
    ))}
  </Box>

  {/* Tarefas Atrasadas */}
  <Box>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#f57c00", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#f57c00" }}>
        Tarefas
      </Typography>
    </Box>
    {tarefasAtrasadas.map((tarefa, i) => (
      <Box
        key={`tar-atrasada-${i}`}
        sx={{
          backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
          px: 2,
          py: 1,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>
          {tarefa.titulo}
        </Typography>

        <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

        <Typography variant="body2" sx={{ flex: 2 }}>
          <strong>Responsáveis:</strong>{" "}
          <span style={{ fontStyle: "italic", color: "#555" }}>
            {(tarefa.emails || []).join(", ")}
          </span>
        </Typography>
      </Box>
    ))}
  </Box>
</TabPanel>


            































            
            
            
            
            
            
            
            
            
            
            
<TabPanel value="7">
  {/* Estratégicas Concluídas em Atraso */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#312783" }}>
        Concluídas em Atraso - Estratégicas
      </Typography>
    </Box>
    {estrategicasConcluidasAtrasadas.map((estrategica, i) => (
      <Box
        key={`est-conc-atrasada-${i}`}
        sx={{
          backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
          px: 2,
          py: 1,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>{estrategica.titulo}</Typography>
        <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
        <Typography variant="body2" sx={{ flex: 2 }}>
          <strong>Responsáveis:</strong>{" "}
          <span style={{ fontStyle: "italic", color: "#555" }}>
            {(estrategica.emails || []).join(", ")}
          </span>
        </Typography>
      </Box>
    ))}
  </Box>

  {/* Táticas Concluídas em Atraso */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#00796b" }}>
        Táticas Concluídas em Atraso
      </Typography>
    </Box>
    {taticasConcluidasAtrasadas.map((tatica, i) => (
      <Box
        key={`tat-conc-atrasada-${i}`}
        sx={{
          backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
          px: 2,
          py: 1,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>{tatica.titulo}</Typography>
        <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
        <Typography variant="body2" sx={{ flex: 2 }}>
          <strong>Responsáveis:</strong>{" "}
          <span style={{ fontStyle: "italic", color: "#555" }}>
            {(tatica.emails || []).join(", ")}
          </span>
        </Typography>
      </Box>
    ))}
  </Box>

  {/* Operacionais Concluídas em Atraso */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#ff9800", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#ff9800" }}>
        Operacionais Concluídas em Atraso
      </Typography>
    </Box>
    {operacionaisConcluidasAtrasadas.map((op, i) => (
      <Box
        key={`op-conc-atrasada-${i}`}
        sx={{
          backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
          px: 2,
          py: 1,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>{op.titulo}</Typography>
        <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
        <Typography variant="body2" sx={{ flex: 2 }}>
          <strong>Responsáveis:</strong>{" "}
          <span style={{ fontStyle: "italic", color: "#555" }}>
            {(op.emails || []).join(", ")}
          </span>
        </Typography>
      </Box>
    ))}
  </Box>

  {/* Tarefas Concluídas em Atraso */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#6a1b9a", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#6a1b9a" }}>
        Tarefas Concluídas em Atraso
      </Typography>
    </Box>
    {tarefasConcluidasAtrasadas.map((tarefa, i) => {
      const responsaveis = Array.isArray(tarefa?.planoDeAcao?.quemEmail)
        ? tarefa.planoDeAcao.quemEmail.join(", ")
        : tarefa?.planoDeAcao?.quemEmail || "Nenhum responsável";

      return (
        <Box
          key={`tarefa-conc-atrasada-${i}`}
          sx={{
            backgroundColor: i % 2 === 0 ? "#ededed" : "#e5e5e5",
            px: 2,
            py: 1,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ flex: 1 }}>
            {tarefa.tituloTarefa || "-"}
          </Typography>
          <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
          <Typography variant="body2" sx={{ flex: 2 }}>
            <strong>Responsáveis:</strong>{" "}
            <span style={{ fontStyle: "italic", color: "#555" }}>
              {responsaveis}
            </span>
          </Typography>
        </Box>
      );
    })}
  </Box>
</TabPanel>






















<TabPanel value="8">
  <Box sx={{ mb: 3 }}>
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel id="select-area-label" shrink>
        Filtrar por Área
      </InputLabel>
      <Select
        labelId="select-area-label"
        id="select-area"
        value={areaSelecionada}
        onChange={(e) => setAreaSelecionada(e.target.value)}
        label="Filtrar por Área"
        displayEmpty
        renderValue={(selected) => {
          if (selected === "") {
            return <em>Selecione uma área:</em>;
          }
          const area = areas.find((a) => a.id === selected);
          return area?.nome || "";
        }}
        inputProps={{ notched: true }}
      >
        <MenuItem value="">
          <em>Todas as Áreas</em>
        </MenuItem>
        {areas.map((area) => (
          <MenuItem key={area.id} value={area.id}>
            {area.nome}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>

  {areaSelecionada !== "" && (
    <>
      {/* Estratégicas */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#312783", mb: 1 }}>
          Estratégicas
        </Typography>
        {todosProjetos?.flatMap((proj, pIdx) =>
          proj.estrategicas
            ?.filter((e) => (e.areasResponsaveis || []).includes(areaSelecionada))
            .map((e, i) => (
              <Box key={`estrat-${pIdx}-${i}`} sx={{ px: 2, py: 1, bgcolor: i % 2 === 0 ? "#ededed" : "#e5e5e5" }}>
                <Typography><strong>{e.titulo}</strong></Typography>
              </Box>
            ))
        )}
      </Box>

      {/* Táticas */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#00796b", mb: 1 }}>
          Táticas
        </Typography>
        {todosProjetos?.flatMap((proj, pIdx) =>
          proj.estrategicas?.flatMap((est, i) =>
            est.taticas
              ?.filter((t) => (t.areasResponsaveis || []).includes(areaSelecionada))
              .map((t, j) => (
                <Box key={`tat-${pIdx}-${i}-${j}`} sx={{ px: 2, py: 1, bgcolor: j % 2 === 0 ? "#ededed" : "#e5e5e5" }}>
                  <Typography><strong>{t.titulo}</strong></Typography>
                </Box>
              ))
          )
        )}
      </Box>

      {/* Operacionais */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#ff9800", mb: 1 }}>
          Operacionais
        </Typography>
        {todosProjetos?.flatMap((proj, pIdx) =>
          proj.estrategicas?.flatMap((est, i) =>
            est.taticas?.flatMap((tat, j) =>
              tat.operacionais
                ?.filter((op) => (op.areasResponsaveis || []).includes(areaSelecionada))
                .map((op, k) => (
                  <Box key={`op-${pIdx}-${i}-${j}-${k}`} sx={{ px: 2, py: 1, bgcolor: k % 2 === 0 ? "#ededed" : "#e5e5e5" }}>
                    <Typography><strong>{op.titulo}</strong></Typography>
                  </Box>
                ))
            )
          )
        )}
      </Box>

      {/* Tarefas */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#6a1b9a", mb: 1 }}>
          Tarefas
        </Typography>
        {todosProjetos?.flatMap((proj, pIdx) =>
          proj.estrategicas?.flatMap((est, i) =>
            est.taticas?.flatMap((tat, j) =>
              tat.operacionais?.flatMap((op, k) =>
                op.tarefas
                  ?.filter((t) => (t.areasResponsaveis || []).includes(areaSelecionada))
                  .map((t, l) => (
                    <Box key={`tarefa-${pIdx}-${i}-${j}-${k}-${l}`} sx={{ px: 2, py: 1, bgcolor: l % 2 === 0 ? "#ededed" : "#e5e5e5" }}>
                      <Typography><strong>{t.tituloTarefa}</strong></Typography>
                    </Box>
                  ))
              )
            )
          )
        )}
      </Box>
    </>
  )}
</TabPanel>


























<TabPanel value="9">
  <Box sx={{ mb: 3 }}>
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel id="select-unidade-label" shrink>
        Filtrar por Unidade
      </InputLabel>
      <Select
        labelId="select-unidade-label"
        id="select-unidade"
        value={unidadeSelecionada}
        onChange={(e) => setUnidadeSelecionada(e.target.value)}
        label="Filtrar por Unidade"
        displayEmpty
        renderValue={(selected) => {
          if (selected === "") {
            return <em>Selecione uma unidade:</em>;
          }
          const unidade = unidades.find((u) => u.id === selected);
          return unidade?.nome || "";
        }}
        inputProps={{ notched: true }}
      >
        <MenuItem value="">
          <em>Todas as Unidades</em>
        </MenuItem>
        {unidades.map((unidade) => (
          <MenuItem key={unidade.id} value={unidade.id}>
            {unidade.nome}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>

  {unidadeSelecionada !== "" && (
    <>
      {/* Estratégicas */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#312783", mb: 1 }}>
          Estratégicas
        </Typography>
        {todosProjetos?.flatMap((proj, pIdx) =>
          proj.estrategicas
            ?.filter((e) => (e.unidades || []).includes(unidadeSelecionada))
            .map((e, i) => (
              <Box key={`estrat-unid-${pIdx}-${i}`} sx={{ px: 2, py: 1, bgcolor: i % 2 === 0 ? "#ededed" : "#e5e5e5" }}>
                <Typography><strong>{e.titulo}</strong></Typography>
              </Box>
            ))
        )}
      </Box>

      {/* Táticas */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#00796b", mb: 1 }}>
          Táticas
        </Typography>
        {todosProjetos?.flatMap((proj, pIdx) =>
          proj.estrategicas?.flatMap((est, i) =>
            est.taticas
              ?.filter((t) => (t.unidades || []).includes(unidadeSelecionada))
              .map((t, j) => (
                <Box key={`tat-unid-${pIdx}-${i}-${j}`} sx={{ px: 2, py: 1, bgcolor: j % 2 === 0 ? "#ededed" : "#e5e5e5" }}>
                  <Typography><strong>{t.titulo}</strong></Typography>
                </Box>
              ))
          )
        )}
      </Box>

      {/* Operacionais */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#ff9800", mb: 1 }}>
          Operacionais
        </Typography>
        {todosProjetos?.flatMap((proj, pIdx) =>
          proj.estrategicas?.flatMap((est, i) =>
            est.taticas?.flatMap((tat, j) =>
              tat.operacionais
                ?.filter((op) => (op.unidades || []).includes(unidadeSelecionada))
                .map((op, k) => (
                  <Box key={`op-unid-${pIdx}-${i}-${j}-${k}`} sx={{ px: 2, py: 1, bgcolor: k % 2 === 0 ? "#ededed" : "#e5e5e5" }}>
                    <Typography><strong>{op.titulo}</strong></Typography>
                  </Box>
                ))
            )
          )
        )}
      </Box>

      {/* Tarefas */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#6a1b9a", mb: 1 }}>
          Tarefas
        </Typography>
        {todosProjetos?.flatMap((proj, pIdx) =>
          proj.estrategicas?.flatMap((est, i) =>
            est.taticas?.flatMap((tat, j) =>
              tat.operacionais?.flatMap((op, k) =>
                op.tarefas
                  ?.filter((t) => (t.unidades || []).includes(unidadeSelecionada))
                  .map((t, l) => (
                    <Box key={`tarefa-unid-${pIdx}-${i}-${j}-${k}-${l}`} sx={{ px: 2, py: 1, bgcolor: l % 2 === 0 ? "#ededed" : "#e5e5e5" }}>
                      <Typography><strong>{t.tituloTarefa}</strong></Typography>
                    </Box>
                  ))
              )
            )
          )
        )}
      </Box>
    </>
  )}
</TabPanel>



            
            </TabContext>
            </Box>

        </Box>
        </>
    );
};

export default FiltrosPlanejamento;