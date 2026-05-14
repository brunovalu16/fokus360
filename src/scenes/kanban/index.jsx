import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Box,
  Typography,
  ListItemText,
  Checkbox,
  Button,
  TextField,
  Modal,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Paper,
  Chip,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";

import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlagIcon from "@mui/icons-material/Flag";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";

import { dbFokus360, authFokus360 } from "../../data/firebase-config";
import { NotificationContext } from "../../context/NotificationContext";

const initialColumns = [
  { id: 1, title: "Pendente", cards: [] },
  { id: 2, title: "Recebido", cards: [] },
  { id: 3, title: "Em execução", cards: [] },
  { id: 4, title: "Em aprovação", cards: [] },
  { id: 5, title: "Concluído", cards: [] },
];

const filtrosNivel = [
  { value: "01", label: "Diretoria" },
  { value: "02", label: "Gerente" },
  { value: "03", label: "Supervisor" },
  { value: "04", label: "Vendedor" },
  { value: "06", label: "Indústria" },
  { value: "07", label: "Projetos" },
  { value: "08", label: "Admin" },
  { value: "09", label: "Coordenador Trade" },
  { value: "10", label: "Gerência Trade" },
  { value: "11", label: "Analista Trade" },
];

const priorityConfig = {
  low: { label: "Baixa Prioridade", color: "#6b84f3" },
  medium: { label: "Média Prioridade", color: "#fc7f32" },
  high: { label: "Alta Prioridade", color: "#ce2d9b" },
};

const Kanban = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [allCards, setAllCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loggedUserName, setLoggedUserName] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [selectedDateFinished, setSelectedDateFinished] = useState("");
  const [selectedDateCreated, setSelectedDateCreated] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [draggingCard, setDraggingCard] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const { setNotifications } = useContext(NotificationContext);

  const [newCard, setNewCard] = useState({
    nome: "",
    departamento: "",
    assunto: "",
    dataCriacao: new Date().toISOString().slice(0, 10),
    dataFinalizacao: "",
    colaboradores: [],
    responsavel: "",
    prioridade: "medium",
    email: "",
  });

  const kanbanCards = collection(dbFokus360, "kanbanCards");

  const getColumnBorderColor = (columnId) => {
    switch (columnId) {
      case 1:
        return "#f87171";
      case 2:
        return "#60a5fa";
      case 3:
        return "#fbbf24";
      case 4:
        return "#a78bfa";
      case 5:
        return "#34d399";
      default:
        return "#94a3b8";
    }
  };

  const corrigirRolesNoFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(dbFokus360, "kanbanCards"));

      await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

          if (data.role === "default" || !data.role) {
            const userDoc = await getDoc(doc(dbFokus360, "user", data.createdBy));
            const userData = userDoc.exists() ? userDoc.data() : null;
            const userRole = userData?.role || "desconhecido";

            await updateDoc(doc(dbFokus360, "kanbanCards", docSnap.id), {
              role: userRole,
            });
          }
        })
      );
    } catch (error) {
      console.error("Erro ao corrigir roles:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(dbFokus360, "user"));

      const usersList = querySnapshot.docs.map((item) => ({
        id: item.id,
        uid: item.id,
        username: item.data().username,
        email: item.data().email,
      }));

      setUsers(usersList);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const fetchCards = async () => {
    try {
      const q = query(kanbanCards, orderBy("position", "asc"));
      const querySnapshot = await getDocs(q);

      const cardsFromFirestore = querySnapshot.docs.map((item) => {
        const data = item.data();

        const colaboradoresCorrigido = Array.isArray(data.colaboradores)
          ? data.colaboradores.map((colab) => {
              if (typeof colab === "string") {
                const userEncontrado = users.find(
                  (u) => u.id === colab || u.username === colab
                );

                return userEncontrado
                  ? { id: userEncontrado.id, username: userEncontrado.username }
                  : { id: colab, username: "Desconhecido" };
              }

              return colab;
            })
          : [];

        return {
          id: item.id,
          ...data,
          colaboradores: colaboradoresCorrigido,
          role: data.role || "default",
        };
      });

      setAllCards(cardsFromFirestore);
    } catch (error) {
      console.error("Erro ao buscar os cards:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    corrigirRolesNoFirestore();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDoc = await getDoc(doc(dbFokus360, "user", currentUser.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();

          setLoggedUserName(userData.username);

          setNewCard((prev) => ({
            ...prev,
            departamento: userData.username,
          }));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && users.length > 0) {
      fetchCards();
    }
  }, [user, users]);

  const filteredCards = useMemo(() => {
    let cards = [...allCards];

    if (selectedDepartment) {
      cards = cards.filter((card) => card.departamento === selectedDepartment);
    }

    if (selectedDateCreated) {
      cards = cards.filter((card) => card.dataCriacao === selectedDateCreated);
    }

    if (selectedDateFinished) {
      cards = cards.filter(
        (card) => card.dataFinalizacao === selectedDateFinished
      );
    }

    if (selectedCollaborators.length > 0) {
      cards = cards.filter((card) =>
        card.colaboradores?.some((colab) =>
          selectedCollaborators.includes(colab.username)
        )
      );
    }

    if (selectedPriority) {
      cards = cards.filter((card) => card.prioridade === selectedPriority);
    }

    if (selectedFilter) {
      cards = cards.filter(
        (card) => String(card.role).padStart(2, "0") === selectedFilter
      );
    }

    return cards;
  }, [
    allCards,
    selectedDepartment,
    selectedDateCreated,
    selectedDateFinished,
    selectedCollaborators,
    selectedPriority,
    selectedFilter,
  ]);

  useEffect(() => {
    setColumns(
      initialColumns.map((column) => ({
        ...column,
        cards: filteredCards
          .filter((card) => card.columnId === column.id)
          .sort((a, b) => (a.position || 0) - (b.position || 0)),
      }))
    );
  }, [filteredCards]);

  const handleAddCard = async () => {
    if (!user) {
      alert("Usuário não autenticado. Faça login para criar um card.");
      return;
    }

    try {
      const userDoc = await getDoc(doc(dbFokus360, "user", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const userRole = userData?.role || "default";

      const collaboratorDetails = newCard.colaboradores.map((id) => {
        const userEncontrado = users.find((u) => u.id === id);

        return {
          id,
          username: userEncontrado ? userEncontrado.username : "Desconhecido",
        };
      });

      const newCardWithUser = {
        ...newCard,
        colaboradores: collaboratorDetails,
        columnId: 1,
        createdBy: user.uid,
        role: userRole,
        position: allCards.length,
      };

      const docRef = await addDoc(kanbanCards, newCardWithUser);
      const cardComId = { ...newCardWithUser, id: docRef.id };

      setAllCards((prev) => [...prev, cardComId]);

      if (newCard.email) {
        await axios
          .post("https://fokus360-backend.vercel.app/send-task-email", {
            email: newCard.email,
            tituloTarefa: newCard.nome,
            assuntoTarefa: newCard.assunto,
            prazoTarefa: newCard.dataFinalizacao,
          })
          .catch((err) => console.error("Erro ao enviar e-mail:", err));
      }

      await Promise.all(
        newCardWithUser.colaboradores.map(async (colab) => {
          await axios
            .post("https://fokus360-backend.vercel.app/send-notification", {
              userId: colab.id,
              mensagem: `Você recebeu uma nova tarefa: ${newCard.nome}`,
            })
            .catch((err) => console.error("Erro ao enviar notificação:", err));
        })
      );

      setNotifications((prev) => [
        ...prev,
        ...newCardWithUser.colaboradores.map((colab) => ({
          mensagem: `Você recebeu uma nova tarefa: ${newCard.nome}`,
          id: `${docRef.id}-${colab.id}`,
        })),
      ]);

      setNewCard({
        nome: "",
        departamento: loggedUserName,
        assunto: "",
        dataCriacao: new Date().toISOString().slice(0, 10),
        dataFinalizacao: "",
        colaboradores: [],
        responsavel: "",
        prioridade: "medium",
        email: "",
      });

      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar o cartão:", error);
      alert("Erro ao adicionar cartão. Tente novamente.");
    }
  };

  const handleDeleteCard = async (cardId, columnId) => {
    try {
      const cardDoc = await getDoc(doc(dbFokus360, "kanbanCards", cardId));

      if (!cardDoc.exists()) {
        alert("Card não encontrado.");
        return;
      }

      const cardData = cardDoc.data();

      if (cardData.createdBy !== user?.uid) {
        alert("❌ Você não tem permissão para deletar este card.");
        return;
      }

      await deleteDoc(doc(dbFokus360, "kanbanCards", cardId));

      setAllCards((prevCards) => prevCards.filter((card) => card.id !== cardId));

      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                cards: column.cards.filter((card) => card.id !== cardId),
              }
            : column
        )
      );
    } catch (error) {
      console.error("Erro ao excluir cartão:", error);
    }
  };

  const handleDragStart = (card, columnId) => {
    setDraggingCard({ card, columnId });
  };

  const handleDragEnd = () => {
    setDraggingCard(null);
  };

  const handleDrop = async (targetColumnId, targetIndex) => {
    if (!draggingCard) return;

    const { card, columnId: sourceColumnId } = draggingCard;

    try {
      const updatedColumns = columns.map((col) => ({
        ...col,
        cards: [...col.cards],
      }));

      const sourceColumn = updatedColumns.find((col) => col.id === sourceColumnId);
      const targetColumn = updatedColumns.find((col) => col.id === targetColumnId);

      const cardToMove = sourceColumn.cards.find((item) => item.id === card.id);

      sourceColumn.cards = sourceColumn.cards.filter((item) => item.id !== card.id);
      targetColumn.cards.splice(targetIndex, 0, cardToMove);

      setColumns(updatedColumns);
      setDraggingCard(null);

      await Promise.all(
        targetColumn.cards.map(async (item, index) => {
          await updateDoc(doc(dbFokus360, "kanbanCards", item.id), {
            columnId: targetColumnId,
            position: index,
          });
        })
      );

      fetchCards();
    } catch (error) {
      console.error("Erro ao reordenar cartões:", error);
    }
  };

  const handleClearAllFilters = () => {
    setSelectedDepartment("");
    setSelectedDateCreated("");
    setSelectedDateFinished("");
    setSelectedCollaborators([]);
    setSelectedPriority("");
    setSelectedFilter("");
  };

  return (
    <>
      <Box
  sx={{
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    mx: { xs: 0, md: 0 },
    mt: 3,
    mb: 4,
    minHeight: "75vh",
    borderRadius: "30px",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
    boxShadow: "0 28px 80px rgba(15,23,42,0.14)",
    border: "1px solid rgba(226,232,240,0.95)",
  }}

      >
        <Box
          sx={{
            height: 8,
            background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
          }}
        />

        <Box sx={{
    p: { xs: 2, md: 4 },
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflow: "hidden",
  }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #312783, #6d5dfc)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 18px 38px rgba(49,39,131,0.30)",
                }}
              >
                <AssignmentTurnedInIcon />
              </Box>

              <Box>
                

                <Typography
                  sx={{
                    fontSize: { xs: 24, md: 32 },
                    fontWeight: 950,
                    color: "#0f172a",
                    lineHeight: 1.05,
                  }}
                >
                  Gerenciamento de Tarefas
                </Typography>

                <Typography sx={{ mt: 0.8, color: "#64748b", fontSize: 14 }}>
                  Organize, acompanhe e mova tarefas por status operacional.
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                icon={<DashboardCustomizeIcon sx={{ color: "#312783 !important" }} />}
                label={`Total: ${allCards.length}`}
                sx={chipStyle("#312783")}
              />

              {columns.map((column) => (
                <Chip
                  key={column.id}
                  label={`${column.title}: ${column.cards.length}`}
                  sx={chipStyle(getColumnBorderColor(column.id))}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(148,163,184,0.25)" }} />

          <Paper elevation={0} sx={filterPanelStyle}>
            <Box sx={topFilterBoxStyle}>
              <Box sx={levelFilterStyle}>
                <FilterListIcon sx={{ color: "#312783" }} />

                <Select
                  fullWidth
                  displayEmpty
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  sx={premiumSelectStyle}
                >
                  <MenuItem value="" disabled>
                    Busque tarefas por níveis
                  </MenuItem>

                  {filtrosNivel.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Button
                onClick={handleClearAllFilters}
                startIcon={<ClearAllIcon />}
                sx={clearButtonStyle}
              >
                Limpar Filtros
              </Button>
            </Box>

            <Box sx={advancedFiltersStyle}>
              <FormControl sx={filterControlStyle}>
                <Select
                  displayEmpty
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  sx={premiumSelectStyle}
                >
                  <MenuItem disabled value="">
                    <ListItemText primary="Tarefas por solicitantes" />
                  </MenuItem>

                  {users.map((item) => (
                    <MenuItem key={item.id} value={item.username}>
                      <ListItemText primary={item.username} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                type="date"
                label="Data de Criação"
                value={selectedDateCreated}
                onChange={(e) => setSelectedDateCreated(e.target.value)}
                sx={filterControlStyle}
                InputLabelProps={{ shrink: true }}
              />

              <Select
                multiple
                displayEmpty
                value={selectedCollaborators}
                onChange={(e) => setSelectedCollaborators(e.target.value)}
                sx={{ ...premiumSelectStyle, ...filterControlStyle }}
                renderValue={(selected) =>
                  selected.length === 0
                    ? "Tarefas por responsáveis"
                    : selected.join(", ")
                }
              >
                {users.map((item) => (
                  <MenuItem key={item.id} value={item.username}>
                    <Checkbox checked={selectedCollaborators.includes(item.username)} />
                    <ListItemText primary={item.username} />
                  </MenuItem>
                ))}
              </Select>

              <Select
                displayEmpty
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                sx={{ ...premiumSelectStyle, ...filterControlStyle }}
                renderValue={(selected) =>
                  selected ? (
                    <PriorityLabel priority={selected} />
                  ) : (
                    "Tarefas por Prioridades"
                  )
                }
              >
                {Object.keys(priorityConfig).map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    <PriorityLabel priority={priority} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Paper>

          <Box display="flex" alignItems="center" gap={1} mt={3} mb={2}>
            <PlayCircleFilledIcon sx={{ color: "#6d5dfc", fontSize: 25 }} />
            <Typography sx={{ color: "#64748b", fontWeight: 800 }}>
              Adicione tarefas no painel de gerenciamento
            </Typography>
          </Box>

          <Box sx={kanbanViewportStyle}>
  <Box sx={kanbanStyle}>
    {columns.map((column) => (
              <Box
                key={column.id}
                sx={{
                  ...columnStyle,
                  borderTop: `6px solid ${getColumnBorderColor(column.id)}`,
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(column.id, column.cards.length);
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 950,
                      color: "#0f172a",
                    }}
                  >
                    {column.title}
                  </Typography>

                  <Chip
                    label={column.cards.length}
                    size="small"
                    sx={chipStyle(getColumnBorderColor(column.id))}
                  />
                </Box>

                {column.id === 1 && (
                  <Button
                    fullWidth
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => setModalOpen(true)}
                    sx={addCardButtonStyle}
                  >
                    Adicionar cartão
                  </Button>
                )}

                <Box sx={cardContainerStyle}>
                  {column.cards.map((card) => (
                    <Accordion
                      key={card.id}
                      draggable
                      onDragStart={(e) => {
                        handleDragStart(card, column.id);
                        e.stopPropagation();
                      }}
                      onDragEnd={handleDragEnd}
                      sx={cardStyle}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box
                          sx={{
                            width: 13,
                            height: 13,
                            borderRadius: "5px",
                            backgroundColor:
                              priorityConfig[card.prioridade]?.color || "#6b84f3",
                            mr: 1.2,
                            flexShrink: 0,
                          }}
                        />

                        <Box>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 900,
                              color: "#94a3b8",
                              textTransform: "uppercase",
                            }}
                          >
                            Tarefa
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 900,
                              color: "#0f172a",
                              lineHeight: 1.25,
                            }}
                          >
                            {card.nome}
                          </Typography>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Box sx={badgeStyle(card.prioridade)}>
                          {priorityConfig[card.prioridade]?.label || "Prioridade"}
                        </Box>

                        <Typography variant="body2" sx={infoTextStyle}>
                          <strong>Solicitante:</strong> {card.departamento}
                        </Typography>

                        <Box sx={descriptionBoxStyle}>{card.assunto}</Box>

                        <Typography variant="body2" sx={infoTextStyle}>
                          <strong>Responsáveis:</strong>{" "}
                          {card.colaboradores?.map((colab) => colab.username).join(", ")}
                        </Typography>

                        <Typography variant="body2" sx={infoTextStyle}>
                          <strong>Data de Criação:</strong> {card.dataCriacao}
                        </Typography>

                        <Typography variant="body2" sx={infoTextStyle}>
                          <strong>Prazo previsto:</strong> {card.dataFinalizacao}
                        </Typography>

                        <Box display="flex" justifyContent="flex-end" mt={1.5}>
                          {card.createdBy === user?.uid && (
                            <Tooltip title="Excluir tarefa">
                              <IconButton
                                onClick={() => handleDeleteCard(card.id, column.id)}
                                sx={deleteButtonStyle}
                              >
                                <DeleteForeverSharpIcon sx={{ fontSize: 24 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Box>
            ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography sx={modalTitleStyle}>Adicionar Novo Cartão</Typography>

          <TextField
            fullWidth
            label="Título da tarefa"
            value={newCard.nome}
            onChange={(e) => setNewCard({ ...newCard, nome: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Solicitante"
            value={newCard.departamento}
            disabled
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Descrição da tarefa"
            value={newCard.assunto}
            onChange={(e) => setNewCard({ ...newCard, assunto: e.target.value })}
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
            label="Prazo previsto"
            type="date"
            value={newCard.dataFinalizacao}
            onChange={(e) =>
              setNewCard({ ...newCard, dataFinalizacao: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <Select
            multiple
            fullWidth
            value={newCard.colaboradores}
            onChange={(e) =>
              setNewCard({ ...newCard, colaboradores: e.target.value })
            }
            displayEmpty
            sx={{ mb: 2 }}
            renderValue={(selected) =>
              selected.length === 0
                ? "Selecione responsáveis pela tarefa"
                : selected
                    .map((id) => users.find((u) => u.id === id)?.username || "")
                    .join(", ")
            }
          >
            {users.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <Checkbox checked={newCard.colaboradores.includes(item.id)} />
                <ListItemText primary={item.username} />
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            label="E-mail do colaborador"
            type="email"
            value={newCard.email}
            onChange={(e) => setNewCard({ ...newCard, email: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Select
            fullWidth
            value={newCard.prioridade || ""}
            onChange={(e) =>
              setNewCard({ ...newCard, prioridade: e.target.value })
            }
            displayEmpty
            onOpen={() => setIsPriorityOpen(true)}
            onClose={() => setIsPriorityOpen(false)}
            sx={{ mb: 2 }}
            renderValue={(selected) =>
              !isPriorityOpen && !selected ? (
                <Typography sx={{ color: "#aaa" }}>Prioridade da tarefa</Typography>
              ) : selected ? (
                <PriorityLabel priority={selected} />
              ) : null
            }
          >
            {Object.keys(priorityConfig).map((priority) => (
              <MenuItem key={priority} value={priority}>
                <PriorityLabel priority={priority} />
              </MenuItem>
            ))}
          </Select>

          <Button fullWidth onClick={handleAddCard} sx={modalButtonStyle}>
            Adicionar
          </Button>
        </Box>
      </Modal>
    </>
  );
};

const PriorityLabel = ({ priority }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: "4px",
        backgroundColor: priorityConfig[priority]?.color,
        mr: 1,
      }}
    />
    {priorityConfig[priority]?.label}
  </Box>
);

const chipStyle = (color) => ({
  height: 34,
  borderRadius: "11px",
  fontWeight: 900,
  color,
  backgroundColor: `${color}12`,
  border: `1px solid ${color}24`,
});

const filterPanelStyle = {
  p: 2,
  borderRadius: "24px",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
};

const topFilterBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  flexWrap: "wrap",
  mb: 2,
};

const levelFilterStyle = {
  flex: 1,
  minWidth: 280,
  display: "flex",
  alignItems: "center",
  gap: 1.2,
  backgroundColor: "#f8fafc",
  borderRadius: "16px",
  p: 1,
  border: "1px solid rgba(226,232,240,0.95)",
};

const advancedFiltersStyle = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(4, minmax(0, 1fr))",
  },
  gap: 1.5,
};

const filterControlStyle = {
  width: "100%",
  backgroundColor: "#f8fafc",
  borderRadius: "14px",
};

const premiumSelectStyle = {
  height: 44,
  borderRadius: "14px",
  backgroundColor: "#f8fafc",
  fontWeight: 700,
  color: "#334155",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(203,213,225,0.8)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#6d5dfc",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#312783",
  },
};

const clearButtonStyle = {
  height: 44,
  px: 2.5,
  borderRadius: "14px",
  color: "#fff",
  fontWeight: 900,
  textTransform: "none",
  background: "linear-gradient(135deg, #00c48c, #00d497)",
  boxShadow: "0 12px 26px rgba(0,196,140,0.25)",
  "&:hover": {
    background: "linear-gradient(135deg, #059669, #00c48c)",
    boxShadow: "0 16px 34px rgba(0,196,140,0.32)",
  },
};

const kanbanViewportStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflowX: "auto",
  overflowY: "hidden",
  boxSizing: "border-box",
  paddingBottom: "18px",
};

const kanbanStyle = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(5, 280px)",
    md: "repeat(5, minmax(210px, 1fr))",
    xl: "repeat(5, minmax(0, 1fr))",
  },
  gap: "16px",
  width: "100%",
  minWidth: {
    xs: "max-content",
    md: "100%",
  },
  alignItems: "flex-start",
};

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  p: 2,
  borderRadius: "24px",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  minHeight: "68vh",
  boxSizing: "border-box",
  background:
    "linear-gradient(135deg, rgba(248,250,252,0.98), rgba(255,255,255,0.98))",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.07)",
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 1.3,
  width: "100%",
};

const cardStyle = {
  borderRadius: "18px !important",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 10px 26px rgba(15,23,42,0.07)",
  overflowX: "hidden",
  overflowY: "visible",
  maxWidth: "100%",
  "&:before": {
    display: "none",
  },
};

const badgeStyle = (priority) => ({
  display: "inline-flex",
  alignItems: "center",
  px: 1.2,
  py: 0.6,
  mb: 1.5,
  borderRadius: "10px",
  fontSize: 12,
  fontWeight: 900,
  color: "#fff",
  backgroundColor: priorityConfig[priority]?.color || "#6b84f3",
});

const descriptionBoxStyle = {
  my: 1.2,
  p: 1.5,
  borderRadius: "14px",
  color: "#334155",
  backgroundColor: "#f8fafc",
  border: "1px solid rgba(226,232,240,0.95)",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: 13,
  lineHeight: 1.6,
};

const infoTextStyle = {
  color: "#475569",
  fontSize: 13,
  mb: 0.7,
};

const deleteButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: "12px",
  color: "#dc2626",
  backgroundColor: "rgba(220,38,38,0.08)",
  border: "1px solid rgba(220,38,38,0.14)",
  "&:hover": {
    backgroundColor: "rgba(220,38,38,0.14)",
  },
};

const addCardButtonStyle = {
  mb: 2,
  height: 42,
  borderRadius: "14px",
  color: "#fff",
  fontWeight: 900,
  textTransform: "none",
  background: "linear-gradient(135deg, #00c48c, #00d497)",
  boxShadow: "0 12px 26px rgba(0,196,140,0.25)",
  "&:hover": {
    background: "linear-gradient(135deg, #059669, #00c48c)",
    boxShadow: "0 16px 34px rgba(0,196,140,0.32)",
  },
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "560px",
  maxHeight: "90vh",
  bgcolor: "#fff",
  boxShadow: "0 30px 90px rgba(15,23,42,0.25)",
  p: 4,
  borderRadius: "26px",
  overflowY: "auto",
  border: "1px solid rgba(226,232,240,0.95)",
};

const modalTitleStyle = {
  mb: 2.5,
  p: 1.5,
  borderRadius: "16px",
  color: "#fff",
  fontWeight: 950,
  fontSize: 22,
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
};

const modalButtonStyle = {
  height: 46,
  borderRadius: "14px",
  color: "#fff",
  fontWeight: 950,
  textTransform: "none",
  background: "linear-gradient(135deg, #00c48c, #00d497)",
  boxShadow: "0 14px 30px rgba(0,196,140,0.28)",
  "&:hover": {
    background: "linear-gradient(135deg, #059669, #00c48c)",
    boxShadow: "0 18px 38px rgba(0,196,140,0.34)",
  },
};

export default Kanban;