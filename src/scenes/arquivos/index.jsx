import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, useTheme, Typography } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import Modal from "../../components/Modal";
import { dbFokus360, storageFokus360 } from "../../data/firebase-config";

import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";



import { authFokus360 } from "../../data/firebase-config";
import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore"; 
import { ref, deleteObject } from "firebase/storage"; 
import TopicIcon from '@mui/icons-material/Topic';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const localeText = {
  toolbarColumns: "Colunas",
  toolbarFilters: "Filtros",
  toolbarDensity: "Densidade",
  toolbarExport: "Exportar",
};

const roleToLabelMap = {
  "37": "Ajinomoto",
  "38": "AB Mauri",
  "39": "Adoralle",
  "40": "Bettanin",
  "41": "Mars Choco",
  "42": "Mars Pet",
  "43": "M.Dias",
  "44": "SCJhonson",
  "47": "Ypê",
};





const CustomToolbar = () => (
  <GridToolbarContainer
    sx={{
      padding: "8px",
      borderRadius: "5px",
      backgroundColor: "#f4f6f8",
      marginBottom: "10px",
    }}
  >
    <GridToolbarColumnsButton sx={{ color: "#727681", "&:hover": { color: "#3f51b5" } }} />
    <GridToolbarFilterButton sx={{ color: "#727681", "&:hover": { color: "#3f51b5" } }} />
    <GridToolbarDensitySelector sx={{ color: "#727681", "&:hover": { color: "#3f51b5" } }} />
    <GridToolbarExport sx={{ color: "#727681", "&:hover": { color: "#3f51b5" } }} />
  </GridToolbarContainer>
);

const Arquivos = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const location = useLocation(); // ✅ hook dentro do componente
  const queryParams = new URLSearchParams(location.search);
  const areaFiltrada = queryParams.get("area");
  const roleFiltrada = queryParams.get("role");


  const [isModalOpen, setModalOpen] = useState(false);
  const [filesData, setFilesData] = useState([]);
 

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);


const [userRole, setUserRole] = useState(null);

const [role, setRole] = useState("");
const [loading, setLoading] = useState(true);

const isRestricted = Object.keys(roleToLabelMap).includes(role);



const fetchFiles = async () => {
  try {
    const querySnapshot = await getDocs(collection(dbFokus360, "arquivos"));
    const files = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Aplica filtro se a área vier na URL
    const filtrados = roleFiltrada
      ? files.filter((file) => file.role === roleFiltrada)
      : areaFiltrada
      ? files.filter((file) => file.area === areaFiltrada)
      : files;


    setFilesData(filtrados);
  } catch (error) {
    console.error("Erro ao buscar arquivos:", error);
  }
};




  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este arquivo?");
    if (!confirmDelete) return;

    try {
      const fileToDelete = filesData.find((file) => file.id === id);
      if (!fileToDelete) {
        alert("Arquivo não encontrado.");
        return;
      }

      const fileRef = ref(storageFokus360, `arquivos/${fileToDelete.fileName}`);
      await deleteObject(fileRef); // Exclui do Storage

      await deleteDoc(doc(dbFokus360, "arquivos", id)); // Exclui do Firestore

      setFilesData((prev) => prev.filter((file) => file.id !== id));
      alert("Arquivo deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      alert("Erro ao excluir o arquivo.");
    }
  };

  useEffect(() => {
  fetchFiles();
}, [location.search]);


//Busca o role do usuário logado no useEffect
useEffect(() => {
  const unsubscribe = onAuthStateChanged(authFokus360, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(dbFokus360, "user", user.uid));
      if (userDoc.exists()) {
        const dados = userDoc.data();
        setRole(dados.role);
      }
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);




  const columns = [
    {
      field: "uploadedBy",
      headerName: "Nome do Usuário",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography style={{ fontWeight: "bold" }}>{row.uploadedBy}</Typography>
      ),
    },
    //{ field: "fileName", headerName: "Nome do Arquivo", flex: 1 },
    { field: "fileType", headerName: "Tipo de Arquivo", flex: 1 },
    { field: "state", headerName: "Unidade", flex: 1 },
    {
      field: "fileURL",
      headerName: "Ações",
      flex: 1.3,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            href={row.fileURL}
            target="_blank"
            disableRipple
            sx={{
              color: "#fff",
              backgroundColor: "#583cff",
              "&:hover": { backgroundColor: "#3f2cb2" },
              fontSize: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              marginTop: "8px",
              marginBottom: "8px",
            }}
          >
            Download
          </Button>

          <IconButton onClick={() => handleDelete(row.id)}>
            <DeleteForeverSharpIcon
              disableRipple
              sx={{ fontSize: "28px", color: colors.redAccent[600] }}
            />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <Box sx={{ marginLeft: "40px", paddingTop: "50px" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <TopicIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
              <Typography>GERENCIADOR DE ARQUIVOS</Typography>
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
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { border: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#312783",
            color: "#bcbcbc",
            fontSize: "13px",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.gray[900],
          },
        }}
      >

        
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Box>
              <Button
                component={Link}
                to="/painelindustriastrade"
                startIcon={<ExitToAppIcon sx={{ color: "#5f53e5", marginRight: "-7px", marginTop: "-3px" }} />}
                sx={{
                  padding: "5px 10px",
                  fontSize: "13px",
                  color: "#858585",
                  marginRight: "20px",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Voltar
              </Button>
            </Box>


          {!loading && !isRestricted && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              sx={{
                fontSize: "10px",
                fontWeight: "bold",
                borderRadius: "5px",
                padding: "10px 20px",
                backgroundColor: colors.blueAccent[1000],
                boxShadow: "none",
                "&:hover": { backgroundColor: "#3f2cb2" },
              }}
            >
              Adicionar Arquivo
            </Button>
          )}


        </Box>

        <DataGrid
          rows={filesData}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          localeText={localeText}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
        />
      </Box>

      <Modal open={isModalOpen} onClose={handleCloseModal} onFileUploaded={fetchFiles} />
    </>
  );
};

export default Arquivos;
