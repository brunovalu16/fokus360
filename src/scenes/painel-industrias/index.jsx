import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, Divider, Chip, Paper, Stack } from "@mui/material";
import { Header } from "../../components";
import { Link } from "react-router-dom";

import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FactoryIcon from "@mui/icons-material/Factory";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const roleToLabelMap = {
  "37": "Ajinomoto",
  "38": "AB Mauri",
  "39": "Adoralle",
  "40": "Bettanin",
  "41": "Mars Choco",
  "42": "Mars Pet",
  "43": "M.Dias",
  "44": "SCJhonson",
  "45": "UAU Ingleza",
  "46": "Danone",
  "47": "Ypê",
  "48": "Adoralle",
  "49": "Fini",
  "50": "Heinz",
  "51": "Red Bull",
};

const rolesComAcessoCompleto = [
  "01", "02", "03", "04", "05", "06", "08", "09", "10", "11",
  "19", "20", "21", "25", "26", "27", "34", "35", "36",
];

const rolesQueEscondemBotaoVoltar = [
  "37", "38", "39", "40", "41", "42", "43", "44",
  "45", "46", "47", "48", "49", "50", "51",
];

const industryColors = {
  Ajinomoto: "#dc2626",
  "AB Mauri": "#7c3aed",
  Adoralle: "#f97316",
  Bettanin: "#2563eb",
  "Mars Choco": "#92400e",
  "Mars Pet": "#059669",
  "M.Dias": "#312783",
  SCJhonson: "#0284c7",
  "UAU Ingleza": "#db2777",
  Danone: "#1d4ed8",
  Ypê: "#16a34a",
  Fini: "#e11d48",
  Heinz: "#b91c1c",
  "Red Bull": "#1e3a8a",
};

const industryReports = {
  "AB Mauri": [
    { title: "Vendas x Devolução", status: "Disponível", path: null },
    { title: "Relatório Geral", status: "Em breve", path: null },
    { title: "Em Construção", status: "Em breve", path: null },
  ],
  Adoralle: [
    { title: "Teste 1 Financeiro", status: "Em breve", path: null },
    { title: "Teste 2 Financeiro", status: "Em breve", path: null },
    { title: "Teste 3 Financeiro", status: "Em breve", path: null },
  ],
  Ajinomoto: [
    { title: "Ajinomoto 1", status: "Em breve", path: null },
    { title: "Ajinomoto 2", status: "Em breve", path: null },
    { title: "Ajinomoto 3", status: "Em breve", path: null },
  ],
  Bettanin: [
    { title: "Teste 7 Central", status: "Em breve", path: null },
    { title: "Teste 8 Central", status: "Em breve", path: null },
    { title: "Teste 9 Central", status: "Em breve", path: null },
  ],
  "M.Dias": [
    { title: "Teste 11 Trade", status: "Em breve", path: null },
    { title: "Teste 12 Trade", status: "Em breve", path: null },
    { title: "Teste 13 Trade", status: "Em breve", path: null },
  ],
  "Mars Choco": [
    { title: "Teste 14 Indústria", status: "Em breve", path: null },
    { title: "Teste 15 Indústria", status: "Em breve", path: null },
    { title: "Teste 16 Indústria", status: "Em breve", path: null },
  ],
  "Mars Pet": [
    { title: "Teste 14 Indústria", status: "Em breve", path: null },
    { title: "Teste 15 Indústria", status: "Em breve", path: null },
    { title: "Teste 16 Indústria", status: "Em breve", path: null },
  ],
  SCJhonson: [
    { title: "Teste 14 Indústria", status: "Em breve", path: null },
    { title: "Teste 15 Indústria", status: "Em breve", path: null },
    { title: "Teste 16 Indústria", status: "Em breve", path: null },
  ],
  Ypê: [
    { title: "Teste 14 Indústria", status: "Em breve", path: null },
    { title: "Teste 15 Indústria", status: "Em breve", path: null },
    { title: "Teste 16 Indústria", status: "Em breve", path: null },
  ],
  "UAU Ingleza": [
    { title: "Teste 14 Indústria", status: "Em breve", path: null },
    { title: "Teste 15 Indústria", status: "Em breve", path: null },
    { title: "Teste 16 Indústria", status: "Em breve", path: null },
  ],
  Danone: [
    { title: "Teste 14 Indústria", status: "Em breve", path: null },
    { title: "Teste 15 Indústria", status: "Em breve", path: null },
    { title: "Teste 16 Indústria", status: "Em breve", path: null },
  ],
  Fini: [
    { title: "Teste 14 Indústria", status: "Em breve", path: null },
    { title: "Teste 15 Indústria", status: "Em breve", path: null },
    { title: "Teste 16 Indústria", status: "Em breve", path: null },
  ],
  Heinz: [
    { title: "Teste 14 Indústria", status: "Em breve", path: null },
    { title: "Teste 15 Indústria", status: "Em breve", path: null },
    { title: "Teste 16 Indústria", status: "Em breve", path: null },
  ],
  "Red Bull": [
    { title: "Teste 14 Indústria", status: "Em breve", path: null },
    { title: "Teste 15 Indústria", status: "Em breve", path: null },
    { title: "Teste 16 Indústria", status: "Em breve", path: null },
  ],
};

const PainelIndustrias = () => {
  const [activeContent, setActiveContent] = useState("");
  const [userRole, setUserRole] = useState("");
  const [allowedLabel, setAllowedLabel] = useState("");

  const podeVerTudo = rolesComAcessoCompleto.includes(userRole);
  const deveExibirBotaoVoltar = !rolesQueEscondemBotaoVoltar.includes(userRole);

  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (role) {
      const roleFormatado = String(role).padStart(2, "0");
      const label = roleToLabelMap[roleFormatado];

      setUserRole(roleFormatado);

      if (label) {
        setAllowedLabel(label);
        setActiveContent(label);
      }

      if (rolesComAcessoCompleto.includes(roleFormatado)) {
        const primeiraIndustria = Object.values(roleToLabelMap)[0];
        setActiveContent(primeiraIndustria);
      }
    }
  }, []);

  const industriasPermitidas = useMemo(() => {
    if (podeVerTudo) {
      return [...new Set(Object.values(roleToLabelMap))];
    }

    return allowedLabel ? [allowedLabel] : [];
  }, [podeVerTudo, allowedLabel]);

  const activeColor = industryColors[activeContent] || "#312783";
  const activeReports = industryReports[activeContent] || [];

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 5 }, pt: 5 }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #312783, #6d5dfc)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 28px rgba(49,39,131,0.28)",
                }}
              >
                <LocalGroceryStoreIcon sx={{ color: "#fff", fontSize: 26 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#64748b",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Gerenciador de Relatórios
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "22px", md: "28px" },
                    fontWeight: 900,
                    color: "#0f172a",
                    lineHeight: 1.1,
                  }}
                >
                  Central de Indústrias
                </Typography>
              </Box>
            </Box>
          }
        />
      </Box>

      <Box
        sx={{
          mx: { xs: 2, md: 5 },
          mt: 2,
          minHeight: "68vh",
          borderRadius: "28px",
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(246,247,251,0.98))",
          boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
          border: "1px solid rgba(226,232,240,0.9)",
        }}
      >
        <Box
          sx={{
            height: 8,
            background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
          }}
        />

        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
              mb: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <PlayCircleFilledIcon sx={{ color: "#6d5dfc", fontSize: 28 }} />

              <Box>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#64748b",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Relatórios Power BI por indústria
                </Typography>

              
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1.2}>
              

              {deveExibirBotaoVoltar && (
                <Button
                  component={Link}
                  to="/relatorios"
                  startIcon={<ExitToAppIcon />}
                  sx={{
                    height: 38,
                    px: 2,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 800,
                    color: "#64748b",
                    backgroundColor: "#fff",
                    border: "1px solid rgba(226,232,240,0.95)",
                    boxShadow: "0 8px 22px rgba(15,23,42,0.05)",
                    "&:hover": {
                      color: "#312783",
                      backgroundColor: "rgba(49,39,131,0.06)",
                      boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
                    },
                  }}
                >
                  Voltar
                </Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(148,163,184,0.25)" }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "340px 1fr" },
              gap: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "24px",
                border: "1px solid rgba(226,232,240,0.9)",
                backgroundColor: "rgba(255,255,255,0.82)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            >
              <Typography
                sx={{
                  px: 1,
                  mb: 2,
                  fontSize: "12px",
                  fontWeight: 900,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Indústrias
              </Typography>

              <Stack spacing={1.2}>
                {industriasPermitidas.map((label) => {
                  const selected = activeContent === label;
                  const color = industryColors[label] || "#312783";

                  return (
                    <Button
                      key={label}
                      fullWidth
                      onClick={() => setActiveContent(label)}
                      sx={{
                        minHeight: 64,
                        px: 2,
                        justifyContent: "space-between",
                        borderRadius: "18px",
                        textTransform: "none",
                        color: selected ? "#fff" : "#334155",
                        background: selected
                          ? `linear-gradient(135deg, ${color}, #6d5dfc)`
                          : "#fff",
                        border: selected
                          ? "1px solid transparent"
                          : "1px solid rgba(226,232,240,0.9)",
                        boxShadow: selected
                          ? `0 16px 34px ${color}38`
                          : "0 8px 22px rgba(15,23,42,0.04)",
                        "&:hover": {
                          background: `linear-gradient(135deg, ${color}, #6d5dfc)`,
                          color: "#fff",
                          transform: "translateY(-1px)",
                          boxShadow: `0 18px 38px ${color}38`,
                        },
                        transition: "all 0.25s ease",
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.4}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "13px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: selected ? "rgba(255,255,255,0.18)" : `${color}14`,
                            color: selected ? "#fff" : color,
                          }}
                        >
                          <FactoryIcon />
                        </Box>

                        <Box textAlign="left">
                          <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                            {label}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: selected ? "rgba(255,255,255,0.75)" : "#94a3b8",
                            }}
                          >
                            Relatórios industriais
                          </Typography>
                        </Box>
                      </Box>

                      <ArrowForwardIosIcon sx={{ fontSize: 14, opacity: 0.8 }} />
                    </Button>
                  );
                })}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.2, md: 3 },
                borderRadius: "24px",
                border: "1px solid rgba(226,232,240,0.9)",
                background:
                  "radial-gradient(circle at top right, rgba(109,93,252,0.10), transparent 35%), #fff",
                minHeight: 420,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: "18px",
                      background: `linear-gradient(135deg, ${activeColor}, #6d5dfc)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      boxShadow: `0 18px 36px ${activeColor}35`,
                    }}
                  >
                    <BusinessCenterIcon />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: 20, md: 24 },
                        fontWeight: 950,
                        color: "#0f172a",
                        lineHeight: 1.1,
                      }}
                    >
                      {activeContent || "Nenhuma indústria selecionada"}
                    </Typography>

                    <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.5 }}>
                      Painel executivo de relatórios industriais
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={`${activeReports.length} relatório(s)`}
                  sx={{
                    borderRadius: "12px",
                    fontWeight: 800,
                    color: activeColor,
                    backgroundColor: `${activeColor}12`,
                    border: `1px solid ${activeColor}24`,
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                    xl: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                {activeReports.map((report) => {
                  const disabled = !report.path;

                  const card = (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.3,
                        minHeight: 150,
                        borderRadius: "22px",
                        border: "1px solid rgba(226,232,240,0.95)",
                        background: disabled
                          ? "linear-gradient(135deg, #f8fafc, #fff)"
                          : "linear-gradient(135deg, #ffffff, #f8f7ff)",
                        cursor: disabled ? "default" : "pointer",
                        opacity: disabled ? 0.72 : 1,
                        transition: "all 0.25s ease",
                        "&:hover": disabled
                          ? {}
                          : {
                              transform: "translateY(-4px)",
                              boxShadow: "0 20px 45px rgba(15,23,42,0.12)",
                              borderColor: `${activeColor}55`,
                            },
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "15px",
                          backgroundColor: disabled
                            ? "rgba(148,163,184,0.12)"
                            : `${activeColor}14`,
                          color: disabled ? "#94a3b8" : activeColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        <InsertChartOutlinedIcon />
                      </Box>

                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 950,
                          color: "#0f172a",
                          textTransform: "uppercase",
                          lineHeight: 1.25,
                          mb: 1,
                        }}
                      >
                        {report.title}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Chip
                          size="small"
                          label={report.status}
                          sx={{
                            height: 24,
                            fontSize: 11,
                            fontWeight: 800,
                            borderRadius: "8px",
                            color: disabled ? "#64748b" : "#047857",
                            backgroundColor: disabled
                              ? "rgba(148,163,184,0.12)"
                              : "rgba(16,185,129,0.12)",
                          }}
                        />

                        {!disabled && (
                          <ArrowForwardIosIcon sx={{ fontSize: 14, color: activeColor }} />
                        )}
                      </Box>
                    </Paper>
                  );

                  if (disabled) return <Box key={report.title}>{card}</Box>;

                  return (
                    <Box
                      key={report.title}
                      component={Link}
                      to={report.path}
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      {card}
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PainelIndustrias;