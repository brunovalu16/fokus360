import React, { useRef, useState, useEffect  } from "react";
import { Box, Typography, CircularProgress, TextField  } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import FlagIcon from '@mui/icons-material/Flag';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";


import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BarChartIcon from "@mui/icons-material/BarChart";



import { getDocs, collection, doc, updateDoc  } from "firebase/firestore";
import { dbFokus360, storageFokus360  } from "../data/firebase-config"; // ajuste conforme seu path

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import FiltrosPlanejamento3 from "../components/FiltrosPlanejamento3";

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

  const [areaSelecionada, setAreaSelecionada] = useState("");


  const [areas, setAreas] = useState([]);

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



  const [unidades, setUnidades] = useState([]);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  
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
const GraficoResumoPorArea = ({ diretrizes = [] }) => {
  const configAreas = {
    COMERCIAL: {
      color: "#fa4f58",
      icon: <BusinessCenterIcon />,
      desc: "Diretrizes, táticas, operacionais e tarefas da área comercial.",
    },
    LOGÍSTICA: {
      color: "#4caf50",
      icon: <LocalShippingIcon />,
      desc: "Gestão de processos logísticos, distribuição e operação.",
    },
    "ADMIN/FINAN": {
      color: "#4254fb",
      icon: <AccountBalanceWalletIcon />,
      desc: "Atividades administrativas, financeiras e controle corporativo.",
    },
  };


  {/*=====================================CALCULO============================================== */}

const resumo = {};

const criarArea = (nome) => {
  const areaNome = nome || "SEM ÁREA";

  if (!resumo[areaNome]) {
    resumo[areaNome] = {
      areaNome,
      estrategicas: 0,
      taticas: 0,
      operacionais: 0,
      tarefas: 0,
      total: 0,
    };
  }

  return resumo[areaNome];
};

diretrizes.forEach((estrategica) => {
  const areaEst = criarArea(estrategica.areaNome);
  areaEst.estrategicas += 1;
  areaEst.total += 1;

  estrategica.taticas?.forEach((tatica) => {
    const areaTatNome = tatica.areaNome || estrategica.areaNome;
    const areaTat = criarArea(areaTatNome);
    areaTat.taticas += 1;
    areaTat.total += 1;

    tatica.operacionais?.forEach((operacional) => {
      const areaOpNome =
        operacional.areaNome || tatica.areaNome || estrategica.areaNome;

      const areaOp = criarArea(areaOpNome);
      areaOp.operacionais += 1;
      areaOp.total += 1;

      operacional.tarefas?.forEach((tarefa) => {
        const areaTarefaNome =
          tarefa.areaNome ||
          operacional.areaNome ||
          tatica.areaNome ||
          estrategica.areaNome;

        const areaTar = criarArea(areaTarefaNome);

        areaTar.tarefas += 1;
        areaTar.total += 1;
      });
    });
  });
});

const dados = Object.values(resumo).filter((area) => area.total > 0);

const totalGeral = dados.reduce((acc, area) => acc + area.total, 0);

const semicirculo = dados.map((area) => {
  const cfg = configAreas[area.areaNome] || {
    color: "#7b2cff",
    icon: <BarChartIcon />,
    desc: "Itens sem área definida.",
  };

  const percent =
    totalGeral > 0 ? Math.round((area.total / totalGeral) * 100) : 0;

  return {
    ...area,
    ...cfg,
    percent,
  };
});

{/*============================================================================================ */}
const totalEstrategicasGrafico = dados.reduce((acc, area) => acc + area.estrategicas, 0);
const totalTaticasGrafico = dados.reduce((acc, area) => acc + area.taticas, 0);
const totalOperacionaisGrafico = dados.reduce((acc, area) => acc + area.operacionais, 0);
const totalTarefasGrafico = dados.reduce((acc, area) => acc + area.tarefas, 0);

const graficoNiveis = [
  { nome: "Estratégicas", total: totalEstrategicasGrafico, color: "#ff3f8e" },
  { nome: "Táticas", total: totalTaticasGrafico, color: "#63bd00" },
  { nome: "Operacionais", total: totalOperacionaisGrafico, color: "#009fe3" },
  { nome: "Tarefas", total: totalTarefasGrafico, color: "#ffb000" },
].filter((item) => item.total > 0);

const totalGrafico = graficoNiveis.reduce((acc, item) => acc + item.total, 0);

const [tooltip, setTooltip] = useState(null);


  return (
    <Box
      sx={{
        width: "100%",
        background: "#fff",
        borderRadius: "28px",
        p: { xs: 2, md: 4 },
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
        border: "1px solid #eef1f7",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: { xs: "22px", md: "30px" },
            fontWeight: 900,
            color: "#09003f",
          }}
        >
          Resumo Executivo por Área
        </Typography>

        <Typography sx={{ fontSize: "13px", color: "#526079" }}>
          Distribuição das diretrizes, táticas, operacionais e tarefas por área responsável
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.35fr 0.9fr" },
          gap: 4,
          alignItems: "center",
        }}
      >


        {/*=====================================grafico matriz===================================================== */}
<Box
  sx={{
    width: "440px",
    minWidth: "440px",
    maxWidth: "440px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1.5,
    position: "relative",
    overflow: "visible",
    flexShrink: 0,
  }}
>
  {tooltip && (
    <Box
      sx={{
        position: "absolute",
        top: tooltip.y,
        left: tooltip.x,
        transform: "translate(14px, -50%)",
        background: "#fff",
        borderRadius: "14px",
        p: 1.4,
        minWidth: 170,
        zIndex: 999,
        boxShadow: "0 14px 35px rgba(15,23,42,0.18)",
        border: `1px solid ${tooltip.color}`,
        pointerEvents: "none",
      }}
    >
      <Typography sx={{ fontSize: "12px", fontWeight: 900, color: tooltip.color, mb: 0.8 }}>
        {tooltip.title}
      </Typography>

      {tooltip.items.map((item) => (
        <Box
          key={item.label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #eef1f7",
            py: 0.35,
          }}
        >
          <Typography sx={{ fontSize: "10px", color: "#667085" }}>
            {item.label}
          </Typography>

          <Typography sx={{ fontSize: "10px", fontWeight: 900, color: tooltip.color }}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  )}

  {/* ÁREAS */}
  <Box
    sx={{
      width: "440px",
      display: "grid",
      gridTemplateColumns: "130px 280px",
      alignItems: "center",
      gap: "30px",
    }}
  >
    <Box sx={{ width: "130px", display: "flex", flexDirection: "column", gap: 0.8 }}>
      {semicirculo.map((area) => (
        <Box
          key={area.areaNome}
          sx={{
            display: "grid",
            gridTemplateColumns: "10px 1fr 20px",
            alignItems: "center",
            gap: 0.7,
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: area.color }} />
          <Typography sx={{ fontSize: "9px", color: "#667085", whiteSpace: "nowrap" }}>
            {area.areaNome}
          </Typography>
          <Typography sx={{ fontSize: "10px", fontWeight: 900, color: area.color, textAlign: "right" }}>
            {area.total}
          </Typography>
        </Box>
      ))}
    </Box>

    <Box
      sx={{
        position: "relative",
        width: "280px",
        height: "280px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 320 320" width="280" height="280">
        {(() => {
          const cx = 160;
          const cy = 160;
          const outerR = 150;
          const innerR = 74;
          let startAngle = -90;

          const polarToCartesian = (angle, radius) => {
            const rad = (angle * Math.PI) / 180;
            return {
              x: cx + radius * Math.cos(rad),
              y: cy + radius * Math.sin(rad),
            };
          };

          const createSlice = (start, end) => {
            const startOuter = polarToCartesian(start, outerR);
            const endOuter = polarToCartesian(end, outerR);
            const startInner = polarToCartesian(start, innerR);
            const endInner = polarToCartesian(end, innerR);
            const largeArcFlag = end - start > 180 ? 1 : 0;

            return `
              M ${startOuter.x} ${startOuter.y}
              A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
              L ${endInner.x} ${endInner.y}
              A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}
              Z
            `;
          };

          return semicirculo.map((area) => {
            const sliceAngle = totalGeral > 0 ? (area.total / totalGeral) * 360 : 0;
            const endAngle = startAngle + sliceAngle;
            const path = createSlice(startAngle, endAngle);

            const midAngle = startAngle + sliceAngle / 2;
            const labelRadius = 94;
            const label = polarToCartesian(midAngle, labelRadius);

            startAngle = endAngle;

            return (
              <g key={area.areaNome}>
                <path
                  d={path}
                  fill={area.color}
                  style={{ cursor: "pointer", transition: "0.2s" }}
                  onMouseEnter={(e) =>
                    setTooltip({
                      x: e.nativeEvent.offsetX + 160,
                      y: e.nativeEvent.offsetY,
                      color: area.color,
                      title: area.areaNome,
                      items: [
                        { label: "Estratégicas", value: area.estrategicas },
                        { label: "Táticas", value: area.taticas },
                        { label: "Operacionais", value: area.operacionais },
                        { label: "Tarefas", value: area.tarefas },
                        { label: "Total", value: area.total },
                      ],
                    })
                  }
                  onMouseMove={(e) =>
                    setTooltip((prev) =>
                      prev
                        ? { ...prev, x: e.nativeEvent.offsetX + 160, y: e.nativeEvent.offsetY }
                        : prev
                    )
                  }
                  onMouseLeave={() => setTooltip(null)}
                />

                <text
                  x={label.x}
                  y={label.y}
                  fill="#fff"
                  fontSize="12"
                  fontWeight="900"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="Arial"
                >
                  {area.total}
                </text>
              </g>
            );
          });
        })()}

        <circle cx="160" cy="160" r="74" fill="#fff" />
      </svg>

      <Box
        sx={{
          position: "absolute",
          width: 95,
          height: 95,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: "15px", fontWeight: 900, color: "#5f6368", lineHeight: 1 }}>
          ÁREAS
        </Typography>

        <Typography sx={{ fontSize: "18px", fontWeight: 900, color: "#5f6368", lineHeight: 1 }}>
          {totalGeral}
        </Typography>

        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#8b8b8b", mt: 0.3 }}>
          TOTAL DE ITENS
        </Typography>
      </Box>
    </Box>
  </Box>

  {/* DIRETRIZES */}
  <Box
    sx={{
      width: "440px",
      display: "grid",
      gridTemplateColumns: "130px 230px",
      alignItems: "center",
      gap: "30px",
      mt: -1,
    }}
  >
    <Box sx={{ width: "130px", display: "flex", flexDirection: "column", gap: 0.8 }}>
      {[
        ["Estratégicas", totalEstrategicasGrafico, "#ff3f8e"],
        ["Táticas", totalTaticasGrafico, "#63bd00"],
        ["Operacionais", totalOperacionaisGrafico, "#009fe3"],
        ["Tarefas", totalTarefasGrafico, "#ffb000"],
      ].map(([label, value, color]) => (
        <Box
          key={label}
          sx={{
            display: "grid",
            gridTemplateColumns: "10px 1fr 20px",
            alignItems: "center",
            gap: 0.7,
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
          <Typography sx={{ fontSize: "9px", color: "#667085", whiteSpace: "nowrap" }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: "10px", fontWeight: 900, color, textAlign: "right" }}>
            {value}
          </Typography>
        </Box>
      ))}
    </Box>

    <Box
      sx={{
        position: "relative",
        width: "230px",
        height: "230px",
        mt: -1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 320 320" width="230" height="230">
        {(() => {
          const cx = 160;
          const cy = 160;
          const outerR = 135;
          const innerR = 82;
          let startAngle = -90;

          const polarToCartesian = (angle, radius) => {
            const rad = (angle * Math.PI) / 180;
            return {
              x: cx + radius * Math.cos(rad),
              y: cy + radius * Math.sin(rad),
            };
          };

          const createSlice = (start, end) => {
            const startOuter = polarToCartesian(start, outerR);
            const endOuter = polarToCartesian(end, outerR);
            const startInner = polarToCartesian(start, innerR);
            const endInner = polarToCartesian(end, innerR);
            const largeArcFlag = end - start > 180 ? 1 : 0;

            return `
              M ${startOuter.x} ${startOuter.y}
              A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
              L ${endInner.x} ${endInner.y}
              A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}
              Z
            `;
          };

          return graficoNiveis.map((item) => {
            const sliceAngle = totalGrafico > 0 ? (item.total / totalGrafico) * 360 : 0;
            const endAngle = startAngle + sliceAngle;
            const path = createSlice(startAngle, endAngle);

            const midAngle = startAngle + sliceAngle / 2;
            const labelRadius = 109;
            const label = polarToCartesian(midAngle, labelRadius);

            startAngle = endAngle;

            return (
              <g key={item.nome}>
                <path
                  d={path}
                  fill={item.color}
                  style={{ cursor: "pointer", transition: "0.2s" }}
                  onMouseEnter={(e) =>
                    setTooltip({
                      x: e.nativeEvent.offsetX + 160,
                      y: e.nativeEvent.offsetY + 285,
                      color: item.color,
                      title: item.nome,
                      items: [
                        { label: "Quantidade", value: item.total },
                        {
                          label: "Participação",
                          value: `${totalGrafico > 0 ? Math.round((item.total / totalGrafico) * 100) : 0}%`,
                        },
                      ],
                    })
                  }
                  onMouseMove={(e) =>
                    setTooltip((prev) =>
                      prev
                        ? { ...prev, x: e.nativeEvent.offsetX + 160, y: e.nativeEvent.offsetY + 285 }
                        : prev
                    )
                  }
                  onMouseLeave={() => setTooltip(null)}
                />

                <text
                  x={label.x}
                  y={label.y}
                  fill="#fff"
                  fontSize="12"
                  fontWeight="900"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="Arial"
                >
                  {item.total}
                </text>
              </g>
            );
          });
        })()}

        <circle cx="160" cy="160" r="82" fill="#fff" />
      </svg>

      <Box
        sx={{
          position: "absolute",
          width: 92,
          height: 92,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: "11px", fontWeight: 900, color: "#5f6368", lineHeight: 1 }}>
          DIRETRIZES
        </Typography>

        <Typography sx={{ fontSize: "22px", fontWeight: 900, color: "#5f6368", lineHeight: 1 }}>
          {totalGrafico}
        </Typography>

        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#8b8b8b", mt: 0.3 }}>
          TOTAL GERAL
        </Typography>
      </Box>
    </Box>
  </Box>
</Box>


 {/*============================================================================================= */}


        {/*======================================CAIXAS LATERAIS==================================== */}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: "-40px" }}>
  {dados.map((area) => {
    const cfg = configAreas[area.areaNome] || {
      color: "#7b2cff",
      icon: <BarChartIcon />,
      desc: "Itens sem área definida.",
    };

    const percent =
      totalGeral > 0 ? Math.round((area.total / totalGeral) * 100) : 0;

    return (
      <Box
        key={area.areaNome}
        sx={{
          position: "relative",
          borderRadius: "16px",
          border: "1px solid #e8ecf4",
          background: "#fff",
          p: 3.5,
          pl: 3,
          boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
          marginLeft: "-150px",
          marginRight: "110px",
          overflow: "hidden",

          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            width: "10px",
            height: "100%",
            background: cfg.color,
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "46px 1fr 42px",
            gap: 1.2,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              background: cfg.color,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 10px 18px ${cfg.color}40`,
              "& svg": { fontSize: 22 },
            }}
          >
            {cfg.icon}
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 900,
                color: cfg.color,
                lineHeight: 1,
              }}
            >
              {area.areaNome}
            </Typography>

            <Typography
              sx={{
                fontSize: "13px",
                color: "#667085",
                lineHeight: 1.25,
                mt: 0.3,
              }}
            >
              {cfg.desc}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#09003f",
                lineHeight: 1,
              }}
            >
              {area.total}
            </Typography>

            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 800,
                color: cfg.color,
              }}
            >
              {percent}%
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 1.2,
            pt: 1,
            borderTop: "1px solid #edf0f5",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            textAlign: "center",
          }}
        >
          {[
            ["Estratégicas", area.estrategicas],
            ["Táticas", area.taticas],
            ["Operacionais", area.operacionais],
            ["Tarefas", area.tarefas],
          ].map(([label, value], idx) => (
            <Box
              key={label}
              sx={{
                borderRight: idx < 3 ? "1px solid #e1e5ee" : "none",
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 900,
                  color: cfg.color,
                  lineHeight: 1,
                }}
              >
                {value}
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#667085",
                  mt: 0.2,
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  })}
</Box>


        {/*========================================================================================== */}
      </Box>
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



//Função para trocar o banner
const handleTrocarBanner = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    // 1) Enviar para Storage
    const storageRef = ref(storageFokus360, `banners/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    // 2) Atualizar Firestore (projeto)
    const projetoId = projetoData?.id; // 🔥 Importante: você precisa passar o ID do projeto no `projetoData`
    if (!projetoId) {
      alert("ID do projeto não encontrado!");
      return;
    }

    const projetoRef = doc(dbFokus360, "projetos", projetoId);
    await updateDoc(projetoRef, { bannerUrl: downloadUrl });

    alert("Banner atualizado com sucesso! Atualize a página para ver a mudança.");
  } catch (error) {
    console.error("❌ Erro ao trocar banner:", error.message);
    alert(`Erro ao trocar banner: ${error.message}`);
  }
  
};

















  return (
    <>


    {/* Header mostrando o Banner do Projeto */}
    <Box 
  sx={{
    marginTop: "10px",
    width: "100%",
    maxWidth: "1200px",
    marginX: "auto",
    overflow: "hidden",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    position: "relative", // 👈 importante para posicionar botão
  }}
>
  {projetoData?.bannerUrl ? (
    <img
      src={projetoData.bannerUrl}
      alt="Banner do Projeto"
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        objectFit: "cover",
      }}
    />
  ) : (
    <Box
      sx={{
        width: "100%",
        height: "200px",
        backgroundColor: "#e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Nenhum Banner Disponível
      </Typography>
    </Box>
  )}

  {/* Botão de trocar banner */}
  <label htmlFor="upload-new-banner">
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "transparent",
        color: "#fff",
        padding: "2px 6px",
        borderRadius: "4px",
        border: "1px solid #fff",
        cursor: "pointer",
        fontSize: "10px",
        minHeight: "22px",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }}  
    >
      Trocar Banner
    </Box>
  </label>
  <input
    type="file"
    accept="image/*"
    id="upload-new-banner"
    style={{ display: "none" }}
    onChange={handleTrocarBanner}
  />
</Box>




    <Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap="8px"
        paddingTop="50px"
        paddingBottom="20px"
        borderRadius="20px"
        sx={{
          width: "100%",
          overflowX: "auto", // muda de hidden para auto
          maxWidth: "100vw", // impede estouro
          boxSizing: "border-box",
        }}
      >
        {items.map((item, index) => (
          <Box
            key={index}
            boxShadow={3}
            borderRadius="20px"
            bgcolor={
              item.subtitle === "Orçamento"
                ? "#98998e" // ✅ Agora fundo cinza para "Orçamento"
                : item.subtitle === "Valor gasto"
                ? definirCorValorGasto()
                : "transparent" // ✅ Se quiser neutro no caso de outros
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
              minHeight: "80px",
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
<Box sx={{ mt: 4, mb: 4, width: "100%" }}>
  <GraficoResumoPorArea diretrizes={diretrizes} />
</Box>

<FiltrosPlanejamento3 projetoSelecionado={projetoData?.id} />


</Box>
</>
  );
};

export default DadosProjeto2;
