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
import { buscarDataAtualUTC } from "../utils/dataAtual";





  const BaseDiretriz4 = ({ projetoData, onUpdate, dataInicio, prazoPrevisto }) => {
  // Estados para os três conjuntos de diretrizes
  const [users, setUsers] = useState([]);

  const [estrategicas, setEstrategicas] = useState([]);

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
      const dataAtual = await buscarDataAtualUTC();
  
      const estrategicasCompletas = (projetoData.estrategicas || []).map((estrategica) => {
        // Lógica do statusVisual para diretrizes concluídas
        let statusVisual = "";
        if (estrategica.status === "concluida" && projetoData?.prazoPrevisto) {
          const [ano, mes, dia] = projetoData.prazoPrevisto.split("-");
          const prazoPrevistoDate = new Date(`${ano}-${mes}-${dia}T23:59:59`);
          statusVisual = dataAtual <= prazoPrevistoDate ? "no_prazo" : "atrasada";
        }
  
        return {
          ...estrategica,
          emails: estrategica.emails || [],
          areasResponsaveis: estrategica.areasResponsaveis || [],
          unidades: estrategica.unidades || [],
          statusVisual,
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
        };
      });
  
      setEstrategicas(estrategicasCompletas);
  
      // Agora os estados auxiliares por ID:
      const novaAreasPorId = {};
      const novasUnidadesPorId = {};
      const novosEmailsPorId = {};
  
      const novaAreasTaticasPorId = {};
      const novasUnidadesTaticasPorId = {};
      const novosEmailsTaticasPorId = {};
  
      const novaAreasOperacionaisPorId = {};
      const novasUnidadesOperacionaisPorId = {};
      const novosEmailsOperacionaisPorId = {};
  
      estrategicasCompletas.forEach((estrategica) => {
        novaAreasPorId[estrategica.id] = estrategica.areasResponsaveis;
        novasUnidadesPorId[estrategica.id] = estrategica.unidades;
        novosEmailsPorId[estrategica.id] = (estrategica.emails || []).join(", ");
  
        estrategica.taticas?.forEach((tatica) => {
          novaAreasTaticasPorId[tatica.id] = tatica.areasResponsaveis;
          novasUnidadesTaticasPorId[tatica.id] = tatica.unidades;
          novosEmailsTaticasPorId[tatica.id] = (tatica.emails || []).join(", ");
  
          tatica.operacionais?.forEach((operacional) => {
            novaAreasOperacionaisPorId[operacional.id] = operacional.areasResponsaveis;
            novasUnidadesOperacionaisPorId[operacional.id] = operacional.unidades;
            novosEmailsOperacionaisPorId[operacional.id] = (operacional.emails || []).join(", ");
          });
        });
      });
  
      setAreasPorId(novaAreasPorId);
      setUnidadesPorId(novasUnidadesPorId);
      setEmailsPorId(novosEmailsPorId);
  
      setAreasTaticasPorId(novaAreasTaticasPorId);
      setUnidadesTaticasPorId(novasUnidadesTaticasPorId);
      setEmailsTaticasPorId(novosEmailsTaticasPorId);
  
      setAreasPorIdOperacional(novaAreasOperacionaisPorId);
      setUnidadesPorIdOperacional(novasUnidadesOperacionaisPorId);
      setEmailsPorIdOperacional(novosEmailsOperacionaisPorId);
    })();
  }, [projetoData]);
  
  
  
  
  


//Salvar as 3 listas separadas: estrategicas, taticas e operacionais/planodeacao (tarefas)
  const handleSalvarDiretrizes = async () => {
    if (!projetoData?.id) {
      alert("ID do projeto não encontrado.");
      return;
    }
    try {
      // Supondo que você esteja usando o 'db' importado de firebase-config
      const projetoRef = doc(db, "projetos", projetoData.id);
      await updateDoc(projetoRef, {
        estrategicas,              // Dados atualizados das estratégicas
        taticas,                   // Dados atualizados das táticas
        operacional,               // Dados atualizados das operacionais
        areasResponsaveis: areasSelecionadas,
        unidadesRelacionadas: unidadeSelecionadas,
        updatedAt: new Date(),
      });
      alert("Diretrizes salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar diretrizes:", error);
      alert("Erro ao salvar diretrizes. Tente novamente.");
    }
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
  // Salvar somente Diretrizes Estrategicas
  // -------------------------------------
  
  const handleSalvarEstrategicas = async () => {
    try {
      if (!projectId) {
        alert("ID do projeto não encontrado. Salve primeiro as informações do projeto.");
        return;
      }
  
      // Atualiza os campos de áreas, unidades e emails com os valores do estado nos objetos das diretrizes antes de salvar
      const estrategicasAtualizadas = estrategicas.map((est) => ({
        ...est,
        areasResponsaveis: areasPorId[est.id] || [],
        unidades: unidadesPorId[est.id] || [],
        emails: (emailsPorId[est.id] || "").split(",").map((email) => email.trim()).filter((email) => email !== ""),
        taticas: (est.taticas || []).map((tatica) => ({
          ...tatica,
          areasResponsaveis: areasTaticasPorId[tatica.id] || [],
          unidades: unidadesTaticasPorId[tatica.id] || [],
          emails: (emailsTaticasPorId[tatica.id] || "").split(",").map((email) => email.trim()).filter((email) => email !== ""),
          operacionais: (tatica.operacionais || []).map((operacional) => ({
            ...operacional,
            areasResponsaveis: areasPorIdOperacional[operacional.id] || [],
            unidades: unidadesPorIdOperacional[operacional.id] || [],
            emails: (emailsPorIdOperacional[operacional.id] || "").split(",").map((email) => email.trim()).filter((email) => email !== ""),
          })),
        })),
      }));
  
      const projetoRef = doc(db, "projetos", projectId);
      await updateDoc(projetoRef, {
        estrategicas: estrategicasAtualizadas,
        updatedAt: new Date(),
      }); 
      
  
      // ✅ Enviar notificações e e-mails para usuários das áreas
      const rolesVinculados = areasSelecionadas.flatMap(
        (areaId) => areaRolesMap[areaId] || []
      );
  
      if (rolesVinculados.length > 0) {
        const usuarios = await buscarUsuariosPorRole(rolesVinculados);
  
        await Promise.all(
          usuarios.map(async (user) => {
            await fetch("https://fokus360-backend.vercel.app/send-notification", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.id,
                mensagem: "Nova Diretriz Estratégica criada para sua área.",
              }),
            });
  
            await fetch("https://fokus360-backend.vercel.app/send-task-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                tituloTarefa: "Nova Diretriz Estratégica",
                assuntoTarefa: "Foi criada uma nova diretriz estratégica vinculada à sua área.",
                prazoTarefa: "Sem prazo",
              }),
            });
          })
        );
      }
  
      // ✅ Enviar e-mail para os e-mails manuais
      const emailsManuais = estrategicas
      .flatMap((estrategica) => estrategica.emails || [])
      .filter((email) => email.trim() !== "");

  
      if (emailsManuais.length > 0) {
        await Promise.all(
          emailsManuais.map(async (email) => {
            await fetch("https://fokus360-backend.vercel.app/send-task-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: email,
                tituloTarefa: "Nova Diretriz Estratégica",
                assuntoTarefa:
                  "Foi criada uma nova diretriz estratégica vinculada ao seu e-mail.",
                prazoTarefa: "Sem prazo",
              }),
            });
          })
        );
      }
  
      setEstrategicas(estrategicasAtualizadas);
      alert("✅ Diretrizes atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar diretrizes:", error);
      alert("Erro ao salvar diretrizes. Tente novamente.");
    }
  };
  
  
  //=============================================================================================================



  //========================================= Salvar táticas ====================================================

  const handleSalvarTaticas = async () => {
    try {
      if (!projectId) {
        alert("ID do projeto não encontrado. Salve primeiro as informações do projeto.");
        return;
      }
  
      const allTaticas = estrategicas.flatMap((est) => est.taticas);
      if (allTaticas.length === 0) {
        alert("Adicione ao menos uma Tática.");
        return;
      }
      if (areasSelecionadas.length === 0) {
        alert("Selecione pelo menos uma área responsável.");
        return;
      }
      if (unidadeSelecionadas.length === 0) {
        alert("Selecione pelo menos uma unidade.");
        return;
      }
      if (areastaticasSelecionadas.length === 0) {
        alert("Selecione pelo menos uma área responsável para a Tática.");
        return;
      }
  
      const projetoRef = doc(db, "projetos", projectId);
      await updateDoc(projetoRef, {
        taticas: allTaticas,
        areasResponsaveis: areasSelecionadas,
        unidadesRelacionadas: unidadeSelecionadas,
        updatedAt: new Date(),
      });
  
      // ✅ Enviar notificações para perfis vinculados às áreas
     // ✅ Enviar notificações para perfis vinculados às áreas da TÁTICA
const rolesVinculados = areastaticasSelecionadas.flatMap(
  (areaId) => areaRolesMap[areaId] || []
);

if (rolesVinculados.length > 0) {
  const usuarios = await buscarUsuariosPorRole(rolesVinculados);

  await Promise.all(
    usuarios.map(async (user) => {
      await fetch("https://fokus360-backend.vercel.app/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          mensagem: "Nova Diretriz Tática criada para sua área.",
        }),
      });

      await fetch("https://fokus360-backend.vercel.app/send-task-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          tituloTarefa: "Nova Diretriz Tática",
          assuntoTarefa: "Foi criada uma nova diretriz tática vinculada à sua área.",
          prazoTarefa: "Sem prazo",
        }),
      });
    })
  );
}

      // ✅ Enviar e-mail para os e-mails manuais digitados
      const emailsManuais = allTaticas
        .flatMap((tatica) => tatica.emails || [])
        .filter((email) => email.trim() !== "");
  
      if (emailsManuais.length > 0) {
        await Promise.all(
          emailsManuais.map(async (email) => {
            await fetch("https://fokus360-backend.vercel.app/send-task-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: email,
                tituloTarefa: "Nova Diretriz Tática",
                assuntoTarefa: "Foi criada uma nova diretriz tática vinculada ao seu e-mail.",
                prazoTarefa: "Sem prazo",
              }),
            });
          })
        );
      }
  
      alert("✅ Táticas salvas e notificações enviadas!");
    } catch (error) {
      console.error("Erro ao salvar táticas:", error);
      alert("Erro ao salvar táticas. Tente novamente.");
    }
  };
  
  

  
  

//=========================================================================================================================================== 



//========================================= Salvar Operacional ====================================================

const handleSalvarOperacional = async () => {
  try {
    if (!projectId) {
      alert("ID do projeto não encontrado. Salve primeiro as informações do projeto.");
      return;
    }

    const allOperacional = estrategicas.flatMap((est) =>
      est.taticas.flatMap((tatica) =>
        tatica.operacionais.map((operacional) => ({
          id: operacional.id,
          titulo: operacional.titulo,
          descricao: operacional.descricao,
          tarefas: operacional.tarefas || [],
          emails: operacional.emails || [], 
        }))
      )
    );
    

    if (allOperacional.length === 0) {
      alert("Adicione ao menos uma Operacional.");
      return;
    }
    if (areasSelecionadas.length === 0) {
      alert("Selecione pelo menos uma área responsável.");
      return;
    }
    if (unidadeSelecionadas.length === 0) {
      alert("Selecione pelo menos uma unidade.");
      return;
    }
    if (areasoperacionalSelecionadas.length === 0) {
      alert("Selecione pelo menos uma Operacional.");
      return;
    }

    const projetoRef = doc(db, "projetos", projectId);
    await updateDoc(projetoRef, {
      operacional: allOperacional,
      areasResponsaveis: areasSelecionadas,
      unidadesRelacionadas: unidadeSelecionadas,
      updatedAt: new Date(),
    });

    const rolesVinculados = areasoperacionalSelecionadas.flatMap(
      (areaId) => areaRolesMap[areaId] || []
    );

    if (rolesVinculados.length === 0) {
      alert("Nenhum perfil vinculado às áreas selecionadas.");
      return;
    }

    const usuarios = await buscarUsuariosPorRole(rolesVinculados);

    await Promise.all(
      usuarios.map(async (user) => {
        await fetch("https://fokus360-backend.vercel.app/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            mensagem: "Nova Diretriz Operacional criada para sua área.",
          }),
        });

        await fetch("https://fokus360-backend.vercel.app/send-task-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            tituloTarefa: "Nova Diretriz Operacional",
            assuntoTarefa:
              "Foi criada uma nova diretriz Operacional vinculada à sua área.",
            prazoTarefa: "Sem prazo",
          }),
        });
      })
    );

    // ✅ Enviar e-mails para os e-mails manuais digitados
const emailsManuais = allOperacional
.flatMap((op) => op.emails || [])
.filter((email) => email.trim() !== "");

if (emailsManuais.length > 0) {
await Promise.all(
  emailsManuais.map(async (email) => {
    await fetch("https://fokus360-backend.vercel.app/send-task-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        tituloTarefa: "Nova Diretriz Operacional",
        assuntoTarefa:
          "Foi criada uma nova diretriz operacional vinculada ao seu e-mail.",
        prazoTarefa: "Sem prazo",
      }),
    });
  })
);
}


    await Promise.all(
      allOperacional.flatMap((operacional) =>
        (operacional.tarefas || []).flatMap((tarefa) => {
          const emails = tarefa.planoDeAcao?.quemEmail || [];
          const emailList = Array.isArray(emails) ? emails : [emails];
          return emailList
            .filter((email) => email.trim() !== "")
            .map(async (email) => {
              await fetch(
                "https://fokus360-backend.vercel.app/send-task-email",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email,
                    tituloTarefa: tarefa.tituloTarefa || "Nova Tarefa",
                    assuntoTarefa:
                      "Você foi designado para um plano de ação",
                    prazoTarefa: tarefa.planoDeAcao?.quando || "Sem prazo",
                  }),
                }
              );
            });
        })
      )
    );

    alert("✅ Operacionais salvas e notificações enviadas!");
  } catch (error) {
    console.error("Erro ao salvar Operacionais:", error);
    alert("Erro ao salvar Operacionais. Tente novamente.");
  }
};



  

  // -------------------------------------
  // Render
  // -------------------------------------
  return (
    <Box>
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
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                {estrategica.titulo}
              </Typography>
              <Typography sx={{ color: "#b7b7b7", fontSize: "0.9em" }}>
                {estrategica.descricao}
              </Typography>
            </Box>

            

            <Box sx={{ display: "flex", justifyContent: "flex-end ", gap: 2, mr: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: 120,
                }}
              >
           <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    minWidth: 120,
  }}
>
  <FormControlLabel
    control={
      <Checkbox
        size="small"
        onChange={async () => {
          const dataAtual = await buscarDataAtualUTC();
        
          const atualizado = estrategicas.map((e) => {
            if (e.id !== estrategica.id) return e;
        
            const prazo = projetoData?.prazoPrevisto;
        
            if (!prazo || !/^\d{4}-\d{2}-\d{2}$/.test(prazo)) {
              console.warn("Data inválida:", prazo);
              return { ...e, status: "" };
            }
        
            const [ano, mes, dia] = prazo.split("-");
            const prazoPrevistoDate = new Date(`${ano}-${mes}-${dia}T23:59:59`);
            const dentroDoPrazo = dataAtual <= prazoPrevistoDate;
        
            const novoStatus = e.status === "concluida" || e.status === "atrasada"
              ? ""
              : dentroDoPrazo
              ? "concluida"
              : "atrasada";
        
            return {
              ...e,
              status: novoStatus,
              statusVisual:
                novoStatus === "concluida"
                  ? dentroDoPrazo
                    ? "no_prazo"
                    : "atrasada"
                  : "",
            };
          });
        
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
    onClick={(e) => e.stopPropagation()} // Evita abrir o Accordion ao clicar no label
    sx={{ margin: 0, cursor: "pointer" }}
  />
</Box>

              </Box>

              {/* Checkbox: Em Andamento */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: 130,
                }}
              >
                <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    minWidth: 130,
  }}
>
  <FormControlLabel
    control={
      <Checkbox
        size="small"
        checked={estrategica.status === "andamento"}
        onClick={(e) => e.stopPropagation()}
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

              </Box>

              {/* Bolinha de status + texto fixo */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: 120, // <- espaço reservado fixo
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
                        ? estrategica.statusVisual === "atrasada"
                          ? "#ef4444"
                          : "#22c55e"
                        : estrategica.status === "andamento"
                        ? "#00d2e3"
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
                    ? estrategica.statusVisual === "atrasada"
                      ? "Atrasada"
                      : "No prazo"
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

          {/* Detalhes: Diretriz TÁTICA */}
          <AccordionDetails>

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


          {/* E-mails adicionais */}
          <TextField
  label="E-mails adicionais (separe por vírgula)"
  value={emailsPorId[estrategica.id] || ""}
  onChange={(e) => {
    const value = e.target.value;

    // Atualiza o campo de texto
    setEmailsPorId((prev) => ({
      ...prev,
      [estrategica.id]: value,
    }));

    // Atualiza a estrutura no estado principal
    setEstrategicas((prev) =>
      prev.map((est) =>
        est.id === estrategica.id
          ? {
              ...est,
              emails: value
                .split(",")
                .map((email) => email.trim())
                .filter((email) => email !== ""),
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
                  {/* Cabeçalho da Tática */}
                  <Box sx={{ flex: 1, textAlign: "left" }}>
                    <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                      {tatica.titulo}
                    </Typography>
                    <Typography sx={{ color: "#dddddd", fontSize: "0.9em" }}>
                      {tatica.descricao}
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
              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
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

  {/* E-mails adicionais */}
  <Box sx={{ flex: 1 }}>
    <TextField
      label="E-mails adicionais (separe por vírgula)"
      value={emailsTaticasPorId[tatica.id] || ''}
      onChange={(e) => {
        const value = e.target.value;

        setEmailsTaticasPorId((prev) => ({
          ...prev,
          [tatica.id]: value,
        }));

        setEstrategicas((prev) =>
          prev.map((est) => ({
            ...est,
            taticas: est.taticas.map((t) =>
              t.id === tatica.id
                ? {
                    ...t,
                    emails: value
                      .split(',')
                      .map((email) => email.trim())
                      .filter((email) => email !== ''),
                  }
                : t
            ),
          }))
        );
      }}
      fullWidth
      sx={{ backgroundColor: 'transparent' }}
    />
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

  {/* E-mails adicionais */}
  <Box sx={{ flex: 2, minWidth: "200px" }}>
    <TextField
      label="E-mails adicionais (separe por vírgula)"
      value={emailsPorIdOperacional[operacional.id] || ""}
      onChange={(e) => {
        const value = e.target.value;
        setEmailsPorIdOperacional((prev) => ({
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
                  ? {
                      ...op,
                      emails: value
                        .split(",")
                        .map((email) => email.trim())
                        .filter((email) => email !== ""),
                    }
                  : op
              ),
            })),
          }))
        );
      }}
      fullWidth
      sx={{ backgroundColor: "transparent", marginTop: "10px" }}
    />
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