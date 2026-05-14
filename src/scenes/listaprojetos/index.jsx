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

import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

import Lista from "../../components/Lista";
import FluxoGrama from "../../components/FluxoGrama";

const Projetos = () => {
  return (
    <Box sx={pageStyle}>
      <Box sx={pageInnerStyle}>
        <Box sx={headerStyle}>
          <Box sx={titleGroupStyle}>
            <Box sx={mainIconStyle}>
              <PermContactCalendarIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={eyebrowStyle}>Gerenciador de Projetos</Typography>
              <Typography sx={pageTitleStyle}>Planejamentos Estratégicos</Typography>
            </Box>
          </Box>

          <Button
            component={Link}
            to="/planejamento"
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            sx={primaryButtonStyle}
          >
            Novo Planejamento
          </Button>
        </Box>

        <Box sx={mainCardStyle}>
          <Box sx={topBarStyle} />

          <Box sx={contentStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={titleGroupStyle}>
                <Box sx={sectionIconStyle}>
                  <DashboardCustomizeIcon />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={eyebrowStyle}>Painel Executivo</Typography>
                  <Typography sx={sectionTitleStyle}>Projetos Cadastrados</Typography>
                  <Typography sx={sectionSubtitleStyle}>
                    Controle, acompanhamento e gestão dos planejamentos ativos.
                  </Typography>
                </Box>
              </Box>

              <Box sx={chipsWrapperStyle}>
                <Chip
                  icon={<AccountTreeIcon sx={{ color: "#312783 !important" }} />}
                  label="Gestão estratégica"
                  sx={purpleChipStyle}
                />

                <Chip
                  icon={<ViewTimelineIcon sx={{ color: "#047857 !important" }} />}
                  label="Fluxograma ativo"
                  sx={greenChipStyle}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3, borderColor: "rgba(148,163,184,0.25)" }} />

            <Paper elevation={0} sx={listCardStyle}>
              <Box sx={hardViewportStyle}>
                <Box sx={safeContentStyle}>
                  <Lista />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        <Box sx={flowCardStyle}>
          <Box sx={hardViewportStyle}>
            <Box sx={safeContentStyle}>
              <FluxoGrama />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const pageStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  boxSizing: "border-box",
  overflow: "hidden",
  isolation: "isolate",
  contain: "inline-size layout paint",
  px: { xs: 1.5, sm: 2, md: 4 },
  pt: { xs: 3, md: 5 },
  pb: 4,
};

const pageInnerStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  overflow: "hidden",
  boxSizing: "border-box",
  contain: "inline-size layout paint",
};

const headerStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  display: "flex",
  alignItems: { xs: "flex-start", md: "center" },
  justifyContent: "space-between",
  flexDirection: { xs: "column", md: "row" },
  gap: 2,
  pb: 3,
  overflow: "hidden",
};

const titleGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.6,
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
};

const mainIconStyle = {
  width: { xs: 44, md: 48 },
  height: { xs: 44, md: 48 },
  minWidth: { xs: 44, md: 48 },
  borderRadius: "16px",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 14px 30px rgba(49,39,131,0.28)",
};

const eyebrowStyle = {
  fontSize: "12px",
  fontWeight: 900,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  whiteSpace: { xs: "normal", md: "nowrap" },
};

const pageTitleStyle = {
  fontSize: { xs: 22, sm: 24, md: 32 },
  fontWeight: 950,
  color: "#0f172a",
  lineHeight: 1.05,
  wordBreak: "break-word",
};

const primaryButtonStyle = {
  height: 44,
  px: 2.6,
  borderRadius: "14px",
  fontWeight: 950,
  textTransform: "none",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  boxShadow: "0 14px 30px rgba(49,39,131,0.28)",
  whiteSpace: "nowrap",
  alignSelf: { xs: "stretch", sm: "flex-start", md: "center" },
  flexShrink: 0,
  "&:hover": {
    background: "linear-gradient(135deg, #241d66, #5c4df2)",
    boxShadow: "0 18px 38px rgba(49,39,131,0.34)",
    transform: "translateY(-1px)",
  },
  transition: "all 0.25s ease",
};

const mainCardStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  mt: 1,
  minHeight: "58vh",
  borderRadius: { xs: "22px", md: "28px" },
  overflow: "hidden",
  boxSizing: "border-box",
  contain: "inline-size layout paint",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(246,247,251,0.98))",
  boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
  border: "1px solid rgba(226,232,240,0.9)",
};

const topBarStyle = {
  height: 8,
  background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
};

const contentStyle = {
  p: { xs: 1.5, sm: 2, md: 4 },
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  contain: "inline-size layout paint",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: { xs: "flex-start", md: "center" },
  justifyContent: "space-between",
  flexDirection: { xs: "column", md: "row" },
  gap: 2,
  mb: 3,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
};

const sectionIconStyle = {
  width: { xs: 48, md: 54 },
  height: { xs: 48, md: 54 },
  minWidth: { xs: 48, md: 54 },
  borderRadius: "18px",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 18px 36px rgba(49,39,131,0.28)",
};

const sectionTitleStyle = {
  fontSize: { xs: 20, md: 28 },
  fontWeight: 950,
  color: "#0f172a",
  lineHeight: 1.05,
  wordBreak: "break-word",
};

const sectionSubtitleStyle = {
  color: "#64748b",
  fontSize: 14,
  mt: 0.8,
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const chipsWrapperStyle = {
  display: "flex",
  gap: 1,
  flexWrap: "wrap",
  maxWidth: "100%",
  minWidth: 0,
};

const purpleChipStyle = {
  height: 38,
  px: 1,
  borderRadius: "12px",
  fontWeight: 900,
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.08)",
  border: "1px solid rgba(49,39,131,0.16)",
};

const greenChipStyle = {
  height: 38,
  px: 1,
  borderRadius: "12px",
  fontWeight: 900,
  color: "#047857",
  backgroundColor: "rgba(16,185,129,0.10)",
  border: "1px solid rgba(16,185,129,0.18)",
};

const listCardStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  borderRadius: "24px",
  overflow: "hidden",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
  p: { xs: 1, md: 2 },
  boxSizing: "border-box",
  contain: "inline-size layout paint",
};

const flowCardStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  mt: 3,
  mb: 4,
  borderRadius: { xs: "22px", md: "28px" },
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.98))",
  boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
  border: "1px solid rgba(226,232,240,0.9)",
  p: { xs: 1.5, md: 3 },
  boxSizing: "border-box",
  contain: "inline-size layout paint",
};

const hardViewportStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  boxSizing: "border-box",
  contain: "inline-size layout paint",
};

const safeContentStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflowX: "auto",
  overflowY: "hidden",
  boxSizing: "border-box",
  WebkitOverflowScrolling: "touch",
  scrollbarGutter: "stable",
  "& > *": {
    maxWidth: "100%",
    minWidth: "0 !important",
    boxSizing: "border-box",
  },
  "& table": {
    maxWidth: "100%",
  },
  "& svg": {
    maxWidth: "100%",
  },
};

export default Projetos;