import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Save,
  Close,
  AccountTree,
  Business,
} from "@mui/icons-material";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { dbFokus360 } from "../../data/firebase-config";

const CadastroAreas = () => {
  const [areaMatriz, setAreaMatriz] = useState("");
  const [subareas, setSubareas] = useState([""]);
  const [areasCadastradas, setAreasCadastradas] = useState([]);

  const [unidade, setUnidade] = useState("");
  const [unidadesCadastradas, setUnidadesCadastradas] = useState([]);

  const [editandoId, setEditandoId] = useState(null);
  const [editAreaMatriz, setEditAreaMatriz] = useState("");
  const [editSubareas, setEditSubareas] = useState([""]);

  const carregarAreas = async () => {
    const snapshot = await getDocs(collection(dbFokus360, "areas"));
    const lista = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    setAreasCadastradas(lista);
  };

  const carregarUnidades = async () => {
    const snapshot = await getDocs(collection(dbFokus360, "unidade"));
    const lista = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    setUnidadesCadastradas(lista);
  };

  useEffect(() => {
    carregarAreas();
    carregarUnidades();
  }, []);

  const gerarAreaMatriz = async () => {
    if (!areaMatriz.trim()) {
      alert("Digite o nome da Área Matriz.");
      return;
    }

    const subareasLimpas = subareas
      .map((item) => item.trim())
      .filter(Boolean);

    await addDoc(collection(dbFokus360, "areas"), {
      nome: areaMatriz.trim().toUpperCase(),
      subareas: subareasLimpas,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setAreaMatriz("");
    setSubareas([""]);
    carregarAreas();
  };

  const criarUnidade = async () => {
    if (!unidade.trim()) {
      alert("Digite o nome da unidade.");
      return;
    }

    await addDoc(collection(dbFokus360, "unidade"), {
      nome: unidade.trim().toUpperCase(),
      createdAt: serverTimestamp(),
    });

    setUnidade("");
    carregarUnidades();
  };

  const deletarArea = async (id) => {
    if (!window.confirm("Deseja deletar esta Área Matriz?")) return;

    await deleteDoc(doc(dbFokus360, "areas", id));
    carregarAreas();
  };

  const deletarUnidade = async (id) => {
    if (!window.confirm("Deseja deletar esta unidade?")) return;

    await deleteDoc(doc(dbFokus360, "unidade", id));
    carregarUnidades();
  };

  const adicionarSubarea = () => {
    setSubareas([...subareas, ""]);
  };

  const alterarSubarea = (index, valor) => {
    const lista = [...subareas];
    lista[index] = valor;
    setSubareas(lista);
  };

  const removerSubarea = (index) => {
    const lista = subareas.filter((_, i) => i !== index);
    setSubareas(lista.length ? lista : [""]);
  };

  const iniciarEdicao = (area) => {
    setEditandoId(area.id);
    setEditAreaMatriz(area.nome || "");
    setEditSubareas(area.subareas?.length ? area.subareas : [""]);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditAreaMatriz("");
    setEditSubareas([""]);
  };

  const adicionarSubareaEdicao = () => {
    setEditSubareas([...editSubareas, ""]);
  };

  const alterarSubareaEdicao = (index, valor) => {
    const lista = [...editSubareas];
    lista[index] = valor;
    setEditSubareas(lista);
  };

  const removerSubareaEdicao = (index) => {
    const lista = editSubareas.filter((_, i) => i !== index);
    setEditSubareas(lista.length ? lista : [""]);
  };

  const salvarEdicao = async (id) => {
    if (!editAreaMatriz.trim()) {
      alert("Digite o nome da Área Matriz.");
      return;
    }

    const subareasLimpas = editSubareas
      .map((item) => item.trim())
      .filter(Boolean);

    await updateDoc(doc(dbFokus360, "areas", id), {
      nome: editAreaMatriz.trim().toUpperCase(),
      subareas: subareasLimpas,
      updatedAt: serverTimestamp(),
    });

    cancelarEdicao();
    carregarAreas();
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        p: 4,
        background: "linear-gradient(135deg, #f5f7fb 0%, #ffffff 100%)",
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "#312783", mb: 1 }}
        >
          Cadastro de Áreas e Unidades
        </Typography>

        <Typography sx={{ color: "#777", mb: 4 }}>
          Gerencie as Áreas Matriz, subáreas e unidades do Grupo Fokus.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
            gap: 3,
          }}
        >
          {/* ÁREAS */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #e7e7ef",
              boxShadow: "0 10px 30px rgba(49,39,131,0.08)",
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <AccountTree sx={{ color: "#312783" }} />
              <Typography variant="h6" fontWeight="bold">
                Áreas Matriz
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Nome da Área Matriz"
              value={areaMatriz}
              onChange={(e) => setAreaMatriz(e.target.value)}
              sx={{ mb: 2 }}
            />

            {subareas.map((item, index) => (
              <Box key={index} display="flex" gap={1} mb={1}>
                <TextField
                  fullWidth
                  label={`Subárea ${index + 1}`}
                  value={item}
                  onChange={(e) => alterarSubarea(index, e.target.value)}
                />

                <IconButton
                  onClick={() => removerSubarea(index)}
                  sx={{ color: "#d32f2f" }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}

            <Button
              startIcon={<Add />}
              onClick={adicionarSubarea}
              sx={{ color: "#312783", fontWeight: "bold", mb: 2 }}
            >
              Adicionar Subárea
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={gerarAreaMatriz}
              sx={{
                backgroundColor: "#312783",
                borderRadius: 2,
                py: 1.3,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#241c66" },
              }}
            >
              Gerar Área Matriz
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography fontWeight="bold" mb={2}>
              Áreas cadastradas
            </Typography>

            {areasCadastradas.map((area) => (
              <Accordion
                key={area.id}
                disableGutters
                elevation={0}
                sx={{
                  mb: 2,
                  borderRadius: "14px !important",
                  border: "1px solid #e6e3f5",
                  backgroundColor: "#fafafe",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#312783" }} />}
                  sx={{
                    px: 2,
                    minHeight: 58,
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                      justifyContent: "space-between",
                    },
                  }}
                >
                  <Typography fontWeight="bold" color="#312783">
                    {area.nome}
                  </Typography>

                  <Box
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        iniciarEdicao(area);
                      }}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        deletarArea(area.id);
                      }}
                      sx={{ color: "#d32f2f" }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
                  {editandoId === area.id ? (
                    <>
                      <Typography fontWeight="bold" color="#312783" mb={1}>
                        Editar subáreas
                      </Typography>

                      {editSubareas.map((sub, index) => (
                        <Box key={index} display="flex" gap={1} mb={1}>
                          <TextField
                            fullWidth
                            size="small"
                            label={`Subárea ${index + 1}`}
                            value={sub}
                            onChange={(e) =>
                              alterarSubareaEdicao(index, e.target.value)
                            }
                          />

                          <IconButton
                            onClick={() => removerSubareaEdicao(index)}
                            sx={{ color: "#d32f2f" }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}

                      <Button
                        startIcon={<Add />}
                        onClick={adicionarSubareaEdicao}
                        sx={{
                          color: "#312783",
                          fontWeight: "bold",
                          mb: 2,
                        }}
                      >
                        Adicionar Subárea
                      </Button>

                      <Box display="flex" gap={1}>
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          onClick={() => salvarEdicao(area.id)}
                          sx={{
                            backgroundColor: "#2e7d32",
                            "&:hover": { backgroundColor: "#1b5e20" },
                          }}
                        >
                          Salvar
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<Close />}
                          onClick={cancelarEdicao}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {(area.subareas || []).map((sub, index) => (
                        <Chip
                          key={index}
                          label={sub}
                          size="small"
                          sx={{
                            backgroundColor: "#edeaff",
                            color: "#312783",
                            fontWeight: "bold",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          {/* UNIDADES */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #e7e7ef",
              boxShadow: "0 10px 30px rgba(49,39,131,0.08)",
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Business sx={{ color: "#312783" }} />
              <Typography variant="h6" fontWeight="bold">
                Unidades
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Nome da Unidade"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={criarUnidade}
              sx={{
                backgroundColor: "#312783",
                borderRadius: 2,
                py: 1.3,
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#241c66" },
              }}
            >
              Gerar Unidade
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography fontWeight="bold" mb={2}>
              Unidades cadastradas
            </Typography>

            {unidadesCadastradas.map((item) => (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 3,
                  border: "1px solid #ececf5",
                  backgroundColor: "#fafafe",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight="bold">{item.nome}</Typography>

                <IconButton
                  onClick={() => deletarUnidade(item.id)}
                  sx={{ color: "#d32f2f" }}
                >
                  <Delete />
                </IconButton>
              </Paper>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CadastroAreas;