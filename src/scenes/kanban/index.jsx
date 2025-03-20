import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { FormControl, InputLabel } from "@mui/material";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { dbFokus360 } from "../../data/firebase-config";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList"; // Ícone para o Select
import ClearAllIcon from "@mui/icons-material/ClearAll"; // Ícone para limpar filtro
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios"; 
import { query, orderBy } from "firebase/firestore";
import { NotificationContext } from "../../context/NotificationContext";
import { useContext } from "react";





import { authFokus360 } from "../../data/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const Kanban = () => {
  const [columns, setColumns] = useState([
    { id: 1, title: "Pendente", cards: [] },
    { id: 2, title: "Recebido", cards: [] },
    { id: 3, title: "Em execução", cards: [] },
    { id: 4, title: "Em aprovação", cards: [] },
    { id: 5, title: "Concluído", cards: [] },
  ]);

  const [responsavelId, setResponsavelId] = useState("");
  const [loggedUserName, setLoggedUserName] = useState("")
  const [selectedPriority, setSelectedPriority] = useState(""); // ✅ Estado para filtrar por prioridade
  const [selectedCollaborators, setSelectedCollaborators] = useState([]); // ✅ Estado para filtrar por colaboradores
  const [selectedDateFinished, setSelectedDateFinished] = useState(""); // ✅ Estado para filtrar por data de finalização
  const [selectedDateCreated, setSelectedDateCreated] = useState(""); // ✅ Adicionando o estado
  const [selectedDepartment, setSelectedDepartment] = useState([]); // ✅ Adicionando o estado
  const [allCards, setAllCards] = useState([]); // 🔥 Armazena todos os cards para aplicar os filtros depois
  const [user, setUser] = useState(null); // Estado para armazenar o usuário logado

  const { setNotifications } = useContext(NotificationContext);

  //gerenciar o filtro da barra de pesquisa
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // ✅ Controla se o Select está aberto ou fechado
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
    email: "",
  });

  const [formValues, setFormValues] = useState({
    colaboradores: [],
    departamento: "",
  });

  const kanbanCards = collection(dbFokus360, "kanbanCards");

  // Atualizar o Firestore sem precisar fazer manualmente
const corrigirRolesNoFirestore = async () => {
  const querySnapshot = await getDocs(collection(dbFokus360, "kanbanCards"));

  querySnapshot.forEach(async (docSnap) => {
    const data = docSnap.data();

    if (data.role === "default" || !data.role) {
      // 🔥 Buscar o role correto do usuário criador do card
      const userDoc = await getDoc(doc(dbFokus360, "user", data.createdBy));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const userRole = userData?.role || "desconhecido"; // 🔥 Se não encontrar, usa "desconhecido"

      await updateDoc(doc(dbFokus360, "kanbanCards", docSnap.id), {
        role: userRole,
      });

      console.log(`✅ Atualizado ${docSnap.id} para role: ${userRole}`);
    }
  });
};

// ✅ Agora chamamos a função corretamente
corrigirRolesNoFirestore();


  //Exibir Apenas os Cards do Usuário Logado
  const fetchCards = async () => {
    try {
      const q = query(kanbanCards, orderBy("position", "asc")); // 🔥 ordena certinho pela posição
  
      const querySnapshot = await getDocs(q);
      const cardsFromFirestore = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          role: data.role || "default",
        };
      });
  
      console.log("📋 Todos os cards carregados:", cardsFromFirestore);
  
      setAllCards(cardsFromFirestore);
  
      setColumns(
        columns.map((column) => ({
          ...column,
          cards: cardsFromFirestore
            .filter((card) => card.columnId === column.id)
            .sort((a, b) => a.position - b.position), // Garantir ordenação local também!
        }))
      );
    } catch (error) {
      console.error("❌ Erro ao buscar os cards:", error);
    }
  };


  

  //Criar card: criar um novo card, associamos o uid do usuário autenticado
  const handleAddCard = async () => {
    if (!user) {
      alert("Usuário não autenticado. Faça login para criar um card.");
      return;
    }
  
    try {
      // Buscar role do usuário logado
      const userDoc = await getDoc(doc(dbFokus360, "user", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const userRole = userData?.role || "default";
  
      // Converte IDs para nomes
      const collaboratorNames = newCard.colaboradores.map((id) => {
        const userEncontrado = users.find((u) => u.id === id);
        return userEncontrado ? userEncontrado.username : "Desconhecido";
      });
  
      const newCardWithUser = {
        ...newCard,
        colaboradores: collaboratorNames,
        columnId: 1,
        createdBy: user.uid,
        role: userRole || "default",
      };
  
      // Salvar Card no Firestore
      const docRef = await addDoc(kanbanCards, newCardWithUser);
  
      // Atualiza localmente
      setAllCards([...allCards, { ...newCardWithUser, id: docRef.id }]);
      setColumns((prevColumns) =>
        prevColumns.map((col) => ({
          ...col,
          cards:
            col.id === 1
              ? [...col.cards, { ...newCardWithUser, id: docRef.id }]
              : col.cards,
        }))
      );
  
      console.log("✅ Card criado com nomes dos colaboradores.");
  
      // Enviar e-mail (se houver)
      if (newCard.email) {
        await axios.post('https://fokus360-backend.vercel.app/send-task-email', {
          email: newCard.email,
          tituloTarefa: newCard.nome,
          assuntoTarefa: newCard.assunto,
          prazoTarefa: newCard.dataFinalizacao,
        })
        .then(() => console.log('📧 E-mail enviado'))
        .catch((err) => console.error('Erro ao enviar e-mail:', err));
      }
  
      // Enviar notificação para cada colaborador
      await Promise.all(newCard.colaboradores.map(async (colabId) => {
        await axios.post('https://fokus360-backend.vercel.app/send-notification', {
          userId: colabId,
          mensagem: `Você recebeu uma nova tarefa: ${newCard.nome}`,
        })
        .then(() => {
          console.log(`🔔 Notificação enviada para UID: ${colabId}`);
  
          // ✅ Atualiza o estado global de notificações
          setNotifications((prev) => [
            ...prev,
            { mensagem: `Você recebeu uma nova tarefa: ${newCard.nome}`, lido: false },
          ]);
        })
        .catch((err) => console.error('Erro ao enviar notificação:', err));
      }));
  
      // Limpar inputs
      const hoje = new Date().toISOString().slice(0, 10);
      setNewCard({
        nome: "",
        departamento: "",
        assunto: "",
        dataCriacao: hoje,
        dataFinalizacao: "",
        colaboradores: [],
        responsavel: "",
        prioridade: "medium",
        email: "",
      });
  
      setModalOpen(false);
  
    } catch (error) {
      console.error("❌ Erro ao adicionar o cartão:", error);
      alert("Erro ao adicionar cartão. Tente novamente.");
      setModalOpen(false);
    }
  };

  
  
  
  
  
  
  



  //Deletar cards
  const handleDeleteCard = async (cardId, columnId) => {
    try {
      // Busca o card no Firestore para verificar quem criou
      const cardDoc = await getDoc(doc(dbFokus360, "kanbanCards", cardId));
  
      if (cardDoc.exists()) {
        const cardData = cardDoc.data();
  
        // Verifica se o usuário logado é quem criou o card
        if (cardData.createdBy !== user.uid) {
          alert("❌ Você não tem permissão para deletar este card.");
          return;
        }
  
        // Se for o criador, deleta o card normalmente
        await deleteDoc(doc(dbFokus360, "kanbanCards", cardId));
  
        // Atualiza localmente os cards
        setAllCards((prevCards) =>
          prevCards.filter((card) => card.id !== cardId)
        );
  
        // Atualiza as colunas
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
      } else {
        alert("Card não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao excluir cartão:", error);
    }
  };
  

  const handleDragStart = (card, columnId) =>
    setDraggingCard({ card, columnId });
  const handleDragEnd = () => setDraggingCard(null);
  const handleDragOver = (e) => e.preventDefault();


//MOver os cards na mesma coluna
const handleDrop = async (targetColumnId, targetIndex) => {
  if (!draggingCard) return;

  const { card, columnId: sourceColumnId } = draggingCard;

  try {
    let updatedColumns = [...columns];

    // Remover o card da coluna antiga
    const sourceColumn = updatedColumns.find(col => col.id === sourceColumnId);
    const cardToMove = sourceColumn.cards.find(c => c.id === card.id);
    sourceColumn.cards = sourceColumn.cards.filter(c => c.id !== card.id);

    // Inserir o card na nova posição da coluna alvo
    const targetColumn = updatedColumns.find(col => col.id === targetColumnId);
    targetColumn.cards.splice(targetIndex, 0, cardToMove);

    setColumns(updatedColumns);
    setDraggingCard(null);

    // 🔥 Atualizar no Firestore as posições de TODOS os cards na coluna alvo
    await Promise.all(
      targetColumn.cards.map(async (c, index) => {
        const cardDocRef = doc(dbFokus360, "kanbanCards", c.id);
        await updateDoc(cardDocRef, {
          columnId: targetColumnId,
          position: index, // Atualizando posição certinha!
        });
      })
    );

    console.log(`✅ Reordenação da coluna ${targetColumnId} salva no Firestore.`);
  } catch (error) {
    console.error("❌ Erro ao reordenar cartões:", error);
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
      case 4:
        return "#d1d5db";
      case 5:
        return "#34d399";
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
          email: doc.data().email, // 🔥 importante adicionar o e-mail aqui!
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
    fetchUsers();
  }, []);

  //Capturar o usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
  
        // 🔥 Buscar username do Firestore
        const userDoc = await getDoc(doc(dbFokus360, "user", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
  
          // ✅ Atualiza o estado do card com o nome do usuário já preenchido
          setNewCard((prev) => ({
            ...prev,
            departamento: userData.username, // Aqui define automaticamente
          }));
  
          // Opcional: se quiser também salvar em um estado separado
          setLoggedUserName(userData.username);
        }
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    if (user) {
      console.log("⏳ Buscando cards...");
      fetchCards();
    }
  }, [user]); // 🔥 Executa novamente se o usuário mudar







  //aplica o filtro ao clicar no botão
  const applyFilter = () => {
    let filteredCards = allCards;
  
    // 🔥 Filtrar por departamento (se algum estiver selecionado)
    if (selectedDepartment.length > 0) {
      filteredCards = filteredCards.filter((card) =>
        selectedDepartment.includes(card.departamento)
      );
    }
  
    // 🔥 Filtrar por data de criação (se definida)
    if (selectedDateCreated) {
      filteredCards = filteredCards.filter(
        (card) => card.dataCriacao === selectedDateCreated
      );
    }
  
    // 🔥 Filtrar por data de finalização (se definida)
    if (selectedDateFinished) {
      filteredCards = filteredCards.filter(
        (card) => card.dataFinalizacao === selectedDateFinished
      );
    }
  
    // 🔥 Filtrar por colaboradores (se algum estiver selecionado)
    if (selectedCollaborators.length > 0) {
      filteredCards = filteredCards.filter((card) =>
        card.colaboradores.some((colab) =>
          selectedCollaborators.includes(colab)
        )
      );
    }
  
    // 🔥 Filtrar por prioridade (se definida)
    if (selectedPriority) {
      filteredCards = filteredCards.filter(
        (card) => card.prioridade === selectedPriority
      );
    }
  
    // ✅ Filtrar por role (número como string)
    if (selectedFilter) {
      filteredCards = filteredCards.filter(
        (card) => String(card.role).padStart(2, '0') === selectedFilter
      );
    }
    
  
    // 🔥 Atualiza as colunas apenas com os cards filtrados
    setColumns(
      columns.map((column) => ({
        ...column,
        cards: filteredCards.filter((card) => card.columnId === column.id),
      }))
    );
  };

  useEffect(() => {
    applyFilter();
  }, [selectedDepartment, selectedDateCreated, selectedDateFinished, selectedCollaborators, selectedPriority, selectedFilter, allCards]);
  
  
  
  
  // Chamar essa função manualmente uma vez para corrigir os registros antigos
 // corrigirRolesNoFirestore();


//enviar notificação
 const sendNotification = async (userId, tituloTarefa) => {
  try {
    await axios.post('https://fokus360-backend.vercel.app/send-notification', {
      userId: userId,
      mensagem: `Você recebeu uma nova tarefa: ${tituloTarefa}`
    });
    console.log("🔔 Notificação enviada!");
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
  }
};




 



  

  return (
    <>
      <Box
        sx={{
          marginLeft: "40px",
          marginTop: "15px",
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
        {/* Container principal para alinhar Filtro, Botão e Contador */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // 🔥 Mantém os itens alinhados lado a lado
            flexWrap: "wrap", // 🔥 Ajuste automático em telas menores
            marginBottom: "15px",
            width: "100%", // 🔹 Garante que ocupe toda a largura
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start", // 🔹 Mantém alinhado à esquerda
              gap: "10px", // 🔥 Espaçamento entre os elementos
              minHeight: "50px", // 🔹 Garante um tamanho mínimo
            }}
          >
            {/* Caixa de seleção de filtro */}
            <Box
              sx={{
                flex: 1,
                minWidth: "70%", // 🔥 Garante que a caixa não fique muito pequena
                maxWidth: "100%", // 🔹 Ocupa até 30% da tela
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FilterListIcon sx={{ color: "#757575", mr: 1 }} />
              <Select
                fullWidth
                displayEmpty
                value={selectedFilter || ""}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setSelectedFilter(selectedValue);
                  //applyFilter(selectedValue);
                }}
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "5px",
                  height: "40px",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:focus": { outline: "none" },
                  "&.Mui-focused": { boxShadow: "none" },
                }}
              >
                <MenuItem value="" disabled>
                  Busque tarefas por níveis
                </MenuItem>
                {[
                  { value: "01", label: "Diretoria" },
                  { value: "02", label: "Gerente" },
                  { value: "03", label: "Supervisor" },
                  { value: "04", label: "Vendedor" },
                  { value: "06", label: "Industria" },
                  { value: "07", label: "Projetos" },
                  { value: "08", label: "Admin" },
                  { value: "09", label: "Coordenador Trade" },
                  { value: "10", label: "Gerência Trade" },
                  { value: "11", label: "Analista Trade" },
                ].map((filter) => (
                  <MenuItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Botão de limpar filtro */}
            <Button
              variant="contained"
              onClick={() => {
                setSelectedFilter(null);
                applyFilter(null);
              }}
              sx={{
                height: "40px",
                minWidth: "140px", // 🔥 Define um tamanho mínimo para não sobrepor a caixa de seleção
                backgroundColor: "#f44336",
                color: "white",
                whiteSpace: "nowrap", // 🔥 Impede quebra de linha no botão
                flexShrink: 0, // 🔥 Impede que o botão diminua ao reduzir a tela
                "&:hover": {
                  backgroundColor: "#d32f2f",
                  boxShadow: "none",
                },
                "&:focus": { outline: "none" },
              }}
            >
              <ClearAllIcon sx={{ fontSize: "20px", mr: 1 }} />
              Limpar Filtro
            </Button>
          </Box>

          {/* Contador de Tarefas - AGORA AO LADO do botão de limpar filtro */}
          <Box
            sx={{
              width: "55%", // 🔥 Ocupa 40% da largura
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center", // 🔥 Alinha na horizontal
              justifyContent: "space-between", // 🔥 Mantém espaçamento uniforme
              gap: 2,
            }}
          >
            {/* Total de Tarefas */}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Total: <strong>{allCards.length}</strong>
            </Typography>

            {/* Quantidade de cards por status */}
            {columns.map((column) => (
              <Box
                key={column.id}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {/* 🔥 Bolinha colorida correspondente à coluna */}
                <Box
                  sx={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: getColumnBorderColor(column.id),
                  }}
                />
                <Typography variant="body2">
                  {column.title}: <strong>{column.cards.length}</strong>
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>























{/* Box de Filtros */}
<Box
  sx={{
    width: "100%",
    //backgroundColor: "white",
    borderRadius: "10px",
    padding: "10px", // 🔥 Reduzindo o padding geral
    //boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexWrap: "nowrap", // 🔥 Mantém os elementos na mesma linha
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1, // 🔥 Reduzindo o espaçamento entre os elementos
    marginBottom: "10px", // 🔥 Menor espaço abaixo do Box
    overflowX: "auto", // 🔥 Permite rolagem horizontal se necessário
  }}
>
  {/* Departamento */}
  <FormControl fullWidth sx={{ width: "18%" }}>
  
  <Select
    labelId="departamento-label"
    displayEmpty
    value={selectedDepartment || ""} // Garante que sempre tenha um valor inicial
    onChange={(e) => setSelectedDepartment(e.target.value)} // Atualiza apenas um valor
  >
    <MenuItem disabled value="">
      <ListItemText primary="Tarefas por solicitantes" />
    </MenuItem>
    {users.map((user) => (
      <MenuItem key={user.id} value={user.username}>
        <ListItemText primary={user.username} />
      </MenuItem>
    ))}
  </Select>
</FormControl>



  {/* Data de Criação */}
  <TextField
    type="date"
    label="Data de Criação"
    value={selectedDateCreated}
    onChange={(e) => setSelectedDateCreated(e.target.value)}
    sx={{ width: "18%" }}
    InputLabelProps={{ shrink: true }}
  />

  {/* Data de Finalização */}

  {/** 
  <TextField
    type="date"
    label="Data de Finalização"
    value={selectedDateFinished}
    onChange={(e) => setSelectedDateFinished(e.target.value)}
    sx={{ width: "18%" }}
    InputLabelProps={{ shrink: true }}
  />
  */}

  {/* Colaboradores */}
  <Select
    multiple
    fullWidth
    displayEmpty
    value={selectedCollaborators}
    onChange={(e) => setSelectedCollaborators(e.target.value)}
    sx={{ width: "18%" }}
    renderValue={(selected) =>
      selected.length === 0 ? " Tarefas por responsáveis" : selected.join(", ")
    }
  >
    {users.map((user) => (
      <MenuItem key={user.id} value={user.username}>
        <Checkbox checked={selectedCollaborators.includes(user.username)} />
        <ListItemText primary={user.username} />
      </MenuItem>
    ))}
  </Select>

  {/* Prioridade */}
  <Select
    fullWidth
    displayEmpty
    value={selectedPriority || ""}
    onChange={(e) => setSelectedPriority(e.target.value)}
    sx={{ width: "18%" }}
    renderValue={(selected) =>
      selected ? (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "15%",
              backgroundColor:
                selected === "low"
                  ? "#6b84f3"
                  : selected === "medium"
                  ? "#fc7f32"
                  : "#ce2d9b",
              mr: 1,
            }}
          />
          {selected === "low"
            ? "Baixa Prioridade"
            : selected === "medium"
            ? "Média Prioridade"
            : "Alta Prioridade"}
        </Box>
      ) : (
        "Tarefas por Prioridades"
      )
    }
  >
    <MenuItem value="low">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "15%",
            backgroundColor: "#6b84f3",
            mr: 1,
          }}
        />
        Baixa Prioridade
      </Box>
    </MenuItem>
    <MenuItem value="medium">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "15%",
            backgroundColor: "#fc7f32",
            mr: 1,
          }}
        />
        Média Prioridade
      </Box>
    </MenuItem>
    <MenuItem value="high">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "15%",
            backgroundColor: "#ce2d9b",
            mr: 1,
          }}
        />
        Alta Prioridade
      </Box>
    </MenuItem>
  </Select>

  {/* Botão de Limpar Filtros */}
  <Box
  sx={{
    display: "flex",
    justifyContent: "flex-start", // 🔥 Alinha os botões à esquerda
    gap: 2, // 🔥 Adiciona um espaço entre os botões
    mt: 2, // 🔥 Margem superior para separação
  }}
>
  {/** 
  <Button
    variant="contained"
    onClick={() => {
      setSelectedDepartment([]);
      setSelectedDateCreated("");
      setSelectedDateFinished("");
      setSelectedCollaborators([]);
      setSelectedPriority("");
      setSelectedFilter(null); // 🔥 Adicionado para limpar também o filtro por role
      applyFilter(); // Aplica os filtros
    }}
    sx={{
      marginBottom: "15px",
      height: "40px",
      backgroundColor: "#f44336",
      color: "white",
      whiteSpace: "nowrap",
      "&:hover": {
        backgroundColor: "#d32f2f",
        boxShadow: "none",
      },
      "&:focus": { outline: "none" },
    }}
  >
    <ClearAllIcon sx={{ fontSize: "20px", mr: 1 }} />
    Filtrar
  </Button>
  */}

  <Button
    variant="contained"
    onClick={() => {
      setSelectedDepartment([]);
      setSelectedDateCreated("");
      setSelectedDateFinished("");
      setSelectedCollaborators([]);
      setSelectedPriority("");
      applyFilter(); // Reseta os filtros
    }}
    sx={{
      marginBottom: "15px",
      height: "40px",
      backgroundColor: "#d32f2f",
      color: "white",
      whiteSpace: "nowrap",
      "&:hover": {
        backgroundColor: "#d32f2f",
        boxShadow: "none",
      },
      "&:focus": { outline: "none" },
    }}
  >
    <ClearAllIcon sx={{ fontSize: "20px", mr: 1 }} />
    Limpar Filtros
  </Button>
</Box>
</Box>
































































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

<Select
  fullWidth
  name="Solicitante"
  value={newCard.departamento || ""} // Vai pegar o usuário já definido no estado
  onChange={(e) => {
    const selectedUser = users.find((user) => user.id === e.target.value);
    setNewCard({
      ...newCard,
      departamento: selectedUser ? selectedUser.username : "",
    });
  }}
  displayEmpty
  sx={{ width: "100%", mb: 2 }}
  MenuProps={{
    PaperProps: {
      style: {
        maxHeight: 200,
      },
    },
  }}
  renderValue={(selected) => {
    if (!selected) {
      return (
        <Typography sx={{ color: "#a0a0a0" }}>
          Tarefas por solicitante
        </Typography>
      );
    }
    return selected;
  }}
>
  <MenuItem disabled value="">
    <Typography sx={{ color: "#a0a0a0" }}>
      Selecione solicitante da tarefa
    </Typography>
  </MenuItem>

  {/* ✅ Filtra apenas o usuário logado */}
  {users
    .filter((user) => user.username === newCard.departamento) // Só exibe quem está logado
    .map((user) => (
      <MenuItem key={user.id} value={user.id}>
        <ListItemText primary={user.username} />
      </MenuItem>
    ))}
</Select>

   







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
              label="Prazo previsto"
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
              value={newCard.colaboradores} // Agora armazena os IDs no estado
              onChange={(e) => {
                const selectedUserIds = e.target.value; // Mantém os IDs
                setNewCard({ ...newCard, colaboradores: selectedUserIds });
              }}
              displayEmpty
              sx={{ width: "100%", mb: 2 }}
              renderValue={(selected) =>
                selected.length === 0
                  ? "Selecione responsáveis pela tarefa"
                  : selected
                      .map((id) => {
                        const user = users.find((u) => u.id === id);
                        return user ? user.username : "";
                      })
                      .join(", ")
              }
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Checkbox checked={newCard.colaboradores.includes(user.id)} /> {/* Comparação correta pelo ID */}
                  <ListItemText primary={user.username} />
                </MenuItem>
              ))}
            </Select>

            <TextField
              fullWidth
              label="E-mail do colaborador:"
              type="email"
              value={newCard.email}
              onChange={(e) => setNewCard({ ...newCard, email: e.target.value })}
              sx={{ mb: 2 }}
            />



            <Select
              fullWidth
              value={newCard.prioridade || ""} // Mantém a prioridade selecionada ou vazia
              onChange={(e) =>
                setNewCard({ ...newCard, prioridade: e.target.value })
              }
              displayEmpty
              onOpen={() => setIsOpen(true)} // 🔥 Quando o Select abre, muda para true
              onClose={() => setIsOpen(false)} // 🔥 Quando o Select fecha, muda para false
              sx={{ mb: 2 }}
              renderValue={(selected) =>
                !isOpen && !selected ? ( // 🔥 Se estiver fechado e sem valor, mostra "Prioridade da tarefa"
                  <Typography sx={{ color: "#aaa" }}>
                    Prioridade da tarefa
                  </Typography>
                ) : selected ? ( // 🔥 Se estiver aberto ou com valor, mostra o selecionado
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "15%",
                        backgroundColor: {
                          low: "#6b84f3",
                          medium: "#fc7f32",
                          high: "#ce2d9b",
                        }[selected],
                        mr: 1,
                      }}
                    />
                    {
                      {
                        low: "Baixa Prioridade",
                        medium: "Média Prioridade",
                        high: "Alta Prioridade",
                      }[selected]
                    }
                  </Box>
                ) : null
              }
            >
              <MenuItem value="low">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "15%",
                    backgroundColor: "#6b84f3",
                    mr: 1,
                  }}
                />
                Baixa Prioridade
              </MenuItem>
              <MenuItem value="medium">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "15%",
                    backgroundColor: "#fc7f32",
                    mr: 1,
                  }}
                />
                Média Prioridade
              </MenuItem>
              <MenuItem value="high">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "15%",
                    backgroundColor: "#ce2d9b",
                    mr: 1,
                  }}
                />
                Alta Prioridade
              </MenuItem>
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
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const targetIndex = column.cards.length; // Garante que o card seja inserido na posição correta
                handleDrop(column.id, targetIndex);
              }}
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
                    backgroundColor: "#332984",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#332984",
                      boxShadow: "none",
                    },
                  }}
                >
                  Adicionar cartão
                </Button>
              )}

              <Box sx={cardContainerStyle}>
                {column.cards
                  .filter(
                    (card) => !selectedFilter || card.role === selectedFilter
                  )
                  .map((card) => (
                    <Accordion
                      key={card.id}
                      sx={{
                        ...cardStyle,
                        backgroundColor: "#fff", // Sempre branco
                      }}
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
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {/* Bolinha de prioridade */}
                        <Box
                          sx={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "15%",
                            backgroundColor:
                              card.prioridade === "high"
                                ? "#ce2d9b" // Alta Prioridade
                                : card.prioridade === "medium"
                                ? "#fc7f32" // Média Prioridade
                                : "#6b84f3", // Baixa Prioridade
                            marginRight: "10px",
                          }}
                        />
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          <strong>Tarefa:</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#333", marginLeft: "10px" }}
                        >
                          {card.nome}
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
                            <strong>Solicitante:</strong> {card.departamento}
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
                            <strong>Responsáveis:</strong>{" "}
                            {card.colaboradores.join(", ")}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Data de Criação:</strong> {card.dataCriacao}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Prazo previsto:</strong>{" "}
                            {card.dataFinalizacao}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginTop: "10px",
                            }}
                          >
                            {card.createdBy === user?.uid && ( // Só exibe se foi o criador
                              <IconButton
                                onClick={() => handleDeleteCard(card.id, column.id)}
                                sx={{
                                  color: "#f44336",
                                  padding: "0px",
                                }}
                              >
                                <DeleteForeverSharpIcon sx={{ fontSize: "30px" }} />
                              </IconButton>
                            )}

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
  alignItems: "flex-start",
  overflowX: "auto",
  overflowY: "auto", // 🔥 Se todas colunas juntas forem maiores que a tela
  gap: "15px",
  paddingBottom: "20px",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // 🔥 mais responsivo em telas pequenas
  maxWidth: "500px", // 🔥 mantém limite para telas grandes
  maxHeight: "90vh", // 🔥 ocupa no máximo 90% da altura da tela
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  overflowY: "auto", // 🔥 permite rolagem se o conteúdo exceder
};

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  flex: "1 1 280px",
  padding: "16px",
  margin: "3px",
  bgcolor: "#e8e9ea",
  borderRadius: "10px",
  minWidth: "100px",
  maxWidth: "100%",
  minHeight: "100vh", // 🔥 Altura mínima sempre 100% da tela
  height: "auto", // 🔥 Cresce conforme necessário
  flexGrow: 1, // 🔥 Permite expansão
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  width: "100%",
};
const cardStyle = {
  p: 1,
  bgcolor: "#fff",

  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
};

export default Kanban;
