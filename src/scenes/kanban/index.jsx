import React, { useState, useEffect } from "react";
import { Box, Typography, ListItemText, Checkbox, Button, TextField, Modal, Select, MenuItem, IconButton, Divider } from "@mui/material";
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { Header } from "../../components";
import { dbFokus360, storageFokus360 } from "../../data/firebase-config";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


import { authFokus360 } from "../../data/firebase-config";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const Kanban = () => {
  const [columns, setColumns] = useState([
    { id: 1, title: "Pendente", cards: [] },
    { id: 2, title: "Recebido", cards: [] },
    { id: 3, title: "Em execução", cards: [] },
    { id: 5, title: "Concluído", cards: [] },
  ]);


  const [users, setUsers] = useState([]); // ✅ Agora a variável users está definida
  const [draggingCard, setDraggingCard] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    nome: "",
    departamento: "",
    assunto: "",
    dataCriacao: "",
    dataFinalizacao: "",
    colaboradores: [],
    responsavel: "",
    prioridade: "medium",
  });

  const [formValues, setFormValues] = useState({
    
  
      colaboradores: [],
     
    });

  const kanbanCollection = collection(dbFokus360, "kanbanCards");

  useEffect(() => {
    const fetchCards = async () => {
      const querySnapshot = await getDocs(kanbanCollection);
      const cardsFromFirestore = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const updatedColumns = columns.map((column) => ({
        ...column,
        cards: cardsFromFirestore.filter((card) => card.columnId === column.id),
      }));

      setColumns(updatedColumns);
    };

    fetchCards();
  }, []);

  const handleAddCard = async () => {
    const newCardWithColumn = { ...newCard, columnId: 1 };
    try {
      const docRef = await addDoc(kanbanCollection, newCardWithColumn);
      const updatedColumns = columns.map((col) =>
        col.id === 1
          ? { ...col, cards: [...col.cards, { ...newCardWithColumn, id: docRef.id }] }
          : col
      );

      setColumns(updatedColumns);
      setNewCard({
        nome: "",
        departamento: "",
        assunto: "",
        dataCriacao: "",
        dataFinalizacao: "",
        colaboradores: [],
        responsavel: "",
        prioridade: "medium",
      });
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar o cartão:", error);
    }
  };

  const handleDeleteCard = async (cardId, columnId) => {
    try {
      await deleteDoc(doc(dbFokus360, "kanbanCards", cardId));
      const updatedColumns = columns.map((column) =>
        column.id === columnId
          ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
          : column
      );
      setColumns(updatedColumns);
    } catch (error) {
      console.error("Erro ao excluir cartão:", error);
    }
  };

  const handleDragStart = (card, columnId) => setDraggingCard({ card, columnId });
  const handleDragEnd = () => setDraggingCard(null);
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (targetColumnId) => {
    if (!draggingCard) return;

    const { card, columnId: sourceColumnId } = draggingCard;

    try {
      const cardDocRef = doc(dbFokus360, "kanbanCards", card.id);
      await updateDoc(cardDocRef, { columnId: targetColumnId });

      const updatedColumns = columns.map((column) => {
        if (column.id === sourceColumnId) {
          return { ...column, cards: column.cards.filter((c) => c.id !== card.id) };
        }
        if (column.id === targetColumnId) {
          return { ...column, cards: [...column.cards, { ...card, columnId: targetColumnId }] };
        }
        return column;
      });

      setColumns(updatedColumns);
      setDraggingCard(null);
    } catch (error) {
      console.error("Erro ao mover o cartão:", error);
    }
  };

  const badgeStyle = (priority) => ({
    backgroundColor:
      priority === "high"
        ? "#d573b6"
        : priority === "medium"
        ? "#fea065"
        : "#92a5fb",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    display: "inline-block",
    marginBottom: "10px",
  });

  const getColumnBorderColor = (columnId) => {
    switch (columnId) {
      case 1:
        return "#f87171";
      case 2:
        return "#60a5fa";
      case 3:
        return "#fbbf24";
      case 5:
        return "#34d399";
      default:
        return "#d1d5db";
    }
  };








// Carregar usuários do Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        
        const querySnapshot = await getDocs(collection(dbFokus360, "user")); // ✅ Agora está correto

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
              <AssignmentTurnedInIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
              <Typography>GERENCIADOR DE TAREFAS</Typography>
            </Box>
          }
        />
      </Box>

      <Box
        sx={{
          marginLeft: "40px",
          marginTop: "-15px",
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
        <Box display="flex" alignItems="center" gap={1}>
          <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
          <Typography color="#858585">
            Adicione tarefas no painel de gerenciamento
          </Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginBottom: "30px",
            marginTop: "15px",
          }}
        >
          <Divider
            sx={{
              position: "absolute",
              width: "100%",
              height: "1px",
              backgroundColor: "#ccc",
            }}
          />
        </Box>

        <Modal
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          width="100%"
        >
          <Box sx={modalStyle}>
            <Typography
              variant="h5"
              mb={2}
              backgroundColor="#5f53e5"
              padding="10px"
              borderRadius="10px"
              color="white"
            >
              Adicionar Novo Cartão
            </Typography>
            <TextField
              fullWidth
              label="Título da tarefa:"
              value={newCard.nome}
              onChange={(e) => setNewCard({ ...newCard, nome: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Solicitante:"
              value={newCard.departamento}
              onChange={(e) =>
                setNewCard({ ...newCard, departamento: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Descrição da tarefa:"
              value={newCard.assunto}
              onChange={(e) =>
                setNewCard({ ...newCard, assunto: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Data de Criação"
              type="date"
              value={newCard.dataCriacao}
              onChange={(e) =>
                setNewCard({ ...newCard, dataCriacao: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Data de Finalização"
              type="date"
              value={newCard.dataFinalizacao}
              onChange={(e) =>
                setNewCard({ ...newCard, dataFinalizacao: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            {/* Colaboradores (múltipla seleção) */}
           
            <Select
  multiple
  fullWidth
  name="colaboradores"
  value={newCard.colaboradores}
  onChange={(e) => {
    // Atualizando corretamente os nomes dos usuários no estado
    const selectedUsers = e.target.value.map((id) => {
      const user = users.find((user) => user.id === id);
      return user ? user.username : id; // Se não encontrar, mantém o ID
    });

    setNewCard({ ...newCard, colaboradores: selectedUsers });
  }}
  displayEmpty
  sx={{ width: "100%", mb: 2 }} // ✅ Adicionada margin-bottom
  renderValue={(selected) =>
    selected.length === 0 ? "Selecione responsáveis pela tarefa" : selected.join(", ")
  }
>
  {users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      <Checkbox checked={newCard.colaboradores.includes(user.username)} />
      <ListItemText primary={user.username} />
    </MenuItem>
  ))}
</Select>


           
            
            <Select
              fullWidth
              value={newCard.prioridade}
              onChange={(e) =>
                setNewCard({ ...newCard, prioridade: e.target.value })
              }
              sx={{ mb: 2 }}
            >
              <MenuItem value="low">Baixa Prioridade</MenuItem>
              <MenuItem value="medium">Média Prioridade</MenuItem>
              <MenuItem value="high">Alta Prioridade</MenuItem>
            </Select>
            <Button
              variant="contained"
              onClick={handleAddCard}
              fullWidth
              sx={{
                marginBottom: "15px",
                backgroundColor: "#5f53e5",
                color: "#ffffff",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#3f2cb2",
                  boxShadow: "none",
                },
              }}
            >
              Adicionar
            </Button>
          </Box>
        </Modal>

        <Box sx={kanbanStyle}>
          {columns.map((column) => (
            <Box
              key={column.id}
              sx={{
                ...columnStyle,
                borderTop: `5px solid ${getColumnBorderColor(column.id)}`,
              }}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <Typography variant="h6" sx={{ mb: 3 }}>
                {column.title}
              </Typography>
              {column.id === 1 && (
                <Button
                  variant="contained"
                  onClick={() => setModalOpen(true)}
                  sx={{
                    boxShadow: "none",
                    marginBottom: "15px",
                    backgroundColor: "#5f53e5",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#3f2cb2",
                      boxShadow: "none",
                    },
                  }}
                >
                  Adicionar cartão
                </Button>
              )}
              <Box sx={cardContainerStyle}>
  {column.cards.map((card) => (
    <Accordion
      key={card.id}
      sx={cardStyle}
      draggable
      onDragStart={(e) => {
        handleDragStart(card, column.id);
        e.stopPropagation(); // Evita conflitos no drag
      }}
      onDragEnd={handleDragEnd}
    >
      {/* Cabeçalho do Accordion (Agora arrastável) */}
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        draggable
        onDragStart={(e) => {
          handleDragStart(card, column.id);
          e.stopPropagation();
        }}
        onDragEnd={handleDragEnd}
      >
        <Typography variant="body2">
          <strong>Tarefa:</strong> {card.nome}
        </Typography>
      </AccordionSummary>

      {/* Detalhes do Accordion (mantendo todos os elementos) */}
      <AccordionDetails>
        <Box>
          <Box sx={badgeStyle(card.prioridade)}>
            {card.prioridade === "high"
              ? "Alta Prioridade"
              : card.prioridade === "medium"
              ? "Média Prioridade"
              : "Baixa Prioridade"}
          </Box>
          <Typography variant="body2">
            <strong>Departamento:</strong> {card.departamento}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
            color="#565454"
            backgroundColor="#ccc9c9"
            padding="10px"
            borderRadius="7px"
          >
            {card.assunto}
          </Typography>
          <Typography variant="body2">
            <strong>Responsáveis:</strong> {card.colaboradores.join(", ")}
          </Typography>
          <Typography variant="body2">
            <strong>Data de Criação:</strong> {card.dataCriacao}
          </Typography>
          <Typography variant="body2">
            <strong>Data de Finalização:</strong> {card.dataFinalizacao}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <IconButton
              onClick={() => handleDeleteCard(card.id, column.id)}
              sx={{
                color: "#d32f2f",
                padding: "0px",
              }}
            >
              <DeleteForeverSharpIcon sx={{ fontSize: "30px" }} />
            </IconButton>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  ))}
</Box>

              
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

const kanbanStyle = {
  display: "flex",
  overflowX: "auto",
  overflowY: "hidden",
  marginBottom: "50px",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  flex: "1 1 280px", // Flexibilidade com largura mínima
  padding: "16px", // Substituindo 'p' para consistência
  margin: "3px", // Espaçamento entre colunas
  bgcolor: "#e8e9ea",
  borderRadius: "10px",
  minWidth: "100px", // Largura mínima
  maxWidth: "100%", // Garante que a largura máxima não ultrapasse o contêiner
};


const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  width: "100%",
};
const cardStyle = {
  p: 2,
  bgcolor: "#fff",
  borderRadius: "10px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
};


export default Kanban;
