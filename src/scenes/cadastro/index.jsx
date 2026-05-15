import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";

import { initializeApp, deleteApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  dbFokus360,
  storageFokus360,
  firebaseConfigFokus360,
} from "../../data/firebase-config";

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
    icon: <EditIcon />,
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
    icon: <VisibilityIcon />,
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

const Cadastro = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [unidade, setUnidade] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [perfis, setPerfis] = useState([]);
  const [carregandoPerfis, setCarregandoPerfis] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const [nomePerfil, setNomePerfil] = useState("");
  const [ativoPerfil, setAtivoPerfil] = useState(true);
  const [perfilEditando, setPerfilEditando] = useState(null);
  const [permissoesPerfil, setPermissoesPerfil] = useState({ ...permissoesVazias });
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const perfilSelecionado = useMemo(() => {
    return perfis.find((p) => p.role === role) || PERFIS_FIXOS.find((p) => p.role === role);
  }, [perfis, role]);

 const todosPerfis = useMemo(() => {
  return [...PERFIS_FIXOS].sort((a, b) =>
    String(a.role).localeCompare(
      String(b.role),
      "pt-BR",
      { numeric: true }
    )
  );
}, []);

  const perfisAgrupados = useMemo(() => {
    return todosPerfis.reduce((acc, perfil) => {
      const grupo = perfil.grupo || "Outros";
      if (!acc[grupo]) acc[grupo] = [];
      acc[grupo].push(perfil);
      return acc;
    }, {});
  }, [todosPerfis]);

  const carregarPerfis = async () => {
    setCarregandoPerfis(true);

    try {
      const q = query(collection(dbFokus360, "user"), where("tipo", "==", "perfil"));
      const snap = await getDocs(q);

      const lista = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setPerfis(
        lista
          .filter((p) => p.ativo !== false)
          .sort((a, b) =>
            String(a.role).localeCompare(String(b.role), "pt-BR", { numeric: true })
          )
      );
    } catch (error) {
      console.error("Erro ao carregar perfis:", error);
      alert(`Erro ao carregar perfis: ${error.code || ""} - ${error.message}`);
    } finally {
      setCarregandoPerfis(false);
    }
  };

  useEffect(() => {
    carregarPerfis();
  }, []);

  const gerarProximoRole = () => {
    const rolesNumericos = todosPerfis
      .map((p) => Number(p.role))
      .filter((n) => !Number.isNaN(n));

    const maior = rolesNumericos.length ? Math.max(...rolesNumericos) : 51;
    return String(maior + 1).padStart(2, "0");
  };

 const abrirNovoPerfil = () => {
  setModalPerfilAberto(true);
};

  const abrirEditarPerfil = (perfil) => {
    setPerfilEditando(perfil);
    setNomePerfil(perfil.nome || "");
    setAtivoPerfil(perfil.ativo !== false);
    setPermissoesPerfil({
      ...permissoesVazias,
      ...(perfil.permissoes || {}),
    });
    setModalPerfilAberto(true);
  };

  const marcarGrupo = (grupo, checked) => {
    const keys = grupo.itens.map(([key]) => key);

    setPermissoesPerfil((prev) => {
      const novo = { ...prev };
      keys.forEach((key) => {
        novo[key] = checked;
      });
      return novo;
    });
  };



  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadPhoto = async () => {
    if (!avatar) return "";

    const storageRef = ref(storageFokus360, `users/${Date.now()}_${avatar.name}`);
    await uploadBytes(storageRef, avatar);
    return await getDownloadURL(storageRef);
  };

  const verificarEmailJaCadastrado = async (emailDigitado) => {
    const emailTratado = emailDigitado.trim().toLowerCase();

    const q = query(
      collection(dbFokus360, "user"),
      where("emailLower", "==", emailTratado),
      limit(1)
    );

    const snap = await getDocs(q);
    return !snap.empty;
  };


  const montarPermissoesParaSalvar = () => {
  return PERMISSOES.flatMap((grupo) => grupo.itens).reduce((acc, [key]) => {
    acc[key] = permissoesPerfil[key] === true;
    return acc;
  }, {});
};



  const handleCadastro = async (e) => {
    e.preventDefault();

    const emailTratado = email.trim().toLowerCase();

    if (!username.trim()) return alert("Informe o nome do usuário.");
    if (!emailTratado) return alert("Informe o e-mail.");
    if (!password.trim()) return alert("Informe a senha.");
    if (!unidade) return alert("Selecione a unidade.");
    if (!perfilSelecionado) return alert("Selecione um perfil válido.");

    setSalvando(true);

    const secondaryAppName = "Fokus360Secondary";
    let secondaryApp = null;

    try {
      const emailExiste = await verificarEmailJaCadastrado(emailTratado);

      if (emailExiste) {
        alert("Erro: este e-mail já está cadastrado no banco.");
        setSalvando(false);
        return;
      }

      secondaryApp = getApps().some((app) => app.name === secondaryAppName)
        ? getApp(secondaryAppName)
        : initializeApp(firebaseConfigFokus360, secondaryAppName);

      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        emailTratado,
        password
      );

      await sendEmailVerification(userCredential.user);

      const photoURL = avatar ? await handleUploadPhoto() : "";

      const userData = {
        tipo: "usuario",
        username: username.trim(),
        email: emailTratado,
        emailLower: emailTratado,
        role: perfilSelecionado.role,
        roleNome: perfilSelecionado.nome,
        perfilId: perfilSelecionado.id || "",
        unidade,
        photoURL,
        permissoes: montarPermissoesParaSalvar(),
        emailVerified: false,
        ativo: true,
        createdAt: serverTimestamp(),
        createdBy: localStorage.getItem("userId") || "",
      };

      await setDoc(doc(dbFokus360, "user", userCredential.user.uid), userData);

      await signOut(secondaryAuth);

      alert("Usuário cadastrado com sucesso! Verifique o e-mail para confirmar.");

      setUsername("");
      setEmail("");
      setPassword("");
      setRole("");
      setUnidade("");
      setAvatar(null);
      setAvatarPreview("");
      setNomePerfil("");
setAtivoPerfil(true);
setPermissoesPerfil({ ...permissoesVazias });
setPerfilEditando(null);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Erro: este e-mail já está cadastrado.");
        return;
      }

      if (error.code === "permission-denied") {
        alert("Erro: sem permissão para salvar na coleção user.");
        return;
      }

      alert(`Erro ao cadastrar usuário: ${error.code || ""} - ${error.message}`);
    } finally {
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch (e) {
          console.warn("Secondary app já foi encerrado.");
        }
      }

      setSalvando(false);
    }
  };

  return (
    <Box sx={pageStyle}>
      <Box sx={pageInnerStyle}>
        <Paper elevation={0} sx={mainCardStyle}>
          <Box sx={topBarStyle} />

          <Box sx={contentStyle}>
            <Box sx={heroStyle}>
              <Box sx={heroIconStyle}>
                <PersonAddAlt1Icon sx={{ color: "#fff", fontSize: 30 }} />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={eyebrowStyle}>FOKUS 360 • Segurança e permissões</Typography>
                <Typography sx={titleStyle}>Cadastro de Usuário</Typography>
                <Typography sx={subtitleStyle}>
                  Crie usuários, vincule unidade, perfil e permissões corporativas.
                </Typography>
              </Box>
            </Box>

            {carregandoPerfis && <LinearProgress sx={{ mt: 3, borderRadius: 99 }} />}

            <Divider sx={{ my: 3, borderColor: "rgba(148,163,184,0.22)" }} />

            <Box component="form" onSubmit={handleCadastro} sx={formStyle}>
              <Paper elevation={0} sx={avatarCardStyle}>
                <Avatar src={avatarPreview || ""} alt="Avatar do Usuário" sx={avatarStyle} />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={avatarTitleStyle}>Foto do usuário</Typography>
                  <Typography sx={avatarSubtitleStyle}>
                    Imagem opcional para identificação interna no FOKUS 360.
                  </Typography>

                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<PhotoCameraIcon />}
                    sx={uploadButtonStyle}
                  >
                    Selecionar Foto
                    <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                  </Button>
                </Box>

                {perfilSelecionado && (
                  <Box sx={selectedRoleCardStyle}>
                    <Typography sx={selectedRoleLabelStyle}>Perfil selecionado</Typography>
                    <Typography sx={selectedRoleTitleStyle}>{perfilSelecionado.nome}</Typography>
                    <Chip size="small" label={`Role ${perfilSelecionado.role}`} sx={selectedRoleChipStyle} />
                  </Box>
                )}
              </Paper>

              <Box sx={fieldsGridStyle}>
                <TextField label="Nome" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth required sx={fieldStyle} />
                <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required sx={fieldStyle} />
                <TextField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required sx={fieldStyle} />

                <FormControl fullWidth required sx={fieldStyle}>
                  <InputLabel id="unidade-label">Unidade</InputLabel>
                  <Select labelId="unidade-label" label="Unidade" value={unidade} onChange={(e) => setUnidade(e.target.value)}>
                    <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                    <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                    <MenuItem value="MATOGROSSO">MATO GROSSO</MenuItem>
                    <MenuItem value="MATOGROSSODOSUL">MATO GROSSO DO SUL</MenuItem>
                    <MenuItem value="PARA">PARÁ</MenuItem>
                    <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Paper elevation={0} sx={profileSelectCardStyle}>
                <Box sx={sectionHeaderStyle}>
                  <Box>
                    <Typography sx={sectionTitleStyle}>Perfil de acesso</Typography>
                    <Typography sx={sectionSubtitleStyle}>
                      O usuário será amarrado ao role e às permissões deste perfil.
                    </Typography>
                  </Box>

                  <Button variant="outlined" startIcon={<AddModeratorIcon />} onClick={abrirNovoPerfil} sx={outlineButtonStyle}>
                    Diretrizes do perfil
                  </Button>
                </Box>

                <FormControl fullWidth required sx={fieldStyle}>
                  <InputLabel id="role-label">Perfil</InputLabel>
                  <Select
                    labelId="role-label"
                    label="Perfil"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
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
                    {Object.entries(perfisAgrupados).map(([grupo, lista]) => [
                      <MenuItem disabled key={`${grupo}-header`} sx={menuHeaderStyle}>
                        {grupo}
                      </MenuItem>,
                      ...lista.map((perfil) => (
                        <MenuItem key={`${perfil.role}-${perfil.nome}`} value={perfil.role}>
                          <Box sx={menuItemRoleStyle}>
                            <span>{perfil.nome}</span>
                            <Chip size="small" label={perfil.role} sx={miniRoleChipStyle} />
                          </Box>
                        </MenuItem>
                      )),
                    ])}
                  </Select>
                </FormControl>
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
      <AdminPanelSettingsIcon />
    )
  }
  sx={submitButtonStyle}
>
  {salvando ? "Salvando no banco..." : "Cadastrar Usuário"}
</Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Dialog open={modalPerfilAberto} onClose={() => setModalPerfilAberto(false)} fullWidth maxWidth="lg" PaperProps={{ sx: dialogPaperStyle }}>
        <DialogTitle sx={dialogTitleStyle}>
          <Box sx={dialogTitleLeftStyle}>
            <Box sx={dialogIconStyle}>
              <SecurityIcon />
            </Box>

            <Box>
              <Typography sx={dialogEyebrowStyle}>Centro de permissões</Typography>
              <Typography sx={dialogTitleTextStyle}>{perfilEditando ? "Editar Perfil" : "Novo Perfil"}</Typography>
            </Box>
          </Box>

          <IconButton onClick={() => setModalPerfilAberto(false)} sx={closeButtonStyle}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={dialogContentStyle}>
          <Box sx={profileFormTopStyle}>
            <TextField label="Nome do Perfil" value={nomePerfil} onChange={(e) => setNomePerfil(e.target.value)} fullWidth required sx={fieldStyle} />

            <Paper elevation={0} sx={activeCardStyle}>
              <Box>
                <Typography sx={activeTitleStyle}>Perfil ativo</Typography>
                <Typography sx={activeSubtitleStyle}>Quando desativado, não aparece no cadastro de usuário.</Typography>
              </Box>

              <Switch checked={ativoPerfil} onChange={(e) => setAtivoPerfil(e.target.checked)} />
            </Paper>
          </Box>

          <Box sx={permissionsGridStyle}>
            {PERMISSOES.map((grupo) => {
              const keys = grupo.itens.map(([key]) => key);
              const todosMarcados = keys.every((key) => permissoesPerfil[key]);

              return (
                <Paper elevation={0} sx={permissionGroupCardStyle} key={grupo.grupo}>
                  <Box sx={permissionGroupHeaderStyle}>
                    <Box sx={permissionGroupIconStyle}>{grupo.icon}</Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography sx={permissionGroupTitleStyle}>{grupo.grupo}</Typography>
                      <Typography sx={permissionGroupSubtitleStyle}>
                        {keys.filter((key) => permissoesPerfil[key]).length} de {keys.length} permissões ativas
                      </Typography>
                    </Box>

                    <FormControlLabel
                      control={<Checkbox checked={todosMarcados} onChange={(e) => marcarGrupo(grupo, e.target.checked)} />}
                      label="Todos"
                      sx={checkAllStyle}
                    />
                  </Box>

                  <Divider sx={{ borderColor: "rgba(226,232,240,0.9)" }} />

                  <Box sx={permissionListStyle}>
  {grupo.itens.map(([key, label]) => {
    const marcado = permissoesPerfil[key] === true;

    return (
      <Box
        key={key}
        sx={{
          ...permissionItemStyle,
          ...(marcado ? permissionItemActiveStyle : {}),
        }}
       onClick={() => {
        setPermissoesPerfil((prev) => {
          const novoValor = prev[key] !== true;

          return {
            ...prev,
            [key]: novoValor,
          };
        });
      }}
      >
        <Checkbox
          checked={marcado}
          onChange={(e) => {
            const checked = e.target.checked;

            setPermissoesPerfil((prev) => ({
              ...prev,
              [key]: checked,
            }));
          }}
          onClick={(e) => e.stopPropagation()}
        />

        <Typography sx={permissionTextStyle}>
          {label}
        </Typography>

        <Tooltip title="Permissão operacional do FOKUS 360">
          <Typography sx={learnMoreStyle}>Saiba mais...</Typography>
        </Tooltip>
      </Box>
    );
  })}
</Box>
                </Paper>
              );
            })}
          </Box>

          {perfis.length > 0 && (
            <Paper elevation={0} sx={savedProfilesStyle}>
              <Box sx={sectionHeaderStyle}>
                <Box>
                  <Typography sx={sectionTitleStyle}>Perfis personalizados já criados</Typography>
                  <Typography sx={sectionSubtitleStyle}>Clique na ferramenta para editar permissões.</Typography>
                </Box>
              </Box>

              <Box sx={savedProfilesListStyle}>
                {perfis.map((perfil) => (
                  <Box key={perfil.id} sx={savedProfileItemStyle}>
                    <Box>
                      <Typography sx={savedProfileNameStyle}>{perfil.nome}</Typography>
                      <Typography sx={savedProfileMetaStyle}>
                        Role {perfil.role} • {perfil.ativo === false ? "Inativo" : "Ativo"}
                      </Typography>
                    </Box>

                    <IconButton onClick={() => abrirEditarPerfil(perfil)} sx={toolButtonStyle}>
                      <SettingsIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          <Box sx={dialogActionsStyle}>
            <Button
              variant="outlined"
              onClick={() => setModalPerfilAberto(false)}
              sx={cancelButtonStyle}
            >
              Fechar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
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
  maxWidth: 1080,
  minWidth: 0,
  mx: "auto",
};

const mainCardStyle = {
  width: "100%",
  borderRadius: { xs: "22px", md: "32px" },
  overflow: "hidden",
  background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
  boxShadow: "0 30px 90px rgba(15,23,42,0.14)",
  border: "1px solid rgba(226,232,240,0.95)",
};

const topBarStyle = {
  height: 8,
  background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
};

const contentStyle = {
  p: { xs: 2, sm: 3, md: 4 },
};

const heroStyle = {
  display: "flex",
  alignItems: { xs: "flex-start", md: "center" },
  flexDirection: { xs: "column", md: "row" },
  gap: 1.8,
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
};

const avatarCardStyle = {
  p: 2,
  display: "flex",
  alignItems: { xs: "flex-start", md: "center" },
  flexDirection: { xs: "column", md: "row" },
  gap: 2,
  borderRadius: "24px",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
};

const avatarStyle = {
  width: 104,
  height: 104,
  border: "3px solid rgba(49,39,131,0.22)",
  borderRadius: "24px",
  backgroundColor: "#f8fafc",
};

const avatarTitleStyle = {
  fontSize: 16,
  fontWeight: 950,
  color: "#0f172a",
};

const avatarSubtitleStyle = {
  color: "#64748b",
  fontSize: 13,
  mt: 0.4,
  mb: 1.4,
};

const uploadButtonStyle = {
  height: 40,
  px: 2,
  borderRadius: "13px",
  textTransform: "none",
  fontWeight: 900,
  color: "#fff",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
};

const fieldsGridStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
  gap: 2,
};

const fieldStyle = {
  backgroundColor: "#fff",
  borderRadius: "16px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
  },
};

const profileSelectCardStyle = {
  p: 2,
  borderRadius: "24px",
  background: "linear-gradient(135deg, #ffffff, #f8fafc)",
  border: "1px solid rgba(226,232,240,0.95)",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: { xs: "flex-start", sm: "center" },
  justifyContent: "space-between",
  gap: 2,
  mb: 2,
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

const outlineButtonStyle = {
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 900,
  borderColor: "rgba(49,39,131,0.28)",
  color: "#312783",
};

const selectedRoleCardStyle = {
  p: 1.6,
  minWidth: { xs: "100%", md: 220 },
  borderRadius: "20px",
  background: "linear-gradient(135deg, rgba(49,39,131,0.08), rgba(0,196,140,0.08))",
  border: "1px solid rgba(49,39,131,0.12)",
};

const selectedRoleLabelStyle = {
  fontSize: 11,
  color: "#64748b",
  fontWeight: 900,
  textTransform: "uppercase",
};

const selectedRoleTitleStyle = {
  fontSize: 16,
  color: "#0f172a",
  fontWeight: 950,
  mt: 0.4,
};

const selectedRoleChipStyle = {
  mt: 1,
  height: 24,
  fontWeight: 900,
  color: "#312783",
  backgroundColor: "rgba(49,39,131,0.10)",
};

const menuHeaderStyle = {
  fontSize: 12,
  fontWeight: 950,
  color: "#312783",
  backgroundColor: "#f8fafc",
  opacity: "1 !important",
};

const menuItemRoleStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
};

const miniRoleChipStyle = {
  height: 22,
  fontSize: 11,
  fontWeight: 900,
  backgroundColor: "#eef2ff",
  color: "#312783",
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
};

const dialogPaperStyle = {
  borderRadius: "28px",
  overflow: "hidden",
  background: "linear-gradient(135deg, #ffffff, #f8fafc)",
};

const dialogTitleStyle = {
  p: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid rgba(226,232,240,0.9)",
};

const dialogTitleLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.6,
};

const dialogIconStyle = {
  width: 52,
  height: 52,
  borderRadius: "18px",
  color: "#fff",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const dialogEyebrowStyle = {
  fontSize: 11,
  fontWeight: 950,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const dialogTitleTextStyle = {
  fontSize: 24,
  fontWeight: 950,
  color: "#0f172a",
};

const closeButtonStyle = {
  color: "#64748b",
  backgroundColor: "#f1f5f9",
};

const dialogContentStyle = {
  p: 3,
};

const profileFormTopStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
  gap: 2,
  mb: 2,
};

const activeCardStyle = {
  p: 1.5,
  borderRadius: "18px",
  border: "1px solid rgba(226,232,240,0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#fff",
};

const activeTitleStyle = {
  fontSize: 14,
  fontWeight: 950,
  color: "#0f172a",
};

const activeSubtitleStyle = {
  fontSize: 12,
  color: "#64748b",
};

const permissionsGridStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
  gap: 2,
};

const permissionGroupCardStyle = {
  borderRadius: "24px",
  overflow: "hidden",
  border: "1px solid rgba(226,232,240,0.95)",
  backgroundColor: "#fff",
  boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
};

const permissionGroupHeaderStyle = {
  p: 2,
  display: "flex",
  alignItems: "center",
  gap: 1.5,
};

const permissionGroupIconStyle = {
  width: 42,
  height: 42,
  borderRadius: "15px",
  backgroundColor: "#eef2ff",
  color: "#312783",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

const checkAllStyle = {
  m: 0,
  "& .MuiFormControlLabel-label": {
    fontSize: 12,
    fontWeight: 900,
    color: "#475569",
  },
};

const permissionListStyle = {
  p: 1.2,
  display: "flex",
  flexDirection: "column",
  gap: 0.8,
};

const permissionItemStyle = {
  minHeight: 44,
  px: 1,
  borderRadius: "14px",
  display: "grid",
  gridTemplateColumns: "42px minmax(0, 1fr) auto",
  alignItems: "center",
  gap: 1,
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

const learnMoreStyle = {
  fontSize: 11,
  color: "#64748b",
  textDecoration: "underline",
};

const savedProfilesStyle = {
  mt: 2,
  p: 2,
  borderRadius: "24px",
  border: "1px solid rgba(226,232,240,0.95)",
  backgroundColor: "#fff",
};

const savedProfilesListStyle = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
  gap: 1.2,
};

const savedProfileItemStyle = {
  p: 1.4,
  borderRadius: "16px",
  backgroundColor: "#f8fafc",
  border: "1px solid rgba(226,232,240,0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
};

const savedProfileNameStyle = {
  fontSize: 13,
  fontWeight: 950,
  color: "#0f172a",
};

const savedProfileMetaStyle = {
  fontSize: 11,
  color: "#64748b",
};

const toolButtonStyle = {
  color: "#312783",
  backgroundColor: "#eef2ff",
};

const dialogActionsStyle = {
  mt: 3,
  display: "flex",
  justifyContent: "flex-end",
  gap: 1.5,
};

const cancelButtonStyle = {
  height: 44,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 900,
};

const saveProfileButtonStyle = {
  height: 44,
  borderRadius: "14px",
  px: 3,
  textTransform: "none",
  fontWeight: 950,
  color: "#fff",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
};

export default Cadastro;