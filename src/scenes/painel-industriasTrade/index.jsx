import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import { Header } from "../../components";
import { authFokus360, dbFokus360 } from "../../data/firebase-config";

import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FactoryIcon from "@mui/icons-material/Factory";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

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

const allLabels = [
  "AB Mauri",
  "Adoralle",
  "Ajinomoto",
  "Bettanin",
  "M.Dias",
  "Danone",
  "UAU Ingleza",
  "Mars Choco",
  "Mars Pet",
  "SCJhonson",
  "Ypê",
  "Fini",
  "Heinz",
  "Red Bull",
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

const PainelIndustriasTrade = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeContent, setActiveContent] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(dbFokus360, "user", user.uid));

          if (userDoc.exists()) {
            const roleFormatado = String(userDoc.data().role).padStart(2, "0");
            setRole(roleFormatado);

            if (roleToLabelMap[roleFormatado]) {
              setActiveContent(roleToLabelMap[roleFormatado]);
            } else {
              setActiveContent("AB Mauri");
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar role do usuário:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const isRestrictedRole = Object.keys(roleToLabelMap).includes(role);

  const allowedLabels = useMemo(() => {
    if (isRestrictedRole) {
      return [roleToLabelMap[role]];
    }

    return [...new Set(allLabels)];
  }, [isRestrictedRole, role]);

  const activeColor = industryColors[activeContent] || "#312783";

  const handleAcessarArquivos = (label) => {
    const roleSelecionado = Object.keys(roleToLabelMap).find(
      (key) => roleToLabelMap[key] === label
    );

    if (!roleSelecionado) {
      alert("Role da indústria não encontrado.");
      return;
    }

    setActiveContent(label);
    navigate(`/arquivos?role=${roleSelecionado}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, rgba(109,93,252,0.12), transparent 35%), #f8fafc",
        }}
      >
        <Typography sx={{ fontWeight: 900, color: "#64748b" }}>
          Carregando permissões...
        </Typography>
      </Box>
    );
  }

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
                  Gerenciador de Arquivos
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
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <PlayCircleFilledIcon sx={{ color: "#6d5dfc", fontSize: 28 }} />

              <Box>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 900,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Arquivos por indústria
                </Typography>

                <Typography sx={{ fontSize: 15, color: "#94a3b8", fontWeight: 500 }}>
                  Acesso liberado conforme perfil do usuário.
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={1.2} flexWrap="wrap">
              <Chip
                icon={<LockOpenIcon sx={{ color: "#312783 !important" }} />}
                label={isRestrictedRole ? "Acesso restrito" : "Acesso completo"}
                sx={{
                  height: 38,
                  px: 1,
                  borderRadius: "12px",
                  fontWeight: 900,
                  color: "#312783",
                  backgroundColor: "rgba(49,39,131,0.08)",
                  border: "1px solid rgba(49,39,131,0.16)",
                }}
              />

              <Button
                component={Link}
                to="/capaarquivos"
                startIcon={<ExitToAppIcon />}
                sx={{
                  height: 38,
                  px: 2,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 900,
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
                Voltar para painel
              </Button>
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
                Indústrias disponíveis
              </Typography>

              <Stack spacing={1.2}>
                {allowedLabels.map((label) => {
                  const selected = activeContent === label;
                  const color = industryColors[label] || "#312783";

                  return (
                    <Button
                      key={label}
                      fullWidth
                      onClick={() => handleAcessarArquivos(label)}
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
                            backgroundColor: selected
                              ? "rgba(255,255,255,0.18)"
                              : `${color}14`,
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
                              color: selected
                                ? "rgba(255,255,255,0.75)"
                                : "#94a3b8",
                            }}
                          >
                            Acessar arquivos
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
                p: { xs: 2.5, md: 4 },
                borderRadius: "24px",
                border: "1px solid rgba(226,232,240,0.9)",
                background:
                  "radial-gradient(circle at top right, rgba(109,93,252,0.10), transparent 35%), #fff",
                minHeight: 420,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Box sx={{ maxWidth: 520 }}>
                <Box
                  sx={{
                    width: 76,
                    height: 76,
                    borderRadius: "24px",
                    mx: "auto",
                    mb: 2,
                    background: `linear-gradient(135deg, ${activeColor}, #6d5dfc)`,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 20px 42px ${activeColor}35`,
                  }}
                >
                  <BusinessCenterIcon sx={{ fontSize: 36 }} />
                </Box>

                <Typography
                  sx={{
                    fontSize: { xs: 24, md: 32 },
                    fontWeight: 950,
                    color: "#0f172a",
                    lineHeight: 1.05,
                  }}
                >
                  {activeContent || "Selecione uma indústria"}
                </Typography>

                <Typography
                  sx={{
                    mt: 1.5,
                    color: "#64748b",
                    fontSize: 15,
                    lineHeight: 1.7,
                  }}
                >
                  Clique em uma indústria ao lado para abrir a biblioteca de arquivos
                  filtrada conforme a permissão vinculada ao perfil.
                </Typography>

                {activeContent && (
                  <Button
                    onClick={() => handleAcessarArquivos(activeContent)}
                    endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      mt: 3,
                      height: 46,
                      px: 3,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 950,
                      color: "#fff",
                      background: `linear-gradient(135deg, ${activeColor}, #6d5dfc)`,
                      boxShadow: `0 14px 30px ${activeColor}30`,
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: `0 18px 38px ${activeColor}38`,
                      },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Abrir arquivos
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PainelIndustriasTrade;