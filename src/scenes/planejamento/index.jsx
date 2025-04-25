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
import BaseDiretriz3 from "../../components/BaseDiretriz3";
import InformacoesPlanejamento from "../../components/InformacoesPlanejamento";


// IMPORTS DO FIREBASE
import { dbFokus360 } from "../../data/firebase-config"; // ✅ Usa a instância correta
import { collection, doc, setDoc } from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storageFokus360 } from "../../data/firebase-config"; // Seu Storage Fokus360



const Planejamento = () => {
  const [mensagem, setMensagem] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [formValuesCompletos, setFormValuesCompletos] = useState(null);
  const [informacoesPlanejamento, setInformacoesPlanejamento] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    prazoPrevisto: "",
    unidade: "",
    solicitante: "",
    solicitanteEmail: "",
    colaboradorEmail: "",
    categoria: "",
    colaboradores: [],
    orcamento: "",
    estrategicas: [],
  });

  

  useEffect(() => {
    //console.log("📌 Estado atualizado de informacoesPlanejamento antes de salvar:", informacoesPlanejamento);
  }, [informacoesPlanejamento]);
  

  const diretrizes = informacoesPlanejamento.diretrizes;


  const handleSalvarEstrategicasNoFirestore = async (novoArrayEstrategicas) => {
    try {
      if (!projectId) {
        alert("Project ID não definido. Salve primeiro as informações do projeto (para ter um ID).");
        return;
      }

      const docRef = doc(dbFokus360, "projetos", projectId);

      // A ideia é mandar todo o informacoesPlanejamento, mas atualizando
      // a parte de "estrategicas" com o array novo que o BaseDiretriz3 passou.
      await updateDoc(docRef, {
        ...informacoesPlanejamento,
        estrategicas: novoArrayEstrategicas,
        updatedAt: new Date(),
      });

      // Atualiza no state local, pra ficar coerente
      setInformacoesPlanejamento((prev) => ({
        ...prev,
        estrategicas: novoArrayEstrategicas,
      }));

      alert("Estratégicas salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar estratégicas:", error);
      alert("Erro ao salvar estratégicas. Verifique console.");
    }
  };


   // 3) Função p/ SALVAR INFORMAÇÕES GERAIS DO PROJETO
  // (exemplo de como você já faz)
  // -----------------------------
  const handleSalvarInformacoesPlanejamento = async () => {
    try {
      if (!informacoesPlanejamento.nome.trim()) {
        alert("O nome do projeto é obrigatório!");
        return;
      }

      // Monta o objeto p/ Firestore
      const projetoData = {
        ...informacoesPlanejamento,
        createdAt: new Date(),
      };

      // Exemplo: se for criar um novo doc
      const novoDocRef = doc(collection(dbFokus360, "projetos"));
      await setDoc(novoDocRef, projetoData);
      setProjectId(projetoRef.id);

      // Guardamos o ID
      setProjectId(novoDocRef.id);

      alert("Informações gerais salvas com sucesso! Project ID: " + novoDocRef.id);
    } catch (error) {
      console.error("Erro ao salvar informações:", error);
      alert("Erro ao salvar informações. Verifique console.");
    }
  };



  

  const handleEstrategicasUpdate = (estrategicasAtualizadas) => {
    //console.log("📢 CadastroProjetos recebeu estratégicas:", JSON.stringify(estrategicasAtualizadas, null, 2));

    setInformacoesPlanejamento((prev) => {
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

        console.log("📢 Depois do setInformacoesPlanejamento (com tarefas corretas):", JSON.stringify(atualizado, null, 2));
        return atualizado;
    });
};

// Função para limpar campos após salvar
{/**
  const limparestado = () => {
  console.log("�� Limpando estado de informacoesPlanejamento:");
  setMensagem(true);
  console.log(mensagem);
};

  
  */}




  //Função para adicionar projetos
  const handleAdicionarProjeto = async () => {
    try {
      if (!formValuesCompletos || !formValuesCompletos.nome?.trim()) {
        alert("O nome do projeto é obrigatório!");
        return;
      }
  
      // ✅ Upload do banner, se existir
      let bannerUrl = "";
      if (formValuesCompletos.bannerFile) {
        const storageRef = ref(
          storageFokus360,
          `banners/${Date.now()}_${formValuesCompletos.bannerFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, formValuesCompletos.bannerFile);
        bannerUrl = await getDownloadURL(snapshot.ref);
        console.log("✅ Banner enviado para o Storage:", bannerUrl);
      }
  
      // Montar estrutura em ÁRVORE
      const projetoData = {
        ...formValuesCompletos,
        bannerUrl, // 👈 Agora será salvo
        nome: informacoesPlanejamento.nome,
        descricao: informacoesPlanejamento.descricao,
        dataInicio: informacoesPlanejamento.dataInicio,
        prazoPrevisto: informacoesPlanejamento.prazoPrevisto,
        unidade: informacoesPlanejamento.unidade,
        solicitante: informacoesPlanejamento.solicitante,
        solicitanteEmail: informacoesPlanejamento.solicitanteEmail,
        colaboradorEmail: informacoesPlanejamento.colaboradorEmail,
        categoria: informacoesPlanejamento.categoria,
        colaboradores: informacoesPlanejamento.colaboradores,
        orcamento: informacoesPlanejamento.orcamento,
        createdAt: new Date(),
        estrategicas: (informacoesPlanejamento.estrategicas || []).map((estrategica) => ({
          id: estrategica.id?.toString() || Date.now().toString(),
          titulo: estrategica.titulo || "",
          descricao: estrategica.descricao || "",
          emails: estrategica.emails || [],
          areas: informacoesPlanejamento.areasResponsaveis || [],
          unidade: informacoesPlanejamento.unidade,
          taticas: (estrategica.taticas || []).map((tatica) => ({
            id: tatica.id?.toString() || Date.now().toString(),
            titulo: tatica.titulo || "",
            descricao: tatica.descricao || "",
            emails: tatica.emails || [],
            areas: informacoesPlanejamento.areastaticasSelecionadas || [],
            unidade: informacoesPlanejamento.unidade,
            operacionais: (tatica.operacionais || []).map((operacional) => ({
              id: operacional.id?.toString() || Date.now().toString(),
              titulo: operacional.titulo || "",
              descricao: operacional.descricao || "",
              emails: operacional.emails || [],
              areas: informacoesPlanejamento.areasoperacionalSelecionadas || [],
              unidade: informacoesPlanejamento.unidade,
              tarefas: (operacional.tarefas || []).map((tarefa) => ({
                id: tarefa.id?.toString() || Date.now().toString(),
                tituloTarefa: tarefa.tituloTarefa || "",
                planoDeAcao: {
                  oQue: tarefa.planoDeAcao?.oQue || "",
                  porQue: tarefa.planoDeAcao?.porQue || "",
                  quem: tarefa.planoDeAcao?.quem || [],
                  quemEmail: tarefa.planoDeAcao?.quemEmail || [],
                  quando: tarefa.planoDeAcao?.quando || "",
                  onde: tarefa.planoDeAcao?.onde || "",
                  como: tarefa.planoDeAcao?.como || "",
                  valor: tarefa.planoDeAcao?.valor || "",
                },
              })),
            })),
          })),
        })),
      };

      // Remove campos que o Firestore não suporta
      delete projetoData.bannerFile;
      delete projetoData.bannerPreview;
  
      // Salvar no Firestore
      const projetoRef = doc(collection(dbFokus360, "projetos"));
      await setDoc(projetoRef, projetoData);
      setProjectId(projetoRef.id);
  

      setShowAlert(true);
      setMensagem(true);
      console.log("✅ Projeto adicionado no Firestore com banner.");
      // ---------------------------
      // Enviar E-MAILS + NOTIFICAÇÕES
      // ---------------------------
      let emailsToNotify = [];
  
      if (informacoesPlanejamento.colaboradorEmail) {
        const colaboradores = informacoesPlanejamento.colaboradorEmail.split(/[,;]/).map(e => e.trim());
        emailsToNotify = [...emailsToNotify, ...colaboradores];
      }
  
      (informacoesPlanejamento.estrategicas || []).forEach(estrategica => {
        (estrategica.taticas || []).forEach(tatica => {
          (tatica.operacionais || []).forEach(op => {
            (op.tarefas || []).forEach(tarefa => {
              if (tarefa.planoDeAcao?.quemEmail) {
                const responsaveis = tarefa.planoDeAcao.quemEmail.split(/[,;]/).map(e => e.trim());
                emailsToNotify = [...emailsToNotify, ...responsaveis];
              }
            });
          });
        });
      });
  
      emailsToNotify = [...new Set(emailsToNotify.filter(email => email))];
  
      if (emailsToNotify.length > 0) {
        await fetch('https://fokus360-backend.vercel.app/send-project-emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emails: emailsToNotify,
            tituloProjeto: informacoesPlanejamento.nome,
            descricaoProjeto: informacoesPlanejamento.descricao,
          }),
        });
  
        await fetch('https://fokus360-backend.vercel.app/send-project-notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userIds: informacoesPlanejamento.colaboradores,
            mensagem: `Você foi adicionado ao projeto: ${informacoesPlanejamento.nome}`,
          }),
        });
      }
  
      setShowAlert(true);
      setMensagem(true);
      console.log("✅ Projeto adicionado no formato ÁRVORE!");
  
    } catch (error) {
      console.error("❌ Erro ao adicionar projeto:", error.message);
      alert("Erro ao adicionar projeto. Tente novamente.");
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


          <InformacoesPlanejamento
            onUpdate={(prev) => setInformacoesPlanejamento(prev)}
            onSaveProjectId={(id) => setProjectId(id)}
            onChangeFormValues={(values) => setFormValuesCompletos(values)} // 👈 ESSE!
          />





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
                SALVAR INFORMAÇÕES DO PROJETO
              </Button>
            </Box>

          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ borderRadius: "10px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <PlayCircleFilledWhiteIcon sx={{ color: "#312783", fontSize: 25, marginRight: "10px" }} />
            <Typography sx={{ marginTop: "4px" }}>ADICIONAR DIRETRIZES DO PROJETO</Typography>
          </AccordionSummary>
          <AccordionDetails>


          <BaseDiretriz3
            projectId={projectId} // 🔥 ESSENCIAL para salvar corretamente
            estrategicas={informacoesPlanejamento.estrategicas}
            onUpdate={(estrategicasAtualizadas) => {
              setInformacoesPlanejamento((prev) => ({
                ...prev,
                estrategicas: estrategicasAtualizadas,
              }));
            }}
          />






          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default Planejamento;