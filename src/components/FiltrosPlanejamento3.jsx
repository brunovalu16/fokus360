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


const FiltrosPlanejamento3 = ({ estrategicas, projetoSelecionado   }) => {
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

//buscar usuarios
      const [usuarios, setUsuarios] = useState([]);

      useEffect(() => {
        const fetchUsuarios = async () => {
          try {
            const querySnapshot = await getDocs(collection(dbFokus360, "usuarios"));
            const lista = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUsuarios(lista);
          } catch (error) {
            console.error("Erro ao buscar usuários:", error);
          }
        };
      
        fetchUsuarios();
      }, []);
      

     
//busca o projeto selecionado
      useEffect(() => {
        const fetchProjetoSelecionado = async () => {
          if (!projetoSelecionado) return;
      
          try {
            const docSnap = await getDocs(collection(db, "projetos"));
            const projetosFiltrados = docSnap.docs
              .filter((doc) => doc.id === projetoSelecionado)
              .map((doc) => ({ id: doc.id, ...doc.data() }));
      
            setTodosProjetos(projetosFiltrados);
          } catch (error) {
            console.error("Erro ao buscar projeto selecionado:", error);
          }
        };
      
        fetchProjetoSelecionado();
      }, [projetoSelecionado]);
      








      //buscar diretrizes e tarefas atrasadas do projeto
useEffect(() => {
  const buscarAtrasadasPorProjeto = async () => {
    console.log("📌 projetoSelecionado:", projetoSelecionado);
    if (!projetoSelecionado) return;

    try {
      const docRef = doc(dbFokus360, "projetos", projetoSelecionado);
      const docSnap = await getDocs(collection(dbFokus360, "projetos"));
      const projeto = docSnap.docs.find(d => d.id === projetoSelecionado)?.data();

      if (!projeto) {
        console.log("❌ Projeto não encontrado");
        return;
      }

      const est = [], tat = [], op = [], tar = [];

      (projeto.estrategicas || []).forEach((estrategica) => {
        if (isAtrasada(estrategica)) est.push(estrategica);

        (estrategica.taticas || []).forEach((tatica) => {
          if (isAtrasada(tatica)) tat.push(tatica);

          (tatica.operacionais || []).forEach((operacional) => {
            if (isAtrasada(operacional)) op.push(operacional);

            (operacional.tarefas || []).forEach((tarefa) => {
              if (isAtrasada(tarefa)) tar.push(tarefa);
            });
          });
        });
      });

      console.log(`✔ Totais encontrados -> Est: ${est.length} | Tat: ${tat.length} | Op: ${op.length} | Tar: ${tar.length}`);

      setEstrategicasAtrasadas(est);
      setTaticasAtrasadas(tat);
      setOperacionaisAtrasadas(op);
      setTarefasAtrasadas(tar);
    } catch (error) {
      console.error("❌ Erro ao buscar atrasadas:", error);
    }
  };

  buscarAtrasadasPorProjeto();
}, [projetoSelecionado]);





// E aqui a função isAtrasada com log interno:
const isAtrasada = (item) => {
  const status = item.status || "";
  const statusVisual = item.statusVisual || "";
  const time = item.time || "";
  const isConcluida = status === "concluida";

  if (isConcluida) return false;

  const regra1 = (statusVisual === "atrasada" && (status === "" || status === "atrasada"));
  const regra2 = time === "atrasada";

  return regra1 || regra2;
};







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





    
    return (
        <>
        <Box>

            {/**FILTROS */}
            
            
            <Box
                  sx={{
                    //border: "1px solid #9b9b9b",
                    borderRadius: "10px",
                    backgroundColor: "transparent",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    marginBottom: "30px",
                    marginLeft: "-25px",
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
                          //color: "#505050",
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
                        <Tab value="10" label="Responsáveis" onClick={() => setValue(value === "10" ? "" : "10")} />
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
  {todosProjetos
    .filter((projeto) => !projetoSelecionado || projeto.id === projetoSelecionado)
    .map((projeto, pIndex) => (

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

      {/* Estratégicas */}
      <Box display="flex" alignItems="center" mb={1}>
        <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#312783" }}>
          Estratégicas:
        </Typography>
      </Box>
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
      <Box display="flex" alignItems="center" mb={1} mt={2}>
        <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#00796b" }}>
          Táticas:
        </Typography>
      </Box>
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
      <Box display="flex" alignItems="center" mb={1} mt={2}>
        <DoubleArrowIcon sx={{ color: "#f30c0c", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#f30c0c" }}>
          Operacionais:
        </Typography>
      </Box>
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

      {/* Tarefas */}
      <Box display="flex" alignItems="center" mb={1} mt={2}>
        <DoubleArrowIcon sx={{ color: "#f57c00", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#f57c00" }}>
          Tarefas:
        </Typography>
      </Box>
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
  {projetoSelecionado && (
    <>
      {(() => {
        const projeto = todosProjetos.find(p => p.id === projetoSelecionado);
        return (
          <>
            <Typography variant="h6" sx={{ color: "#000", mb: 2 }}>
              📁 Projeto: <strong>{projeto?.nome || "Sem nome"}</strong>
            </Typography>

            {[
              {
                titulo: "Estratégicas",
                cor: "#312783",
                dados: estrategicasAtrasadas,
                prefixo: "est-atrasada",
              },
              {
                titulo: "Táticas",
                cor: "#00796b",
                dados: taticasAtrasadas,
                prefixo: "tat-atrasada",
              },
              {
                titulo: "Operacionais",
                cor: "#f44336",
                dados: operacionaisAtrasadas,
                prefixo: "op-atrasada",
              },
              {
                titulo: "Tarefas",
                cor: "#f57c00",
                dados: tarefasAtrasadas,
                prefixo: "tar-atrasada",
              },
            ].map(({ titulo, cor, dados, prefixo }, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <DoubleArrowIcon sx={{ color: cor, mr: 1 }} />
                  <Typography variant="h6" sx={{ color: cor }}>
                    {titulo}
                  </Typography>
                </Box>

                {dados.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ color: "#999", px: 2, fontStyle: "italic" }}
                  >
                    Nenhuma {titulo.toLowerCase()} atrasada encontrada para este projeto.
                  </Typography>
                ) : (
                  dados.map((item, i) => (
                    <Box
                      key={`${prefixo}-${i}`}
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
                        {item.tituloTarefa || item.titulo || "Sem título"}
                      </Typography>

                      <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>
                        |
                      </Typography>

                      <Typography variant="body2" sx={{ flex: 2 }}>
                        <strong>Responsáveis:</strong>{" "}
                        <span style={{ fontStyle: "italic", color: "#555" }}>
                          {(item.emails || []).join(", ")}
                        </span>
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            ))}
          </>
        );
      })()}
    </>
  )}
</TabPanel>








            































            
            
            
            
            
            
            
            
            
            
            
<TabPanel value="7">
  {projetoSelecionado && (() => {
    const projeto = todosProjetos.find(p => p.id === projetoSelecionado);
    if (!projeto) return null;

    const estrategicas = projeto.estrategicas?.filter(
      e => e.status === "concluida" && e.statusVisual === "atrasada"
    ) || [];

    const taticas = projeto.estrategicas?.flatMap(e =>
      (e.taticas || []).filter(
        t => t.status === "concluida" && t.statusVisual === "atrasada"
      )
    ) || [];

    const operacionais = projeto.estrategicas?.flatMap(e =>
      e.taticas?.flatMap(t =>
        (t.operacionais || []).filter(
          o => o.status === "concluida" && o.statusVisual === "atrasada"
        )
      )
    ) || [];

    const tarefas = projeto.estrategicas?.flatMap(e =>
      e.taticas?.flatMap(t =>
        t.operacionais?.flatMap(op =>
          (op.tarefas || []).filter(
            tar => tar.status === "concluida" && tar.statusVisual === "atrasada"
          )
        )
      )
    ) || [];

    const blocos = [
      {
        titulo: "Estratégicas",
        cor: "#312783",
        dados: estrategicas,
        getResponsaveis: (item) => (item.emails || []).join(", "),
        getTitulo: (item) => item.titulo || "Sem título",
        getInicio: (item) => item.criacao || "",
        getPrazo: (item) => item.finalizacao || "",
      },
      {
        titulo: "Táticas",
        cor: "#00796b",
        dados: taticas,
        getResponsaveis: (item) => (item.emails || []).join(", "),
        getTitulo: (item) => item.titulo || "Sem título",
        getInicio: (item) => item.criacao || "",
        getPrazo: (item) => item.finalizacao || "",
      },
      {
        titulo: "Operacionais",
        cor: "#f44336",
        dados: operacionais,
        getResponsaveis: (item) => (item.emails || []).join(", "),
        getTitulo: (item) => item.titulo || "Sem título",
        getInicio: (item) => item.criacao || "",
        getPrazo: (item) => item.finalizacao || "",
      },
      {
        titulo: "Tarefas",
        cor: "#f28e2b",
        dados: tarefas,
        getResponsaveis: (item) => {
          const quem = item?.planoDeAcao?.quemEmail;
          return Array.isArray(quem) ? quem.join(", ") : quem || "Nenhum responsável";
        },
        getTitulo: (item) => item.tituloTarefa || item.titulo || "Sem título",
        getInicio: (item) => item.criacao || "",
        getPrazo: (item) => item.finalizacao || "",
      },
    ];

    return blocos.map(({ titulo, cor, dados, getResponsaveis, getTitulo, getInicio, getPrazo }, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <DoubleArrowIcon sx={{ color: cor, mr: 1 }} />
          <Typography variant="h6" sx={{ color: cor }}>
            {titulo}
          </Typography>
        </Box>

        {dados.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#999", px: 2, fontStyle: "italic" }}>
            Nenhuma {titulo.toLowerCase()} concluída em atraso para este projeto.
          </Typography>
        ) : (
          dados.map((item, i) => (
            <Box
              key={`${titulo}-${i}`}
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
                {getTitulo(item)}
              </Typography>

              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

              <Typography variant="body2" sx={{ flex: 2 }}>
                <strong>Responsáveis:</strong>{" "}
                <span style={{ fontStyle: "italic", color: "#555" }}>
                  {getResponsaveis(item)}
                </span>
              </Typography>

              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TextField
                  label="Data início"
                  type="date"
                  size="small"
                  value={getInicio(item)}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
                <TextField
                  label="Prazo previsto"
                  type="date"
                  size="small"
                  value={getPrazo(item)}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
              </Box>
            </Box>
          ))
        )}
      </Box>
    ));
  })()}
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

  {areaSelecionada !== "" && projetoSelecionado && (() => {
    const projeto = todosProjetos.find(p => p.id === projetoSelecionado);
    if (!projeto) return null;

    const areaNomeSelecionada = areas.find(a => a.id === areaSelecionada)?.nome || "";

    const renderBloco = (titulo, cor, dados, tituloCampo, getResponsaveis) => (
      <Box sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <DoubleArrowIcon sx={{ color: cor, mr: 1 }} />
          <Typography variant="h6" sx={{ color: cor }}>
            {titulo}
          </Typography>
        </Box>
        {dados.length === 0 ? (
          <Typography sx={{ px: 2, fontStyle: "italic", color: "#888" }}>
            Nenhuma {titulo.toLowerCase()} encontrada para essa área.
          </Typography>
        ) : (
          dados.map((item, i) => (
            <Box
              key={`${titulo}-${i}`}
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
                {item[tituloCampo] || "-"}
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Typography variant="body2" sx={{ flex: 2 }}>
                <strong>Responsáveis:</strong>{" "}
                <span style={{ fontStyle: "italic", color: "#555" }}>
                  {getResponsaveis(item)}
                </span>
              </Typography>
            </Box>
          ))
        )}
      </Box>
    );

    const estrategicasFiltradas =
      projeto.estrategicas?.filter(e => e.areaNome === areaNomeSelecionada) || [];

    const taticasFiltradas =
      projeto.estrategicas?.flatMap(e =>
        e.taticas?.filter(t => t.areaNome === areaNomeSelecionada) || []
      ) || [];

    const operacionaisFiltradas =
      projeto.estrategicas?.flatMap(e =>
        e.taticas?.flatMap(t =>
          t.operacionais?.filter(op => op.areaNome === areaNomeSelecionada) || []
        ) || []
      ) || [];

    const tarefasFiltradas =
      projeto.estrategicas?.flatMap(e =>
        e.taticas?.flatMap(t =>
          t.operacionais?.flatMap(op =>
            op.tarefas?.filter(tar => tar.areaNome === areaNomeSelecionada) || []
          ) || []
        ) || []
      ) || [];

    return (
      <>
        {renderBloco(
          "Estratégicas",
          "#312783",
          estrategicasFiltradas,
          "titulo",
          item => (item.emails || []).join(", ") || "Nenhum"
        )}
        {renderBloco(
          "Táticas",
          "#00796b",
          taticasFiltradas,
          "titulo",
          item => (item.emails || []).join(", ") || "Nenhum"
        )}
        {renderBloco(
          "Operacionais",
          "#f44336",
          operacionaisFiltradas,
          "titulo",
          item => (item.emails || []).join(", ") || "Nenhum"
        )}
        {renderBloco(
          "Tarefas",
          "#f28e2b",
          tarefasFiltradas,
          "tituloTarefa",
          item => {
            const quem = item?.planoDeAcao?.quemEmail;
            return Array.isArray(quem) ? quem.join(", ") : quem || "Nenhum";
          }
        )}
      </>
    );
  })()}
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

  {unidadeSelecionada !== "" && projetoSelecionado && (() => {
    const projeto = todosProjetos.find(p => p.id === projetoSelecionado);
    if (!projeto) return null;

    const renderBloco = (titulo, cor, dados, tituloCampo, getResponsaveis) => (
      <Box sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <DoubleArrowIcon sx={{ color: cor, mr: 1 }} />
          <Typography variant="h6" sx={{ color: cor }}>
            {titulo}
          </Typography>
        </Box>
        {dados.map((item, i) => (
          <Box
            key={`${titulo}-${i}`}
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
              {item[tituloCampo] || "-"}
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Typography variant="body2" sx={{ flex: 2 }}>
              <strong>Responsáveis:</strong>{" "}
              <span style={{ fontStyle: "italic", color: "#555" }}>
                {getResponsaveis(item)}
              </span>
            </Typography>
          </Box>
        ))}
      </Box>
    );

    const estrategicasFiltradas =
      projeto.estrategicas?.filter(e => (e.unidades || []).includes(unidadeSelecionada)) || [];

    const taticasFiltradas =
      projeto.estrategicas?.flatMap(e =>
        e.taticas?.filter(t => (t.unidades || []).includes(unidadeSelecionada)) || []
      ) || [];

    const operacionaisFiltradas =
      projeto.estrategicas?.flatMap(e =>
        e.taticas?.flatMap(t =>
          t.operacionais?.filter(op => (op.unidades || []).includes(unidadeSelecionada)) || []
        ) || []
      ) || [];

    const tarefasFiltradas =
      projeto.estrategicas?.flatMap(e =>
        e.taticas?.flatMap(t =>
          t.operacionais?.flatMap(op =>
            op.tarefas?.filter(tar => (tar.unidades || []).includes(unidadeSelecionada)) || []
          ) || []
        ) || []
      ) || [];

    return (
      <>
        {renderBloco(
          "Estratégicas",
          "#312783",
          estrategicasFiltradas,
          "titulo",
          item => (item.emails || []).join(", ") || "Nenhum"
        )}
        {renderBloco(
          "Táticas",
          "#00796b",
          taticasFiltradas,
          "titulo",
          item => (item.emails || []).join(", ") || "Nenhum"
        )}
        {renderBloco(
          "Operacionais",
          "#f44336",
          operacionaisFiltradas,
          "titulo",
          item => (item.emails || []).join(", ") || "Nenhum"
        )}
        {renderBloco(
          "Tarefas",
          "#f28e2b",
          tarefasFiltradas,
          "tituloTarefa",
          item => {
            const quem = item?.planoDeAcao?.quemEmail;
            return Array.isArray(quem) ? quem.join(", ") : quem || "Nenhum";
          }
        )}
      </>
    );
  })()}
</TabPanel>

































<TabPanel value="10">
  {projetoSelecionado && (
    () => {
      const projeto = todosProjetos.find(p => p.id === projetoSelecionado);
      if (!projeto) return null;

      const blocos = [
        {
          titulo: "Estratégicas",
          cor: "#312783",
          dados: projeto.estrategicas || [],
          prefixo: "est-resp",
          getResponsaveis: (item) => (item.emails || []).join(", "),
          tituloCampo: "titulo",
        },
        {
          titulo: "Táticas",
          cor: "#00796b",
          dados: projeto.estrategicas?.flatMap(e => e.taticas || []) || [],
          prefixo: "tat-resp",
          getResponsaveis: (item) => (item.emails || []).join(", "),
          tituloCampo: "titulo",
        },
        {
          titulo: "Operacionais",
          cor: "#f44336",
          dados: projeto.estrategicas?.flatMap(e =>
            e.taticas?.flatMap(t => t.operacionais || []) || []
          ) || [],
          prefixo: "op-resp",
          getResponsaveis: (item) => (item.emails || []).join(", "),
          tituloCampo: "titulo",
        },
        {
          titulo: "Tarefas",
          cor: "#f28e2b",
          dados: projeto.estrategicas?.flatMap(e =>
            e.taticas?.flatMap(t =>
              t.operacionais?.flatMap(o =>
                o.tarefas?.map(tarefa => ({
                  ...tarefa,
                  responsavel: (() => {
                    const quemEmail = tarefa?.planoDeAcao?.quemEmail;
                    if (Array.isArray(quemEmail)) {
                      return quemEmail.join(", ") || "Nenhum";
                    } else if (typeof quemEmail === "string") {
                      return quemEmail || "Nenhum";
                    }
                    return "Nenhum";
                  })()
                })) || []
              ) || []
            ) || []
          ) || [],
          prefixo: "tarefa-resp",
          getResponsaveis: (item) => item.responsavel || "Nenhum",
          tituloCampo: "tituloTarefa",
        },
      ];

      return (
        <>
          {blocos.map(({ titulo, cor, dados, prefixo, getResponsaveis, tituloCampo }, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <DoubleArrowIcon sx={{ color: cor, mr: 1 }} />
                <Typography variant="h6" sx={{ color: cor }}>
                  {titulo}
                </Typography>
              </Box>

              {dados.map((item, i) => (
                <Box
                  key={`${prefixo}-${i}`}
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
                    {item[tituloCampo] || "-"}
                  </Typography>
                  <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>
                    |
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 2 }}>
                    <strong>Responsáveis:</strong>{" "}
                    <span style={{ fontStyle: "italic", color: "#555" }}>
                      {getResponsaveis(item)}
                    </span>
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </>
      );
    }
  )()}
</TabPanel>



















            
            </TabContext>
            </Box>

        </Box>
        </>
    );
};

export default FiltrosPlanejamento3;