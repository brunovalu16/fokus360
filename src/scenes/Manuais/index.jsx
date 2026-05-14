import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  IconButton,
  MenuItem,
  Paper,
  Dialog,
} from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import AddIcon from "@mui/icons-material/Add";
import HeatPumpIcon from "@mui/icons-material/HeatPump";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";


import { onAuthStateChanged } from "firebase/auth";
import {
  getDocs,
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import html2pdf from "html2pdf.js";

import Editor from "../../components/Editor";
import { Header } from "../../components";
import { convertImagesToDataURL } from "../../utils/convertImagesToDataURL";
import {
  authFokus360,
  dbFokus360,
  storageFokus360,
} from "../../data/firebase-config";

const Accordion = (props) => (
  <MuiAccordion
    disableGutters
    elevation={0}
    square={false}
    {...props}
    sx={{
      border: "1px solid rgba(226,232,240,0.95)",
      borderRadius: "20px !important",
      overflow: "hidden",
      boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
      mb: 2,
      "&:before": {
        display: "none",
      },
      ...(props.sx || {}),
    }}
  />
);

const AccordionSummary = (props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
    sx={{
      backgroundColor: "#fff",
      flexDirection: "row-reverse",
      minHeight: "58px",
      "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(90deg)",
      },
      "& .MuiAccordionSummary-content": {
        marginLeft: "12px",
        minWidth: 0,
      },
      ...(props.sx || {}),
    }}
  />
);

const AccordionDetails = (props) => (
  <MuiAccordionDetails
    {...props}
    sx={{
      padding: "18px",
      borderTop: "1px solid rgba(226,232,240,0.95)",
      backgroundColor: "#fff",
      ...(props.sx || {}),
    }}
  />
);

function waitForImagesToLoad(element, callback) {
  const images = element.querySelectorAll("img");
  let loadedCount = 0;

  if (images.length === 0) return callback();

  images.forEach((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      loadedCount++;
      if (loadedCount === images.length) callback();
    } else {
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === images.length) callback();
      };
    }
  });
}

const Manuais = () => {
  const [projects, setProjects] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const [userRole, setUserRole] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [arquivosUpload, setArquivosUpload] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mostrarDialogPDF, setMostrarDialogPDF] = useState(false);
  const [mostrarConteudoPDF, setMostrarConteudoPDF] = useState(false);

  const [nomeProjeto, setNomeProjeto] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);

  const [formularios, setFormularios] = useState([
    { id: 1, titulo: "", descricao: "", subItens: [], anexos: [] },
  ]);

  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [expandedSubAccordions, setExpandedSubAccordions] = useState({});
  const [highlightedMatches, setHighlightedMatches] = useState([]);

  const formRefs = useRef({});
  const subItemRefs = useRef({});

  const isAdmin = userRole === "08";

  const TAMANHO_MAXIMO_MB = 40;
  const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024;

  const normalizarTexto = (texto) => {
    return (
      texto
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") || ""
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(dbFokus360, "user", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserRole(String(docSnap.data().role || "").padStart(2, "0"));
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      } else {
        setUserRole("");
      }

      setIsLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(dbFokus360, "csc"));
        const lista = querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          nome: docItem.data().nome || "Sem nome",
        }));

        setProjects(lista);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (highlightedMatches.length > 0) {
      const first = highlightedMatches[0];
      setExpandedAccordion(`panel-${first.formId}`);

      setTimeout(() => {
        const refElement = formRefs.current[first.formId];

        if (refElement?.scrollIntoView) {
          refElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [highlightedMatches]);

  const uploadFileToFirebase = async (file) => {
    const timestamp = Date.now();
    const storageRef = ref(
      storageFokus360,
      `csc-anexos/${timestamp}-${file.name}`
    );

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return {
      nomeArquivo: file.name,
      arquivoUrl: url,
    };
  };

  const carregarProjetoSelecionado = async (projectId) => {
    try {
      const docRef = doc(dbFokus360, "csc", projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("Projeto não encontrado.");
        return;
      }

      const data = docSnap.data();

      setNomeProjeto(data.nome || "");

      const formulariosConvertidos = (data.itens || []).map((item, index) => ({
        id: index + 1,
        titulo: item.titulo || "",
        descricao: item.descricao || "",
        subItens: Array.isArray(item.subItens)
          ? item.subItens.map((sub) => ({
              titulo: sub.titulo || "",
              descricao: sub.descricao || "",
            }))
          : [],
        anexos: Array.isArray(item.anexos) ? item.anexos : [],
      }));

      setFormularios(
        formulariosConvertidos.length
          ? formulariosConvertidos
          : [{ id: 1, titulo: "", descricao: "", subItens: [], anexos: [] }]
      );

      setExpandedAccordion(null);
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      alert("Erro ao carregar projeto.");
    }
  };

  const buscarPalavraNoProjeto = () => {
    if (!searchText.trim()) return;

    const termo = normalizarTexto(searchText);
    const matches = [];
    const expandedSub = {};
    const expandedMain = [];

    formularios.forEach((form) => {
      const formId = form.id;
      let encontrouNoForm = false;

      if (normalizarTexto(form.titulo).includes(termo)) {
        matches.push({ formId, type: "titulo" });
        encontrouNoForm = true;
      }

      if (normalizarTexto(form.descricao).includes(termo)) {
        matches.push({ formId, type: "descricao" });
        encontrouNoForm = true;
      }

      form.subItens?.forEach((sub, subIndex) => {
        if (normalizarTexto(sub.titulo).includes(termo)) {
          matches.push({ formId, type: "subTitulo", subIndex });
          expandedSub[`${formId}-${subIndex}`] = true;
          encontrouNoForm = true;
        }

        if (normalizarTexto(sub.descricao).includes(termo)) {
          matches.push({ formId, type: "subDescricao", subIndex });
          expandedSub[`${formId}-${subIndex}`] = true;
          encontrouNoForm = true;
        }
      });

      if (encontrouNoForm) {
        expandedMain.push(`panel-${formId}`);
      }
    });

    setHighlightedMatches(matches);
    setExpandedAccordion(expandedMain.length > 0 ? expandedMain[0] : null);
    setExpandedSubAccordions(expandedSub);

    if (matches.length > 0) {
      const first = matches[0];
      const refElement = first.type.startsWith("sub")
        ? subItemRefs.current[`${first.formId}-${first.subIndex}`]
        : formRefs.current[first.formId];

      if (refElement?.scrollIntoView) {
        refElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      alert("Palavra não encontrada.");
    }
  };

  const grifarPalavra = (texto) => {
    const termo = searchText.trim();
    if (!termo || !texto) return texto;

    const normalizar = (str) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const termoNormalizado = normalizar(termo);
    const textoNormalizado = normalizar(texto);

    const mapaIndices = [];
    let indexOriginal = 0;

    for (const char of texto) {
      const charNormalizado = char
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      for (let i = 0; i < charNormalizado.length; i++) {
        mapaIndices.push(indexOriginal);
      }

      indexOriginal++;
    }

    const resultado = [];
    let posicaoAtualNoTexto = 0;
    const regex = new RegExp(termoNormalizado, "gi");
    let match;

    while ((match = regex.exec(textoNormalizado)) !== null) {
      const indexNoNormalizado = match.index;
      const length = termoNormalizado.length;

      const indexNoOriginal = mapaIndices[indexNoNormalizado];
      const indexFimNoOriginal =
        mapaIndices[indexNoNormalizado + length - 1] + 1 || texto.length;

      const antes = texto.slice(posicaoAtualNoTexto, indexNoOriginal);
      if (antes) resultado.push(antes);

      const trecho = texto.slice(indexNoOriginal, indexFimNoOriginal);

      resultado.push(
        <mark
          key={indexNoOriginal}
          style={{ backgroundColor: "#fff176", padding: "0 2px" }}
        >
          {trecho}
        </mark>
      );

      posicaoAtualNoTexto = indexFimNoOriginal;
    }

    const depois = texto.slice(posicaoAtualNoTexto);
    if (depois) resultado.push(depois);

    return resultado;
  };

  const destacarNoHtml = (texto) => {
    const termo = searchText.trim();
    if (!termo || !texto) return texto;

    const normalizar = (str) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const termoNormalizado = normalizar(termo);
    const textoNormalizado = normalizar(texto);

    let resultado = "";
    let i = 0;

    while (i < texto.length) {
      const trechoNormalizado = textoNormalizado.slice(i);

      if (trechoNormalizado.startsWith(termoNormalizado)) {
        const fim = i + termo.length;
        resultado += `<mark style="background-color: #fff176;">${texto.slice(
          i,
          fim
        )}</mark>`;
        i = fim;
      } else {
        resultado += texto[i];
        i++;
      }
    }

    return resultado;
  };

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const adicionarFormulario = () => {
    if (!isAdmin) {
      alert("❌ Você não tem permissão para adicionar.");
      return;
    }

    const novoId = formularios.length + 1;

    setFormularios([
      ...formularios,
      { id: novoId, titulo: "", descricao: "", subItens: [], anexos: [] },
    ]);

    setExpandedAccordion(`panel-${novoId}`);
  };

  const atualizarFormulario = (id, campo, valor) => {
    setFormularios((prev) =>
      prev.map((form) => (form.id === id ? { ...form, [campo]: valor } : form))
    );
  };

  const atualizarSubItem = (formId, subIndex, campo, valor) => {
    setFormularios((prev) =>
      prev.map((form) => {
        if (form.id !== formId) return form;

        const novosSubItens = (form.subItens || []).map((sub, index) =>
          index === subIndex ? { ...sub, [campo]: valor } : sub
        );

        return {
          ...form,
          subItens: novosSubItens,
        };
      })
    );
  };

  const adicionarSubItem = (formId, posicao) => {
    if (!isAdmin) {
      alert("❌ Você não tem permissão para adicionar.");
      return;
    }

    setFormularios((prev) =>
      prev.map((form) => {
        if (form.id !== formId) return form;

        const novosSubItens = [...(form.subItens || [])];
        const novoSubItem = { titulo: "", descricao: "" };
        const indexParaInserir =
          posicao != null ? posicao + 1 : novosSubItens.length;

        novosSubItens.splice(indexParaInserir, 0, novoSubItem);

        return {
          ...form,
          subItens: novosSubItens,
        };
      })
    );
  };

  const removerFormulario = (id) => {
    if (!isAdmin) {
      alert("❌ Você não tem permissão para remover.");
      return;
    }

    setFormularios((prev) => prev.filter((form) => form.id !== id));

    if (expandedAccordion === `panel-${id}`) {
      setExpandedAccordion(null);
    }
  };

  const removerSubItem = (formId, index) => {
    if (!isAdmin) {
      alert("❌ Você não tem permissão para remover.");
      return;
    }

    setFormularios((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              subItens: form.subItens.filter((_, i) => i !== index),
            }
          : form
      )
    );

    const subKey = `${formId}-${index}`;

    setExpandedSubAccordions((prev) => {
      const copy = { ...prev };
      delete copy[subKey];
      return copy;
    });
  };

  const salvarFormularios = async () => {
    if (!isAdmin) {
      alert("❌ Você não tem permissão para executar esta ação.");
      return;
    }

    if (!nomeProjeto.trim()) {
      alert("Informe o nome do departamento antes de salvar.");
      return;
    }

    setSalvando(true);
    setMensagemSucesso("");

    try {
      const docData = {
        nome: nomeProjeto.trim(),
        criadoEm: new Date(),
        itens: formularios.map((form) => ({
          titulo: form.titulo || "",
          descricao: form.descricao || "",
          anexos: form.anexos || [],
          subItens: (form.subItens || []).map((sub) => ({
            titulo: sub.titulo || "",
            descricao: sub.descricao || "",
          })),
        })),
      };

      if (selectedFilter) {
        const docRef = doc(dbFokus360, "csc", selectedFilter);
        await updateDoc(docRef, docData);
      } else {
        const novoDoc = await addDoc(collection(dbFokus360, "csc"), docData);
        setSelectedFilter(novoDoc.id);
      }

      const querySnapshot = await getDocs(collection(dbFokus360, "csc"));
      const lista = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        nome: docItem.data().nome || "Sem nome",
      }));

      setProjects(lista);
      setArquivosUpload([]);
      setMensagemSucesso("✅ Manual salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
      alert("Erro ao salvar dados.");
    } finally {
      setSalvando(false);
    }
  };

  const handleUploadArquivo = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const arquivosGrandes = files.filter(
      (file) => file.size > TAMANHO_MAXIMO_BYTES
    );

    if (arquivosGrandes.length > 0) {
      alert("❌ Limite máximo de arquivo permitido é de 40MB");
    }

    const arquivosValidos = files.filter(
      (file) => file.size <= TAMANHO_MAXIMO_BYTES
    );

    if (arquivosValidos.length === 0) return;

    setUploading(true);

    try {
      const uploads = await Promise.all(
        arquivosValidos.map(async (file) => uploadFileToFirebase(file))
      );

      setArquivosUpload((prev) => [...prev, ...uploads]);

      setFormularios((prev) =>
        prev.map((form, index) =>
          index === 0
            ? { ...form, anexos: [...(form.anexos || []), ...uploads] }
            : form
        )
      );

      alert("✅ Arquivos enviados e anexados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar arquivos:", error);
      alert("❌ Erro ao enviar arquivos.");
    } finally {
      setUploading(false);
    }
  };

  const removerArquivoUpload = (nomeArquivo) => {
    setArquivosUpload((prev) =>
      prev.filter((arquivo) => arquivo.nomeArquivo !== nomeArquivo)
    );
  };

  const gerarHtmlManual = () => {
    return `
      <div style="padding: 24px; font-family: Arial, sans-serif;">
        <h1 style="font-size: 24px; margin-bottom: 24px;">${nomeProjeto}</h1>
        ${formularios
          .map(
            (form) => `
            <div class="manual-section avoid-break-inside" style="margin-bottom: 32px;">
              <h2 style="font-size: 18px; margin-bottom: 8px;">${
                form.titulo
              }</h2>
              <div>${form.descricao || ""}</div>

              ${(form.subItens || [])
                .map(
                  (sub) => `
                    <div style="margin-left: 16px; margin-top: 12px;" class="avoid-break-inside">
                      <h3 style="font-size: 15px; margin-bottom: 4px;">${
                        sub.titulo
                      }</h3>
                      <div>${sub.descricao || ""}</div>
                    </div>
                  `
                )
                .join("")}

              ${
                form.anexos?.length
                  ? `<div style="margin-top: 16px;">
                      ${form.anexos
                        .map(
                          (anexo) =>
                            `<div style="margin-top: 8px;">
                              <img src="${anexo.arquivoUrl}" alt="${anexo.nomeArquivo}" style="max-width: 300px; max-height: 400px;" />
                            </div>`
                        )
                        .join("")}
                    </div>`
                  : ""
              }
            </div>
          `
          )
          .join("")}
      </div>
    `;
  };

  const exportarPDF = () => {
    setMostrarDialogPDF(true);
  };

  useEffect(() => {
    if (mostrarDialogPDF) {
      setTimeout(() => {
        const elemento = document.getElementById("conteudo-pdf");
        if (!elemento) return setMostrarDialogPDF(false);

        convertImagesToDataURL(elemento).then(() => {
          html2pdf()
            .from(elemento)
            .set({
              margin: [20, 20, 30, 20],
              filename: `${nomeProjeto || "manual"}.pdf`,
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .save()
            .then(() => setMostrarDialogPDF(false));
        });
      }, 400);
    }
  }, [mostrarDialogPDF, nomeProjeto]);

  useEffect(() => {
    if (mostrarConteudoPDF) {
      setTimeout(() => {
        const elemento = document.getElementById("conteudo-pdf");
        if (!elemento) return setMostrarConteudoPDF(false);

        convertImagesToDataURL(elemento)
          .then(() => new Promise((resolve) => waitForImagesToLoad(elemento, resolve)))
          .then(() => {
            html2pdf()
              .from(elemento)
              .set({
                margin: [20, 20, 30, 20],
                filename: `${nomeProjeto || "manual"}.pdf`,
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
              })
              .save()
              .then(() => setMostrarConteudoPDF(false));
          });
      }, 400);
    }
  }, [mostrarConteudoPDF, nomeProjeto]);

  const deletarProjetoAtual = async () => {
    if (!isAdmin) {
      alert("❌ Você não tem permissão para deletar.");
      return;
    }

    if (!selectedFilter) {
      alert("Nenhum projeto selecionado.");
      return;
    }

    const confirmar = window.confirm(
      "Tem certeza que deseja deletar este projeto do banco de dados? Essa ação não pode ser desfeita."
    );

    if (!confirmar) return;

    try {
      await deleteDoc(doc(dbFokus360, "csc", selectedFilter));

      alert("✅ Manual deletado com sucesso.");

      setSelectedFilter(null);
      setNomeProjeto("");
      setFormularios([{ id: 1, titulo: "", descricao: "", subItens: [], anexos: [] }]);

      const querySnapshot = await getDocs(collection(dbFokus360, "csc"));
      const lista = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        nome: docItem.data().nome || "Sem nome",
      }));

      setProjects(lista);
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      alert("Erro ao deletar projeto.");
    }
  };

  return (
    <>
      <Box
        sx={{
          px: { xs: 2, md: 5 },
          pt: 5,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={headerIconStyle}>
                <HeatPumpIcon sx={{ color: "#fff", fontSize: 27 }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography sx={headerSmallTextStyle}>CSC</Typography>

                <Typography sx={headerTitleStyle}>
                  Centro de Serviços Compartilhados
                </Typography>
              </Box>
            </Box>
          }
        />
      </Box>

      <Box sx={pageWrapperStyle}>
        <Box sx={mainCardStyle}>
          <Box sx={topBarStyle} />

          <Box sx={contentStyle}>
            <Box sx={topFiltersGridStyle}>
              <Paper elevation={0} sx={premiumSearchCardStyle}>
                <FilterListIcon sx={{ color: "#d71936", flexShrink: 0 }} />

                <Select
                  fullWidth
                  displayEmpty
                  value={selectedFilter || ""}
                  onChange={async (e) => {
                    const selectedValue = e.target.value;
                    setSelectedFilter(selectedValue);
                    await carregarProjetoSelecionado(selectedValue);
                  }}
                  sx={premiumSelectStyle}
                >
                  <MenuItem value="" disabled>
                    Selecione um departamento
                  </MenuItem>

                  {projects.map((projeto) => (
                    <MenuItem key={projeto.id} value={projeto.id}>
                      {projeto.nome}
                    </MenuItem>
                  ))}
                </Select>

                <Button
                  onClick={() => {
                    setSelectedFilter(null);
                    setNomeProjeto("");
                    setSearchText("");
                    setFormularios([
                      { id: 1, titulo: "", descricao: "", subItens: [], anexos: [] },
                    ]);
                  }}
                  startIcon={<ClearAllIcon />}
                  sx={redButtonStyle}
                >
                  Limpar
                </Button>
              </Paper>

              <Paper elevation={0} sx={premiumSearchCardStyle}>
                <FilterListIcon sx={{ color: "#312783", flexShrink: 0 }} />

                <TextField
                  fullWidth
                  placeholder="Pesquisar no manual..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      buscarPalavraNoProjeto();
                    }
                  }}
                  sx={premiumTextFieldStyle}
                />

                <Button onClick={buscarPalavraNoProjeto} sx={purpleButtonStyle}>
                  Buscar
                </Button>
              </Paper>
            </Box>

            <Paper elevation={0} sx={manualHeaderCardStyle}>
              <Box display="flex" alignItems="center" gap={1.5} sx={{ minWidth: 0 }}>
                <PlayCircleFilledIcon
                  sx={{ color: "#d71936", fontSize: 28, flexShrink: 0 }}
                />

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={headerSmallTextStyle}>
                    Manual do departamento
                  </Typography>

                  <Typography sx={manualTitleStyle}>
                    {nomeProjeto || "Selecione ou cadastre um departamento"}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" gap={1} flexWrap="wrap">
                <Button
                  variant="outlined"
                  onClick={adicionarFormulario}
                  disabled={!isAdmin}
                  startIcon={<AddIcon />}
                  sx={outlineRedButtonStyle}
                >
                  Adicionar Item
                </Button>

                <Button
                  variant="contained"
                  onClick={salvarFormularios}
                  disabled={!isAdmin}
                  sx={solidRedButtonStyle}
                >
                  Salvar
                </Button>
              </Box>
            </Paper>

            <TextField
              disabled={!isAdmin}
              label="Nome do departamento"
              size="small"
              fullWidth
              value={nomeProjeto}
              onChange={(e) => setNomeProjeto(e.target.value)}
              sx={departmentFieldStyle}
            />

            <Box sx={{ width: "100%", minWidth: 0 }}>
              {formularios.map((form) => (
                <Box
                  key={form.id}
                  ref={(el) => (formRefs.current[form.id] = el)}
                  sx={{ minWidth: 0 }}
                >
                  <Accordion
                    expanded={expandedAccordion === `panel-${form.id}`}
                    onChange={handleAccordionChange(`panel-${form.id}`)}
                    sx={premiumAccordionStyle}
                  >
                    <AccordionSummary
                      aria-controls={`panel-${form.id}-content`}
                      id={`panel-${form.id}-header`}
                    >
                      <Box sx={accordionHeaderRowStyle}>
                        <Typography sx={accordionTitleStyle}>
                          {searchText.trim()
                            ? grifarPalavra(form.titulo?.trim() || `Item #${form.id}`)
                            : form.titulo?.trim() || `Item #${form.id}`}
                        </Typography>

                        {isAdmin && (
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation();
                              removerFormulario(form.id);
                            }}
                            size="small"
                            sx={iconDeleteStyle}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Box display="flex" flexDirection="column" gap={2} sx={{ minWidth: 0 }}>
                        {normalizarTexto(form.titulo).includes(normalizarTexto(searchText)) &&
                        searchText.trim() ? (
                          <Box sx={highlightBoxStyle}>
                            <Typography variant="body2">
                              {grifarPalavra(form.titulo)}
                            </Typography>
                          </Box>
                        ) : (
                          <TextField
                            label="Título"
                            size="small"
                            fullWidth
                            value={form.titulo}
                            onChange={(e) =>
                              atualizarFormulario(form.id, "titulo", e.target.value)
                            }
                            disabled={!isAdmin}
                          />
                        )}

                        {normalizarTexto(form.descricao).includes(
                          normalizarTexto(searchText)
                        ) && searchText.trim() ? (
                          <Box sx={editorPreviewBoxStyle}>
                            <div
                              className="editor-content"
                              dangerouslySetInnerHTML={{
                                __html: searchText.trim()
                                  ? destacarNoHtml(form.descricao)
                                  : form.descricao,
                              }}
                            />
                          </Box>
                        ) : (
                          <Box sx={editorWrapperStyle}>
                            <Editor
                              value={form.descricao}
                              onChange={(value) =>
                                atualizarFormulario(form.id, "descricao", value)
                              }
                              readOnly={!isAdmin}
                            />
                          </Box>
                        )}

                        {form.subItens?.map((sub, index) => {
                          const subKey = `${form.id}-${index}`;
                          const tituloMatch = normalizarTexto(sub.titulo).includes(
                            normalizarTexto(searchText)
                          );
                          const descricaoMatch = normalizarTexto(sub.descricao).includes(
                            normalizarTexto(searchText)
                          );
                          const isExpanded = expandedSubAccordions[subKey] || false;

                          return (
                            <Accordion
                              key={subKey}
                              expanded={isExpanded}
                              onChange={() =>
                                setExpandedSubAccordions((prev) => ({
                                  ...prev,
                                  [subKey]: !prev[subKey],
                                }))
                              }
                              sx={premiumSubAccordionStyle}
                            >
                              <AccordionSummary>
                                <Box sx={accordionHeaderRowStyle}>
                                  <Typography sx={accordionTitleStyle}>
                                    {tituloMatch && searchText.trim()
                                      ? grifarPalavra(sub.titulo)
                                      : sub.titulo?.trim() || `Subitem #${index + 1}`}
                                  </Typography>

                                  {isAdmin && (
                                    <IconButton
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        removerSubItem(form.id, index);
                                      }}
                                      size="small"
                                      sx={iconDeleteStyle}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </Box>
                              </AccordionSummary>

                              <AccordionDetails
                                ref={(el) => (subItemRefs.current[subKey] = el)}
                              >
                                {tituloMatch && searchText.trim() ? (
                                  <Box sx={highlightBoxStyle}>
                                    <Typography variant="body2">
                                      {grifarPalavra(sub.titulo)}
                                    </Typography>
                                  </Box>
                                ) : (
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
                                    sx={{ mb: 1 }}
                                    disabled={!isAdmin}
                                  />
                                )}

                                {descricaoMatch && searchText.trim() ? (
                                  <Box className="ql-editor" sx={editorPreviewBoxStyle}>
                                    <div
                                      className="editor-content"
                                      dangerouslySetInnerHTML={{
                                        __html: destacarNoHtml(sub.descricao),
                                      }}
                                    />
                                  </Box>
                                ) : (
                                  <Box sx={editorWrapperStyle}>
                                    <Editor
                                      value={sub.descricao}
                                      onChange={(value) =>
                                        atualizarSubItem(
                                          form.id,
                                          index,
                                          "descricao",
                                          value
                                        )
                                      }
                                      readOnly={!isAdmin}
                                    />
                                  </Box>
                                )}

                                <Button
                                  variant="outlined"
                                  onClick={() => adicionarSubItem(form.id, index)}
                                  disabled={!isAdmin}
                                  startIcon={<AddIcon />}
                                  sx={{ ...outlineRedButtonStyle, mt: 2 }}
                                >
                                  Adicionar Subitem abaixo
                                </Button>
                              </AccordionDetails>
                            </Accordion>
                          );
                        })}

                        <Button
                          variant="outlined"
                          onClick={() => adicionarSubItem(form.id)}
                          disabled={!isAdmin}
                          startIcon={<AddIcon />}
                          sx={{ ...outlineRedButtonStyle, alignSelf: "flex-start" }}
                        >
                          Adicionar Subitem
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ))}
            </Box>

            <Box sx={filesGridStyle}>
              <Paper elevation={0} sx={uploadCardStyle}>
                <Typography sx={uploadTitleStyle}>Upload de arquivos</Typography>

                <Typography sx={uploadSubtitleStyle}>
                  Limite máximo permitido: 40MB por arquivo.
                </Typography>

                <Button
                  variant="contained"
                  component="label"
                  size="small"
                  disabled={!isAdmin || uploading}
                  sx={solidPurpleButtonStyle}
                >
                  {uploading ? "Enviando..." : "Enviar Arquivos"}
                  <input
                    type="file"
                    multiple
                    hidden
                    accept=".jpg,.jpeg,.xlsx,.xlsm,.xlsb,.xls,.pptx,.pptm,.ppt,.ppsx,.doc,.docx,.docm,.dotx,.pdf"
                    onChange={handleUploadArquivo}
                  />
                </Button>

                {uploading && (
                  <Typography sx={{ color: "#d32f2f", mt: 1, fontSize: 13 }}>
                    ⏳ Enviando arquivos, por favor aguarde...
                  </Typography>
                )}

                {arquivosUpload.length > 0 && (
                  <Box mt={2}>
                    <Typography fontSize="0.875rem" fontWeight={800}>
                      Arquivos enviados:
                    </Typography>

                    {arquivosUpload.map((arquivo, index) => (
                      <Box key={index} sx={uploadItemStyle}>
                        <Typography
                          fontSize="0.85rem"
                          color="green"
                          noWrap
                          sx={{
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {arquivo.nomeArquivo}
                        </Typography>

                        <IconButton
                          onClick={() => removerArquivoUpload(arquivo.nomeArquivo)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>

              {formularios.some(
                (form) => Array.isArray(form.anexos) && form.anexos.length > 0
              ) && (
                <Paper elevation={0} sx={attachmentsCardStyle}>
                  <Typography sx={attachmentsTitleStyle}>
                    <AttachFileIcon sx={{ fontSize: 20, color: "#d71936" }} />
                    Anexos do projeto
                  </Typography>

                  <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
                    <Box component="table" sx={premiumTableStyle}>
                      <thead>
                        <Box
                          component="tr"
                          sx={{
                            background: "linear-gradient(135deg, #d71936, #ff4d5f)",
                          }}
                        >
                          <Box component="th" sx={tableHeadCellStyle}>
                            Nome do Arquivo
                          </Box>
                          <Box component="th" sx={tableActionCellStyle}>
                            Download
                          </Box>
                          <Box component="th" sx={tableActionCellStyle}>
                            Excluir
                          </Box>
                        </Box>
                      </thead>

                      <tbody>
                        {formularios
                          .flatMap((form) =>
                            (form.anexos || []).map((arquivo, index) => ({
                              ...arquivo,
                              formId: form.id,
                              index,
                            }))
                          )
                          .map(({ nomeArquivo, arquivoUrl, formId, index }) => (
                            <tr
                              key={`${formId}-${index}`}
                              style={{ borderTop: "1px solid #e2e8f0" }}
                            >
                              <td style={tableNameCellInlineStyle}>
                                {nomeArquivo}
                              </td>

                              <td style={tableActionCellInlineStyle}>
                                <IconButton href={arquivoUrl} download size="small">
                                  <DownloadIcon
                                    fontSize="small"
                                    sx={{ color: "#d71936" }}
                                  />
                                </IconButton>
                              </td>

                              <td style={tableActionCellInlineStyle}>
                                <IconButton
                                  disabled={!isAdmin}
                                  size="small"
                                  onClick={() => {
                                    setFormularios((prev) =>
                                      prev.map((form) =>
                                        form.id === formId
                                          ? {
                                              ...form,
                                              anexos: form.anexos.filter(
                                                (_, idx) => idx !== index
                                              ),
                                            }
                                          : form
                                      )
                                    );
                                  }}
                                >
                                  <DeleteIcon
                                    fontSize="small"
                                    sx={{ color: isAdmin ? "#d71936" : "#94a3b8" }}
                                  />
                                </IconButton>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>

            <Box sx={bottomActionsStyle}>
              <Button
                variant="contained"
                onClick={salvarFormularios}
                disabled={!isAdmin}
                sx={solidRedButtonStyle}
              >
                Salvar
              </Button>

              <Button
                variant="outlined"
                onClick={exportarPDF}
                sx={outlineRedButtonStyle}
              >
                Baixar PDF
              </Button>

              <Button
                variant="outlined"
                onClick={deletarProjetoAtual}
                disabled={!isAdmin || !selectedFilter}
                sx={outlineRedButtonStyle}
              >
                Deletar Manual
              </Button>
            </Box>

            {salvando && (
              <Typography sx={{ color: "#d32f2f", mt: 2 }}>
                ⏳ Salvando dados e arquivos...
              </Typography>
            )}

            {mensagemSucesso && (
              <Typography sx={{ color: "#2e7d32", mt: 2 }}>
                {mensagemSucesso}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={mostrarDialogPDF}
        onClose={() => setMostrarDialogPDF(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ style: { boxShadow: "none", background: "#fff" } }}
      >
        <div
          id="conteudo-pdf"
          style={{ padding: 32, background: "#fff" }}
          dangerouslySetInnerHTML={{ __html: gerarHtmlManual() }}
        />
      </Dialog>

      {mostrarConteudoPDF && (
        <div
          id="conteudo-pdf"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1,
          }}
          dangerouslySetInnerHTML={{ __html: gerarHtmlManual() }}
        />
      )}
    </>
  );
};

const headerIconStyle = {
  width: 46,
  height: 46,
  borderRadius: "16px",
  background: "linear-gradient(135deg, #d71936, #ff4d5f)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 14px 30px rgba(215,25,54,0.28)",
};

const headerSmallTextStyle = {
  fontSize: "12px",
  fontWeight: 900,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const headerTitleStyle = {
  fontSize: { xs: 20, md: 28 },
  fontWeight: 950,
  color: "#0f172a",
  lineHeight: 1.1,
};

const pageWrapperStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  px: { xs: 1.5, md: 5 },
  mt: 2,
  mb: 4,
  overflowX: "hidden",
};

const mainCardStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  borderRadius: "30px",
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
  boxShadow: "0 28px 80px rgba(15,23,42,0.14)",
  border: "1px solid rgba(226,232,240,0.95)",
};

const topBarStyle = {
  height: 8,
  background: "linear-gradient(90deg, #d71936, #ff4d5f, #312783)",
};

const contentStyle = {
  p: { xs: 2, md: 4 },
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  overflowX: "hidden",
};

const topFiltersGridStyle = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    lg: "minmax(0, 1fr) minmax(320px, 0.8fr)",
  },
  gap: 2,
  mb: 3,
  width: "100%",
  minWidth: 0,
};

const premiumSearchCardStyle = {
  p: 1.5,
  display: "flex",
  alignItems: "center",
  gap: 1.2,
  borderRadius: "20px",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const premiumSelectStyle = {
  height: 44,
  borderRadius: "14px",
  backgroundColor: "#f8fafc",
  fontWeight: 700,
  color: "#334155",
  minWidth: 0,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(203,213,225,0.8)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d71936",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d71936",
  },
};

const premiumTextFieldStyle = {
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    height: 44,
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(203,213,225,0.8)",
  },
};

const manualHeaderCardStyle = {
  p: { xs: 2, md: 3 },
  mb: 3,
  borderRadius: "24px",
  background:
    "radial-gradient(circle at top right, rgba(215,25,54,0.10), transparent 35%), #fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", md: "center" },
  flexDirection: { xs: "column", md: "row" },
  gap: 2,
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const manualTitleStyle = {
  color: "#0f172a",
  fontWeight: 950,
  fontSize: { xs: 20, md: 26 },
  lineHeight: 1.1,
  wordBreak: "break-word",
};

const departmentFieldStyle = {
  mb: 3,
  backgroundColor: "#fff",
  borderRadius: "14px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
  },
};

const premiumAccordionStyle = {
  mb: 2,
  borderRadius: "20px !important",
  overflow: "hidden",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 12px 32px rgba(15,23,42,0.06)",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  "&:before": {
    display: "none",
  },
};

const premiumSubAccordionStyle = {
  backgroundColor: "#f8fafc",
  ml: { xs: 0, md: 2 },
  borderRadius: "16px !important",
  overflow: "hidden",
  border: "1px solid rgba(226,232,240,0.95)",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  "&:before": {
    display: "none",
  },
};

const accordionHeaderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  gap: 1,
  minWidth: 0,
};

const accordionTitleStyle = {
  color: "#0f172a",
  fontWeight: 900,
  wordBreak: "break-word",
  minWidth: 0,
};

const highlightBoxStyle = {
  border: "1px solid rgba(203,213,225,0.9)",
  borderRadius: "14px",
  padding: "12px",
  backgroundColor: "#fff",
};

const editorPreviewBoxStyle = {
  border: "1px solid rgba(203,213,225,0.9)",
  borderRadius: "14px",
  padding: "12px",
  minHeight: "120px",
  backgroundColor: "#fff",
  maxWidth: "100%",
  overflowX: "auto",
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

const filesGridStyle = {
  mt: 4,
  display: "grid",
  gridTemplateColumns: { xs: "1fr", lg: "360px minmax(0, 1fr)" },
  gap: 3,
  alignItems: "flex-start",
  width: "100%",
  minWidth: 0,
};

const uploadCardStyle = {
  p: 2.5,
  borderRadius: "24px",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
  width: "100%",
  minWidth: 0,
};

const uploadTitleStyle = {
  fontWeight: 950,
  color: "#0f172a",
  mb: 1,
};

const uploadSubtitleStyle = {
  color: "#64748b",
  fontSize: 13,
  mb: 2,
};

const attachmentsCardStyle = {
  p: 2.5,
  borderRadius: "24px",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
  width: "100%",
  minWidth: 0,
  overflowX: "hidden",
};

const attachmentsTitleStyle = {
  mb: 2,
  color: "#0f172a",
  fontWeight: 950,
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const uploadItemStyle = {
  mt: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  backgroundColor: "#f8fafc",
  padding: "8px 12px",
  borderRadius: "12px",
  maxWidth: "100%",
  border: "1px solid rgba(226,232,240,0.95)",
};

const premiumTableStyle = {
  width: "100%",
  minWidth: 520,
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
};

const tableHeadCellStyle = {
  p: 1.5,
  textAlign: "left",
  fontWeight: 900,
  color: "#fff",
  fontSize: 13,
};

const tableActionCellStyle = {
  p: 1.5,
  width: "110px",
  textAlign: "center",
  fontWeight: 900,
  color: "#fff",
  fontSize: 13,
};

const tableNameCellInlineStyle = {
  padding: "14px",
  fontSize: "0.875rem",
  maxWidth: 420,
  wordBreak: "break-word",
};

const tableActionCellInlineStyle = {
  padding: "12px",
  textAlign: "center",
};

const bottomActionsStyle = {
  mt: 4,
  display: "flex",
  justifyContent: "flex-end",
  gap: 2,
  flexWrap: "wrap",
  width: "100%",
};

const redButtonStyle = {
  height: 44,
  px: 2,
  borderRadius: "14px",
  color: "#fff",
  fontWeight: 900,
  textTransform: "none",
  background: "linear-gradient(135deg, #d71936, #ff4d5f)",
  boxShadow: "0 12px 26px rgba(215,25,54,0.24)",
  whiteSpace: "nowrap",
  "&:hover": {
    background: "linear-gradient(135deg, #b91c1c, #d71936)",
  },
};

const purpleButtonStyle = {
  height: 44,
  px: 2,
  borderRadius: "14px",
  color: "#fff",
  fontWeight: 900,
  textTransform: "none",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  boxShadow: "0 12px 26px rgba(49,39,131,0.24)",
  whiteSpace: "nowrap",
  "&:hover": {
    background: "linear-gradient(135deg, #241d66, #5c4df2)",
  },
};

const solidRedButtonStyle = {
  height: 42,
  px: 2.4,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 900,
  color: "#fff",
  background: "linear-gradient(135deg, #d71936, #ff4d5f)",
  boxShadow: "0 12px 26px rgba(215,25,54,0.24)",
  "&:hover": {
    background: "linear-gradient(135deg, #b91c1c, #d71936)",
  },
};

const solidPurpleButtonStyle = {
  height: 42,
  px: 2.4,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 900,
  color: "#fff",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  boxShadow: "0 12px 26px rgba(49,39,131,0.24)",
  "&:hover": {
    background: "linear-gradient(135deg, #241d66, #5c4df2)",
  },
};

const outlineRedButtonStyle = {
  height: 42,
  px: 2.2,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 900,
  color: "#d71936",
  borderColor: "rgba(215,25,54,0.45)",
  backgroundColor: "#fff",
  "&:hover": {
    borderColor: "#d71936",
    backgroundColor: "rgba(215,25,54,0.06)",
  },
};

const iconDeleteStyle = {
  color: "#d71936",
  backgroundColor: "rgba(215,25,54,0.08)",
  borderRadius: "10px",
  "&:hover": {
    backgroundColor: "rgba(215,25,54,0.14)",
  },
};

export default Manuais;