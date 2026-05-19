import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Paper, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { dbFokus360 } from "../../data/firebase-config";
import { LinkPowerbi } from "../../components/LinkPowerbi";

const RelatorioPowerBI = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [relatorio, setRelatorio] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarRelatorio = async () => {
      try {
        const ref = doc(dbFokus360, "relatorios", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setRelatorio({
            id: snap.id,
            ...snap.data(),
          });
        }
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarRelatorio();
  }, [id]);

  if (carregando) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!relatorio) {
    return (
      <Box sx={{ p: 5 }}>
        <Paper sx={{ p: 4, borderRadius: "24px" }}>
          <Typography sx={{ fontSize: 22, fontWeight: 900 }}>
            Relatório não encontrado.
          </Typography>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/relatorios")}
            sx={{ mt: 2 }}
          >
            Voltar para relatórios
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: "24px",
          border: "1px solid rgba(226,232,240,0.9)",
          background: "linear-gradient(135deg, #ffffff, #f8fafc)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #312783, #6d5dfc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <AssessmentIcon />
          </Box>

          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 900, color: "#64748b" }}>
              {relatorio.areaRelatorio || "POWER BI"}
            </Typography>

            <Typography sx={{ fontSize: { xs: 20, md: 26 }, fontWeight: 950 }}>
              {relatorio.nomeRelatorio}
            </Typography>
          </Box>
        </Box>

        <Button
          startIcon={<ExitToAppIcon sx={{ color: "#5f53e5" }} />}
          onClick={() => navigate("/relatorios")}
          sx={{
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 800,
            color: "#5f53e5"
          }}
        >
          Voltar
        </Button>
      </Paper>

      <LinkPowerbi
        url={relatorio.linkRelatorio}
        descripton={relatorio.areaRelatorio || "Relatório Power BI"}
        title={relatorio.nomeRelatorio || "Relatório"}
        linkText="Abrir Relatório"
      />
    </Box>
  );
};

export default RelatorioPowerBI;