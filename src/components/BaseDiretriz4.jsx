import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Accordion,
  List,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { FormControlLabel } from "@mui/material"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { doc, updateDoc, getFirestore, collection, getDocs, setDoc  } from "firebase/firestore";
import { dbFokus360 as db } from "../data/firebase-config"; // ✅ Correto para Fokus360

//API para buscar data universal
import { calcularStatusVisual } from "../utils/statusVisual";

//Importando o contador de data
import { getDataHojeFormatada } from "../utils/formatDate";





  const BaseDiretriz4 = ({ projetoData, onUpdate, dataInicio, prazoPrevisto }) => {
  // Estados para os três conjuntos de diretrizes
  const [users, setUsers] = useState([]);

  const [estrategicas, setEstrategicas] = useState([]);

  const [operacionais, setOperacionais] = useState([]);


  const [areasResponsaveistaticas, setAreasResponsaveistaticas] = useState([]);

  
  const [areasResponsaveisoperacional , setAreasResponsaveisoperacional ] = useState([]);

// ESTRATEGICAS
  const [areasPorId, setAreasPorId] = useState({});
  const [unidadesPorId, setUnidadesPorId] = useState({});
  const [emailsPorId, setEmailsPorId] = useState({});

// TÁTICAS
const [areasTaticasPorId, setAreasTaticasPorId] = useState({});
const [unidadesTaticasPorId, setUnidadesTaticasPorId] = useState({});
const [emailsTaticasPorId, setEmailsTaticasPorId] = useState({});

// OPERACIONAIS
const [areasOperacionaisPorId, setAreasOperacionaisPorId] = useState({});
const [unidadesOperacionaisPorId, setUnidadesOperacionaisPorId] = useState({});
const [emailsOperacionaisPorId, setEmailsOperacionaisPorId] = useState({});

  
const [areasOriginaisPorId, setAreasOriginaisPorId] = useState({});
const [emailsOriginaisPorIdEstrategica, setEmailsOriginaisPorIdEstrategica] = useState({});
const [areasOriginaisTaticasPorId, setAreasOriginaisTaticasPorId] = useState({});
const [emailsOriginaisPorIdTatica, setEmailsOriginaisPorIdTatica] = useState({});
const [areasOriginaisOperacionaisPorId, setAreasOriginaisOperacionaisPorId] = useState({});
const [emailsOriginaisPorIdOperacional, setEmailsOriginaisPorIdOperacional] = useState({});



  

  const [emailsTaticasInput, setEmailsTaticasInput] = useState({});
  const [emailsOperacionaisInput, setEmailsOperacionaisInput] = useState({});
  const [novaTarefa, setNovaTarefa] = useState("");

  const projectId = projetoData?.id;



const [areasPorIdEstrategica, setAreasPorIdEstrategica] = useState({});
const [unidadesPorIdEstrategica, setUnidadesPorIdEstrategica] = useState({});
const [emailsPorIdEstrategica, setEmailsPorIdEstrategica] = useState({});

const [areasPorIdTatica, setAreasPorIdTatica] = useState({});
const [unidadesPorIdTatica, setUnidadesPorIdTatica] = useState({});
const [emailsPorIdTatica, setEmailsPorIdTatica] = useState({});

const [areasPorIdOperacional, setAreasPorIdOperacional] = useState({});
const [unidadesPorIdOperacional, setUnidadesPorIdOperacional] = useState({});
const [emailsPorIdOperacional, setEmailsPorIdOperacional] = useState({});


  
  




  const [descEstrategica, setDescEstrategica] = useState("");
  const [novaEstrategica, setNovaEstrategica] = useState("");
  const [emailsDigitados, setEmailsDigitados] = useState("");

  const [areas, setAreas] = useState([]);
  const [unidades, setUnidades] = useState([]);




  // Estados para seleção de áreas, unidades, etc.
  const [areasSelecionadas, setAreasSelecionadas] = useState(projetoData?.areasResponsaveis || []);
  const [unidadeSelecionadas, setUnidadeSelecionadas] = useState(projetoData?.unidadesRelacionadas || []);

  const [formValues, setFormValues] = useState({
    tituloTarefa: "",
    planoDeAcao: {
      oQue: "",
      porQue: "",
      quem: [],
      quando: "",
      quemEmail: [],
      onde: "",
      como: "",
      valor: "",
    },
  });


  
//preencher os campos normalmente vindo do banco
  // Exemplo: atualizar os estados quando o projetoData mudar
  useEffect(() => {
    if (!projetoData) return;
  
    console.log("📦 Dados do projeto recebidos:", projetoData);
    console.log("📦 Estratégicas recebidas:", projetoData.estrategicas);
  
    (async () => {
      const estrategicasCompletas = (projetoData.estrategicas || []).map((estrategica) => ({
        ...estrategica,
        emails: estrategica.emails || [],
        areasResponsaveis: estrategica.areasResponsaveis || [],
        unidades: estrategica.unidades || [],
        taticas: (estrategica.taticas || []).map((tatica) => ({
          ...tatica,
          emails: tatica.emails || [],
          areasResponsaveis: tatica.areasResponsaveis || [],
          unidades: tatica.unidades || [],
          operacionais: (tatica.operacionais || []).map((operacional) => ({
            ...operacional,
            emails: operacional.emails || [],
            areasResponsaveis: operacional.areasResponsaveis || [],
            unidades: operacional.unidades || [],
            tarefas: operacional.tarefas || [],
          })),
        })),
      }));
  
      setEstrategicas(estrategicasCompletas);
  
      const novaAreasPorId = {};
      const novasUnidadesPorId = {};
      const novosEmailsPorId = {};
  
      const novaAreasTaticasPorId = {};
      const novasUnidadesTaticasPorId = {};
      const novosEmailsTaticasPorId = {};
  
      const novaAreasOperacionaisPorId = {};
      const novasUnidadesOperacionaisPorId = {};
      const novosEmailsOperacionaisPorId = {};
  
      const novosEmailsPorIdEstrategica = {};
      const novosEmailsPorIdTatica = {};
      const novosEmailsPorIdOperacional = {};
  
      estrategicasCompletas.forEach((estrategica) => {
        novaAreasPorId[estrategica.id] = estrategica.areasResponsaveis;
        novasUnidadesPorId[estrategica.id] = estrategica.unidades;
        novosEmailsPorId[estrategica.id] = estrategica.emails;
  
        novosEmailsPorIdEstrategica[estrategica.id] = estrategica.emails;
  
        estrategica.taticas?.forEach((tatica) => {
          novaAreasTaticasPorId[tatica.id] = tatica.areasResponsaveis;
          novasUnidadesTaticasPorId[tatica.id] = tatica.unidades;
          novosEmailsTaticasPorId[tatica.id] = tatica.emails;
  
          novosEmailsPorIdTatica[tatica.id] = tatica.emails;
  
          tatica.operacionais?.forEach((operacional) => {
            novaAreasOperacionaisPorId[operacional.id] = operacional.areasResponsaveis;
            novasUnidadesOperacionaisPorId[operacional.id] = operacional.unidades;
            novosEmailsOperacionaisPorId[operacional.id] = operacional.emails;
  
            novosEmailsPorIdOperacional[operacional.id] = operacional.emails;
          });
        });
      });
  
      // Atualiza estados dos selects atuais
      setAreasPorId(novaAreasPorId);
      setUnidadesPorId(novasUnidadesPorId);
      setEmailsPorId(novosEmailsPorId);
  
      setAreasTaticasPorId(novaAreasTaticasPorId);
      setUnidadesTaticasPorId(novasUnidadesTaticasPorId);
      setEmailsTaticasPorId(novosEmailsTaticasPorId);
  
      setAreasPorIdOperacional(novaAreasOperacionaisPorId);
      setUnidadesPorIdOperacional(novasUnidadesOperacionaisPorId);
      setEmailsPorIdOperacional(novosEmailsOperacionaisPorId);
  
      setEmailsPorIdEstrategica(novosEmailsPorIdEstrategica);
      setEmailsPorIdTatica(novosEmailsPorIdTatica);
      setEmailsPorIdOperacional(novosEmailsPorIdOperacional);
  
      // 🧠 Atualiza estados ORIGINAIS para detecção de alterações futuras
      setAreasOriginaisPorId(novaAreasPorId);
      setEmailsOriginaisPorIdEstrategica(novosEmailsPorIdEstrategica);
  
      setAreasOriginaisTaticasPorId(novaAreasTaticasPorId);
      setEmailsOriginaisPorIdTatica(novosEmailsPorIdTatica);
  
      setAreasOriginaisOperacionaisPorId(novaAreasOperacionaisPorId);
      setEmailsOriginaisPorIdOperacional(novosEmailsPorIdOperacional);

      // Após carregar todos os selects e estados normais:
      setAreasOriginaisPorId(novaAreasPorId);
      setEmailsOriginaisPorIdEstrategica(novosEmailsPorIdEstrategica);

      setAreasOriginaisTaticasPorId(novaAreasTaticasPorId);
      setEmailsOriginaisPorIdTatica(novosEmailsPorIdTatica);

      setAreasOriginaisOperacionaisPorId(novaAreasOperacionaisPorId);
      setEmailsOriginaisPorIdOperacional(novosEmailsPorIdOperacional);

    })();
  }, [projetoData]);
  
  
  

  
//função auxiliar de comparação de itens que vem do banco com novos para enviar email
  const detectarNovos = (atual = [], original = []) => {
    const atualSet = new Set(atual);
    const originalSet = new Set(original);
    return [...atualSet].filter((item) => !originalSet.has(item));
  };
  


  
  




//estado separado para controlar os campos de formulário E-mails Estratégicas e Táticas 
    const [inputEstrategica, setInputEstrategica] = useState({
      titulo: "",
      descricao: "",
      emails: "",
    });
    





  
  
     // 🔹 Carregar usuários do Firebase
     useEffect(() => {
      const fetchUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "user")); // ✅ Usa `db` diretamente
          const usersList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username,
            email: doc.data().email,
          }));
          setUsers(usersList);
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
        }
      };
    
      fetchUsers();
    }, []);
    







//Buscar dados do Firestore
useEffect(() => {
  const fetchData = async () => {
    try {
      const queryAreas = await getDocs(collection(db, "areas"));
      const areasList = queryAreas.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
      }));
      setAreas(areasList);
      console.log("🔥 Áreas carregadas:", areasList);


      const queryUnidades = await getDocs(collection(db, "unidade"));
      const unidadesList = queryUnidades.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
      }));
      setUnidades(unidadesList);
      console.log("🔥 Unidades carregadas:", unidadesList);


    } catch (error) {
      console.error("Erro ao buscar áreas e unidades:", error);
    }
  };

  fetchData();
}, []);



const handleEditTarefa = (tarefaId, campo, valor) => {
  setEstrategicas((prevEstrategicas) =>
    prevEstrategicas.map((estrategica) => ({
      ...estrategica,
      taticas: estrategica.taticas.map((tatica) => ({
        ...tatica,
        operacionais: tatica.operacionais.map((operacional) => ({
          ...operacional,
          tarefas: operacional.tarefas.map((tarefa) =>
            tarefa.id === tarefaId
              ? {
                  ...tarefa,
                  planoDeAcao: {
                    ...tarefa.planoDeAcao, // Garante que não é undefined
                    [campo]: valor,
                  },
                }
              : tarefa
          ),
        })),
      })),
    }))
  );
};

// função para apagar tarefas criadas
const handleRemoveTarefa = async (idEstrategica, idTatica, idOperacional, idTarefa) => {
  const atualizado = estrategicas.map((estrategica) => {
    if (estrategica.id !== idEstrategica) return estrategica;

    return {
      ...estrategica,
      taticas: estrategica.taticas.map((tatica) => {
        if (tatica.id !== idTatica) return tatica;

        return {
          ...tatica,
          operacionais: tatica.operacionais.map((operacional) => {
            if (operacional.id !== idOperacional) return operacional;

            return {
              ...operacional,
              tarefas: operacional.tarefas.filter((tarefa) => tarefa.id !== idTarefa),
            };
          }),
        };
      }),
    };
  });

  setEstrategicas(atualizado);
  onUpdate && onUpdate({ estrategicas: atualizado });

  if (!projectId) {
    console.warn("❌ ID do projeto não encontrado ao remover tarefa.");
    return;
  }

  try {
    const projetoRef = doc(db, "projetos", projectId);
    await updateDoc(projetoRef, {
      estrategicas: atualizado,
      updatedAt: new Date(),
    });
    console.log("✅ Tarefa removida do Firestore!");
  } catch (error) {
    console.error("❌ Erro ao remover tarefa do Firestore:", error);
  }
};






//função para salvar nova tarefa/planodeacao
const handleAddTarefa = async (idEstrategica, idTatica, idOperacional, novaTarefa) => {
  if (!novaTarefa || typeof novaTarefa !== "string" || !novaTarefa.trim()) {
    alert("Nome da tarefa é obrigatório.");
    return;
  }

  const novaTarefaObj = {
    id: Date.now(),
    tituloTarefa: novaTarefa,
    planoDeAcao: {
      oQue: "",
      porQue: "",
      quem: [],
      quando: "",
      quemEmail: [],
      onde: "",
      como: "",
      valor: "",
    },
  };

  const atualizado = estrategicas.map((estrategica) => {
    if (estrategica.id !== idEstrategica) return estrategica;

    return {
      ...estrategica,
      taticas: estrategica.taticas.map((tatica) => {
        if (tatica.id !== idTatica) return tatica;

        return {
          ...tatica,
          operacionais: tatica.operacionais.map((operacional) => {
            if (operacional.id !== idOperacional) return operacional;

            return {
              ...operacional,
              tarefas: [...(operacional.tarefas || []), novaTarefaObj],
            };
          }),
        };
      }),
    };
  });

  setEstrategicas(atualizado);

  // 🔄 SALVAR NO FIRESTORE
  if (!projectId) {
    console.warn("❌ ID do projeto não encontrado ao salvar tarefa.");
    return;
  }

  try {
    const projetoRef = doc(db, "projetos", projectId);
    await updateDoc(projetoRef, {
      estrategicas: atualizado,
      updatedAt: new Date(),
    });
    console.log("✅ Tarefa adicionada e salva no Firestore!");
  } catch (error) {
    console.error("❌ Erro ao salvar tarefa no Firestore:", error);
  }
};






  // -------------------------------------
  // Criar nova Diretriz Estratégica
  // -------------------------------------
  //|| !descEstrategica.trim()

  const handleAddEstrategica = () => {
    if (!novaEstrategica.trim()) {
      alert("Preencha o nome da Diretriz Estratégica!");
      return;
    }
  
    const emails = emailsDigitados
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");
  
    const item = {
      id: Date.now().toString(),
      titulo: novaEstrategica,
      descricao: descEstrategica,
      emails,
      taticas: [], // ✅ ESSENCIAL para evitar o erro
    };
  
    const atualizado = [...estrategicas, item];
    setEstrategicas(atualizado);
    setNovaEstrategica("");
    setDescEstrategica("");
  };
  
  
  
  

  // -------------------------------------
  // Remover Diretriz Estratégica
  // -------------------------------------
  const handleRemoveEstrategica = async (id) => {
    const atualizado = estrategicas.filter((d) => d.id !== id);
    setEstrategicas(atualizado);
    onUpdate && onUpdate({ estrategicas: atualizado });
  
    if (!projectId) {
      console.warn("❌ ID do projeto não encontrado para salvar exclusão");
      return;
    }
  
    try {
      const projetoRef = doc(db, "projetos", projectId);
      await updateDoc(projetoRef, {
        estrategicas: atualizado,
        updatedAt: new Date(),
      });
      console.log("✅ Estratégica deletada e Firestore atualizado!");
    } catch (error) {
      console.error("❌ Erro ao remover estratégica no Firestore:", error);
    }
  };
  

  // -------------------------------------
  // Criar nova Diretriz Tática
  // -------------------------------------
  //|| !descricao.trim()

  const handleAddTatica = (idEstrategica, titulo, descricao) => {
    if (!titulo.trim()) {
      alert("Preencha o nome da Diretriz Tática!");
      return;
    }
  
    const emails =
      (emailsTaticasInput[idEstrategica] || "")
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "");
  
    const novaTatica = {
      id: Date.now().toString(),
      titulo,
      descricao,
      emails,
      operacionais: [], // ✅ Já inicializa
    };
  
    const atualizado = estrategicas.map((est) => {
      if (est.id === idEstrategica) {
        return {
          ...est,
          taticas: [...(est.taticas || []), novaTatica],
        };
      }
      return est;
    });
  
    setEstrategicas(atualizado);
    onUpdate && onUpdate({ estrategicas: atualizado });
  };
  

  
  
  
  
  
  
  
  
  

  // -------------------------------------
  // Remover Diretriz Tática
  // -------------------------------------
  const handleRemoveTatica = async (idEstrategica, idTatica) => {
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
    onUpdate && onUpdate({ estrategicas: atualizadas });
  
    if (!projectId) {
      console.warn("❌ ID do projeto não encontrado para salvar exclusão de tática");
      return;
    }
  
    try {
      const projetoRef = doc(db, "projetos", projectId);
      await updateDoc(projetoRef, {
        estrategicas: atualizadas,
        updatedAt: new Date(),
      });
      console.log("✅ Tática removida e Firestore atualizado!");
    } catch (error) {
      console.error("❌ Erro ao remover tática no Firestore:", error);
    }
  };
  

  // -------------------------------------
  // Criar nova Diretriz Operacional
  // -------------------------------------
  //|| !descricao.trim()) 

  const handleAddOperacional = (idEstrategica, idTatica, titulo, descricao) => {
    if (!titulo.trim()) {
      alert("Preencha o nome da Diretriz Operacional!");
      return;
    }
  
    const emails =
      (emailsOperacionaisInput[idTatica] || "")
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "");
  
    const novaOperacional = {
      id: Date.now().toString(),
      titulo,
      descricao,
      tarefas: [],
      emails,
    };
  
    const atualizado = estrategicas.map((estrategica) => {
      if (estrategica.id !== idEstrategica) return estrategica;
  
      return {
        ...estrategica,
        taticas: estrategica.taticas.map((tatica) => {
          if (tatica.id !== idTatica) return tatica;
  
          return {
            ...tatica,
            operacionais: [...(tatica.operacionais || []), novaOperacional],
          };
        }),
      };
    });
  
    setEstrategicas(atualizado);
    onUpdate && onUpdate({ estrategicas: atualizado });
  
    // Limpar e-mails digitados
    setEmailsOperacionaisInput((prev) => ({
      ...prev,
      [idTatica]: "",
    }));
  };
  

  
  
  

  // -------------------------------------
  // Remover Diretriz Operacional
  // -------------------------------------
  const handleRemoveOperacional = async (idEstrategica, idTatica, idOp) => {
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
    onUpdate && onUpdate({ estrategicas: atualizadas });
  
    if (!projectId) {
      console.warn("❌ ID do projeto não encontrado para salvar exclusão de operacional");
      return;
    }
  
    try {
      const projetoRef = doc(db, "projetos", projectId);
      await updateDoc(projetoRef, {
        estrategicas: atualizadas,
        updatedAt: new Date(),
      });
      console.log("✅ Operacional removido e Firestore atualizado!");
    } catch (error) {
      console.error("❌ Erro ao remover operacional no Firestore:", error);
    }
  };
  

  // -------------------------------------
  // Atualiza a Diretriz Operacional quando `DiretrizData` muda (tarefas, 5W2H)
  // -------------------------------------
  const handleUpdateOperacional = (idEstrategica, idTatica, operAtualizada) => {
    console.log("📌 BaseDiretriz recebeu atualização de tarefas:", JSON.stringify(operAtualizada, null, 2));

    setEstrategicas((prevEstrategicas) => {
      const atualizado = prevEstrategicas.map((est) => {
        if (est.id !== idEstrategica) return est;
        return {
          ...est,
          taticas: est.taticas.map((t) => {
            if (t.id !== idTatica) return t;
            return {
              ...t,
              operacionais: t.operacionais.map((op) =>
                op.id === operAtualizada.id
                  ? { ...op, tarefas: operAtualizada.tarefas || [] }
                  : op
              ),
            };
          }),
        };
      });
      onUpdate && onUpdate({ estrategicas: atualizado });
      return atualizado;
    }); 
};




 
  
  
  
// 🔹 Função para salvar diretrizes no Firestore
const saveEstrategicas = async (projectId, novoArray) => {
  if (!projectId) {
    console.error("❌ projectId está indefinido ao tentar salvar estratégicas!");
    return;
  }

  try {
    const docRef = doc(dbFokus360, "projetos", projectId);
    await updateDoc(docRef, { estrategicas: novoArray });
    console.log("✅ Estratégicas atualizadas no Firestore!");
  } catch (err) {
    console.error("❌ Erro ao atualizar estratégicas:", err);
  }
};








  //======================================================== ESTRATÉGICAS + MAPEAMENTO GERAL ==============================================================




// Mapeamento de Áreas e seus perfis (roles) para o campo de select de areas da empresa
//conecta as areas aos usuarios cadastrados de cada area
const areaRolesMap = {
  "25FT05zvwGNditGma9Z4": ["19", "20", "21"], // FINANCEIRO
  "47W05V7tgDVVyMCve9e1": ["28", "29", "30"], // MARKETING
  "L2V5XLKvP0Ut9gyQVJiH": ["12", "13", "14"], // CONTABILIDADE
  "i73QGK2jRgmoN4vNyPAf": ["15", "16", "17", "18"], // CONTROLADORIA
  "qx8XjIjcstoXnHenJGEa": ["22", "23", "24"], // JURIDICO
  "u61drZ23ZQWIkCZk1x20": ["25", "26", "27"], // LOGISTICA
  "wpJB6txSxD2DzzFBESfW": ["09", "10", "11"], // TRADE
  "wzMNANRkdaELthrNUt5f": ["31", "32", "33"], // RECURSOSHUMANOS
};






  const buscarUsuariosPorRole = async (roles) => {
    const querySnapshot = await getDocs(collection(db, "user"));
    return querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => roles.includes(user.role));
  };


// -------------------------------------
  // Salvar todas as Diretrizes
  // -------------------------------------
  
  const handleSalvarEstrategicas = async () => {
    try {
      if (!projectId) {
        alert("ID do projeto não encontrado. Salve primeiro as informações do projeto.");
        return;
      }
  
      const getNovosItens = (atuais = [], originais = []) => {
        const atualSet = new Set(atuais);
        const originalSet = new Set(originais);
        return [...atualSet].filter((item) => !originalSet.has(item));
      };
  
      const estrategicasAtualizadas = estrategicas.map((est) => {
        const taticasAtualizadas = (est.taticas || []).map((tatica) => {
          const operacionaisAtualizadas = (tatica.operacionais || []).map((op) => {
            const manualEmails = Array.isArray(emailsPorIdOperacional?.[op.id])
              ? emailsPorIdOperacional[op.id]
              : String(emailsPorIdOperacional?.[op.id] || "")
                  .split(",")
                  .map((e) => e.trim());
  
            const responsaveisEmails = Array.isArray(op.quemOperacionais)
              ? op.quemOperacionais
              : [];
  
            return {
              ...op,
              areasResponsaveis: areasPorIdOperacional[op.id] || [],
              unidades: unidadesPorIdOperacional?.[op.id] || [],
              emails: [...manualEmails, ...responsaveisEmails].filter((e) => e.trim() !== ""),
            };
          });
  
          return {
            ...tatica,
            areasResponsaveis: areasTaticasPorId[tatica.id] || [],
            unidades: unidadesTaticasPorId[tatica.id] || [],
            emails: Array.isArray(emailsPorIdTatica[tatica.id])
              ? emailsPorIdTatica[tatica.id].filter((e) => e.trim() !== "")
              : String(emailsPorIdTatica[tatica.id] || "")
                  .split(",")
                  .map((e) => e.trim())
                  .filter((e) => e !== ""),
            operacionais: operacionaisAtualizadas,
          };
        });
  
        return {
          ...est,
          areasResponsaveis: areasPorId[est.id] || [],
          unidades: unidadesPorId[est.id] || [],
          emails: Array.isArray(emailsPorIdEstrategica[est.id])
            ? emailsPorIdEstrategica[est.id].filter((e) => e.trim() !== "")
            : String(emailsPorIdEstrategica[est.id] || "")
                .split(",")
                .map((e) => e.trim())
                .filter((e) => e !== ""),
          taticas: taticasAtualizadas,
        };
      });
  
      const projetoRef = doc(db, "projetos", projectId);
      await updateDoc(projetoRef, {
        estrategicas: estrategicasAtualizadas,
        updatedAt: new Date(),
      });
  
      for (const est of estrategicasAtualizadas) {
        const novasAreas = getNovosItens(est.areasResponsaveis, areasOriginaisPorId?.[est.id] || []);
        const novosEmails = getNovosItens(est.emails, emailsOriginaisPorIdEstrategica?.[est.id] || []);
  
        if (novasAreas.length > 0) {
          const novosUsuarios = await buscarUsuariosPorRole(novasAreas.flatMap((a) => areaRolesMap[a] || []));
          await Promise.all(novosUsuarios.map((user) =>
            fetch("https://fokus360-backend.vercel.app/send-task-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                tituloTarefa: "Nova Diretriz Estratégica",
                assuntoTarefa: "Foi criada uma nova diretriz estratégica vinculada à sua área.",
                prazoTarefa: "Sem prazo"
              }),
            })
          ));
        }
  
        if (novosEmails.length > 0) {
          await Promise.all(novosEmails.map((email) =>
            fetch("https://fokus360-backend.vercel.app/send-task-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                tituloTarefa: "Nova Diretriz Estratégica",
                assuntoTarefa: "Você foi designado como responsável por uma diretriz Estratégica.",
                prazoTarefa: "Sem prazo"
              }),
            })
          ));
        }
  
        for (const tat of est.taticas) {
          const novasAreasTat = getNovosItens(tat.areasResponsaveis, areasOriginaisTaticasPorId?.[tat.id] || []);
          const novosEmailsTat = getNovosItens(tat.emails, emailsOriginaisPorIdTatica?.[tat.id] || []);
  
          if (novasAreasTat.length > 0) {
            const usuariosTaticos = await buscarUsuariosPorRole(novasAreasTat.flatMap((a) => areaRolesMap[a] || []));
            await Promise.all(usuariosTaticos.map((user) =>
              fetch("https://fokus360-backend.vercel.app/send-task-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: user.email,
                  tituloTarefa: "Nova Diretriz Tática",
                  assuntoTarefa: "Foi criada uma nova diretriz tática vinculada à sua área.",
                  prazoTarefa: "Sem prazo"
                }),
              })
            ));
          }
  
          if (novosEmailsTat.length > 0) {
            await Promise.all(novosEmailsTat.map((email) =>
              fetch("https://fokus360-backend.vercel.app/send-task-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email,
                  tituloTarefa: "Nova Diretriz Tática",
                  assuntoTarefa: "Você foi designado como responsável por uma diretriz Tática.",
                  prazoTarefa: "Sem prazo"
                }),
              })
            ));
          }
  
          for (const op of tat.operacionais) {
            const novasAreasOp = getNovosItens(op.areasResponsaveis, areasOriginaisOperacionaisPorId?.[op.id] || []);
            const novosEmailsOp = getNovosItens(op.emails, emailsOriginaisPorIdOperacional?.[op.id] || []);
  
            if (novasAreasOp.length > 0) {
              const usuariosOp = await buscarUsuariosPorRole(novasAreasOp.flatMap((a) => areaRolesMap[a] || []));
              await Promise.all(usuariosOp.map((user) =>
                fetch("https://fokus360-backend.vercel.app/send-task-email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: user.email,
                    tituloTarefa: "Nova Diretriz Operacional",
                    assuntoTarefa: "Foi criada uma nova diretriz operacional vinculada à sua área.",
                    prazoTarefa: "Sem prazo"
                  }),
                })
              ));
            }
  
            if (novosEmailsOp.length > 0) {
              await Promise.all(novosEmailsOp.map((email) =>
                fetch("https://fokus360-backend.vercel.app/send-task-email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email,
                    tituloTarefa: "Nova Diretriz Operacional",
                    assuntoTarefa: "Você foi designado como responsável por uma diretriz Operacional.",
                    prazoTarefa: "Sem prazo"
                  }),
                })
              ));
            }
          }
        }
      }
  
      // Tarefas → envio para quemEmail
      await Promise.all(
        estrategicasAtualizadas.flatMap((est) =>
          est.taticas.flatMap((tat) =>
            tat.operacionais.flatMap((op) =>
              (op.tarefas || []).flatMap((tarefa) =>
                (tarefa.planoDeAcao?.quemEmail || []).map((email) =>
                  fetch("https://fokus360-backend.vercel.app/send-task-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email,
                      tituloTarefa: tarefa.tituloTarefa || "Nova Tarefa",
                      assuntoTarefa: "Você foi designado como responsável por uma tarefa operacional.",
                      prazoTarefa: tarefa.planoDeAcao?.quando || "Sem prazo",
                    }),
                  })
                )
              )
            )
          )
        )
      );
  
      setEstrategicas(estrategicasAtualizadas);
      alert("✅ Diretrizes salvas com sucesso e e-mails enviados!");
    } catch (error) {
      console.error("❌ Erro ao salvar diretrizes:", error);
      alert("Erro ao salvar diretrizes. Tente novamente.");
    }
  };
  
  
  
  
  




  
  
  
  //=============================================================================================================



  //========================================= Salvar táticas ====================================================

 

  
  

//=========================================================================================================================================== 



//========================================= Salvar Operacional ====================================================



//exibir a data atual do navegador
useEffect(() => {
  const hoje = new Date();
  const dia = hoje.getDate().toString().padStart(2, '0');
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const ano = hoje.getFullYear();

  const dataAtual = `${ano}-${mes}-${dia}`;
  const elemento = document.getElementById('dataAtual');

  if (elemento) {
    elemento.textContent = `${dia}/${mes}/${ano}`;
  }

  console.log("📅 Data do navegador:", dataAtual);
}, []);


  

  // -------------------------------------
  // Render
  // -------------------------------------
  return (
    <Box>

    <Typography variant="body2" sx={{ color: "#f2f0f0", mb: 2 }}>
      Data atual: {getDataHojeFormatada().split("-").reverse().join("/")}
    </Typography>

      {/* ***************************** */}
      {/* Form para criar EstratÉgica */}
      {/* ***************************** */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ color: "#312783", mb: 1 }}
      >
        Criar Diretriz Estratégica
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        
        <TextField
          label="Nome da Diretriz Estratégica..."
          value={novaEstrategica}
          onChange={(e) => setNovaEstrategica(e.target.value)}
          fullWidth
        />

        {/* Botões "+" e "Salvar Estratégicas" alinhados à esquerda em coluna */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2,
            marginTop: 2,
            width: "300px", // igual aos campos select e inputs
          }}
        >
          {/* Botão "+" */}
          <Button
            onClick={handleAddEstrategica}
            disableRipple
            sx={{
              backgroundColor: "transparent",
              paddingLeft: 0,
              "&:hover": {
                backgroundColor: "transparent",
                boxShadow: "none",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#312783" }} />
          </Button>
        </Box>

        {/* Título da seção Estratégica */}
      </Box>

      <Box display="flex" alignItems="center" marginBottom="20px">
        <ArrowDropDownCircleIcon
          sx={{ fontSize: 25, color: "#312783", mr: 1 }}
        />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "#483ebd", marginTop: 0.5 }}
        >
          Diretriz Estratégica
        </Typography>
      </Box>















































{/* =========================  ESTRATÉGICAS  ================================ */}






















































      {/* ************************************ */}
      {/* Accordion p/ cada Diretriz Estratégica */}
      {/* ************************************ */}
      {estrategicas.map((estrategica) => (
        <Accordion
          key={estrategica.id}
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
              backgroundColor: "#312783",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >



  {/* Bolinha de status visual da Estratégica */}
{estrategica.status === "andamento" && (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2 }}>
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor:
          new Date() <= new Date(projetoData.prazoPrevisto)
            ? "#00ff08" // verde
            : "#ff0000", // vermelho
      }}
    />
    <Typography
      sx={{
        color: "#fff",
        fontSize: "0.7rem",
        whiteSpace: "nowrap",
        marginTop: "2px",
      }}
    >
      {new Date() <= new Date(projetoData.prazoPrevisto)
        ? ""
        : ""}
    </Typography>
  </Box>
)}




            <Box sx={{ flex: 1, textAlign: "left" }}>
              <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                {estrategica.titulo}
              </Typography>
              <Typography sx={{ color: "#b7b7b7", fontSize: "0.9em" }}>
                {estrategica.descricao}
              </Typography>
            </Box>

            











<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5, mr: 0.5 }}>
  {/* Checkbox: Concluída */}
  <Box sx={{ display: "flex", alignItems: "center", minWidth: 120 }}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={estrategica.status === "concluida"}
          onChange={() => {
            const statusVisual = calcularStatusVisual(projetoData.prazoPrevisto);

            const atualizado = estrategicas.map((e) =>
              e.id === estrategica.id
                ? {
                    ...e,
                    status: e.status === "concluida" ? "" : "concluida",
                    statusVisual: e.status === "concluida" ? "" : statusVisual,
                  }
                : e
            );

            setEstrategicas(atualizado);
            onUpdate && onUpdate({ estrategicas: atualizado });
          }}
          sx={{
            width: 20,
            height: 20,
            marginLeft: 5,
            color: "#fff",
            "&.Mui-checked": {
              color: "#fff",
            },
            padding: 0,
          }}
        />
      }
      label={
        <Typography sx={{ color: "#fff", fontSize: "0.8rem", marginTop: "5px" }}>
          Concluída
        </Typography>
      }
      onClick={(e) => e.stopPropagation()}
      sx={{ margin: 0, cursor: "pointer" }}
    />
  </Box>

  {/* Checkbox: Em Andamento */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 130 }}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={estrategica.status === "andamento"}
          onChange={() => {
            const atualizado = estrategicas.map((e) =>
              e.id === estrategica.id
                ? {
                    ...e,
                    status: e.status === "andamento" ? "" : "andamento",
                  }
                : e
            );
            setEstrategicas(atualizado);
            onUpdate && onUpdate({ estrategicas: atualizado });
          }}
          sx={{
            width: 20,
            height: 20,
            color: "#fff",
            "&.Mui-checked": {
              color: "#fff",
            },
            padding: 0,
          }}
        />
      }
      label={
        <Typography sx={{ color: "#fff", fontSize: "0.8rem", marginTop: "5px" }}>
          Em Andamento
        </Typography>
      }
      onClick={(e) => e.stopPropagation()}
      sx={{ margin: 0, cursor: "pointer" }}
    />
  </Box>

  {/* Bolinha de status + texto fixo */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      minWidth: 120,
      justifyContent: "flex-start",
    }}
  >
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor:
          estrategica.status === "concluida"
            ? calcularStatusVisual(projetoData.prazoPrevisto) === "no_prazo"
              ? "#00ff08" // verde
              : "#ff0000" // vermelho
            : estrategica.status === "andamento"
            ? "#2d81ff"
            : "#9ca3af",
      }}
    />
    <Typography
      sx={{
        color: "#fff",
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        marginTop: "4px",
      }}
    >
      {estrategica.status === "concluida"
        ? calcularStatusVisual(projetoData.prazoPrevisto) === "no_prazo"
          ? "No prazo"
          : "Em atraso"
        : estrategica.status === "andamento"
        ? ""
        : "Não iniciada"}
    </Typography>
  </Box>
</Box>



























            <Button
              disableRipple
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Isso é importante para evitar que o Accordion abra/feche
                handleRemoveEstrategica(estrategica.id); // Correto: estrategica.id
              }}
              sx={{
                minWidth: "40px",
                padding: "5px",
                border: "none",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <DeleteForeverIcon sx={{ fontSize: 24, color: "#dddddd" }} />
            </Button>
            
          </AccordionSummary>

          {/* Detalhes: Diretriz estrategicas */}
          <AccordionDetails>



{/* descrição diretriz estrategicas */}
<Box sx={{ display: "flex" }}>
<TextField
  label="Descrição"
  value={estrategica.descricao || ""}
  onChange={(e) => {
    const value = e.target.value;

    setEstrategicas((prev) =>
      prev.map((est) =>
        est.id === estrategica.id
          ? { ...est, descricao: value }
          : est
      )
    );
  }}
  sx={{
    flex: 1,
    backgroundColor: "transparent",
    marginTop: "10px",
  }}
/>
</Box>


          <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            width: "100%",
            marginBottom:"20px"
          }}
        >
          {/* Áreas */}
          <Select
            multiple
            value={areasPorId[estrategica.id] || []}
            onChange={(event) => {
              const value = event.target.value;
              setAreasPorId((prev) => ({
                ...prev,
                [estrategica.id]: value,
              }));
            }}
            displayEmpty
            sx={{
              flex: 1,
              backgroundColor: "transparent",
              marginTop: "10px",
            }}
            renderValue={(selected) =>
              selected
                .map((id) => areas.find((area) => area.id === id)?.nome)
                .join(", ")
            }
          >
            {areas.map((area) => (
              <MenuItem key={area.id} value={area.id}>
                <Checkbox checked={(areasPorId[estrategica.id] || []).includes(area.id)} />
                <ListItemText primary={area.nome} />
              </MenuItem>
            ))}
          </Select>


          {/* Unidades */}
          <Select
  multiple
  value={unidadesPorId[estrategica.id] || []}
  onChange={(event) => {
    const value = event.target.value;
    setUnidadesPorId((prev) => ({
      ...prev,
      [estrategica.id]: value,
    }));
  }}
  displayEmpty
  sx={{
    flex: 1,
    backgroundColor: "transparent",
    marginTop: "10px",
  }}
  renderValue={(selected) =>
    selected.length === 0
      ? "Selecione a Unidade"
      : selected
          .map(
            (id) =>
              unidades.find((uni) => uni.id === id)?.nome || "Desconhecida"
          )
          .join(", ")
  }
>
  {unidades.map((uni) => (
    <MenuItem key={uni.id} value={uni.id}>
      <Checkbox
        checked={(unidadesPorId[estrategica.id] || []).includes(uni.id)}
      />
      <ListItemText primary={uni.nome} />
    </MenuItem>
  ))}
</Select>


{/* select de resposaveis por estrategicas */}
<Box sx={{ flex: 1, minWidth: "300px" }}>
  <Select
    multiple
    displayEmpty
    value={emailsPorIdEstrategica[estrategica.id] || []}
    onChange={(event) => {
      const selectedEmails = event.target.value;

      setEmailsPorIdEstrategica((prev) => ({
        ...prev,
        [estrategica.id]: selectedEmails,
      }));

      setEstrategicas((prev) =>
        prev.map((est) =>
          est.id === estrategica.id
            ? { ...est, emails: selectedEmails }
            : est
        )
      );
    }}
    renderValue={(selected) =>
      selected.length === 0
        ? "Selecione os responsáveis pela diretriz"
        : selected.join(", ")
    }
    fullWidth
    sx={{ backgroundColor: "transparent", marginTop: "10px" }}
  >
    {users?.map((user) => (
      <MenuItem key={user.id} value={user.email}>
        <Checkbox
          checked={
            (emailsPorIdEstrategica[estrategica.id] || []).includes(user.email)
          }
        />
        <ListItemText primary={`${user.username} (${user.email})`} />
      </MenuItem>
    ))}
  </Select>
</Box>



        </Box>

        <Box display="flex" alignItems="center" marginBottom="20px">
              <SubdirectoryArrowRightIcon
                sx={{ fontSize: 30, color: "#4caf50", mr: 1 }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#29c42e", marginTop: 1 }}
              >
                Diretriz Tática
              </Typography>
            </Box>
          

            {/* Form para adicionar Tática dentro da Estratégica */}
            <NovaTaticaForm
              onAdd={(titulo, desc) =>
                handleAddTatica(estrategica.id, titulo, desc)
              }
            />

            

            <Box
              display="flex"
              alignItems="center"
              marginBottom="20px"
              marginTop="30px"
            >
              <ArrowDropDownCircleIcon
                sx={{ fontSize: 20, color: "#4caf50", mr: 1, marginTop: 1 }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#29c42e", marginTop: 1 }}
              >
                Diretriz Tática
              </Typography>
            </Box>











{/* =========================  FIM ESTRATÉGICAS  ================================ */}




























































{/* =========================  TÁTICAS  ================================ */}

























            {/* Accordion das Táticas */}
            {estrategica.taticas.map((tatica) => (
              <Accordion
                key={tatica.id}
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
                    backgroundColor: "#4caf50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >



                
 {/* Bolinha de status visual da Tática */}
{tatica.status === "andamento" && (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2 }}>
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor:
          new Date() <= new Date(projetoData.prazoPrevisto)
            ? "#00ff08"
            : "#ff0000",
      }}
    />
    <Typography
      sx={{
        color: "#fff",
        fontSize: "0.7rem",
        whiteSpace: "nowrap",
        marginTop: "2px",
      }}
    >
      {new Date() <= new Date(projetoData.prazoPrevisto)
        ? ""
        : ""}
    </Typography>
  </Box>
)}



                  {/* Cabeçalho da Tática */}
                  <Box sx={{ flex: 1, textAlign: "left" }}>
                    <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                      {tatica.titulo}
                    </Typography>
                    <Typography sx={{ color: "#dddddd", fontSize: "0.9em" }}>
                      {tatica.descricao}
                    </Typography>
                  </Box>

















{/* Checkbox: Concluída da TÁTICA */}
<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 120 }}>
  <FormControlLabel
    control={
      <Checkbox
        size="small"
        checked={tatica.status === "concluida"}
        onChange={() => {
          const statusVisual = calcularStatusVisual(projetoData.prazoPrevisto);

          const atualizado = estrategicas.map((estrategica) => ({
            ...estrategica,
            taticas: estrategica.taticas.map((t) =>
              t.id === tatica.id
                ? {
                    ...t,
                    status: t.status === "concluida" ? "" : "concluida",
                    statusVisual: t.status === "concluida" ? "" : statusVisual,
                  }
                : t
            ),
          }));

          setEstrategicas(atualizado);
          onUpdate && onUpdate({ estrategicas: atualizado });
        }}
        sx={{
          width: 20,
          height: 20,
          marginLeft: 5,
          color: "#fff",
          "&.Mui-checked": {
            color: "#fff",
          },
          padding: 0,
        }}
      />
    }
    label={
      <Typography sx={{ color: "#fff", fontSize: "0.8rem", marginTop: "5px" }}>
        Concluída
      </Typography>
    }
    onClick={(e) => e.stopPropagation()}
    sx={{ margin: 0, cursor: "pointer" }}
  />
</Box>

{/* Checkbox: Em Andamento da TÁTICA */}
<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 130 }}>
  <FormControlLabel
    control={
      <Checkbox
        size="small"
        checked={tatica.status === "andamento"}
        onChange={() => {
          const atualizado = estrategicas.map((estrategica) => ({
            ...estrategica,
            taticas: estrategica.taticas.map((t) =>
              t.id === tatica.id
                ? {
                    ...t,
                    status: t.status === "andamento" ? "" : "andamento",
                  }
                : t
            ),
          }));

          setEstrategicas(atualizado);
          onUpdate && onUpdate({ estrategicas: atualizado });
        }}
        sx={{
          width: 20,
          height: 20,
          color: "#fff",
          "&.Mui-checked": {
            color: "#fff",
          },
          padding: 0,
        }}
      />
    }
    label={
      <Typography sx={{ color: "#fff", fontSize: "0.8rem", marginTop: "5px" }}>
        Em Andamento
      </Typography>
    }
    onClick={(e) => e.stopPropagation()}
    sx={{ margin: 0, cursor: "pointer" }}
  />
</Box>

{/* Bolinha de status da TÁTICA */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    minWidth: 120,
    justifyContent: "flex-start",
  }}
>
  <Box
    sx={{
      width: 14,
      height: 14,
      borderRadius: "50%",
      backgroundColor:
        tatica.status === "concluida"
          ? calcularStatusVisual(projetoData.prazoPrevisto) === "no_prazo"
            ? "#00ff08" // ✅ verde
            : "#ff0000" // ❌ vermelho
          : tatica.status === "andamento"
          ? "#2d81ff"
          : "#9ca3af",
    }}
  />
  <Typography
    sx={{
      color: "#fff",
      fontSize: "0.8rem",
      whiteSpace: "nowrap",
      marginTop: "4px",
    }}
  >
    {tatica.status === "concluida"
      ? calcularStatusVisual(projetoData.prazoPrevisto) === "no_prazo"
        ? "No prazo"
        : "Em atraso"
      : tatica.status === "andamento"
      ? ""
      : "Não iniciada"}
  </Typography>
</Box>




  






                  <Button
                    disableRipple
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTatica(estrategica.id, tatica.id); // estrategica.id e tatica.id estão corretos
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
                      sx={{ fontSize: 24, color: "#dddddd" }}
                    />
                  </Button>
                </AccordionSummary>

                {/* Detalhes: Diretriz Operacional */}
                <AccordionDetails>



{/* descrição diretriz taticas */}
<Box sx={{ display: "flex" }}>
<TextField
  label="Descrição da Tática"
  value={tatica.descricao || ""}
  onChange={(e) => {
    const value = e.target.value;

    setEstrategicas((prev) =>
      prev.map((est) =>
        est.id === estrategica.id
          ? {
              ...est,
              taticas: est.taticas.map((tat) =>
                tat.id === tatica.id
                  ? { ...tat, descricao: value }
                  : tat
              ),
            }
          : est
      )
    );
  }}
  sx={{
    flex: 1,
    backgroundColor: "transparent",
    marginTop: "10px",
  }}
/>
</Box>
                
            

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginBottom: "10px",
                flexWrap: "wrap", // Mantém quebrando no mobile
              }}
            >
              {/* Áreas */}
              <Box sx={{ display: 'flex', gap: 2, width: '100%', marginTop: "10px" }}>
  {/* Áreas */}
  <Box sx={{ flex: 1 }}>
    <Select
      multiple
      value={areasTaticasPorId[tatica.id] || []}
      onChange={(event) => {
        const value = event.target.value;
        setAreasTaticasPorId((prev) => ({
          ...prev,
          [tatica.id]: value,
        }));
      }}
      displayEmpty
      fullWidth
      sx={{ backgroundColor: 'transparent' }}
      renderValue={(selected) =>
        selected.length === 0
          ? 'Selecione as áreas responsáveis'
          : selected
              .map((id) => areas.find((area) => area.id === id)?.nome || 'Desconhecida')
              .join(', ')
      }
    >
      {areas.map((area) => (
        <MenuItem key={area.id} value={area.id}>
          <Checkbox checked={(areasTaticasPorId[tatica.id] || []).includes(area.id)} />
          <ListItemText primary={area.nome} />
        </MenuItem>
      ))}
    </Select>
  </Box>

  {/* Unidades */}
  <Box sx={{ flex: 1 }}>
    <Select
      multiple
      value={unidadesTaticasPorId[tatica.id] || []}
      onChange={(event) => {
        const value = event.target.value;
        setUnidadesTaticasPorId((prev) => ({
          ...prev,
          [tatica.id]: value,
        }));
      }}
      displayEmpty
      fullWidth
      sx={{ backgroundColor: 'transparent' }}
      renderValue={(selected) =>
        selected.length === 0
          ? 'Selecione a Unidade'
          : selected
              .map((id) => unidades.find((uni) => uni.id === id)?.nome || 'Desconhecida')
              .join(', ')
      }
    >
      {unidades.map((uni) => (
        <MenuItem key={uni.id} value={uni.id}>
          <Checkbox checked={(unidadesTaticasPorId[tatica.id] || []).includes(uni.id)} />
          <ListItemText primary={uni.nome} />
        </MenuItem>
      ))}
    </Select>
  </Box>

  {/* responsaveis por diretrizes taticas */}
  <Box sx={{ flex: 1, minWidth: "300px", marginTop: "-10px" }}>
  <Select
    multiple
    displayEmpty
    value={emailsPorIdTatica[tatica.id] || []}
    onChange={(event) => {
      const selectedEmails = event.target.value;

      setEmailsPorIdTatica((prev) => ({
        ...prev,
        [tatica.id]: selectedEmails,
      }));

      setEstrategicas((prev) =>
        prev.map((est) => ({
          ...est,
          taticas: est.taticas.map((t) =>
            t.id === tatica.id
              ? { ...t, emails: selectedEmails }
              : t
          ),
        }))
      );
    }}
    renderValue={(selected) =>
      selected.length === 0
        ? "Selecione os responsáveis pela diretriz"
        : selected.join(", ")
    }
    fullWidth
    sx={{ backgroundColor: "transparent", marginTop: "10px" }}
  >
    {users?.map((user) => (
      <MenuItem key={user.id} value={user.email}>
        <Checkbox
          checked={
            (emailsPorIdTatica[tatica.id] || []).includes(user.email)
          }
        />
        <ListItemText primary={`${user.username} (${user.email})`} />
      </MenuItem>
    ))}
  </Select>
</Box>

 
</Box>

            </Box>
            
                  <Box display="flex" alignItems="center" marginBottom="20px">
                    <SubdirectoryArrowRightIcon
                      sx={{ fontSize: 30, color: "#f44336", mr: 1 }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#ef6b62", marginTop: 1 }}
                    >
                      Diretriz Operacional
                    </Typography>
                  </Box>

                  

                  {/* Form para adicionar Operacional */}
                  <NovaOperacionalForm
                    onAdd={(titulo, desc) =>
                      handleAddOperacional(
                        estrategica.id,
                        tatica.id,
                        titulo,
                        desc
                      )
                    }
                  />

                 

                  <Box
                    display="flex"
                    alignItems="center"
                    marginBottom="20px"
                    marginTop="30px"
                  >
                    <ArrowDropDownCircleIcon
                      sx={{
                        fontSize: 20,
                        color: "#f44336",
                        mr: 1,
                        marginTop: 1,
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#ef6b62", marginTop: 1 }}
                    >
                      Diretriz Operacional
                    </Typography>
                  </Box>










{/* =========================  FIM TÁTICAS  ================================ */}





























































                {/* =========================  OPERACIONAIS  ================================ */}







                  

                  {/* Lista de Operacionais */}
                  {tatica.operacionais.map((operacional) => (
                    <Accordion
                      key={operacional.id}
                      disableGutters
                      sx={{
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        boxShadow: "none",
                        marginBottom: "10px",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ color: "#b7b7b7" }} />
                        }
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: "#f44336",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                      >




 {/* Bolinha de status visual da Operacional */}
{operacional.status === "andamento" && (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2 }}>
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor:
          new Date() <= new Date(projetoData.prazoPrevisto)
            ? "#00ff08"
            : "#ff0000",
      }}
    />
    <Typography
      sx={{
        color: "#fff",
        fontSize: "0.7rem",
        whiteSpace: "nowrap",
        marginTop: "2px",
      }}
    >
      {new Date() <= new Date(projetoData.prazoPrevisto)
        ? ""
        : ""}
    </Typography>
  </Box>
)}




                        {/* Cabeçalho da Operacional */}
                        <Box sx={{ flex: 1, textAlign: "left" }}>
                          <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                            {operacional.titulo}
                          </Typography>
                          <Typography
                            sx={{ color: "#dddddd", fontSize: "0.9em" }}
                          >
                            {operacional.descricao}
                          </Typography>
                        </Box>













{/* Checkbox: Concluída da OPERACIONAL */}
<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1  }}>
  <FormControlLabel
    control={
      <Checkbox
        size="small"
        checked={operacional.status === "concluida"}
        onChange={() => {
          const statusVisual = calcularStatusVisual(projetoData.prazoPrevisto);

          const atualizado = estrategicas.map((estrategica) => ({
            ...estrategica,
            taticas: estrategica.taticas.map((tatica) => ({
              ...tatica,
              operacionais: tatica.operacionais.map((op) =>
                op.id === operacional.id
                  ? {
                      ...op,
                      status: op.status === "concluida" ? "" : "concluida",
                      statusVisual: op.status === "concluida" ? "" : statusVisual,
                    }
                  : op
              ),
            })),
          }));

          setEstrategicas(atualizado);
          onUpdate && onUpdate({ estrategicas: atualizado });
        }}
        sx={{
          width: 20,
          height: 20,
          marginLeft: 1,
          color: "#fff",
          "&.Mui-checked": {
            color: "#fff",
          },
          padding: 0,
        }}
      />
    }
    label={
      <Typography sx={{ color: "#fff", fontSize: "0.8rem", marginTop: "5px" }}>
        Concluída
      </Typography>
    }
    onClick={(e) => e.stopPropagation()}
    sx={{ margin: 0, cursor: "pointer" }}
  />
</Box>

{/* Checkbox: Em Andamento da OPERACIONAL */}
<Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 130 }}>
  <FormControlLabel
    control={
      <Checkbox
        size="small"
        checked={operacional.status === "andamento"}
        onChange={() => {
          const atualizado = estrategicas.map((estrategica) => ({
            ...estrategica,
            taticas: estrategica.taticas.map((tatica) => ({
              ...tatica,
              operacionais: tatica.operacionais.map((op) =>
                op.id === operacional.id
                  ? {
                      ...op,
                      status: op.status === "andamento" ? "" : "andamento",
                    }
                  : op
              ),
            })),
          }));

          setEstrategicas(atualizado);
          onUpdate && onUpdate({ estrategicas: atualizado });
        }}
        sx={{
          width: 20,
          height: 20,
          color: "#fff",
          "&.Mui-checked": {
            color: "#fff",
          },
          padding: 0,
        }}
      />
    }
    label={
      <Typography sx={{ color: "#fff", fontSize: "0.8rem", marginTop: "5px" }}>
        Em Andamento
      </Typography>
    }
    onClick={(e) => e.stopPropagation()}
    sx={{ margin: 0, cursor: "pointer" }}
  />
</Box>

{/* Bolinha de status da OPERACIONAL */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    minWidth: 120,
    justifyContent: "flex-start",
  }}
>
  <Box
    sx={{
      width: 14,
      height: 14,
      borderRadius: "50%",
      backgroundColor:
        operacional.status === "concluida"
          ? calcularStatusVisual(projetoData.prazoPrevisto) === "no_prazo"
            ? "#00ff08" // ✅ verde
            : "#ff1000" // ❌ vermelho
          : operacional.status === "andamento"
          ? "#2d81ff"
          : "#9ca3af",
    }}
  />
  <Typography
    sx={{
      color: "#fff",
      fontSize: "0.8rem",
      whiteSpace: "nowrap",
      marginTop: "4px",
    }}
  >
    {operacional.status === "concluida"
      ? calcularStatusVisual(projetoData.prazoPrevisto) === "no_prazo"
        ? "No prazo"
        : "Em atraso"
      : operacional.status === "andamento"
      ? ""
      : "Não iniciada"}
  </Typography>
</Box>


























                        <Button
                          disableRipple
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOperacional(
                              estrategica.id,
                              tatica.id,
                              operacional.id
                            );
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
                            sx={{ fontSize: 24, color: "#dddddd" }}
                          />
                        </Button>
                      </AccordionSummary>

                      

                      {/* Detalhes (tarefas, 5W2H) */}
                      <AccordionDetails>

<Box sx={{ display: "flex" }}>
 <TextField
  label="Descrição da Operacional"
  value={operacional.descricao || ""}
  onChange={(e) => {
    const value = e.target.value;

    setEstrategicas((prev) =>
      prev.map((est) =>
        est.id === estrategica.id
          ? {
              ...est,
              taticas: est.taticas.map((tat) =>
                tat.id === tatica.id
                  ? {
                      ...tat,
                      operacionais: tat.operacionais.map((op) =>
                        op.id === operacional.id
                          ? { ...op, descricao: value }
                          : op
                      ),
                    }
                  : tat
              ),
            }
          : est
      )
    );
  }}
  sx={{
    flex: 1,
    backgroundColor: "transparent",
    marginTop: "10px",
  }}
/>
</Box>





                        

<Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    width: "100%",
    marginBottom: "10px",
  }}
>
  {/* Áreas */}
  <Box sx={{ flex: 1, minWidth: "200px" }}>
    <Select
      multiple
      value={areasPorIdOperacional[operacional.id] || []}
      onChange={(event) => {
        const value = event.target.value;
        setAreasPorIdOperacional((prev) => ({
          ...prev,
          [operacional.id]: value,
        }));
        setEstrategicas((prev) =>
          prev.map((est) => ({
            ...est,
            taticas: est.taticas.map((tatica) => ({
              ...tatica,
              operacionais: tatica.operacionais.map((op) =>
                op.id === operacional.id
                  ? { ...op, areasResponsaveis: value }
                  : op
              ),
            })),
          }))
        );
      }}
      displayEmpty
      fullWidth
      sx={{ backgroundColor: "transparent", marginTop: "10px" }}
      renderValue={(selected) =>
        selected.length === 0
          ? "Selecione as áreas responsáveis"
          : selected
              .map((id) => areas.find((area) => area.id === id)?.nome || "Desconhecida")
              .join(", ")
      }
    >
      {areas.map((area) => (
        <MenuItem key={area.id} value={area.id}>
          <Checkbox
            checked={(areasPorIdOperacional[operacional.id] || []).includes(area.id)}
          />
          <ListItemText primary={area.nome} />
        </MenuItem>
      ))}
    </Select>
  </Box>

  {/* Unidades */}
  <Box sx={{ flex: 1, minWidth: "200px" }}>
    <Select
      multiple
      value={unidadesPorIdOperacional[operacional.id] || []}
      onChange={(event) => {
        const value = event.target.value;
        setUnidadesPorIdOperacional((prev) => ({
          ...prev,
          [operacional.id]: value,
        }));
        setEstrategicas((prev) =>
          prev.map((est) => ({
            ...est,
            taticas: est.taticas.map((tatica) => ({
              ...tatica,
              operacionais: tatica.operacionais.map((op) =>
                op.id === operacional.id
                  ? { ...op, unidades: value }
                  : op
              ),
            })),
          }))
        );
      }}
      displayEmpty
      fullWidth
      sx={{ backgroundColor: "transparent", marginTop: "10px" }}
      renderValue={(selected) =>
        selected.length === 0
          ? "Selecione a Unidade"
          : selected
              .map((id) => unidades.find((uni) => uni.id === id)?.nome || "Desconhecida")
              .join(", ")
      }
    >
      {unidades.map((uni) => (
        <MenuItem key={uni.id} value={uni.id}>
          <Checkbox
            checked={(unidadesPorIdOperacional[operacional.id] || []).includes(uni.id)}
          />
          <ListItemText primary={uni.nome} />
        </MenuItem>
      ))}
    </Select>
  </Box>

  {/* resposaveis por diretrizes operacionais */}
  <Box sx={{ flex: 1, minWidth: "300px" }}>
  <Select
  multiple
  displayEmpty
  value={
    Array.isArray(emailsPorIdOperacional[operacional.id])
      ? emailsPorIdOperacional[operacional.id]
      : typeof emailsPorIdOperacional[operacional.id] === "string"
      ? emailsPorIdOperacional[operacional.id].split(",").map(e => e.trim()).filter(Boolean)
      : []
  }
  onChange={(event) => {
    const selectedEmails = event.target.value;

    setEmailsPorIdOperacional((prev) => ({
      ...prev,
      [operacional.id]: selectedEmails,
    }));

    setEstrategicas((prev) =>
      prev.map((est) => ({
        ...est,
        taticas: est.taticas.map((tatica) => ({
          ...tatica,
          operacionais: tatica.operacionais.map((op) =>
            op.id === operacional.id
              ? { ...op, emails: selectedEmails }
              : op
          ),
        })),
      }))
    );
  }}
  renderValue={(selected) =>
    Array.isArray(selected) && selected.length > 0
      ? selected.join(", ")
      : "Selecione os responsáveis pela diretriz"
  }
  fullWidth
  sx={{ backgroundColor: "transparent", marginTop: "10px" }}
>
  {users?.map((user) => (
    <MenuItem key={user.id} value={user.email}>
      <Checkbox
        checked={
          (emailsPorIdOperacional[operacional.id] || []).includes(user.email)
        }
      />
      <ListItemText primary={`${user.username} (${user.email})`} />
    </MenuItem>
  ))}
</Select>

</Box>


</Box>

                        <Box>
                          {/* 🔹 Campo para adicionar nova tarefa */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              marginBottom: "20px",
                              marginTop: "20px",
                            }}
                          >
                            <TextField
                              label="Nome do Plano de ação..."
                              value={novaTarefa}
                              onChange={(e) => setNovaTarefa(e.target.value)}
                              fullWidth
                            />
                            <Button
                              onClick={() =>
                                handleAddTarefa(
                                  estrategica.id,
                                  tatica.id,
                                  operacional.id,
                                  novaTarefa
                                )
                              }
                              sx={{ minWidth: "40px" }}
                            >
                              <AddCircleOutlineIcon
                                sx={{ fontSize: 25, color: "#f44336" }}
                              />
                            </Button>
                          </Box>

                          {/* 🔹 Exibir as tarefas já adicionadas */}

                          {operacional.tarefas.length > 0 && (
                            <List>
                              {operacional.tarefas.map((tarefa) => (
                                <Accordion
                                  key={tarefa.id}
                                  sx={{
                                    backgroundColor: "#fff",
                                    marginBottom: "8px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{ backgroundColor: "#f9f9f9" }}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "#f44336",
                                        flex: 1,
                                      }}
                                    >
                                      {tarefa.tituloTarefa}
                                    </Typography>

                                    {/* 🔹 Botão de deletar */}
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Impede que o Accordion abra/feche
                                        handleRemoveTarefa(
                                          estrategica.id,
                                          tatica.id,
                                          operacional.id,
                                          tarefa.id
                                        );
                                      }}
                                      sx={{
                                        color: "#dc2626",
                                        minWidth: "40px",
                                        padding: "5px",
                                        backgroundColor: "transparent",
                                        "&:hover": {
                                          backgroundColor: "transparent",
                                        },
                                      }}
                                    >
                                      <DeleteForeverIcon
                                        sx={{ fontSize: 24 }}
                                      />
                                    </Button>
                                  </AccordionSummary>

                                  {/* 🔹 Detalhes do Accordion (Plano de Ação - 5W2H) */}

                                  <AccordionDetails>
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      mb={1}
                                      sx={{
                                        marginBottom: "20px",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <PlayCircleFilledWhiteIcon
                                        sx={{
                                          color: "#f44336",
                                          fontSize: 25,
                                          marginRight: 1,
                                        }}
                                      />
                                      <Typography variant="h6">
                                        Plano de Ação (5W2H)
                                      </Typography>
                                    </Box>

                                    {/* 🔹 Campos do 5W2H */}

                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                      }}
                                    >
                                      <TextField
                                        label="O que?"
                                        value={tarefa.planoDeAcao?.oQue ?? ""}
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "oQue",
                                            e.target.value
                                          )
                                        }
                                      />

                                      <TextField
                                        label="Por que?"
                                        value={tarefa.planoDeAcao.porQue ?? ""}
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "porQue",
                                            e.target.value
                                          )
                                        }
                                      />

                                      {/* 🔹 Campo "Quem" com múltipla seleção */}
                                      <Select
                                        multiple
                                        value={tarefa.planoDeAcao.quem ?? []}
                                        onChange={(event) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "quem",
                                            event.target.value
                                          )
                                        }
                                        displayEmpty
                                        sx={{
                                          minWidth: "200px",
                                          backgroundColor: "#fff",
                                        }}
                                        renderValue={(selected) =>
                                          selected.length === 0
                                            ? "Quem..."
                                            : selected
                                                .map(
                                                  (id) =>
                                                    users?.find(
                                                      (user) => user.id === id
                                                    )?.username ||
                                                    "Desconhecido"
                                                )
                                                .join(", ")
                                        }
                                      >
                                        {users?.map((user) => (
                                          <MenuItem
                                            key={user.id}
                                            value={user.id}
                                          >
                                            <Checkbox
                                              checked={
                                                tarefa.planoDeAcao.quem?.includes(
                                                  user.id
                                                ) || false
                                              }
                                            />
                                            <ListItemText
                                              primary={user.username}
                                            />
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      <TextField
                                        label="E-mail dos responsáveis"
                                        name="quemEmail" // Nome associado ao estado para o e-mail do solicitante
                                        value={
                                          tarefa.planoDeAcao.quemEmail ?? []
                                        }
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "quemEmail",
                                            e.target.value
                                          )
                                        }
                                      />

                                      <TextField
                                        label="Quando?"
                                        value={tarefa.planoDeAcao.quando ?? ""}
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "quando",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <TextField
                                        label="Onde?"
                                        value={tarefa.planoDeAcao.onde ?? ""}
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "onde",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <TextField
                                        label="Como?"
                                        value={tarefa.planoDeAcao.como ?? ""}
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "como",
                                            e.target.value
                                          )
                                        }
                                      />

                                      {/* 🔹 Campo Valor Formatado */}
                                      <TextField
                                        label="Valor"
                                        value={tarefa.planoDeAcao.valor ?? ""}
                                        onChange={(e) => {
                                          const rawValue =
                                            e.target.value.replace(/\D/g, "");
                                          const formattedValue =
                                            new Intl.NumberFormat("pt-BR", {
                                              style: "currency",
                                              currency: "BRL",
                                            }).format(Number(rawValue) / 100);
                                          handleEditTarefa(
                                            tarefa.id,
                                            "valor",
                                            formattedValue
                                          );
                                        }}
                                      />
                                    </Box>
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </List>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}









     {/* =========================  FIM OPERACIONAIS  ================================ */}




































































                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      {/* Botão SALVAR */}
      <Box sx={{ display: "flex", justifyContent: "flex-end",  }}>
      <Button
        variant="contained"
        onClick={handleSalvarEstrategicas}
        sx={{
          backgroundColor: "#312783",
          color: "#fff",

          "&:hover": {
            backgroundColor: "#312783",
          },
        }}
      >
        SALVAR
      </Button>
      </Box>
    </Box>
  );
};

export default BaseDiretriz4;











// CRIAR DIRETRIZ TÁTICA













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
      {/** 
      <TextField
        label="Descrição da Diretriz Tática..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />
      */}

      

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
        <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#4caf50" }} />
      </Button>
    </Box>
  );
}











// CRIAR DIRETRIZ OPERACIONAL











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
      {/** 
      <TextField
        label="Descrição da Diretriz Operacional..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        fullWidth
        multiline
        rows={2}
      />
      */}
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
        <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#f44336" }} />
      </Button>
    </Box>
  );
}