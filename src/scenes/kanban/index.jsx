import React, { useState } from "react";
import { Box, Typography, Button, TextField, Modal, Select, MenuItem } from "@mui/material";
import { Header } from "../../components"; // Ajuste o caminho do componente Header
import { Height } from "@mui/icons-material";

const Kanban = () => {
  const [columns, setColumns] = useState([
    { id: 1, title: "Pendente", cards: [] },
    { id: 2, title: "Recebido", cards: [] },
    { id: 3, title: "Em execução", cards: [] },
    { id: 4, title: "Finalizando", cards: [] },
    { id: 5, title: "Concluído", cards: [] },
  ]);

  const [draggingCard, setDraggingCard] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    nome: "",
    departamento: "",
    assunto: "",
    dataCriacao: "",
    dataFinalizacao: "",
    responsavel: "",
    prioridade: "medium",
  });

  // Adicionar card
  const handleAddCard = () => {
    const updatedColumns = columns.map((col) =>
      col.id === 1
        ? { ...col, cards: [...col.cards, { ...newCard, id: Date.now() }] }
        : col
    );

    setColumns(updatedColumns);
    setNewCard({
      nome: "",
      departamento: "",
      assunto: "",
      dataCriacao: "",
      dataFinalizacao: "",
      responsavel: "",
      prioridade: "medium",
    });
    setModalOpen(false);
  };

  // Drag-and-Drop
  const handleDragStart = (card, columnId) => setDraggingCard({ card, columnId });
  const handleDragEnd = () => setDraggingCard(null);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (targetColumnId) => {
    if (!draggingCard) return;

    const { card, columnId: sourceColumnId } = draggingCard;

    const updatedColumns = columns.map((column) => {
      if (column.id === sourceColumnId) {
        return { ...column, cards: column.cards.filter((c) => c.id !== card.id) };
      }
      if (column.id === targetColumnId) {
        return { ...column, cards: [...column.cards, card] };
      }
      return column;
    });

    setColumns(updatedColumns);
    setDraggingCard(null);
  };

  // Badge Style
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

  return (
    <Box sx={{ marginLeft: "30px", paddingTop: "50px" }}>
      <Header
        title="GERENCIADOR DE TAREFAS"
        subtitle="Organize tarefas para toda a equipe e acompanhe seu progresso"
      />

      {/* Modal */}
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" mb={2}
            sx={{
              padding: "10px",
              marginBottom: "15px",
              backgroundColor: "#5f53e5",
              color: "#ffffff",
              boxShadow: "none",
              borderRadius: "5px",
            }}
          >
            Adicionar Novo cartão
          </Typography>
          <TextField
            fullWidth
            label="Nome"
            value={newCard.nome}
            onChange={(e) => setNewCard({ ...newCard, nome: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Departamento"
            value={newCard.departamento}
            onChange={(e) => setNewCard({ ...newCard, departamento: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Assunto"
            value={newCard.assunto}
            onChange={(e) => setNewCard({ ...newCard, assunto: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Data de Criação"
            type="date"
            value={newCard.dataCriacao}
            onChange={(e) => setNewCard({ ...newCard, dataCriacao: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Data de Finalização"
            type="date"
            value={newCard.dataFinalizacao}
            onChange={(e) => setNewCard({ ...newCard, dataFinalizacao: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Responsável"
            value={newCard.responsavel}
            onChange={(e) => setNewCard({ ...newCard, responsavel: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Select
            fullWidth
            value={newCard.prioridade}
            onChange={(e) => setNewCard({ ...newCard, prioridade: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="low">Baixa Prioridade</MenuItem>
            <MenuItem value="medium">Média Prioridade</MenuItem>
            <MenuItem value="high">Alta Prioridade</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={handleAddCard} fullWidth
            sx={{
              borderRadius: "5px",
              marginBottom: "15px",
              backgroundColor: "#5f53e5",
              color: "#ffffff",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#583cff", boxShadow: "none" },
            }}
          >
            Adicionar
          </Button>
        </Box>
      </Modal>

      {/* Kanban */}
      <Box sx={kanbanStyle}>
        {columns.map((column) => (
          <Box
            key={column.id}
            sx={columnStyle}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "#4b5563" }}>
              {column.title}
            </Typography>

            {column.id === 1 && (
              <Button
                variant="contained"
                sx={{
                  marginBottom: "15px",
                  backgroundColor: "#5f53e5",
                  color: "#ffffff",
                  boxShadow: "none",
                  "&:hover": { backgroundColor: "#583cff", boxShadow: "none" },
                }}
                onClick={() => setModalOpen(true)}
              >
                Adicionar cartão
              </Button>
            )}

            <Box sx={cardContainerStyle}>
              {column.cards.map((card) => (
                <Box
                  key={card.id}
                  sx={cardStyle}
                  draggable
                  onDragStart={() => handleDragStart(card, column.id)}
                  onDragEnd={handleDragEnd}
                >
                  <Box sx={badgeStyle(card.prioridade)}>
                    {card.prioridade === "high"
                      ? "Alta Prioridade"
                      : card.prioridade === "medium"
                      ? "Média Prioridade"
                      : "Baixa Prioridade"}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {card.assunto}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nome:</strong> {card.nome}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Departamento:</strong> {card.departamento}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Responsável:</strong> {card.responsavel}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Data de Criação:</strong> {card.dataCriacao}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Data de Finalização:</strong> {card.dataFinalizacao}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      marginTop: "15px",
                      backgroundColor: "#dc2626",
                      color: "white",
                      borderRadius: "5px",
                      border: "none",
                      marginLeft: "55%",
                      "&:hover": { backgroundColor: "#d33f3f", border: "none" },
                    }}
                      onClick={() =>
                        setColumns((prevColumns) =>
                          prevColumns.map((col) =>
                            col.id === column.id
                              ? { ...col, cards: col.cards.filter((c) => c.id !== card.id) }
                              : col
                          )
                        )
                      }
                  >
                    Excluir
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};




const kanbanStyle = {
  display: "flex",
  gap: 2,
  overflowX: "auto",
  overflowY: "hidden",
  width: "100%",
  mt: 4,
  paddingBottom: "16px",
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
  minWidth: "200px",
  maxWidth: "200px",
  Height: "auto",
  flexShrink: 0,
  p: 2,
  bgcolor: "#ededed",
  borderRadius: "10px",
  boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

const cardStyle = {
  p: 2,
  bgcolor: "#fff",
  borderRadius: "10px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  cursor: "grab",
};

export default Kanban;
