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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { doc, updateDoc, getFirestore, collection, getDocs, setDoc  } from "firebase/firestore";
import { dbFokus360 as db } from "../data/firebase-config"; // ✅ Correto para Fokus360




const BaseDiretriz3 = ({ projectId, estrategicas: propEstrategicas, propOperacional, onUpdate, LimpaEstado }) => {

  const [limpaEstado, setLimpaEstado] = useState("");

 




  const [areasSelecionadasTaticas, setAreasSelecionadasTaticas] = useState([]);


  // Estratégicas
const [areasPorIdEstrategica, setAreasPorIdEstrategica] = useState({});
const [unidadesPorIdEstrategica, setUnidadesPorIdEstrategica] = useState({});
const [emailsPorIdEstrategica, setEmailsPorIdEstrategica] = useState({});

// Táticas
const [areasPorIdTatica, setAreasPorIdTatica] = useState({});
const [unidadesPorIdTatica, setUnidadesPorIdTatica] = useState({});
const [emailsPorIdTatica, setEmailsPorIdTatica] = useState({});

// Operacionais
const [areasPorIdOperacional, setAreasPorIdOperacional] = useState({});
const [unidadesPorIdOperacional, setUnidadesPorIdOperacional] = useState({});
const [emailsPorIdOperacional, setEmailsPorIdOperacional] = useState({});






  const [areasSelecionadas, setAreasSelecionadas] = useState([]);
  const [estrategicas, setEstrategicas] = useState(propEstrategicas || []);

  const [areasTaticasPorId, setAreasTaticasPorId] = useState({});


  const [taticas, setTaticas] = useState([]);
  const [areastaticasSelecionadas, setAreastaticasSelecionadas] = useState([]);

  const [areasOperacionaisPorId, setAreasOperacionaisPorId] = useState({});
  const [operacional, setOperacional] = useState(propOperacional || []);

  const [estrategica, setEstrategica] = useState("");
  const [emailsDigitados, setEmailsDigitados] = useState("");

  const [emailsTaticas, setEmailsTaticas] = useState({});

  const [emailsTaticasInput, setEmailsTaticasInput] = useState({});

  const [emailsOperacionaisInput, setEmailsOperacionaisInput] = useState({});
  

  const [novaEstrategica, setNovaEstrategica] = useState("");
  const [descEstrategica, setDescEstrategica] = useState("");
  const [areas, setAreas] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const [unidadeSelecionadas, setUnidadeSelecionadas] = useState([]); 
  const [users, setUsers] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [tarefasLocais, setTarefasLocais] = useState([]);
  const [formValues, setFormValues] = useState({
    tituloTarefa: novaTarefa,
    planoDeAcao: {
      oQue: "",
      porQue: "",
      quem: [],
      quemEstrategicas: [],
      quemTaticas: [],
      quemOperacionais: [],
      quando: "",
      quemEmail: [],
      onde: "",
      como: "",
      valor: "",
    },
    });

//estado separado para controlar os campos de formulário E-mails Estratégicas e Táticas 
    const [inputEstrategica, setInputEstrategica] = useState({
      titulo: "",
      descricao: "",
      emails: "",
    });
    




  useEffect(() => {
    if (onUpdate) {
      onUpdate(estrategicas); // ✅ Envia atualizações para CadastroProjetos
    }
  }, [estrategicas]);
  
  
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
    


useEffect(() => {
  if (!projectId) return;

  const fetchData = async () => {
    try {
      const docRef = doc(dbFokus360, "projetos", projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() || {};
        setEstrategicas(data.estrategicas || []); // ✅ Atualizando corretamente
        if (onUpdate) onUpdate(data.estrategicas || []);
      }
    } catch (error) {
      console.error("❌ Erro ao buscar projeto:", error);
    }
  };

  fetchData();
}, [projectId]);


useEffect(() => {
  if (onUpdate && estrategicas.length > 0) {
    console.log("📢 BaseDiretriz enviando estratégicas para CadastroProjetos:", JSON.stringify(estrategicas, null, 2));
    onUpdate([...estrategicas]);
  }
}, [estrategicas]);


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

      const queryUnidades = await getDocs(collection(db, "unidade"));
      const unidadesList = queryUnidades.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
      }));
      setUnidades(unidadesList);

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


const handleRemoveTarefa = (idEstrategica, idTatica, idOperacional, idTarefa) => {
  setEstrategicas((prevEstrategicas) =>
    prevEstrategicas.map((estrategica) => {
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
    })
  );
  onUpdate && onUpdate(estrategicas); // <- CHAMA onUpdate!  ESSENCIAL!
};






const handleAddTarefa = (idEstrategica, idTatica, idOperacional, novaTarefa) => {
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
      quemEstrategicas: [],
      quemTaticas: [],
      quemOperacionais: [],
      quando: "",
      quemEmail: [],
      onde: "",
      como: "",
      valor: "",
    },
  };

  console.log("📌 Adicionando nova tarefa:", JSON.stringify(novaTarefaObj, null, 2));

  setEstrategicas((prevEstrategicas) => {
    return prevEstrategicas.map((estrategica) => {
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
  });

  setNovaTarefa(""); // Limpa o campo de entrada
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
      id: Date.now(),
      titulo: novaEstrategica,
      descricao: descEstrategica,
      taticas: [],
      emails,
    };
  
    const atualizado = [...estrategicas, item];
    setEstrategicas(atualizado);
  
    onUpdate && onUpdate(atualizado);
  
    setNovaEstrategica("");
    setDescEstrategica("");
    /** Não limpa os e-mails **/
  };
  
  
  

  // -------------------------------------
  // Remover Diretriz Estratégica
  // -------------------------------------
  const handleRemoveEstrategica = (id) => {
    const atualizado = estrategicas.filter((d) => d.id !== id);
    setEstrategicas(atualizado);
    onUpdate && onUpdate(atualizado);
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
  
    // Busca os e-mails diretamente do estado do input
    const emailsInput = emailsTaticasInput[idEstrategica] || "";
    const emails = emailsInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");
  
    const novo = {
      id: Date.now(),
      titulo,
      descricao,
      operacionais: [],
      emails, // ✅ Aqui já vem certo!
    };
  
    const atualizadas = estrategicas.map((est) => {
      if (est.id === idEstrategica) {
        return { ...est, taticas: [...est.taticas, novo] };
      }
      return est;
    });
  
    setEstrategicas(atualizadas);
    onUpdate && onUpdate(atualizadas);
    console.log("📩 Estado atualizado com e-mail da tática:", atualizadas);
  
    /** ✅ Limpa apenas o input visual, sem afetar as táticas */
    setEmailsTaticasInput((prev) => ({
      ...prev,
      [idEstrategica]: "",
    }));
  };
  
  
  
  
  
  
  
  

  // -------------------------------------
  // Remover Diretriz Tática
  // -------------------------------------
  const handleRemoveTatica = (idEstrategica, idTatica) => {
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
    onUpdate && onUpdate(atualizadas);
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
  
    const emailsInput = emailsOperacionaisInput[idTatica] || "";
    const emails = emailsInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");
  
    const novo = {
      id: Date.now(),
      titulo,
      descricao,
      tarefas: [],
      emails, // ✅ Agora vem certo
    };
  
    const atualizadas = estrategicas.map((est) => {
      if (est.id === idEstrategica) {
        const novasTaticas = est.taticas.map((t) => {
          if (t.id === idTatica) {
            return {
              ...t,
              operacionais: [...t.operacionais, novo],
            };
          }
          return t;
        });
        return { ...est, taticas: novasTaticas };
      }
      return est;
    });
  
    setEstrategicas(atualizadas);
    onUpdate && onUpdate(atualizadas);
    console.log("📌 Diretriz Operacional atualizada com e-mail:", atualizadas);
  
    // Limpa o campo input visualmente (opcional)
    setEmailsOperacionaisInput((prev) => ({
      ...prev,
      [idTatica]: "",
    }));
  };
  
  

  // -------------------------------------
  // Remover Diretriz Operacional
  // -------------------------------------
  const handleRemoveOperacional = (idEstrategica, idTatica, idOp) => {
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
    onUpdate && onUpdate(atualizadas);
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

//limpa estado quando sai da pagina
useEffect(() => {
  return () => {
    setLimpaEstado(true);
    setEmailsDigitados(""); // limpa o campo Estratégico
    setEmailsTaticasInput({}); // limpa os campos das Táticas
  };
}, []);






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
  // Salvar Diretrizes Estrategicas  ( ESSA FUNÇÃO SALVA TUDO, TODO O PROJETO  )
  // -------------------------------------
  
  const handleSalvarEstrategicas = async () => {
    try {
      if (!projectId) {
        alert("ID do projeto não encontrado.");
        return;
      }
  
      const estrategicasAtualizadas = estrategicas.map((estrategica) => {
        const taticasAtualizadas = estrategica.taticas.map((tatica) => {
          const operacionaisAtualizadas = tatica.operacionais.map((op) => ({
            ...op,
            areasResponsaveis: areasOperacionaisPorId[op.id] || [],
            unidades: unidadesPorIdOperacional?.[op.id] || [],
            emails: Array.isArray(emailsPorIdOperacional?.[op.id])
              ? emailsPorIdOperacional[op.id].filter((e) => e.trim() !== "")
              : String(emailsPorIdOperacional?.[op.id] || "")
                  .split(",")
                  .map((e) => e.trim())
                  .filter((e) => e !== ""),
          }));
  
          return {
            ...tatica,
            areasResponsaveis: areasPorIdTatica[tatica.id] || [],
            unidades: unidadesPorIdTatica[tatica.id] || [],
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
          ...estrategica,
          areasResponsaveis: areasPorIdEstrategica[estrategica.id] || [],
          unidades: unidadesPorIdEstrategica[estrategica.id] || [],
          emails: Array.isArray(emailsPorIdEstrategica[estrategica.id])
            ? emailsPorIdEstrategica[estrategica.id].filter((e) => e.trim() !== "")
            : String(emailsPorIdEstrategica[estrategica.id] || "")
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
  
      // Estratégicas - usuários por área
      const rolesEstrategicas = estrategicasAtualizadas.flatMap((est) =>
        (est.areasResponsaveis || []).flatMap((areaId) => areaRolesMap[areaId] || [])
      );
      const usuariosEstrategicos = await buscarUsuariosPorRole(rolesEstrategicas);
      // Estratégicas
const emailsEstrategicas = estrategicasAtualizadas.flatMap((e) => e.emails || []);
await Promise.all(
  emailsEstrategicas.map((email) =>
    fetch("https://fokus360-backend.vercel.app/send-task-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        tituloTarefa: "Nova Diretriz Estratégica",
        assuntoTarefa: "Você foi designado como responsável por uma diretriz Estratégica.",
        prazoTarefa: "Sem prazo",
      }),
    })
  )
);

// Táticas
const emailsTaticas = estrategicasAtualizadas.flatMap((e) =>
  e.taticas.flatMap((t) => t.emails || [])
);
await Promise.all(
  emailsTaticas.map((email) =>
    fetch("https://fokus360-backend.vercel.app/send-task-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        tituloTarefa: "Nova Diretriz Tática",
        assuntoTarefa: "Você foi designado como responsável por uma diretriz Tática.",
        prazoTarefa: "Sem prazo",
      }),
    })
  )
);

// Operacionais
const emailsOperacionais = estrategicasAtualizadas.flatMap((e) =>
  e.taticas.flatMap((t) =>
    t.operacionais.flatMap((op) => op.emails || [])
  )
);
await Promise.all(
  emailsOperacionais.map((email) =>
    fetch("https://fokus360-backend.vercel.app/send-task-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        tituloTarefa: "Nova Diretriz Operacional",
        assuntoTarefa: "Você foi designado como responsável por uma diretriz Operacional.",
        prazoTarefa: "Sem prazo",
      }),
    })
  )
);

  
      // Táticas - usuários por área
      const areasTaticasUnificadas = estrategicasAtualizadas.flatMap((est) =>
        est.taticas.flatMap((tat) => tat.areasResponsaveis || [])
      );
      const rolesTaticas = areasTaticasUnificadas.flatMap((areaId) => areaRolesMap[areaId] || []);
      const usuariosTaticos = await buscarUsuariosPorRole(rolesTaticas);
      await Promise.all(
        usuariosTaticos.map((user) =>
          Promise.all([
            fetch("https://fokus360-backend.vercel.app/send-notification", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.id,
                mensagem: "Nova Diretriz Tática criada para sua área.",
              }),
            }),
            fetch("https://fokus360-backend.vercel.app/send-task-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                tituloTarefa: "Nova Diretriz Tática",
                assuntoTarefa: "Foi criada uma nova diretriz tática vinculada à sua área.",
                prazoTarefa: "Sem prazo",
              }),
            }),
          ])
        )
      );
  
      // Operacionais - usuários por área
      const todasAreasOperacionais = Object.values(areasOperacionaisPorId).flat();
      const rolesOperacionais = todasAreasOperacionais.flatMap((areaId) => areaRolesMap[areaId] || []);
      const usuariosOperacionais = await buscarUsuariosPorRole(rolesOperacionais);
      await Promise.all(
        usuariosOperacionais.map((user) =>
          Promise.all([
            fetch("https://fokus360-backend.vercel.app/send-notification", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.id,
                mensagem: "Nova Diretriz Operacional criada para sua área.",
              }),
            }),
            fetch("https://fokus360-backend.vercel.app/send-task-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                tituloTarefa: "Nova Diretriz Operacional",
                assuntoTarefa: "Foi criada uma nova diretriz operacional vinculada à sua área.",
                prazoTarefa: "Sem prazo",
              }),
            }),
          ])
        )
      );
  
      // Enviar e-mails manuais diretos
      const emailsDiretos = estrategicasAtualizadas.flatMap((est) => [
        ...(est.emails || []),
        ...est.taticas.flatMap((tat) => [
          ...(tat.emails || []),
          ...tat.operacionais.flatMap((op) => op.emails || []),
        ]),
      ]).filter((email) => email.trim() !== "");
  
      await Promise.all(
        emailsDiretos.map(async (email) =>
          fetch("https://fokus360-backend.vercel.app/send-task-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              tituloTarefa: "Nova Diretriz",
              assuntoTarefa: "Você foi designado como responsável por uma diretriz.",
              prazoTarefa: "Sem prazo",
            }),
          })
        )
      );
  
      // E-mails por tarefa (quemEstrategicas, quemTaticas, quem)
      await Promise.all(
        estrategicasAtualizadas.flatMap((estrategica) =>
          estrategica.taticas.flatMap((tatica) =>
            tatica.operacionais.flatMap((op) =>
              (op.tarefas || []).flatMap((tarefa) => {
                const listas = [
                  { emails: tarefa.planoDeAcao?.quemEstrategicas || [], tipo: "Estratégica" },
                  { emails: tarefa.planoDeAcao?.quemTaticas || [], tipo: "Tática" },
                  { emails: tarefa.planoDeAcao?.quemEmail || [], tipo: "Operacional" },
                ];
  
                return listas.flatMap(({ emails, tipo }) =>
                  emails.filter(Boolean).map((email) =>
                    fetch("https://fokus360-backend.vercel.app/send-task-email", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email,
                        tituloTarefa: tarefa.tituloTarefa || "Nova Tarefa",
                        assuntoTarefa: `Você foi designado como responsável por uma diretriz ${tipo}.`,
                        prazoTarefa: tarefa.planoDeAcao?.quando || "Sem prazo",
                      }),
                    })
                  )
                );
              })
            )
          )
        )
      );

      // E-mails por tarefa - quemEmail (campo novo baseado em e-mails)
await Promise.all(
  estrategicasAtualizadas.flatMap((estrategica) =>
    estrategica.taticas.flatMap((tatica) =>
      tatica.operacionais.flatMap((op) =>
        (op.tarefas || []).flatMap((tarefa) =>
          (tarefa.planoDeAcao?.quemEmail || []).map((email) =>
            fetch("https://fokus360-backend.vercel.app/send-task-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                tituloTarefa: tarefa.tituloTarefa || "Nova Tarefa",
                assuntoTarefa: `Você foi designado como responsável por uma tarefa operacional.`,
                prazoTarefa: tarefa.planoDeAcao?.quando || "Sem prazo",
              }),
            })
          )
        )
      )
    )
  )
);

  
      alert("✅ Diretrizes Estratégicas salvas e todas as notificações enviadas!");
    } catch (error) {
      console.error("Erro ao salvar diretrizes estratégicas:", error);
      alert("Erro ao salvar diretrizes. Tente novamente.");
    }
  };
  
  
  
  
  
  //=============================================================================================================



  //========================================= Salvar táticas ====================================================

  const handleSalvarTaticas = async () => {
    try {
      if (!projectId) {
        alert("ID do projeto não encontrado.");
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
  
    const projetoRef = doc(db, "projetos", projectId); // ✅ ESSENCIAL!

    console.log("🟡 Salvando TÁTICAS:", areasSelecionadasTaticas);
    await updateDoc(projetoRef, {
      estrategicas, // 👈 sempre salva a estrutura inteira
      areasResponsaveistaticas: areasSelecionadasTaticas,
      unidadesRelacionadas: unidadeSelecionadas,
      updatedAt: new Date(),
    });
    
    
      
  
      // 🔔 Notificação para perfis vinculados às áreas táticas
      const rolesVinculados = areasSelecionadasTaticas.flatMap(
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
  
      // ✉️ E-mails manuais nas táticas
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
      alert("ID do projeto não encontrado.");
      return;
    }

    const allOperacional = estrategicas.flatMap((est) =>
      est.taticas.flatMap((tatica) =>
        tatica.operacionais.map((op) => ({
          id: op.id,
          titulo: op.titulo,
          descricao: op.descricao,
          tarefas: op.tarefas || [],
          emails: op.emails || [],
        }))
      )
    );

    if (allOperacional.length === 0) {
      alert("Adicione ao menos uma Operacional.");
      return;
    }

    // ✅ Coleta todas as áreas selecionadas nas operacionais
    const todasAreasOperacionais = Object.values(areasOperacionaisPorId).flat();

    if (todasAreasOperacionais.length === 0) {
      alert("Selecione ao menos uma área responsável para a Operacional.");
      return;
    }

    const projetoRef = doc(db, "projetos", projectId);
    await updateDoc(projetoRef, {
      estrategicas,
      areasResponsaveis: todasAreasOperacionais,
      areasResponsaveisoperacional: todasAreasOperacionais,
      updatedAt: new Date(),
    });

    // 🔔 Busca usuários pelas áreas operacionais e envia notificações
    const rolesVinculados = todasAreasOperacionais.flatMap(
      (areaId) => areaRolesMap[areaId] || []
    );

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
            assuntoTarefa: "Foi criada uma nova diretriz operacional vinculada à sua área.",
            prazoTarefa: "Sem prazo",
          }),
        });
      })
    );

    // ✉️ Envia e-mails manuais adicionados nas operacionais
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
              assuntoTarefa: "Foi criada uma nova diretriz operacional vinculada ao seu e-mail.",
              prazoTarefa: "Sem prazo",
            }),
          });
        })
      );
    }

    // ✉️ Envia e-mails para os responsáveis das tarefas (quemEmail)
    await Promise.all(
      allOperacional.flatMap((operacional) =>
        (operacional.tarefas || []).flatMap((tarefa) => {
          const emails = tarefa.planoDeAcao?.quemEmail || [];
          const emailList = Array.isArray(emails) ? emails : [emails];
          return emailList
            .filter((email) => email.trim() !== "")
            .map(async (email) => {
              await fetch("https://fokus360-backend.vercel.app/send-task-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email,
                  tituloTarefa: tarefa.tituloTarefa || "Nova Tarefa",
                  assuntoTarefa: "Você foi designado para um plano de ação",
                  prazoTarefa: tarefa.planoDeAcao?.quando || "Sem prazo",
                }),
              });
            });
        })
      )
    );



    // ✉️ Envia e-mails para os responsáveis definidos em quemEstrategicas
await Promise.all(
  estrategicas.flatMap((estrategica) =>
    estrategica.taticas.flatMap((tatica) =>
      tatica.operacionais.flatMap((operacional) =>
        (operacional.tarefas || []).flatMap((tarefa) => {
          const emails = tarefa.planoDeAcao?.quemEstrategicas || [];
          const emailList = Array.isArray(emails) ? emails : [emails];
          return emailList
            .filter((email) => email.trim() !== "")
            .map(async (email) => {
              await fetch("https://fokus360-backend.vercel.app/send-task-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email,
                  tituloTarefa: tarefa.tituloTarefa || "Nova Tarefa",
                  assuntoTarefa: "Você foi designado para um plano de ação vinculado à diretriz estratégica.",
                  prazoTarefa: tarefa.planoDeAcao?.quando || "Sem prazo",
                }),
              });
            });
        })
      )
    )
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2, // Espaço entre os elementos (pode ajustar conforme necessário)
            flexWrap: "wrap", // Para quebrar linha em telas pequenas
          }}
        >
         
          <Button
            onClick={handleAddEstrategica}
            disableRipple
            sx={{
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
            <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#312783" }} />
          </Button>

          
        </Box>
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












































































      {/**================================== ESTRATÉGICAS ======================================================  */}

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
            <Button
              disableRipple
              onClick={(e) => {
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





          <Box sx={{ display: "flex", width: "100%", gap: 2, flexWrap: "wrap", mt: 2 }}>
  {/* Áreas */}
  <Box sx={{ flex: 1, minWidth: "300px" }}>
    <Select
      multiple
      value={areasPorIdEstrategica[estrategica.id] || []}
      onChange={(event) =>
        setAreasPorIdEstrategica((prev) => ({
          ...prev,
          [estrategica.id]: event.target.value,
        }))
      }
      displayEmpty
      fullWidth
      sx={{ backgroundColor: "#fff" }}
      renderValue={(selected) =>
        selected.length === 0
          ? "Selecione as áreas responsáveis"
          : selected
              .map(
                (id) =>
                  areas.find((area) => area.id === id)?.nome || "Desconhecida"
              )
              .join(", ")
      }
    >
      {areas.map((area) => (
        <MenuItem key={area.id} value={area.id}>
          <Checkbox checked={(areasPorIdEstrategica[estrategica.id] || []).includes(area.id)} />
          <ListItemText primary={area.nome} />
        </MenuItem>
      ))}
    </Select>
  </Box>

  {/* Unidades */}
  <Box sx={{ flex: 1, minWidth: "300px" }}>
    <Select
      multiple
      value={unidadesPorIdEstrategica[estrategica.id] || []}
      onChange={(event) =>
        setUnidadesPorIdEstrategica((prev) => ({
          ...prev,
          [estrategica.id]: event.target.value,
        }))
      }
      displayEmpty
      fullWidth
      sx={{ backgroundColor: "#fff" }}
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
          <Checkbox checked={(unidadesPorIdEstrategica[estrategica.id] || []).includes(uni.id)} />
          <ListItemText primary={uni.nome} />
        </MenuItem>
      ))}
    </Select>
  </Box>



  {/* responsáveis pela diretriz estrategica */}
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

      // Atualiza dentro da estrutura das estratégias também
      setEstrategicas((prev) =>
        prev.map((est) => {
          if (est.id === estrategica.id) {
            return {
              ...est,
              emails: selectedEmails,
            };
          }
          return est;
        })
      );
    }}
    renderValue={(selected) =>
      selected.length === 0
        ? "Selecione os responsáveis pela diretriz"
        : selected.join(", ")
    }
    fullWidth
    sx={{ backgroundColor: "#fff" }}
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

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginBottom: "10px",
                flexWrap: "wrap", // Mantém quebrando no mobile
              }}
            ></Box>

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

           
                <AccordionDetails>




{/* descrição diretriz táticas */}
<Box sx={{ display: "flex" }}>
<TextField
  label="Descrição"
  value={tatica.descricao || ""}
  onChange={(e) => {
    const value = e.target.value;

    setEstrategicas((prev) =>
      prev.map((est) => ({
        ...est,
        taticas: est.taticas.map((tat) =>
          tat.id === tatica.id
            ? { ...tat, descricao: value }
            : tat
        ),
      }))
    );
  }}
  sx={{
    flex: 1,
    backgroundColor: "transparent",
    marginTop: "10px",
  }}
/>
</Box>










                  {/* Áreas */}
                  <Box sx={{ display: "flex", width: "100%", gap: 2, flexWrap: "wrap", marginTop: "20px"}}>
  {/* Áreas */}
  <Box sx={{ flex: 1, minWidth: "300px" }}>
  <Select
  multiple
  displayEmpty
  value={areasPorIdTatica[tatica.id] || []}
  onChange={(event) =>
    setAreasPorIdTatica((prev) => ({
      ...prev,
      [tatica.id]: event.target.value,
    }))
  }
  renderValue={(selected) =>
    selected.length === 0
      ? "Selecione as áreas responsáveis"
      : selected
          .map((id) => areas.find((a) => a.id === id)?.nome || "Desconhecida")
          .join(", ")
  }
  fullWidth
  sx={{ backgroundColor: "#fff" }}
>
  {areas.map((area) => (
    <MenuItem key={area.id} value={area.id}>
      <Checkbox checked={(areasPorIdTatica[tatica.id] || []).includes(area.id)} />
      <ListItemText primary={area.nome} />
    </MenuItem>
  ))}
</Select>

  </Box>

  {/* Unidades */}
  <Box sx={{ flex: 1, minWidth: "300px" }}>
  <Select
  multiple
  displayEmpty
  value={unidadesPorIdTatica[tatica.id] || []}
  onChange={(event) =>
    setUnidadesPorIdTatica((prev) => ({
      ...prev,
      [tatica.id]: event.target.value,
    }))
  }
  renderValue={(selected) =>
    selected.length === 0
      ? "Selecione a Unidade"
      : selected
          .map((id) => unidades.find((u) => u.id === id)?.nome || "Desconhecida")
          .join(", ")
  }
  fullWidth
  sx={{ backgroundColor: "#fff" }}
>
  {unidades.map((uni) => (
    <MenuItem key={uni.id} value={uni.id}>
      <Checkbox checked={(unidadesPorIdTatica[tatica.id] || []).includes(uni.id)} />
      <ListItemText primary={uni.nome} />
    </MenuItem>
  ))}
</Select>

  </Box>

{/* Responsáveis pela Tática (quemTaticas) */}
<Box sx={{ flex: 1, minWidth: "300px" }}>
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

      // Atualiza campo 'quemTaticas' dentro da estrutura
      setEstrategicas((prev) =>
        prev.map((est) => ({
          ...est,
          taticas: est.taticas.map((tat) =>
            tat.id === tatica.id
              ? { ...tat, quemTaticas: selectedEmails }
              : tat
          ),
        }))
      );
    }}
    renderValue={(selected) =>
      selected.length === 0
        ? "Selecione os responsáveis pela tática"
        : selected.join(", ")
    }
    fullWidth
    sx={{ backgroundColor: "#fff" }}
  >
    {users?.map((user) => (
      <MenuItem key={user.id} value={user.email}>
        <Checkbox
          checked={(emailsPorIdTatica[tatica.id] || []).includes(user.email)}
        />
        <ListItemText primary={`${user.username} (${user.email})`} />
      </MenuItem>
    ))}
  </Select>
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

                  {/**================================== FIM TÁTICAS ======================================================  */}
















































































                  {/* ======================================== OPERACIONAIS ============================================












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



                        


                      <Box sx={{ display: "flex", width: "100%", gap: 2, flexWrap: "wrap", mt: 2 }}>
  {/* Áreas Responsáveis */}
  <Box sx={{ flex: 1, minWidth: "300px" }}>
    {/* Áreas Responsáveis */}
<Select
  multiple
  value={areasOperacionaisPorId[operacional.id] || []}
  onChange={(event) =>
    setAreasOperacionaisPorId((prev) => ({
      ...prev,
      [operacional.id]: event.target.value,
    }))
  }
  displayEmpty
  fullWidth
  sx={{ backgroundColor: "#fff" }}
  renderValue={(selected) =>
    selected.length === 0
      ? "Selecione as áreas responsáveis"
      : selected
          .map(
            (id) => areas.find((area) => area.id === id)?.nome || "Desconhecida"
          )
          .join(", ")
  }
>
  {areas.map((area) => (
    <MenuItem key={area.id} value={area.id}>
      <Checkbox
        checked={(areasOperacionaisPorId[operacional.id] || []).includes(area.id)}
      />
      <ListItemText primary={area.nome} />
    </MenuItem>
  ))}
</Select>
  </Box>

  {/* Unidades */}
  <Box sx={{ flex: 1, minWidth: "300px" }}>
    {/* Unidades */}
<Select
  multiple
  value={unidadesPorIdOperacional[operacional.id] || []}
  onChange={(event) =>
    setUnidadesPorIdOperacional((prev) => ({
      ...prev,
      [operacional.id]: event.target.value,
    }))
  }
  displayEmpty
  fullWidth
  sx={{ backgroundColor: "#fff" }}
  renderValue={(selected) =>
    selected.length === 0
      ? "Selecione a Unidade"
      : selected
          .map(
            (id) => unidades.find((uni) => uni.id === id)?.nome || "Desconhecida"
          )
          .join(", ")
  }
>
  {unidades.map((uni) => (
    <MenuItem key={uni.id} value={uni.id}>
      <Checkbox checked={(unidadesPorIdOperacional[operacional.id] || []).includes(uni.id)} />
      <ListItemText primary={uni.nome} />
    </MenuItem>
  ))}
</Select>
  </Box>


{/* responsáveis pela tarefa (quemOperacionais) */}
<Box sx={{ flex: 1, minWidth: "300px" }}>
  <Select
    multiple
    displayEmpty
    value={operacional.quemOperacionais || []}
    onChange={(event) => {
      const selected = event.target.value;

      // Atualiza no estado geral das estratégias
      setEstrategicas((prev) =>
        prev.map((est) => ({
          ...est,
          taticas: est.taticas.map((tat) => ({
            ...tat,
            operacionais: tat.operacionais.map((op) =>
              op.id === operacional.id
                ? { ...op, quemOperacionais: selected }
                : op
            ),
          })),
        }))
      );
    }}
    renderValue={(selected) =>
      selected.length === 0
        ? "Selecione os responsáveis pela operacional"
        : selected.join(", ")
    }
    fullWidth
    sx={{ backgroundColor: "#fff" }}
  >
    {users?.map((user) => (
      <MenuItem key={user.id} value={user.email}>
        <Checkbox
          checked={
            (operacional.quemOperacionais || []).includes(user.email)
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
 {/* Responsáveis pela tarefa (quemOperacionais) */}
<Box sx={{ flex: 1, minWidth: "300px" }}>
  <Select
    multiple
    displayEmpty
    value={tarefa.planoDeAcao.quemEmail || []}
    onChange={(event) => {
      const selectedEmails = event.target.value;

      // Atualiza o estado das tarefas na estrutura de estratégicas
      setEstrategicas((prev) =>
        prev.map((est) => ({
          ...est,
          taticas: est.taticas.map((tat) => ({
            ...tat,
            operacionais: tat.operacionais.map((op) => ({
              ...op,
              tarefas: op.tarefas.map((t) =>
                t.id === tarefa.id
                  ? {
                      ...t,
                      planoDeAcao: {
                        ...t.planoDeAcao,
                        quemEmail: selectedEmails,
                      },
                    }
                  : t
              ),
            })),
          })),
        }))
      );
    }}
    renderValue={(selected) =>
      selected.length === 0
        ? "Selecione os responsáveis pela tarefa"
        : selected.join(", ")
    }
    fullWidth
    sx={{ backgroundColor: "#fff" }}
  >
    {users?.map((user) => (
      <MenuItem key={user.id} value={user.email}>
        <Checkbox
          checked={(tarefa.planoDeAcao.quemEmail || []).includes(user.email)}
        />
        <ListItemText primary={`${user.username} (${user.email})`} />
      </MenuItem>
    ))}
  </Select>
</Box>

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

                        {/** ======================================== FIM OPERACIONAIS ========================================= */}
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ display: "flex", justifyContent: "flex-end",  }}>
      <Button
            variant="contained"
            sx={{
              backgroundColor: "#312783",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#312783",
              },
            }}
            onClick={handleSalvarEstrategicas}
          >
            SALVAR
          </Button>
          </Box>
    </Box>
  );
};

export default BaseDiretriz3;











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