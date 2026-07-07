// src/pages/planejamento/RelatorioEapPlanejamento.jsx

import React, { useEffect, useMemo, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

import {
  Alert,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config";

import RelatorioEapAreaPrint from "../../components/planejamento/RelatorioEapAreaPrint";

import {
  listarAreasDoProjeto,
  montarRelatorioPorArea,
} from "../../utils/eapReportUtils";

const PrintGlobalStyle = createGlobalStyle`
  @media print {
    @page {
      size: A4 landscape;
      margin: 8mm;
    }

    html,
    body {
      background: #ffffff !important;
      margin: 0 !important;
      padding: 0 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body * {
      visibility: hidden;
    }

    .eap-print-root,
    .eap-print-root * {
      visibility: visible;
    }

    .no-print {
      display: none !important;
      visibility: hidden !important;
    }

    .eap-print-root {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      max-width: none;
      margin: 0;
    }
  }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #eef2f8;
  padding: 24px;
  font-family: "Poppins", Arial, sans-serif;

  @media print {
    background: #ffffff !important;
    padding: 0 !important;
  }
`;

const Toolbar = styled.div.attrs({
  className: "no-print",
})`
  max-width: 1280px;
  margin: 0 auto 24px auto;
  padding: 18px 22px;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ToolbarTitle = styled.div`
  font-size: 22px;
  font-weight: 900;
  color: #312783;
  line-height: 1.1;
`;

const ToolbarSubtitle = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const LoadingPage = styled.div`
  min-height: 100vh;
  background: #eef2f8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ErrorPage = styled.div`
  min-height: 100vh;
  background: #eef2f8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const EmptyBox = styled.div.attrs({
  className: "no-print",
})`
  padding: 32px;
  max-width: 1280px;
  margin: 0 auto;
`;

const RelatorioEapPlanejamento = () => {
  const { projetoId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [projeto, setProjeto] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const areaFiltro = searchParams.get("area") || "TODAS";

  useEffect(() => {
    const carregarDados = async () => {
      if (!projetoId) {
        setErro("Projeto não informado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErro("");

        const projetoRef = doc(dbFokus360, "projetos", projetoId);
        const projetoSnap = await getDoc(projetoRef);

        if (!projetoSnap.exists()) {
          setErro("Projeto não encontrado.");
          setLoading(false);
          return;
        }

        const areasSnap = await getDocs(collection(dbFokus360, "areas"));

        const listaAreas = areasSnap.docs
          .map((areaDoc) => ({
            id: areaDoc.id,
            nome: areaDoc.data().nome,
          }))
          .filter((area) => area.nome);

        setProjeto({
          id: projetoSnap.id,
          ...projetoSnap.data(),
        });

        setAreas(listaAreas);
      } catch (error) {
        console.error("Erro ao carregar relatório EAP:", error);
        setErro("Erro ao carregar relatório EAP.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [projetoId]);

  const areasDisponiveis = useMemo(() => {
    return listarAreasDoProjeto(projeto?.estrategicas || [], areas);
  }, [projeto, areas]);

  const relatorioAreas = useMemo(() => {
    if (!projeto) return [];

    return montarRelatorioPorArea(
      projeto.estrategicas || [],
      areas,
      areaFiltro
    );
  }, [projeto, areas, areaFiltro]);

  useEffect(() => {
    const autoPrint = searchParams.get("autoPrint") === "1";

    if (autoPrint && relatorioAreas.length > 0) {
      const timer = setTimeout(() => {
        window.print();
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [relatorioAreas, searchParams]);

  const handleChangeArea = (event) => {
    const novaArea = event.target.value;

    const params = new URLSearchParams(searchParams);
    params.set("area", novaArea);
    params.delete("autoPrint");

    setSearchParams(params);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <LoadingPage>
        <CircularProgress />
        <Typography mt={2}>Carregando relatório por área...</Typography>
      </LoadingPage>
    );
  }

  if (erro) {
    return (
      <ErrorPage>
        <Alert severity="error">{erro}</Alert>

        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </ErrorPage>
    );
  }

  return (
    <Page>
      <PrintGlobalStyle />

      <Toolbar>
        <div>
          <ToolbarTitle>Relatório EAP por Área</ToolbarTitle>
          <ToolbarSubtitle>
            {projeto?.nome || "Projeto sem nome"}
          </ToolbarSubtitle>
        </div>

        <ToolbarActions>
          <Select
            size="small"
            value={areaFiltro}
            onChange={handleChangeArea}
            sx={{
              minWidth: 220,
              backgroundColor: "#fff",
              borderRadius: "10px",
              fontWeight: 700,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#cbd5e1",
              },
            }}
          >
            <MenuItem value="TODAS">Todas as áreas</MenuItem>

            {areasDisponiveis.map((area) => (
              <MenuItem key={area} value={area}>
                {area}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: "10px",
              fontWeight: 700,
              color: "#312783",
              borderColor: "#312783",
              "&:hover": {
                borderColor: "#20175f",
                backgroundColor: "rgba(49, 39, 131, 0.06)",
              },
            }}
          >
            Voltar
          </Button>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              borderRadius: "10px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #312783, #0069f7)",
              boxShadow: "0 10px 25px rgba(49, 39, 131, 0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #20175f, #0055c8)",
              },
            }}
          >
            Imprimir
          </Button>

          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handlePrint}
            sx={{
              borderRadius: "10px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #fa4f58, #ff8a00)",
              boxShadow: "0 10px 25px rgba(250, 79, 88, 0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #d63b44, #e67600)",
              },
            }}
          >
            Salvar PDF
          </Button>
        </ToolbarActions>
      </Toolbar>

      {relatorioAreas.length === 0 ? (
        <EmptyBox>
          <Alert severity="warning">
            Nenhuma informação encontrada para a área selecionada.
          </Alert>
        </EmptyBox>
      ) : (
        <RelatorioEapAreaPrint
          projeto={projeto}
          relatorioAreas={relatorioAreas}
        />
      )}
    </Page>
  );
};

export default RelatorioEapPlanejamento;