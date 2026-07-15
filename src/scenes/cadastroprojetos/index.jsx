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

// COMPONENTES
import { Header } from "../../components";
import BaseDiretriz from "../../components/BaseDiretriz";
import InformacoesProjeto from "../../components/InformacoesProjeto";

// FIREBASE
import { dbFokus360 } from "../../data/firebase-config";

import {
  collection,
  doc,
  setDoc,
} from "firebase/firestore";

const ESTADO_INICIAL_PROJETO = {
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
};

const CadastroProjetos = () => {
  const [mensagem, setMensagem] = useState(false);

  // ID DO PROJETO QUE ESTÁ SENDO CADASTRADO
  const [projectId, setProjectId] = useState(null);

  const [showAlert, setShowAlert] = useState(false);

  const [salvando, setSalvando] = useState(false);

  const [tipoSalvamento, setTipoSalvamento] = useState("criado");

  const [informacoesProjeto, setInformacoesProjeto] = useState(
    ESTADO_INICIAL_PROJETO
  );

  // ============================================================
  // CONTROLE DE LIMPEZA DOS COMPONENTES FILHOS
  // ============================================================

  useEffect(() => {
    if (!mensagem) return;

    const timer = setTimeout(() => {
      setMensagem(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [mensagem]);

  // ============================================================
  // RECEBE AS DIRETRIZES DO BASE DIRETRIZ
  // ============================================================

  const handleEstrategicasUpdate = (estrategicasAtualizadas) => {
    setInformacoesProjeto((prev) => {
      if (
        !estrategicasAtualizadas ||
        estrategicasAtualizadas.length === 0
      ) {
        return {
          ...prev,
          estrategicas: [],
        };
      }

      const atualizado = {
        ...prev,

        estrategicas: estrategicasAtualizadas.map(
          (novaEstrategica) => {
            const antigaEstrategica = (
              prev.estrategicas || []
            ).find(
              (estrategica) =>
                estrategica.id === novaEstrategica.id
            );

            return {
              ...novaEstrategica,

              taticas: (novaEstrategica.taticas || []).map(
                (tatica) => {
                  const antigaTatica =
                    antigaEstrategica?.taticas?.find(
                      (item) => item.id === tatica.id
                    );

                  return {
                    ...tatica,

                    operacionais: (
                      tatica.operacionais || []
                    ).map((operacional) => {
                      const antigaOperacional =
                        antigaTatica?.operacionais?.find(
                          (item) =>
                            item.id === operacional.id
                        );

                      return {
                        ...operacional,

                        tarefas:
                          operacional.tarefas?.length > 0
                            ? operacional.tarefas
                            : antigaOperacional?.tarefas || [],
                      };
                    }),
                  };
                }
              ),
            };
          }
        ),
      };

      console.log(
        "📢 Projeto atualizado no estado:",
        JSON.stringify(atualizado, null, 2)
      );

      return atualizado;
    });
  };

  // ============================================================
  // MONTA O OBJETO DO PROJETO
  // ============================================================

  const montarProjetoData = () => {
    return {
      nome: informacoesProjeto.nome,

      descricao: informacoesProjeto.descricao,

      dataInicio: informacoesProjeto.dataInicio,

      prazoPrevisto: informacoesProjeto.prazoPrevisto,

      unidade: informacoesProjeto.unidade,

      solicitante: informacoesProjeto.solicitante,

      solicitanteEmail:
        informacoesProjeto.solicitanteEmail,

      colaboradorEmail:
        informacoesProjeto.colaboradorEmail,

      categoria: informacoesProjeto.categoria,

      colaboradores:
        informacoesProjeto.colaboradores || [],

      orcamento: informacoesProjeto.orcamento,

      diretrizes: (
        informacoesProjeto.estrategicas || []
      ).map((estrategica) => ({
        id:
          estrategica.id?.toString() ||
          Date.now().toString(),

        titulo: estrategica.titulo || "",

        descricao: estrategica.descricao || "",

        taticas: (estrategica.taticas || []).map(
          (tatica) => ({
            id:
              tatica.id?.toString() ||
              Date.now().toString(),

            titulo: tatica.titulo || "",

            descricao: tatica.descricao || "",

            operacionais: (
              tatica.operacionais || []
            ).map((operacional) => ({
              id:
                operacional.id?.toString() ||
                Date.now().toString(),

              titulo: operacional.titulo || "",

              descricao:
                operacional.descricao || "",

              tarefas: (
                operacional.tarefas || []
              ).map((tarefa) => ({
                id:
                  tarefa.id?.toString() ||
                  Date.now().toString(),

                tituloTarefa:
                  tarefa.tituloTarefa || "",

                planoDeAcao: {
                  oQue:
                    tarefa.planoDeAcao?.oQue || "",

                  porQue:
                    tarefa.planoDeAcao?.porQue || "",

                  quem:
                    tarefa.planoDeAcao?.quem || [],

                  quemEmail:
                    tarefa.planoDeAcao?.quemEmail || [],

                  quando:
                    tarefa.planoDeAcao?.quando || "",

                  onde:
                    tarefa.planoDeAcao?.onde || "",

                  como:
                    tarefa.planoDeAcao?.como || "",

                  valor:
                    tarefa.planoDeAcao?.valor || "",
                },
              })),
            })),
          })
        ),
      })),
    };
  };

  // ============================================================
  // ENVIAR E-MAILS E NOTIFICAÇÕES
  // ============================================================

  const enviarNotificacoesProjeto = async () => {
    let emailsToNotify = [];

    // E-MAIL DOS COLABORADORES
    if (informacoesProjeto.colaboradorEmail) {
      const colaboradores =
        informacoesProjeto.colaboradorEmail
          .split(/[,;]/)
          .map((email) => email.trim());

      emailsToNotify = [
        ...emailsToNotify,
        ...colaboradores,
      ];
    }

    // RESPONSÁVEIS DO PLANO DE AÇÃO
    (informacoesProjeto.estrategicas || []).forEach(
      (estrategica) => {
        (estrategica.taticas || []).forEach((tatica) => {
          (tatica.operacionais || []).forEach(
            (operacional) => {
              (operacional.tarefas || []).forEach(
                (tarefa) => {
                  if (tarefa.planoDeAcao?.quemEmail) {
                    const responsaveis = Array.isArray(
                      tarefa.planoDeAcao.quemEmail
                    )
                      ? tarefa.planoDeAcao.quemEmail
                      : String(
                          tarefa.planoDeAcao.quemEmail ||
                            ""
                        )
                          .split(/[,;]/)
                          .map((email) => email.trim());

                    emailsToNotify = [
                      ...emailsToNotify,
                      ...responsaveis,
                    ];
                  }
                }
              );
            }
          );
        });
      }
    );

    // REMOVE DUPLICADOS
    emailsToNotify = [
      ...new Set(
        emailsToNotify.filter((email) => email)
      ),
    ];

    console.log(
      "📧 E-mails a serem enviados:",
      emailsToNotify
    );

    if (emailsToNotify.length === 0) {
      return;
    }

    // ============================================================
    // E-MAIL
    // ============================================================

    const emailResponse = await fetch(
      "https://fokus360-backend.vercel.app/send-project-emails",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          emails: emailsToNotify,

          tituloProjeto:
            informacoesProjeto.nome,

          descricaoProjeto:
            informacoesProjeto.descricao,
        }),
      }
    );

    if (emailResponse.ok) {
      console.log(
        "📧 E-mails enviados com sucesso!"
      );
    } else {
      console.error(
        "❌ Erro ao enviar e-mails:",
        await emailResponse.text()
      );
    }

    // ============================================================
    // NOTIFICAÇÕES
    // ============================================================

    if (
      informacoesProjeto.colaboradores?.length > 0
    ) {
      const notificationResponse = await fetch(
        "https://fokus360-backend.vercel.app/send-project-notifications",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userIds:
              informacoesProjeto.colaboradores,

            mensagem: `Você foi adicionado ao projeto: ${informacoesProjeto.nome}`,
          }),
        }
      );

      if (notificationResponse.ok) {
        console.log(
          "🔔 Notificações enviadas com sucesso!"
        );
      } else {
        console.error(
          "❌ Erro ao enviar notificações:",
          await notificationResponse.text()
        );
      }
    }
  };

  // ============================================================
  // ADICIONAR / ATUALIZAR PROJETO
  // ============================================================

  const handleAdicionarProjeto = async () => {
    if (salvando) return;

    try {
      // ============================================================
      // VALIDAÇÃO
      // ============================================================

      if (!informacoesProjeto.nome?.trim()) {
        alert("O nome do projeto é obrigatório!");
        return;
      }

      setSalvando(true);

      const projetoData = montarProjetoData();

      // ============================================================
      // NOVO PROJETO
      // ============================================================

      if (!projectId) {
        const projetoRef = doc(
          collection(dbFokus360, "projetos2")
        );

        await setDoc(projetoRef, {
          ...projetoData,

          createdAt: new Date(),

          updatedAt: new Date(),
        });

        // GUARDA O ID DO PROJETO CRIADO
        setProjectId(projetoRef.id);

        console.log(
          "✅ Projeto criado com ID:",
          projetoRef.id
        );

        setTipoSalvamento("criado");
      }

      // ============================================================
      // PROJETO JÁ EXISTE
      // ============================================================

      else {
        const projetoRef = doc(
          dbFokus360,
          "projetos2",
          projectId
        );

        await setDoc(
          projetoRef,
          {
            ...projetoData,

            updatedAt: new Date(),
          },
          {
            merge: true,
          }
        );

        console.log(
          "✅ Projeto atualizado:",
          projectId
        );

        setTipoSalvamento("atualizado");
      }

      // ============================================================
      // E-MAILS / NOTIFICAÇÕES
      // ============================================================

      await enviarNotificacoesProjeto();

      // ============================================================
      // SUCESSO
      // ============================================================

      setShowAlert(true);

      console.log(
        projectId
          ? "✅ Projeto atualizado com sucesso!"
          : "✅ Projeto criado com sucesso!"
      );
    } catch (error) {
      console.error(
        "❌ Erro ao salvar projeto:",
        error
      );

      alert(
        "Erro ao salvar o projeto. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <Box
        sx={{
          marginLeft: "40px",
          paddingTop: "50px",
        }}
      >
        <Header
          title={
            <Box
              display="flex"
              alignItems="center"
              gap={1}
            >
              <DescriptionIcon
                sx={{
                  color: "#5f53e5",
                  fontSize: 40,
                }}
              />

              <Typography>
                CADASTRO DE PROJETOS
              </Typography>
            </Box>
          }
        />
      </Box>

      {/* ========================================================= */}
      {/* ALERT */}
      {/* ========================================================= */}

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
            sx={{
              backgroundColor: "#30db33",

              color: "green",

              "& .MuiAlert-icon": {
                color: "white",
                marginTop: "10px",
                fontSize: "30px",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#125b07",
                  marginLeft: "10px",
                  marginTop: "2px",
                }}
              >
                {tipoSalvamento === "criado"
                  ? "Projeto criado com sucesso!"
                  : "Projeto atualizado com sucesso!"}
              </Typography>

              <Button
                onClick={() => setShowAlert(false)}
                sx={{
                  fontSize: "20px",
                  marginTop: "2px",
                  marginLeft: "40px",
                  backgroundColor: "#2dce30",
                  color: "white",
                }}
              >
                OK
              </Button>
            </Box>
          </Alert>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* CONTEÚDO */}
      {/* ========================================================= */}

      <Box
        sx={{
          padding: "30px",
          margin: "40px",
          backgroundColor: "#f2f0f0",
        }}
      >
        {/* ======================================================= */}
        {/* INFORMAÇÕES */}
        {/* ======================================================= */}

        <Accordion
          sx={{
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <PlayCircleFilledWhiteIcon
              sx={{
                color: "#22d3ee",
                fontSize: 25,
                marginRight: "10px",
              }}
            />

            <Typography sx={{ marginTop: "4px" }}>
              ADICIONAR INFORMAÇÕES DO PROJETO
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <InformacoesProjeto
              onUpdate={setInformacoesProjeto}
              LimpaEstado={mensagem}
            />
          </AccordionDetails>
        </Accordion>

        {/* ======================================================= */}
        {/* DIRETRIZES */}
        {/* ======================================================= */}

        <Accordion
          sx={{
            borderRadius: "10px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <PlayCircleFilledWhiteIcon
              sx={{
                color: "#312783",
                fontSize: 25,
                marginRight: "10px",
              }}
            />

            <Typography sx={{ marginTop: "4px" }}>
              ADICIONAR DIRETRIZES DO PROJETO
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <BaseDiretriz
              estrategicas={
                informacoesProjeto.estrategicas || []
              }
              onUpdate={handleEstrategicasUpdate}
              LimpaEstado={mensagem}
            />
          </AccordionDetails>
        </Accordion>

        {/* ======================================================= */}
        {/* BOTÃO */}
        {/* ======================================================= */}

        <Box
          display="flex"
          justifyContent="flex-end"
          marginTop="20px"
        >
          <Button
            onClick={handleAdicionarProjeto}
            disabled={salvando}
            variant="contained"
            sx={{
              backgroundColor: "#5f53e5",
              color: "#fff",

              "&:hover": {
                backgroundColor: "#4f46d8",
              },
            }}
          >
            {salvando
              ? "SALVANDO..."
              : projectId
              ? "ATUALIZAR PROJETO"
              : "ADICIONAR PROJETO"}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CadastroProjetos;