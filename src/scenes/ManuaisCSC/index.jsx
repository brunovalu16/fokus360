import React, { useEffect, useState } from "react";
import { Box, Typography,
  ListItemText,
  Checkbox,
  Button,
  TextField,
  Modal,
  Select,
  MenuItem,
  IconButton,
  Divider, } from "@mui/material";

import { getDocs, collection, addDoc, } from "firebase/firestore";
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






const ManuaisCSC = () => {
  const [projects, setProjects] = useState([]); // Todos os projetos
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [allCards, setAllCards] = useState([]); // 🔥 Armazena todos os cards para aplicar os filtros depois
  const [columns, setColumns] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null); // ou string com nome do arquivo


  //estados para o fluxo grama
  const [expandedEstrategicas, setExpandedEstrategicas] = useState({});
  const [expandedTaticas, setExpandedTaticas] = useState({});
  const [expandedOperacionais, setExpandedOperacionais] = useState({});

  const [nomeProjeto, setNomeProjeto] = useState("");
  const [arquivoUpload, setArquivoUpload] = useState({ nome: null, url: null });
  const [arquivosUpload, setArquivosUpload] = useState([]); // ← array de arquivos enviados





  // Accordions de cadastro
  const [formularios, setFormularios] = useState([
    { id: 1, titulo: "", descricao: "", subItens: [] }
  ]);  
  const [expandedAccordion, setExpandedAccordion] = useState("panel-1");



  // ✅ Limite de tamanho por arquivo
  const TAMANHO_MAXIMO_MB = 5;
  const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024;


  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };
  
  //função add accordion
  const adicionarFormulario = () => {
    const novoId = formularios.length + 1;
    setFormularios([...formularios, { id: novoId, titulo: "", descricao: "", subItens: [] }]);
    setExpandedAccordion(`panel-${novoId}`);
  };
  ;
  
  const atualizarFormulario = (id, campo, valor) => {
    setFormularios(prev =>
      prev.map(f => (f.id === id ? { ...f, [campo]: valor } : f))
    );
  };

//função apra adcionar sub-accordion
  const adicionarSubItem = (formId) => {
    setFormularios(prev =>
      prev.map(form =>
        form.id === formId
          ? {
              ...form,
              subItens: [...form.subItens, { titulo: "", descricao: "" }]
            }
          : form
      )
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
    const formulariosAtualizados = [...formularios];

    if (arquivosUpload.length && formulariosAtualizados.length > 0) {
      const lastIndex = formulariosAtualizados.length - 1;
      formulariosAtualizados[lastIndex] = {
        ...formulariosAtualizados[lastIndex],
        anexos: arquivosUpload, // ✅ array com todos os arquivos
      };
    }

    const doc = {
      nome: nomeProjeto.trim(),
      criadoEm: new Date(),
      itens: formulariosAtualizados.map((form) => ({
        titulo: form.titulo?.trim() || "",
        descricao: form.descricao?.trim() || "",
        anexos: form.anexos || [], // ✅ salva se existir
        subItens: Array.isArray(form.subItens)
          ? form.subItens.map((sub) => ({
              titulo: sub.titulo?.trim() || "",
              descricao: sub.descricao?.trim() || "",
            }))
          : [],
      })),
    };

    await addDoc(collection(dbFokus360, "csc"), doc);
    alert("✅ Projeto salvo com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao salvar no Firestore:", error);
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
          const querySnapshot = await getDocs(collection(dbFokus360, "projetos"));
          const lista = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            nome: doc.data().nome || "Sem nome", // ou outro campo
          }));
          setProjects(lista); // atualiza o estado com os projetos
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


//função para fazer upload de arquivos
const handleUploadArquivo = async (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  const arquivosValidos = [];
  const arquivosInvalidos = [];

  // Separa os arquivos válidos e inválidos por tamanho
  files.forEach((file) => {
    if (file.size <= TAMANHO_MAXIMO_BYTES) {
      arquivosValidos.push(file);
    } else {
      arquivosInvalidos.push(file.name);
    }
  });

  // Mostra alerta se houver arquivos inválidos
  if (arquivosInvalidos.length > 0) {
    alert(`❌ Os seguintes arquivos excedem o limite de ${TAMANHO_MAXIMO_MB} MB:\n\n${arquivosInvalidos.join("\n")}`);
  }

  if (!arquivosValidos.length) return;

  setUploading(true);
  setUploadSuccess(null);

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

    setArquivosUpload((prev) => [...prev, ...uploads]);
    setUploadSuccess("Arquivos enviados com sucesso!");
    console.log("📁 Arquivos válidos enviados:", uploads);
  } catch (error) {
    console.error("Erro ao enviar:", error);
    alert("❌ Erro ao enviar arquivos.");
  } finally {
    setUploading(false);
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
                  <Typography>CSC DO GRUPO FOKUS</Typography>
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
          
    

    
            <Box display="flex" alignItems="center" gap={1} sx={{ marginTop: "50px", marginBottom: "20px" }}>
              <PlayCircleFilledIcon sx={{ color: "#f44336", fontSize: 25 }} />
              <Typography color="#858585">
                Cadastre o manual do seu departamento:
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
  <Accordion
    key={form.id}
    expanded={expandedAccordion === `panel-${form.id}`}
    onChange={handleAccordionChange(`panel-${form.id}`)}
    sx={{ mb: 2, backgroundColor: "#fff" }}
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
    <TextField
      label="Título"
      size="small"
      fullWidth
      value={form.titulo}
      onChange={(e) => atualizarFormulario(form.id, "titulo", e.target.value)}
    />
    <TextField
      label="Descrição"
      size="small"
      fullWidth
      multiline
      rows={3}
      value={form.descricao}
      onChange={(e) => atualizarFormulario(form.id, "descricao", e.target.value)}
    />

    {/* Sub-accordions */}
    {form.subItens?.map((sub, index) => (
      <Accordion key={index} sx={{ backgroundColor: "#f9f9f9", ml: 2 }}>
        <AccordionSummary>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Typography fontWeight="bold">
              {sub.titulo?.trim() || `Subitem #${index + 1}`}
            </Typography>
            <IconButton onClick={() => removerSubItem(form.id, index)} size="small" sx={{ ml: 1 }}>
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
          <TextField
            label="Descrição do Subitem"
            size="small"
            fullWidth
            multiline
            rows={2}
            value={sub.descricao}
            onChange={(e) =>
              atualizarSubItem(form.id, index, "descricao", e.target.value)
            }
          />
          <Button
            variant="outlined"
            onClick={() => adicionarSubItem(form.id)}
            startIcon={<AddIcon />}
            sx={{ mt: 2, textTransform: "none" }}
          >
            Adicionar Subitem
          </Button>
        </AccordionDetails>
      </Accordion>
    ))}

    {/* Botão para adicionar subitem */}
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
      },
    }}
  >
    Adicionar Item
  </Button>

<Box display="flex" justifyContent="flex-end" mt={2} gap={2}>


<Box display="flex" flexDirection="column" gap={1}>

  {/* Botão de upload */}
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
      accept=".jpg,.jpeg,.xlsx,.xlsm,.xlsb,.xls,.pptx,.pptm,.ppt,.ppsx,.doc,.docx,.docm,.dotx"
      onChange={handleUploadArquivo}
    />
  </Button>

  {/* Lista de arquivos enviados com botão de remover */}
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
</Box>


<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>

  <Button
    variant="contained"
    onClick={salvarFormularios}
    sx={{
      textTransform: "none",
      marginRight: "5px",
      backgroundColor: "#d32f2f",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#d32f2f",
      },
    }}
  >
    Salvar tudo
  </Button>
</Box>


































 















          
          

          


            
          </Box>
        </>
      );
    };
    export default ManuaisCSC;