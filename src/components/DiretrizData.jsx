import React, { useState, useEffect } from "react";
import { Checkbox, ListItemText, Dialog, ListItem, DialogContent, Box, List, Button, Alert, Select, Typography, MenuItem, TextField, Accordion, AccordionDetails } from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import  Header  from "../components/Header";
import { db, storage } from "../data/firebase-config"; // Firestore e Storage
import { collection, doc, deleteDoc } from "firebase/firestore"
import { getFirestore, getDocs } from 'firebase/firestore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRef } from 'react';


const DiretrizData = ({ diretrizID, onUpdate }) => {
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [responsaveis, setResponsaveis] = useState([]);
  const [quem, setQuem] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [formValues, setFormValues] = useState({
      titulo: novaTarefa,
      responsavel: "Responsável padrão",
      colaboradores: [],
      oQue: "",
      porQue: "",
      quem: [],
      quando: "",
      onde: "",
      como: "",
      valor: "",
    });


     // Função para buscar os usuários no Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "user"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          username: doc.data().username,
        }));
        console.log("Usuários carregados:", usersList); // Adicione este log
        setUsers(usersList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);



  // Manipular mudanças gerais (TextField e Select)
  const handleChange = (event) => {
    const { name, value } = event.target;
  
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    onUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
    // Manipular seleção múltipla (Colaboradores)
  const handleSelectChange = (event) => {
    const { name, value } = event.target;
  
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    onUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Adicionar Tarefa
  const handleAddTarefa = () => {
    if (novaTarefa.trim() === "") {
      alert("Por favor, insira uma tarefa.");
      return;
    }

    const nova = {
      id: Date.now(),
      titulo: novaTarefa,
      //responsavel: "Responsável padrão",
      colaboradores: [],
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

    setTarefas((prev) => {
      const updatedTarefas = [...prev, nova];
      console.log("✅ Tarefas após adicionar nova tarefa:", updatedTarefas);
      return updatedTarefas;
    });

    setNovaTarefa(""); // Limpa o campo novaTarefa
  };

  console.log("✅ Tarefas finais antes de enviar para onUpdate:", tarefas);

  // 🔄 Sincroniza Tarefas com Estado Global
  const prevTarefasRef = useRef([]);

  useEffect(() => {
    if (JSON.stringify(prevTarefasRef.current) !== JSON.stringify(tarefas)) {
      console.log("🔄 Atualizando diretrizes com tarefas:", tarefas);

      onUpdate((prevState) => {
        if (!prevState?.diretrizes || !Array.isArray(prevState.diretrizes)) {
          console.error(
            "🚨 Estado de diretrizes inválido:",
            prevState?.diretrizes
          );
          return prevState; // Retorna sem modificar se diretrizes estiver inválido
        }

        return {
          ...prevState,
          diretrizes: prevState.diretrizes.map((diretriz) =>
            diretriz.id === diretrizID
              ? {
                  ...diretriz,
                  tarefas: Array.isArray(diretriz.tarefas)
                    ? [...diretriz.tarefas, ...tarefas]
                    : [...tarefas],
                }
              : diretriz
          ),
        };
      });

      prevTarefasRef.current = tarefas;
    }
  }, [tarefas, onUpdate, diretrizID]);

  // Temporário para depurar
  useEffect(() => {
    console.log("🔄 Estado atual de tarefas:", tarefas);
  }, [tarefas]);

  const handleDeleteTarefa = (id) => {
    const updatedTarefas = tarefas.filter((tarefa) => tarefa.id !== id);
    setTarefas(updatedTarefas);

    // Atualiza o estado global corretamente
    onUpdate((prev) => ({
      ...prev,
      diretrizes: prev.diretrizes.map((diretriz) =>
        diretriz.id === diretrizID
          ? { ...diretriz, tarefas: updatedTarefas }
          : diretriz
      ),
    }));
  };

  

  return (
    <>
      <Accordion
        sx={{
          boxShadow: "none", // Remove a sombra
          backgroundColor: "transparent",
        }}
      >
        <AccordionDetails>
          {/* Modal com o Alerta */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Dialog
              open={showAlert}
              onClose={() => setShowAlert(false)} // Permite fechar manualmente
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  backgroundColor: "transparent", // Remove o fundo branco
                  boxShadow: "none", // Remove a sombra
                },
              }}
            >
              <DialogContent>
                {console.log("Tarefa salva com sucesso!")}{" "}
                {/* Log no console */}
                <Alert severity="success" sx={{ borderRadius: "12px" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Tarefa salva com sucesso!
                  </Typography>
                </Alert>
              </DialogContent>
            </Dialog>
          </Box>

          <Box sx={{ marginLeft: "40px", paddingTop: "10px" }}>
            <Header
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <PlayCircleFilledWhiteIcon
                    sx={{ color: "#5f53e5", fontSize: 30 }}
                  />
                  <Typography>CADASTRAR TAREFAS PARA ESSA DIRETRIZ</Typography>
                </Box>
              }
            />
          </Box>

          {/* Formulário para criar nova tarefa */}
          <Box
            display="flex"
            alignItems="flex-start"
            gap={2}
            marginBottom="30px"
            sx={{
              marginLeft: "70px",
              marginRight: "60px",
              flexGrow: 1, // Permite que o Box principal cresça no espaço disponível
              flexWrap: "wrap", // Permite quebrar linha em telas menores
            }}
          >
            {/* Tarefas */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // Organiza verticalmente
                gap: 2, // Espaçamento entre elementos
                width: "100%",
              }}
            >
              {/* Adicionar tarefas */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <TextField
                  value={novaTarefa}
                  label="Digite uma tarefa..."
                  name="nome"
                  onChange={(e) => setNovaTarefa(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      position: "absolute",
                      top: "5px",
                      left: "5px",
                      fontSize: "15px",
                    },
                  }}
                />
                <AddCircleOutlineIcon
                  variant="contained"
                  onClick={handleAddTarefa}
                  sx={{ fontSize: 25, color: "#5f53e5" }}
                />
              </Box>

              {/* Lista de Tarefas */}
              <Box
                sx={{
                  marginTop: 2, // Espaço entre o botão e a lista
                  width: "100%",
                  maxHeight: "400px", // Altura máxima da lista (opcional)
                  overflowY: "auto", // Scroll vertical se exceder altura
                  backgroundColor: "#F9F9F9",
                  borderRadius: "5px",
                  padding: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <List>
                  {tarefas.map((tarefa) => (
                    <ListItem
                      key={tarefa.id}
                      sx={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        backgroundColor: "#FFF",
                        borderRadius: "8px",
                        marginBottom: "12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        position: "relative",
                      }}
                    >
                      {/* Título da Tarefa */}
                      <Box
                        value={formValues.nome}
                        onChange={handleChange}
                        sx={{
                          padding: "10px",
                          backgroundColor: "#EEE",
                          borderRadius: "5px",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>{tarefa.titulo}</Typography>
                        <Button
                          disableRipple
                          color="error"
                          onClick={() => handleDeleteTarefa(tarefa.id)}
                          sx={{
                            minWidth: "40px",
                            padding: "5px",
                            border: "none",
                            backgroundColor: "transparent",
                            "&:hover": { backgroundColor: "transparent" },
                          }}
                        >
                          <DeleteForeverIcon sx={{ fontSize: 24 }} />
                        </Button>
                      </Box>

                      {/* Seletor de Colaboradores */}
                      <Box sx={{ width: "100%" }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ marginBottom: "8px" }}
                        >
                          Colaboradores
                        </Typography>
                        <Select
                          multiple
                          name="colaboradores"
                          value={formValues.colaboradores || []}
                          onChange={handleSelectChange}
                          displayEmpty
                          sx={{
                            flex: "1 1 calc(33.33% - 16px)",
                            minWidth: "200px",
                          }}
                          renderValue={(selected) =>
                            selected.length === 0
                              ? "Selecione colaboradores"
                              : selected
                                  .map(
                                    (id) =>
                                      users.find((user) => user.id === id)
                                        ?.username || "Desconhecido"
                                  )
                                  .join(", ")
                          }
                        >
                          {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                              <Checkbox
                                checked={formValues.colaboradores.includes(
                                  user.id
                                )}
                              />
                              <ListItemText primary={user.username} />
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>

                      {/* Plano de Ação (5W2H) */}
                      <Box
                        sx={{
                          width: "100%",
                          marginTop: "16px",
                          padding: "10px",
                          backgroundColor: "#F9F9F9",
                          borderRadius: "5px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          marginBottom="12px"
                        >
                          <PlayCircleFilledWhiteIcon
                            sx={{ color: "#5f53e5", fontSize: 30 }}
                          />
                          <Typography sx={{ color: "#949393" }}>
                            CADASTRAR PLANO DE AÇÃO (5W2H) PARA ESSA TAREFA
                          </Typography>
                        </Box>

                        {/* Linha 1: O Que e Por Que */}
                        <Box display="flex" gap={2} marginBottom="8px">
                          <TextField
                            label="O que"
                            placeholder="Descreva o que deve ser feito"
                            fullWidth
                            variant="outlined"
                            value={tarefa.planoDeAcao.oQue}
                            onChange={(e) => {
                              const value = e.target.value;
                              setTarefas((prev) =>
                                prev.map((t) =>
                                  t.id === tarefa.id
                                    ? {
                                        ...t,
                                        planoDeAcao: {
                                          ...t.planoDeAcao,
                                          oQue: value,
                                        },
                                      }
                                    : t
                                )
                              );
                            }}
                          />
                          <TextField
                            label="Por que"
                            placeholder="Justificativa do que será feito"
                            fullWidth
                            variant="outlined"
                            value={tarefa.planoDeAcao.porQue}
                            onChange={(e) => {
                              const value = e.target.value;
                              setTarefas((prev) =>
                                prev.map((t) =>
                                  t.id === tarefa.id
                                    ? {
                                        ...t,
                                        planoDeAcao: {
                                          ...t.planoDeAcao,
                                          porQue: value,
                                        },
                                      }
                                    : t
                                )
                              );
                            }}
                          />
                        </Box>

                        {/* Quem */}
                        <Box display="flex" gap={2} marginBottom="8px">
                          {/* Quem */}
                          {/* Quem */}
                          <Box sx={{ flex: 1 }}>
                            <Select
                              multiple
                              name={`quem-${tarefa.id}`}
                              value={tarefa.planoDeAcao?.quem || []}
                              onChange={(event) => {
                                const value = event.target.value;
                                setTarefas((prev) =>
                                  prev.map((t) =>
                                    t.id === tarefa.id
                                      ? {
                                          ...t,
                                          planoDeAcao: {
                                            ...t.planoDeAcao,
                                            quem: Array.isArray(value)
                                              ? value
                                              : [value],
                                          },
                                        }
                                      : t
                                  )
                                );
                              }}
                              displayEmpty
                              fullWidth
                              sx={{
                                backgroundColor: "#FFF",
                                borderRadius: "5px",
                                minHeight: "56px",
                              }}
                              renderValue={(selected) => {
                                if (!selected || selected.length === 0) {
                                  return "Quem...";
                                }
                                return selected
                                  .map((id) => {
                                    const user = users.find(
                                      (user) => user.id === id
                                    );
                                    return user
                                      ? user.username
                                      : "Desconhecido";
                                  })
                                  .join(", ");
                              }}
                            >
                              {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                  <Checkbox
                                    checked={(
                                      tarefa.planoDeAcao?.quem || []
                                    ).includes(user.id)}
                                  />
                                  <ListItemText primary={user.username} />
                                </MenuItem>
                              ))}
                            </Select>
                          </Box>

                          {/* Quando */}
                          {/* Quando */}
                          {/* Quando */}
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              label="Quando"
                              placeholder="Período de execução"
                              fullWidth
                              variant="outlined"
                              value={tarefa.planoDeAcao?.quando || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setTarefas((prev) =>
                                  prev.map((t) =>
                                    t.id === tarefa.id
                                      ? {
                                          ...t,
                                          planoDeAcao: {
                                            ...t.planoDeAcao,
                                            quando: value,
                                          },
                                        }
                                      : t
                                  )
                                );
                              }}
                              sx={{
                                minHeight: "56px",
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Linha 3: Onde e Como */}
                        <Box display="flex" gap={2} marginBottom="8px">
                          {/* Onde */}
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              label="Onde"
                              placeholder="Local onde será executada"
                              fullWidth
                              variant="outlined"
                              value={tarefa.planoDeAcao.onde}
                              onChange={(e) => {
                                const value = e.target.value;
                                setTarefas((prev) =>
                                  prev.map((t) =>
                                    t.id === tarefa.id
                                      ? {
                                          ...t,
                                          planoDeAcao: {
                                            ...t.planoDeAcao,
                                            onde: value,
                                          },
                                        }
                                      : t
                                  )
                                );
                              }}
                              sx={{
                                minHeight: "56px",
                              }}
                            />
                          </Box>

                          {/* Como */}
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              label="Como"
                              placeholder="Metodologia de execução"
                              fullWidth
                              variant="outlined"
                              value={tarefa.planoDeAcao.como}
                              onChange={(e) => {
                                const value = e.target.value;
                                setTarefas((prev) =>
                                  prev.map((t) =>
                                    t.id === tarefa.id
                                      ? {
                                          ...t,
                                          planoDeAcao: {
                                            ...t.planoDeAcao,
                                            como: value,
                                          },
                                        }
                                      : t
                                  )
                                );
                              }}
                              sx={{
                                minHeight: "56px",
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Linha 4: Valor */}
                        <Box display="flex" marginBottom="8px">
                          <TextField
                            label="Digite o valor do orçamento para essa tarefa..."
                            name="valor"
                            value={tarefa.planoDeAcao.valor}
                            onChange={(e) => {
                              const valor = e.target.value;
                              const onlyNumbers = valor.replace(/[^\d]/g, "");
                              const formattedValue = new Intl.NumberFormat(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              ).format(onlyNumbers / 100);

                              setTarefas((prev) =>
                                prev.map((t) =>
                                  t.id === tarefa.id
                                    ? {
                                        ...t,
                                        planoDeAcao: {
                                          ...t.planoDeAcao,
                                          valor: formattedValue,
                                        },
                                      }
                                    : t
                                )
                              );
                            }}
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                position: "absolute",
                                top: "5px",
                                left: "5px",
                              },
                            }}
                            sx={{
                              minHeight: "56px",
                            }}
                          />
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default DiretrizData;
