import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Seu componente de tarefas (5W2H)
import DiretrizData from "./DiretrizData";

/**
 * BaseDiretriz
 *
 * Hierarquia:
 *   1) Diretrizes Estratégicas (quantas o usuário quiser)
 *       -> Diretriz Tática
 *           -> Diretriz Operacional
 *               -> <DiretrizData /> (tarefas, 5W2H)
 *
 * Props:
 *   - onUpdate(dadosAtualizados): callback ao atualizar a lista
 *   - LimpaEstado (boolean): se mudar para true, limpa tudo
 */
const BaseDiretriz = ({ onUpdate, LimpaEstado }) => {
  // Lista de Diretrizes Estratégicas
  const [estrategicas, setEstrategicas] = useState([]);

  // Inputs para criar nova Diretriz Estratégica
  const [novaEstrategica, setNovaEstrategica] = useState("");
  const [descEstrategica, setDescEstrategica] = useState("");

  // -------------------------------------
  // Criar nova Diretriz Estratégica
  // -------------------------------------
  const handleAddEstrategica = () => {
    if (!novaEstrategica.trim() || !descEstrategica.trim()) {
      alert("Preencha o nome e a descrição da Diretriz Estratégica!");
      return;
    }
    const item = {
      id: Date.now(),
      titulo: novaEstrategica,
      descricao: descEstrategica,
      taticas: [], // array de Diretrizes Táticas
    };
    const atualizado = [...estrategicas, item];
    setEstrategicas(atualizado);
    onUpdate && onUpdate(atualizado);

    // Limpa inputs
    setNovaEstrategica("");
    setDescEstrategica("");
  };

  // -------------------------------------
  // Remover Diretriz Estratégica
  // -------------------------------------
  const handleRemoveEstrategica = (id) => {
    const atualizado = estrategicas.filter((d) => d.id !== id);
    setEstrategicas(atualizado);
    onUpdate && onUpdate(atualizado);
  };

  // -------------------------------------
  // Criar nova Diretriz Tática
  // -------------------------------------
  const handleAddTatica = (idEstrategica, titulo, descricao) => {
    if (!titulo.trim() || !descricao.trim()) {
      alert("Preencha o nome e a descrição da Diretriz Tática!");
      return;
    }
    const novo = {
      id: Date.now(),
      titulo,
      descricao,
      operacionais: [], // array de Diretrizes Operacionais
    };
    const atualizadas = estrategicas.map((est) => {
      if (est.id === idEstrategica) {
        return { ...est, taticas: [...est.taticas, novo] };
      }
      return est;
    });
    setEstrategicas(atualizadas);
    onUpdate && onUpdate(atualizadas);
  };

  // -------------------------------------
  // Remover Diretriz Tática
  // -------------------------------------
  const handleRemoveTatica = (idEstrategica, idTatica) => {
    const atualizadas = estrategicas.map((est) => {
      if (est.id === idEstrategica) {
        return {
          ...est,
          taticas: est.taticas.filter((t) => t.id !== idTatica),
        };
      }
      return est;
    });
    setEstrategicas(atualizadas);
    onUpdate && onUpdate(atualizadas);
  };

  // -------------------------------------
  // Criar nova Diretriz Operacional
  // -------------------------------------
  const handleAddOperacional = (idEstrategica, idTatica, titulo, descricao) => {
    if (!titulo.trim() || !descricao.trim()) {
      alert("Preencha o nome e a descrição da Diretriz Operacional!");
      return;
    }
    const novo = {
      id: Date.now(),
      titulo,
      descricao,
    };
    const atualizadas = estrategicas.map((est) => {
      if (est.id === idEstrategica) {
        const novasTaticas = est.taticas.map((t) => {
          if (t.id === idTatica) {
            const opers = t.operacionais || [];
            return {
              ...t,
              operacionais: [...opers, novo],
            };
          }
          return t;
        });
        return { ...est, taticas: novasTaticas };
      }
      return est;
    });
    setEstrategicas(atualizadas);
    onUpdate && onUpdate(atualizadas);
  };

  // -------------------------------------
  // Remover Diretriz Operacional
  // -------------------------------------
  const handleRemoveOperacional = (idEstrategica, idTatica, idOp) => {
    const atualizadas = estrategicas.map((est) => {
      if (est.id === idEstrategica) {
        const novasTaticas = est.taticas.map((t) => {
          if (t.id === idTatica) {
            return {
              ...t,
              operacionais: t.operacionais.filter((op) => op.id !== idOp),
            };
          }
          return t;
        });
        return { ...est, taticas: novasTaticas };
      }
      return est;
    });
    setEstrategicas(atualizadas);
    onUpdate && onUpdate(atualizadas);
  };

  // -------------------------------------
  // Atualiza a Diretriz Operacional quando `DiretrizData` muda (tarefas, 5W2H)
  // -------------------------------------
  const handleUpdateOperacional = (idEstrategica, idTatica, operacionalAtualizada) => {
    // Substitui a Operacional dentro do array
    const atualizadas = estrategicas.map((est) => {
      if (est.id === idEstrategica) {
        const novasTaticas = est.taticas.map((t) => {
          if (t.id === idTatica) {
            const novasOps = t.operacionais.map((op) =>
              op.id === operacionalAtualizada.id ? operacionalAtualizada : op
            );
            return { ...t, operacionais: novasOps };
          }
          return t;
        });
        return { ...est, taticas: novasTaticas };
      }
      return est;
    });
    setEstrategicas(atualizadas);
    onUpdate && onUpdate(atualizadas);
  };

  // -------------------------------------
  // Limpar tudo quando LimpaEstado mudar
  // -------------------------------------
  useEffect(() => {
    if (LimpaEstado) {
      setEstrategicas([]);
      setNovaEstrategica("");
      setDescEstrategica("");
    }
  }, [LimpaEstado]);

  // -------------------------------------
  // Render
  // -------------------------------------
  return (
    <Box>

      {/* ***************************** */}
      {/* Form para criar EstratÉgica */}
      {/* ***************************** */}
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#5f53e5", mb: 1 }}>
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
          onClick={handleAddEstrategica}
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
          <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#5f53e5" }} />
        </Button>
      </Box>

      {/* ************************************ */}
      {/* Accordion p/ cada Diretriz Estratégica */}
      {/* ************************************ */}
      {estrategicas.map((est) => (
        <Accordion
          key={est.id}
          disableGutters
          sx={{
            backgroundColor: "transparent",
            borderRadius: "8px",
            boxShadow: "none",
            marginBottom: "10px",
          }}
        >
          {/* Cabeçalho da Estratégica */}
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#b7b7b7" }} />}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#5f53e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                {est.titulo}
              </Typography>
              <Typography sx={{ color: "#b7b7b7", fontSize: "0.9em" }}>
                {est.descricao}
              </Typography>
            </Box>
            <Button
              disableRipple
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveEstrategica(est.id);
              }}
              sx={{
                minWidth: "40px",
                padding: "5px",
                border: "none",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <DeleteForeverIcon sx={{ fontSize: 24, color: "#b7b7b7" }} />
            </Button>
          </AccordionSummary>

          {/* Detalhes: Diretriz TÁTICA */}
          <AccordionDetails>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: "#5f53e5", mb: 2 }}
            >
              Diretriz Tática
            </Typography>

            {/* Form para adicionar Tática dentro da Estratégica */}
            <NovaTaticaForm
              onAdd={(titulo, desc) => handleAddTatica(est.id, titulo, desc)}
            />

            {/* Accordion das Táticas */}
            {est.taticas.map((tat) => (
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
                    backgroundColor: "#5f53e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Cabeçalho da Tática */}
                  <Box sx={{ flex: 1, textAlign: "left" }}>
                    <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                      {tat.titulo}
                    </Typography>
                    <Typography sx={{ color: "#b7b7b7", fontSize: "0.9em" }}>
                      {tat.descricao}
                    </Typography>
                  </Box>
                  <Button
                    disableRipple
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTatica(est.id, tat.id);
                    }}
                    sx={{
                      minWidth: "40px",
                      padding: "5px",
                      border: "none",
                      backgroundColor: "transparent",
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  >
                    <DeleteForeverIcon
                      sx={{ fontSize: 24, color: "#b7b7b7" }}
                    />
                  </Button>
                </AccordionSummary>

                {/* Detalhes: Diretriz Operacional */}
                <AccordionDetails>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ color: "#5f53e5", mb: 2 }}
                  >
                    Diretriz Operacional
                  </Typography>

                  {/* Form para adicionar Operacional */}
                  <NovaOperacionalForm
                    onAdd={(titulo, desc) =>
                      handleAddOperacional(est.id, tat.id, titulo, desc)
                    }
                  />

                  {/* Lista de Operacionais */}
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
                          backgroundColor: "#5f53e5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {/* Cabeçalho da Operacional */}
                        <Box sx={{ flex: 1, textAlign: "left" }}>
                          <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                            {op.titulo}
                          </Typography>
                          <Typography
                            sx={{ color: "#b7b7b7", fontSize: "0.9em" }}
                          >
                            {op.descricao}
                          </Typography>
                        </Box>
                        <Button
                          disableRipple
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOperacional(est.id, tat.id, op.id);
                          }}
                          sx={{
                            minWidth: "40px",
                            padding: "5px",
                            border: "none",
                            backgroundColor: "transparent",
                            "&:hover": { backgroundColor: "transparent" },
                          }}
                        >
                          <DeleteForeverIcon
                            sx={{ fontSize: 24, color: "#b7b7b7" }}
                          />
                        </Button>
                      </AccordionSummary>

                      {/* Detalhes (tarefas, 5W2H) */}
                      <AccordionDetails>
                        <DiretrizData
                          diretriz={op}
                          onUpdate={(operAtualizada) =>
                            handleUpdateOperacional(est.id, tat.id, operAtualizada)
                          }
                          LimpaEstado={LimpaEstado}
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
};

export default BaseDiretriz;

/* 
  Exemplos de sub-formulários para Tática e Operacional,
  para manter a lógica isolada e legível
*/
function NovaTaticaForm({ onAdd }) {
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={2}>
      <TextField
        label="Nome da Diretriz Tática..."
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        fullWidth
      />
      <TextField
        label="Descrição da Diretriz Tática..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />
      <Button
        onClick={() => {
          onAdd(titulo, desc);
          setTitulo("");
          setDesc("");
        }}
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
        <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#5f53e5" }} />
      </Button>
    </Box>
  );
}

function NovaOperacionalForm({ onAdd }) {
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={2}>
      <TextField
        label="Nome da Diretriz Operacional..."
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        fullWidth
      />
      <TextField
        label="Descrição da Diretriz Operacional..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />
      <Button
        onClick={() => {
          onAdd(titulo, desc);
          setTitulo("");
          setDesc("");
        }}
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
        <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#5f53e5" }} />
      </Button>
    </Box>
  );
}
