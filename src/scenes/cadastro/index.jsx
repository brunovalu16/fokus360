import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  ListSubheader,
  Avatar,
  FormControl,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

import { initializeApp, deleteApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import {
  dbFokus360,
  storageFokus360,
  firebaseConfigFokus360,
} from "../../data/firebase-config";

const Cadastro = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [unidade, setUnidade] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadPhoto = async () => {
    if (!avatar) return "";

    try {
      const storageRef = ref(
        storageFokus360,
        `users/${Date.now()}_${avatar.name}`
      );

      await uploadBytes(storageRef, avatar);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Erro ao carregar a foto:", error);
      return "";
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    const secondaryAppName = "Fokus360Secondary";
    setSalvando(true);

    try {
      const secondaryApp = getApps().some((app) => app.name === secondaryAppName)
        ? getApp(secondaryAppName)
        : initializeApp(firebaseConfigFokus360, secondaryAppName);

      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );

      await sendEmailVerification(userCredential.user);

      let photoURL = "";

      if (avatar) {
        photoURL = await handleUploadPhoto();
      }

      const userData = {
        username,
        email,
        role,
        unidade,
        photoURL,
        emailVerified: false,
        createdAt: new Date(),
        createdBy: localStorage.getItem("userId"),
      };

      await setDoc(doc(dbFokus360, "user", userCredential.user.uid), userData);

      await signOut(secondaryAuth);
      await deleteApp(secondaryApp);

      alert("Usuário cadastrado com sucesso! Verifique o e-mail para confirmar.");

      setUsername("");
      setEmail("");
      setPassword("");
      setRole("");
      setUnidade("");
      setAvatar(null);
      setAvatarPreview("");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Erro: este e-mail já está cadastrado.");
        return;
      }

      alert("Erro ao cadastrar usuário.");
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
            <Box sx={heroStyle}>
              <Box sx={heroIconStyle}>
                <PersonAddAlt1Icon sx={{ color: "#fff", fontSize: 30 }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography sx={eyebrowStyle}>Gerenciamento de acessos</Typography>

                <Typography sx={titleStyle}>Cadastro de Usuário</Typography>

                <Typography sx={subtitleStyle}>
                  Crie novos usuários, defina unidade, perfil de acesso e foto.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: "rgba(148,163,184,0.22)" }} />

            <Box component="form" onSubmit={handleCadastro} sx={formStyle}>
              <Paper elevation={0} sx={avatarCardStyle}>
                <Avatar
                  src={avatarPreview || ""}
                  alt="Avatar do Usuário"
                  sx={avatarStyle}
                />

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={avatarTitleStyle}>Foto do usuário</Typography>

                  <Typography sx={avatarSubtitleStyle}>
                    Imagem opcional para identificação no sistema.
                  </Typography>

                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<PhotoCameraIcon />}
                    sx={uploadButtonStyle}
                  >
                    Selecionar Foto
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarChange}
                    />
                  </Button>
                </Box>
              </Paper>

              <Box sx={fieldsGridStyle}>
                <TextField
                  label="Nome"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  required
                  sx={fieldStyle}
                />

                <TextField
                  label="E-mail"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  sx={fieldStyle}
                />

                <TextField
                  label="Senha"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  sx={fieldStyle}
                />

                <FormControl fullWidth required sx={fieldStyle}>
                  <InputLabel id="unidade-label">Unidade</InputLabel>
                  <Select
                    labelId="unidade-label"
                    label="Unidade"
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                  >
                    <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                    <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                    <MenuItem value="MATOGROSSO">MATO GROSSO</MenuItem>
                    <MenuItem value="MATOGROSSODOSUL">MATO GROSSO DO SUL</MenuItem>
                    <MenuItem value="PARA">PARÁ</MenuItem>
                    <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
                  </Select>
                </FormControl>
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
                        maxHeight: 420,
                        borderRadius: "18px",
                      },
                    },
                  }}
                >
                  <MenuItem value="01">Diretoria</MenuItem>
                  <MenuItem value="02">Gerente</MenuItem>
                  <MenuItem value="03">Supervisor</MenuItem>
                  <MenuItem value="04">Vendedor</MenuItem>
                  <MenuItem value="06">Industria</MenuItem>
                  <MenuItem value="07">Projetos</MenuItem>
                  <MenuItem value="08">Admin</MenuItem>

                  <ListSubheader>Trade</ListSubheader>
                  <MenuItem value="09">Coordenador Trade</MenuItem>
                  <MenuItem value="10">Gerência Trade</MenuItem>
                  <MenuItem value="11">Analista Trade</MenuItem>

                  <ListSubheader>Contabilidade</ListSubheader>
                  <MenuItem value="12">Gerência Contabilidade</MenuItem>
                  <MenuItem value="13">Coordenador Contabilidade</MenuItem>
                  <MenuItem value="14">Analista Contabilidade</MenuItem>

                  <ListSubheader>Controladoria</ListSubheader>
                  <MenuItem value="15">Gerência Controladoria</MenuItem>
                  <MenuItem value="16">Coordenador Controladoria</MenuItem>
                  <MenuItem value="17">Analista Controladoria</MenuItem>
                  <MenuItem value="18">Analista 2 Controladoria</MenuItem>

                  <ListSubheader>Financeiro</ListSubheader>
                  <MenuItem value="19">Gerência Financeiro</MenuItem>
                  <MenuItem value="20">Coordenador Financeiro</MenuItem>
                  <MenuItem value="21">Analista Financeiro</MenuItem>

                  <ListSubheader>Jurídico</ListSubheader>
                  <MenuItem value="22">Gerência Jurídico</MenuItem>
                  <MenuItem value="23">Coordenador Jurídico</MenuItem>
                  <MenuItem value="24">Analista Jurídico</MenuItem>

                  <ListSubheader>Logística</ListSubheader>
                  <MenuItem value="25">Gerência Logística</MenuItem>
                  <MenuItem value="26">Coordenador Logística</MenuItem>
                  <MenuItem value="27">Analista Logística</MenuItem>

                  <ListSubheader>Marketing</ListSubheader>
                  <MenuItem value="28">Gerência Marketing</MenuItem>
                  <MenuItem value="29">Coordenador Marketing</MenuItem>
                  <MenuItem value="30">Analista Marketing</MenuItem>

                  <ListSubheader>Recursos Humanos</ListSubheader>
                  <MenuItem value="31">Gerência Recursos Humanos</MenuItem>
                  <MenuItem value="32">Coordenador Recursos Humanos</MenuItem>
                  <MenuItem value="33">Analista Recursos Humanos</MenuItem>

                  <ListSubheader>Central de Monitoramento</ListSubheader>
                  <MenuItem value="34">Gerência Central de Monitoramento</MenuItem>
                  <MenuItem value="35">Coordenador Central de Monitoramento</MenuItem>
                  <MenuItem value="36">Analista Central de Monitoramento</MenuItem>

                  <ListSubheader>Indústrias</ListSubheader>
                  <MenuItem value="37">Ajinomoto</MenuItem>
                  <MenuItem value="38">AB Mauri</MenuItem>
                  <MenuItem value="39">Adoralle</MenuItem>
                  <MenuItem value="40">Bettanin</MenuItem>
                  <MenuItem value="41">Mars</MenuItem>
                  <MenuItem value="42">Mars Pet</MenuItem>
                  <MenuItem value="43">M. Dias</MenuItem>
                  <MenuItem value="44">SCJhonson</MenuItem>
                  <MenuItem value="45">UAU Ingleza</MenuItem>
                  <MenuItem value="46">Danone</MenuItem>
                  <MenuItem value="47">Ypê</MenuItem>
                  <MenuItem value="48">Adoralle</MenuItem>
                  <MenuItem value="49">Fini</MenuItem>
                  <MenuItem value="50">Heinz</MenuItem>
                  <MenuItem value="51">Red Bull</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={salvando}
                startIcon={<AdminPanelSettingsIcon />}
                sx={submitButtonStyle}
              >
                {salvando ? "Cadastrando..." : "Cadastrar Usuário"}
              </Button>
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
  maxWidth: 980,
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
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
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

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  width: "100%",
  minWidth: 0,
};

const avatarCardStyle = {
  p: 2,
  display: "flex",
  alignItems: { xs: "flex-start", sm: "center" },
  flexDirection: { xs: "column", sm: "row" },
  gap: 2,
  borderRadius: "22px",
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
  boxShadow: "0 12px 26px rgba(49,39,131,0.22)",
  "&:hover": {
    background: "linear-gradient(135deg, #241d66, #5c4df2)",
  },
};

const fieldsGridStyle = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "1fr 1fr",
  },
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

const submitButtonStyle = {
  mt: 1,
  height: 48,
  borderRadius: "16px",
  fontWeight: 950,
  textTransform: "none",
  color: "#fff",
  background: "linear-gradient(135deg, #00a86b, #00c48c)",
  boxShadow: "0 16px 34px rgba(0,196,140,0.26)",
  "&:hover": {
    background: "linear-gradient(135deg, #059669, #00b884)",
    boxShadow: "0 18px 38px rgba(0,196,140,0.32)",
  },
};

export default Cadastro;