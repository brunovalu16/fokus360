import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";
import PieChartIcon from "@mui/icons-material/PieChart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";

import DadosProjetogeral2 from "../../components/DadosProjetogeral2";

function PlanejamentoGeral() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  const [solicitanteFiltrado, setSolicitanteFiltrado] = useState(null);

  return (
    <Box sx={pageStyle}>
      <Box sx={pageInnerStyle}>
        <Box sx={headerStyle}>
          <Header
            title={
              <Box sx={titleGroupStyle}>
                <Box sx={mainIconStyle}>
                  <PieChartIcon sx={{ color: "#fff", fontSize: 28 }} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={eyebrowStyle}>Dashboard 360</Typography>

                  <Typography sx={pageTitleStyle}>
                    Grupo Fokus
                  </Typography>
                </Box>
              </Box>
            }
          />

          {!isXsDevices && (
            <Button
              component={Link}
              to="/planejamento"
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              sx={primaryButtonStyle}
            >
              Novo Planejamento
            </Button>
          )}
        </Box>

        <Box sx={mainCardStyle}>
          <Box sx={topBarStyle} />

          <Box sx={contentStyle}>
            <Box sx={hardViewportStyle}>
              <Box sx={safeContentStyle}>
                <DadosProjetogeral2
                  solicitanteFiltrado={solicitanteFiltrado}
                  setSolicitanteFiltrado={setSolicitanteFiltrado}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

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

export default PlanejamentoGeral;