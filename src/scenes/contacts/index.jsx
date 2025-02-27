import React, { useState, useEffect   } from "react";
import { Box, Button, IconButton, useTheme, Typography, Modal, Icon } from "@mui/material";
import { Link } from 'react-router-dom';
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { dbFokus360 } from "../../data/firebase-config"; // ✅ Certifique-se de que o caminho está correto


import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';


// Tradução dos textos da Toolbar
const localeText = {
  toolbarColumns: "Colunas",
  toolbarFilters: "Filtros",
  toolbarDensity: "Densidade",
  toolbarExport: "Exportar",
};




// Barra de ferramentas personalizada
const CustomToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{
        padding: "8px",
        borderRadius: "5px",
        backgroundColor: "#f4f6f8",
        marginBottom: "10px",
      }}
    >
      <GridToolbarColumnsButton
        sx={{
          color: "#727681",
          "&:hover": {
            color: "#3f51b5",
          },
        }}
      />
      <GridToolbarFilterButton
        sx={{
          color: "#727681",
          "&:hover": {
            color: "#3f51b5",
          },
        }}
      />
      <GridToolbarDensitySelector
        sx={{
          color: "#727681",
          "&:hover": {
            color: "#3f51b5",
          },
        }}
      />
      <GridToolbarExport
        sx={{
          color: "#727681",
          "&:hover": {
            color: "#3f51b5",
          },
        }}
      />
    </GridToolbarContainer>
  );
};

const Contacts = () => {
  const [users, setUsers] = useState([]); // Estado para armazenar os usuários
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null); // ID do usuário a ser deletado
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal



   // Abrir o modal e definir o ID do usuário
   const handleOpenModal = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  // Fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };
  

  // Função para buscar os usuários no Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!dbFokus360) {
          console.error("⚠️ Erro: dbFokus360 não foi inicializado corretamente.");
          return;
        }
  
        const querySnapshot = await getDocs(collection(dbFokus360, "user")); // Certifique-se do nome correto
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // O DataGrid exige que o campo ID seja 'id'
          ...doc.data(),
        }));
  
        if (userList.length === 0) {
          console.warn("⚠️ Nenhum usuário encontrado na coleção 'users'.");
        }
  
        setUsers(userList);
      } catch (error) {
        console.error("❌ Erro ao buscar usuários do Firestore:", error.message);
      }
    };
  
    fetchUsers();
  }, []);
  

//lógica de exclusão do documento no Firestore.
const handleConfirmDelete = async () => {
  if (!selectedUserId) {
    alert("Erro: Nenhum usuário selecionado para exclusão.");
    return;
  }

  try {
    console.log(`🛠️ Tentando excluir usuário com UID: ${selectedUserId}`);

    const response = await fetch(`${import.meta.env.VITE_FOKUS360_DATABASEURL}/delete-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: selectedUserId }),
    });

    if (response.ok) {
      try {
        await response.json(); // Tenta parsear o JSON se houver
      } catch {
        console.warn("⚠️ API retornou uma resposta sem JSON, mas foi bem-sucedida.");
      }

      // Atualizar a lista local de usuários após a exclusão bem-sucedida
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUserId));

      alert("Usuário excluído com sucesso!");
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao excluir usuário via API.");
    }
  } catch (apiError) {
    console.error("❌ Erro ao excluir usuário via API:", apiError.message);
    alert(`Erro ao excluir usuário: ${apiError.message}`);

    // 🛠️ Tentativa alternativa: excluir diretamente do Firestore caso a API falhe
    try {
      console.log("🔄 Tentando excluir usuário diretamente do Firestore...");
      await deleteDoc(doc(dbFokus360, "user", selectedUserId)); // 🔹 Usando dbFokus360 corretamente

      // Atualizar a lista local de usuários
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUserId));

      alert("Usuário excluído diretamente do banco de dados.");
    } catch (firestoreError) {
      console.error("❌ Falha ao excluir usuário do Firestore:", firestoreError.message);
      alert("Erro ao excluir usuário do Firestore. Tente novamente mais tarde.");
    }
  }

  handleCloseModal();
};






  


const columns = [
  {
    field: "avatar",
    headerName: "Foto",
    flex: 0.5, // Ajusta o tamanho da coluna
    renderCell: ({ row }) => (
      <Avatar
        src={row.photoURL || "/default-avatar.png"} // URL padrão caso photoURL não exista
        alt={row.username || "Usuário"}
        sx={{
          bgcolor: row.photoURL ? "transparent" : "#9e9e9e", // Fundo cinza apenas se não houver foto
          width: 32,
          height: 32,
          fontSize: "14px",
          border: "2px solid #312783", // Adiciona a borda com a cor especificada
        }}
      >
        {row.photoURL ? "" : row.username?.charAt(0).toUpperCase() || "U"} {/* Exibe inicial se não houver foto */}
      </Avatar>
    ),
  },

  /** 
  
  {
    field: "id",
    headerName: "ID",
    flex: 1,
  },

  */
  {
    field: "username",
    headerName: "Nome",
    flex: 1,
    cellClassName: "name-column--cell",
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1.5,
  },
  {
    field: "role",
    headerName: "Perfil",
    flex: 0.4,
  },
  {
    field: "unidade",
    headerName: "Unidade",
    flex: 1,
  },
  {
    field: "actions",
    headerName: "Ações",
    flex: 1,
    renderCell: ({ row }) => (
      <Box display="flex" gap={1}>
        {/* Botão Editar */}
        <IconButton
          onClick={() => navigate(`/usuario/editar?id=${row.id}`)} // Certifique-se de que o ID do usuário está sendo passado
          sx={{
            color: "#9d9d9c",
            width: "45px",
            height: "auto",
          }}
        >
          <EditIcon sx={{ fontSize: "20px" }} />
        </IconButton>



        {/* Botão Excluir */}
        <IconButton
          onClick={() => handleOpenModal(row.id)} // Abre o modal para exclusão
          sx={{
            color: "#d32f2f",
            width: "45px",
            height: "auto",
          }}
        >
          <DeleteForeverSharpIcon sx={{ fontSize: "25px" }} />
        </IconButton>
      </Box>
    ),
  },
];



const handleEdit = (id) => {
  //console.log(`Editar usuário com ID: ${id}`);
  navigate(`/usuario/editar?id=${id}`); // Redireciona para a página de edição com o ID
};

  

  return (
    <>
    {/* Modal de Confirmação */}
    <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "white",
            p: 4,
            borderRadius: 4,
            boxShadow: 24,
            textAlign: "center",
            backgroundColor: "#d32f2f",
            color: "#fff",
          }}
        >
          {/* Ícone no topo */}
          <Box display="flex" justifyContent="center" mb={2}>
            <ReportProblemIcon sx={{ fontSize: 40, color: "#ffeb3b" }} /> {/* Ícone amarelo */}
          </Box>

          <Typography variant="h6" mb={2}>
            Confirmar Exclusão
          </Typography>
          <Typography variant="body2" mb={4}>
            Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita.
          </Typography>
          <Box display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              sx={{
                boxShadow: "none", // Remove sombra
                border: "none",    // Remove borda
                "&:hover": {
                  boxShadow: "none", // Garante que também não tenha sombra no hover
                },
              }}
            >
              SIM
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              sx={{
                color: "#fff",
                border: "none", // Remove borda
                "&:hover": {
                  border: "none", // Garante que também não tenha borda no hover
                },
              }}
            >
              NÃO
            </Button>
          </Box>
        </Box>
      </Modal>

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
              <PermContactCalendarIcon
                sx={{ color: "#5f53e5", fontSize: 40 }}
              />
              <Typography>GERENCIADOR DE USUÁRIOS</Typography>
            </Box>
          }
        />
      </Box>



      {/* Botão voltar painel de projetos */}

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          component={Link}
          to="/cadastro"
          variant="contained"
          color="primary"
          sx={{
            marginRight: "70px",
            fontSize: "10px",
            fontWeight: "bold",
            borderRadius: "5px",
            padding: "10px 20px",
            backgroundColor: "#3f2cb2",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#3f2cb2" },
          }}
        >
          NOVO USUÁRIO
        </Button>
      </Box>

      <Box m="45px">
        <Box
          height="75vh"
          width="100%"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { border: "none" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#312783",
              color: "#bcbcbc",
              fontSize: "13px",
            },
          }}
        >
          <DataGrid
            rows={users} // Usando o estado com dados do Firestore
            columns={columns}
            components={{ Toolbar: CustomToolbar }}
            localeText={localeText}
            pageSizeOptions={[5, 10, 25, 50]} // Inclui 10 como uma das opções
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            //checkboxSelection
          />
        </Box>
      </Box>
    </>
  );
};

export default Contacts;
