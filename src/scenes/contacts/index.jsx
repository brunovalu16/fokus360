import React from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { mockDataContacts } from "../../data/mockData";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";

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
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    console.log(`Excluir usuário com ID: ${id}`);
  };

  const handleNavigateToUser = (id) => {
    navigate(`/usuario?id=${id}`);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "registrarId", headerName: "Registrar ID" },
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Telefone",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "city",
      headerName: "Unidade",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            startIcon={<ArrowForwardIcon />}
            onClick={() => handleNavigateToUser(row.id)}
            sx={{
              color: "#fff",
              backgroundColor: "#583cff",
              "&:hover": {
                backgroundColor: "#3f2cb2",
              },
              borderRadius: "5px",
              padding: "5px 10px",
            }}
          >
            Editar
          </Button>
          <IconButton
            onClick={() => handleDelete(row.id)}
            sx={{
              color: "#d32f2f",
              width: "36px",
              height: "36px",
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="USUÁRIOS" subtitle="Lista de usuários cadastrados no sistema" />
      <Box
        mt="40px"
        height="75vh"
        width="100%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .name-column--cell": {
            color: colors.gray[100],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.gray[900],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.blueAccent[1300]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
        }}
      >
        <DataGrid
          rows={mockDataContacts}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          localeText={localeText} // Aplica as traduções para português
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Contacts;
