import React, { useEffect, useState, useRef  } from "react";
import { Box, Typography,
  ListItemText,
  Checkbox,
  Button,
  TextField,
  Modal,
  Select,
  IconButton,
  MenuItem,
  Paper,
  List,
  ListItemButton,
  Divider, } from "@mui/material";

import AttachFileIcon from '@mui/icons-material/AttachFile';

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

import Editor from "../../components/Editor";

import { onAuthStateChanged } from "firebase/auth";
import { authFokus360 } from "../../data/firebase-config";

import html2pdf from 'html2pdf.js';

import Dialog from "@mui/material/Dialog";
import { convertImagesToDataURL } from "../../utils/convertImagesToDataURL";
import { replaceImageUrlsWithBase64 } from "../../utils/replaceImageUrlsWithBase64(html)";





import { getDocs, collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config";
import { storageFokus360 } from "../../data/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";




import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import FilterListIcon from "@mui/icons-material/FilterList"; // Ícone para o Select
import ClearAllIcon from "@mui/icons-material/ClearAll"; // Ícone para limpar filtro
import AddIcon from "@mui/icons-material/Add"; // ✅ Importação correta
import AssessmentIcon from "@mui/icons-material/Assessment";
import HeatPumpIcon from '@mui/icons-material/HeatPump';

import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import DeleteIcon from '@mui/icons-material/Delete';



import { styled } from '@mui/material/styles';
import { accordionSummaryClasses } from '@mui/material/AccordionSummary';





import FiltrosPlanejamento2 from "../../components/FiltrosPlanejamento2";
import { Header } from "../../components"; 

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));


const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: 'rotate(90deg)',
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));



const LinhaItem = ({ cor, texto, onClick, style = {}, tipo, porcentagem   }) => (
  <Box mb={1} style={style}>
    {tipo && (
      <Typography fontWeight={400} sx={{ fontSize: "10px", marginBottom: "-5px" }}>
        {tipo}:
      </Typography>
    )}
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box
        sx={{
          width: "100%",
          height: "10px",
          backgroundColor: cor,
          borderRadius: "2px",
        }}
      />
      <Box ml={1}>
        <IconButton size="small" onClick={onClick}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>

    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        borderTop: "none",
        padding: "-2px",
        borderRadius: "0 0 4px 4px",
      }}
    >
      <Typography fontWeight={400} sx={{ fontSize: "11px" }}>
        {texto}
      </Typography>
      {porcentagem != null && (
        <Typography fontSize="10px" sx={{ color: "#888" }}>
          {porcentagem}%
        </Typography>
      )}
    </Box>
  </Box>
);


//PEgar todas as tarefas do banco
const extrairTarefas = (estrategicas) => {
  return estrategicas
    .flatMap(e => (e.taticas || []))
    .flatMap(t => (t.operacionais || []))
    .flatMap(o => (o.tarefas || []));
};


//Funções de calculos de progresso
const calcularProgressoTarefas = (tarefas = []) => {
  if (!tarefas.length) return 0;
  const concluidas = tarefas.filter(t => t.status === "concluida").length;
  return Math.round((concluidas / tarefas.length) * 100);
};

const calcularProgressoOperacional = (operacional) => {
  return calcularProgressoTarefas(operacional?.tarefas || []);
};

const calcularProgressoTatica = (tatica) => {
  const ops = tatica?.operacionais || [];
  if (!ops.length) return 0;
  const total = ops.reduce((acc, op) => acc + calcularProgressoOperacional(op), 0);
  return Math.round(total / ops.length);
};

const calcularProgressoEstrategica = (estrategica) => {
  const taticas = estrategica?.taticas || [];
  if (!taticas.length) return 0;
  const total = taticas.reduce((acc, tat) => acc + calcularProgressoTatica(tat), 0);
  return Math.round(total / taticas.length);
};

//definindo os componentes




function waitForImagesToLoad(element, callback) {
  const images = element.querySelectorAll('img');
  let loadedCount = 0;
  if (images.length === 0) return callback();
  images.forEach(img => {
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
  const [projects, setProjects] = useState([]); // Todos os projetos
  const [allCards, setAllCards] = useState([]); // 🔥 Armazena todos os cards para aplicar os filtros depois
  const [columns, setColumns] = useState([]);
  

//verifica usuario logado
const [userRole, setUserRole] = useState("");
const [isLoadingUser, setIsLoadingUser] = useState(true);

const isAdmin = userRole === "08";



  //estados para a parte de upload
const [arquivosUpload, setArquivosUpload] = useState([]);
const [uploading, setUploading] = useState(false);
const [uploadSuccess, setUploadSuccess] = useState(null);
const [mostrarDialogPDF, setMostrarDialogPDF] = useState(false);
const [mostrarConteudoPDF, setMostrarConteudoPDF] = useState(false);



  //estados para o fluxo grama
  const [expandedEstrategicas, setExpandedEstrategicas] = useState({});
  const [expandedTaticas, setExpandedTaticas] = useState({});
  const [expandedOperacionais, setExpandedOperacionais] = useState({});

  const [nomeProjeto, setNomeProjeto] = useState("");

  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Accordions de cadastro
  const [formularios, setFormularios] = useState([
    { id: 1, titulo: "", descricao: "", subItens: [] }
  ]);  

  const formRefs = useRef({});
  const subItemRefs = useRef({});


  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [expandedSubAccordions, setExpandedSubAccordions] = useState({});

  
  const [highlightedId, setHighlightedId] = useState(null);

  const [highlightedMatch, setHighlightedMatch] = useState(null);
// exemplo: { formId: 1, type: "titulo" | "descricao" | "subTitulo" | "subDescricao", subIndex: 0 }

const [highlightedMatches, setHighlightedMatches] = useState([]);


//controlar o tamanho dos arquivos enviados
const TAMANHO_MAXIMO_MB = 15;
const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024;

  const normalizarTexto = (texto) => {
    return texto
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // remove acentos
  };
  


  useEffect(() => {
    if (highlightedMatches.length > 0) {
      const first = highlightedMatches[0];
      setExpandedAccordion(`panel-${first.formId}`);
  
      setTimeout(() => {
        const ref = formRefs.current[first.formId];
        if (ref?.scrollIntoView) {
          ref.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [highlightedMatches]);











//verifica usuario logado
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
    if (currentUser) {
      try {
        const docRef = doc(dbFokus360, "user", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const role = docSnap.data().role;
          setUserRole(role);
        } else {
          console.error("❌ Dados do usuário não encontrados.");
        }
      } catch (error) {
        console.error("❌ Erro ao buscar dados do usuário:", error);
      }
    } else {
      setUserRole("");
    }
    setIsLoadingUser(false);
  });

  return () => unsubscribe();
}, []);



//função para abrir todos os accordions itens e subitens para grifar a palavra
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
      const subTitulo = normalizarTexto(sub.titulo);
      const subDescricao = normalizarTexto(sub.descricao);

      if (subTitulo.includes(termo)) {
        matches.push({ formId, type: "subTitulo", subIndex });
        expandedSub[`${formId}-${subIndex}`] = true;
        encontrouNoForm = true;
      }

      if (subDescricao.includes(termo)) {
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

  // Abre todos os accordions que têm match
  setExpandedAccordion(expandedMain.length > 0 ? expandedMain[0] : null);
  setExpandedSubAccordions(expandedSub);

  // Faz scroll até o primeiro match
  if (matches.length > 0) {
    const first = matches[0];
    const ref = first.type.startsWith("sub")
      ? subItemRefs.current[`${first.formId}-${first.subIndex}`]
      : formRefs.current[first.formId];

    if (ref?.scrollIntoView) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } else {
    alert("Palavra não encontrada.");
  }
};


  
  
  
  
  



//destacar a palavra na renderização
const grifarPalavra = (texto) => {
  const termo = searchText.trim();
  if (!termo || !texto) return texto;

  const normalizar = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const termoNormalizado = normalizar(termo);
  const textoNormalizado = normalizar(texto);

  if (!termoNormalizado) return texto;

  // 🔥 Mapeia cada caractere do texto normalizado para o índice no texto original
  const mapaIndices = [];
  let indexOriginal = 0;

  for (const char of texto) {
    const charNormalizado = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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



//função para fazer replace de string normalizando acentos no texto HTML da descrição
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
    const trechoOriginal = texto.slice(i);
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
  
  //função add accordion
 const adicionarFormulario = () => {
  if (!isAdmin) {
    alert("❌ Você não tem permissão para adicionar.");
    return;
  }
  const novoId = formularios.length + 1;
  setFormularios([...formularios, { id: novoId, titulo: "", descricao: "", subItens: [] }]);
  setExpandedAccordion(`panel-${novoId}`);
};

  
  
  
  const atualizarFormulario = (id, campo, valor) => {
    setFormularios(prev =>
      prev.map(f => (f.id === id ? { ...f, [campo]: valor } : f))
    );
  };

//função apra adcionar sub-accordion com posição definida
const adicionarSubItem = (formId, posicao) => {
  if (!isAdmin) {
    alert("❌ Você não tem permissão para adicionar.");
    return;
  }
  setFormularios(prev =>
    prev.map(form => {
      if (form.id !== formId) return form;
      const novosSubItens = [...form.subItens];
      const novoSubItem = { titulo: "", descricao: "" };
      const indexParaInserir = posicao != null ? posicao + 1 : novosSubItens.length;
      novosSubItens.splice(indexParaInserir, 0, novoSubItem);
      return { ...form, subItens: novosSubItens };
    })
  );
};



  //função para atualizar accordion
const salvarFormularios = async () => {
  if (!isAdmin) {
    alert("❌ Você não tem permissão para executar esta ação.");
    return;
  }

  if (!nomeProjeto.trim()) {
    alert("Informe o nome do departamento antes de salvar.");
    return;
  }

  try {
    const docData = {
      nome: nomeProjeto.trim(),
      criadoEm: new Date(),
      itens: await Promise.all(
        formularios.map(async (form) => ({
          titulo: form.titulo || "",
          descricao: form.descricao || "",
          anexos: form.anexos || [],
          subItens: await Promise.all(
            (form.subItens || []).map(async (sub) => ({
              titulo: sub.titulo || "",
              descricao: sub.descricao || "",
            }))
          ),
        }))
      ),
    };

    if (selectedFilter) {
      const docRef = doc(dbFokus360, "csc", selectedFilter);
      await updateDoc(docRef, docData);
      alert("✅ Projeto atualizado com sucesso!");
    } else {
      await addDoc(collection(dbFokus360, "csc"), docData);
      alert("✅ Projeto salvo com sucesso!");
    }

    setArquivosUpload([]);
  } catch (error) {
    console.error("❌ Erro ao salvar no Firestore:", error);
    alert("Erro ao salvar dados.");
  }
};





  
  
  
  


  const [ativo, setAtivo] = useState({
    estrategicaId: null,
    taticaId: null,
    operacionalId: null,
  });
  

  const [expanded, setExpanded] = useState({
    estrategicas: {},
    taticas: {},
    operacionais: {}
  });
  

  


    const getColumnBorderColor = (columnId) => {
      switch (columnId) {
        case 1:
          return "#60a5fa";
        case 2:
          return "#4caf50";
        case 3:
          return "#fa4f58";
        case 4:
          return "#f28e2b";
        case 5:
          return "#34d399";
      }
    };



//buscar os projetos da coleção projetos
useEffect(() => {
  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(dbFokus360, "csc"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome || "Sem nome",
      }));
      setProjects(lista); // 🔥 Só nome e ID, bem leve
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    }
  };

  fetchProjects();
}, []);



//busca o projeto somente quando escolhe
const carregarProjeto = async (projectId) => {
  try {
    const docRef = doc(dbFokus360, "csc", projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setNomeProjeto(data.nome);
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

      setFormularios(formulariosConvertidos);
    }
  } catch (error) {
    console.error("Erro ao carregar projeto:", error);
  }
};




    //funções do fluxograma
    const toggleExpand = (level, id) => {
      if (level === 'estrategica') {
        setExpandedEstrategicas(prev => ({ ...prev, [id]: !prev[id] }));
      }
      if (level === 'tatica') {
        setExpandedTaticas(prev => ({ ...prev, [id]: !prev[id] }));
      }
      if (level === 'operacional') {
        setExpandedOperacionais(prev => ({ ...prev, [id]: !prev[id] }));
      }
    };
    
 //função auxiliar deve Diminuir Opacidade
    const deveDiminuirOpacidade = (id, tipo) => {
      if (tipo === "Estratégicas") return ativo.estrategicaId && ativo.estrategicaId !== id;
      if (tipo === "Táticas") return ativo.taticaId && ativo.taticaId !== id;
      if (tipo === "Operacionais") return ativo.operacionalId && ativo.operacionalId !== id;
      return false;
    };
    
//função deletar
  const removerFormulario = (id) => {
  if (!isAdmin) {
    alert("❌ Você não tem permissão para remover.");
    return;
  }
  setFormularios(prev => prev.filter(form => form.id !== id));
  if (expandedAccordion === `panel-${id}`) {
    setExpandedAccordion(null);
  }
};


    
//função deletar sub-accordion
const removerSubItem = (formId, index) => {
  if (!isAdmin) {
    alert("❌ Você não tem permissão para remover.");
    return;
  }
  setFormularios(prev =>
    prev.map(form =>
      form.id === formId
        ? { ...form, subItens: form.subItens.filter((_, i) => i !== index) }
        : form
    )
  );
};


// função scrollToMatch para quando pesquisar uma palavra, a pagina rolar até ela
const scrollToMatch = () => {
  const termo = normalizarTexto(searchText);

  for (let form of formularios) {
    const tituloMatch = normalizarTexto(form.titulo || "").includes(termo);
    const descMatch = normalizarTexto(form.descricao || "").includes(termo);


    if (tituloMatch || descMatch) {
      const ref = formRefs.current[form.id];
      if (ref && ref.scrollIntoView) {
        setExpandedAccordion(`panel-${form.id}`);
        setHighlightedId(form.id);
        ref.scrollIntoView({ behavior: "smooth", block: "start" });

        // Remove destaque após 2 segundos
        setTimeout(() => setHighlightedId(null), 2000);
      }
      return;
    }

    for (let i = 0; i < form.subItens?.length; i++) {
      const sub = form.subItens[i];
      const subTituloMatch = normalizarTexto(sub.titulo || "").includes(termo);
      const subDescMatch = normalizarTexto(sub.descricao || "").includes(termo);

      if (subTituloMatch || subDescMatch) {
        const ref = formRefs.current[form.id];
        if (ref && ref.scrollIntoView) {
          setExpandedAccordion(`panel-${form.id}`);
          setHighlightedId(form.id);
          ref.scrollIntoView({ behavior: "smooth", block: "start" });

          // Remove destaque após 2 segundos
          setTimeout(() => setHighlightedId(null), 2000);
        }
        return;
      }
    }
  }
};



//função para fazer upload dos arquivos
const handleUploadArquivo = async (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  const arquivosValidos = files.filter(file => file.size <= TAMANHO_MAXIMO_BYTES);

  try {
    const uploads = await Promise.all(
      arquivosValidos.map(async (file) => {
        // 🔄 Converte para base64
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result); // result = dataURL
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        return {
          nomeArquivo: file.name,
          dataUrl: base64, // ✅ salvando base64 direto
        };
      })
    );

    setFormularios((prev) =>
      prev.map((form, index) =>
        index === 0
          ? { ...form, anexos: [...(form.anexos || []), ...uploads] }
          : form
      )
    );

    alert("✅ Arquivos convertidos e anexados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao processar arquivos:", error);
    alert("❌ Erro ao processar arquivos.");
  }
};






//função para remover os arquivos antes de salvar
const removerArquivoUpload = (nomeArquivo) => {
  setArquivosUpload((prev) => prev.filter((a) => a.nomeArquivo !== nomeArquivo));
};




// função para gerar o HTML:
const gerarHtmlManual = () => {
  return `
    <div style="padding: 24px; font-family: Arial, sans-serif;">
      <h1 style="font-size: 24px;">${nomeProjeto}</h1>
      ${formularios
        .map(
          (form) => `
          <div class="manual-section avoid-break-inside" style="margin-bottom: 32px;">
            <h2 style="font-size: 18px; margin-bottom: 8px;">${form.titulo}</h2>
            <div>${form.descricao}</div>

            ${form.subItens
              ?.map(
                (sub) => `
                  <div style="margin-left: 16px; margin-top: 8px;" class="avoid-break-inside">
                    <h3 style="font-size: 15px; margin-bottom: 4px;">${sub.titulo}</h3>
                    <div>${sub.descricao}</div>
                  </div>
                `
              )
              .join("")}

            ${
              form.anexos?.length
                ? `<div style="margin-top: 12px;">
                    ${form.anexos
                      .map(
                        (anexo) =>
                          `<img src="${anexo.dataUrl}" alt="${anexo.nomeArquivo}" style="max-width: 300px; margin-top: 8px;" />`
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


//função que renderiza o pdf.
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
}, [mostrarDialogPDF]);




useEffect(() => {
  if (mostrarConteudoPDF) {
    setTimeout(() => {
      const elemento = document.getElementById("conteudo-pdf");
      if (!elemento) return setMostrarConteudoPDF(false);

      convertImagesToDataURL(elemento)
        .then(() => {
          return new Promise(resolve => waitForImagesToLoad(elemento, resolve));
        })
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
}, [mostrarConteudoPDF]);




//função converter Imagens Firebase Para Base64
async function converterImagensFirebaseParaBase64(html) {
  const container = document.createElement("div");
  container.innerHTML = html;

  const imgs = container.querySelectorAll("img");

  for (const img of imgs) {
    const src = img.src;

    if (src.startsWith("data:")) continue;

    try {
      const res = await fetch(src, { mode: "cors" });
      const blob = await res.blob();

      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      img.src = base64;
    } catch (err) {
      console.warn("Erro ao converter imagem:", src, err);
    }
  }

  return container.innerHTML;
}






  return (
    <>

    {/* Header */}
          <Box
            sx={{
              marginLeft: "40px",
              paddingTop: "50px",
            }}
          >
            <Header
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <HeatPumpIcon sx={{ color: "#d71936", fontSize: 40 }} />
                  <Typography>CSC do departamento de contabilidade:</Typography>
                </Box>
              }
            />
          </Box>


          <Box
            sx={{
              marginLeft: "40px",
              marginTop: "15px",
              width: "calc(100% - 80px)",
              minHeight: "50vh",
              padding: "15px",
              paddingLeft: "30px",
              borderRadius: "20px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              bgcolor: "#f2f0f0",
              overflowX: "hidden",
            }}
          >
            {/* Container principal para alinhar Filtro, Botão e Contador */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap", // 🔁 permite quebra em telas pequenas
    gap: 2,
    marginBottom: "15px",
    width: "100%",
  }}
>
  {/* Caixa de seleção de filtro */}
  <Box
  sx={{
    flex: "1 1 300px",
    display: "flex",
    alignItems: "center",
    gap: 2, 
  }}
>

    <Box
      sx={{
        flex: 1,
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <FilterListIcon sx={{ color: "#757575", mr: 1 }} />
      <Select
        fullWidth
        displayEmpty
        value={selectedFilter || ""}
        onChange={async (e) => {
          const selectedValue = e.target.value;
          setSelectedFilter(selectedValue);

          try {
            const docRef = doc(dbFokus360, "csc", selectedValue);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const data = docSnap.data();
              setNomeProjeto(data.nome);

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

              setFormularios(formulariosConvertidos);
              setExpandedAccordion(null);
            } else {
              alert("Projeto não encontrado.");
            }
          } catch (error) {
            console.error("Erro ao carregar projeto:", error);
            alert("Erro ao carregar projeto.");
          }
        }}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
          height: "40px",
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
          "&:focus": { outline: "none" },
          "&.Mui-focused": { boxShadow: "none" },
        }}
      >
        <MenuItem value="" disabled>
          Selecione um departamento:
        </MenuItem>

        {projects.map((projeto) => (
          <MenuItem key={projeto.id} value={projeto.id}>
            {projeto.nome}
          </MenuItem>
        ))}
      </Select>

    </Box>

    <Button
      variant="contained"
      onClick={() => {
        setSelectedFilter(null);
        setNomeProjeto("");
        setFormularios([{ id: 1, titulo: "", descricao: "", subItens: [] }]);
      }}
      
      sx={{
        height: "40px",
        minWidth: "120px",
        backgroundColor: "#d71936",
        color: "white",
        fontSize: "10px",
        whiteSpace: "nowrap",
        flexShrink: 0,
        "&:hover": {
          backgroundColor: "#f44336 ",
          boxShadow: "none",
        },
        "&:focus": { outline: "none" },
      }}
    >
      <ClearAllIcon sx={{ fontSize: "20px", mr: 1 }} />
      Limpar Filtro
    </Button>
  </Box>

        {/* Campo de pesquisa */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 2,
            minWidth: "300px",
          }}
        >
      <Box
        sx={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FilterListIcon sx={{ color: "#757575", mr: 1 }} />
        <Box sx={{ position: "relative", width: "100%" }}>
        <TextField
          fullWidth
          placeholder="Pesquisar..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // evita comportamento padrão
              buscarPalavraNoProjeto(); // 🔥 dispara a função corretamente
            }
          }}
          
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "5px",
            "& .MuiOutlinedInput-root": {
              height: "40px",
              borderRadius: "5px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        />

          {/* Lista de sugestões (caso deseje exibir os resultados) */}
          {searchText.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "48px",
                left: 0,
                right: 0,
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
            </Paper>
          )}
        </Box>
      </Box>


    
  </Box>
</Box>

    




























    
    
            <Box display="flex" alignItems="center" gap={1} sx={{ marginTop: "50px", marginBottom: "20px" }}>
              <PlayCircleFilledIcon sx={{ color: "#d71936", fontSize: 25 }} />
              <Typography color="#858585">
                Visualize ou adicione informações ao manual do seu departamento: 
              </Typography>
            </Box>


























<TextField
  disabled={!isAdmin}
  label="Nome do departamento"
  size="small"
  fullWidth
  value={nomeProjeto}
  onChange={(e) => setNomeProjeto(e.target.value)}
  sx={{ mb: 3, backgroundColor: "white", borderRadius: "6px" }}
/>

{formularios.map((form) => (
  <div key={form.id} ref={(el) => (formRefs.current[form.id] = el)}>
    <Accordion
      expanded={expandedAccordion === `panel-${form.id}`}
      onChange={handleAccordionChange(`panel-${form.id}`)}
      sx={{
        mb: 2,
      }}
    >

      <AccordionSummary aria-controls={`panel-${form.id}-content`} id={`panel-${form.id}-header`}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography fontWeight="bold">
            {searchText.trim()
              ? grifarPalavra(form.titulo?.trim() || `Item #${form.id}`)
              : (form.titulo?.trim() || `Item #${form.id}`)}
          </Typography>

          {formularios.length > 1 && (
            <IconButton onClick={() => removerFormulario(form.id)} size="small" sx={{ ml: 1 }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* TÍTULO */}
          {normalizarTexto(form.titulo).includes(normalizarTexto(searchText)) && searchText.trim() ? (
            <Box sx={{ border: "1px solid #c4c4c4", borderRadius: "4px", padding: "10px" }}>
              <Typography variant="body2">{grifarPalavra(form.titulo)}</Typography>
            </Box>
          ) : (
            <TextField
              label="Título"
              size="small"
              fullWidth
              value={form.titulo}
              onChange={(e) => atualizarFormulario(form.id, "titulo", e.target.value)}
              disabled={!isAdmin}
            />
          )}

          {/* DESCRIÇÃO */}
          {normalizarTexto(form.descricao).includes(normalizarTexto(searchText)) && searchText.trim() ? (
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "10px",
                minHeight: "120px",
              }}
            >
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
            <Editor
              value={form.descricao}
              onChange={(value) => atualizarFormulario(form.id, "descricao", value)}
              readOnly={!isAdmin}
            />

          )}

          {/* SUB-ITENS */}
          {form.subItens?.map((sub, index) => {
            const subKey = `${form.id}-${index}`;
            const tituloMatch = normalizarTexto(sub.titulo).includes(normalizarTexto(searchText));
            const descricaoMatch = normalizarTexto(sub.descricao).includes(normalizarTexto(searchText));
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
                sx={{ backgroundColor: "#f9f9f9", ml: 2 }}
              >
                <AccordionSummary>
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography fontWeight="bold">
                      {tituloMatch && searchText.trim()
                        ? grifarPalavra(sub.titulo)
                        : sub.titulo?.trim() || `Subitem #${index + 1}`}
                    </Typography>
                    <IconButton onClick={() => removerSubItem(form.id, index)} size="small" sx={{ ml: 1 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </AccordionSummary>

                <AccordionDetails ref={(el) => (subItemRefs.current[subKey] = el)}>
                  {/* SUB-TÍTULO */}
                  {tituloMatch && searchText.trim() ? (
                    <Box sx={{ border: "1px solid #c4c4c4", borderRadius: "4px", padding: "10px" }}>
                      <Typography variant="body2">{grifarPalavra(sub.titulo)}</Typography>
                    </Box>
                  ) : (
                    <TextField
                      label="Título do Subitem"
                      size="small"
                      fullWidth
                      value={sub.titulo}
                      onChange={(e) => atualizarSubItem(form.id, index, "titulo", e.target.value)}
                      sx={{ mb: 1 }}
                      disabled={!isAdmin}
                    />
                  )}

                  {/* SUB-DESCRIÇÃO */}
                  {descricaoMatch && searchText.trim() ? (
                    <Box
                      className="ql-editor"
                      sx={{
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                        padding: "10px",
                        whiteSpace: "normal",
                        minHeight: "120px",
                      }}
                    >
                      <div
                          className="editor-content"
                          dangerouslySetInnerHTML={{
                            __html: searchText.trim()
                              ? sub.descricao.replace(
                                  new RegExp(`(${normalizarTexto(searchText)})`, "gi"),
                                  (match) => `<mark style="background-color: #fff176;">${match}</mark>`
                                )
                              : sub.descricao,
                          }}
                        />

                    </Box>

                  ) : (
                    <Editor
                      value={sub.descricao}
                      onChange={(value) => atualizarSubItem(form.id, index, "descricao", value)}
                      readOnly={!isAdmin}
                    />

                  )}

                  <Button
                    variant="outlined"
                    onClick={() => adicionarSubItem(form.id, index)}
                    startIcon={<AddIcon />}
                    sx={{ mt: 2, textTransform: "none" }}
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
            startIcon={<AddIcon />}
            sx={{ mt: 1, textTransform: "none", alignSelf: "flex-start" }}
          >
            Adicionar Subitem
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
    
  </div>
))}

<Button
    variant="outlined"
    onClick={adicionarFormulario}
    disabled={!isAdmin}
    startIcon={<AddIcon />}
    sx={{
      textTransform: "none",
      color: "#d32f2f",
      borderColor: "#d32f2f",
      "&:hover": {
        borderColor: "#d32f2f",
        backgroundColor: "transparent"
      },
    }}
  >
    Adicionar Item
  </Button>


<Box display="flex" justifyContent="space-between" mt={4} gap={2}>
  
  <Box display="flex" flexDirection="column" gap={1}>
  <Button
  variant="outlined"
  component="label"
  size="small"
  disabled={!isAdmin}
  sx={{
    textTransform: "none",
    marginRight: "5px",
    color: "#fff",
    borderColor: "#312783",
    backgroundColor: "#312783",
    width: "fit-content",
    "&:hover": {
      backgroundColor: "#312783",
      borderColor: "#1565c0",
    },
  }}
>
  {uploading ? "Enviando..." : "Enviar Arquivos"}
  <input
    type="file"
    multiple
    hidden
    accept=".jpg,.jpeg,.xlsx,.xlsm,.xlsb,.xls,.pptx,.pptm,.ppt,.ppsx,.doc,.docx,.docm,.dotx,.pdf"
    onChange={handleUploadArquivo} // 🔥 igual estava antes
  />
</Button>


  {arquivosUpload.length > 0 && (
    <Box mt={1}>
      <Typography fontSize="0.875rem" fontWeight={500}>
        📎 Arquivos enviados:
      </Typography>

      {arquivosUpload.map((arquivo, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          mt={0.5}
          sx={{
            backgroundColor: "#f5f5f5",
            padding: "6px 12px",
            borderRadius: "4px",
            maxWidth: "100%",
          }}
        >
          <Typography
            fontSize="0.85rem"
            color="green"
            noWrap
            sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}
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
</Box>





  {formularios.some(f => Array.isArray(f.anexos) && f.anexos.length > 0) && (
  <Box mt={4}>
    <Typography
      fontWeight={600}
      sx={{
        mb: 2,
        color: "#7c7c7c",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <AttachFileIcon sx={{ fontSize: 20 }} />
      Anexos do projeto:
    </Typography>

    <Box
  component="table"
  sx={{
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  }}
>
  <thead>
    <Box component="tr" sx={{ backgroundColor: "#d71936" }}>
      <Box component="th" sx={{ p: 1.5, textAlign: "left", fontWeight: 600, color: "#fff" }}>
        Nome do Arquivo
      </Box>
      <Box component="th" sx={{ p: 1.5, width: "120px" }} />
      <Box component="th" sx={{ p: 1.5, width: "120px" }} />
      <Box component="th" sx={{ p: 1.5, width: "120px" }} />
    </Box>
  </thead>

  <tbody>
  {formularios
    .flatMap((form) =>
      (form.anexos || []).map((arquivo, index) => ({
        ...arquivo,
        formId: form.id, // ✔️ Correto agora
        index,           // ✔️ Índice do anexo dentro do form
      }))
    )
    .map(({ nomeArquivo, arquivoUrl, formId, index }) => ( // ✔️ formId certo aqui
      <tr
        key={`${formId}-${index}`}
        style={{
          borderTop: "1px solid #e0e0e0",
          cursor: "default",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        <td style={{ padding: "12px", fontSize: "0.875rem" }}>
          {nomeArquivo}
        </td>

        <td style={{ padding: "12px" }}>
          <IconButton
            href={arquivoUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            {/**<VisibilityIcon fontSize="small" sx={{ color: "#f44336" }} /> */}
          </IconButton>
        </td>

        <td style={{ padding: "12px" }}>
          <IconButton
            href={arquivoUrl}
            download
            size="small"
          >
            <DownloadIcon fontSize="small" sx={{ color: "#f44336" }} />
          </IconButton>
        </td>

        <td style={{ padding: "12px" }}>
          <IconButton
            size="small"
            onClick={() => {
              setFormularios((prev) =>
                prev.map((form) =>
                  form.id === formId
                    ? {
                        ...form,
                        anexos: form.anexos.filter((_, idx) => idx !== index),
                      }
                    : form
                )
              );
            }}
          >
            <DeleteIcon fontSize="small" sx={{ color: "#f44336" }} />
          </IconButton>
        </td>
      </tr>
    ))}
</tbody>

</Box>

  </Box>
)}

</Box>


 <Box display="flex" justifyContent="flex-end" gap={2} sx={{ marginTop: "30px", width: "100%" }}>
  <Button
    variant="contained"
    onClick={salvarFormularios}
    disabled={!isAdmin}
    sx={{
      textTransform: "none",
      backgroundColor: "#d32f2f",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#b71c1c",
      },
    }}
  >
    Salvar
  </Button>

  <Button
  variant="outlined"
  onClick={exportarPDF}
  sx={{
    textTransform: "none",
    color: "#d71936",
    borderColor: "#d71936",
    "&:hover": {
      borderColor: "#f44336",
      backgroundColor: "transparent"
    },
  }}
>
  Baixar PDF
</Button>

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
</Box>


          </Box>
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
    export default Manuais;