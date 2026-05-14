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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  Save,
  Close,
  AccountTree,
  Business,
  Margin,
} from "@mui/icons-material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

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

    const subareasLimpas = subareas.map((item) => item.trim()).filter(Boolean);

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

    const subareasLimpas = editSubareas.map((item) => item.trim()).filter(Boolean);

    await updateDoc(doc(dbFokus360, "areas", id), {
      nome: editAreaMatriz.trim().toUpperCase(),
      subareas: subareasLimpas,
      updatedAt: serverTimestamp(),
    });

    cancelarEdicao();
    carregarAreas();
  };

  return (
    <Box sx={pageStyle}>
      <Box sx={pageInnerStyle}>
        <Paper elevation={0} sx={mainCardStyle}>
          <Box sx={topBarStyle} />

          <Box sx={contentStyle}>
            <Box sx={heroStyle}>
              <Box sx={heroIconStyle}>
                <AccountTree sx={{ color: "#fff", fontSize: 30 }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography sx={eyebrowStyle}>Configurações estruturais</Typography>

                <Typography sx={titleStyle}>Cadastro de Áreas e Unidades</Typography>

                <Typography sx={subtitleStyle}>
                  Gerencie áreas matriz, subáreas e unidades operacionais do Grupo Fokus.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: "rgba(148,163,184,0.22)" }} />

            <Box sx={gridStyle}>
              <Paper elevation={0} sx={sectionCardStyle}>
                <Box sx={sectionHeaderStyle}>
                  <Box sx={sectionIconStyle}>
                    <AccountTree />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={sectionTitleStyle}>Áreas Matriz</Typography>
                    <Typography sx={sectionSubtitleStyle}>
                      Cadastre áreas principais e suas subáreas.
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Nome da Área Matriz"
                  value={areaMatriz}
                  onChange={(e) => setAreaMatriz(e.target.value)}
                  sx={fieldStyle}
                />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, mt: 2 }}>
                  {subareas.map((item, index) => (
                    <Box key={index} sx={inputActionRowStyle}>
                      <TextField
                        fullWidth
                        label={`Subárea ${index + 1}`}
                        value={item}
                        onChange={(e) => alterarSubarea(index, e.target.value)}
                        sx={fieldStyle}
                      />

                      <IconButton
                        onClick={() => removerSubarea(index)}
                        sx={deleteIconStyle}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Box>

                <Button
                  startIcon={<Add />}
                  onClick={adicionarSubarea}
                  sx={outlineButtonStyle}
                >
                  Adicionar Subárea
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={gerarAreaMatriz}
                  sx={primaryButtonStyle}
                >
                  Gerar Área Matriz
                </Button>

                <Divider sx={{ my: 3, borderColor: "rgba(148,163,184,0.22)" }} />

                <Box sx={listHeaderStyle}>
                  <Typography sx={listTitleStyle}>Áreas cadastradas</Typography>

                  <Chip
                    label={`${areasCadastradas.length} área(s)`}
                    sx={counterChipStyle}
                  />
                </Box>

                <Box sx={{ width: "100%", minWidth: 0 }}>
                  {areasCadastradas.map((area) => (
                    <Accordion
                      key={area.id}
                      disableGutters
                      elevation={0}
                      sx={accordionStyle}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "#312783" }} />}
                        sx={accordionSummaryStyle}
                      >
                        <Box sx={accordionTitleWrapperStyle}>
                          <Typography sx={accordionTitleStyle}>{area.nome}</Typography>

                          <Box
                            sx={accordionActionsStyle}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => e.stopPropagation()}
                          >
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                iniciarEdicao(area);
                              }}
                              sx={editIconStyle}
                            >
                              <Edit />
                            </IconButton>

                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                deletarArea(area.id);
                              }}
                              sx={deleteIconStyle}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails sx={accordionDetailsStyle}>
                        {editandoId === area.id ? (
                          <Box sx={{ width: "100%", minWidth: 0 }}>
                            <Typography sx={editTitleStyle}>Editar subáreas</Typography>

                            <TextField
                              fullWidth
                              size="small"
                              label="Nome da Área Matriz"
                              value={editAreaMatriz}
                              onChange={(e) => setEditAreaMatriz(e.target.value)}
                              sx={{ ...fieldStyle, mb: 1.5 }}
                            />

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                              {editSubareas.map((sub, index) => (
                                <Box key={index} sx={inputActionRowStyle}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label={`Subárea ${index + 1}`}
                                    value={sub}
                                    onChange={(e) =>
                                      alterarSubareaEdicao(index, e.target.value)
                                    }
                                    sx={fieldStyle}
                                  />

                                  <IconButton
                                    onClick={() => removerSubareaEdicao(index)}
                                    sx={deleteIconStyle}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Box>
                              ))}
                            </Box>

                            <Button
                              startIcon={<Add />}
                              onClick={adicionarSubareaEdicao}
                              sx={outlineButtonStyle}
                            >
                              Adicionar Subárea
                            </Button>

                            <Box sx={editActionsStyle}>
                              <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={() => salvarEdicao(area.id)}
                                sx={successButtonStyle}
                              >
                                Salvar
                              </Button>

                              <Button
                                variant="outlined"
                                startIcon={<Close />}
                                onClick={cancelarEdicao}
                                sx={cancelButtonStyle}
                              >
                                Cancelar
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Box sx={chipsWrapStyle}>
                            {(area.subareas || []).map((sub, index) => (
                              <Chip key={index} label={sub} size="small" sx={subChipStyle} />
                            ))}

                            {(!area.subareas || area.subareas.length === 0) && (
                              <Typography sx={emptyTextStyle}>
                                Nenhuma subárea cadastrada.
                              </Typography>
                            )}
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}

                  {areasCadastradas.length === 0 && (
                    <Box sx={emptyBoxStyle}>Nenhuma área cadastrada.</Box>
                  )}
                </Box>
              </Paper>

              <Paper elevation={0} sx={sectionCardStyle}>
                <Box sx={sectionHeaderStyle}>
                  <Box sx={sectionIconStyle}>
                    <Business />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={sectionTitleStyle}>Unidades</Typography>
                    <Typography sx={sectionSubtitleStyle}>
                      Cadastre e gerencie unidades do sistema.
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Nome da Unidade"
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                  sx={fieldStyle}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={criarUnidade}
                  sx={primaryButtonStyle}
                  
                >
                  Gerar Unidade
                </Button>

                <Divider sx={{ my: 3, borderColor: "rgba(148,163,184,0.22)" }} />

                <Box sx={listHeaderStyle}>
                  <Typography sx={listTitleStyle}>Unidades cadastradas</Typography>

                  <Chip
                    label={`${unidadesCadastradas.length} unidade(s)`}
                    sx={counterChipStyle}
                  />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}>
                  {unidadesCadastradas.map((item) => (
                    <Paper key={item.id} elevation={0} sx={unitItemStyle}>
                      <Typography sx={unitNameStyle}>{item.nome}</Typography>

                      <IconButton
                        onClick={() => deletarUnidade(item.id)}
                        sx={deleteIconStyle}
                      >
                        <Delete />
                      </IconButton>
                    </Paper>
                  ))}

                  {unidadesCadastradas.length === 0 && (
                    <Box sx={emptyBoxStyle}>Nenhuma unidade cadastrada.</Box>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

const pageStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  boxSizing: "border-box",
  overflow: "hidden",
  isolation: "isolate",
  contain: "inline-size layout paint",
  px: { xs: 1.5, sm: 2, md: 4 },
  pt: { xs: 3, md: 5 },
  pb: 4,
};

const pageInnerStyle = {
  width: "100%",
  maxWidth: 1180,
  minWidth: 0,
  mx: "auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  overflow: "hidden",
  boxSizing: "border-box",
  contain: "inline-size layout paint",
};

const mainCardStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  borderRadius: { xs: "22px", md: "30px" },
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
  boxShadow: "0 28px 80px rgba(15,23,42,0.14)",
  border: "1px solid rgba(226,232,240,0.95)",
  boxSizing: "border-box",
};

const topBarStyle = {
  height: 8,
  background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
};

const contentStyle = {
  p: { xs: 2, sm: 3, md: 4 },
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  overflow: "hidden",
};

const heroStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.8,
  width: "100%",
  minWidth: 0,
};

const heroIconStyle = {
  width: { xs: 52, md: 62 },
  height: { xs: 52, md: 62 },
  minWidth: { xs: 52, md: 62 },
  borderRadius: "20px",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 18px 38px rgba(49,39,131,0.30)",
};

const eyebrowStyle = {
  fontSize: "12px",
  fontWeight: 900,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const titleStyle = {
  fontSize: { xs: 24, md: 34 },
  fontWeight: 950,
  color: "#0f172a",
  lineHeight: 1.05,
};

const subtitleStyle = {
  mt: 0.8,
  color: "#64748b",
  fontSize: 14,
  lineHeight: 1.5,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.45fr) minmax(320px, 0.85fr)" },
  gap: 3,
  width: "100%",
  minWidth: 0,
};

const sectionCardStyle = {
  p: { xs: 2, md: 3 },
  borderRadius: "26px",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.07)",
  background:
    "radial-gradient(circle at top right, rgba(49,39,131,0.08), transparent 35%), #fff",
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  overflow: "hidden",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.4,
  mb: 2.5,
  minWidth: 0,
};

const sectionIconStyle = {
  width: 46,
  height: 46,
  minWidth: 46,
  borderRadius: "16px",
  backgroundColor: "rgba(49,39,131,0.08)",
  color: "#312783",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const sectionTitleStyle = {
  fontSize: 20,
  fontWeight: 950,
  color: "#0f172a",
};

const sectionSubtitleStyle = {
  color: "#64748b",
  fontSize: 13,
  mt: 0.3,
};

const fieldStyle = {
  backgroundColor: "#fff",
  borderRadius: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
  },
};

const inputActionRowStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 44px",
  gap: 1,
  alignItems: "center",
  width: "100%",
  minWidth: 0,
};

const outlineButtonStyle = {
  mt: 1.5,
  mb: 2,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 900,
  color: "#312783",
  borderColor: "rgba(49,39,131,0.3)",
  "&:hover": {
    borderColor: "#312783",
    backgroundColor: "rgba(49,39,131,0.06)",
  },
};

const primaryButtonStyle = {
  top: 10,
  height: 46,
  borderRadius: "15px",
  fontWeight: 950,
  textTransform: "none",
  color: "#fff",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  boxShadow: "0 14px 30px rgba(49,39,131,0.24)",
  "&:hover": {
    background: "linear-gradient(135deg, #241d66, #5c4df2)",
  },
};

const listHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  mb: 2,
  flexWrap: "wrap",
};

const listTitleStyle = {
  fontSize: 16,
  fontWeight: 950,
  color: "#0f172a",
};

const counterChipStyle = {
  borderRadius: "12px",
  fontWeight: 900,
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.08)",
  border: "1px solid rgba(49,39,131,0.14)",
};

const accordionStyle = {
  mb: 2,
  borderRadius: "18px !important",
  border: "1px solid rgba(226,232,240,0.95)",
  backgroundColor: "#fff",
  overflow: "hidden",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
  "&:before": { display: "none" },
};

const accordionSummaryStyle = {
  px: 2,
  minHeight: 62,
  "& .MuiAccordionSummary-content": {
    minWidth: 0,
    alignItems: "center",
  },
};

const accordionTitleWrapperStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  width: "100%",
  minWidth: 0,
};

const accordionTitleStyle = {
  fontWeight: 950,
  color: "#312783",
  wordBreak: "break-word",
};

const accordionActionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  flexShrink: 0,
};

const accordionDetailsStyle = {
  pt: 0,
  px: 2,
  pb: 2,
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const editTitleStyle = {
  fontWeight: 950,
  color: "#312783",
  mb: 1.5,
};

const editActionsStyle = {
  display: "flex",
  gap: 1,
  flexWrap: "wrap",
  mt: 1.5,
};

const chipsWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  width: "100%",
  minWidth: 0,
};

const subChipStyle = {
  backgroundColor: "#edeaff",
  color: "#312783",
  fontWeight: 900,
  borderRadius: "10px",
};

const unitItemStyle = {
  p: 1.6,
  borderRadius: "16px",
  border: "1px solid rgba(226,232,240,0.95)",
  backgroundColor: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 1,
  minWidth: 0,
};

const unitNameStyle = {
  fontWeight: 900,
  color: "#0f172a",
  wordBreak: "break-word",
  minWidth: 0,
};

const deleteIconStyle = {
  color: "#d32f2f",
  backgroundColor: "rgba(211,47,47,0.08)",
  borderRadius: "12px",
  flexShrink: 0,
  "&:hover": {
    backgroundColor: "rgba(211,47,47,0.14)",
  },
};

const editIconStyle = {
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.08)",
  borderRadius: "12px",
  "&:hover": {
    backgroundColor: "rgba(49,39,131,0.14)",
  },
};

const successButtonStyle = {
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 900,
  background: "linear-gradient(135deg, #2e7d32, #16a34a)",
  "&:hover": {
    background: "linear-gradient(135deg, #1b5e20, #15803d)",
  },
};

const cancelButtonStyle = {
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 900,
  color: "#64748b",
  borderColor: "rgba(100,116,139,0.35)",
};

const emptyBoxStyle = {
  p: 2,
  borderRadius: "16px",
  backgroundColor: "#f8fafc",
  border: "1px dashed rgba(148,163,184,0.45)",
  color: "#64748b",
  fontWeight: 800,
  textAlign: "center",
};

const emptyTextStyle = {
  color: "#64748b",
  fontSize: 13,
  fontWeight: 700,
};

export default CadastroAreas;