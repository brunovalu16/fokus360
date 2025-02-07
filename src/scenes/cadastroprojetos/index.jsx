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
import { Header } from "../../components";
import BaseDiretriz from "../../components/BaseDiretriz";
import InformacoesProjeto from "../../components/InformacoesProjeto";

// IMPORTS DO FIREBASE
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const CadastroProjetos = () => {
  const [mensagem, setMensagem] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [informacoesProjeto, setInformacoesProjeto] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    prazoPrevisto: "",
    unidade: "",
    solicitante: "",
    solicitanteEmail: "",
    categoria: "",
    colaboradores: [],
    orcamento: "",
    diretrizes: [],
  });

  useEffect(() => {
    //console.log("📌 Estado atualizado de informacoesProjeto antes de salvar:", informacoesProjeto);
  }, [informacoesProjeto]);
  

  const diretrizes = informacoesProjeto.diretrizes;


  //Atualiza o Pai para limpar os campos
  useEffect(() => {
    setInterval(setMensagem(false), 2000);
  },[mensagem]);

  

  const handleEstrategicasUpdate = (estrategicasAtualizadas) => {
    //console.log("📢 CadastroProjetos recebeu estratégicas:", JSON.stringify(estrategicasAtualizadas, null, 2));

    setInformacoesProjeto((prev) => {
        // Se estiver vazio, simplesmente sobrescreve com o novo array
        if (!estrategicasAtualizadas || estrategicasAtualizadas.length === 0) {
            return { ...prev, estrategicas: [] };
        }

        const atualizado = {
            ...prev,
            estrategicas: estrategicasAtualizadas.map((novaEstrategica) => {
                const antigaEstrategica = prev.estrategicas.find(e => e.id === novaEstrategica.id);

                return {
                    ...novaEstrategica,
                    taticas: novaEstrategica.taticas?.map(tatica => {
                        const antigaTatica = antigaEstrategica?.taticas?.find(t => t.id === tatica.id);

                        return {
                            ...tatica,
                            operacionais: tatica.operacionais?.map(op => {
                                const antigaOperacional = antigaTatica?.operacionais?.find(o => o.id === op.id);

                                return {
                                    ...op,
                                    tarefas: op.tarefas?.length > 0 ? op.tarefas :
                                        antigaOperacional?.tarefas || []
                                };
                            }) || []
                        };
                    }) || []
                };
            })
        };

        console.log("📢 Depois do setInformacoesProjeto (com tarefas corretas):", JSON.stringify(atualizado, null, 2));
        return atualizado;
    });
};

// Função para limpar campos após salvar
{/**
  const limparestado = () => {
  console.log("�� Limpando estado de informacoesProjeto:");
  setMensagem(true);
  console.log(mensagem);
};

  
  */}



const handleAdicionarProjeto = async () => {
  try {
    //console.log("📌 Estado final de informacoesProjeto antes de salvar:", JSON.stringify(informacoesProjeto, null, 2));

    const db = getFirestore();

    const projetoData = {
      nome: informacoesProjeto.nome,
      descricao: informacoesProjeto.descricao,
      dataInicio: informacoesProjeto.dataInicio,
      prazoPrevisto: informacoesProjeto.prazoPrevisto,
      unidade: informacoesProjeto.unidade,
      solicitante: informacoesProjeto.solicitante,
      solicitanteEmail: informacoesProjeto.solicitanteEmail,
      categoria: informacoesProjeto.categoria,
      colaboradores: informacoesProjeto.colaboradores,
      orcamento: informacoesProjeto.orcamento,
      createdAt: new Date(),

      diretrizes: (informacoesProjeto.estrategicas || []).map((estrategica) => ({
        id: estrategica.id || Date.now(),
        titulo: estrategica.titulo,
        descricao: estrategica.descricao,
        taticas: (estrategica.taticas || []).map((tatica) => ({
          id: tatica.id || Date.now(),
          titulo: tatica.titulo,
          descricao: tatica.descricao,
          operacionais: (tatica.operacionais || []).map((operacional) => ({
            id: operacional.id || Date.now(),
            titulo: operacional.titulo,
            descricao: operacional.descricao,
            tarefas: (operacional.tarefas || []).map((tarefa) => ({
              id: tarefa.id || Date.now(),
              tituloTarefa: tarefa.tituloTarefa,
              planoDeAcao: {
                oQue: tarefa.planoDeAcao.oQue || "",
                porQue: tarefa.planoDeAcao.porQue || "",
                quem: tarefa.planoDeAcao.quem || [],
                quando: tarefa.planoDeAcao.quando || "",
                onde: tarefa.planoDeAcao.onde || "",
                como: tarefa.planoDeAcao.como || "",
                valor: tarefa.planoDeAcao.valor || "",
              }
            }))
          }))
        }))
      })),
    };

    const projetoRef = doc(collection(db, "projetos"));
    await setDoc(projetoRef, projetoData);

    setShowAlert(true);

    setMensagem(true);
    console.log(mensagem);

  } catch (error) {
    console.error("Erro ao adicionar projeto:", error.message);
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
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <DialogContent>
          <Alert 
            severity="success" 
            sx={{ backgroundColor: "#30db33", color: "green", "& .MuiAlert-icon": { color: "white", marginTop: "10px", fontSize: "30px" } }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h5" sx={{ color: "#125b07", marginLeft: "10px", marginTop: "2px" }}>
                Projeto adicionado com sucesso!
              </Typography>
              <Button
                onClick={() => setShowAlert(false)}
                sx={{ fontSize: "20px", marginTop: "2px", marginLeft: "150px", backgroundColor: "#2dce30", color: "white"  }}
                > OK </Button>
            </Box>
          </Alert>
        </DialogContent>



      </Dialog>

      <Box sx={{ padding: "30px", margin: "40px", backgroundColor: "#f2f0f0" }}>
        <Accordion sx={{ borderRadius: "10px", marginBottom: "15px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PlayCircleFilledWhiteIcon sx={{ color: "#22d3ee", fontSize: 25, marginRight: "10px" }} />
            <Typography sx={{ marginTop: "4px" }}>ADICIONAR INFORMAÇÕES DO PROJETO</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <InformacoesProjeto onUpdate={setInformacoesProjeto} LimpaEstado={mensagem} />
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ borderRadius: "10px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PlayCircleFilledWhiteIcon sx={{ color: "#312783", fontSize: 25, marginRight: "10px" }} />
            <Typography sx={{ marginTop: "4px" }}>ADICIONAR DIRETRIZES DO PROJETO</Typography>
          </AccordionSummary>
          <AccordionDetails>


          <BaseDiretriz
            projectId={projectId}
            estrategicas={informacoesProjeto.estrategicas} 
            onUpdate={handleEstrategicasUpdate} 
            LimpaEstado={mensagem}
          />




          </AccordionDetails>
        </Accordion>

        <Box display="flex" justifyContent="flex-end" marginTop="20px">
          <Button
            onClick={handleAdicionarProjeto}
            variant="contained"
            sx={{
              backgroundColor: "#5f53e5",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#5f53e5",
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
