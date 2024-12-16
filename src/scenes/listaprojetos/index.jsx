import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  useTheme,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import { mockDataProjects } from "../../data/mockData";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";

// Tradução dos textos da Toolbar
const localeText = {
  toolbarColumns: "Colunas",
  toolbarFilters: "Filtros",
  toolbarDensity: "Densidade",
  toolbarExport: "Exportar",
};

// Barra de ferramentas personalizada
const CustomToolbar = () => (
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

const ListaProjetos = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Estado para gerenciar os checkboxes
  const [checkedRows, setCheckedRows] = useState({});

  const handleDelete = (id) => {
    console.log(`Excluir projeto com ID: ${id}`);
  };

  const handleNavigateToProject = (id) => {
    navigate(`/projeto?id=${id}`);
  };

  const handleCheckboxChange = (id, isChecked) => {
    setCheckedRows((prev) => ({
      ...prev,
      [id]: isChecked,
    }));
    console.log(`Projeto ${id} ativo: ${isChecked}`);
  };

  const columns = [
    {
      field: "name",
      headerName: "Nome do projeto",
      flex: 1.1,
      cellClassName: "name-column--cell",
    },
    {
      field: "solicitante",
      headerName: "Solicitante",
      flex: 1,
    },
    {
      field: "startDate",
      headerName: "Início",
      flex: 0.5,
    },
    {
      field: "deadline",
      headerName: "Prazo previsto",
      flex: 1,
    },
    {
      field: "currentSpending",
      headerName: "Gasto atual",
      flex: 0.7,
      renderCell: (params) => {
        const currentSpending = parseFloat(params.row.currentSpending.replace(/[^0-9.-]+/g, ""));
        const budget = parseFloat(params.row.budget.replace(/[^0-9.-]+/g, ""));
    
        let backgroundColor = "#4CAF50"; // Verde por padrão
        let textColor = "#fff";
    
        if (currentSpending >= budget) {
          backgroundColor = "#f44336"; // Vermelho
        } else if (currentSpending >= budget * 0.8) {
          backgroundColor = "#FFC107"; // Amarelo
          textColor = "#000";
        }
    
        return (
          <Box
            sx={{
              backgroundColor,
              color: textColor,
              padding: "5px 10px",
              borderRadius: "5px",
              textAlign: "center",
              fontWeight: "bold",
              display: "inline-block",
              minWidth: "80px",
            }}
          >
            {currentSpending.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Box>
        );
      },
    },
    {
      field: "budget",
      headerName: "Orçamento",
      flex: 0.7,
      renderCell: (params) => {
        const budget = parseFloat(params.row.budget.replace(/[^0-9.-]+/g, ""));
    
        return (
          <Box>
            {budget.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Box>
        );
      },
    },
    
    {
      field: "active",
      headerName: "Ativo",
      flex: 0.5,
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!checkedRows[params.row.id]}
              onChange={(event) =>
                handleCheckboxChange(params.row.id, event.target.checked)
              }
              name={`checkbox-${params.row.id}`}
              sx={{
                color: "#312783",
                "&.Mui-checked": {
                  color: "#312783",
                },
              }}
            />
          }
          sx={{ color: "#858585", marginLeft: "5px" }}
        />
      ),
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
            onClick={() => handleNavigateToProject(row.id)}
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
              color: colors.redAccent[600],
              width: "36px",
              height: "36px",
            }}
          >
            <DeleteForeverSharpIcon sx={{ fontSize: 25 }} />
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
              <PermContactCalendarIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
              <Typography>GERENCIADOR DE PROJETOS</Typography>
            </Box>
          }
        />
      </Box>

      <Box m="45px">
        <Box
          mt="40px"
          marginTop="-2px"
          height="75vh"
          width="100%"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { border: "none" },
            "& .name-column--cell": { color: colors.gray[100] },
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
          <DataGrid
            rows={mockDataProjects}
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
      </Box>
    </>
  );
};

export default ListaProjetos;
