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
  CircularProgress,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { doc, updateDoc, getDoc, getDocs, getFirestore, collection, arrayUnion  } from "firebase/firestore";
import { dbFokus360 } from "../data/firebase-config"; 







function calcularProgressoEstrategica(estrategica) {
  let totalTarefas = 0;
  let totalConcluidas = 0;

  for (const tatica of estrategica.taticas || []) {
    for (const operacional of tatica.operacionais || []) {
      for (const tarefa of operacional.tarefas || []) {
        totalTarefas++;
        if (tarefa?.checkboxState?.concluida) {
          totalConcluidas++;
        }
      }
    }
  }

  if (totalTarefas === 0) return 0; // Se não tiver tarefa nenhuma, 0%

  return Math.round((totalConcluidas / totalTarefas) * 100);
}



const BaseDiretriz2 = ({ projectId, onDiretrizesUpdate  }) => {

  // Inputs para criar nova Diretriz Estratégica
  const [novaEstrategica, setNovaEstrategica] = useState("");
  const [descEstrategica, setDescEstrategica] = useState("");
  const [estrategicas, setEstrategicas] = useState([]); // Agora começa vazio, mas será preenchido pelo Firestore
  const [users, setUsers] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [tarefasLocais, setTarefasLocais] = useState([]);
  const [diretrizes, setDiretrizes] = useState([]);


  useEffect(() => {
    if (onDiretrizesUpdate) {
      onDiretrizesUpdate(diretrizes); 
    }
  }, [diretrizes]);
  
  
     // 🔹 Carregar usuários do Firebase
     useEffect(() => {
      const fetchUsers = async () => {
        try {
          console.log("🔍 Buscando usuários...");
          const querySnapshot = await getDocs(collection(dbFokus360, "user")); // 🔹 Tente mudar "user" para "users"
          if (querySnapshot.empty) {
            console.warn("⚠️ Nenhum usuário encontrado no Firestore!");
          }
    
          const usersList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username,
          }));
    
          console.log("✅ Usuários carregados:", usersList);
          setUsers(usersList);
        } catch (error) {
          console.error("❌ Erro ao buscar usuários:", error);
        }
      };
    
      fetchUsers();
    }, []);
    


//Busca os dados do Firestore ao carregar
useEffect(() => {
  if (!projectId) {
    console.warn("⚠️ Nenhum projectId encontrado.");
    return;
  }

  const fetchDiretrizes = async () => {
    try {
      const docRef = doc(dbFokus360, "projetos", projectId);

      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("📢 Dados do Firestore carregados:", JSON.stringify(data, null, 2)); // 🔹 DEBUG
  
        setDiretrizes(data.diretrizes || []);
      } else {
        console.error("⚠️ Projeto não encontrado no Firestore.");
      }
    } catch (error) {
      console.error("❌ Erro ao buscar diretrizes:", error);
    }
  };
  

  fetchDiretrizes();
}, [projectId]); // 🔹 Recarrega apenas quando o `projectId` mudar




useEffect(() => {
  if (onDiretrizesUpdate && diretrizes.length > 0) {
    console.log("📢 BaseDiretriz2 enviando diretrizes para DataProjeto:", JSON.stringify(diretrizes, null, 2));
    onDiretrizesUpdate([...diretrizes]);
  }
}, [diretrizes, onDiretrizesUpdate]);





  // -------------------------------------
  // Criar nova Diretriz Estratégica
  // -------------------------------------
  //

  const handleAddEstrategica = () => {
    if (!novaEstrategica.trim()) {
      alert("Preencha o nome da Diretriz Estratégica!");
      return;
    }
  
    const novaDiretriz = {
      id: `estrategica-${Date.now()}`,
      titulo: novaEstrategica,
      descricao: descEstrategica,
      taticas: [],
    };
  
    setDiretrizes((prev) => [...prev, novaDiretriz]); // 🔹 Agora mantém os dados existentes e adiciona uma nova diretriz
  
   // 🔥 Atualiza no Firestore *sem apagar os dados existentes*
  if (projectId) {
    const docRef = doc(db, "projetos", projectId);
    updateDoc(docRef, {
      diretrizes: arrayUnion(novaDiretriz) // 🔹 Usa arrayUnion para adicionar, *não* sobrescrever
    })
    .then(() => console.log("✅ Nova diretriz adicionada ao Firestore!"))
    .catch((err) => console.error("❌ Erro ao atualizar Firestore:", err));
  }
    
    // Limpa os campos do formulário sem afetar a lista de diretrizes
    setNovaEstrategica("");
    setDescEstrategica("");
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
    onDiretrizesUpdate && onDiretrizesUpdate(atualizadas);

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
    const docRef = doc(db, "projetos", projectId);
    await updateDoc(docRef, { estrategicas: novoArray });
    console.log("✅ Estratégicas atualizadas no Firestore!");
  } catch (err) {
    console.error("❌ Erro ao atualizar estratégicas:", err);
  }
};


const handleEditDiretriz = (index, field, value) => {
  setDiretrizes((prevDiretrizes) => {
    const updated = [...prevDiretrizes];
    updated[index] = { ...updated[index], [field]: value };
    return updated;
  });
};

const handleEditTatica = (indexEstrategica, indexTatica, field, value) => {
  setDiretrizes((prevDiretrizes) => {
    const updated = [...prevDiretrizes];
    updated[indexEstrategica].taticas[indexTatica] = {
      ...updated[indexEstrategica].taticas[indexTatica],
      [field]: value,
    };
    return updated;
  });
};

const handleEditOperacional = (indexEstrategica, indexTatica, indexOperacional, field, value) => {
  setDiretrizes((prevDiretrizes) => {
    const updated = [...prevDiretrizes];
    updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional] = {
      ...updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional],
      [field]: value,
    };
    return updated;
  });
};

const handleEditTarefa = (indexEstrategica, indexTatica, indexOperacional, indexTarefa, field, value) => {
  setDiretrizes((prevDiretrizes) => {
    const updated = JSON.parse(JSON.stringify(prevDiretrizes)); // 🔹 Cópia profunda

    // 🔹 Verifica se a estrutura existe antes de acessar
    if (!updated[indexEstrategica]?.taticas?.[indexTatica]?.operacionais?.[indexOperacional]?.tarefas?.[indexTarefa]) {
      console.error("❌ Erro: Índices inválidos para acessar a estrutura de tarefas.");
      return prevDiretrizes; // Retorna sem alterar caso algo esteja `undefined`
    }

    // 🔹 Atualiza corretamente o título da tarefa ou os campos do planoDeAcao
    if (field === "tituloTarefa") {
      updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional].tarefas[indexTarefa].tituloTarefa = value;
    } else {
      updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional].tarefas[indexTarefa].planoDeAcao[field] = value;
    }

    return updated;
  });
};







const salvarDiretrizesNoBanco = async () => {
  try {
    if (!projectId) {
      console.error("❌ projectId está indefinido ao tentar salvar diretrizes!");
      return;
    }

    const docRef = doc(db, "projetos", projectId);
    await updateDoc(docRef, { diretrizes });

    console.log("✅ Diretrizes atualizadas no Firestore!");
    alert("Diretrizes salvas com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao atualizar diretrizes:", err);
  }
};

const handleAddDiretriz = () => {
  const novaDiretriz = {
    id: `estrategica-${Date.now()}`,
    titulo: "Nova Diretriz Estratégica",
    descricao: "Descrição da diretriz",
    taticas: [],
  };
  setDiretrizes([...diretrizes, novaDiretriz]);
};

const handleAddTatica = (indexEstrategica) => {
  const novaTatica = {
    id: `tatica-${Date.now()}`,
    titulo: "Nova Diretriz Tática",
    descricao: "Descrição da diretriz",
    operacionais: [],
  };
  setDiretrizes((prev) => {
    const updated = [...prev];
    updated[indexEstrategica].taticas.push(novaTatica);
    return updated;
  });
};


const handleAddOperacional = (indexEstrategica, indexTatica) => {
  const novaOperacional = {
    id: `operacional-${Date.now()}`,
    titulo: "Nova Diretriz Operacional",
    descricao: "Descrição da diretriz",
    tarefas: [],
  };
  setDiretrizes((prev) => {
    const updated = [...prev];
    updated[indexEstrategica].taticas[indexTatica].operacionais.push(novaOperacional);
    return updated;
  });
};


const criarPlanoDeAcaoPadrao = () => ({
  oQue: "",
  porQue: "",
  quem: [],
  quando: "",
  onde: "",
  como: "",
  valor: "",
});

const handleAddTarefa = (indexEstrategica, indexTatica, indexOperacional) => {
  const novaTarefa = {
    id: `tarefa-${Date.now()}`,
    tituloTarefa: "Nova Tarefa",
    planoDeAcao: criarPlanoDeAcaoPadrao(), // 🔹 Agora sempre cria um plano de ação válido
  };

  setDiretrizes((prev) => {
    const updated = JSON.parse(JSON.stringify(prev)); // 🔹 Cópia profunda para evitar mutação direta do estado

    // 🔹 Verifica se a estrutura existe antes de tentar acessá-la
    if (
      !updated[indexEstrategica]?.taticas?.[indexTatica]?.operacionais?.[indexOperacional]?.tarefas
    ) {
      console.error("❌ Erro: Estrutura de tarefas não encontrada.");
      return prev; // Retorna o estado original se houver um erro
    }

    updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional].tarefas.push(novaTarefa);
    
    return updated; // 🔹 Retorna a nova versão do estado
  });
};


//Funções para Excluir
const handleDeleteEstrategica = (index) => {
  setDiretrizes((prev) => prev.filter((_, i) => i !== index));
};

const handleDeleteTatica = (indexEstrategica, indexTatica) => {
  setDiretrizes((prev) => {
    const updated = [...prev];
    updated[indexEstrategica].taticas = updated[indexEstrategica].taticas.filter((_, i) => i !== indexTatica);
    return updated;
  });
};

const handleDeleteOperacional = (indexEstrategica, indexTatica, indexOperacional) => {
  setDiretrizes((prev) => {
    const updated = [...prev];
    updated[indexEstrategica].taticas[indexTatica].operacionais = updated[indexEstrategica].taticas[indexTatica].operacionais.filter((_, i) => i !== indexOperacional);
    return updated;
  });
};

const handleDeleteTarefa = (indexEstrategica, indexTatica, indexOperacional, indexTarefa) => {
  setDiretrizes((prev) => {
    const updated = [...prev];
    updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional].tarefas = updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional].tarefas.filter((_, i) => i !== indexTarefa);
    return updated;
  });
};
























// Componente para calcular e exibir o progresso visualmente
const ProgressStatus = ({ progresso }) => {
  let statusText = "";
  if (progresso === 0) {
    statusText = "Não iniciada";
  } else if (progresso === 100) {
    statusText = "Concluído";
  } else {
    statusText = "Em andamento";
  }

  // Definir cor também, se quiser
  let color;
  if (progresso === 100) {
    color = "#4CAF50"; // Verde
  } else if (progresso >= 50) {
    color = "#FF9800"; // Laranja
  } else {
    color = "#F44336"; // Vermelho
  }

  return (
    <Box display="flex" alignItems="center" gap={1} marginLeft="5px" sx={{ marginTop: "20px" }}>
      <CircularProgress
        variant="determinate"
        value={progresso}
        sx={{ color }}
        thickness={10}
        size={40}
      />
      <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#9d9d9c" }}>
        {statusText}
      </Typography>
    </Box>
  );
};

const handleToggleCampoCheckbox = (
  indexEstrategica,
  indexTatica,
  indexOperacional,
  indexTarefa,
  nomeCampo
) => {
  setDiretrizes((prevDiretrizes) => {
    const updated = JSON.parse(JSON.stringify(prevDiretrizes)); // ou faça um clone imutável
    const tarefaAlvo =
      updated[indexEstrategica]
        .taticas[indexTatica]
        .operacionais[indexOperacional]
        .tarefas[indexTarefa];

    // Se não existir, inicializa
    tarefaAlvo.checkboxState = tarefaAlvo.checkboxState || {};

    // Toggle no campo específico: true -> false ou false -> true
    tarefaAlvo.checkboxState[nomeCampo] = !tarefaAlvo.checkboxState[nomeCampo];

    // Recalcula progresso (opcional, se você quiser gravar no objeto)
    tarefaAlvo.progresso = calcularProgresso(tarefaAlvo);

    return updated;
  });
};

function calcularProgresso(tarefa) {
  // Se não existir checkboxState, retorna 0%
  if (!tarefa.checkboxState) return 0;

  // Lista de campos do 5W2H que queremos rastrear
  const campos = ["oQue", "porQue", "quem", "quando", "onde", "como", "valor"];

  // Quantos estão marcados como true?
  const total = campos.length;
  const marcados = campos.filter((campo) => tarefa.checkboxState[campo]).length;

  // Retorna a porcentagem
  return Math.round((marcados / total) * 100);
}







// 🔥 Função para alternar os checkboxes
const handleCheckChange = (indexEstrategica, indexTatica, indexOperacional, indexTarefa, tarefa, setDiretrizes) => {
  setDiretrizes((prevDiretrizes) => {
    const updatedDiretrizes = [...prevDiretrizes];
    const tarefaAtual = updatedDiretrizes[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional].tarefas[indexTarefa];

    const novoEstado = {
      ...tarefaAtual.checkboxState,
      concluida: !tarefaAtual.checkboxState?.concluida, // Alterna o estado
    };

    tarefaAtual.checkboxState = novoEstado;
    tarefaAtual.progresso = calcularProgresso(tarefaAtual); // Atualiza o progresso

    return updatedDiretrizes;
  });
};




const calcularProgressoOperacional = (operacional) => {
  if (!operacional.tarefas || operacional.tarefas.length === 0) return 0;

  const totalProgresso = operacional.tarefas.reduce((acc, tarefa) => acc + (tarefa.progresso || 0), 0);
  return Math.round(totalProgresso / operacional.tarefas.length);
};


function calcularProgressoTatica(tatica) {
  const { operacionais = [] } = tatica;
  if (operacionais.length === 0) return 0; // Se não há operacionais, progresso é 0%

  let somaProgresso = 0;
  let totalOperacionais = 0;

  for (const operacional of operacionais) {
    if (operacional.tarefas && operacional.tarefas.length > 0) {
      somaProgresso += calcularProgressoOperacional(operacional);
      totalOperacionais++;
    }
  }

  if (totalOperacionais === 0) return 0; // Se nenhuma operacional tiver tarefas, progresso é 0%

  return Math.round(somaProgresso / totalOperacionais);
}




// Função auxiliar para o Status de Progresso (pode ser um componente separado se você quiser)
const StatusProgresso = ({ progresso }) => { //  Componente funcional simples
  let color;
  if (progresso === 100) {
      color = "#4CAF50"; // Verde
  } else if (progresso >= 50) {
      color = "#FF9800"; // Laranja
  } else {
      color = "#F44336"; // Vermelho
  }

  return (
      <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: "10px", marginTop: "5px" }}>
          <CircularProgress variant="determinate" value={progresso} sx={{ color }} thickness={10} size={40} />
          <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#9d9d9c" }}>
              {progresso === 100 ? "Concluído" : "Em andamento"}
          </Typography>
      </Box>
  );
};

const calcularProgressoEstrategica = ({ taticas = [] }) => {
  if (!taticas.length) return 0; // Se não houver táticas, progresso é 0%

  let totalProgresso = 0;
  let totalTaticas = 0;

  for (const tatica of taticas) {
    // Se a tática tem operacionais e pelo menos uma delas tem tarefas, calcula o progresso
    if (tatica.operacionais && tatica.operacionais.some(op => op.tarefas && op.tarefas.length > 0)) {
      totalProgresso += calcularProgressoTatica(tatica);
      totalTaticas++;
    }
  }

  if (totalTaticas === 0) return 0; // Se nenhuma tática válida, progresso é 0%
  
  return Math.round(totalProgresso / totalTaticas);
};



const StatusProgressoTotal = ({ tarefas }) => {
  if (!tarefas || tarefas.length === 0) {
    return null; // Se não houver tarefas, não exibe nada
  }

  // Soma os progressos e calcula a média
  const progressoTotal = tarefas.reduce((acc, tarefa) => acc + calcularProgresso(tarefa), 0);
  const progressoMedio = Math.round(progressoTotal / tarefas.length); // Calcula a média

  let color;
  let statusText;

  if (progressoMedio === 100) {
    color = "#4CAF50"; // Verde (Concluído)
    statusText = "Concluído";
  } else if (progressoMedio >= 50) {
    color = "#FF9800"; // Laranja (Meio caminho)
    statusText = `${progressoMedio}% concluído`;
  } else if (progressoMedio > 0) {
    color = "#F44336"; // Vermelho (Pouco progresso)
    statusText = `${progressoMedio}% concluído`;
  } else {
    color = "#F44336"; // Vermelho (Não iniciada)
    statusText = "Não iniciada";
  }

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: "10px", marginTop: "20px" }}>
      <CircularProgress
        variant="determinate"
        value={progressoMedio}
        sx={{ color }}
        thickness={10}
        size={40}
      />
      <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#9d9d9c" }}>
        {statusText}
      </Typography>
    </Box>
  );
};


const StatusProgressoTatica = ({ operacionais }) => {
  if (!operacionais || operacionais.length === 0) {
    return null; // Se não houver operacionais, não exibe nada
  }

  // Filtrar apenas as operacionais que têm progresso calculado
  const operacionaisComProgresso = operacionais.filter(op => op.tarefas && op.tarefas.length > 0);

  if (operacionaisComProgresso.length === 0) {
    return null; // Se nenhuma operacional tiver tarefas, não exibe o progresso da Tática
  }

  // Soma os progressos das operacionais válidas e calcula a média
  const progressoTotal = operacionaisComProgresso.reduce(
    (acc, operacional) => acc + calcularProgressoOperacional(operacional), 
    0
  );
  const progressoMedio = Math.round(progressoTotal / operacionaisComProgresso.length); // Calcula a média apenas das operacionais com progresso válido

  let color;
  let statusText;

  if (progressoMedio === 100) {
    color = "#4CAF50"; // Verde (Concluído)
    statusText = "Concluído";
  } else if (progressoMedio >= 50) {
    color = "#FF9800"; // Laranja (Meio caminho)
    statusText = `${progressoMedio}% concluído`;
  } else if (progressoMedio > 0) {
    color = "#F44336"; // Vermelho (Pouco progresso)
    statusText = `${progressoMedio}% concluído`;
  } else {
    color = "#F44336"; // Vermelho (Não iniciada)
    statusText = "Não iniciada";
  }

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: "10px", marginTop: "20px" }}>
      <CircularProgress
        variant="determinate"
        value={progressoMedio}
        sx={{ color }}
        thickness={10}
        size={40}
      />
      <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#9d9d9c" }}>
        {statusText}
      </Typography>
    </Box>
  );
};


const StatusProgressoEstrategica = ({ taticas }) => {
  if (!taticas || taticas.length === 0) {
    return null; // Se não houver táticas, não exibe nada
  }

  // ✅ Chamar a função corretamente
  const progressoMedio = calcularProgressoEstrategica({ taticas });

  console.log("📊 Progresso Estratégico:", calcularProgressoEstrategica({ taticas }));

  console.log("🔎 Táticas da Estratégica:", taticas);



  let color;
  let statusText;

  if (progressoMedio === 100) {
    color = "#4CAF50"; // Verde (Concluído)
    statusText = "Concluído";
  } else if (progressoMedio >= 50) {
    color = "#FF9800"; // Laranja (Meio caminho)
    statusText = `${progressoMedio}% concluído`;
  } else if (progressoMedio > 0) {
    color = "#F44336"; // Vermelho (Pouco progresso)
    statusText = `${progressoMedio}% concluído`;
  } else {
    color = "#F44336"; // Vermelho (Não iniciada)
    statusText = "Não iniciada";
  }

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: "10px", marginTop: "20px" }}>
      <CircularProgress
        variant="determinate"
        value={progressoMedio}
        sx={{ color }}
        thickness={10}
        size={40}
      />
      <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#9d9d9c" }}>
        {statusText}
      </Typography>
    </Box>
  );
};

























  // -------------------------------------
  // Render
  // -------------------------------------
  return (
    <Box sx={{ backgroundColor: "#f8f9fa", p: 3, borderRadius: 2 }}>
      {/* Criar Diretriz Estratégica */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ color: "#312783", mb: 2 }}
      >
        Criar Diretriz Estratégica
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        mb={4}
        sx={{ backgroundColor: "#ffffff", p: 2, borderRadius: 2, boxShadow: 1 }}
      >
        <TextField
          label="Nome da Diretriz Estratégica..."
          value={novaEstrategica}
          onChange={(e) => setNovaEstrategica(e.target.value)}
          fullWidth
        />
        {/** 
        <TextField
          label="Descrição da Diretriz Estratégica..."
          value={descEstrategica}
          onChange={(e) => setDescEstrategica(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />
        */}
        <Button
          onClick={handleAddEstrategica}
          sx={{
            alignSelf: "center",
            backgroundColor: "#312783",
            color: "#ffffff",
            "&:hover": { backgroundColor: "#261e5a" },
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 25 }} />
        </Button>
      </Box>

      {/* Lista de Diretrizes Estratégicas */}
      {diretrizes.map((estrategica, indexEstrategica) => (
        <Accordion
          key={estrategica.id}
          sx={{ borderLeft: "6px solid #312783" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          sx={{ marginBottom: "20px" }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#858585",
                  fontSize: "0.7rem",
                  marginBottom: "5px",
                }}
              >
                Nome da Diretriz Estratégica
              </Typography>
              <TextField
                sx={{
                  backgroundColor: "#332984",
                  borderRadius: "5px",
                  "& .MuiInputBase-input": {
                    color: "white",
                    fontSize: "1rem",
                    padding: "12px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none", // Remove a borda padrão
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none", // Remove a borda ao passar o mouse
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none", // Remove a borda ao focar no campo
                  },
                }}
                fullWidth
                value={estrategica.titulo}
                onChange={(e) =>
                  handleEditDiretriz(indexEstrategica, "titulo", e.target.value)
                }
                variant="outlined"
              />
            </Box>

             {/* 🔥 Adicionando o progresso da Diretriz Estratégica apenas se houver táticas com progresso */}
             <StatusProgressoEstrategica taticas={estrategica.taticas || []} />




            {/* Botão para excluir Diretriz Estratégica */}
            <Button
              onClick={() => handleDeleteEstrategica(indexEstrategica)}
              sx={{ color: "red" }}
            >
              <DeleteForeverIcon />
            </Button>
          </AccordionSummary>

          <AccordionDetails>
            {/**
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Descrição da Diretriz Estratégica"
              value={estrategica.descricao}
              onChange={(e) =>
                handleEditDiretriz(
                  indexEstrategica,
                  "descricao",
                  e.target.value
                )
              }
            />
             */}

            <Button
              onClick={() => handleAddTatica(indexEstrategica)}
              fullWidth
              sx={{
                mt: 2,
                borderBottomLeftRadius: "0",
                fontSize: "7px",
                maxWidth: "20%",
                backgroundColor: "#2e7d32",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#1b5e20" },
              }}
            >
              <AddCircleOutlineIcon sx={{ mr: 1 }} /> Adicionar Diretriz Tática
            </Button>

            {/* Lista de Diretrizes Táticas */}
            {estrategica.taticas.map((tatica, indexTatica) => (
              <Accordion
                key={tatica.id}
                sx={{ borderLeft: "6px solid #2e7d32" }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#858585",
                        fontSize: "0.7rem",
                        marginBottom: "5px",
                      }}
                    >
                      Nome da Diretriz Tática
                    </Typography>
                    <TextField
                      sx={{
                        backgroundColor: "#2e7d32",
                        borderRadius: "5px",
                        "& .MuiInputBase-input": {
                          color: "white",
                          fontSize: "1rem",
                          padding: "12px",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                      fullWidth
                      value={tatica.titulo}
                      onChange={(e) =>
                        handleEditTatica(
                          indexEstrategica,
                          indexTatica,
                          "titulo",
                          e.target.value
                        )
                      }
                      variant="outlined"
                    />
                  </Box>

                  {/* 🔥 Adicionando o progresso da Diretriz Tática apenas se houver operacionais com progresso */}
                    <StatusProgressoTatica operacionais={tatica.operacionais} />



                  {/* Botão para excluir Diretriz Tática */}
                  <Button
                    onClick={() =>
                      handleDeleteTatica(indexEstrategica, indexTatica)
                    }
                    sx={{ color: "red" }}
                  >
                    <DeleteForeverIcon />
                  </Button>
                </AccordionSummary>

                <AccordionDetails>
                  {/**
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Descrição da Diretriz Tática"
                    value={tatica.descricao}
                    onChange={(e) =>
                      handleEditTatica(
                        indexEstrategica,
                        indexTatica,
                        "descricao",
                        e.target.value
                      )
                    }
                  />
                   */}

                  <Button
                    onClick={() =>
                      handleAddOperacional(indexEstrategica, indexTatica)
                    }
                    fullWidth
                    sx={{
                      mt: 2,
                      borderBottomLeftRadius: "0",
                      fontSize: "7px",
                      maxWidth: "25%",
                      backgroundColor: "#d32f2f",
                      color: "#ffffff",
                      "&:hover": { backgroundColor: "#b71c1c" },
                    }}
                  >
                    <AddCircleOutlineIcon sx={{ mr: 1 }} /> Adicionar Diretriz
                    Operacional
                  </Button>

                  {/* Lista de Diretrizes Operacionais */}
                  {tatica.operacionais.map((operacional, indexOperacional) => (
                    <Accordion
                      key={operacional.id}
                      sx={{ borderLeft: "6px solid #d32f2f" }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="subtitle1"
        sx={{
          color: "#858585",
          fontSize: "0.7rem",
          marginBottom: "5px",
        }}
      >
        Nome da Diretriz Operacional
      </Typography>
      <TextField
        sx={{
          backgroundColor: "#d32f2f",
          borderRadius: "5px",
          "& .MuiInputBase-input": {
            color: "white",
            fontSize: "1rem",
            padding: "12px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        fullWidth
        value={operacional.titulo}
        onChange={(e) =>
          handleEditOperacional(
            indexEstrategica,
            indexTatica,
            indexOperacional,
            "titulo",
            e.target.value
          )
        }
        variant="outlined"
      />
    </Box>

    {/* 🔥 Gráfico de progresso da Diretriz Operacional */}
    <StatusProgressoTotal tarefas={operacional.tarefas} />


    {/* Botão para excluir Diretriz Operacional */}
    <Button
      onClick={() =>
        handleDeleteOperacional(
          indexEstrategica,
          indexTatica,
          indexOperacional
        )
      }
      sx={{ color: "red" }}
    >
      <DeleteForeverIcon />
    </Button>
  </AccordionSummary>

  <AccordionDetails>
      {/**    
    <TextField
      fullWidth
      multiline
      rows={2}
      label="Descrição da Diretriz Operacional"
      value={operacional.descricao}
      onChange={(e) =>
        handleEditOperacional(
          indexEstrategica,
          indexTatica,
          indexOperacional,
          "descricao",
          e.target.value
        )
      }
    />
    */} 

<Button
      onClick={() =>
        handleAddTarefa(indexEstrategica, indexTatica, indexOperacional)
      }
      fullWidth
      sx={{
        mt: 2,
        borderBottomLeftRadius: "0",
        fontSize: "7px",
        maxWidth: "20%",
        backgroundColor: "#ffb600",
        color: "#ffffff",
        "&:hover": { backgroundColor: "#c62828" },
      }}
    >
      <AddCircleOutlineIcon sx={{ mr: 1 }} /> Adicionar Tarefa
    </Button>

                        {/* Exibir Tarefas */}
                        {operacional.tarefas.map((tarefa, indexTarefa) => (
                          <Accordion key={tarefa.id}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                                width: "100%", // Garante que o Box ocupe toda a largura da tela
                                maxWidth: "100%", // Impede que ultrapasse a tela
                                marginLeft: "20px",
                              }}
                            >
                              <Typography sx={{ fontSize: "10px", color: "#333" }}>
                                Título da Tarefa
                              </Typography>
                              <TextField
                                sx={{
                                  backgroundColor: "#ffb600",
                                  borderRadius: "5px",
                                  width: "100%", // Faz o TextField ocupar toda a largura disponível
                                  "& .MuiInputBase-input": {
                                    color: "white",
                                    fontSize: "1rem",
                                    padding: "12px",
                                  },
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                  },
                                }}
                                fullWidth
                                value={tarefa.tituloTarefa}
                                onChange={(e) =>
                                  handleEditTarefa(
                                    indexEstrategica,
                                    indexTatica,
                                    indexOperacional,
                                    indexTarefa,
                                    "tituloTarefa",
                                    e.target.value
                                  )
                                }
                              />
                            </Box>
                        
                            {/* 🔥 Gráfico de progresso ao lado do botão de excluir */}
                            <ProgressStatus progresso={calcularProgresso(tarefa)} />
                        
                            <Button
                              onClick={() =>
                                handleDeleteTarefa(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa
                                )
                              }
                              sx={{ color: "red" }}
                            >
                              <DeleteForeverIcon />
                            </Button>
                          </AccordionSummary>
                        
                          <AccordionDetails>
                            {/* 🔥 Checkbox para marcar como concluída */}
                            {/** 
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                              <Checkbox
                                checked={tarefa.checkboxState?.concluida || false}
                                onChange={() =>
                                  handleCheckChange(indexEstrategica, indexTatica, indexOperacional, indexTarefa, tarefa, setDiretrizes)
                                }
                              />
                              <Typography sx={{ fontSize: "12px" }}>
                                Concluída
                              </Typography>
                            </Box>
                            */}
                        
                            {/* O QUE */}
                              <Box display="flex" alignItems="center" mb={1} sx={{ marginTop: "20px" }}>
                                <TextField
                                  fullWidth
                                  label="O que?"
                                  value={tarefa.planoDeAcao.oQue || ""}
                                  onChange={(e) =>
                                    handleEditTarefa(
                                      indexEstrategica,
                                      indexTatica,
                                      indexOperacional,
                                      indexTarefa,
                                      "oQue",
                                      e.target.value
                                    )
                                  }
                                />
                                <Checkbox
                                  checked={tarefa.checkboxState?.oQue || false}
                                  onChange={() =>
                                    handleToggleCampoCheckbox(
                                      indexEstrategica,
                                      indexTatica,
                                      indexOperacional,
                                      indexTarefa,
                                      "oQue"
                                    )
                                  }
                                />
                              </Box>

                              {/* POR QUE */}
                            <Box display="flex" alignItems="center" mb={1}>
                            <TextField
                              fullWidth
                              label="Por que?"
                              value={tarefa.planoDeAcao.porQue || ""}
                              sx={{ marginBottom: "20px" }}
                              onChange={(e) =>
                                handleEditTarefa(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "porQue",
                                  e.target.value
                                )
                              }
                            />
                            <Checkbox
                              checked={tarefa.checkboxState?.porQue || false}
                              onChange={() =>
                                handleToggleCampoCheckbox(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "porQue"
                                )
                              }
                            />
                            </Box>
                        
                            {/* 🔹 Campo "Quem" com múltipla seleção */}
                            {/* QUEM (com Select múltiplo) */}
                            <Box display="flex" alignItems="center" mb={1}>
                            <Select
                              multiple
                              value={tarefa.planoDeAcao.quem ?? []}
                              onChange={(event) =>
                                handleEditTarefa(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "quem",
                                  event.target.value
                                )
                              }
                              displayEmpty
                              sx={{ width: "100%", backgroundColor: "#fff", marginBottom: "20px" }}
                              renderValue={(selected) =>
                                selected.length === 0
                                  ? "Quem..."
                                  : selected
                                      .map(
                                        (id) =>
                                          users?.find((user) => user.id === id)?.username || "Desconhecido"
                                      )
                                      .join(", ")
                              }
                            >
                              {users?.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                  <Checkbox
                                    checked={tarefa.planoDeAcao.quem?.includes(user.id) || false}
                                  />
                                  <ListItemText primary={user.username} />
                                </MenuItem>
                              ))}
                            </Select>
                            <Checkbox
                              checked={tarefa.checkboxState?.quem || false}
                              onChange={() =>
                                handleToggleCampoCheckbox(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "quem"
                                )
                              }
                            />
                            </Box>


                              {/* QUANDO */}
                            <Box display="flex" alignItems="center" mb={1}>
                            <TextField
                              fullWidth
                              label="Quando?"
                              value={tarefa.planoDeAcao.quando || ""}
                              sx={{ marginBottom: "20px" }}
                              onChange={(e) =>
                                handleEditTarefa(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "quando",
                                  e.target.value
                                )
                              }
                            />
                            <Checkbox
                            checked={tarefa.checkboxState?.quando || false}
                            onChange={() =>
                              handleToggleCampoCheckbox(
                                indexEstrategica,
                                indexTatica,
                                indexOperacional,
                                indexTarefa,
                                "quando"
                              )
                            }
                          />
                            </Box>

                            {/* ONDE */}
                            <Box display="flex" alignItems="center" mb={1}>
                            <TextField
                              fullWidth
                              label="Onde?"
                              value={tarefa.planoDeAcao.onde || ""}
                              sx={{ marginBottom: "20px" }}
                              onChange={(e) =>
                                handleEditTarefa(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "onde",
                                  e.target.value
                                )
                              }
                            />
                            <Checkbox
                              checked={tarefa.checkboxState?.onde || false}
                              onChange={() =>
                                handleToggleCampoCheckbox(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "onde"
                                )
                              }
                            />
                            </Box>

                            {/* COMO */}
                            <Box display="flex" alignItems="center" mb={1}>
                            <TextField
                              fullWidth
                              label="Como?"
                              value={tarefa.planoDeAcao.como || ""}
                              sx={{ marginBottom: "20px" }}
                              onChange={(e) =>
                                handleEditTarefa(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "como",
                                  e.target.value
                                )
                              }
                            />
                            <Checkbox
                              checked={tarefa.checkboxState?.como || false}
                              onChange={() =>
                                handleToggleCampoCheckbox(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "como"
                                )
                              }
                            />
                            </Box>

                          {/* VALOR */}
                          <Box display="flex" alignItems="center" mb={1}>
                            <TextField
                              fullWidth
                              label="Valor"
                              value={tarefa.planoDeAcao.valor || ""}
                              onChange={(e) => {
                                const formattedValue = new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(Number(e.target.value.replace(/\D/g, "")) / 100);
                                handleEditTarefa(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "valor",
                                  formattedValue
                                );
                              }}
                            />
                            <Checkbox
                              checked={tarefa.checkboxState?.valor || false}
                              onChange={() =>
                                handleToggleCampoCheckbox(
                                  indexEstrategica,
                                  indexTatica,
                                  indexOperacional,
                                  indexTarefa,
                                  "valor"
                                )
                              }
                            />
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                        
                          
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default BaseDiretriz2;