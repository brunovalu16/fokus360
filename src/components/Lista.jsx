import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import { mockDataProjects } from "../data/mockData";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import { useTheme } from "@mui/material/styles";


// Tradução dos textos da Toolbar e rodapé
const localeText = {
  toolbarColumns: "Colunas",
  toolbarFilters: "Filtros",
  toolbarDensity: "Densidade",
  toolbarExport: "Exportar",
  footerRowSelected: (count) => (count === 1 ? `` : ``),
  footerTotalRows: "Linhas totais:",
  footerPaginationRowsPerPage: "Linhas por página:",
};

// Barra de ferramentas personalizada
const CustomToolbar = () => (
  <GridToolbarContainer
  sx={{
    padding: "8px",
    borderRadius: "5px",
    backgroundColor: "#f4f6f8",
    marginBottom: "10px",
    overflow: "visible", // Garante que o conteúdo extrapole os limites do contêiner
    position: "relative", // Define o contexto posicional
    zIndex: 1, // Eleva o contêiner para evitar sobreposição de outros elementos
  }}
>
  <GridToolbarColumnsButton
    sx={{
      color: "#727681",
      "&:hover": { color: "#3f51b5" },
      zIndex: 2, // Garante que o botão fique acima de outros elementos
    }}
  />
  <GridToolbarFilterButton
  sx={{
    paddingTop: "10px",
    color: "#727681",
    "&:hover": { color: "#3f51b5" },
    overflow: "visible", // Garante que o conteúdo extrapole
    position: "relative", // Contexto posicional para o tooltip
  }}
/>

  <GridToolbarExport
    sx={{
      color: "#727681",
      "&:hover": { color: "#3f51b5" },
      zIndex: 2, // Eleva o botão exportar também
    }}
  />
</GridToolbarContainer>


);

const Lista = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [checkedRows, setCheckedRows] = useState({});

  const handleDelete = (id) => console.log(`Excluir projeto com ID: ${id}`);
  const handleNavigateToProject = (id) => navigate(`/projeto?id=${id}`);
  const handleCheckboxChange = (id, isChecked) =>
    setCheckedRows((prev) => ({ ...prev, [id]: isChecked }));

  const columns = [
    {
      field: "name",
      headerName: "Nome do projeto",
      flex: 1.1,
      cellClassName: "name-column--cell",
    },
    { field: "solicitante", headerName: "Solicitante", flex: 1 },
    {
      field: "startDate",
      headerName: "Início",
      flex: 0.8,
      renderCell: (params) => {
        const [day, month, year] = params.row.startDate.split("/");
        const [deadlineDay, deadlineMonth, deadlineYear] = params.row.deadline.split("/");

        const startDate = new Date(Date.UTC(year, month - 1, day));
        const deadlineDate = new Date(
          Date.UTC(deadlineYear, deadlineMonth - 1, deadlineDay)
        );

        let backgroundColor;

        if (startDate > deadlineDate) {
          backgroundColor = "#f44336";
        } else if (startDate.getTime() === deadlineDate.getTime()) {
          backgroundColor = "#3f51b5";
        } else if ((deadlineDate - startDate) / (1000 * 60 * 60 * 24) <= 2) {
          backgroundColor = "#FFC107";
        } else {
          backgroundColor = "#4CAF50";
        }

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              maxWidth: "100%",
              minWidth: "100%",
              justifyContent: "flex-start",
              fontWeight: "bold",
            }}
          >
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: backgroundColor || "#583cff",
                marginRight: "5px",
              }}
            />
            {startDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
          </Box>
        );
      },
    },
    {
      field: "deadline",
      headerName: "Prazo previsto",
      flex: 0.8,
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
      flex: 0.9,
      renderCell: (params) => {
        const currentSpending = parseFloat(
          params.row.currentSpending.replace(/[^0-9.-]+/g, "")
        );
        const budget = parseFloat(params.row.budget.replace(/[^0-9.-]+/g, ""));

        let backgroundColor = "#4CAF50";
        if (currentSpending === budget) backgroundColor = "#583cff";
        else if (currentSpending >= budget) backgroundColor = "#f44336";
        else if (currentSpending >= budget * 0.8) {
          backgroundColor = "#FFC107";
        }

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              maxWidth: "100%",
              minWidth: "100%",
              justifyContent: "flex-start",
              fontWeight: "bold",
            }}
          >
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: backgroundColor || "#583cff",
                marginRight: "5px",
              }}
            />
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
      renderCell: (params) => (
        <Box>
          {parseFloat(params.row.budget.replace(/[^0-9.-]+/g, "")).toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL",
            }
          )}
        </Box>
      ),
    },
    {
      field: "active",
      headerName: "Ativo",
      flex: 0.4,
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!checkedRows[params.row.id]}
              onChange={(event) =>
                handleCheckboxChange(params.row.id, event.target.checked)
              }
              sx={{ color: "#312783", "&.Mui-checked": { color: "#312783" } }}
            />
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 0.9,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
              size="small"
              component="a" // Define que o botão será um link
              href="/dashboardprojeto" // Caminho do link
              sx={{
                color: "#fff",
                backgroundColor: "#583cff",
                marginBottom: "5px",
                marginTop: "5px",
                fontSize: "0.65rem",
                "&:hover": { backgroundColor: "#3f2cb2" },
                textDecoration: "none", // Remove sublinhado padrão do link
              }}
            >
              Editar
        </Button>

          <IconButton onClick={() => handleDelete(row.id)}>
            <DeleteForeverSharpIcon
              sx={{ fontSize: 25, color: colors.redAccent[600] }}
            />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>

      <DataGrid
        rows={mockDataProjects}
        columns={columns}
        components={{ Toolbar: CustomToolbar }}
        localeText={localeText}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        sx={{
          marginLeft: "-13px",
          marginTop: "5px",
          width: "calc(100% - -10px)",
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
      />
    </>
  );
};

export default Lista;
