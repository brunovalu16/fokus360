import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BarChartIcon from "@mui/icons-material/BarChart";
import { getDocs, collection } from "firebase/firestore";
import { dbFokus360 } from "../data/firebase-config";

const GraficosDiretrizes = () => {
  const [diretrizesGlobais, setDiretrizesGlobais] = useState([]);
  const [subareasGlobais, setSubareasGlobais] = useState([]);
  const [quantidadeProjetos, setQuantidadeProjetos] = useState(0);
  const [tooltip, setTooltip] = useState(null);

  const configAreas = {
    COMERCIAL: {
      color: "#fa4f58",
      icon: <BusinessCenterIcon />,
      desc: "Diretrizes, táticas, operacionais e tarefas da área comercial.",
    },
    LOGÍSTICA: {
      color: "#00c48c",
      icon: <LocalShippingIcon />,
      desc: "Gestão de processos logísticos, distribuição e operação.",
    },
    "ADM/FINAN": {
      color: "#4254fb",
      icon: <AccountBalanceWalletIcon />,
      desc: "Atividades administrativas, financeiras e controle corporativo.",
    },
  };

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const projetosSnapshot = await getDocs(
          collection(dbFokus360, "projetos")
        );

        const projetos = projetosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const todasEstrategicas = projetos.flatMap(
          (projeto) => projeto.estrategicas || []
        );

        setQuantidadeProjetos(projetos.length);
        setDiretrizesGlobais(todasEstrategicas);

        const areasSnapshot = await getDocs(collection(dbFokus360, "areas"));

        const areasList = areasSnapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome || "",
          subareas: doc.data().subareas || [],
        }));

        const todasSubareas = areasList.flatMap((area) =>
          (area.subareas || []).map((subarea, index) => ({
            id: `${area.id}-${index}`,
            nome: subarea,
            areaId: area.id,
            areaNome: area.nome,
          }))
        );

        setSubareasGlobais(todasSubareas);
      } catch (error) {
        console.error("Erro ao buscar dados dos gráficos:", error);
      }
    };

    buscarDados();
  }, []);

  const normalizarArea = (nome) => {
    if (!nome) return "SEM ÁREA";
    if (nome === "ADMIN/FINAN") return "ADM/FINAN";
    if (nome.includes("ADM/FINAN, COMERCIAL")) return null;
    return nome;
  };

  const {
    semicirculo,
    totalGeral,
    graficoNiveis,
    totalGrafico,
    cardsSubareas,
  } = useMemo(() => {
    const resumoAreas = {};
    const resumoSubareas = {};

    const criarArea = (nome) => {
      const areaNome = normalizarArea(nome);

      if (!areaNome) return null;

      if (!resumoAreas[areaNome]) {
        resumoAreas[areaNome] = {
          areaNome,
          estrategicas: 0,
          taticas: 0,
          operacionais: 0,
          tarefas: 0,
          total: 0,
        };
      }

      return resumoAreas[areaNome];
    };

    const criarSubarea = (subareaId) => {
      if (!subareaId) return null;

      const subareaEncontrada = subareasGlobais.find(
        (sub) => sub.id === subareaId
      );

      const nomeSubarea = subareaEncontrada?.nome || subareaId;
      const areaNome = subareaEncontrada?.areaNome || "SEM ÁREA";

      if (!resumoSubareas[subareaId]) {
        resumoSubareas[subareaId] = {
          id: subareaId,
          nome: nomeSubarea,
          areaNome,
          estrategicas: 0,
          taticas: 0,
          operacionais: 0,
          tarefas: 0,
          total: 0,
          color: "#7b2cff",
          icon: <BarChartIcon />,
          desc: `Subárea vinculada à área ${areaNome}.`,
        };
      }

      return resumoSubareas[subareaId];
    };

    diretrizesGlobais.forEach((estrategica) => {
      const areasDaEstrategica =
        Array.isArray(estrategica.areaNomes) &&
        estrategica.areaNomes.length > 0
          ? estrategica.areaNomes
          : [estrategica.areaNome];

      areasDaEstrategica.forEach((nomeArea) => {
        const areaEst = criarArea(nomeArea);
        if (!areaEst) return;

        areaEst.estrategicas += 1;
        areaEst.total += 1;
      });

      (estrategica.subareas || []).forEach((subareaId) => {
        const subEst = criarSubarea(subareaId);
        if (!subEst) return;

        subEst.estrategicas += 1;
        subEst.total += 1;
      });

      (estrategica.taticas || []).forEach((tatica) => {
        const areaTat = criarArea(tatica.areaNome || estrategica.areaNome);
        if (areaTat) {
          areaTat.taticas += 1;
          areaTat.total += 1;
        }

        (tatica.subareas || []).forEach((subareaId) => {
          const subTat = criarSubarea(subareaId);
          if (!subTat) return;

          subTat.taticas += 1;
          subTat.total += 1;
        });

        (tatica.operacionais || []).forEach((operacional) => {
          const areaOp = criarArea(
            operacional.areaNome || tatica.areaNome || estrategica.areaNome
          );

          if (areaOp) {
            areaOp.operacionais += 1;
            areaOp.total += 1;
          }

          (operacional.subareas || []).forEach((subareaId) => {
            const subOp = criarSubarea(subareaId);
            if (!subOp) return;

            subOp.operacionais += 1;
            subOp.total += 1;
          });

          (operacional.tarefas || []).forEach((tarefa) => {
            const areaTar = criarArea(
              tarefa.areaNome ||
                operacional.areaNome ||
                tatica.areaNome ||
                estrategica.areaNome
            );

            if (areaTar) {
              areaTar.tarefas += 1;
              areaTar.total += 1;
            }

            (operacional.subareas || []).forEach((subareaId) => {
              const subTar = criarSubarea(subareaId);
              if (!subTar) return;

              subTar.tarefas += 1;
              subTar.total += 1;
            });
          });
        });
      });
    });

    const dadosAreas = Object.values(resumoAreas).filter(
      (area) => area.total > 0
    );

    const totalGeral = dadosAreas.reduce((acc, area) => acc + area.total, 0);

    const semicirculo = dadosAreas.map((area) => {
      const cfg = configAreas[area.areaNome] || {
        color: "#7b2cff",
        icon: <BarChartIcon />,
        desc: "Itens sem área definida.",
      };

      return {
        ...area,
        ...cfg,
        percent:
          totalGeral > 0 ? Math.round((area.total / totalGeral) * 100) : 0,
      };
    });

    const totalEstrategicasGrafico = dadosAreas.reduce(
      (acc, area) => acc + area.estrategicas,
      0
    );

    const totalTaticasGrafico = dadosAreas.reduce(
      (acc, area) => acc + area.taticas,
      0
    );

    const totalOperacionaisGrafico = dadosAreas.reduce(
      (acc, area) => acc + area.operacionais,
      0
    );

    const totalTarefasGrafico = dadosAreas.reduce(
      (acc, area) => acc + area.tarefas,
      0
    );

    const graficoNiveis = [
      {
        nome: "Estratégicas",
        total: totalEstrategicasGrafico,
        color: "#5B8DEF",
      },
      {
        nome: "Táticas",
        total: totalTaticasGrafico,
        color: "#00C48C",
      },
      {
        nome: "Operacionais",
        total: totalOperacionaisGrafico,
        color: "#7B61FF",
      },
      {
        nome: "Tarefas",
        total: totalTarefasGrafico,
        color: "#FF9F43",
      },
    ].filter((item) => item.total > 0);

    const totalGrafico = graficoNiveis.reduce(
      (acc, item) => acc + item.total,
      0
    );

    const cardsSubareas = Object.values(resumoSubareas).filter(
      (subarea) => subarea.total > 0
    );

    return {
      semicirculo,
      totalGeral,
      graficoNiveis,
      totalGrafico,
      cardsSubareas,
    };
  }, [diretrizesGlobais, subareasGlobais]);

  const renderDonut = ({
    data,
    total,
    width = 260,
    height = 260,
    outerR = 120,
    innerR = 60,
    labelRadius = 95,
  }) => (
    <svg viewBox="0 0 320 320" width={width} height={height}>
      {(() => {
        const cx = 160;
        const cy = 160;
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

        return data.map((item) => {
          const valor = item.total;
          const sliceAngle = total > 0 ? (valor / total) * 360 : 0;
          const endAngle = startAngle + sliceAngle;
          const path = createSlice(startAngle, endAngle);

          const midAngle = startAngle + sliceAngle / 2;
          const label = polarToCartesian(midAngle, labelRadius);

          startAngle = endAngle;

          return (
            <g key={item.id || item.areaNome || item.nome}>
              <path
                d={path}
                fill={item.color}
                style={{ cursor: "pointer", transition: "0.2s" }}
                onMouseEnter={(e) =>
                  setTooltip({
                    x: e.clientX,
                    y: e.clientY,
                    color: item.color,
                    title: item.areaNome || item.nome,
                    items:
                      item.estrategicas !== undefined
                        ? [
                            {
                              label: "Estratégicas",
                              value: item.estrategicas,
                            },
                            { label: "Táticas", value: item.taticas },
                            {
                              label: "Operacionais",
                              value: item.operacionais,
                            },
                            { label: "Tarefas", value: item.tarefas },
                            { label: "Total", value: item.total },
                          ]
                        : [
                            { label: "Quantidade", value: item.total },
                            {
                              label: "Participação",
                              value: `${
                                total > 0
                                  ? Math.round((item.total / total) * 100)
                                  : 0
                              }%`,
                            },
                          ],
                  })
                }
                onMouseMove={(e) =>
                  setTooltip((prev) =>
                    prev
                      ? {
                          ...prev,
                          x: e.clientX,
                          y: e.clientY,
                        }
                      : prev
                  )
                }
                onMouseLeave={() => setTooltip(null)}
              />

              <text
                x={label.x}
                y={label.y}
                fill="#fff"
                fontSize="11"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Arial"
              >
                {valor}
              </text>
            </g>
          );
        });
      })()}
    </svg>
  );

  const renderCardResumo = (item, tipo = "area") => (
    <Box
      key={item.id || item.areaNome}
      sx={{
        minWidth: 0,
        position: "relative",
        borderRadius: "16px",
        border: "1px solid #e8ecf4",
        background: "#fff",
        p: 1,
        pl: 1.6,
        minHeight: 108,
        boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
        overflow: "hidden",
        boxSizing: "border-box",

        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          width: "8px",
          height: "100%",
          background: item.color,
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "34px minmax(0, 1fr) 42px",
          gap: 0.8,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: "8px",
            background: item.color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 14px ${item.color}40`,
            "& svg": { fontSize: 19 },
          }}
        >
          {item.icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 900,
              color: item.color,
              lineHeight: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {tipo === "subarea" ? item.nome : item.areaNome}
          </Typography>

          <Typography
            sx={{
              fontSize: "9px",
              color: "#667085",
              lineHeight: 1.2,
              mt: 0.35,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.desc}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 900,
              color: "#09003f",
              lineHeight: 1,
            }}
          >
            {item.total}
          </Typography>

          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: 800,
              color: item.color,
            }}
          >
            {tipo === "subarea" ? "SUB" : `${item.percent}%`}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 0.9,
          pt: 0.8,
          borderTop: "1px solid #edf0f5",
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          textAlign: "center",
        }}
      >
        {[
          ["Estratégicas", item.estrategicas],
          ["Táticas", item.taticas],
          ["Operacionais", item.operacionais],
          ["Tarefas", item.tarefas],
        ].map(([label, value], idx) => (
          <Box
            key={label}
            sx={{
              borderRight: idx < 3 ? "1px solid #e1e5ee" : "none",
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: "9px",
                fontWeight: 900,
                color: item.color,
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>

            <Typography
              sx={{
                fontSize: "9px",
                color: "#667085",
                mt: 0.25,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        background: "#fff",
        borderRadius: "28px",
        p: { xs: 2, md: 3 },
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
        border: "1px solid #eef1f7",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {tooltip && (
        <Box
          sx={{
            position: "fixed",
            top: tooltip.y + 12,
            left: tooltip.x + 12,
            background: "#fff",
            borderRadius: "14px",
            p: 1.4,
            minWidth: 170,
            zIndex: 9999,
            boxShadow: "0 14px 35px rgba(15,23,42,0.18)",
            border: `1px solid ${tooltip.color}`,
            pointerEvents: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 900,
              color: tooltip.color,
              mb: 0.8,
            }}
          >
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
                gap: 2,
              }}
            >
              <Typography sx={{ fontSize: "10px", color: "#667085" }}>
                {item.label}
              </Typography>

              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 900,
                  color: tooltip.color,
                }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: { xs: "22px", md: "28px" },
            fontWeight: 900,
            color: "#2d2c7e",
          }}
        >
          Resumo Executivo Global
        </Typography>

        <Typography sx={{ fontSize: "13px", color: "#2d2c7e" }}>
          Visão geral das diretrizes, áreas, subáreas e tarefas de todos os
          projetos do sistema
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
          width: "100%",
          mb: 3,
        }}
      >
        <Box
          sx={{
            borderRadius: "22px",
            border: "1px solid #eef1f7",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            p: 2,
            minHeight: 315,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 900,
              color: "#2d2c7e",
              mb: 1,
            }}
          >
            Distribuição por Área
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.7 }}>
              {semicirculo.map((area) => (
                <Box
                  key={area.areaNome}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "8px 1fr 28px",
                    alignItems: "center",
                    gap: 0.7,
                  }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: area.color,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "9px",
                      color: "#667085",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {area.areaNome}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 900,
                      color: area.color,
                      textAlign: "right",
                    }}
                  >
                    {area.total}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                position: "relative",
                width: "260px",
                height: "260px",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {renderDonut({
                data: semicirculo,
                total: totalGeral,
                width: 260,
                height: 260,
                outerR: 120,
                innerR: 48,
                labelRadius: 94,
              })}

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
                  boxShadow: "inset 0 0 0 1px #eef1f7",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 900,
                    color: "#5f6368",
                    lineHeight: 1,
                  }}
                >
                  ÁREAS
                </Typography>

                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 900,
                    color: "#5f6368",
                    lineHeight: 1,
                  }}
                >
                  {totalGeral}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#8b8b8b",
                    mt: 0.3,
                  }}
                >
                  TOTAL DE ITENS
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            borderRadius: "22px",
            border: "1px solid #eef1f7",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            p: 2,
            minHeight: 315,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 900,
              color: "#2d2c7e",
              mb: 1,
            }}
          >
            Distribuição por Diretrizes
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.9 }}>
              {graficoNiveis.map((item) => (
                <Box
                  key={item.nome}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "8px 1fr 28px",
                    alignItems: "center",
                    gap: 0.7,
                  }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: item.color,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "9px",
                      color: "#667085",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.nome}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 900,
                      color: item.color,
                      textAlign: "right",
                    }}
                  >
                    {item.total}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                position: "relative",
                width: "250px",
                height: "250px",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {renderDonut({
                data: graficoNiveis,
                total: totalGrafico,
                width: 250,
                height: 250,
                outerR: 118,
                innerR: 78,
                labelRadius: 105,
              })}

              <Box
                sx={{
                  position: "absolute",
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  boxShadow: "inset 0 0 0 1px #eef1f7",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 900,
                    color: "#5f6368",
                    lineHeight: 1,
                  }}
                >
                  DIRETRIZES
                </Typography>

                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 900,
                    color: "#5f6368",
                    lineHeight: 1,
                  }}
                >
                  {totalGrafico}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#8b8b8b",
                    mt: 0.3,
                  }}
                >
                  TOTAL GERAL
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1.4,
          width: "100%",
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            borderRadius: "16px",
            border: "1px solid #e8ecf4",
            background: "#fff",
            p: 1.4,
            minHeight: 108,
            boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
            boxSizing: "border-box",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 900,
              color: "#2d2c7e",
            }}
          >
            TOTAL DE PROJETOS
          </Typography>

          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 900,
              color: "#09003f",
              lineHeight: 1,
              mt: 0.5,
            }}
          >
            {quantidadeProjetos}
          </Typography>

          <Typography
            sx={{
              fontSize: "10px",
              color: "#667085",
              mt: 0.7,
            }}
          >
            Projetos cadastrados no sistema
          </Typography>
        </Box>

        {semicirculo.map((area) => renderCardResumo(area, "area"))}

        {cardsSubareas.map((subarea) =>
          renderCardResumo(subarea, "subarea")
        )}
      </Box>
    </Box>
  );
};

export default GraficosDiretrizes;