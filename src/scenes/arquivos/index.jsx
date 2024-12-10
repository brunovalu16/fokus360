import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
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
    { field: "uploadedBy", headerName: "Nome do Usuário", flex: 1 },
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
              borderRadius: "5px",
              padding: "5px",
              fontSize: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            Download
          </Button>
          <IconButton
            onClick={() => handleDelete(row.id)}
            sx={{
              color: "#d32f2f",
              width: "36px",
              height: "36px",
            }}
          >
            <DeleteForeverSharpIcon
              disableRipple
              sx={{
                fontSize: "28px",
                marginLeft: "70px",
                color: colors.redAccent[600],
                ":hover": { color: "#db4f4a", background: "none" },
              }}
            />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="40px">
      <Header title="GERENCIADOR DE ARQUIVOS" subtitle="Gerenciador de arquivos do sistema Fokus 360" />

      <Box
        mt="40px"
        height="auto"
        width="95%"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { border: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.gray[900] },
          "& .MuiCheckbox-root": { color: `${colors.blueAccent[1300]} !important` },
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
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
        />
      </Box>

      <Modal open={isModalOpen} onClose={handleCloseModal} onFileUploaded={fetchFiles} />
    </Box>
  );
};

export default Arquivos;
