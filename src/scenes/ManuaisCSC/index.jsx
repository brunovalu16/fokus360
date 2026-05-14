import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  dbFokus360,
  storageFokus360,
} from "../../data/firebase-config";

import { replaceImageUrlsWithBase64 } from "../../utils/replaceImageUrlsWithBase64(html)";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import HeatPumpIcon from "@mui/icons-material/HeatPump";

import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import { styled } from "@mui/material/styles";

import { Header } from "../../components";
import Editor from "../../components/Editor";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: "1px solid rgba(226,232,240,0.95)",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
  "&:not(:last-child)": {
    marginBottom: "18px",
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
))(() => ({
  backgroundColor: "#fff",
  flexDirection: "row-reverse",
  minHeight: "58px",

  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },

  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: "12px",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: "18px",
  borderTop: "1px solid rgba(226,232,240,0.95)",
  backgroundColor: "#fff",
}));

const TAMANHO_MAXIMO_MB = 15;
const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024;

const ManuaisCSC = () => {
  const [formularios, setFormularios] = useState([
    {
      id: 1,
      titulo: "",
      descricao: "",
      subItens: [],
      anexos: [],
    },
  ]);

  const [expandedAccordion, setExpandedAccordion] =
    useState("panel-1");

  const [nomeProjeto, setNomeProjeto] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleAccordionChange =
    (panel) => (_, isExpanded) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };

  const adicionarFormulario = () => {
    const novoId = formularios.length + 1;

    setFormularios([
      ...formularios,
      {
        id: novoId,
        titulo: "",
        descricao: "",
        subItens: [],
        anexos: [],
      },
    ]);

    setExpandedAccordion(`panel-${novoId}`);
  };

  const atualizarFormulario = (id, campo, valor) => {
    setFormularios((prev) =>
      prev.map((form) =>
        form.id === id
          ? {
              ...form,
              [campo]: valor,
            }
          : form
      )
    );
  };

  const adicionarSubItem = (formId) => {
    setFormularios((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              subItens: [
                ...form.subItens,
                {
                  titulo: "",
                  descricao: "",
                },
              ],
            }
          : form
      )
    );
  };

  const atualizarSubItem = (
    formId,
    index,
    campo,
    valor
  ) => {
    setFormularios((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              subItens: form.subItens.map((sub, i) =>
                i === index
                  ? {
                      ...sub,
                      [campo]: valor,
                    }
                  : sub
              ),
            }
          : form
      )
    );
  };

  const removerFormulario = (formId) => {
    setFormularios((prev) =>
      prev.filter((form) => form.id !== formId)
    );
  };

  const removerSubItem = (formId, index) => {
    setFormularios((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              subItens: form.subItens.filter(
                (_, i) => i !== index
              ),
            }
          : form
      )
    );
  };

  const handleUploadArquivo = async (event) => {
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

    try {
      setUploading(true);

      const uploads = await Promise.all(
        arquivosValidos.map(async (file) => {
          const caminho = `csc_uploads/${Date.now()}_${file.name}`;

          const storageRef = ref(
            storageFokus360,
            caminho
          );

          await uploadBytes(storageRef, file);

          const url = await getDownloadURL(storageRef);

          return {
            nomeArquivo: file.name,
            arquivoUrl: url,
            caminhoStorage: caminho,
          };
        })
      );

      setFormularios((prev) =>
        prev.map((form, index) =>
          index === 0
            ? {
                ...form,
                anexos: [
                  ...(form.anexos || []),
                  ...uploads,
                ],
              }
            : form
        )
      );

      alert("✅ Arquivos enviados com sucesso!");
    } catch (error) {
      console.error("Erro upload:", error);
      alert("❌ Erro ao enviar arquivos.");
    } finally {
      setUploading(false);
    }
  };

  const salvarFormularios = async () => {
    if (!nomeProjeto.trim()) {
      alert(
        "Informe o nome do departamento antes de salvar."
      );
      return;
    }

    try {
      const itensConvertidos = await Promise.all(
        formularios.map(async (form) => {
          const descricaoConvertida =
            await replaceImageUrlsWithBase64(
              form.descricao || ""
            );

          const subItensConvertidos =
            await Promise.all(
              (form.subItens || []).map(async (sub) => ({
                titulo: sub.titulo?.trim() || "",
                descricao:
                  await replaceImageUrlsWithBase64(
                    sub.descricao || ""
                  ),
              }))
            );

          return {
            titulo: form.titulo?.trim() || "",
            descricao: descricaoConvertida,
            anexos: form.anexos || [],
            subItens: subItensConvertidos,
          };
        })
      );

      await addDoc(collection(dbFokus360, "csc"), {
        nome: nomeProjeto.trim(),
        criadoEm: new Date(),
        itens: itensConvertidos,
      });

      alert("✅ Projeto salvo com sucesso!");
    } catch (error) {
      console.error("Erro salvar:", error);
      alert("❌ Erro ao salvar.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden",
        boxSizing: "border-box",
        px: { xs: 1.5, md: 5 },
        pt: 5,
        pb: 5,
      }}
    >
      <Header
        title={
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            <Box sx={headerIconStyle}>
              <HeatPumpIcon
                sx={{
                  color: "#fff",
                  fontSize: 27,
                }}
              />
            </Box>

            <Box>
              <Typography sx={headerSmallTextStyle}>
                CSC
              </Typography>

              <Typography sx={headerTitleStyle}>
                Cadastro de Manuais
              </Typography>
            </Box>
          </Box>
        }
      />

      <Box sx={pageWrapperStyle}>
        <Box sx={mainCardStyle}>
          <Box sx={topBarStyle} />

          <Box sx={contentStyle}>
            <Paper
              elevation={0}
              sx={heroCardStyle}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1.5}
              >
                <HeatPumpIcon
                  sx={{
                    color: "#d71936",
                    fontSize: 32,
                  }}
                />

                <Box>
                  <Typography
                    sx={headerSmallTextStyle}
                  >
                    Centro de Serviços Compartilhados
                  </Typography>

                  <Typography sx={heroTitleStyle}>
                    Criação de Manuais Premium
                  </Typography>
                </Box>
              </Box>

              <Typography sx={heroDescriptionStyle}>
                Crie manuais modernos, organizados,
                profissionais e totalmente estruturados.
              </Typography>
            </Paper>

            <TextField
              label="Nome do departamento"
              size="small"
              fullWidth
              value={nomeProjeto}
              onChange={(e) =>
                setNomeProjeto(e.target.value)
              }
              sx={departmentFieldStyle}
            />

            <Box
              sx={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
              }}
            >
              {formularios.map((form) => (
                <Accordion
                  key={form.id}
                  expanded={
                    expandedAccordion ===
                    `panel-${form.id}`
                  }
                  onChange={handleAccordionChange(
                    `panel-${form.id}`
                  )}
                  sx={premiumAccordionStyle}
                >
                  <AccordionSummary>
                    <Box sx={accordionHeaderStyle}>
                      <Typography
                        sx={accordionTitleStyle}
                      >
                        {form.titulo?.trim()
                          ? form.titulo
                          : `Item #${form.id}`}
                      </Typography>

                      {formularios.length > 1 && (
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation();
                            removerFormulario(form.id);
                          }}
                          size="small"
                          sx={deleteButtonStyle}
                        >
                          <DeleteIcon
                            fontSize="small"
                          />
                        </IconButton>
                      )}
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={2}
                      sx={{
                        width: "100%",
                        minWidth: 0,
                      }}
                    >
                      <TextField
                        label="Título"
                        size="small"
                        fullWidth
                        value={form.titulo}
                        onChange={(e) =>
                          atualizarFormulario(
                            form.id,
                            "titulo",
                            e.target.value
                          )
                        }
                      />

                      <Box sx={editorWrapperStyle}>
                        <Editor
                          value={form.descricao}
                          onChange={(value) =>
                            atualizarFormulario(
                              form.id,
                              "descricao",
                              value
                            )
                          }
                        />
                      </Box>

                      {form.subItens.map(
                        (sub, index) => (
                          <Accordion
                            key={index}
                            sx={
                              premiumSubAccordionStyle
                            }
                          >
                            <AccordionSummary>
                              <Box
                                sx={
                                  accordionHeaderStyle
                                }
                              >
                                <Typography
                                  sx={
                                    accordionTitleStyle
                                  }
                                >
                                  {sub.titulo?.trim() ||
                                    `Subitem #${
                                      index + 1
                                    }`}
                                </Typography>

                                <IconButton
                                  onClick={(
                                    event
                                  ) => {
                                    event.stopPropagation();

                                    removerSubItem(
                                      form.id,
                                      index
                                    );
                                  }}
                                  size="small"
                                  sx={
                                    deleteButtonStyle
                                  }
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
                                  atualizarSubItem(
                                    form.id,
                                    index,
                                    "titulo",
                                    e.target.value
                                  )
                                }
                                sx={{ mb: 2 }}
                              />

                              <Box
                                sx={
                                  editorWrapperStyle
                                }
                              >
                                <Editor
                                  value={
                                    sub.descricao
                                  }
                                  onChange={(
                                    value
                                  ) =>
                                    atualizarSubItem(
                                      form.id,
                                      index,
                                      "descricao",
                                      value
                                    )
                                  }
                                />
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        )
                      )}

                      <Button
                        variant="outlined"
                        onClick={() =>
                          adicionarSubItem(
                            form.id
                          )
                        }
                        startIcon={<AddIcon />}
                        sx={
                          outlineButtonStyle
                        }
                      >
                        Adicionar Subitem
                      </Button>

                      {form.anexos.length >
                        0 && (
                        <Box mt={1}>
                          <Typography
                            sx={
                              attachmentTitleStyle
                            }
                          >
                            <AttachFileIcon
                              sx={{
                                fontSize: 18,
                              }}
                            />
                            Arquivos anexados
                          </Typography>

                          <Box
                            display="flex"
                            flexDirection="column"
                            gap={1}
                          >
                            {form.anexos.map(
                              (
                                arquivo,
                                idx
                              ) => (
                                <Box
                                  key={idx}
                                  sx={
                                    attachmentItemStyle
                                  }
                                >
                                  <Typography
                                    sx={
                                      attachmentNameStyle
                                    }
                                  >
                                    {
                                      arquivo.nomeArquivo
                                    }
                                  </Typography>

                                  <IconButton
                                    onClick={() =>
                                      setFormularios(
                                        (
                                          prev
                                        ) =>
                                          prev.map(
                                            (
                                              f
                                            ) =>
                                              f.id ===
                                              form.id
                                                ? {
                                                    ...f,
                                                    anexos:
                                                      f.anexos.filter(
                                                        (
                                                          _,
                                                          i
                                                        ) =>
                                                          i !==
                                                          idx
                                                      ),
                                                  }
                                                : f
                                          )
                                      )
                                    }
                                    size="small"
                                    sx={
                                      deleteButtonStyle
                                    }
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )
                            )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            <Box sx={bottomActionStyle}>
              <Button
                variant="outlined"
                onClick={adicionarFormulario}
                startIcon={<AddIcon />}
                sx={outlineButtonStyle}
              >
                Adicionar Item
              </Button>

              <Box
                display="flex"
                gap={1.5}
                flexWrap="wrap"
              >
                <Button
                  variant="contained"
                  component="label"
                  sx={uploadButtonStyle}
                >
                  {uploading
                    ? "Enviando..."
                    : "Enviar Arquivos"}

                  <input
                    type="file"
                    multiple
                    hidden
                    accept=".jpg,.jpeg,.xlsx,.xls,.pptx,.ppt,.doc,.docx,.pdf"
                    onChange={
                      handleUploadArquivo
                    }
                  />
                </Button>

                <Button
                  variant="contained"
                  onClick={
                    salvarFormularios
                  }
                  sx={saveButtonStyle}
                >
                  Salvar Tudo
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const headerIconStyle = {
  width: 46,
  height: 46,
  borderRadius: "16px",
  background:
    "linear-gradient(135deg, #d71936, #ff4d5f)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow:
    "0 14px 30px rgba(215,25,54,0.28)",
};

const headerSmallTextStyle = {
  fontSize: "12px",
  fontWeight: 900,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const headerTitleStyle = {
  fontSize: {
    xs: 20,
    md: 28,
  },
  fontWeight: 950,
  color: "#0f172a",
};

const pageWrapperStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflowX: "hidden",
};

const mainCardStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
  borderRadius: "32px",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
  border:
    "1px solid rgba(226,232,240,0.95)",
  boxShadow:
    "0 28px 80px rgba(15,23,42,0.14)",
};

const topBarStyle = {
  height: 8,
  background:
    "linear-gradient(90deg, #d71936, #ff4d5f, #312783)",
};

const contentStyle = {
  p: {
    xs: 2,
    md: 4,
  },
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflowX: "hidden",
};

const heroCardStyle = {
  p: {
    xs: 2.5,
    md: 4,
  },
  mb: 3,
  borderRadius: "28px",
  background:
    "radial-gradient(circle at top right, rgba(215,25,54,0.10), transparent 35%), #fff",
  border:
    "1px solid rgba(226,232,240,0.95)",
  boxShadow:
    "0 18px 45px rgba(15,23,42,0.06)",
};

const heroTitleStyle = {
  fontSize: {
    xs: 22,
    md: 30,
  },
  fontWeight: 950,
  color: "#0f172a",
};

const heroDescriptionStyle = {
  mt: 2,
  color: "#64748b",
  lineHeight: 1.7,
};

const departmentFieldStyle = {
  mb: 3,

  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "#fff",
  },
};

const premiumAccordionStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
};

const premiumSubAccordionStyle = {
  backgroundColor: "#f8fafc",
  ml: {
    xs: 0,
    md: 2,
  },

  borderRadius: "16px !important",

  "&::before": {
    display: "none",
  },
};

const accordionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  gap: 1,
};

const accordionTitleStyle = {
  fontWeight: 900,
  color: "#0f172a",
  wordBreak: "break-word",
};

const deleteButtonStyle = {
  color: "#d71936",
  backgroundColor:
    "rgba(215,25,54,0.08)",

  "&:hover": {
    backgroundColor:
      "rgba(215,25,54,0.14)",
  },
};

const outlineButtonStyle = {
  width: "fit-content",
  textTransform: "none",
  fontWeight: 800,
  borderRadius: "14px",
  color: "#d71936",
  borderColor:
    "rgba(215,25,54,0.45)",

  "&:hover": {
    borderColor: "#d71936",
    backgroundColor:
      "rgba(215,25,54,0.06)",
  },
};

const saveButtonStyle = {
  textTransform: "none",
  borderRadius: "14px",
  px: 3,
  fontWeight: 900,
  background:
    "linear-gradient(135deg, #d71936, #ff4d5f)",

  boxShadow:
    "0 14px 30px rgba(215,25,54,0.24)",

  "&:hover": {
    background:
      "linear-gradient(135deg, #b91c1c, #d71936)",
  },
};

const uploadButtonStyle = {
  textTransform: "none",
  borderRadius: "14px",
  px: 3,
  fontWeight: 900,
  background:
    "linear-gradient(135deg, #312783, #6d5dfc)",

  boxShadow:
    "0 14px 30px rgba(49,39,131,0.24)",

  "&:hover": {
    background:
      "linear-gradient(135deg, #241d66, #5c4df2)",
  },
};

const bottomActionStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 2,
  mt: 4,
};

const attachmentTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  fontSize: "0.9rem",
  fontWeight: 800,
  color: "#475569",
  mb: 1,
};

const attachmentItemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  backgroundColor: "#fff",
  border:
    "1px solid rgba(226,232,240,0.95)",
  padding: "10px 14px",
  borderRadius: "14px",
};

const attachmentNameStyle = {
  fontSize: "0.85rem",
  color: "#16a34a",
  wordBreak: "break-word",
};

const editorWrapperStyle = {
  width: "100%",
  minWidth: 0,
  overflowX: "hidden",

  "& .ql-container": {
    maxWidth: "100%",
  },

  "& .ql-editor": {
    maxWidth: "100%",
    overflowX: "auto",
    wordBreak: "break-word",
  },
};

export default ManuaisCSC;