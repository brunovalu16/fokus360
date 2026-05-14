import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Modal,
  Paper,
  Avatar,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";

import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import EditIcon from "@mui/icons-material/Edit";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import BusinessIcon from "@mui/icons-material/Business";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupsIcon from "@mui/icons-material/Groups";

import { collection, getDocs } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config";

const localeText = {
  toolbarColumns: "Colunas",
  toolbarFilters: "Filtros",
  toolbarDensity: "Densidade",
  toolbarExport: "Exportar",
};

const CustomToolbar = () => (
  <GridToolbarContainer sx={toolbarStyle}>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const Contacts = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleOpenModal = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(dbFokus360, "user"));

      const userList = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setUsers(userList);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_FOKUS360_DATABASEURL}/delete-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: selectedUserId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao excluir usuário.");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUserId)
      );

      alert(data.message);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error.message);
      alert(`Erro ao excluir usuário: ${error.message}`);
    }

    handleCloseModal();
  };

  const columns = [
    {
      field: "avatar",
      headerName: "Foto",
      minWidth: 90,
      flex: 0.45,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Avatar
          src={row.photoURL || ""}
          alt={row.username || "Usuário"}
          sx={{
            bgcolor: row.photoURL ? "transparent" : "#312783",
            width: 38,
            height: 38,
            fontSize: 14,
            fontWeight: 900,
            border: "2px solid rgba(49,39,131,0.35)",
            borderRadius: "13px",
          }}
        >
          {row.photoURL ? "" : row.username?.charAt(0).toUpperCase() || "U"}
        </Avatar>
      ),
    },
    {
      field: "username",
      headerName: "Nome",
      minWidth: 180,
      flex: 1,
      renderCell: ({ row }) => (
        <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: 13 }}>
          {row.username || "Não informado"}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 240,
      flex: 1.4,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: "#475569",
            fontSize: 13,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.email || "Não informado"}
        </Typography>
      ),
    },
    {
      field: "role",
      headerName: "Perfil",
      minWidth: 110,
      flex: 0.55,
      renderCell: ({ row }) => (
        <Chip
          size="small"
          icon={<AdminPanelSettingsIcon sx={{ fontSize: "16px !important" }} />}
          label={String(row.role || "--").padStart(2, "0")}
          sx={roleChipStyle}
        />
      ),
    },
    {
      field: "unidade",
      headerName: "Unidade",
      minWidth: 170,
      flex: 1,
      renderCell: ({ row }) => (
        <Typography sx={{ fontWeight: 700, color: "#475569", fontSize: 13 }}>
          {row.unidade || "Não informado"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      minWidth: 140,
      flex: 0.7,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Editar usuário">
            <IconButton
              onClick={() => navigate(`/usuario/editar?id=${row.id}`)}
              sx={editButtonStyle}
            >
              <EditIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir usuário">
            <IconButton onClick={() => handleOpenModal(row.id)} sx={deleteButtonStyle}>
              <DeleteForeverSharpIcon sx={{ fontSize: 23 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={pageStyle}>
      <Modal open={isModalOpen} onClose={handleCloseModal} sx={modalOverlayStyle}>
        <Box sx={modalBoxStyle}>
          <Box sx={modalIconBoxStyle}>
            <ReportProblemIcon sx={{ fontSize: 42, color: "#facc15" }} />
          </Box>

          <Typography sx={modalTitleStyle}>Confirmar Exclusão</Typography>

          <Typography sx={modalTextStyle}>
            Tem certeza que deseja excluir este usuário? Essa ação não pode ser
            desfeita.
          </Typography>

          <Box sx={modalActionsStyle}>
            <Button onClick={handleConfirmDelete} sx={modalConfirmButtonStyle}>
              Sim, excluir
            </Button>

            <Button onClick={handleCloseModal} sx={modalCancelButtonStyle}>
              Não
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={pageInnerStyle}>
        <Box sx={headerStyle}>
          <Header
            title={
              <Box sx={titleGroupStyle}>
                <Box sx={mainIconStyle}>
                  <PermContactCalendarIcon sx={{ color: "#fff", fontSize: 28 }} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={eyebrowStyle}>Gerenciador</Typography>

                  <Typography sx={pageTitleStyle}>Usuários do Sistema</Typography>
                </Box>
              </Box>
            }
          />

          <Box sx={actionsWrapperStyle}>
            <Button
              component={Link}
              to="/cadastro"
              variant="contained"
              startIcon={<PersonAddAlt1Icon />}
              sx={primaryButtonStyle}
            >
              Novo Usuário
            </Button>

            <Button
              component={Link}
              to="/cadastroareas"
              variant="contained"
              startIcon={<BusinessIcon />}
              sx={secondaryButtonStyle}
            >
              Criar Áreas / Unidades
            </Button>
          </Box>
        </Box>

        <Box sx={mainCardStyle}>
          <Box sx={topBarStyle} />

          <Box sx={contentStyle}>
            <Box sx={sectionHeaderStyle}>
              <Box sx={titleGroupStyle}>
                <Box sx={sectionIconStyle}>
                  <GroupsIcon />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={eyebrowStyle}>Painel Administrativo</Typography>

                  <Typography sx={sectionTitleStyle}>Lista de Usuários</Typography>

                  <Typography sx={sectionSubtitleStyle}>
                    Gerencie usuários, perfis, unidades e permissões cadastradas.
                  </Typography>
                </Box>
              </Box>

              <Chip
                icon={<GroupsIcon sx={{ color: "#312783 !important" }} />}
                label={`${users.length} usuário(s)`}
                sx={counterChipStyle}
              />
            </Box>

            <Divider sx={{ mb: 3, borderColor: "rgba(148,163,184,0.25)" }} />

            <Paper elevation={0} sx={gridCardStyle}>
              <Box sx={hardViewportStyle}>
                <DataGrid
                  rows={users}
                  columns={columns}
                  slots={{ toolbar: CustomToolbar }}
                  localeText={localeText}
                  disableRowSelectionOnClick
                  pageSizeOptions={[5, 10, 25, 50]}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  sx={dataGridStyle}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const pageStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  boxSizing: "border-box",
  overflow: "hidden",
  isolation: "isolate",
  contain: "inline-size layout paint",
  px: { xs: 1.5, sm: 2, md: 4 },
  pt: { xs: 3, md: 5 },
  pb: 4,
};

const pageInnerStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  overflow: "hidden",
  boxSizing: "border-box",
  contain: "inline-size layout paint",
};

const headerStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  display: "flex",
  alignItems: { xs: "flex-start", lg: "center" },
  justifyContent: "space-between",
  flexDirection: { xs: "column", lg: "row" },
  gap: 2,
  pb: 3,
  overflow: "hidden",
};

const titleGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.6,
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
};

const mainIconStyle = {
  width: { xs: 44, md: 48 },
  height: { xs: 44, md: 48 },
  minWidth: { xs: 44, md: 48 },
  borderRadius: "16px",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 14px 30px rgba(49,39,131,0.28)",
};

const eyebrowStyle = {
  fontSize: "12px",
  fontWeight: 900,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  whiteSpace: { xs: "normal", md: "nowrap" },
};

const pageTitleStyle = {
  fontSize: { xs: 22, sm: 24, md: 32 },
  fontWeight: 950,
  color: "#0f172a",
  lineHeight: 1.05,
  wordBreak: "break-word",
};

const actionsWrapperStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: { xs: "stretch", sm: "flex-start", lg: "flex-end" },
  flexDirection: { xs: "column", sm: "row" },
  gap: 1.2,
  width: { xs: "100%", lg: "auto" },
  flexShrink: 0,
};

const primaryButtonStyle = {
  height: 44,
  px: 2.4,
  borderRadius: "14px",
  fontWeight: 950,
  textTransform: "none",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  boxShadow: "0 14px 30px rgba(49,39,131,0.28)",
  whiteSpace: "nowrap",
  width: { xs: "100%", sm: "auto" },
  "&:hover": {
    background: "linear-gradient(135deg, #241d66, #5c4df2)",
    boxShadow: "0 18px 38px rgba(49,39,131,0.34)",
    transform: "translateY(-1px)",
  },
  transition: "all 0.25s ease",
};

const secondaryButtonStyle = {
  height: 44,
  px: 2.4,
  borderRadius: "14px",
  fontWeight: 950,
  textTransform: "none",
  background: "linear-gradient(135deg, #2563eb, #6d5dfc)",
  boxShadow: "0 14px 30px rgba(37,99,235,0.24)",
  whiteSpace: "nowrap",
  width: { xs: "100%", sm: "auto" },
  "&:hover": {
    background: "linear-gradient(135deg, #1d4ed8, #5c4df2)",
    boxShadow: "0 18px 38px rgba(37,99,235,0.30)",
    transform: "translateY(-1px)",
  },
  transition: "all 0.25s ease",
};

const mainCardStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  minHeight: "72vh",
  borderRadius: { xs: "22px", md: "28px" },
  overflow: "hidden",
  boxSizing: "border-box",
  contain: "inline-size layout paint",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(246,247,251,0.98))",
  boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
  border: "1px solid rgba(226,232,240,0.9)",
};

const topBarStyle = {
  height: 8,
  background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
};

const contentStyle = {
  p: { xs: 1.5, sm: 2, md: 4 },
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  contain: "inline-size layout paint",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: { xs: "flex-start", lg: "center" },
  justifyContent: "space-between",
  flexDirection: { xs: "column", lg: "row" },
  gap: 2,
  mb: 3,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
};

const sectionIconStyle = {
  width: { xs: 48, md: 54 },
  height: { xs: 48, md: 54 },
  minWidth: { xs: 48, md: 54 },
  borderRadius: "18px",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 18px 36px rgba(49,39,131,0.28)",
};

const sectionTitleStyle = {
  fontSize: { xs: 20, md: 28 },
  fontWeight: 950,
  color: "#0f172a",
  lineHeight: 1.05,
  wordBreak: "break-word",
};

const sectionSubtitleStyle = {
  color: "#64748b",
  fontSize: 14,
  mt: 0.8,
  lineHeight: 1.5,
  wordBreak: "break-word",
};

const counterChipStyle = {
  height: 38,
  px: 1,
  borderRadius: "12px",
  fontWeight: 900,
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.08)",
  border: "1px solid rgba(49,39,131,0.16)",
  flexShrink: 0,
};

const gridCardStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  height: { xs: 560, md: 620 },
  borderRadius: "24px",
  overflow: "hidden",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
  p: { xs: 1, md: 2 },
  boxSizing: "border-box",
  contain: "inline-size layout paint",
};

const hardViewportStyle = {
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  boxSizing: "border-box",
  contain: "inline-size layout paint",
};

const toolbarStyle = {
  p: 1.2,
  mb: 2,
  borderRadius: "16px",
  backgroundColor: "#f8fafc",
  border: "1px solid rgba(226,232,240,0.95)",
  gap: 1,
  "& button": {
    color: "#475569",
    fontWeight: 800,
    textTransform: "none",
    borderRadius: "10px",
    px: 1.2,
    "&:hover": {
      color: "#312783",
      backgroundColor: "rgba(49,39,131,0.07)",
    },
  },
};

const dataGridStyle = {
  border: "none",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  color: "#334155",
  fontSize: 13,
  "& .MuiDataGrid-main": {
    overflow: "hidden",
  },
  "& .MuiDataGrid-virtualScroller": {
    overflowX: "auto",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid rgba(226,232,240,0.8)",
    outline: "none !important",
  },
  "& .MuiDataGrid-columnHeaders": {
    background: "linear-gradient(135deg, #312783, #6d5dfc)",
    color: "#fff",
    borderRadius: "16px",
    borderBottom: "none",
    fontSize: "12px",
    fontWeight: 900,
    textTransform: "uppercase",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 950,
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgba(49,39,131,0.035)",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid rgba(226,232,240,0.9)",
    backgroundColor: "#f8fafc",
  },
};

const roleChipStyle = {
  borderRadius: "10px",
  fontWeight: 900,
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.08)",
  border: "1px solid rgba(49,39,131,0.14)",
};

const editButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: "12px",
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.08)",
  border: "1px solid rgba(49,39,131,0.14)",
  "&:hover": {
    backgroundColor: "rgba(49,39,131,0.14)",
  },
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

const modalOverlayStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  px: 2,
};

const modalBoxStyle = {
  width: "100%",
  maxWidth: 430,
  p: { xs: 3, md: 4 },
  borderRadius: "26px",
  textAlign: "center",
  color: "#fff",
  background: "linear-gradient(135deg, #dc2626, #991b1b)",
  boxShadow: "0 30px 90px rgba(15,23,42,0.35)",
  border: "1px solid rgba(255,255,255,0.18)",
};

const modalIconBoxStyle = {
  width: 70,
  height: 70,
  mx: "auto",
  mb: 2,
  borderRadius: "22px",
  backgroundColor: "rgba(255,255,255,0.16)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalTitleStyle = {
  fontSize: 22,
  fontWeight: 950,
  mb: 1,
};

const modalTextStyle = {
  color: "rgba(255,255,255,0.82)",
  fontSize: 14,
  lineHeight: 1.6,
  mb: 3,
};

const modalActionsStyle = {
  display: "flex",
  justifyContent: "center",
  gap: 1.5,
  flexWrap: "wrap",
};

const modalConfirmButtonStyle = {
  height: 42,
  px: 2.5,
  borderRadius: "14px",
  color: "#991b1b",
  backgroundColor: "#fff",
  fontWeight: 950,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#fee2e2",
  },
};

const modalCancelButtonStyle = {
  height: 42,
  px: 2.5,
  borderRadius: "14px",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.45)",
  fontWeight: 950,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
};

export default Contacts;