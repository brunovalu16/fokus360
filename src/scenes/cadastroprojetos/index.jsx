import React, { useState } from "react";
import {Dialog, DialogContent, Alert, Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
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
    nome: '',
    descricao: '',
    dataInicio: '',
    prazoPrevisto: '',
    unidade: '',
    solicitante: '',
    categoria: '',
    colaboradores: [],
    orcamento: '',
    diretrizes: [], // Garante que diretrizes exista como array
  });



const handleDiretrizesUpdate = (novaDiretriz) => {
  setDiretrizes((prev) => {
    if (Array.isArray(prev)) {
      return [...prev, novaDiretriz];
    }
    return [novaDiretriz];
  });
};

  



const handleAdicionarProjeto = async () => {
  try {
    const db = getFirestore();

    if (!informacoesProjeto.nome || !informacoesProjeto.solicitante) {
      alert("Os campos 'Nome do Projeto' e 'Solicitante' são obrigatórios!");
      return;
    }

    if (!Array.isArray(diretrizes) || diretrizes.length === 0) {
      console.warn('⚠️ Nenhuma diretriz válida foi encontrada para este projeto.');
      return;
    }

    console.log('📊 Diretrizes antes do envio:', JSON.stringify(diretrizes, null, 2));


    // 🧹 Limpa as diretrizes antes do envio
    const cleanDiretrizes = diretrizes.map(diretriz => {
      const { onUpdate, ...safeDiretriz } = diretriz; // Remove funções específicas
      return {
        ...safeDiretriz,
        tarefas: Array.isArray(diretriz.tarefas)
          ? diretriz.tarefas.map(tarefa => {
              const { onUpdate, ...safeTarefa } = tarefa;
              return { ...safeTarefa };
            })
          : [],
      };
    });

    console.log('📊 Diretrizes limpas:', cleanDiretrizes);

    const projetoRef = doc(collection(db, "projetos"));
    await setDoc(projetoRef, {
      ...informacoesProjeto,
      diretrizes: cleanDiretrizes, // Usa as diretrizes limpas
      createdAt: new Date(),
    });

    console.log('✅ Projeto adicionado com sucesso:', projetoRef.id);

    for (const diretriz of cleanDiretrizes) {
      const diretrizRef = doc(collection(db, `projetos/${projetoRef.id}/diretrizes`));
      await setDoc(diretrizRef, {
        titulo: diretriz.titulo,
        descricao: diretriz.descricao,
        createdAt: new Date(),
      });

      if (Array.isArray(diretriz.tarefas) && diretriz.tarefas.length > 0) {
        for (const tarefa of diretriz.tarefas) {
          const tarefaRef = doc(
            collection(db, `projetos/${projetoRef.id}/diretrizes/${diretrizRef.id}/tarefas`)
          );
          await setDoc(tarefaRef, {
            titulo: tarefa.titulo,
            planoDeAcao: tarefa.planoDeAcao || {},
            createdAt: new Date(),
          });
        }
      }
    }

    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    console.log('🎯 Todos os dados foram salvos corretamente no Firebase!');
  } catch (error) {
    console.error('❌ Erro ao adicionar projeto:', error.message);
    alert('Erro ao adicionar projeto. Verifique o console.');
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

      <Dialog open={showAlert} maxWidth="sm" fullWidth>
        <DialogContent>
          <Alert severity="success">
            <Typography variant="h6">Projeto adicionado com sucesso!</Typography>
          </Alert>
        </DialogContent>
      </Dialog>

      <Box sx={{ padding: "30px", margin: "40px", backgroundColor: "#f2f0f0" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <PlayCircleFilledWhiteIcon sx={{ color: "#5f53e5", fontSize: 30 }} />
              <Typography fontSize="15px">ADICIONE UM PROJETO</Typography>
            </Box>
          }
        />
        <Divider sx={{ marginY: "20px" }} />

        <Accordion sx={{ borderRadius: "10px", marginBottom: "15px" }}>
          <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}>
            <PlayCircleFilledWhiteIcon sx={{ color: "#22d3ee", fontSize: 25, marginRight: "15px" }} />
            <Typography sx={{ color: "#9d9d9c", marginTop: "4px"}} >ADICIONAR INFORMAÇÕES DO PROJETO</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <InformacoesProjeto onUpdate={setInformacoesProjeto} />
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ borderRadius: "10px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}>
            <PlayCircleFilledWhiteIcon sx={{ color: "#5f53e5", fontSize: 25, marginRight: "15px" }} />
            <Typography sx={{ color: "#9d9d9c", marginTop: "4px"}}>ADICIONAR DIRETRIZES DO PROJETO</Typography>
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
