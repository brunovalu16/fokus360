import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  ListItemText,
  Typography,
  Button,
  TextField,
  MenuItem,
  List,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getFirestore, getDocs, collection } from "firebase/firestore";

const DiretrizData = ({ diretriz, LimpaEstado }) => {
  const [users, setUsers] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [tarefasLocais, setTarefasLocais] = useState(diretriz?.tarefas || []); // 🔹 Inicia com as tarefas existentes

  // 🔹 Carregar usuários do Firebase
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

  // 🔹 Monitorar `LimpaEstado` e resetar tarefas locais se necessário
  useEffect(() => {
    if (LimpaEstado) {
      setTarefasLocais([]);
      setNovaTarefa("");
    }
  }, [LimpaEstado]);















  const handleEditTarefa = (tarefaId, campo, valor) => {
    setTarefasLocais((prevTarefas) => {
        const atualizadas = prevTarefas.map((t) =>
            t.id === tarefaId
                ? { ...t, planoDeAcao: { ...t.planoDeAcao, [campo]: valor } }
                : t
        );

        console.log("📌 Atualizando tarefa no plano de ação e enviando para BaseDiretriz:", JSON.stringify(atualizadas, null, 2));

        if (typeof onUpdate === "function") {
            onUpdate({
                ...diretriz,
                tarefas: atualizadas,  // **✅ Agora enviamos corretamente as tarefas para BaseDiretriz**
            });
        }

        return atualizadas;
    });
};






const handleAddTarefa = () => {
    if (!novaTarefa.trim()) {
        alert("Nome do plano de ação...");
        return;
    }

    const nova = {
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

    setTarefasLocais((prevTarefas) => {
        const atualizadas = [...prevTarefas, nova];

        console.log("📌 DiretrizData enviando tarefas para BaseDiretriz:", JSON.stringify(atualizadas, null, 2));

        if (typeof onUpdate === "function") {
            onUpdate({
                ...diretriz,
                tarefas: atualizadas, // 🔥 Atualizando corretamente em BaseDiretriz
            });
        }

        return atualizadas;
    });

    setNovaTarefa("");
};


























  return (
    <Box>
      {/* 🔹 Campo para adicionar nova tarefa */}
      <Box sx={{ display: "flex", gap: 1, marginBottom: "20px" }}>
        <TextField
          label="Nome do Plano de ação..."
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          fullWidth
        />
        <Button onClick={handleAddTarefa} sx={{ minWidth: "40px" }}>
          <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#f44336" }} />
        </Button>
      </Box>

      {/* 🔹 Lista de tarefas locais */}
      {tarefasLocais.length > 0 && (
        <List>
          {tarefasLocais.map((t) => (
            <Accordion
              key={t.id}
              sx={{ backgroundColor: "#fff", marginBottom: "8px", borderRadius: "8px" }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#f9f9f9" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#f44336", flex: 1 }}>
                  {t.tituloTarefa}
                </Typography>

                {/* 🔹 Botão de deletar */}
                <Button
                  onClick={() =>
                    setTarefasLocais((prevTarefas) => prevTarefas.filter((task) => task.id !== t.id))
                  }
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
                <Box display="flex" alignItems="center" mb={1} sx={{ marginBottom: "20px", marginTop: "10px" }}>
                  <PlayCircleFilledWhiteIcon sx={{ color: "#f44336", fontSize: 25, marginRight: 1 }} />
                  <Typography variant="h6">Plano de Ação (5W2H)</Typography>
                </Box>

                {/* 🔹 Campos do 5W2H */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <TextField
                    label="O que?"
                    value={t.planoDeAcao.oQue || ""}
                    onChange={(e) => handleEditTarefa(t.id, "oQue", e.target.value)}
                  />

                  <TextField
                    label="Por que?"
                    value={t.planoDeAcao.porQue || ""}
                    onChange={(e) => handleEditTarefa(t.id, "porQue", e.target.value)}
                  />

                  {/* 🔹 Campo "Quem" com múltipla seleção */}
                  <Select
                    multiple
                    value={t.planoDeAcao.quem || []}
                    onChange={(event) => handleEditTarefa(t.id, "quem", event.target.value)}
                    displayEmpty
                    sx={{ minWidth: "200px", backgroundColor: "#fff" }}
                    renderValue={(selected) =>
                      selected.length === 0
                        ? "Quem..."
                        : selected.map((id) => users?.find((user) => user.id === id)?.username || "Desconhecido").join(", ")
                    }
                  >
                    {users?.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <Checkbox checked={t.planoDeAcao.quem?.includes(user.id) || false} />
                        <ListItemText primary={user.username} />
                      </MenuItem>
                    ))}
                  </Select>

                  <TextField
                    label="Quando?"
                    value={t.planoDeAcao.quando || ""}
                    onChange={(e) => handleEditTarefa(t.id, "quando", e.target.value)}
                  />
                  <TextField
                    label="Onde?"
                    value={t.planoDeAcao.onde || ""}
                    onChange={(e) => handleEditTarefa(t.id, "onde", e.target.value)}
                  />
                  <TextField
                    label="Como?"
                    value={t.planoDeAcao.como || ""}
                    onChange={(e) => handleEditTarefa(t.id, "como", e.target.value)}
                  />

                  {/* 🔹 Campo Valor Formatado */}
                  <TextField
                    label="Valor"
                    value={t.planoDeAcao.valor || ""}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      const formattedValue = new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(rawValue) / 100);
                      handleEditTarefa(t.id, "valor", formattedValue);
                    }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      )}
    </Box>
  );
};

export default DiretrizData;
