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
  FormControlLabel,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useLocation } from "react-router-dom";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { dbFokus360, storageFokus360 } from "../data/firebase-config";

const PERFIS_FIXOS = [
  { role: "01", nome: "Diretoria", grupo: "Gestão" },
  { role: "02", nome: "Gerente", grupo: "Gestão" },
  { role: "03", nome: "Supervisor", grupo: "Gestão" },
  { role: "04", nome: "Vendedor", grupo: "Operação" },
  { role: "06", nome: "Indústria", grupo: "Indústrias" },
  { role: "07", nome: "Projetos", grupo: "Projetos" },
  { role: "08", nome: "Admin", grupo: "Administração" },

  { role: "09", nome: "Coordenador Trade", grupo: "Trade" },
  { role: "10", nome: "Gerência Trade", grupo: "Trade" },
  { role: "11", nome: "Analista Trade", grupo: "Trade" },

  { role: "12", nome: "Gerência Contabilidade", grupo: "Contabilidade" },
  { role: "13", nome: "Coordenador Contabilidade", grupo: "Contabilidade" },
  { role: "14", nome: "Analista Contabilidade", grupo: "Contabilidade" },

  { role: "15", nome: "Gerência Controladoria", grupo: "Controladoria" },
  { role: "16", nome: "Coordenador Controladoria", grupo: "Controladoria" },
  { role: "17", nome: "Analista Controladoria", grupo: "Controladoria" },
  { role: "18", nome: "Analista 2 Controladoria", grupo: "Controladoria" },

  { role: "19", nome: "Gerência Financeiro", grupo: "Financeiro" },
  { role: "20", nome: "Coordenador Financeiro", grupo: "Financeiro" },
  { role: "21", nome: "Analista Financeiro", grupo: "Financeiro" },

  { role: "22", nome: "Gerência Jurídico", grupo: "Jurídico" },
  { role: "23", nome: "Coordenador Jurídico", grupo: "Jurídico" },
  { role: "24", nome: "Analista Jurídico", grupo: "Jurídico" },

  { role: "25", nome: "Gerência Logística", grupo: "Logística" },
  { role: "26", nome: "Coordenador Logística", grupo: "Logística" },
  { role: "27", nome: "Analista Logística", grupo: "Logística" },

  { role: "28", nome: "Gerência Marketing", grupo: "Marketing" },
  { role: "29", nome: "Coordenador Marketing", grupo: "Marketing" },
  { role: "30", nome: "Analista Marketing", grupo: "Marketing" },

  { role: "31", nome: "Gerência Recursos Humanos", grupo: "Recursos Humanos" },
  { role: "32", nome: "Coordenador Recursos Humanos", grupo: "Recursos Humanos" },
  { role: "33", nome: "Analista Recursos Humanos", grupo: "Recursos Humanos" },

  { role: "34", nome: "Gerência Central de Monitoramento", grupo: "Central de Monitoramento" },
  { role: "35", nome: "Coordenador Central de Monitoramento", grupo: "Central de Monitoramento" },
  { role: "36", nome: "Analista Central de Monitoramento", grupo: "Central de Monitoramento" },

  { role: "37", nome: "Ajinomoto", grupo: "Indústrias" },
  { role: "38", nome: "AB Mauri", grupo: "Indústrias" },
  { role: "39", nome: "Adoralle", grupo: "Indústrias" },
  { role: "40", nome: "Bettanin", grupo: "Indústrias" },
  { role: "41", nome: "Mars", grupo: "Indústrias" },
  { role: "42", nome: "Mars Pet", grupo: "Indústrias" },
  { role: "43", nome: "M. Dias", grupo: "Indústrias" },
  { role: "44", nome: "SC Johnson", grupo: "Indústrias" },
  { role: "45", nome: "UAU Ingleza", grupo: "Indústrias" },
  { role: "46", nome: "Danone", grupo: "Indústrias" },
  { role: "47", nome: "Ypê", grupo: "Indústrias" },
  { role: "48", nome: "Adoralle", grupo: "Indústrias" },
  { role: "49", nome: "Fini", grupo: "Indústrias" },
  { role: "50", nome: "Heinz", grupo: "Indústrias" },
  { role: "51", nome: "Red Bull", grupo: "Indústrias" },
];

const PERMISSOES = [
  {
    grupo: "Edição / Exclusão dos dados",
    itens: [
      ["aprovarOcorrencias", "Aprovar ocorrências"],
      ["excluirDados", "Excluir dados"],
      ["editarDados", "Editar dados"],
      ["editarStatus", "Editar status"],
      ["editarResponsavel", "Editar responsável"],
      ["finalizarOcorrencias", "Finalizar ocorrências"],
      ["reativarOcorrencias", "Reativar ocorrências"],
      ["alterarPrazo", "Alterar prazo"],
      ["editarCadastroClientes", "Pode editar cadastro de clientes"],
      ["excluirArquivos", "Pode excluir arquivos"],
      ["encaminharOcorrencias", "Pode encaminhar ocorrências"],
    ],
  },
  {
    grupo: "Visualização dos Dados / Cadastros",
    itens: [
      ["visualizarPropriosDados", "Próprios dados"],
      ["visualizarDadosDepartamento", "Dados do departamento"],
      ["visualizarDadosEmpresa", "Dados da empresa"],
      ["cadastroProjetos", "Cadastro de projetos"],
      ["cadastroTimesheet", "Cadastro de timesheet"],
      ["cadastroClientes", "Cadastro de clientes"],
      ["tarefasRecorrentes", "Tarefas recorrentes"],
      ["inserirUsuariosNotificacao", "Pode inserir usuários na lista de notificação"],
      ["salvarRemoverProgramacaoLote", "Pode salvar / remover programação em lote"],
      ["validacaoLoginDuasEtapas", "Validação de login em duas etapas"],
      ["visualizarCustos", "Pode visualizar custos"],
      ["acessarConfiguracoes", "Acessa configurações"],
    ],
  },
];

const permissoesVazias = PERMISSOES.flatMap((g) => g.itens).reduce((acc, [key]) => {
  acc[key] = false;
  return acc;
}, {});

const UserDetalhe = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");

  const [originalEmail, setOriginalEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [formValues, setFormValues] = useState({
    tipo: "usuario",
    username: "",
    email: "",
    emailLower: "",
    role: "",
    roleNome: "",
    perfilId: "",
    unidade: "",
    photoURL: "",
    ativo: true,
    emailVerified: false,
    permissoes: { ...permissoesVazias },
  });

  const perfisAgrupados = useMemo(() => {
    return PERFIS_FIXOS.reduce((acc, perfil) => {
      const grupo = perfil.grupo || "Outros";
      if (!acc[grupo]) acc[grupo] = [];
      acc[grupo].push(perfil);
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const userDoc = await getDoc(doc(dbFokus360, "user", userId));

        if (userDoc.exists()) {
          const data = userDoc.data();

          setFormValues({
            tipo: data.tipo || "usuario",
            username: data.username || "",
            email: data.email || "",
            emailLower: data.emailLower || data.email || "",
            role: data.role || "",
            roleNome: data.roleNome || "",
            perfilId: data.perfilId || "",
            unidade: data.unidade || "",
            photoURL: data.photoURL || "",
            ativo: data.ativo !== false,
            emailVerified: data.emailVerified === true,
            permissoes: {
              ...permissoesVazias,
              ...(data.permissoes || {}),
            },
          });

          setOriginalEmail(data.email || "");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        alert("Erro ao buscar dados do usuário.");
      }
    };

    fetchUserDetails();
  }, [userId]);

  const montarPermissoesParaSalvar = () => {
    return PERMISSOES.flatMap((grupo) => grupo.itens).reduce((acc, [key]) => {
      acc[key] = formValues.permissoes?.[key] === true;
      return acc;
    }, {});
  };

  const handleChangeRole = (novoRole) => {
    const perfil = PERFIS_FIXOS.find((p) => p.role === novoRole);

    setFormValues((prev) => ({
      ...prev,
      role: novoRole,
      roleNome: perfil?.nome || "",
      perfilId: "",
    }));
  };

  const handleTogglePermissao = (key) => {
    setFormValues((prev) => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [key]: prev.permissoes?.[key] !== true,
      },
    }));
  };

  const handleMarcarGrupo = (grupo, checked) => {
    setFormValues((prev) => {
      const novasPermissoes = { ...prev.permissoes };

      grupo.itens.forEach(([key]) => {
        novasPermissoes[key] = checked;
      });

      return {
        ...prev,
        permissoes: novasPermissoes,
      };
    });
  };

  const handleUser = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("ID do usuário não encontrado.");
      return;
    }

    setSalvando(true);

    try {
      const userRef = doc(dbFokus360, "user", userId);
      const emailTratado = formValues.email.trim().toLowerCase();
      const emailChanged = emailTratado !== originalEmail;

      await updateDoc(userRef, {
        tipo: "usuario",
        username: formValues.username.trim(),
        email: emailTratado,
        emailLower: emailTratado,
        role: formValues.role,
        roleNome: formValues.roleNome,
        perfilId: formValues.perfilId || "",
        unidade: formValues.unidade,
        photoURL: formValues.photoURL,
        ativo: formValues.ativo,
        emailVerified: formValues.emailVerified,
        permissoes: montarPermissoesParaSalvar(),
      });

      if (emailChanged) {
        const response = await fetch(
          `${import.meta.env.VITE_FOKUS360_DATABASEURL}/api/update-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: userId,
              newEmail: emailTratado,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setOriginalEmail(emailTratado);
          alert("E-mail atualizado com sucesso!");
        } else {
          alert(`Erro ao atualizar o e-mail no servidor: ${data.message || "Tente novamente."}`);
        }
      } else {
        alert("Dados do usuário atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert(`Erro ao atualizar usuário: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const handleUploadPhoto = (event) => {
    const file = event.target.files[0];
    if (!file || !userId) return;

    setUploading(true);

    const nomeSeguro = file.name.replace(/\//g, "-");
    const storageRef = ref(storageFokus360, `users/${Date.now()}_${nomeSeguro}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Erro ao carregar a foto:", error);
        setUploading(false);
      },
      async () => {
        try {
          const photoURL = await getDownloadURL(uploadTask.snapshot.ref);
          const userRef = doc(dbFokus360, "user", userId);

          await updateDoc(userRef, { photoURL });
          setFormValues((prev) => ({ ...prev, photoURL }));
        } catch (error) {
          console.error("Erro ao atualizar o Firestore:", error);
        } finally {
          setUploading(false);
        }
      }
    );
  };

  return (
    <Box sx={pageStyle}>
      <Box sx={pageInnerStyle}>
        <Paper elevation={0} sx={mainCardStyle}>
          <Box sx={topBarStyle} />

          <Box sx={contentStyle}>
            <Box sx={heroStyle}>
              <Box sx={heroIconStyle}>
                <ManageAccountsIcon sx={{ color: "#fff", fontSize: 32 }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography sx={eyebrowStyle}>Gerenciamento de usuários</Typography>
                <Typography sx={titleStyle}>Perfil do Usuário</Typography>
                <Typography sx={subtitleStyle}>
                  Atualize dados de acesso, unidade, perfil, permissões e foto do usuário.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: "rgba(148,163,184,0.22)" }} />

            <Box sx={layoutGridStyle}>
              <Paper elevation={0} sx={profileCardStyle}>
                <Avatar
                  alt={formValues.username || "Nome do Usuário"}
                  src={formValues.photoURL || ""}
                  sx={avatarStyle}
                />

                <Typography sx={profileNameStyle}>
                  {formValues.username || "Nome do Usuário"}
                </Typography>

                <Typography sx={profileEmailStyle}>
                  {formValues.email || "email@empresa.com"}
                </Typography>

                <Box sx={profileInfoBoxStyle}>
                  <Typography sx={profileLabelStyle}>Unidade</Typography>
                  <Typography sx={profileValueStyle}>
                    {formValues.unidade || "Não informada"}
                  </Typography>
                </Box>

                <Chip
                  icon={<AdminPanelSettingsIcon sx={{ fontSize: "17px !important" }} />}
                  label={formValues.roleNome ? `${formValues.roleNome} • ${formValues.role}` : `Perfil ${formValues.role || "--"}`}
                  sx={roleChipStyle}
                />

                <Button
                  variant="contained"
                  component="label"
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <PhotoCameraIcon />}
                  sx={uploadButtonStyle}
                >
                  {uploading ? "Carregando..." : "Carregar Foto"}

                  <input type="file" hidden accept="image/*" onChange={handleUploadPhoto} />
                </Button>
              </Paper>

              <Paper elevation={0} sx={formCardStyle}>
                <Box sx={formHeaderStyle}>
                  <Typography sx={formTitleStyle}>Informações do usuário</Typography>
                  <Typography sx={formSubtitleStyle}>
                    Campos obrigatórios para controle de acesso.
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleUser} sx={formStyle}>
                  <TextField
                    label="Nome"
                    fullWidth
                    required
                    value={formValues.username}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, username: e.target.value }))
                    }
                    sx={fieldStyle}
                  />

                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={formValues.email}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, email: e.target.value }))
                    }
                    sx={fieldStyle}
                  />

                  <FormControl fullWidth required sx={fieldStyle}>
                    <InputLabel id="unidade-label">Unidade</InputLabel>
                    <Select
                      labelId="unidade-label"
                      value={formValues.unidade}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, unidade: e.target.value }))
                      }
                      label="Unidade"
                    >
                      <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                      <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                      <MenuItem value="MATOGROSSO">MATO GROSSO</MenuItem>
                      <MenuItem value="MATOGROSSODOSUL">MATO GROSSO DO SUL</MenuItem>
                      <MenuItem value="PARA">PARÁ</MenuItem>
                      <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth required sx={fieldStyle}>
                    <InputLabel id="role-label">Perfil</InputLabel>
                    <Select
                      labelId="role-label"
                      value={formValues.role}
                      onChange={(e) => handleChangeRole(e.target.value)}
                      label="Perfil"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 420,
                            borderRadius: "18px",
                          },
                        },
                      }}
                    >
                      {Object.entries(perfisAgrupados).map(([grupo, lista]) => [
                        <ListSubheader key={`${grupo}-header`}>{grupo}</ListSubheader>,
                        ...lista.map((perfil) => (
                          <MenuItem key={perfil.role} value={perfil.role}>
                            {perfil.nome}
                          </MenuItem>
                        )),
                      ])}
                    </Select>
                  </FormControl>

                  <Paper elevation={0} sx={statusCardStyle}>
                    <Box>
                      <Typography sx={statusTitleStyle}>Usuário ativo</Typography>
                      <Typography sx={statusSubtitleStyle}>
                        Quando desativado, o usuário permanece no banco, mas pode ser bloqueado no sistema.
                      </Typography>
                    </Box>

                    <Switch
                      checked={formValues.ativo}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, ativo: e.target.checked }))
                      }
                    />
                  </Paper>

                  <Box sx={permissionsGridStyle}>
                    {PERMISSOES.map((grupo) => {
                      const keys = grupo.itens.map(([key]) => key);
                      const todosMarcados = keys.every(
                        (key) => formValues.permissoes?.[key] === true
                      );

                      return (
                        <Paper key={grupo.grupo} elevation={0} sx={permissionGroupCardStyle}>
                          <Box sx={permissionGroupHeaderStyle}>
                            <Box>
                              <Typography sx={permissionGroupTitleStyle}>
                                {grupo.grupo}
                              </Typography>
                              <Typography sx={permissionGroupSubtitleStyle}>
                                {keys.filter((key) => formValues.permissoes?.[key] === true).length} de {keys.length} permissões ativas
                              </Typography>
                            </Box>

                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={todosMarcados}
                                  onChange={(e) => handleMarcarGrupo(grupo, e.target.checked)}
                                />
                              }
                              label="Todos"
                            />
                          </Box>

                          <Divider sx={{ borderColor: "rgba(226,232,240,0.9)" }} />

                          <Box sx={permissionListStyle}>
                            {grupo.itens.map(([key, label]) => {
                              const marcado = formValues.permissoes?.[key] === true;

                              return (
                                <Box
                                  key={key}
                                  sx={{
                                    ...permissionItemStyle,
                                    ...(marcado ? permissionItemActiveStyle : {}),
                                  }}
                                  onClick={() => handleTogglePermissao(key)}
                                >
                                  <Checkbox
                                    checked={marcado}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => handleTogglePermissao(key)}
                                  />

                                  <Typography sx={permissionTextStyle}>
                                    {label}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={salvando}
                    startIcon={
                      salvando ? (
                        <CircularProgress size={20} sx={{ color: "#fff" }} />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    sx={saveButtonStyle}
                  >
                    {salvando ? "Salvando no banco..." : "Salvar Alterações"}
                  </Button>
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
  contain: "inline-size layout paint",
  px: { xs: 1.5, sm: 2, md: 4 },
  pt: { xs: 3, md: 5 },
  pb: 4,
};

const pageInnerStyle = {
  width: "100%",
  maxWidth: 1180,
  minWidth: 0,
  mx: "auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  overflow: "hidden",
  boxSizing: "border-box",
  contain: "inline-size layout paint",
};

const mainCardStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  borderRadius: { xs: "22px", md: "30px" },
  overflow: "hidden",
  background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
  boxShadow: "0 28px 80px rgba(15,23,42,0.14)",
  border: "1px solid rgba(226,232,240,0.95)",
  boxSizing: "border-box",
};

const topBarStyle = {
  height: 8,
  background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
};

const contentStyle = {
  p: { xs: 2, sm: 3, md: 4 },
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  overflow: "hidden",
};

const heroStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.8,
  width: "100%",
  minWidth: 0,
};

const heroIconStyle = {
  width: { xs: 52, md: 62 },
  height: { xs: 52, md: 62 },
  minWidth: { xs: 52, md: 62 },
  borderRadius: "20px",
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
  fontSize: { xs: 24, md: 34 },
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

const layoutGridStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "330px minmax(0, 1fr)" },
  gap: 3,
  width: "100%",
  minWidth: 0,
};

const profileCardStyle = {
  p: { xs: 2.5, md: 3 },
  borderRadius: "26px",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.07)",
  background: "radial-gradient(circle at top right, rgba(49,39,131,0.10), transparent 35%), #fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  minWidth: 0,
  boxSizing: "border-box",
};

const avatarStyle = {
  width: 118,
  height: 118,
  mb: 2,
  border: "4px solid rgba(49,39,131,0.25)",
  borderRadius: "28px",
  backgroundColor: "#f8fafc",
  boxShadow: "0 16px 34px rgba(15,23,42,0.12)",
};

const profileNameStyle = {
  fontSize: 24,
  fontWeight: 950,
  color: "#312783",
  lineHeight: 1.1,
  wordBreak: "break-word",
};

const profileEmailStyle = {
  mt: 0.8,
  color: "#64748b",
  fontSize: 13,
  wordBreak: "break-word",
};

const profileInfoBoxStyle = {
  mt: 2.5,
  mb: 1.5,
  width: "100%",
  p: 1.6,
  borderRadius: "18px",
  backgroundColor: "#f8fafc",
  border: "1px solid rgba(226,232,240,0.95)",
};

const profileLabelStyle = {
  fontSize: 11,
  fontWeight: 900,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const profileValueStyle = {
  mt: 0.4,
  fontWeight: 950,
  color: "#0f172a",
  wordBreak: "break-word",
};

const roleChipStyle = {
  mb: 2.2,
  borderRadius: "12px",
  fontWeight: 900,
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.08)",
  border: "1px solid rgba(49,39,131,0.16)",
};

const uploadButtonStyle = {
  width: "100%",
  height: 44,
  borderRadius: "15px",
  textTransform: "none",
  fontWeight: 950,
  color: "#fff",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  boxShadow: "0 14px 30px rgba(49,39,131,0.24)",
};

const formCardStyle = {
  p: { xs: 2.5, md: 3 },
  borderRadius: "26px",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 18px 45px rgba(15,23,42,0.07)",
  background: "#fff",
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const formHeaderStyle = {
  mb: 2.5,
  p: 2,
  borderRadius: "20px",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  color: "#fff",
};

const formTitleStyle = {
  fontSize: 22,
  fontWeight: 950,
};

const formSubtitleStyle = {
  mt: 0.4,
  fontSize: 13,
  color: "rgba(255,255,255,0.76)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
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

const statusCardStyle = {
  p: 1.6,
  borderRadius: "18px",
  border: "1px solid rgba(226,232,240,0.95)",
  backgroundColor: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
};

const statusTitleStyle = {
  fontSize: 14,
  fontWeight: 950,
  color: "#0f172a",
};

const statusSubtitleStyle = {
  fontSize: 12,
  color: "#64748b",
};

const permissionsGridStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
  gap: 2,
};

const permissionGroupCardStyle = {
  borderRadius: "22px",
  overflow: "hidden",
  border: "1px solid rgba(226,232,240,0.95)",
  backgroundColor: "#fff",
};

const permissionGroupHeaderStyle = {
  p: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
};

const permissionGroupTitleStyle = {
  fontSize: 15,
  fontWeight: 950,
  color: "#0f172a",
};

const permissionGroupSubtitleStyle = {
  fontSize: 12,
  color: "#64748b",
};

const permissionListStyle = {
  p: 1.2,
  display: "flex",
  flexDirection: "column",
  gap: 0.7,
};

const permissionItemStyle = {
  minHeight: 42,
  px: 1,
  borderRadius: "14px",
  display: "grid",
  gridTemplateColumns: "42px minmax(0, 1fr)",
  alignItems: "center",
  cursor: "pointer",
  border: "1px solid transparent",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#f8fafc",
    borderColor: "rgba(226,232,240,0.9)",
  },
};

const permissionItemActiveStyle = {
  background: "linear-gradient(135deg, rgba(49,39,131,0.07), rgba(0,196,140,0.08))",
  borderColor: "rgba(49,39,131,0.16)",
};

const permissionTextStyle = {
  fontSize: 13,
  fontWeight: 800,
  color: "#334155",
};

const saveButtonStyle = {
  mt: 1,
  height: 48,
  borderRadius: "16px",
  fontWeight: 950,
  textTransform: "none",
  color: "#fff",
  background: "linear-gradient(135deg, #00a86b, #00c48c)",
  boxShadow: "0 16px 34px rgba(0,196,140,0.26)",
};

export default UserDetalhe;