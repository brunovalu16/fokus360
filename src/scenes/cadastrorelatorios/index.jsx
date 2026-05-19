import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import LinkIcon from "@mui/icons-material/Link";
import SaveIcon from "@mui/icons-material/Save";
import GroupsIcon from "@mui/icons-material/Groups";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import { dbFokus360 } from "../../data/firebase-config";

const EMAIL_GROUP_COLLECTION = "emailgrupo";


const AREAS_RELATORIOS = [
  "Vendas",
  "Financeiro",
  "Logística",
  "Central de monitoramento",
  "Trade",
  "Indústrias",
];


const CadastroRelatorios = () => {
  const [nomeRelatorio, setNomeRelatorio] = useState("");
  const [linkRelatorio, setLinkRelatorio] = useState("");
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([]);
  const [grupoSelecionadoId, setGrupoSelecionadoId] = useState("");
  const [areaRelatorio, setAreaRelatorio] = useState("");

  const [nomeGrupo, setNomeGrupo] = useState("");
  const [emailGrupo, setEmailGrupo] = useState("");
  const [emailsDoGrupo, setEmailsDoGrupo] = useState([]);
  const [gruposCadastrados, setGruposCadastrados] = useState([]);

  const [usuarios, setUsuarios] = useState([]);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvandoGrupo, setSalvandoGrupo] = useState(false);

  const navigate = useNavigate();

  const usuariosSelecionadosData = useMemo(() => {
    return usuarios.filter((user) => usuariosSelecionados.includes(user.id));
  }, [usuarios, usuariosSelecionados]);

  const grupoSelecionado = useMemo(() => {
    return gruposCadastrados.find((grupo) => grupo.id === grupoSelecionadoId) || null;
  }, [gruposCadastrados, grupoSelecionadoId]);

  const carregarUsuarios = async () => {
    setCarregandoUsuarios(true);

    try {
      const snapshot = await getDocs(collection(dbFokus360, "user"));

      const lista = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        .filter((user) => user.tipo !== "perfil")
        .sort((a, b) =>
          String(a.username || "").localeCompare(String(b.username || ""), "pt-BR")
        );

      setUsuarios(lista);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      alert("Erro ao carregar usuários cadastrados.");
    } finally {
      setCarregandoUsuarios(false);
    }
  };

  const carregarGrupos = async () => {
    try {
      const snapshot = await getDocs(collection(dbFokus360, EMAIL_GROUP_COLLECTION));

      const lista = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        .sort((a, b) =>
          String(a.nomeGrupo || "").localeCompare(String(b.nomeGrupo || ""), "pt-BR")
        );

      setGruposCadastrados(lista);
    } catch (error) {
      console.error("Erro ao carregar grupos de e-mails:", error);
    }
  };

  useEffect(() => {
    carregarUsuarios();
    carregarGrupos();
  }, []);

  const limparFormulario = () => {
     setNomeRelatorio("");
      setLinkRelatorio("");
      setAreaRelatorio("");
      setUsuariosSelecionados([]);
      setGrupoSelecionadoId("");
  };

  const limparGrupo = () => {
    setNomeGrupo("");
    setEmailGrupo("");
    setEmailsDoGrupo([]);
  };

  const adicionarEmailAoGrupo = () => {
    const emailTratado = emailGrupo.trim().toLowerCase();

    if (!emailTratado) {
      alert("Digite um e-mail.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTratado)) {
      alert("Digite um e-mail válido.");
      return;
    }

    if (emailsDoGrupo.includes(emailTratado)) {
      alert("Este e-mail já foi adicionado ao grupo.");
      return;
    }

    setEmailsDoGrupo((prev) => [...prev, emailTratado]);
    setEmailGrupo("");
  };

  const removerEmailDoGrupo = (email) => {
    setEmailsDoGrupo((prev) => prev.filter((item) => item !== email));
  };

  const salvarGrupoEmail = async () => {
    if (!nomeGrupo.trim()) {
      alert("Informe o nome do grupo.");
      return;
    }

    if (emailsDoGrupo.length === 0) {
      alert("Adicione pelo menos um e-mail ao grupo.");
      return;
    }

    setSalvandoGrupo(true);

    try {
      await addDoc(collection(dbFokus360, EMAIL_GROUP_COLLECTION), {
        nomeGrupo: nomeGrupo.trim(),
        emails: emailsDoGrupo,
        ativo: true,
        createdAt: serverTimestamp(),
        createdBy: localStorage.getItem("userId") || "",
      });

      alert("Grupo de e-mails cadastrado com sucesso.");
      limparGrupo();
      carregarGrupos();
    } catch (error) {
      console.error("Erro ao salvar grupo:", error);
      alert(`Erro ao salvar grupo: ${error.message}`);
    } finally {
      setSalvandoGrupo(false);
    }
  };

  const deletarGrupoEmail = async (grupoId) => {
    if (!grupoId) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja deletar este grupo de e-mails?"
    );

    if (!confirmar) return;

    try {
      await deleteDoc(doc(dbFokus360, EMAIL_GROUP_COLLECTION, grupoId));

      if (grupoSelecionadoId === grupoId) {
        setGrupoSelecionadoId("");
      }

      alert("Grupo deletado com sucesso.");
      carregarGrupos();
    } catch (error) {
      console.error("Erro ao deletar grupo:", error);
      alert(`Erro ao deletar grupo: ${error.message}`);
    }
  };

  const salvarRelatorio = async (e) => {
    e.preventDefault();

    if (!nomeRelatorio.trim()) {
      alert("Informe o nome do relatório.");
      return;
    }

    if (!linkRelatorio.trim()) {
      alert("Informe o link do relatório.");
      return;
    }

    if (!areaRelatorio) {
    alert("Selecione a área do relatório.");
    return;
  }

 const temUsuariosSelecionados = usuariosSelecionados.length > 0;
const temGrupoSelecionado = !!grupoSelecionado;

if (!temUsuariosSelecionados && !temGrupoSelecionado) {
  alert("Selecione pelo menos um usuário ou um grupo de e-mail.");
  return;
}

    setSalvando(true);

    try {
      const usuariosPermitidos = usuariosSelecionadosData.map((user) => ({
        id: user.id,
        nome: user.username || "",
        email: user.email || "",
        role: user.role || "",
        unidade: user.unidade || "",
        photoURL: user.photoURL || "",
      }));

      await addDoc(collection(dbFokus360, "relatorios"), {
        nomeRelatorio: nomeRelatorio.trim(),
        linkRelatorio: linkRelatorio.trim(),
        areaRelatorio,

        usuariosPermitidos,
        usuariosPermitidosIds: usuariosSelecionados,

        grupoEmailId: grupoSelecionado?.id || "",
        grupoEmailNome: grupoSelecionado?.nomeGrupo || "",
        grupoEmailEmails: Array.isArray(grupoSelecionado?.emails)
          ? grupoSelecionado.emails
          : [],

        ativo: true,
        createdAt: serverTimestamp(),
        createdBy: localStorage.getItem("userId") || "",
      });
      alert("Relatório cadastrado com sucesso!");
      limparFormulario();
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      alert(`Erro ao salvar relatório: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Box sx={pageStyle}>
      <Box sx={pageInnerStyle}>
        <Paper elevation={0} sx={mainCardStyle}>
          <Box sx={topBarStyle} />

          <Box sx={contentStyle}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                mb: 2,
              }}
            >
              <Button
                startIcon={<ExitToAppIcon />}
                onClick={() => navigate("/relatorios")}
                sx={{
                  height: 30,
                  px: 2,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 900,
                  fontSize: 12,
                  color: "#5b4df7",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#ebe8ff",
                    boxShadow: "none",
                  },
                }}
              >
                Voltar
              </Button>
            </Box>
            <Box sx={heroStyle}>
              <Box sx={heroIconStyle}>
                <DashboardCustomizeIcon sx={{ color: "#fff", fontSize: 32 }} />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={eyebrowStyle}>FOKUS 360</Typography>

                <Typography sx={titleStyle}>Cadastro de Relatórios</Typography>

                <Typography sx={subtitleStyle}>
                  Cadastre relatórios, libere usuários e vincule grupos de e-mails ao link.
                </Typography>
              </Box>
              
            </Box>

           

            {carregandoUsuarios && <LinearProgress sx={{ mt: 3, borderRadius: 99 }} />}

            <Divider sx={{ my: 3, borderColor: "rgba(148,163,184,0.22)" }} />

            <Box sx={pageGridStyle}>
              <Box component="form" onSubmit={salvarRelatorio} sx={formStyle}>
                <Paper elevation={0} sx={sectionCardStyle}>
                  <Box sx={sectionHeaderStyle}>
                    <Box sx={sectionIconStyle}>
                      <AssessmentIcon />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={sectionTitleStyle}>
                        Informações do relatório
                      </Typography>

                      <Typography sx={sectionSubtitleStyle}>
                        Dados principais do relatório que será liberado aos usuários.
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={fieldsGridStyle}>
                    <TextField
                      label="Nome do relatório"
                      value={nomeRelatorio}
                      onChange={(e) => setNomeRelatorio(e.target.value)}
                      fullWidth
                      required
                      sx={fieldStyle}
                    />

                    <TextField
                      label="Link do relatório"
                      value={linkRelatorio}
                      onChange={(e) => setLinkRelatorio(e.target.value)}
                      fullWidth
                      required
                      placeholder="https://app.powerbi.com/..."
                      sx={fieldStyle}
                      InputProps={{
                        startAdornment: <LinkIcon sx={{ color: "#64748b", mr: 1 }} />,
                      }}
                    />
                  </Box>

                  <FormControl fullWidth required sx={fieldStyle2}>
                    <InputLabel id="area-relatorio-label">Área do relatório</InputLabel>

                    <Select
                      labelId="area-relatorio-label"
                      label="Área do relatório"
                      value={areaRelatorio}
                      onChange={(e) => setAreaRelatorio(e.target.value)}
                    >
                      {AREAS_RELATORIOS.map((area) => (
                        <MenuItem key={area} value={area}>
                          {area}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>

                <Paper elevation={0} sx={sectionCardStyle}>
                  <Box sx={sectionHeaderStyle}>
                    <Box sx={sectionIconStyle}>
                      <GroupsIcon />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={sectionTitleStyle}>
                        Permissão de usuários
                      </Typography>

                      <Typography sx={sectionSubtitleStyle}>
                        Selecione um ou mais usuários que terão acesso a este relatório.
                      </Typography>
                    </Box>
                  </Box>

                  <FormControl fullWidth sx={fieldStyle}>
                    <InputLabel id="usuarios-label">Usuários autorizados</InputLabel>

                    <Select
                      labelId="usuarios-label"
                      multiple
                      value={usuariosSelecionados}
                      onChange={(e) => setUsuariosSelecionados(e.target.value)}
                      input={<OutlinedInput label="Usuários autorizados" />}
                      renderValue={(selected) => (
                        <Box sx={chipsWrapStyle}>
                          {selected.map((id) => {
                            const user = usuarios.find((item) => item.id === id);

                            return (
                              <Chip
                                key={id}
                                label={user?.username || user?.email || "Usuário"}
                                sx={userChipStyle}
                              />
                            );
                          })}
                        </Box>
                      )}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 440,
                            borderRadius: "18px",
                            boxShadow: "0 24px 70px rgba(15,23,42,0.20)",
                          },
                        },
                      }}
                    >
                      {usuarios.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Checkbox checked={usuariosSelecionados.includes(user.id)} />

                          <Avatar src={user.photoURL || ""} sx={menuAvatarStyle}>
                            {user.username?.charAt(0)?.toUpperCase() || "U"}
                          </Avatar>

                          <ListItemText
                            primary={user.username || "Sem nome"}
                            secondary={`${user.email || "Sem e-mail"} • Role ${user.role || "--"}`}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {usuariosSelecionadosData.length > 0 && (
                    <Box sx={previewUsersStyle}>
                      <Typography sx={previewTitleStyle}>
                        Usuários selecionados
                      </Typography>

                      <Box sx={selectedUsersGridStyle}>
                        {usuariosSelecionadosData.map((user) => (
                          <Box key={user.id} sx={selectedUserCardStyle}>
                            <Avatar src={user.photoURL || ""} sx={selectedAvatarStyle}>
                              {user.username?.charAt(0)?.toUpperCase() || "U"}
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={selectedUserNameStyle}>
                                {user.username || "Sem nome"}
                              </Typography>

                              <Typography sx={selectedUserEmailStyle}>
                                {user.email || "Sem e-mail"}
                              </Typography>
                            </Box>

                            <Chip size="small" label={user.role || "--"} sx={roleChipStyle} />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>

                <Paper elevation={0} sx={sectionCardStyle}>
                  <Box sx={sectionHeaderStyle}>
                    <Box sx={sectionIconStyle}>
                      <AlternateEmailIcon />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={sectionTitleStyle}>
                        Grupo de e-mail do relatório
                      </Typography>

                      <Typography sx={sectionSubtitleStyle}>
                        Escolha o grupo que será vinculado a este link.
                      </Typography>
                    </Box>
                  </Box>


                  <FormControl fullWidth sx={fieldStyle}>
                    <InputLabel id="grupo-email-label">Grupo de e-mail</InputLabel>

                    <Select
                      labelId="grupo-email-label"
                      label="Grupo de e-mail"
                      value={grupoSelecionadoId}
                      onChange={(e) => setGrupoSelecionadoId(e.target.value)}
                    >
                      {gruposCadastrados.map((grupo) => (
                        <MenuItem key={grupo.id} value={grupo.id}>
                          {grupo.nomeGrupo || "Grupo sem nome"} —{" "}
                          {Array.isArray(grupo.emails) ? grupo.emails.length : 0} e-mail(s)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {grupoSelecionado && (
                    <Box sx={previewGroupStyle}>
                      <Typography sx={previewTitleStyle}>
                        Grupo selecionado: {grupoSelecionado.nomeGrupo}
                      </Typography>

                      <Box sx={emailListStyle}>
                        {(grupoSelecionado.emails || []).map((email) => (
                          <Chip key={email} label={email} sx={emailChipStyle} />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>

                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={salvando}
                  startIcon={
                    salvando ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={submitButtonStyle}
                >
                  {salvando ? "Salvando relatório..." : "Cadastrar Relatório"}
                </Button>
              </Box>

              <Paper elevation={0} sx={groupCardStyle}>
                <Box sx={sectionHeaderStyle}>
                  <Box sx={sectionIconStyle}>
                    <AlternateEmailIcon />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={sectionTitleStyle}>
                      Grupos de e-mails
                    </Typography>

                    <Typography sx={sectionSubtitleStyle}>
                      Crie, consulte e delete grupos de e-mails.
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  label="Nome do grupo"
                  value={nomeGrupo}
                  onChange={(e) => setNomeGrupo(e.target.value)}
                  fullWidth
                  sx={fieldStyle}
                />

                <Box sx={emailInputRowStyle}>
                  <TextField
                    label="Adicionar e-mail"
                    value={emailGrupo}
                    onChange={(e) => setEmailGrupo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        adicionarEmailAoGrupo();
                      }
                    }}
                    fullWidth
                    sx={fieldStyle}
                  />

                  <IconButton onClick={adicionarEmailAoGrupo} sx={addEmailButtonStyle}>
                    <AddIcon />
                  </IconButton>
                </Box>

                {emailsDoGrupo.length > 0 && (
                  <Box sx={emailListStyle}>
                    {emailsDoGrupo.map((email) => (
                      <Chip
                        key={email}
                        label={email}
                        onDelete={() => removerEmailDoGrupo(email)}
                        deleteIcon={<DeleteIcon />}
                        sx={emailChipStyle}
                      />
                    ))}
                  </Box>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  disabled={salvandoGrupo}
                  onClick={salvarGrupoEmail}
                  startIcon={
                    salvandoGrupo ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={groupSaveButtonStyle}
                >
                  {salvandoGrupo ? "Salvando grupo..." : "Salvar Grupo de E-mails"}
                </Button>

                <Divider sx={{ my: 3, borderColor: "rgba(148,163,184,0.22)" }} />

                <Typography sx={previewTitleStyle}>Grupos cadastrados</Typography>

                <Box sx={groupsListStyle}>
                  {gruposCadastrados.map((grupo) => (
                    <Box key={grupo.id} sx={savedGroupStyle}>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={savedGroupTitleStyle}>
                          {grupo.nomeGrupo || "Grupo sem nome"}
                        </Typography>

                        <Typography sx={savedGroupEmailsStyle}>
                          {Array.isArray(grupo.emails)
                            ? grupo.emails.join(", ")
                            : "Sem e-mails"}
                        </Typography>
                      </Box>

                      <IconButton
                        onClick={() => deletarGrupoEmail(grupo.id)}
                        sx={deleteGroupButtonStyle}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}

                  {gruposCadastrados.length === 0 && (
                    <Box sx={emptyGroupStyle}>Nenhum grupo cadastrado.</Box>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Paper>
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
  px: { xs: 1.5, sm: 2, md: 4 },
  pt: { xs: 3, md: 5 },
  pb: 4,
};

const pageInnerStyle = {
  width: "100%",
  maxWidth: 1320,
  minWidth: 0,
  mx: "auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  overflow: "hidden",
  boxSizing: "border-box",
};

const mainCardStyle = {
  width: "100%",
  minWidth: 0,
  borderRadius: { xs: "22px", md: "32px" },
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
  boxShadow: "0 30px 90px rgba(15,23,42,0.14)",
  border: "1px solid rgba(226,232,240,0.95)",
};

const topBarStyle = {
  height: 8,
  background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
};

const contentStyle = {
  p: { xs: 2, sm: 3, md: 4 },
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  overflow: "hidden",
};

const pageGridStyle = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    lg: "minmax(0, 1.25fr) minmax(340px, 0.75fr)",
  },
  gap: 3,
  width: "100%",
  minWidth: 0,
};

const heroStyle = {
  display: "flex",
  alignItems: { xs: "flex-start", md: "center" },
  flexDirection: { xs: "column", md: "row" },
  gap: 1.8,
  width: "100%",
  minWidth: 0,
};

const heroIconStyle = {
  width: 64,
  height: 64,
  minWidth: 64,
  borderRadius: "22px",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 18px 38px rgba(49,39,131,0.30)",
};

const eyebrowStyle = {
  fontSize: "12px",
  fontWeight: 900,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const titleStyle = {
  fontSize: { xs: 25, md: 36 },
  fontWeight: 950,
  color: "#0f172a",
  lineHeight: 1.05,
};

const subtitleStyle = {
  mt: 0.8,
  color: "#64748b",
  fontSize: 14,
  lineHeight: 1.5,
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  width: "100%",
  minWidth: 0,
};

const sectionCardStyle = {
  p: { xs: 2, md: 2.5 },
  borderRadius: "24px",
  background: "linear-gradient(135deg, #ffffff, #f8fafc)",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const groupCardStyle = {
  ...sectionCardStyle,
  alignSelf: "start",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  mb: 2,
  minWidth: 0,
};

const sectionIconStyle = {
  width: 46,
  height: 46,
  minWidth: 46,
  borderRadius: "16px",
  backgroundColor: "rgba(49,39,131,0.08)",
  color: "#312783",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const sectionTitleStyle = {
  fontSize: 17,
  fontWeight: 950,
  color: "#0f172a",
};

const sectionSubtitleStyle = {
  fontSize: 13,
  color: "#64748b",
  mt: 0.3,
};

const fieldsGridStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
  gap: 2,
  width: "100%",
  minWidth: 0,
};

const fieldStyle = {
  backgroundColor: "#fff",
  borderRadius: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
  },
};

const fieldStyle2 = {
  backgroundColor: "#fff",
  top: "10px",
  borderRadius: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
  },
};

const chipsWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.7,
  maxWidth: "100%",
};

const userChipStyle = {
  borderRadius: "10px",
  fontWeight: 800,
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.08)",
};

const menuAvatarStyle = {
  width: 34,
  height: 34,
  mr: 1.2,
  bgcolor: "#312783",
  fontSize: 13,
  fontWeight: 900,
};

const previewUsersStyle = {
  mt: 2.5,
  p: 2,
  borderRadius: "20px",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
};

const previewGroupStyle = {
  mt: 2,
  p: 2,
  borderRadius: "20px",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
};

const previewTitleStyle = {
  fontSize: 14,
  fontWeight: 950,
  color: "#0f172a",
  mb: 1.5,
};

const selectedUsersGridStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
  gap: 1.2,
};

const selectedUserCardStyle = {
  p: 1.3,
  borderRadius: "16px",
  display: "grid",
  gridTemplateColumns: "40px minmax(0, 1fr) auto",
  alignItems: "center",
  gap: 1.2,
  backgroundColor: "#f8fafc",
  border: "1px solid rgba(226,232,240,0.95)",
};

const selectedAvatarStyle = {
  width: 40,
  height: 40,
  bgcolor: "#312783",
  fontSize: 14,
  fontWeight: 900,
};

const selectedUserNameStyle = {
  fontSize: 13,
  fontWeight: 950,
  color: "#0f172a",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const selectedUserEmailStyle = {
  fontSize: 11.5,
  color: "#64748b",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const roleChipStyle = {
  height: 24,
  fontSize: 11,
  fontWeight: 900,
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.08)",
};

const submitButtonStyle = {
  mt: 1,
  height: 50,
  borderRadius: "17px",
  fontWeight: 950,
  textTransform: "none",
  color: "#fff",
  background: "linear-gradient(135deg, #00a86b, #00c48c)",
  boxShadow: "0 16px 34px rgba(0,196,140,0.26)",
  "&:hover": {
    background: "linear-gradient(135deg, #059669, #00b884)",
  },
};

const emailInputRowStyle = {
  mt: 2,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 48px",
  gap: 1,
  alignItems: "center",
};

const addEmailButtonStyle = {
  width: 48,
  height: 48,
  borderRadius: "16px",
  color: "#fff",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  "&:hover": {
    background: "linear-gradient(135deg, #241d66, #5c4df2)",
  },
};

const emailListStyle = {
  mt: 2,
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
};

const emailChipStyle = {
  borderRadius: "12px",
  fontWeight: 800,
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.08)",
};

const groupSaveButtonStyle = {
  ...submitButtonStyle,
  mt: 2,
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  boxShadow: "0 16px 34px rgba(49,39,131,0.26)",
  "&:hover": {
    background: "linear-gradient(135deg, #241d66, #5c4df2)",
  },
};

const groupsListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

const savedGroupStyle = {
  p: 1.4,
  borderRadius: "16px",
  backgroundColor: "#f8fafc",
  border: "1px solid rgba(226,232,240,0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
};

const savedGroupTitleStyle = {
  fontSize: 13,
  fontWeight: 950,
  color: "#0f172a",
};

const savedGroupEmailsStyle = {
  mt: 0.3,
  fontSize: 12,
  color: "#64748b",
  wordBreak: "break-word",
};

const deleteGroupButtonStyle = {
  color: "#dc2626",
  backgroundColor: "rgba(220,38,38,0.08)",
  borderRadius: "12px",
  flexShrink: 0,
  "&:hover": {
    backgroundColor: "rgba(220,38,38,0.14)",
  },
};

const emptyGroupStyle = {
  p: 2,
  borderRadius: "16px",
  backgroundColor: "#f8fafc",
  color: "#64748b",
  fontWeight: 800,
  textAlign: "center",
};

export default CadastroRelatorios;