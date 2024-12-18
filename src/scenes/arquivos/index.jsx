import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, useTheme, Typography } from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import Modal from "../../components/Modal";
import { db, storage } from "../../data/firebase-config"; // Firestore e Storage
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; 
import { ref, deleteObject } from "firebase/storage"; 
import TopicIcon from '@mui/icons-material/Topic';

const localeText = {
  toolbarColumns: "Colunas",
  toolbarFilters: "Filtros",
  toolbarDensity: "Densidade",
  toolbarExport: "Exportar",
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
  const [isModalOpen, setModalOpen] = useState(false);
  const [filesData, setFilesData] = useState([]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const fetchFiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "arquivos"));
      const files = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFilesData(files);
      console.log(files);
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

      const fileRef = ref(storage, `arquivos/${fileToDelete.fileName}`);
      await deleteObject(fileRef); // Exclui do Storage

      await deleteDoc(doc(db, "arquivos", id)); // Exclui do Firestore

      setFilesData((prev) => prev.filter((file) => file.id !== id));
      alert("Arquivo deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      alert("Erro ao excluir o arquivo.");
    }
  };

  useEffect(() => {
    fetchFiles();
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
    { field: "fileName", headerName: "Nome do Arquivo", flex: 1 },
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
