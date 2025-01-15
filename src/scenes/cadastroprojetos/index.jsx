import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Alert,
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import DescriptionIcon from "@mui/icons-material/Description";

// IMPORTS DOS SEUS COMPONENTES
import { Header } from "../../components";       // Ajuste o caminho se necessário
import BaseDiretriz from "../../components/BaseDiretriz";
import InformacoesProjeto from "../../components/InformacoesProjeto";

// IMPORTS DO FIREBASE
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const CadastroProjetos = () => {
  // ---------------------------------------------------------
  // 1) ESTADO PRINCIPAL (pai) guarda TUDO do projeto:
  // ---------------------------------------------------------
  const [showAlert, setShowAlert] = useState(false);
  const [mensagem, setMensagem] = useState(false);
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
    diretrizes: [], // <--- array de diretrizes também está aqui
  });

  // Facilita ler/salvar "diretrizes" sem precisar ficar escrevendo tanto
  const diretrizes = informacoesProjeto.diretrizes;

  // ---------------------------------------------------------
  // 2) FUNÇÃO QUE ATUALIZA APENAS A LISTA DE DIRETRIZES
  //    (Chamado quando BaseDiretriz ou DiretrizData muda algo)
  // ---------------------------------------------------------
  const handleDiretrizesUpdate = (diretrizesAtualizadas) => {
    setInformacoesProjeto((prev) => ({
      ...prev,
      diretrizes: diretrizesAtualizadas,
    }));
  };

  // ---------------------------------------------------------
  // 3) FUNÇÃO PARA SALVAR PROJETO NO FIREBASE
  // ---------------------------------------------------------
  const handleAdicionarProjeto = async () => {
    try {
      const db = getFirestore();

      // Valida campos obrigatórios
      if (!informacoesProjeto.nome ||!informacoesProjeto.solicitante) {
        alert("Todos os campos obrigatórios precisam ser preenchidos!");
        return;
      }

      if (!Array.isArray(diretrizes) || diretrizes.length === 0) {
        console.warn("Nenhuma diretriz válida foi encontrada para este projeto.");
        return;
      }

      // Apenas para debug:
      console.log("Diretrizes antes do envio:", JSON.stringify(diretrizes, null, 2));

      // Garante que cada diretriz tenha tarefas como array
      const cleanDiretrizes = diretrizes.map((d) => ({
        ...d,
        tarefas: Array.isArray(d.tarefas) ? d.tarefas : [],
      }));

      // Cria documento no Firestore
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
    setMensagem(true);
  };

  useEffect(() => {
    setInterval(setMensagem(false), 2000);
  },[mensagem]);

  /**
  const LimpaEstado = () => {
    setInformacoesProjeto({
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
  };
   */


  // ---------------------------------------------------------
  // 4) RENDER
  // ---------------------------------------------------------
  return (
    <>
      {/* Cabeçalho */}
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

      {/* Alerta de sucesso */}
      <Dialog
        open={showAlert}
        maxWidth="sm"
        fullWidth
        onClose={() => setShowAlert(false)}
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <DialogContent>
        <Alert severity="success">
          <Typography variant="h6">Projeto adicionado com sucesso!</Typography>
          <Button onClick={() => setShowAlert(false)}>OK</Button>
        </Alert>
      </DialogContent>

      </Dialog>

      {/* Accordion principal */}
      <Box sx={{ padding: "30px", margin: "40px", backgroundColor: "#f2f0f0" }}>
        {/* Accordion: Informações do Projeto */}
        <Accordion sx={{ borderRadius: "10px", marginBottom: "15px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PlayCircleFilledWhiteIcon sx={{ color: "#22d3ee", fontSize: 25, marginRight: "10px" }} />
            <Typography sx={{ marginTop: "4px" }}>ADICIONAR INFORMAÇÕES DO PROJETO</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/*
              Passamos setInformacoesProjeto diretamente para <InformacoesProjeto />,
              pois ele modifica várias chaves (nome, datas, etc.).
            */}
            <InformacoesProjeto onUpdate={setInformacoesProjeto} LimpaEstado ={mensagem} />
          </AccordionDetails>
        </Accordion>

        {/* Accordion: Diretrizes */}
        <Accordion sx={{ borderRadius: "10px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PlayCircleFilledWhiteIcon sx={{ color: "#5f53e5", fontSize: 25, marginRight: "10px"  }} />
            <Typography sx={{ marginTop: "4px" }}>ADICIONAR DIRETRIZES DO PROJETO</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/*
              Passamos "diretrizes" e "onUpdate" para o <BaseDiretriz />
              Assim, <BaseDiretriz> não tem state duplicado: 
              ele chama "handleDiretrizesUpdate" quando mexe nas diretrizes.
            */}
            <BaseDiretriz
              diretrizes={diretrizes}
              onUpdate={handleDiretrizesUpdate}
              LimpaEstado={mensagem}
            />
          </AccordionDetails>
        </Accordion>

        {/* Botão para efetivar o cadastro */}
        <Box display="flex" justifyContent="flex-end" marginTop="20px">
        <Button
          onClick={handleAdicionarProjeto}
          variant="contained"
          sx={{
            backgroundColor: "#5f53e5",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#5f53e5", // Mantém a mesma cor ao passar o mouse
            },
          }}
        >
          ADICIONAR PROJETO
        </Button>

        </Box>
      </Box>
    </>
  );
};

export default CadastroProjetos;
