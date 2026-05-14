import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { dbFokus360, authFokus360 } from "../../data/firebase-config";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import BusinessIcon from "@mui/icons-material/Business";
import FactoryIcon from "@mui/icons-material/Factory";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const areas = [
  { id: "CONTABILIDADE", nome: "CONTABILIDADE" },
  { id: "CONTROLADORIA", nome: "CONTROLADORIA" },
  { id: "FINANCEIRO", nome: "FINANCEIRO" },
  { id: "JURIDICO", nome: "JURÍDICO" },
  { id: "LOGISTICA", nome: "LOGÍSTICA" },
  { id: "MARKETING", nome: "MARKETING" },
  { id: "TRADE", nome: "TRADE" },
  { id: "RECURSOSHUMANOS", nome: "RECURSOS HUMANOS" },
  { id: "TI", nome: "TI" },
  { id: "COMERCIAL", nome: "COMERCIAL" },
  { id: "INDUSTRIA", nome: "INDÚSTRIA" },
];

const rolesRestritos = [
  "37", "38", "39", "40", "41", "42", "43", "44",
  "45", "46", "47", "48", "49", "50", "51",
];

const Arquivosareas = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(true);

  const roleFormatado = role ? String(role).padStart(2, "0") : "";
  const acessoRestrito = rolesRestritos.includes(roleFormatado);

  const areasDisponiveis = useMemo(() => {
    if (!roleFormatado) return [];

    return acessoRestrito
      ? [{ id: "INDUSTRIA", nome: "INDÚSTRIA" }]
      : areas;
  }, [roleFormatado, acessoRestrito]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(dbFokus360, "user", user.uid));

          if (userDoc.exists()) {
            const dados = userDoc.data();
            const roleUser = String(dados.role).padStart(2, "0");

            setRole(roleUser);

            if (rolesRestritos.includes(roleUser)) {
              setArea("INDUSTRIA");
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAcessarArquivos = () => {
    if (!area) {
      alert("Selecione uma área antes de continuar.");
      return;
    }

    if (area === "INDUSTRIA") {
      navigate("/PainelIndustriasTrade");
      return;
    }

    navigate(`/arquivos?area=${area}`);
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
        <Typography sx={{ fontWeight: 800, color: "#64748b" }}>
          Carregando permissões...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "85vh",
        px: { xs: 2, md: 5 },
        py: { xs: 3, md: 5 },
        background:
          "radial-gradient(circle at top right, rgba(109,93,252,0.14), transparent 32%), linear-gradient(135deg, #f8fafc, #eef2ff)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 980,
          mx: "auto",
          borderRadius: "30px",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
          boxShadow: "0 28px 80px rgba(15,23,42,0.14)",
          border: "1px solid rgba(226,232,240,0.95)",
        }}
      >
        <Box
          sx={{
            height: 8,
            background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
          }}
        />

        <Box sx={{ p: { xs: 3, md: 5 } }}>
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
            <Box display="flex" alignItems="center" gap={1.8}>
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #312783, #6d5dfc)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 18px 38px rgba(49,39,131,0.30)",
                }}
              >
                <FolderOpenIcon sx={{ fontSize: 30 }} />
              </Box>

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
                  Central de Arquivos
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 24, md: 32 },
                    fontWeight: 950,
                    color: "#0f172a",
                    lineHeight: 1.05,
                  }}
                >
                  Arquivos por Área
                </Typography>

                
              </Box>
            </Box>

            
          </Box>

          <Divider sx={{ mb: 4, borderColor: "rgba(148,163,184,0.22)" }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1.25fr" },
              gap: 3,
              alignItems: "stretch",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "26px",
                background:
                  "linear-gradient(135deg, rgba(49,39,131,0.95), rgba(109,93,252,0.95))",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                minHeight: 280,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 210,
                  height: 210,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.10)",
                  right: -70,
                  top: -70,
                }}
              />

              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: "18px",
                  backgroundColor: "rgba(255,255,255,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                {acessoRestrito ? (
                  <FactoryIcon sx={{ fontSize: 32 }} />
                ) : (
                  <BusinessIcon sx={{ fontSize: 32 }} />
                )}
              </Box>

              <Typography sx={{ fontSize: 24, fontWeight: 950, mb: 1 }}>
                {acessoRestrito ? "Acesso Indústria" : "Acesso Corporativo"}
              </Typography>

              <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 1.7 }}>
                {acessoRestrito
                  ? "Seu perfil permite acesso apenas aos arquivos da área de indústria."
                  : "Seu perfil permite acesso às áreas corporativas disponíveis no sistema."}
              </Typography>

              <Chip
                icon={<LockOpenIcon sx={{ color: "#fff !important" }} />}
                label={acessoRestrito ? "Permissão restrita" : "Permissão ampla"}
                sx={{
                  mt: 4,
                  color: "#fff",
                  fontWeight: 900,
                  borderRadius: "12px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.22)",
                }}
              />
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "26px",
                border: "1px solid rgba(226,232,240,0.95)",
                background:
                  "radial-gradient(circle at top right, rgba(109,93,252,0.10), transparent 35%), #fff",
                minHeight: 280,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 900,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  mb: 1,
                }}
              >
                Seleção de acesso
              </Typography>

              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 950,
                  color: "#0f172a",
                  mb: 3,
                }}
              >
                Escolha a área de arquivos
              </Typography>

              <FormControl fullWidth>
                <InputLabel id="areas-label">Área autorizada</InputLabel>

                <Select
                  labelId="areas-label"
                  value={area}
                  label="Área autorizada"
                  onChange={(event) => setArea(event.target.value)}
                  sx={{
                    height: 56,
                    borderRadius: "16px",
                    backgroundColor: "#f8fafc",
                    fontWeight: 800,
                    color: "#334155",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(203,213,225,0.9)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#6d5dfc",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#312783",
                      borderWidth: "2px",
                    },
                  }}
                >
                  {areasDisponiveis.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
                onClick={handleAcessarArquivos}
                sx={{
                  mt: 3,
                  height: 54,
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #312783, #6d5dfc)",
                  color: "#fff",
                  fontWeight: 950,
                  textTransform: "none",
                  boxShadow: "0 16px 34px rgba(49,39,131,0.28)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #241d66, #5c4df2)",
                    boxShadow: "0 20px 42px rgba(49,39,131,0.34)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                Acessar arquivos
              </Button>

              <Typography
                sx={{
                  mt: 2,
                  color: "#94a3b8",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                O acesso será liberado conforme as permissões do seu perfil.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Arquivosareas;