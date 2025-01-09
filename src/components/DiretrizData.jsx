import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  ListItemText,
  Typography,
  Button,
  TextField,
  MenuItem,
  Divider,
  List,
  Select,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { getFirestore, getDocs, collection } from "firebase/firestore";

/**
 * DiretrizData
 *
 * Recebe:
 *   - diretriz (objeto) => { id, titulo, descricao, tarefas: [...] }
 *   - onUpdate(diretrizAtualizada) => callback p/ devolver nova diretriz
 */
const DiretrizData = ({ diretriz, onUpdate, LimpaEstado }) => {
  const [users, setUsers] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState("");

  // Tarefas vêm diretamente de diretriz.tarefas
  const tarefas = diretriz?.tarefas || [];

  // Adicionar Tarefa
  const handleAddTarefa = () => {
    if (!novaTarefa.trim()) {
      alert("Digite uma tarefa!");
      return;
    }

    const nova = {
      id: Date.now(),
      titulo: novaTarefa,
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

    const updatedTarefas = [...tarefas, nova];

    // Devolve a diretriz atualizada para o pai
    onUpdate({
      ...diretriz,
      tarefas: updatedTarefas,
    });

    setNovaTarefa("");
  };

  // Remover Tarefa
  const handleDeleteTarefa = (taskId) => {
    const updatedTarefas = tarefas.filter((t) => t.id !== taskId);
    onUpdate({
      ...diretriz,
      tarefas: updatedTarefas,
    });
  };

  // Alterar campo do planoDeAcao (5W2H)
  const handleChangePlano = (taskId, campo, valor) => {
    const updatedTarefas = tarefas.map((t) =>
      t.id === taskId
        ? {
            ...t,
            planoDeAcao: {
              ...t.planoDeAcao,
              [campo]: valor,
            },
          }
        : t
    );

    onUpdate({
      ...diretriz,
      tarefas: updatedTarefas,
    });
  };

 
  // Carregar usuários do Firebase
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const db = getFirestore();
          const querySnapshot = await getDocs(collection(db, "user"));
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

      // Monitorando a mensagem para limpar os inputs
        useEffect(() => {
          if (LimpaEstado) {

    onUpdate({
      ...diretriz,
      tarefas: [],
    });
          }
        }, [LimpaEstado]);

  return (
    <Box>
      {/* Campo para digitar nova tarefa */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Digite uma tarefa..."
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          fullWidth
        />
        <Button onClick={handleAddTarefa} sx={{ minWidth: "40px" }}>
          <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#5f53e5" }} />
        </Button>
      </Box>

      {/* Lista de tarefas já existentes */}
      <List>
        {tarefas.map((t) => (
          <Box
            key={t.id}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "8px",
              backgroundColor: "#fff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#5f53e5" }}
              >
                {t.titulo}
              </Typography>

              
              <Button
                onClick={() => handleDeleteTarefa(t.id)}
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
              {/* Divider */}
            <Divider
                sx={{
                  marginTop: "70px",
                  marginBottom: "8px",
                  position: "absolute", // Para garantir que o ícone fique sobre o divisor
                  maxwidth: "96%",
                  minWidth: "96%",
                  height: "1px",
                  backgroundColor: "#ccc", // Cor do divisor
                }}
              />
            </Box>

            {/* Seção: 5W2H  */}

            <Box display="flex" alignItems="center" mb={1} sx={{ marginBottom: "40px", marginTop: "40px" }}>
                    <PlayCircleFilledWhiteIcon
                      sx={{ color: "#5f53e5", fontSize: 25, marginRight: 1 }}
                    />
                    <Typography variant="h6">Plano de Ação (5W2H)</Typography>
                  </Box>

            {/* 5W2H (exemplo simplificado) */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, marginTop:"50px" }}>
              <TextField
                label="O que?"
                value={t.planoDeAcao.oQue}
                onChange={(e) =>
                  handleChangePlano(t.id, "oQue", e.target.value)
                }
              />
              <TextField
                label="Por que?"
                value={t.planoDeAcao.porQue}
                onChange={(e) =>
                  handleChangePlano(t.id, "porQue", e.target.value)
                }
              />

              {/* Quem... (múltipla seleção) */}
              <Select
                multiple
                value={t.planoDeAcao.quem || []}
                // Atualiza "quem" diretamente no state de tarefas
                onChange={(event) =>
                  handleChangePlano(t.id, "quem", event.target.value)
                }
                displayEmpty
                sx={{
                  flex: "1 1 calc(33.33% - 16px)",
                  minWidth: "200px",
                  backgroundColor: "#fff",
                }}
                renderValue={(selected) =>
                  selected.length === 0
                    ? "Quem..."
                    : selected
                        .map(
                          (id) =>
                            users.find((user) => user.id === id)?.username ||
                            "Desconhecido"
                        )
                        .join(", ")
                }
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox
                      checked={t.planoDeAcao.quem?.includes(user.id) || false}
                    />
                    <ListItemText primary={user.username} />
                  </MenuItem>
                ))}
              </Select>

              <TextField
                label="Quando?"
                value={t.planoDeAcao.quando}
                onChange={(e) =>
                  handleChangePlano(t.id, "quando", e.target.value)
                }
              />
              <TextField
                label="Onde?"
                value={t.planoDeAcao.onde}
                onChange={(e) =>
                  handleChangePlano(t.id, "onde", e.target.value)
                }
              />
              <TextField
                label="Como?"
                value={t.planoDeAcao.como}
                onChange={(e) =>
                  handleChangePlano(t.id, "como", e.target.value)
                }
              />

              {/** CAMPO VALOR  */}

              <TextField
                label="Valor"
                value={t.planoDeAcao.valor}
                onChange={(e) => {
                  // 1. pegar o valor cru do input
                  const rawValue = e.target.value;

                  // 2. remover tudo que não seja dígito
                  const onlyNumbers = rawValue.replace(/[^\d]/g, ""); // ex: "1000"

                  // 3. formatar como moeda (Ex.: R$ 10,00)
                  const formattedValue = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(onlyNumbers) / 100);

                  // 4. chamar a função que altera o state de tarefas/diretriz
                  handleChangePlano(t.id, "valor", formattedValue);
                }}
              />
            </Box>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default DiretrizData;
