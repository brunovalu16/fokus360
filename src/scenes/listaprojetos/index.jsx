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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { Header } from "../../components";
import { mockDataProjects } from "../../data/mockData";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";

// Tradução dos textos da Toolbar e rodapé
const localeText = {
  toolbarColumns: "Colunas",
  toolbarFilters: "Filtros",
  toolbarDensity: "Densidade",
  toolbarExport: "Exportar",
  footerRowSelected: (count) =>
    count === 1 ? `${count} linha selecionada` : `${count} linhas selecionadas`,
  footerTotalRows: "Linhas totais:",
  footerPaginationRowsPerPage: "Linhas por página:",
  footerPagination: (page, pageCount) => `${page}–${pageCount} de ${pageCount}`,
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
    <GridToolbarColumnsButton sx={{ color: "#727681", "&:hover": { color: "#3f51b5" } }} />
    <GridToolbarFilterButton sx={{ color: "#727681", "&:hover": { color: "#3f51b5" } }} />
    <GridToolbarDensitySelector sx={{ color: "#727681", "&:hover": { color: "#3f51b5" } }} />
    <GridToolbarExport sx={{ color: "#727681", "&:hover": { color: "#3f51b5" } }} />
  </GridToolbarContainer>
);

const ListaProjetos = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [checkedRows, setCheckedRows] = useState({});

  const handleDelete = (id) => console.log(`Excluir projeto com ID: ${id}`);
  const handleNavigateToProject = (id) => navigate(`/projeto?id=${id}`);
  const handleCheckboxChange = (id, isChecked) =>
    setCheckedRows((prev) => ({ ...prev, [id]: isChecked }));

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Evita erros com datas vazias
  
    const [day, month, year] = dateString.split("/"); // Divide no formato dd/mm/yyyy
    const parsedDate = new Date(`${year}-${month}-${day}`); // Cria a data no formato yyyy-mm-dd
  
    if (isNaN(parsedDate)) return "Data Inválida"; // Verifica se a data é válida
  
    return parsedDate.toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
  };
  

  const columns = [
    { field: "name",
      headerName: "Nome do projeto",
      flex: 1.1,
      cellClassName: "name-column--cell"
    },

    { field: "solicitante",
      headerName: "Solicitante",
      flex: 1
    },
    {
      field: "startDate",
      headerName: "Início",
      flex: 0.8,
      renderCell: (params) => {
        const [day, month, year] = params.row.startDate.split("/");
        const [deadlineDay, deadlineMonth, deadlineYear] = params.row.deadline.split("/");
  
        const startDate = new Date(Date.UTC(year, month - 1, day));
        const deadlineDate = new Date(Date.UTC(deadlineYear, deadlineMonth - 1, deadlineDay));
  
        let backgroundColor;
  
        // Corrige a lógica para identificar as datas passadas
        if (startDate > deadlineDate) {
          backgroundColor = "#f44336"; // Vermelho (startDate passou do prazo deadline)
        } else if (startDate.getTime() === deadlineDate.getTime()) {
          backgroundColor = "#3f51b5"; // Azul (datas iguais)
        } else if ((deadlineDate - startDate) / (1000 * 60 * 60 * 24) <= 2) {
          backgroundColor = "#FFC107"; // Amarelo (próximo do deadline)
        } else {
          backgroundColor = "#4CAF50"; // Verde (dentro do prazo)
        }
  
        return (
          <Box
            sx={{
              backgroundColor,
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "5px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {startDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
          </Box>
        );
      },
    },
    {
      field: "deadline",
      headerName: "Prazo previsto",
      flex: 0.5,
      renderCell: (params) => {
        const [day, month, year] = params.value.split("/");
        const deadlineDate = new Date(Date.UTC(year, month - 1, day));
  
        return (
          <Box>
            {deadlineDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
          </Box>
        );
      },
    },
    
    {
      field: "currentSpending",
      headerName: "Gasto atual",
      flex: 0.8,
      renderCell: (params) => {
        const currentSpending = parseFloat(params.row.currentSpending.replace(/[^0-9.-]+/g, ""));
        const budget = parseFloat(params.row.budget.replace(/[^0-9.-]+/g, ""));

        let backgroundColor = "#4CAF50";
        let textColor = "#fff";
        if (currentSpending === budget) backgroundColor = "#583cff";
        else if (currentSpending >= budget) backgroundColor = "#f44336";
        else if (currentSpending >= budget * 0.8) {
          backgroundColor = "#FFC107";
          textColor = "#000";
        }

        const formatDate = (dateString) => {
          const [day, month, year] = dateString.split("/");
          const formattedDate = new Date(`${year}-${month}-${day}`); // ISO format
          return formattedDate.toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
        };
        

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
            {currentSpending.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </Box>
        );
      },
    },
    {
      field: "budget",
      headerName: "Orçamento",
      flex: 0.7,
      renderCell: (params) => (
        <Box>
          {parseFloat(params.row.budget.replace(/[^0-9.-]+/g, "")).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Box>
      ),
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
              onChange={(event) => handleCheckboxChange(params.row.id, event.target.checked)}
              sx={{ color: "#312783", "&.Mui-checked": { color: "#312783" } }}
            />
          }
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
            onClick={() => handleNavigateToProject(row.id)}
            sx={{ color: "#fff", backgroundColor: "#583cff", "&:hover": { backgroundColor: "#3f2cb2" } }}
          >
            Editar
          </Button>
          <IconButton onClick={() => handleDelete(row.id)}>
            <DeleteForeverSharpIcon sx={{ fontSize: 25, color: colors.redAccent[600] }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
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
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#312783",
            color: "#bcbcbc",
            fontSize: "13px",
          },
        }}
      >
        <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
            variant="contained"
            color="primary"
            onClick={""}
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
            Novo projeto
          </Button>
        </Box>
        <DataGrid
          rows={mockDataProjects}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          localeText={localeText}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        />
      </Box>
    </>
  );
};

export default ListaProjetos;
