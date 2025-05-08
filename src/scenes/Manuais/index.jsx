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

import { getDocs, collection, addDoc, getDoc, doc } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config";

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




  const buscarPalavraNoProjeto = async () => {
    console.log("🔍 Disparou buscarPalavraNoProjeto");
    if (!searchText.trim() || !selectedFilter) return;
  
    const termo = normalizarTexto(searchText);
    const docRef = doc(dbFokus360, "csc", selectedFilter);
    const snap = await getDoc(docRef);
  
    if (!snap.exists()) {
      alert("Projeto não encontrado.");
      return;
    }
  
    const data = snap.data();
    const { nome, itens } = data;
    setNomeProjeto(nome);
  
    const matches = [];
  
    const formulariosConvertidos = (Array.isArray(itens) ? itens : []).map((item, index) => {
      const id = index + 1;
      const titulo = item.titulo || "";
      const descricao = item.descricao || "";
  
      const subItens = Array.isArray(item.subItens)
        ? item.subItens.map((sub, subIndex) => {
            if (normalizarTexto(sub.titulo).includes(termo)) {
              matches.push({ formId: id, type: "subTitulo", subIndex });
            }
            if (normalizarTexto(sub.descricao).includes(termo)) {
              matches.push({ formId: id, type: "subDescricao", subIndex });
            }
            return {
              titulo: sub.titulo || "",
              descricao: sub.descricao || ""
            };
          })
        : [];
  
      if (normalizarTexto(titulo).includes(termo)) {
        matches.push({ formId: id, type: "titulo" });
      }
  
      if (normalizarTexto(descricao).includes(termo)) {
        matches.push({ formId: id, type: "descricao" });
      }
  
      return { id, titulo, descricao, subItens };
    });
  
    setFormularios(formulariosConvertidos);
    setHighlightedMatches(matches);
  
    if (matches.length > 0) {
      const first = matches[0];
      setExpandedAccordion(`panel-${first.formId}`);
setExpandedSubAccordions({}); // fecha todos

if (first.type.startsWith("sub")) {
  setExpandedSubAccordions({
    [`${first.formId}-${first.subIndex}`]: true,
  });
}

  
      setTimeout(() => {
        if (first.type.startsWith("sub")) {
          const subRef = subItemRefs.current[`${first.formId}-${first.subIndex}`];
          if (subRef?.scrollIntoView) {
            subRef.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          const ref = formRefs.current[first.formId];
          if (ref?.scrollIntoView) {
            ref.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 300);
    } else {
      alert("Palavra não encontrada neste projeto.");
    }
  };
  
  
  
  
  



//destacar a palavra na renderização
const grifarPalavra = (texto) => {
  const termo = normalizarTexto(searchText);
  const regex = new RegExp(`(${termo})`, "gi");

  if (!termo || !texto) return texto;

  return texto.split(regex).map((part, i) =>
    normalizarTexto(part) === termo ? (
      <mark key={i} style={{ backgroundColor: "#fff176", padding: "0 2px" }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
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
  const atualizarSubItem = (formId, index, campo, valor) => {
    setFormularios(prev =>
      prev.map(form =>
        form.id === formId
          ? {
              ...form,
              subItens: form.subItens.map((sub, i) =>
                i === index ? { ...sub, [campo]: valor } : sub
              )
            }
          : form
      )
    );
  };
  
  



  //Salvar formulario no banco
  const salvarFormularios = async () => {
    if (!nomeProjeto.trim()) {
      alert("Informe o nome do projeto antes de salvar.");
      return;
    }
  
    try {
      const doc = {
        nome: nomeProjeto.trim(),
        itens: formularios.map(form => ({
          titulo: form.titulo.trim(),
          descricao: form.descricao.trim(),
          subItens: Array.isArray(form.subItens)
            ? form.subItens.map(sub => ({
                titulo: sub.titulo.trim(),
                descricao: sub.descricao.trim(),
              }))
            : []
        })),
        criadoEm: new Date(),
      };
  
      await addDoc(collection(dbFokus360, "csc"), doc);
      alert("Projeto salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
      alert("Erro ao salvar dados. Verifique o console.");
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
        data: doc.data(), // salva os dados também
      }));
      setProjects(lista);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    }
  };

  fetchProjects();
}, []);



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
        onChange={(e) => {
          const selectedValue = e.target.value;
          setSelectedFilter(selectedValue);

          const projetoSelecionado = projects.find((p) => p.id === selectedValue);
          if (!projetoSelecionado) return;

          const { nome, itens } = projetoSelecionado.data;
          setNomeProjeto(nome);

          const formulariosConvertidos = (itens || []).map((item, index) => ({
            id: index + 1,
            titulo: item.titulo || "",
            descricao: item.descricao || "",
            subItens: Array.isArray(item.subItens)
              ? item.subItens.map((sub) => ({
                  titulo: sub.titulo || "",
                  descricao: sub.descricao || "",
                }))
              : [],
          }));

          setFormularios(formulariosConvertidos);
          setExpandedAccordion(`panel-1`);
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
          Selecione um projeto:
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
                Visualize ou adicione informações do manual do seu departamento: 
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
        backgroundColor: highlightedId === form.id ? "#fff59d" : "#fff",
        transition: "background-color 0.5s ease",
      }}
    >
      <AccordionSummary aria-controls={`panel-${form.id}-content`} id={`panel-${form.id}-header`}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography fontWeight="bold">
            {form.titulo?.trim() ? form.titulo : `Item #${form.id}`}
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
            <Box sx={{ border: "1px solid #c4c4c4", borderRadius: "4px", padding: "10px", backgroundColor: "#fffde7" }}>
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
                border: "1px solid #c4c4c4",
                borderRadius: "4px",
                padding: "10px",
                backgroundColor: "#fffde7",
                whiteSpace: "pre-wrap",
                minHeight: "120px",
              }}
            >
              <Typography variant="body2">{grifarPalavra(form.descricao)}</Typography>
            </Box>
          ) : (
            <TextField
              label="Descrição"
              size="small"
              fullWidth
              multiline
              rows={5}
              value={form.descricao}
              onChange={(e) => atualizarFormulario(form.id, "descricao", e.target.value)}
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
                    <Box sx={{ border: "1px solid #c4c4c4", borderRadius: "4px", padding: "10px", backgroundColor: "#fffde7" }}>
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
                      sx={{
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                        padding: "10px",
                        backgroundColor: "#fffde7",
                        minHeight: "120px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <Typography variant="body2">{grifarPalavra(sub.descricao)}</Typography>
                    </Box>
                  ) : (
                    <TextField
                      label="Descrição do Subitem"
                      size="small"
                      fullWidth
                      multiline
                      rows={4}
                      value={sub.descricao}
                      onChange={(e) => atualizarSubItem(form.id, index, "descricao", e.target.value)}
                      sx={{ marginTop: "10px" }}
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




































 















          
          

          


            
          </Box>
        </>
      );
    };
    export default Manuais;