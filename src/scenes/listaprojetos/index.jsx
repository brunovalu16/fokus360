import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

import Lista from "../../components/Lista";
import FluxoGrama from "../../components/FluxoGrama";
import { tokens } from "../../theme";

const Projetos = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 5 }, pt: 5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            pb: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.6}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "16px",
                background: "linear-gradient(135deg, #312783, #6d5dfc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 14px 30px rgba(49,39,131,0.28)",
              }}
            >
              <PermContactCalendarIcon sx={{ color: "#fff", fontSize: 28 }} />
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
                Gerenciador de Projetos
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 24, md: 32 },
                  fontWeight: 950,
                  color: "#0f172a",
                  lineHeight: 1.05,
                }}
              >
                Planejamentos Estratégicos
              </Typography>
            </Box>
          </Box>

          <Button
            component={Link}
            to="/planejamento"
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              height: 44,
              px: 2.6,
              borderRadius: "14px",
              fontWeight: 950,
              textTransform: "none",
              background: "linear-gradient(135deg, #312783, #6d5dfc)",
              boxShadow: "0 14px 30px rgba(49,39,131,0.28)",
              "&:hover": {
                background: "linear-gradient(135deg, #241d66, #5c4df2)",
                boxShadow: "0 18px 38px rgba(49,39,131,0.34)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.25s ease",
            }}
          >
            Novo Planejamento
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          mx: { xs: 2, md: 5 },
          mt: 1,
          minHeight: "58vh",
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
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #312783, #6d5dfc)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 18px 36px rgba(49,39,131,0.28)",
                }}
              >
                <DashboardCustomizeIcon />
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
                  Painel Executivo
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 22, md: 28 },
                    fontWeight: 950,
                    color: "#0f172a",
                    lineHeight: 1.05,
                  }}
                >
                  Projetos Cadastrados
                </Typography>

                <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.8 }}>
                  Controle, acompanhamento e gestão dos planejamentos ativos.
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                icon={<AccountTreeIcon sx={{ color: "#312783 !important" }} />}
                label="Gestão estratégica"
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

              <Chip
                icon={<ViewTimelineIcon sx={{ color: "#047857 !important" }} />}
                label="Fluxograma ativo"
                sx={{
                  height: 38,
                  px: 1,
                  borderRadius: "12px",
                  fontWeight: 900,
                  color: "#047857",
                  backgroundColor: "rgba(16,185,129,0.10)",
                  border: "1px solid rgba(16,185,129,0.18)",
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(148,163,184,0.25)" }} />

          <Paper
            elevation={0}
            sx={{
              borderRadius: "24px",
              overflow: "hidden",
              backgroundColor: "#fff",
              border: "1px solid rgba(226,232,240,0.95)",
              boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
              p: { xs: 1.5, md: 2 },
            }}
          >
            <Lista />
          </Paper>
        </Box>
      </Box>

      <Box
        sx={{
          mx: { xs: 2, md: 5 },
          mt: 3,
          mb: 4,
          borderRadius: "28px",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.98))",
          boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
          border: "1px solid rgba(226,232,240,0.9)",
          p: { xs: 2, md: 3 },
        }}
      >
        <FluxoGrama />
      </Box>
    </>
  );
};

export default Projetos;