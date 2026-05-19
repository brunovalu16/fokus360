import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Divider,
  Chip,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";

import { Header } from "../../components";
import { dbFokus360, authFokus360 } from "../../data/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";

import AssessmentIcon from "@mui/icons-material/Assessment";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FactoryIcon from "@mui/icons-material/Factory";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const Relatorios = () => {
  const [activeContent, setActiveContent] = useState("Vendas");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [visibleLinks, setVisibleLinks] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const isAdmin = userRole === "08" || userRole === "01";

  const links = {
    "01": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "02": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "03": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "04": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "05": ["Trade", "Indústrias"],
    "06": ["Indústrias"],
    "08": ["Vendas", "Financeiro", "Logística", "Central de monitoramento", "Trade", "Indústrias"],
    "09": ["Trade", "Indústrias"],
    "10": ["Trade", "Indústrias"],
    "11": ["Trade", "Indústrias"],
    "19": ["Financeiro", "Indústrias"],
    "20": ["Financeiro", "Indústrias"],
    "21": ["Financeiro", "Indústrias"],
    "25": ["Logística", "Indústrias"],
    "26": ["Logística", "Indústrias"],
    "27": ["Logística", "Indústrias"],
    "34": ["Central de monitoramento", "Indústrias"],
    "35": ["Central de monitoramento", "Indústrias"],
    "36": ["Central de monitoramento", "Indústrias"],
  };

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

  const carregarRelatorios = async (uid, role, emailUsuario) => {
  try {
    const snapshot = await getDocs(collection(dbFokus360, "relatorios"));

    const admin = role === "08" || role === "01";

    const lista = snapshot.docs
      .map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      .filter((relatorio) => relatorio.ativo !== false)
      .filter((relatorio) => {
        // ADMIN VÊ TUDO
        if (admin) return true;

        // ACESSO POR USUÁRIO
        const acessoPorUsuario = Array.isArray(
          relatorio.usuariosPermitidosIds
        )
          ? relatorio.usuariosPermitidosIds.includes(uid)
          : false;

        // ACESSO POR GRUPO DE EMAIL
        const acessoPorGrupo = Array.isArray(
          relatorio.grupoEmailEmails
        )
          ? relatorio.grupoEmailEmails
              .map((email) => String(email).toLowerCase())
              .includes(String(emailUsuario).toLowerCase())
          : false;

        // LIBERA SE TIVER QUALQUER UM DOS DOIS
        return acessoPorUsuario || acessoPorGrupo;
      })
      .sort((a, b) =>
        String(a.nomeRelatorio || "").localeCompare(
          String(b.nomeRelatorio || ""),
          "pt-BR"
        )
      );

    setRelatorios(lista);
  } catch (error) {
    console.error("Erro ao carregar relatórios:", error);
  }
};

useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    authFokus360,
    async (currentUser) => {
      if (!currentUser) {
        setCarregando(false);
        return;
      }

      try {
        const userRef = doc(dbFokus360, "user", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          const role = String(userData.role || "").padStart(2, "0");

          const emailUsuario = String(
            userData.email || ""
          ).toLowerCase();

          const permissoes = links[role] || [];

          setUserId(currentUser.uid);
          setUserRole(role);
          setVisibleLinks(permissoes);

          if (permissoes.length > 0) {
            setActiveContent(permissoes[0]);
          }

          await carregarRelatorios(
            currentUser.uid,
            role,
            emailUsuario
          );
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setCarregando(false);
      }
    }
  );

  return () => unsubscribe();
}, []);
  const visibleMenus = useMemo(() => {
    return Object.keys(menuConfig).filter((item) => visibleLinks.includes(item));
  }, [visibleLinks]);

  const activeReports = useMemo(() => {
    return relatorios.filter(
      (relatorio) => relatorio.areaRelatorio === activeContent
    );
  }, [relatorios, activeContent]);

  const activeMenu = menuConfig[activeContent] || menuConfig.Vendas;


  const excluirRelatorio = async (e, reportId) => {
  e.preventDefault();
  e.stopPropagation();

  const confirmar = window.confirm("Tem certeza que deseja excluir este relatório?");

  if (!confirmar) return;

  try {
    await deleteDoc(doc(dbFokus360, "relatorios", reportId));

    setRelatorios((prev) =>
      prev.filter((relatorio) => relatorio.id !== reportId)
    );

    alert("Relatório excluído com sucesso.");
  } catch (error) {
    console.error("Erro ao excluir relatório:", error);
    alert(`Erro ao excluir relatório: ${error.message}`);
  }
};

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
                <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#64748b" }}>
                  Gerenciador de Relatórios
                </Typography>

                <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 900 }}>
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
          background: "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(246,247,251,0.98))",
          boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
          border: "1px solid rgba(226,232,240,0.9)",
        }}
      >
        <Box sx={{ height: 8, background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)" }} />

        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <PlayCircleFilledIcon sx={{ color: "#6d5dfc", fontSize: 28 }} />
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#64748b" }}>
              Relatórios disponíveis
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {carregando ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "330px 1fr" }, gap: 3 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: "24px", border: "1px solid rgba(226,232,240,0.9)" }}>
                <Typography sx={{ px: 1, mb: 2, fontSize: 12, fontWeight: 900, color: "#94a3b8" }}>
                  ÁREAS
                </Typography>

                <Stack spacing={1.2}>
                  {visibleMenus.map((label) => {
                    const item = menuConfig[label];
                    const selected = activeContent === label;

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
                            ? `linear-gradient(135deg, ${item.color}, #6d5dfc)`
                            : "#fff",
                          border: "1px solid rgba(226,232,240,0.9)",
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
                              backgroundColor: selected ? "rgba(255,255,255,0.18)" : `${item.color}14`,
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

                        <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
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
                  background: "radial-gradient(circle at top right, rgba(109,93,252,0.10), transparent 35%), #fff",
                  minHeight: 420,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
                      }}
                    >
                      {activeMenu.icon}
                    </Box>

                    <Box>
                      <Typography sx={{ fontSize: 24, fontWeight: 950 }}>
                        {activeContent}
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                        {activeMenu.subtitle}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={`${activeReports.length} relatório(s)`}
                    sx={{
                      fontWeight: 800,
                      color: activeMenu.color,
                      backgroundColor: `${activeMenu.color}12`,
                    }}
                  />
                </Box>

                {activeReports.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: "22px",
                      border: "1px solid rgba(220,38,38,0.18)",
                      background: "linear-gradient(135deg, rgba(254,242,242,0.95), rgba(255,255,255,0.95))",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <ErrorOutlineIcon sx={{ color: "#dc2626", fontSize: 34 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 900, color: "#991b1b" }}>
                        Nenhum relatório disponível.
                      </Typography>
                      <Typography sx={{ color: "#7f1d1d", fontSize: 14 }}>
                        Não há relatórios cadastrados para esta área ou para o seu usuário.
                      </Typography>
                    </Box>
                  </Paper>
                ) : (
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
                    {activeReports.map((report) => (
                      <Box
                        key={report.id}
                        component={Link}
                        to={`/relatoriopowerbi/${report.id}`}
                        sx={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.3,
                            minHeight: 150,
                            borderRadius: "22px",
                            border: "1px solid rgba(226,232,240,0.95)",
                            background: "linear-gradient(135deg, #ffffff, #f8f7ff)",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            position: "relative",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 20px 45px rgba(15,23,42,0.12)",
                              borderColor: `${activeMenu.color}55`,
                            },
                          }}
                        >
                          {isAdmin && (
                            <IconButton
                              onClick={(e) => excluirRelatorio(e, report.id)}
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                width: 34,
                                height: 34,
                                borderRadius: "12px",
                                color: "#dc2626",
                                backgroundColor: "rgba(220,38,38,0.08)",
                                zIndex: 5,
                                "&:hover": {
                                  backgroundColor: "rgba(220,38,38,0.16)",
                                },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          )}
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: "15px",
                              backgroundColor: `${activeMenu.color}14`,
                              color: activeMenu.color,
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
                            }}
                          >
                            {report.nomeRelatorio}
                          </Typography>

                          <Box display="flex" justifyContent="space-between" mt={2}>
                            <Chip
                              size="small"
                              label="Disponível"
                              sx={{
                                height: 24,
                                fontSize: 11,
                                fontWeight: 800,
                                color: "#047857",
                                backgroundColor: "rgba(16,185,129,0.12)",
                              }}
                            />

                            <ArrowForwardIosIcon sx={{ fontSize: 14, color: activeMenu.color }} />
                          </Box>
                        </Paper>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Relatorios;