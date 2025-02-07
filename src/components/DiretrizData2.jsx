// BaseDiretriz2.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";

// 🔹 useParams do React Router
import { useParams } from "react-router-dom";

// 🔹 Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../data/firebase-config";

// ---------- Componente para Tarefas (5W2H) ----------
function TarefasList({
  dirId,
  tatId,
  opId,
  tarefasArray,
  onAddTarefa,
  onUpdateTarefa,
  onAddPlanoAcao,
  onUpdatePlanoAcao,
}) {
  const [novaTarefa, setNovaTarefa] = useState("");

  const handleCriarTarefa = () => {
    if (!novaTarefa.trim()) return;
    onAddTarefa(dirId, tatId, opId, novaTarefa);
    setNovaTarefa("");
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ color: "#999", mb: 1 }}>
        Tarefas 5W2H
      </Typography>

      <Box display="flex" gap={1} mb={2}>
        <TextField
          label="Título da Tarefa"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          fullWidth
        />
        <Button onClick={handleCriarTarefa}>
          <AddCircleOutlineIcon />
        </Button>
      </Box>

      {tarefasArray.map((tarefa) => (
        <Box key={tarefa.id} sx={{ mb: 2, border: "1px dashed #ccc", p: 1 }}>
          <TextField
            variant="filled"
            label="Título da Tarefa"
            fullWidth
            sx={{ mb: 1, backgroundColor: "#fff" }}
            value={tarefa.tituloTarefa || ""}
            onChange={(e) =>
              onUpdateTarefa(dirId, tatId, opId, tarefa.id, "tituloTarefa", e.target.value)
            }
          />

          {/* Plano de Ação */}
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>Plano de Ação</Typography>
            <Button
              onClick={() => onAddPlanoAcao(dirId, tatId, opId, tarefa.id)}
              size="small"
              startIcon={<AddCircleOutlineIcon />}
            >
              Adicionar
            </Button>

            {(tarefa.planoDeAcao || []).map((plano) => (
              <Box
                key={plano.id}
                sx={{
                  mt: 1,
                  mb: 2,
                  border: "1px dotted #ccc",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                <TextField
                  label="Como"
                  variant="filled"
                  sx={{ mr: 1, mb: 1, backgroundColor: "#fff" }}
                  value={plano.como || ""}
                  onChange={(e) =>
                    onUpdatePlanoAcao(dirId, tatId, opId, tarefa.id, plano.id, "como", e.target.value)
                  }
                />
                <TextField
                  label="O Que"
                  variant="filled"
                  sx={{ mr: 1, mb: 1, backgroundColor: "#fff" }}
                  value={plano.oQue || ""}
                  onChange={(e) =>
                    onUpdatePlanoAcao(dirId, tatId, opId, tarefa.id, plano.id, "oQue", e.target.value)
                  }
                />
                {/* ... repita para onde, porQue, quando, quem, valor */}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// ---------- Formulário para criar Tática ----------
function NovaTaticaForm({ onAdd }) {
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");

  const handleCreateTatica = () => {
    if (!titulo.trim()) return;
    onAdd(titulo, desc);
    setTitulo("");
    setDesc("");
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={2}>
      <TextField
        label="Título da Tática..."
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        fullWidth
      />
      <TextField
        label="Descrição da Tática..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />
      <Button
        onClick={handleCreateTatica}
        disableRipple
        sx={{
          alignSelf: "flex-start",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#4caf50" }} />
      </Button>
    </Box>
  );
}

// ---------- Formulário para criar Operacional ----------
function NovaOperacionalForm({ onAdd }) {
  const [nome, setNome] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [prazoPrevisto, setPrazoPrevisto] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [solicitanteEmail, setSolicitanteEmail] = useState("");
  const [unidade, setUnidade] = useState("");

  const handleCreateOperacional = () => {
    if (!nome.trim()) return;
    onAdd(nome, orcamento, prazoPrevisto, solicitante, solicitanteEmail, unidade);
    setNome("");
    setOrcamento("");
    setPrazoPrevisto("");
    setSolicitante("");
    setSolicitanteEmail("");
    setUnidade("");
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={2}>
      <TextField
        label="Nome do Operacional..."
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        fullWidth
      />
      <TextField
        label="Orçamento..."
        value={orcamento}
        onChange={(e) => setOrcamento(e.target.value)}
        fullWidth
      />
      <TextField
        label="Prazo Previsto..."
        value={prazoPrevisto}
        onChange={(e) => setPrazoPrevisto(e.target.value)}
        fullWidth
      />
      <TextField
        label="Solicitante..."
        value={solicitante}
        onChange={(e) => setSolicitante(e.target.value)}
        fullWidth
      />
      <TextField
        label="Email do Solicitante..."
        value={solicitanteEmail}
        onChange={(e) => setSolicitanteEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Unidade..."
        value={unidade}
        onChange={(e) => setUnidade(e.target.value)}
        fullWidth
      />
      <Button
        onClick={handleCreateOperacional}
        disableRipple
        sx={{
          alignSelf: "flex-start",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#f44336" }} />
      </Button>
    </Box>
  );
}

// ---------- Componente principal ----------
export default function BaseDiretriz2() {
  const { projectId } = useParams(); // ← Pega o ID do projeto a partir da URL
  const [diretrizes, setDiretrizes] = useState([]);

  // Campos para criar nova Diretriz
  const [novaEstrategica, setNovaEstrategica] = useState("");
  const [descEstrategica, setDescEstrategica] = useState("");

  // 1) Carregar doc do Firestore e ler diretriz[]:
  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "projetos", projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() || {};
          const direArray = Array.isArray(data.diretrizes) ? data.diretrizes : [];
          setDiretrizes(direArray);
        } else {
          console.log("Documento não encontrado em projetos/", projectId);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do Firestore:", error);
      }
    };

    fetchData();
  }, [projectId]);

  // 2) Salvar no Firestore (atualizar doc) sempre que mudamos algo local
  const saveDiretrizes = async (novoArray) => {
    if (!projectId) return;
    try {
      const docRef = doc(db, "projetos", projectId);
      await updateDoc(docRef, { diretriz: novoArray });
    } catch (error) {
      console.error("Erro ao atualizar diretrizes no Firestore:", error);
    }
  };

  // ================
  // Criar Diretriz
  // ================
  const handleAddDiretriz = () => {
    if (!novaEstrategica.trim()) {
      return alert("Informe o título da Diretriz Estratégica");
    }
    const nova = {
      id: Date.now(),
      titulo: novaEstrategica,
      descricao: descEstrategica,
      taticas: [],
    };
    const atualizado = [...diretrizes, nova];
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
    setNovaEstrategica("");
    setDescEstrategica("");
  };

  // Remover Diretriz
  const handleRemoveDiretriz = (id) => {
    const atualizado = diretrizes.filter((d) => d.id !== id);
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  // Atualizar Diretriz
  const handleUpdateDiretriz = (idDiretriz, campo, valor) => {
    const atualizado = diretrizes.map((dir) =>
      dir.id === idDiretrizes ? { ...dir, [campo]: valor } : dir
    );
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  // =========================
  // TÁTICAS
  // =========================
  const handleAddTatica = (idDiretriz, titulo, descricao) => {
    const novaTatica = {
      id: Date.now(),
      titulo,
      descricao,
      operacionais: [],
    };
    const atualizado = diretrizes.map((dir) => {
      if (dir.id === idDiretriz) {
        return { ...dir, taticas: [...dir.taticas, novaTatica] };
      }
      return dir;
    });
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  const handleRemoveTatica = (idDiretriz, idTatica) => {
    const atualizado = diretrizes.map((dir) => {
      if (dir.id === idDiretriz) {
        return {
          ...dir,
          taticas: dir.taticas.filter((t) => t.id !== idTatica),
        };
      }
      return dir;
    });
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  const handleUpdateTatica = (idDiretriz, idTatica, campo, valor) => {
    const atualizado = diretrizes.map((dir) => {
      if (dir.id === idDiretriz) {
        const novasTaticas = dir.taticas.map((t) =>
          t.id === idTatica ? { ...t, [campo]: valor } : t
        );
        return { ...dir, taticas: novasTaticas };
      }
      return dir;
    });
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  // =========================
  // OPERACIONAIS
  // =========================
  const handleAddOperacional = (
    idDiretriz,
    idTatica,
    nome,
    orcamento,
    prazoPrevisto,
    solicitante,
    solicitanteEmail,
    unidade
  ) => {
    const novaOper = {
      id: Date.now(),
      nome,
      orcamento,
      prazoPrevisto,
      solicitante,
      solicitanteEmail,
      unidade,
      tarefas: [],
    };
    const atualizado = diretrizes.map((dir) => {
      if (dir.id === idDiretriz) {
        const novasTaticas = dir.taticas.map((t) => {
          if (t.id === idTatica) {
            return {
              ...t,
              operacionais: [...(t.operacionais || []), novaOper],
            };
          }
          return t;
        });
        return { ...dir, taticas: novasTaticas };
      }
      return dir;
    });
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  const handleRemoveOperacional = (idDiretriz, idTatica, idOp) => {
    const atualizado = diretrizes.map((dir) => {
      if (dir.id === idDiretriz) {
        const novasTaticas = dir.taticas.map((t) => {
          if (t.id === idTatica) {
            return {
              ...t,
              operacionais: t.operacionais.filter((op) => op.id !== idOp),
            };
          }
          return t;
        });
        return { ...dir, taticas: novasTaticas };
      }
      return dir;
    });
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  const handleUpdateOperacional = (idDiretriz, idTatica, idOp, campo, valor) => {
    const atualizado = diretrizes.map((dir) => {
      if (dir.id !== idDiretriz) return dir;
      const novasTaticas = dir.taticas.map((t) => {
        if (t.id !== idTatica) return t;
        const novasOp = t.operacionais.map((op) =>
          op.id === idOp ? { ...op, [campo]: valor } : op
        );
        return { ...t, operacionais: novasOp };
      });
      return { ...dir, taticas: novasTaticas };
    });
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  // =========================
  // TAREFAS
  // =========================
  const handleAddTarefa = (idDiretriz, idTatica, idOp, tituloTarefa) => {
    const novaTarefa = {
      id: Date.now(),
      tituloTarefa,
      planoDeAcao: [],
    };
    const atualizado = diretrizes.map((dir) => {
      if (dir.id !== idDiretriz) return dir;
      const novasTaticas = dir.taticas.map((t) => {
        if (t.id !== idTatica) return t;
        const novasOp = t.operacionais.map((op) => {
          if (op.id !== idOp) return op;
          return { ...op, tarefas: [...(op.tarefas || []), novaTarefa] };
        });
        return { ...t, operacionais: novasOp };
      });
      return { ...dir, taticas: novasTaticas };
    });
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  const handleUpdateTarefa = (idDiretriz, idTatica, idOp, idTarefa, campo, valor) => {
    const atualizado = diretrizes.map((dir) => {
      if (dir.id !== idDiretriz) return dir;
      const novasTaticas = dir.taticas.map((t) => {
        if (t.id !== idTatica) return t;
        const novasOps = t.operacionais.map((op) => {
          if (op.id !== idOp) return op;
          const novasTarefas = op.tarefas.map((tf) =>
            tf.id === idTarefa ? { ...tf, [campo]: valor } : tf
          );
          return { ...op, tarefas: novasTarefas };
        });
        return { ...t, operacionais: novasOps };
      });
      return { ...dir, taticas: novasTaticas };
    });
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  // =========================
  // PLANO DE AÇÃO
  // =========================
  const handleAddPlanoAcao = (idDiretriz, idTatica, idOp, idTarefa) => {
    const novoPlano = {
      id: Date.now(),
      como: "",
      oQue: "",
      onde: "",
      porQue: "",
      quando: "",
      quem: "",
      valor: "",
    };
    const atualizado = diretrizes.map((dir) => {
      if (dir.id !== idDiretriz) return dir;
      const novasTaticas = dir.taticas.map((t) => {
        if (t.id !== idTatica) return t;
        const novasOps = t.operacionais.map((op) => {
          if (op.id !== idOp) return op;
          const novasTarefas = op.tarefas.map((tf) => {
            if (tf.id !== idTarefa) return tf;
            return { ...tf, planoDeAcao: [...(tf.planoDeAcao || []), novoPlano] };
          });
          return { ...op, tarefas: novasTarefas };
        });
        return { ...t, operacionais: novasOps };
      });
      return { ...dir, taticas: novasTaticas };
    });
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  const handleUpdatePlanoAcao = (
    idDiretriz,
    idTatica,
    idOp,
    idTarefa,
    idPlano,
    campo,
    valor
  ) => {
    const atualizado = diretrizes.map((dir) => {
      if (dir.id !== idDiretriz) return dir;
      const novasTaticas = dir.taticas.map((t) => {
        if (t.id !== idTatica) return t;
        const novasOps = t.operacionais.map((op) => {
          if (op.id !== idOp) return op;
          const novasTarefas = op.tarefas.map((tf) => {
            if (tf.id !== idTarefa) return tf;
            const novoPlanoArr = (tf.planoDeAcao || []).map((pa) =>
              pa.id === idPlano ? { ...pa, [campo]: valor } : pa
            );
            return { ...tf, planoDeAcao: novoPlanoArr };
          });
          return { ...op, tarefas: novasTarefas };
        });
        return { ...t, operacionais: novasOps };
      });
      return { ...dir, taticas: novasTaticas };
    });
    setDiretrizes(atualizado);
    saveDiretrizes(atualizado);
  };

  // ================================================
  // RENDER
  // ================================================
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Editando Projeto: {projectId}
      </Typography>

      {/* Criar Diretriz Estratégica */}
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#312783", mb: 1 }}>
        Criar Diretriz Estratégica
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        <TextField
          label="Nome da Diretriz Estratégica..."
          value={novaEstrategica}
          onChange={(e) => setNovaEstrategica(e.target.value)}
          fullWidth
        />
        <TextField
          label="Descrição da Diretriz Estratégica..."
          value={descEstrategica}
          onChange={(e) => setDescEstrategica(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        <Button
          onClick={handleAddDiretriz}
          disableRipple
          sx={{
            alignSelf: "flex-start",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&:focus": {
              outline: "none",
            },
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#312783" }} />
        </Button>
      </Box>

      {/* Lista de Diretrizes */}
      <Box display="flex" alignItems="center" marginBottom="20px">
        <ArrowDropDownCircleIcon sx={{ fontSize: 25, color: "#312783", mr: 1 }} />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "#483ebd", marginTop: 0.5 }}
        >
          Diretriz Estratégica
        </Typography>
      </Box>

      {diretrizes.map((dir) => (
        <Accordion
          key={dir.id}
          disableGutters
          sx={{
            backgroundColor: "transparent",
            borderRadius: "8px",
            boxShadow: "none",
            marginBottom: "10px",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#b7b7b7" }} />}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#312783",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Título/descrição da Diretriz (editáveis) */}
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <TextField
                variant="filled"
                label="Título da Diretriz Estratégica"
                fullWidth
                sx={{ backgroundColor: "#fff", mb: 1 }}
                value={dir.titulo}
                onChange={(e) => handleUpdateDiretriz(dir.id, "titulo", e.target.value)}
              />
              <TextField
                variant="filled"
                label="Descrição da Diretriz Estratégica"
                fullWidth
                multiline
                rows={2}
                sx={{ backgroundColor: "#fff" }}
                value={dir.descricao || ""}
                onChange={(e) =>
                  handleUpdateDiretriz(dir.id, "descricao", e.target.value)
                }
              />
            </Box>

            <Button
              disableRipple
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveDiretriz(dir.id);
              }}
              sx={{
                minWidth: "40px",
                padding: "5px",
                border: "none",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <DeleteForeverIcon sx={{ fontSize: 24, color: "#dddddd" }} />
            </Button>
          </AccordionSummary>

          {/* Seção de Táticas */}
          <AccordionDetails>
            <Box display="flex" alignItems="center" marginBottom="20px">
              <SubdirectoryArrowRightIcon
                sx={{ fontSize: 30, color: "#4caf50", mr: 1 }}
              />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#29c42e", marginTop: 1 }}>
                Diretriz Tática
              </Typography>
            </Box>

            <NovaTaticaForm onAdd={(titulo, desc) => handleAddTatica(dir.id, titulo, desc)} />

            {dir.taticas?.map((tat) => (
              <Accordion
                key={tat.id}
                disableGutters
                sx={{
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  boxShadow: "none",
                  marginBottom: "10px",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#b7b7b7" }} />}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#4caf50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "left" }}>
                    <TextField
                      variant="filled"
                      label="Título da Tática"
                      fullWidth
                      sx={{ backgroundColor: "#fff", mb: 1 }}
                      value={tat.titulo}
                      onChange={(e) =>
                        handleUpdateTatica(dir.id, tat.id, "titulo", e.target.value)
                      }
                    />
                    <TextField
                      variant="filled"
                      label="Descrição da Tática"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ backgroundColor: "#fff" }}
                      value={tat.descricao}
                      onChange={(e) =>
                        handleUpdateTatica(dir.id, tat.id, "descricao", e.target.value)
                      }
                    />
                  </Box>
                  <Button
                    disableRipple
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTatica(dir.id, tat.id);
                    }}
                    sx={{
                      minWidth: "40px",
                      padding: "5px",
                      border: "none",
                      backgroundColor: "transparent",
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  >
                    <DeleteForeverIcon sx={{ fontSize: 24, color: "#dddddd" }} />
                  </Button>
                </AccordionSummary>

                {/* Seção de Operacionais */}
                <AccordionDetails>
                  <Box display="flex" alignItems="center" marginBottom="20px">
                    <SubdirectoryArrowRightIcon
                      sx={{ fontSize: 30, color: "#f44336", mr: 1 }}
                    />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#ef6b62", marginTop: 1 }}>
                      Diretriz Operacional
                    </Typography>
                  </Box>

                  <NovaOperacionalForm
                    onAdd={(nome, orc, prazo, sol, solEmail, uni) =>
                      handleAddOperacional(dir.id, tat.id, nome, orc, prazo, sol, solEmail, uni)
                    }
                  />

                  {tat.operacionais?.map((op) => (
                    <Accordion
                      key={op.id}
                      disableGutters
                      sx={{
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        boxShadow: "none",
                        marginBottom: "10px",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "#b7b7b7" }} />}
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: "#f44336",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {/* Campos do Operacional */}
                        <Box sx={{ flex: 1, textAlign: "left" }}>
                          <TextField
                            variant="filled"
                            label="Nome do Operacional"
                            fullWidth
                            sx={{ backgroundColor: "#fff", mb: 1 }}
                            value={op.nome || ""}
                            onChange={(e) =>
                              handleUpdateOperacional(dir.id, tat.id, op.id, "nome", e.target.value)
                            }
                          />
                          <TextField
                            variant="filled"
                            label="Orçamento"
                            fullWidth
                            sx={{ backgroundColor: "#fff", mb: 1 }}
                            value={op.orcamento || ""}
                            onChange={(e) =>
                              handleUpdateOperacional(
                                dir.id,
                                tat.id,
                                op.id,
                                "orcamento",
                                e.target.value
                              )
                            }
                          />
                          <TextField
                            variant="filled"
                            label="Prazo Previsto"
                            fullWidth
                            sx={{ backgroundColor: "#fff", mb: 1 }}
                            value={op.prazoPrevisto || ""}
                            onChange={(e) =>
                              handleUpdateOperacional(
                                dir.id,
                                tat.id,
                                op.id,
                                "prazoPrevisto",
                                e.target.value
                              )
                            }
                          />
                          <TextField
                            variant="filled"
                            label="Solicitante"
                            fullWidth
                            sx={{ backgroundColor: "#fff", mb: 1 }}
                            value={op.solicitante || ""}
                            onChange={(e) =>
                              handleUpdateOperacional(
                                dir.id,
                                tat.id,
                                op.id,
                                "solicitante",
                                e.target.value
                              )
                            }
                          />
                          <TextField
                            variant="filled"
                            label="Email do Solicitante"
                            fullWidth
                            sx={{ backgroundColor: "#fff", mb: 1 }}
                            value={op.solicitanteEmail || ""}
                            onChange={(e) =>
                              handleUpdateOperacional(
                                dir.id,
                                tat.id,
                                op.id,
                                "solicitanteEmail",
                                e.target.value
                              )
                            }
                          />
                          <TextField
                            variant="filled"
                            label="Unidade"
                            fullWidth
                            sx={{ backgroundColor: "#fff", mb: 1 }}
                            value={op.unidade || ""}
                            onChange={(e) =>
                              handleUpdateOperacional(
                                dir.id,
                                tat.id,
                                op.id,
                                "unidade",
                                e.target.value
                              )
                            }
                          />
                        </Box>

                        <Button
                          disableRipple
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOperacional(dir.id, tat.id, op.id);
                          }}
                          sx={{
                            minWidth: "40px",
                            padding: "5px",
                            border: "none",
                            backgroundColor: "transparent",
                            "&:hover": { backgroundColor: "transparent" },
                          }}
                        >
                          <DeleteForeverIcon sx={{ fontSize: 24, color: "#dddddd" }} />
                        </Button>
                      </AccordionSummary>

                      {/* Tarefas dentro do Operacional */}
                      <AccordionDetails>
                        <TarefasList
                          dirId={dir.id}
                          tatId={tat.id}
                          opId={op.id}
                          tarefasArray={op.tarefas || []}
                          onAddTarefa={handleAddTarefa}
                          onUpdateTarefa={handleUpdateTarefa}
                          onAddPlanoAcao={handleAddPlanoAcao}
                          onUpdatePlanoAcao={handleUpdatePlanoAcao}
                        />
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
