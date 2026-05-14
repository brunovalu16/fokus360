import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Divider,
  Chip,
  Paper,
  Stack,
} from "@mui/material";

import { Header } from "../../components";
import { dbFokus360, authFokus360 } from "../../data/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import AssessmentIcon from "@mui/icons-material/Assessment";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FactoryIcon from "@mui/icons-material/Factory";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";

const Relatorios = () => {
  const navigate = useNavigate();

  const [activeContent, setActiveContent] = useState("Vendas");
  const [userRole, setUserRole] = useState("");
  const [visibleLinks, setVisibleLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const links = {
    "01": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "02": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "03": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "04": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "05": ["Trade", "Indústrias"],
    "06": ["Indústrias"],
    "07": ["Projetos"],
    "08": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "09": ["Trade", "Indústrias"],
    "10": ["Trade", "Indústrias"],
    "11": ["Trade", "Indústrias"],
    "12": ["Projetos"],
    "13": ["Projetos"],
    "14": ["Projetos"],
    "15": ["Projetos"],
    "16": ["Projetos"],
    "17": ["Projetos"],
    "18": ["Projetos"],
    "19": ["Financeiro", "Indústrias"],
    "20": ["Financeiro", "Indústrias"],
    "21": ["Financeiro", "Indústrias"],
    "22": ["Projetos"],
    "23": ["Projetos"],
    "24": ["Projetos"],
    "25": ["Logística", "Indústrias"],
    "26": ["Logística", "Indústrias"],
    "27": ["Logística", "Indústrias"],
    "28": ["Projetos"],
    "29": ["Projetos"],
    "30": ["Projetos"],
    "31": ["Projetos"],
    "32": ["Projetos"],
    "33": ["Projetos"],
    "34": ["Central de monitoramento", "Indústrias"],
    "35": ["Central de monitoramento", "Indústrias"],
    "36": ["Central de monitoramento", "Indústrias"],
    "37": ["Projetos"],
    "38": ["Projetos"],
    "39": ["Projetos"],
    "40": ["Projetos"],
    "41": ["Projetos"],
    "42": ["Projetos"],
    "43": ["Projetos"],
    "44": ["Projetos"],
    "45": ["Projetos"],
    "46": ["Projetos"],
    "47": ["Projetos"],
    "48": ["Projetos"],
    "49": ["Projetos"],
    "50": ["Projetos"],
    "51": ["Projetos"],
  };

  const rolesQueMostramModal = [
    "07", "12", "13", "14", "15", "16", "17", "18", "22", "23", "24",
    "28", "29", "30", "31", "32", "33", "37", "38", "39", "40",
    "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51",
  ];

  const menuConfig = {
    Vendas: {
      icon: <TrendingUpIcon />,
      color: "#312783",
      subtitle: "Relatórios comerciais, vendas, devoluções e performance.",
    },
    Financeiro: {
      icon: <AccountBalanceWalletIcon />,
      color: "#2563eb",
      subtitle: "Indicadores financeiros e análises gerenciais.",
    },
    Logística: {
      icon: <LocalShippingIcon />,
      color: "#059669",
      subtitle: "Operação logística, entregas e acompanhamento.",
    },
    "Central de monitoramento": {
      icon: <MonitorHeartIcon />,
      color: "#dc2626",
      subtitle: "Monitoramento operacional e vendedores.",
    },
    Trade: {
      icon: <StorefrontIcon />,
      color: "#f97316",
      subtitle: "Promotores, vendas totais e acompanhamento de grupo.",
    },
    Indústrias: {
      icon: <FactoryIcon />,
      color: "#7c3aed",
      subtitle: "Relatórios industriais e parceiros estratégicos.",
    },
  };

  const reports = {
    Vendas: [
      { title: "Vendas x Devolução", path: "/vendasdevolucao", status: "Disponível" },
      { title: "Relatório Geral", path: null, status: "Em breve" },
      { title: "Em Construção", path: null, status: "Em breve" },
    ],
    Financeiro: [
      { title: "Teste 1 Financeiro", path: null, status: "Em breve" },
      { title: "Teste 2 Financeiro", path: null, status: "Em breve" },
      { title: "Teste 3 Financeiro", path: null, status: "Em breve" },
    ],
    Logística: [
      { title: "Teste 1 Logística", path: null, status: "Em breve" },
      { title: "Teste 2 Logística", path: null, status: "Em breve" },
      { title: "Teste 3 Logística", path: null, status: "Em breve" },
    ],
    "Central de monitoramento": [
      { title: "Monitoramento Vendedor", path: "/monitoramentovendedor", status: "Disponível" },
    ],
    Trade: [
      { title: "Vendas por Promotor", path: "/relatoriotrade", status: "Disponível" },
      { title: "Vendas Total", path: "/vendastotaltrade", status: "Disponível" },
      { title: "Acompanhamento Grupo", path: "/AcompanhamentoGrupo", status: "Disponível" },
    ],
    Indústrias: [
      { title: "Teste 1 Indústrias", path: null, status: "Em breve" },
      { title: "Teste 2 Indústrias", path: null, status: "Em breve" },
      { title: "Teste 3 Indústrias", path: null, status: "Em breve" },
    ],
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (!currentUser) return;

      try {
        const docRef = doc(dbFokus360, "user", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const role = String(docSnap.data().role).padStart(2, "0");
          const permissoes = links[role] || [];

          setUserRole(role);
          setVisibleLinks(permissoes);

          if (permissoes.length > 0 && !permissoes.includes(activeContent)) {
            setActiveContent(permissoes[0]);
          }

          if (rolesQueMostramModal.includes(role)) {
            setIsModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const visibleMenus = useMemo(() => {
    return Object.keys(menuConfig).filter((item) => visibleLinks.includes(item));
  }, [visibleLinks]);

  const activeReports = reports[activeContent] || [];
  const activeMenu = menuConfig[activeContent] || menuConfig.Vendas;

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
                <AssessmentIcon sx={{ color: "#fff", fontSize: 26 }} />
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
                 POWER BI
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
                  Relatórios disponíveis Power BI
                </Typography>
                
                
              </Box>
              
            </Box>
                  {/** 
            <Chip
              icon={<LocalGroceryStoreIcon sx={{ color: "#312783 !important" }} />}
              label={`Perfil ${userRole || "--"}`}
              sx={{
                height: 38,
                px: 1,
                borderRadius: "12px",
                fontWeight: 800,
                color: "#312783",
                backgroundColor: "rgba(49,39,131,0.08)",
                border: "1px solid rgba(49,39,131,0.16)",
              }}
            />
            */}
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(148,163,184,0.25)" }} />

          {isModalOpen && (
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                p: 3,
                borderRadius: "22px",
                border: "1px solid rgba(220,38,38,0.18)",
                background:
                  "linear-gradient(135deg, rgba(254,242,242,0.95), rgba(255,255,255,0.95))",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "16px",
                  backgroundColor: "rgba(220,38,38,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ErrorOutlineIcon sx={{ color: "#dc2626", fontSize: 30 }} />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 900, color: "#991b1b", fontSize: 16 }}>
                  Nenhum relatório no momento.
                </Typography>
                <Typography sx={{ color: "#7f1d1d", fontSize: 14 }}>
                  Entre em contato com o administrador do sistema para mais informações.
                </Typography>
              </Box>
            </Paper>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "330px 1fr" },
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
                Áreas
              </Typography>

              <Stack spacing={1.2}>
                {visibleMenus.map((label) => {
                  const item = menuConfig[label];
                  const selected = activeContent === label;

                  return (
                    <Button
                      key={label}
                      fullWidth
                      onClick={() => {
                        setActiveContent(label);

                        if (label === "Indústrias") {
                          navigate("/painelindustrias");
                        }
                      }}
                      sx={{
                        minHeight: 64,
                        px: 2,
                        justifyContent: "space-between",
                        borderRadius: "18px",
                        textTransform: "none",
                        color: selected ? "#fff" : "#334155",
                        background: selected
                          ? `linear-gradient(135deg, ${item.color}, #6d5dfc)`
                          : "#fff",
                        border: selected
                          ? "1px solid transparent"
                          : "1px solid rgba(226,232,240,0.9)",
                        boxShadow: selected
                          ? `0 16px 34px ${item.color}38`
                          : "0 8px 22px rgba(15,23,42,0.04)",
                        "&:hover": {
                          background: `linear-gradient(135deg, ${item.color}, #6d5dfc)`,
                          color: "#fff",
                          transform: "translateY(-1px)",
                          boxShadow: `0 18px 38px ${item.color}38`,
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
                            backgroundColor: selected
                              ? "rgba(255,255,255,0.18)"
                              : `${item.color}14`,
                            color: selected ? "#fff" : item.color,
                          }}
                        >
                          {item.icon}
                        </Box>

                        <Box textAlign="left">
                          <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                            {label}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: selected ? "rgba(255,255,255,0.75)" : "#94a3b8",
                              maxWidth: 190,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.subtitle}
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
                      background: `linear-gradient(135deg, ${activeMenu.color}, #6d5dfc)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      boxShadow: `0 18px 36px ${activeMenu.color}35`,
                    }}
                  >
                    {activeMenu.icon}
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
                      {activeContent}
                    </Typography>

                    <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.5 }}>
                      {activeMenu.subtitle}
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={`${activeReports.length} relatório(s)`}
                  sx={{
                    borderRadius: "12px",
                    fontWeight: 800,
                    color: activeMenu.color,
                    backgroundColor: `${activeMenu.color}12`,
                    border: `1px solid ${activeMenu.color}24`,
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
                              borderColor: `${activeMenu.color}55`,
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
                            : `${activeMenu.color}14`,
                          color: disabled ? "#94a3b8" : activeMenu.color,
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
                          <ArrowForwardIosIcon
                            sx={{
                              fontSize: 14,
                              color: activeMenu.color,
                            }}
                          />
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
                      sx={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
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

export default Relatorios;