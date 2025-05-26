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



import { getDocs, collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config";
import { storageFokus360 } from "../../data/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";



import { PDFDownloadLink } from "@react-pdf/renderer";
import ManualPDF from "../../components/ManualPDF"; // ajuste o caminho se necessário

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






const Manuais = () => {
  const [projects, setProjects] = useState([]); // Todos os projetos
  const [allCards, setAllCards] = useState([]); // 🔥 Armazena todos os cards para aplicar os filtros depois
  const [columns, setColumns] = useState([]);

  //estados para a parte de upload
const [arquivosUpload, setArquivosUpload] = useState([]);
const [uploading, setUploading] = useState(false);
const [uploadSuccess, setUploadSuccess] = useState(null);


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




 const buscarPalavraNoProjeto = () => {
  if (!searchText.trim()) return;

  const termo = normalizarTexto(searchText);
  const matches = [];

  formularios.forEach((form) => {
    const formId = form.id;

    if (normalizarTexto(form.titulo).includes(termo)) {
      matches.push({ formId, type: "titulo" });
    }

    if (normalizarTexto(form.descricao).includes(termo)) {
      matches.push({ formId, type: "descricao" });
    }

    form.subItens?.forEach((sub, subIndex) => {
      if (normalizarTexto(sub.titulo).includes(termo)) {
        matches.push({ formId, type: "subTitulo", subIndex });
      }
      if (normalizarTexto(sub.descricao).includes(termo)) {
        matches.push({ formId, type: "subDescricao", subIndex });
      }
    });
  });

  setHighlightedMatches(matches);

  if (matches.length > 0) {
    const first = matches[0];
    setExpandedAccordion(`panel-${first.formId}`);
    setExpandedSubAccordions({});

    if (first.type.startsWith("sub")) {
      setExpandedSubAccordions({
        [`${first.formId}-${first.subIndex}`]: true,
      });
    }

    setTimeout(() => {
      const ref = first.type.startsWith("sub")
        ? subItemRefs.current[`${first.formId}-${first.subIndex}`]
        : formRefs.current[first.formId];

      if (ref?.scrollIntoView) {
        ref.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  } else {
    alert("Palavra não encontrada.");
  }
};

  
  
  
  
  



//destacar a palavra na renderização
const grifarPalavra = (texto) => {
  const termo = normalizarTexto(searchText);

  if (!termo || !texto) return texto;

  const textoOriginal = texto;
  const textoNormalizado = normalizarTexto(textoOriginal);

  const partes = textoNormalizado.split(termo);
  const resultado = [];

  let offset = 0;

  partes.forEach((parte, index) => {
    const parteOriginal = textoOriginal.slice(offset, offset + parte.length);
    resultado.push(parteOriginal);
    offset += parte.length;

    if (index < partes.length - 1) {
      const termoOriginal = textoOriginal.slice(offset, offset + termo.length);
      resultado.push(
        <mark key={offset} style={{ backgroundColor: "#fff176", padding: "0 2px" }}>
          {termoOriginal}
        </mark>
      );
      offset += termo.length;
    }
  });

  return resultado;
};






  




  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };
  
  //função add accordion
  const adicionarFormulario = () => {
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
  if (!nomeProjeto.trim()) {
    alert("Informe o nome do departamento antes de salvar.");
    return;
  }

  try {
    const docData = {
      nome: nomeProjeto.trim(),
      criadoEm: new Date(),
      itens: formularios.map((form) => ({
        titulo: form.titulo || "",
        descricao: form.descricao || "",
        anexos: form.anexos || [],  // 🔥 Mantém exatamente como está
        subItens: Array.isArray(form.subItens)
          ? form.subItens.map((sub) => ({
              titulo: sub.titulo || "",
              descricao: sub.descricao || "",
            }))
          : [],
      })),
    };

    if (selectedFilter) {
      const docRef = doc(dbFokus360, "csc", selectedFilter);
      await updateDoc(docRef, docData);
      alert("✅ Projeto atualizado com sucesso!");
    } else {
      const docRef = await addDoc(collection(dbFokus360, "csc"), docData);
      alert("✅ Projeto salvo com sucesso!");
    }

    setArquivosUpload([]); // 🔥 Pode até remover se não usa anexos gerais
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
      setFormularios(prev => prev.filter(form => form.id !== id));
      if (expandedAccordion === `panel-${id}`) {
        setExpandedAccordion(null);
      }
    };

    
//função deletar sub-accordion
const removerSubItem = (formId, index) => {
  setFormularios(prev =>
    prev.map(form =>
      form.id === formId
        ? {
            ...form,
            subItens: form.subItens.filter((_, i) => i !== index)
          }
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
    setUploading(true);
    const uploads = await Promise.all(
      arquivosValidos.map(async (file) => {
        const caminho = `csc_uploads/${Date.now()}_${file.name}`;
        const storageRef = ref(storageFokus360, caminho);

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
          ? { ...form, anexos: [...(form.anexos || []), ...uploads] }
          : form
      )
    );

    alert("✅ Arquivos enviados com sucesso!");
  } catch (error) {
    console.error("❌ Erro no upload:", error);
    alert("❌ Erro ao enviar arquivos.");
  } finally {
    setUploading(false);
  }
};




//função para remover os arquivos antes de salvar
const removerArquivoUpload = (nomeArquivo) => {
  setArquivosUpload((prev) => prev.filter((a) => a.nomeArquivo !== nomeArquivo));
};





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
        minWidth: "140px",
        backgroundColor: "#f44336",
        color: "white",
        whiteSpace: "nowrap",
        flexShrink: 0,
        "&:hover": {
          backgroundColor: "#d32f2f",
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
              <PlayCircleFilledIcon sx={{ color: "#f44336", fontSize: 25 }} />
              <Typography color="#858585">
                Visualize ou adicione informações ao manual do seu departamento: 
              </Typography>
            </Box>


























<TextField
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
                    ? form.descricao.replace(
                        new RegExp(`(${normalizarTexto(searchText)})`, "gi"),
                        (match) => `<mark style="background-color: #fff176;">${match}</mark>`
                      )
                    : form.descricao,
                }}
              />

            </Box>



          ) : (
            <Editor
              value={form.descricao}
              onChange={(value) => atualizarFormulario(form.id, "descricao", value)}
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
    <Box component="tr" sx={{ backgroundColor: "#f44336" }}>
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
            <VisibilityIcon fontSize="small" sx={{ color: "#f44336" }} />
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


 <Box display="flex"
      justifyContent="flex-end"
      gap={2}
      sx={{ marginTop: "30px", width: "100%" }}>
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
    Salvar
  </Button>

  <PDFDownloadLink
    document={<ManualPDF nomeProjeto={nomeProjeto} formularios={formularios} />}
    fileName={`${nomeProjeto || "manual"}.pdf`}
    style={{ textDecoration: "none" }}
  >
    {({ loading }) =>
      loading ? (
        <Button variant="outlined" disabled>
          Gerando PDF...
        </Button>
      ) : (
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            color: "#d71936",
            borderColor: "#d71936",
            "&:hover": {
              borderColor: "#d71936",
              backgroundColor: "transparent"
            },
          }}
        >
          Baixar PDF
        </Button>
      )
    }
  </PDFDownloadLink>
</Box>



































 















          
          

          


            
          </Box>
        </>
      );
    };
    export default Manuais;