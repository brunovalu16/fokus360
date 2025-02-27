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
import { doc, updateDoc, getFirestore, collection, getDocs } from "firebase/firestore";
import { dbFokus360 as db } from "../data/firebase-config"; // ✅ Correto para Fokus360

// Seu componente de tarefas (5W2H)
import DiretrizData from "./DiretrizData";


const BaseDiretriz = ({ projectId, estrategicas: propEstrategicas, onUpdate, LimpaEstado }) => {

  // Inputs para criar nova Diretriz Estratégica
  const [novaEstrategica, setNovaEstrategica] = useState("");
  const [descEstrategica, setDescEstrategica] = useState("");
  const [estrategicas, setEstrategicas] = useState(propEstrategicas || []);
  const [users, setUsers] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [tarefasLocais, setTarefasLocais] = useState([]);
  const [formValues, setFormValues] = useState({
    tituloTarefa: novaTarefa,
    planoDeAcao: {
      oQue: "",
      porQue: "",
      quem: [],
      quando: "",
      onde: "",
      como: "",
      valor: "",
    },
    });




    // Monitorando a mensagem para limpar os inputs
  useEffect(() => {
    if (LimpaEstado) {
      setFormValues({
        tituloTarefa: novaTarefa,
        planoDeAcao: {
          oQue: "",
          porQue: "",
          quem: [],
          quando: "",
          onde: "",
          como: "",
          valor: "",
        },
      });
    }
  }, [LimpaEstado]);


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
      quando: "",
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
      //alert("Preencha o nome e a descrição da Diretriz Estratégica!");
      return;
    }
    const item = {
      id: Date.now(),
      titulo: novaEstrategica,
      descricao: descEstrategica,
      taticas: [],
    };
    const atualizado = [...estrategicas, item];
    setEstrategicas(atualizado);
  
    console.log("📌 Atualizando lista de diretrizes (Estrategicas):", JSON.stringify(atualizado, null, 2));
  
    onUpdate && onUpdate(atualizado);
  
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
  // Criar nova Diretriz Tática
  // -------------------------------------
  //|| !descricao.trim()

  const handleAddTatica = (idEstrategica, titulo, descricao) => {
    if (!titulo.trim()) {
      alert("Preencha o nome da Diretriz Tática!");
      //alert("Preencha o nome e a descrição da Diretriz Tática!");
      return;
    }
    const novo = {
      id: Date.now(),
      titulo,
      descricao,
      operacionais: [],
    };
    const atualizadas = estrategicas.map((est) => {
      if (est.id === idEstrategica) {
        return { ...est, taticas: [...est.taticas, novo] };
      }
      return est;
    });
    setEstrategicas(atualizadas);
  
    console.log("📌 Atualizando lista de diretrizes (Táticas):", JSON.stringify(atualizadas, null, 2));
  
    onUpdate && onUpdate(atualizadas);
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
      //alert("Preencha o nome e a descrição da Diretriz Operacional!");
      return;
    }
    const novo = {
      id: Date.now(),
      titulo,
      descricao,
      tarefas: [],
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
  
    console.log("📌 Atualizando lista de diretrizes (Operacionais):", JSON.stringify(atualizadas, null, 2));
  
    onUpdate && onUpdate(atualizadas);
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


  //useEffect que monitora LimpaEstado para resetar estrategicas
  useEffect(() => {
    if (LimpaEstado) {
      setEstrategicas([]); // 🔹 Limpa as diretrizes estratégicas
    }
  }, [LimpaEstado]);
  
  
  
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

  // -------------------------------------
  // Limpar tudo quando LimpaEstado mudar
  // -------------------------------------
  useEffect(() => {
    if (LimpaEstado) {
      setEstrategicas([]);
      setNovaEstrategica("");
      setDescEstrategica("");
    }
  }, [LimpaEstado]);

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
          <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#312783" }} />
        </Button>
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

          {/* Detalhes: Diretriz TÁTICA */}
          <AccordionDetails>
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
              onAdd={(titulo, desc) => handleAddTatica(estrategica.id, titulo, desc)}

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
                    <DeleteForeverIcon sx={{ fontSize: 24, color: "#dddddd" }} />
                </Button>
                </AccordionSummary>

                {/* Detalhes: Diretriz Operacional */}
                <AccordionDetails>
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
                      handleAddOperacional(estrategica.id, tatica.id, titulo, desc)
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
                            handleRemoveOperacional(estrategica.id, tatica.id, operacional.id);
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

                      {/* Detalhes (tarefas, 5W2H) */}
                      <AccordionDetails>
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
                              onClick={() => handleAddTarefa( estrategica.id, tatica.id, operacional.id, novaTarefa)}
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
    "&:hover": { backgroundColor: "transparent" },
  }}
>
  <DeleteForeverIcon sx={{ fontSize: 24 }} />
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
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default BaseDiretriz;











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
