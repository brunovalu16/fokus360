import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  Chip,
  Divider,
  Tooltip,
  Stack,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { DataGrid } from "@mui/x-data-grid";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";

import { tokens } from "../../theme";
import { useLocation, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { dbFokus360, storageFokus360, authFokus360 } from "../../data/firebase-config";
import Modal from "../../components/Modal";

import TopicIcon from "@mui/icons-material/Topic";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import StorageIcon from "@mui/icons-material/Storage";

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

const rolesRestritos = [
  "37", "38", "39", "40", "41", "42", "43", "44",
  "45", "46", "47", "48", "49", "50", "51",
];

const CustomToolbar = () => (
  <GridToolbarContainer
    sx={{
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
    }}
  >
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const Arquivos = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const areaFiltrada = queryParams.get("area");
  const roleFiltrada = queryParams.get("role");

  const [isModalOpen, setModalOpen] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const effectiveRole = String(roleFiltrada ?? role ?? "").trim().padStart(2, "0");
  const isRestricted = rolesRestritos.includes(effectiveRole);
  const podeAdicionarArquivo = !isRestricted;

  const voltarPara = isRestricted ? "/painelindustriastrade" : "/arquivosareas";

  const tituloFiltro = useMemo(() => {
    if (roleFiltrada) return roleToLabelMap[effectiveRole] || `Perfil ${effectiveRole}`;
    if (areaFiltrada) return areaFiltrada;
    return "Todos os arquivos";
  }, [roleFiltrada, areaFiltrada, effectiveRole]);

  const fetchFiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(dbFokus360, "arquivos"));

      const files = querySnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

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

  useEffect(() => {
    fetchFiles();
  }, [location.search]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(dbFokus360, "user", user.uid));

          if (userDoc.exists()) {
            const dados = userDoc.data();
            setRole(String(dados.role).padStart(2, "0"));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar role do usuário:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

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

      await deleteObject(fileRef);
      await deleteDoc(doc(dbFokus360, "arquivos", id));

      setFilesData((prev) => prev.filter((file) => file.id !== id));
      alert("Arquivo deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      alert("Erro ao excluir o arquivo.");
    }
  };

  const columns = [
    {
      field: "uploadedBy",
      headerName: "Nome do Usuário",
      flex: 1,
      minWidth: 190,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #312783, #6d5dfc)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 13,
            }}
          >
            {row.uploadedBy?.charAt(0)?.toUpperCase() || "U"}
          </Box>

          <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: 13 }}>
            {row.uploadedBy || "Não informado"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "fileType",
      headerName: "Tipo de Arquivo",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Chip
          icon={<InsertDriveFileIcon sx={{ fontSize: "17px !important" }} />}
          label={row.fileType || "Arquivo"}
          size="small"
          sx={{
            borderRadius: "10px",
            fontWeight: 800,
            color: "#312783",
            backgroundColor: "rgba(49,39,131,0.08)",
            border: "1px solid rgba(49,39,131,0.14)",
          }}
        />
      ),
    },
    {
      field: "state",
      headerName: "Unidade",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Typography sx={{ fontWeight: 700, color: "#475569", fontSize: 13 }}>
          {row.state || "Não informado"}
        </Typography>
      ),
    },
    {
      field: "fileURL",
      headerName: "Ações",
      flex: 1.2,
      minWidth: 220,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            size="small"
            href={row.fileURL}
            target="_blank"
            startIcon={<CloudDownloadIcon />}
            sx={{
              height: 34,
              px: 1.5,
              borderRadius: "11px",
              color: "#fff",
              background: "linear-gradient(135deg, #312783, #6d5dfc)",
              fontWeight: 900,
              textTransform: "none",
              fontSize: "12px",
              boxShadow: "0 10px 22px rgba(49,39,131,0.22)",
              "&:hover": {
                background: "linear-gradient(135deg, #241d66, #5c4df2)",
                boxShadow: "0 14px 28px rgba(49,39,131,0.30)",
              },
            }}
          >
            Download
          </Button>

          {podeAdicionarArquivo && (
            <Tooltip title="Excluir arquivo">
              <IconButton
                onClick={() => handleDelete(row.id)}
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "11px",
                  backgroundColor: "rgba(220,38,38,0.08)",
                  border: "1px solid rgba(220,38,38,0.16)",
                  "&:hover": {
                    backgroundColor: "rgba(220,38,38,0.14)",
                  },
                }}
              >
                <DeleteForeverSharpIcon sx={{ fontSize: 22, color: "#dc2626" }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ px: { xs: 2, md: 5 }, pt: 5 }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #312783, #6d5dfc)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 28px rgba(49,39,131,0.28)",
                }}
              >
                <TopicIcon sx={{ color: "#fff", fontSize: 26 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#64748b",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Gerenciador de Arquivos
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "22px", md: "28px" },
                    fontWeight: 900,
                    color: "#0f172a",
                    lineHeight: 1.1,
                  }}
                >
                  Central de Documentos
                </Typography>
              </Box>
            </Box>
          }
        />
      </Box>

      <Box
        sx={{
          mx: { xs: 2, md: 5 },
          mt: 2,
          minHeight: "68vh",
          borderRadius: "28px",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(246,247,251,0.98))",
          boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
          border: "1px solid rgba(226,232,240,0.9)",
        }}
      >
        <Box
          sx={{
            height: 8,
            background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
          }}
        />

        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #312783, #6d5dfc)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 18px 36px rgba(49,39,131,0.28)",
                }}
              >
                <FolderOpenIcon />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 900,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Biblioteca Fokus 360
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 22, md: 28 },
                    fontWeight: 950,
                    color: "#0f172a",
                    lineHeight: 1.05,
                  }}
                >
                  {tituloFiltro}
                </Typography>

                <Typography sx={{ color: "#64748b", fontSize: 14, mt: 0.8 }}>
                  Visualização, download e gestão de arquivos autorizados.
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1.2} flexWrap="wrap">
              <Chip
                icon={<AdminPanelSettingsIcon sx={{ color: "#312783 !important" }} />}
                label={isRestricted ? "Acesso restrito" : "Acesso administrativo"}
                sx={{
                  height: 38,
                  px: 1,
                  borderRadius: "12px",
                  fontWeight: 900,
                  color: "#312783",
                  backgroundColor: "rgba(49,39,131,0.08)",
                  border: "1px solid rgba(49,39,131,0.16)",
                }}
              />

              <Chip
                icon={<StorageIcon sx={{ color: "#047857 !important" }} />}
                label={`${filesData.length} arquivo(s)`}
                sx={{
                  height: 38,
                  px: 1,
                  borderRadius: "12px",
                  fontWeight: 900,
                  color: "#047857",
                  backgroundColor: "rgba(16,185,129,0.10)",
                  border: "1px solid rgba(16,185,129,0.18)",
                }}
              />
            </Stack>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(148,163,184,0.25)" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mb: 2.5,
            }}
          >
            <Button
              component={Link}
              to={voltarPara}
              startIcon={<ExitToAppIcon />}
              sx={{
                height: 42,
                px: 2,
                borderRadius: "13px",
                textTransform: "none",
                fontWeight: 900,
                color: "#64748b",
                backgroundColor: "#fff",
                border: "1px solid rgba(226,232,240,0.95)",
                boxShadow: "0 8px 22px rgba(15,23,42,0.05)",
                "&:hover": {
                  color: "#312783",
                  backgroundColor: "rgba(49,39,131,0.06)",
                  boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
                },
              }}
            >
              Voltar
            </Button>

            {!loading && podeAdicionarArquivo && (
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleOpenModal}
                sx={{
                  height: 42,
                  px: 2.5,
                  borderRadius: "13px",
                  fontWeight: 950,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #312783, #6d5dfc)",
                  boxShadow: "0 14px 30px rgba(49,39,131,0.28)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #241d66, #5c4df2)",
                    boxShadow: "0 18px 38px rgba(49,39,131,0.34)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                Adicionar Arquivo
              </Button>
            )}
          </Box>

          <Paper
            elevation={0}
            sx={{
              height: 560,
              width: "100%",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(226,232,240,0.95)",
              backgroundColor: "#fff",
              boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
              p: 2,
              "& .MuiDataGrid-root": {
                border: "none",
                fontSize: 13,
                color: "#334155",
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
                borderRadius: "0 0 16px 16px",
              },
            }}
          >
            <DataGrid
              rows={filesData}
              columns={columns}
              slots={{ toolbar: CustomToolbar }}
              localeText={localeText}
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          </Paper>
        </Box>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        onFileUploaded={fetchFiles}
      />
    </>
  );
};

export default Arquivos;