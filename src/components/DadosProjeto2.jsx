import React, { useRef, useState, useEffect  } from "react";
import { Box, Typography, CircularProgress, TextField  } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import FlagIcon from '@mui/icons-material/Flag';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

import { getDocs, collection } from "firebase/firestore";
import { dbFokus360 } from "../data/firebase-config"; // ajuste conforme seu path


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


// IMPORTS
import { PieChart } from '@mui/x-charts/PieChart'; // ✅ importante! precisa ter esse pacote instalado


import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';




const DadosProjeto2 = ({
  orcamento,
  valorGasto,
  estrategicas,
  totalDiretrizes,
  tarefasConcluidas,
  totalTarefas,
  diretrizes,
  dataInicio,
  prazoPrevisto,
  projetoData
}) => {


  const [titulosDiretrizes, setTitulosDiretrizes] = React.useState({
    estrategicas: [],
    taticas: [],
    operacionais: [],
  });

  //para os campos de datas
  const [formValues, setFormValues] = useState({
    dataInicio: "",
    prazoPrevisto: "",
  });
  
  
  
  //Essa parte pertence ao painel de filtros 
  const [value, setValue] = React.useState("");
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // ajuste a velocidade aqui
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  // FIM Essa parte pertence ao painel de filtros 




  // 1) Função para calcular progresso de Valor Gasto vs. Orçamento
  const calcularProgressoValorGasto = () => {
    const orcamentoNum = orcamento
      ? parseFloat(orcamento.replace("R$", "").replace(/\./g, "").replace(",", "."))
      : 0;
  
    let gastoNum = 0;
  
    if (Array.isArray(estrategicas)) {
      estrategicas.forEach((estrategica) => {
        estrategica.taticas?.forEach((tatica) => {
          tatica.operacionais?.forEach((operacional) => {
            operacional.tarefas?.forEach((tarefa) => {
              const valorRaw = tarefa?.planoDeAcao?.valor || "R$ 0,00";
              const valorTarefa = parseFloat(
                valorRaw.replace("R$", "").replace(/\./g, "").replace(",", ".")
              );
              gastoNum += valorTarefa;
            });
          });
        });
      });
    }
  
    if (orcamentoNum === 0) return 0;
    return (gastoNum / orcamentoNum) * 100;
  };
  

  const totalEstr = countAllDiretrizes(diretrizes);
  const totalTat = countAllTaticas(diretrizes);
  const totalOp = countAllOperacionais(diretrizes);
  const totalTar = countAllTarefas(diretrizes);

  const conclEstr = countDiretrizesConcluidas(diretrizes);
  const conclTat = countTaticasConcluidas(diretrizes);
  const conclOp = countOperacionaisConcluidos(diretrizes);
  const conclTar = countTarefasConcluidas(diretrizes);


  const calcularValorGastoTotal = () => {
    let total = 0;
  
    estrategicas?.forEach((estrategica) => {
      estrategica.taticas?.forEach((tatica) => {
        tatica.operacionais?.forEach((operacional) => {
          operacional.tarefas?.forEach((tarefa) => {
            const valor = tarefa?.planoDeAcao?.valor || "";
            if (typeof valor === "string") {
              const valorNum = parseFloat(
                valor.replace("R$", "").replace(/\./g, "").replace(",", ".")
              );
              if (!isNaN(valorNum)) {
                total += valorNum;
              }
            }
          });
        });
      });
    });
  
    return total;
  };
  
  
  
  // 2) Define cor dinâmica para “Valor Gasto”
  const definirCorValorGasto = () => {
    const progresso = calcularProgressoValorGasto();
  
    if (progresso > 100) {
      return "#f44336"; // Vermelho se passou do orçamento
    } else if (progresso === 100) {
      return "#0048ff"; // Azul se bateu exatamente o orçamento
    } else if (progresso >= 70) {
      return "#ffb600"; // Amarelo se ≥ 70% do orçamento
    } else {
      return "#4caf50"; // Verde se < 70% do orçamento
    }
  };
  

  // Função para calcular o total de tarefas concluídas
  const calcularTotalTarefasConcluidas = (diretrizes) => {
    return diretrizes.reduce((acc, diretriz) => {
      return (
        acc +
        (diretriz.tarefas?.filter((tarefa) => tarefa.progresso === 100).length || 0)
      );
    }, 0);
  };

  const totalTarefasConcluidas = calcularTotalTarefasConcluidas(diretrizes || []);

  // Criar Função para Calcular o Progresso Geral de cada diretriz
  const calcularProgressoGeral = (diretrizIndex) => {
    const diretriz = diretrizes[diretrizIndex];
  
    // Verifica se diretriz existe e se tem tarefas antes de acessar `.length`
    if (!diretriz || !Array.isArray(diretriz.tarefas) || diretriz.tarefas.length === 0) {
      return 0; // Retorna 0 se não houver diretriz ou tarefas
    }
  
    const progressoTotal = diretriz.tarefas.reduce((acc, tarefa) => {
      return acc + (tarefa.progresso || 0);
    }, 0);
  
    return Math.round(progressoTotal / diretriz.tarefas.length);
  };
  

  const items = [
    // 1) Orçamento (cor fixa)
    {
      title: orcamento,
      subtitle: "Orçamento",
      icon: <PaidIcon sx={{ color: "#fff", fontSize: "50px" }} />,
      bgColor: "#312783",
      customIndicator: (
        <Box
          sx={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
          }}
        />
      ),
    },
    // 2) Valor Gasto (cor dinâmica)
    {
      title: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(calcularValorGastoTotal()),
      subtitle: "Valor gasto",    
      icon: <PaidIcon sx={{ color: "#fff", fontSize: "50px" }} />,
      progressColor: definirCorValorGasto(),
      customIndicator: (
        <Box
          sx={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: definirCorValorGasto(),
          }}
        />
      ),
    },
  
  ];

 




  // --------------
// 1) Contagem simples (quantas existem?)
// --------------
function countAllDiretrizes(diretrizes = []) {
  // Cada item do array "diretrizes" é, por definição, uma Diretriz Estratégica
  return diretrizes.length;
}

function countAllTaticas(diretrizes = []) {
  let total = 0;
  for (const diretriz of diretrizes) {
    total += diretriz.taticas?.length || 0;
  }
  return total;
}

function countAllOperacionais(diretrizes = []) {
  let total = 0;
  for (const diretriz of diretrizes) {
    for (const tatica of diretriz.taticas || []) {
      total += tatica.operacionais?.length || 0;
    }
  }
  return total;
}

function countAllTarefas(diretrizes = []) {
  let total = 0;
  for (const diretriz of diretrizes) {
    for (const tatica of diretriz.taticas || []) {
      for (const operacional of tatica.operacionais || []) {
        total += operacional.tarefas?.length || 0;
      }
    }
  }
  return total;
}

// --------------
// 2) Funções auxiliares para checar se
//    Tática/Operacional está concluída
// --------------
function isOperacionalConcluido(operacional) {
  // Se não tem tarefas => não concluído
  if (!operacional.tarefas || operacional.tarefas.length === 0) return false;
  
  // Se tiver tarefas, todas precisam estar concluídas
  for (const tarefa of operacional.tarefas) {
    if (!tarefa?.checkboxState?.concluida) {
      return false;
    }
  }
  return true;
}


function isTaticaConcluida(tatica) {
  // Uma Tática é concluída somente se TODAS as operacionais estiverem concluídas
  if (!tatica.operacionais?.length) return false;
  for (const operacional of tatica.operacionais) {
    if (!isOperacionalConcluido(operacional)) {
      return false;
    }
  }
  return true;
}

function isDiretrizConcluida(diretriz) {
  // Uma Diretriz Estratégica é concluída somente se TODAS as táticas estiverem concluídas
  if (!diretriz.taticas?.length) return false;
  for (const tatica of diretriz.taticas) {
    if (!isTaticaConcluida(tatica)) {
      return false;
    }
  }
  return true;
}

// --------------
// 3) Contagem de concluídos
// --------------
function countDiretrizesConcluidas(diretrizes = []) {
  let count = 0;
  for (const diretriz of diretrizes) {
    if (isDiretrizConcluida(diretriz)) {
      count++;
    }
  }
  return count;
}

function countTaticasConcluidas(diretrizes = []) {
  let count = 0;
  for (const diretriz of diretrizes) {
    for (const tatica of diretriz.taticas || []) {
      if (isTaticaConcluida(tatica)) {
        count++;
      }
    }
  }
  return count;
}

function countOperacionaisConcluidos(diretrizes = []) {
  let count = 0;
  for (const diretriz of diretrizes) {
    for (const tatica of diretriz.taticas || []) {
      for (const operacional of tatica.operacionais || []) {
        if (isOperacionalConcluido(operacional)) {
          count++;
        }
      }
    }
  }
  return count;
}

function countTarefasConcluidas(diretrizes = []) {
  let count = 0;
  for (const diretriz of diretrizes) {
    for (const tatica of diretriz.taticas || []) {
      for (const operacional of tatica.operacionais || []) {
        for (const tarefa of operacional.tarefas || []) {
          if (tarefa?.checkboxState?.concluida) {
            count++;
          }
        }
      }
    }
  }
  return count;
}


function countConcluidas(estrategicas = [], nivel) {
  let count = 0;

  estrategicas.forEach(est => {
    if (nivel === "estrategica" && est.status === "concluida") count++;

    est.taticas?.forEach(tat => {
      if (nivel === "tatica" && tat.status === "concluida") count++;

      tat.operacionais?.forEach(op => {
        if (nivel === "operacional" && op.status === "concluida") count++;

        op.tarefas?.forEach(tarefa => {
          if (nivel === "tarefa" && tarefa.status === "concluida") count++;
        });
      });
    });
  });

  return count;
}






// COMPONENTE FORA DA FUNÇÃO PRINCIPAL (COMPONENTE DOS GRAFICOS)
const GraficoStatusDonut = ({ tipo, diretrizes, estrategicas }) => {
  let data = [];

  if (tipo === "total") {
    data = [
      { label: "Estratégicas", value: diretrizes?.length || 0 },
      { label: "Táticas", value: countAllTaticas(diretrizes), color: "#4caf50" },
      { label: "Operacionais", value: countAllOperacionais(diretrizes) },
      { label: "Tarefas", value: countAllTarefas(diretrizes), color: "#f28e2b" },
    ];
  } else if (tipo === "concluidas") {
    data = [
      { label: "Estratégicas", value: countConcluidas(estrategicas, "estrategica") },
      { label: "Táticas", value: countConcluidas(estrategicas, "tatica"), color: "#4caf50" },
      { label: "Operacionais", value: countConcluidas(estrategicas, "operacional") },
      { label: "Tarefas", value: countConcluidas(estrategicas, "tarefa"), color: "#f28e2b" },
    ];
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
       >

      {/* Lista ao lado do gráfico */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
        {data.map((item, index) => (
          <Typography
            key={index}
            sx={{
              color: "#000",
              fontSize: "10px",
              whiteSpace: "nowrap", // impede quebra de linha
            }}
          >
            {tipo === "total"
              ? `Total de ${item.label}: ${item.value}`
              : `${item.label} concluídas: ${item.value}`}
          </Typography>
        ))}
      </Box>

      {/* Donut Chart */}
      <PieChart
        series={[{ data, innerRadius: 50 }]}
        width={200}
        height={200}
        legend={{
          direction: "row",
          position: { vertical: "bottom", horizontal: "middle" },
        }}
      />
    </Box>
  );
};



//Função para buscar dados do Firestore
const buscarTitulosDasDiretrizes = async () => {
  try {
    const querySnapshot = await getDocs(collection(dbFokus360, "projetos"));
    const projetos = querySnapshot.docs.map((doc) => doc.data());

    const estrategicas = [];
    const taticas = [];
    const operacionais = [];

    projetos.forEach((projeto) => {
      projeto.estrategicas?.forEach((estrategica) => {
        if (estrategica.titulo) estrategicas.push(estrategica.titulo);

        estrategica.taticas?.forEach((tatica) => {
          if (tatica.titulo) taticas.push(tatica.titulo);

          tatica.operacionais?.forEach((operacional) => {
            if (operacional.titulo) operacionais.push(operacional.titulo);
          });
        });
      });
    });

    setTitulosDiretrizes({ estrategicas, taticas, operacionais });
  } catch (error) {
    console.error("Erro ao buscar diretrizes:", error);
  }
};


React.useEffect(() => {
  buscarTitulosDasDiretrizes();
}, []);



//preenche as datas
useEffect(() => {
  if (projetoData) {
    setFormValues((prev) => ({
      ...prev,
      dataInicio: projetoData.dataInicio || "",
      prazoPrevisto: projetoData.prazoPrevisto || "",
    }));
  }
}, [projetoData]);





















  return (
    <Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap="8px"
        paddingBottom="20px"
        paddingTop="20px"
        borderRadius="20px"
        sx={{
          overflowX: "hidden",
        }}
      >
        {items.map((item, index) => (
          <Box
            key={index}
            boxShadow={3}
            borderRadius="20px"
            bgcolor={
              item.subtitle === "Orçamento"
                ? item.bgColor
                : item.subtitle === "Valor gasto"
                ? definirCorValorGasto()
                : "#312783"
            }
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            padding="10px"
            minWidth="200px"
            sx={{
              textAlign: "center",
              overflow: "hidden",
              minHeight: "140px",
              flexShrink: 0,
              maxWidth: "100%",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                minWidth: "50px",
                height: "50px",
              }}
            >
              {item.icon}
            </Box>

            

            <Box
              sx={{
                width: "2px",
                height: "80%",
                backgroundColor: "#ffffff4d",
                margin: "0 10px",
              }}
            />

            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              sx={{
                flex: 1,
                textAlign: "center",
                marginLeft: "10px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontSize: "15px",
                  whiteSpace: "pre-line",
                  textJustify: "inter-word",
                  textAlign: "left",
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#fff",
                  fontSize: "13px",
                  textJustify: "inter-word",
                  textAlign: "left",
                }}
              >
                {item.subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>


      {/* GRÁFICO 1 - Totais */}
      <Box
  sx={{
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap", // quebra em telas pequenas
    marginTop: 4,
    width: "100%",
  }}
>
  {/* GRÁFICO 1 - Total */}
  <Box
    sx={{
      flex: 1,
      minWidth: "300px",
      maxWidth: "48%",
      padding: 2,
      borderRadius: "20px",
      marginBottom: "30px",
      //backgroundColor: "#fff", // opcional: manter um fundo visível
    }}
  >
    <GraficoStatusDonut tipo="total" diretrizes={diretrizes} />
  </Box>

  {/* GRÁFICO 2 - Concluídos */}
  <Box
    sx={{
      flex: 1,
      minWidth: "300px",
      maxWidth: "48%",
      padding: 2,
      borderRadius: "20px",
      marginBottom: "30px",
      //backgroundColor: "#fff",
    }}
  >
    <GraficoStatusDonut tipo="concluidas" estrategicas={estrategicas} />
  </Box>
</Box>















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
          </TabList>
        </Box>

        <TabPanel value="1">
          {/* Estratégicas */}
          <Box sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
              <Typography variant="h6" sx={{ color: "#312783" }}>
                Estratégicas
              </Typography>
            </Box>
            {estrategicas?.map((estrategica, i) => (
              <Box
                key={`est-${i}`}
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
                    value={projetoData?.dataInicio || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                  <TextField
                    label="Prazo previsto"
                    type="date"
                    size="small"
                    value={projetoData?.prazoPrevisto || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          {/* Táticas */}
          <Box sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
              <Typography variant="h6" sx={{ color: "#00796b" }}>
                Táticas
              </Typography>
            </Box>
            {estrategicas?.flatMap((estrategica, estIndex) =>
              estrategica.taticas?.map((tatica, i) => (
                <Box
                  key={`tat-${estIndex}-${i}`}
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

                  <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <TextField
                      label="Data início"
                      type="date"
                      size="small"
                      value={projetoData?.dataInicio || ""}
                      InputLabelProps={{ shrink: true }}
                      disabled
                      sx={{ minWidth: "100px", maxWidth: "120px" }}
                    />
                    <TextField
                      label="Prazo previsto"
                      type="date"
                      size="small"
                      value={projetoData?.prazoPrevisto || ""}
                      InputLabelProps={{ shrink: true }}
                      disabled
                      sx={{ minWidth: "100px", maxWidth: "120px" }}
                    />
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Operacionais */}
          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              <DoubleArrowIcon sx={{ color: "#ff9800", mr: 1 }} />
              <Typography variant="h6" sx={{ color: "#ff9800" }}>
                Operacionais
              </Typography>
            </Box>
            {estrategicas?.flatMap((estrategica, estIndex) =>
              estrategica.taticas?.flatMap((tatica, tatIndex) =>
                tatica.operacionais?.map((op, i) => (
                  <Box
                    key={`op-${estIndex}-${tatIndex}-${i}`}
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

                    <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <TextField
                      label="Data início"
                      type="date"
                      size="small"
                      value={projetoData?.dataInicio || ""}
                      InputLabelProps={{ shrink: true }}
                      disabled
                      sx={{ minWidth: "100px", maxWidth: "120px" }}
                    />
                    <TextField
                      label="Prazo previsto"
                      type="date"
                      size="small"
                      value={projetoData?.prazoPrevisto || ""}
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
        </TabPanel>
          


        <TabPanel value="2">
  {/* Tarefas */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#6a1b9a", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#6a1b9a" }}>
        Tarefas
      </Typography>
    </Box>

    {projetoData?.estrategicas?.flatMap((estrategica, estIndex) =>
      estrategica.taticas?.flatMap((tatica, tatIndex) =>
        tatica.operacionais?.flatMap((operacional, opIndex) =>
          operacional.tarefas?.map((tarefa, i) => {
            const responsaveis = tarefa?.planoDeAcao?.quemEmail
              ? Array.isArray(tarefa.planoDeAcao.quemEmail)
                ? tarefa.planoDeAcao.quemEmail.join(", ")
                : tarefa.planoDeAcao.quemEmail
              : "Nenhum responsável";



            return (
              <Box
                key={`tarefa-${estIndex}-${tatIndex}-${opIndex}-${i}`}
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


                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <TextField
                    label="Data início"
                    type="date"
                    size="small"
                    value={projetoData?.dataInicio || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                  <TextField
                    label="Prazo previsto"
                    type="date"
                    size="small"
                    value={projetoData?.prazoPrevisto || ""}
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
</TabPanel>




<TabPanel value="3">
  {/* Não Iniciadas */}
  <Box sx={{ mb: 2 }}>
    {/* Estratégicas */}
    <Box sx={{ mb: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#312783" }}>
          Estratégicas
        </Typography>
      </Box>
      {projetoData?.estrategicas
        ?.filter((e) => e.statusVisual === "nao_iniciada")
        .map((estrategica, i) => (
          <Box
            key={`nao-est-${i}`}
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
              {estrategica.titulo || "-"}
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Typography variant="body2" sx={{ flex: 2 }}>
              <strong>Responsáveis:</strong>{" "}
              <span style={{ fontStyle: "italic", color: "#555" }}>
                {(estrategica.emails || []).join(", ") || "Nenhum responsável"}
              </span>
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Data início"
                type="date"
                size="small"
                value={projetoData?.dataInicio || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
              <TextField
                label="Prazo previsto"
                type="date"
                size="small"
                value={projetoData?.prazoPrevisto || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
            </Box>
          </Box>
        ))}
    </Box>

    {/* Táticas */}
    <Box sx={{ mb: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#00796b" }}>
          Táticas
        </Typography>
      </Box>
      {projetoData?.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas
          ?.filter((tatica) => tatica.statusVisual === "nao_iniciada")
          .map((tatica, i) => (
            <Box
              key={`nao-tat-${estIndex}-${i}`}
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
                {tatica.titulo || "-"}
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Typography variant="body2" sx={{ flex: 2 }}>
                <strong>Responsáveis:</strong>{" "}
                <span style={{ fontStyle: "italic", color: "#555" }}>
                  {(tatica.emails || []).join(", ") || "Nenhum responsável"}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TextField
                  label="Data início"
                  type="date"
                  size="small"
                  value={projetoData?.dataInicio || ""}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
                <TextField
                  label="Prazo previsto"
                  type="date"
                  size="small"
                  value={projetoData?.prazoPrevisto || ""}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  sx={{ minWidth: "100px", maxWidth: "120px" }}
                />
              </Box>
            </Box>
          ))
      )}
    </Box>

    {/* Operacionais */}
    <Box sx={{ mb: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <DoubleArrowIcon sx={{ color: "#ff9800", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#ff9800" }}>
          Operacionais
        </Typography>
      </Box>
      {projetoData?.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas?.flatMap((tatica, tatIndex) =>
          tatica.operacionais
            ?.filter((op) => op.statusVisual === "nao_iniciada")
            .map((op, i) => (
              <Box
                key={`nao-op-${estIndex}-${tatIndex}-${i}`}
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
                  {op.titulo || "-"}
                </Typography>
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Typography variant="body2" sx={{ flex: 2 }}>
                  <strong>Responsáveis:</strong>{" "}
                  <span style={{ fontStyle: "italic", color: "#555" }}>
                    {(op.emails || []).join(", ") || "Nenhum responsável"}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <TextField
                    label="Data início"
                    type="date"
                    size="small"
                    value={projetoData?.dataInicio || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                  <TextField
                    label="Prazo previsto"
                    type="date"
                    size="small"
                    value={projetoData?.prazoPrevisto || ""}
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

    {/* Tarefas */}
    <Box>
      <Box display="flex" alignItems="center" mb={1}>
        <DoubleArrowIcon sx={{ color: "#6a1b9a", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#6a1b9a" }}>
          Tarefas
        </Typography>
      </Box>
      {projetoData?.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas?.flatMap((tatica, tatIndex) =>
          tatica.operacionais?.flatMap((op, opIndex) =>
            op.tarefas
              ?.filter((tarefa) => tarefa.statusVisual === "nao_iniciada")
              .map((tarefa, i) => {
                const responsaveis = tarefa?.planoDeAcao?.quemEmail
                  ? Array.isArray(tarefa.planoDeAcao.quemEmail)
                    ? tarefa.planoDeAcao.quemEmail.join(", ")
                    : tarefa.planoDeAcao.quemEmail
                  : "Nenhum responsável";

                return (
                  <Box
                    key={`nao-tarefa-${estIndex}-${tatIndex}-${opIndex}-${i}`}
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
                    <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <TextField
                        label="Data início"
                        type="date"
                        size="small"
                        value={projetoData?.dataInicio || ""}
                        InputLabelProps={{ shrink: true }}
                        disabled
                        sx={{ minWidth: "100px", maxWidth: "120px" }}
                      />
                      <TextField
                        label="Prazo previsto"
                        type="date"
                        size="small"
                        value={projetoData?.prazoPrevisto || ""}
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
  </Box>
</TabPanel>





<TabPanel value="4">
  <Box sx={{ mb: 2 }}>

    {/* Estratégicas */}
    <Box sx={{ mb: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#312783" }}>
          Estratégicas
        </Typography>
      </Box>
      {projetoData?.estrategicas
        ?.filter((e) => e.status === "andamento")
        .map((estrategica, i) => (
          <Box
            key={`and-est-${i}`}
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
              {estrategica.titulo || "-"}
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Typography variant="body2" sx={{ flex: 2 }}>
              <strong>Responsáveis:</strong>{" "}
              <span style={{ fontStyle: "italic", color: "#555" }}>
                {(estrategica.emails || []).join(", ") || "Nenhum responsável"}
              </span>
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField label="Data início" type="date" size="small"
                value={projetoData?.dataInicio || ""} InputLabelProps={{ shrink: true }}
                disabled sx={{ minWidth: "100px", maxWidth: "120px" }} />
              <TextField label="Prazo previsto" type="date" size="small"
                value={projetoData?.prazoPrevisto || ""} InputLabelProps={{ shrink: true }}
                disabled sx={{ minWidth: "100px", maxWidth: "120px" }} />
            </Box>
          </Box>
        ))}
    </Box>

    {/* Táticas */}
    <Box sx={{ mb: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#00796b" }}>
          Táticas
        </Typography>
      </Box>
      {projetoData?.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas
          ?.filter((tatica) => tatica.status === "andamento")
          .map((tatica, i) => (
            <Box
              key={`and-tat-${estIndex}-${i}`}
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
                {tatica.titulo || "-"}
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Typography variant="body2" sx={{ flex: 2 }}>
                <strong>Responsáveis:</strong>{" "}
                <span style={{ fontStyle: "italic", color: "#555" }}>
                  {(tatica.emails || []).join(", ") || "Nenhum responsável"}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <TextField label="Data início" type="date" size="small"
                  value={projetoData?.dataInicio || ""} InputLabelProps={{ shrink: true }}
                  disabled sx={{ minWidth: "100px", maxWidth: "120px" }} />
                <TextField label="Prazo previsto" type="date" size="small"
                  value={projetoData?.prazoPrevisto || ""} InputLabelProps={{ shrink: true }}
                  disabled sx={{ minWidth: "100px", maxWidth: "120px" }} />
              </Box>
            </Box>
          ))
      )}
    </Box>

    {/* Operacionais */}
    <Box sx={{ mb: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <DoubleArrowIcon sx={{ color: "#ff9800", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#ff9800" }}>
          Operacionais
        </Typography>
      </Box>
      {projetoData?.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas?.flatMap((tatica, tatIndex) =>
          tatica.operacionais
            ?.filter((op) => op.status === "andamento")
            .map((op, i) => (
              <Box
                key={`and-op-${estIndex}-${tatIndex}-${i}`}
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
                  {op.titulo || "-"}
                </Typography>
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Typography variant="body2" sx={{ flex: 2 }}>
                  <strong>Responsáveis:</strong>{" "}
                  <span style={{ fontStyle: "italic", color: "#555" }}>
                    {(op.emails || []).join(", ") || "Nenhum responsável"}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <TextField label="Data início" type="date" size="small"
                    value={projetoData?.dataInicio || ""} InputLabelProps={{ shrink: true }}
                    disabled sx={{ minWidth: "100px", maxWidth: "120px" }} />
                  <TextField label="Prazo previsto" type="date" size="small"
                    value={projetoData?.prazoPrevisto || ""} InputLabelProps={{ shrink: true }}
                    disabled sx={{ minWidth: "100px", maxWidth: "120px" }} />
                </Box>
              </Box>
            ))
        )
      )}
    </Box>

    {/* Tarefas */}
    <Box>
      <Box display="flex" alignItems="center" mb={1}>
        <DoubleArrowIcon sx={{ color: "#6a1b9a", mr: 1 }} />
        <Typography variant="h6" sx={{ color: "#6a1b9a" }}>
          Tarefas
        </Typography>
      </Box>
      {projetoData?.estrategicas?.flatMap((estrategica, estIndex) =>
        estrategica.taticas?.flatMap((tatica, tatIndex) =>
          tatica.operacionais?.flatMap((op, opIndex) =>
            op.tarefas
              ?.filter((tarefa) => tarefa.status === "andamento")
              .map((tarefa, i) => {
                const responsaveis = tarefa?.planoDeAcao?.quemEmail
                  ? Array.isArray(tarefa.planoDeAcao.quemEmail)
                    ? tarefa.planoDeAcao.quemEmail.join(", ")
                    : tarefa.planoDeAcao.quemEmail
                  : "Nenhum responsável";

                return (
                  <Box
                    key={`and-tarefa-${estIndex}-${tatIndex}-${opIndex}-${i}`}
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
                    <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <TextField label="Data início" type="date" size="small"
                        value={projetoData?.dataInicio || ""} InputLabelProps={{ shrink: true }}
                        disabled sx={{ minWidth: "100px", maxWidth: "120px" }} />
                      <TextField label="Prazo previsto" type="date" size="small"
                        value={projetoData?.prazoPrevisto || ""} InputLabelProps={{ shrink: true }}
                        disabled sx={{ minWidth: "100px", maxWidth: "120px" }} />
                    </Box>
                  </Box>
                );
              })
          )
        )
      )}
    </Box>
  </Box>
</TabPanel>


<TabPanel value="5">
  {/* Estratégicas Concluídas */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#312783", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#312783" }}>
        Estratégicas
      </Typography>
    </Box>
    {estrategicas?.filter(e => e.status === "concluida").map((estrategica, i) => (
      <Box
        key={`est-conc-${i}`}
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
            {(estrategica.emails || []).join(", ") || "Nenhum responsável"}
          </span>
        </Typography>
        <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <TextField
            label="Data início"
            type="date"
            size="small"
            value={projetoData?.dataInicio || ""}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{ minWidth: "100px", maxWidth: "120px" }}
          />
          <TextField
            label="Prazo previsto"
            type="date"
            size="small"
            value={projetoData?.prazoPrevisto || ""}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{ minWidth: "100px", maxWidth: "120px" }}
          />
        </Box>
      </Box>
    ))}
  </Box>

  {/* Táticas Concluídas */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#00796b", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#00796b" }}>
        Táticas
      </Typography>
    </Box>
    {estrategicas?.flatMap((estrategica, estIndex) =>
      estrategica.taticas?.filter(t => t.status === "concluida").map((tatica, i) => (
        <Box
          key={`tat-conc-${estIndex}-${i}`}
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
              {(tatica.emails || []).join(", ") || "Nenhum responsável"}
            </span>
          </Typography>
          <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <TextField
              label="Data início"
              type="date"
              size="small"
              value={projetoData?.dataInicio || ""}
              InputLabelProps={{ shrink: true }}
              disabled
              sx={{ minWidth: "100px", maxWidth: "120px" }}
            />
            <TextField
              label="Prazo previsto"
              type="date"
              size="small"
              value={projetoData?.prazoPrevisto || ""}
              InputLabelProps={{ shrink: true }}
              disabled
              sx={{ minWidth: "100px", maxWidth: "120px" }}
            />
          </Box>
        </Box>
      ))
    )}
  </Box>

  {/* Operacionais Concluídas */}
  <Box sx={{ mb: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#ff9800", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#ff9800" }}>
        Operacionais
      </Typography>
    </Box>
    {estrategicas?.flatMap((estrategica, estIndex) =>
      estrategica.taticas?.flatMap((tatica, tatIndex) =>
        tatica.operacionais?.filter(op => op.status === "concluida").map((op, i) => (
          <Box
            key={`op-conc-${estIndex}-${tatIndex}-${i}`}
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
                {(op.emails || []).join(", ") || "Nenhum responsável"}
              </span>
            </Typography>
            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Data início"
                type="date"
                size="small"
                value={projetoData?.dataInicio || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
              <TextField
                label="Prazo previsto"
                type="date"
                size="small"
                value={projetoData?.prazoPrevisto || ""}
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

  {/* Tarefas Concluídas */}
  <Box sx={{ mt: 2 }}>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#6a1b9a", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#6a1b9a" }}>
        Tarefas
      </Typography>
    </Box>
    {estrategicas?.flatMap((estrategica, estIndex) =>
      estrategica.taticas?.flatMap((tatica, tatIndex) =>
        tatica.operacionais?.flatMap((op, opIndex) =>
          op.tarefas?.filter(t => t.status === "concluida").map((tarefa, i) => {
            const responsaveis = Array.isArray(tarefa?.planoDeAcao?.quemEmail)
              ? tarefa.planoDeAcao.quemEmail.join(", ")
              : tarefa?.planoDeAcao?.quemEmail || "Nenhum responsável";

            return (
              <Box
                key={`tarefa-conc-${estIndex}-${tatIndex}-${opIndex}-${i}`}
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
                <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <TextField
                    label="Data início"
                    type="date"
                    size="small"
                    value={projetoData?.dataInicio || ""}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    sx={{ minWidth: "100px", maxWidth: "120px" }}
                  />
                  <TextField
                    label="Prazo previsto"
                    type="date"
                    size="small"
                    value={projetoData?.prazoPrevisto || ""}
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
    {estrategicas?.filter(e => e.statusVisual === "atrasada").map((estrategica, i) => (
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

        <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <TextField
            label="Data início"
            type="date"
            size="small"
            value={projetoData?.dataInicio || ""}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{ minWidth: "100px", maxWidth: "120px" }}
          />
          <TextField
            label="Prazo previsto"
            type="date"
            size="small"
            value={projetoData?.prazoPrevisto || ""}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{ minWidth: "100px", maxWidth: "120px" }}
          />
        </Box>
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
    {estrategicas?.flatMap((estrategica, estIndex) =>
      estrategica.taticas?.filter(t => t.statusVisual === "atrasada").map((tatica, i) => (
        <Box
          key={`tat-atrasada-${estIndex}-${i}`}
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

          <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <TextField
              label="Data início"
              type="date"
              size="small"
              value={projetoData?.dataInicio || ""}
              InputLabelProps={{ shrink: true }}
              disabled
              sx={{ minWidth: "100px", maxWidth: "120px" }}
            />
            <TextField
              label="Prazo previsto"
              type="date"
              size="small"
              value={projetoData?.prazoPrevisto || ""}
              InputLabelProps={{ shrink: true }}
              disabled
              sx={{ minWidth: "100px", maxWidth: "120px" }}
            />
          </Box>
        </Box>
      ))
    )}
  </Box>

  {/* Operacionais Atrasadas */}
  <Box>
    <Box display="flex" alignItems="center" mb={1}>
      <DoubleArrowIcon sx={{ color: "#ff9800", mr: 1 }} />
      <Typography variant="h6" sx={{ color: "#ff9800" }}>
        Operacionais
      </Typography>
    </Box>
    {estrategicas?.flatMap((estrategica, estIndex) =>
      estrategica.taticas?.flatMap((tatica, tatIndex) =>
        tatica.operacionais?.filter(op => op.statusVisual === "atrasada").map((op, i) => (
          <Box
            key={`op-atrasada-${estIndex}-${tatIndex}-${i}`}
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

            <Typography variant="body2" sx={{ mx: 1, color: "#888" }}>|</Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField
                label="Data início"
                type="date"
                size="small"
                value={projetoData?.dataInicio || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: "100px", maxWidth: "120px" }}
              />
              <TextField
                label="Prazo previsto"
                type="date"
                size="small"
                value={projetoData?.prazoPrevisto || ""}
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
</TabPanel>

        </TabContext>
      </Box>




</Box>
  );
};

export default DadosProjeto2;
