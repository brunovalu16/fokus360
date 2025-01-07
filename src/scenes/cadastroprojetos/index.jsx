import React, { useState } from "react";
import { Dialog, DialogContent, Alert, Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import DescriptionIcon from "@mui/icons-material/Description";
import { Header } from "../../components";
import BaseDiretriz from "../../components/BaseDiretriz";
import InformacoesProjeto from "../../components/InformacoesProjeto";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const CadastroProjetos = () => {
  const [diretrizes, setDiretrizes] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [informacoesProjeto, setInformacoesProjeto] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    prazoPrevisto: "",
    unidade: "",
    solicitante: "",
    categoria: "",
    colaboradores: [],
    orcamento: "",
    diretrizes: [],
  });

  // Atualizar o estado diretrizes
  const handleDiretrizesUpdate = (novaDiretriz) => {
    setDiretrizes((prev) => {
      const updatedDiretrizes = Array.isArray(prev) ? [...prev, novaDiretriz] : [novaDiretriz];
      setInformacoesProjeto((prevProjeto) => ({
        ...prevProjeto,
        diretrizes: updatedDiretrizes,
      }));
      return updatedDiretrizes;
    });
  };

  // Função assíncrona para adicionar um projeto ao Firebase
  const handleAdicionarProjeto = async () => {
    try {
      const db = getFirestore();

      if (!informacoesProjeto.nome || !informacoesProjeto.solicitante) {
        alert("Todos os campos obrigatórios precisam ser preenchidos!");
        return;
      }
      

      if (!Array.isArray(diretrizes) || diretrizes.length === 0) {
        console.warn("Nenhuma diretriz válida foi encontrada para este projeto.");
        return;
      }

      console.log("Diretrizes antes do envio:", JSON.stringify(diretrizes, null, 2));

      const cleanDiretrizes = diretrizes.map((diretriz) => ({
        ...diretriz,
        tarefas: Array.isArray(diretriz.tarefas) ? diretriz.tarefas : [],
      }));

      const projetoRef = doc(collection(db, "projetos"));
      await setDoc(projetoRef, {
        ...informacoesProjeto,
        diretrizes: cleanDiretrizes,
        createdAt: new Date(),
      });

      console.log("✅ Projeto adicionado com sucesso:", projetoRef.id);
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao adicionar projeto:", error.message);
      alert("Erro ao adicionar projeto. Verifique o console.");
    }
  };

  return (
    <>
      <Box sx={{ marginLeft: "40px", paddingTop: "50px" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <DescriptionIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
              <Typography>CADASTRO DE PROJETOS</Typography>
            </Box>
          }
        />
      </Box>

      <Dialog
        open={showAlert}
        maxWidth="sm"
        fullWidth
        onClose={() => setShowAlert(false)}
        PaperProps={{
          sx: {
            backgroundColor: "transparent", // Remove o fundo branco
            boxShadow: "none", // Remove sombras
          },
        }}
      >
        <DialogContent sx={{ backgroundColor: "transparent", padding: 0 }}>
          <Alert severity="success" sx={{ backgroundColor: "#f0fff4" }}>
            <Typography variant="h6">
              Projeto adicionado com sucesso!
            </Typography>
          </Alert>
        </DialogContent>
      </Dialog>

      <Box sx={{ padding: "30px", margin: "40px", backgroundColor: "#f2f0f0" }}>
        <Accordion sx={{ borderRadius: "10px", marginBottom: "15px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PlayCircleFilledWhiteIcon
              sx={{ color: "#22d3ee", fontSize: 25 }}
            />
            <Typography>ADICIONAR INFORMAÇÕES DO PROJETO</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <InformacoesProjeto onUpdate={setInformacoesProjeto} />
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ borderRadius: "10px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PlayCircleFilledWhiteIcon
              sx={{ color: "#5f53e5", fontSize: 25 }}
            />
            <Typography>ADICIONAR DIRETRIZES DO PROJETO</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <BaseDiretriz onUpdate={handleDiretrizesUpdate} />
          </AccordionDetails>
        </Accordion>

        <Box display="flex" justifyContent="flex-end" marginTop="20px">
          <Button
            onClick={handleAdicionarProjeto}
            variant="contained"
            sx={{ backgroundColor: "#5f53e5", color: "#fff" }}
          >
            ADICIONAR PROJETO
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CadastroProjetos;
