import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";

import {
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { dbFokus360, storageFokus360 } from "../../data/firebase-config";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import HeatPumpIcon from '@mui/icons-material/HeatPump';


import { styled } from "@mui/material/styles";
import { accordionSummaryClasses } from "@mui/material/AccordionSummary";

import { Header } from "../../components";
import Editor from "../../components/Editor";


// 🔥 Accordion estilizado
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: "rotate(90deg)",
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));


// 🔥 Limite de tamanho por arquivo
const TAMANHO_MAXIMO_MB = 15;
const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024;

const ManuaisCSC = () => {
  const [formularios, setFormularios] = useState([
    { id: 1, titulo: "", descricao: "", subItens: [], anexos: [] },
  ]);
  const [expandedAccordion, setExpandedAccordion] = useState("panel-1");
  const [nomeProjeto, setNomeProjeto] = useState("");

  const [uploading, setUploading] = useState(false);

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  // ✅ Adicionar Formulário
  const adicionarFormulario = () => {
    const novoId = formularios.length + 1;
    setFormularios([
      ...formularios,
      { id: novoId, titulo: "", descricao: "", subItens: [], anexos: [] },
    ]);
    setExpandedAccordion(`panel-${novoId}`);
  };

  // ✅ Atualizar Formulário
  const atualizarFormulario = (id, campo, valor) => {
    setFormularios((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [campo]: valor } : f))
    );
  };

  // ✅ Adicionar Subitem
  const adicionarSubItem = (formId) => {
    setFormularios((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              subItens: [...form.subItens, { titulo: "", descricao: "" }],
            }
          : form
      )
    );
  };

  // ✅ Atualizar Subitem
  const atualizarSubItem = (formId, index, campo, valor) => {
    setFormularios((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              subItens: form.subItens.map((sub, i) =>
                i === index ? { ...sub, [campo]: valor } : sub
              ),
            }
          : form
      )
    );
  };

  // ✅ Upload por formulário
  const handleUploadArquivoPorFormulario = async (formId, event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const arquivosValidos = [];
    const arquivosInvalidos = [];

    files.forEach((file) => {
      if (file.size <= TAMANHO_MAXIMO_BYTES) {
        arquivosValidos.push(file);
      } else {
        arquivosInvalidos.push(file.name);
      }
    });

    if (arquivosInvalidos.length > 0) {
      alert(
        `❌ Arquivos acima de ${TAMANHO_MAXIMO_MB}MB:\n${arquivosInvalidos.join(
          "\n"
        )}`
      );
    }

    if (!arquivosValidos.length) return;

    setUploading(true);

    try {
      const uploads = await Promise.all(
        arquivosValidos.map(async (file) => {
          const caminho = `csc_uploads/${Date.now()}_${file.name}`;
          const storageRef = ref(storageFokus360, caminho);

          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);

          return {
            nomeArquivo: file.name,
            arquivoUrl: url,
          };
        })
      );

      setFormularios((prev) =>
        prev.map((form) =>
          form.id === formId
            ? { ...form, anexos: [...(form.anexos || []), ...uploads] }
            : form
        )
      );
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("❌ Erro ao enviar arquivos.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Salvar no Firestore
  const salvarFormularios = async () => {
    if (!nomeProjeto.trim()) {
      alert("Informe o nome do departamento antes de salvar.");
      return;
    }

    const doc = {
      nome: nomeProjeto.trim(),
      criadoEm: new Date(),
      itens: formularios.map((form) => ({
        titulo: form.titulo?.trim() || "",
        descricao: form.descricao || "",
        anexos: form.anexos || [],
        subItens: form.subItens.map((sub) => ({
          titulo: sub.titulo?.trim() || "",
          descricao: sub.descricao || "",
        })),
      })),
    };

    try {
      await addDoc(collection(dbFokus360, "csc"), doc);
      alert("✅ Projeto salvo com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao salvar:", error);
      alert("Erro ao salvar dados.");
    }
  };

  return (
    <Box sx={{ padding: "40px" }}>
      <Header
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <HeatPumpIcon sx={{ color: "#d71936", fontSize: 40 }} />
            <Typography>CSC DO GRUPO FOKUS</Typography>
          </Box>
        }
      />

      <TextField
        label="Nome do departamento"
        size="small"
        fullWidth
        value={nomeProjeto}
        onChange={(e) => setNomeProjeto(e.target.value)}
        sx={{ mb: 3, backgroundColor: "white", borderRadius: "6px" }}
      />

      {formularios.map((form) => (
        <Accordion
          key={form.id}
          expanded={expandedAccordion === `panel-${form.id}`}
          onChange={handleAccordionChange(`panel-${form.id}`)}
          sx={{ mb: 2, backgroundColor: "#fff" }}
        >
          <AccordionSummary>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography fontWeight="bold">
                {form.titulo?.trim() ? form.titulo : `Item #${form.id}`}
              </Typography>
              {formularios.length > 1 && (
                <IconButton
                  onClick={() =>
                    setFormularios((prev) =>
                      prev.filter((f) => f.id !== form.id)
                    )
                  }
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Título"
                size="small"
                fullWidth
                value={form.titulo}
                onChange={(e) =>
                  atualizarFormulario(form.id, "titulo", e.target.value)
                }
              />
              <Editor
                value={form.descricao}
                onChange={(value) =>
                  atualizarFormulario(form.id, "descricao", value)
                }
              />

              {/* Subitens */}
              {form.subItens.map((sub, index) => (
                <Accordion key={index} sx={{ backgroundColor: "#f9f9f9", ml: 2 }}>
                  <AccordionSummary>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                    >
                      <Typography fontWeight="bold">
                        {sub.titulo?.trim() || `Subitem #${index + 1}`}
                      </Typography>
                      <IconButton
                        onClick={() =>
                          setFormularios((prev) =>
                            prev.map((f) =>
                              f.id === form.id
                                ? {
                                    ...f,
                                    subItens: f.subItens.filter(
                                      (_, i) => i !== index
                                    ),
                                  }
                                : f
                            )
                          )
                        }
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <TextField
                      label="Título do Subitem"
                      size="small"
                      fullWidth
                      value={sub.titulo}
                      onChange={(e) =>
                        atualizarSubItem(form.id, index, "titulo", e.target.value)
                      }
                      sx={{ mb: 1 }}
                    />
                    <Editor
                      value={sub.descricao}
                      onChange={(value) =>
                        atualizarSubItem(form.id, index, "descricao", value)
                      }
                    />
                  </AccordionDetails>
                </Accordion>
              ))}

              <Button
                variant="outlined"
                onClick={() => adicionarSubItem(form.id)}
                startIcon={<AddIcon />}
                sx={{ textTransform: "none", alignSelf: "flex-start" }}
              >
                Adicionar Subitem
              </Button>

              {/* Upload */}
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    borderColor: "#312783",
                    backgroundColor: "#312783",
                    "&:hover": {
                      backgroundColor: "#312783",
                    },
                  }}
                >
                  {uploading ? "Enviando..." : "Enviar Arquivos"}
                  <input
                    type="file"
                    multiple
                    hidden
                    accept=".jpg,.jpeg,.xlsx,.xls,.pptx,.ppt,.doc,.docx,.pdf"
                    onChange={(e) => handleUploadArquivoPorFormulario(form.id, e)}
                  />
                </Button>

                {form.anexos.length > 0 && (
                  <Box mt={1}>
                    <Typography fontSize="0.875rem" fontWeight={500}>
                      <AttachFileIcon sx={{ fontSize: 18, mr: 1 }} />
                      Arquivos:
                    </Typography>
                    {form.anexos.map((a, idx) => (
                      <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        mt={0.5}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          padding: "6px 12px",
                          borderRadius: "4px",
                        }}
                      >
                        <Typography fontSize="0.85rem" color="green">
                          {a.nomeArquivo}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            setFormularios((prev) =>
                              prev.map((f) =>
                                f.id === form.id
                                  ? {
                                      ...f,
                                      anexos: f.anexos.filter(
                                        (_, i) => i !== idx
                                      ),
                                    }
                                  : f
                              )
                            )
                          }
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      <Button
        variant="outlined"
        onClick={adicionarFormulario}
        startIcon={<AddIcon />}
        sx={{
          textTransform: "none",
          color: "#d32f2f",
          borderColor: "#d32f2f",
        }}
      >
        Adicionar Item
      </Button>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          onClick={salvarFormularios}
          sx={{
            textTransform: "none",
            backgroundColor: "#d32f2f",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
          }}
        >
          Salvar tudo
        </Button>
      </Box>
    </Box>
  );
};

export default ManuaisCSC;
