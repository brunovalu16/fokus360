import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Avatar,
  ListSubheader,
  Paper,
  Divider,
  Chip,
} from "@mui/material";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useLocation } from "react-router-dom";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { dbFokus360, storageFokus360 } from "../data/firebase-config";

const UserDetalhe = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");

  const [originalEmail, setOriginalEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    role: "",
    unidade: "",
    photoURL: "",
  });

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      const userDoc = await getDoc(doc(dbFokus360, "user", userId));

      if (userDoc.exists()) {
        const data = userDoc.data();

        setFormValues({
          username: data.username || "",
          email: data.email || "",
          role: data.role || "",
          unidade: data.unidade || "",
          photoURL: data.photoURL || "",
        });

        setOriginalEmail(data.email || "");
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleUser = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const userRef = doc(dbFokus360, "user", userId);
      const emailChanged = formValues.email !== originalEmail;

      await updateDoc(userRef, {
        username: formValues.username,
        email: formValues.email,
        role: formValues.role,
        unidade: formValues.unidade,
        photoURL: formValues.photoURL,
      });

      if (emailChanged) {
        const response = await fetch(
          `${import.meta.env.VITE_FOKUS360_DATABASEURL}/api/update-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: userId,
              newEmail: formValues.email,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setOriginalEmail(formValues.email);
          alert("E-mail atualizado com sucesso!");
        } else {
          alert(
            `Erro ao atualizar o e-mail no servidor: ${
              data.message || "Tente novamente."
            }`
          );
        }
      } else {
        alert("Dados do usuário atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error.message);

      if (error.code === "auth/requires-recent-login") {
        alert("Sua sessão expirou. Faça login novamente para continuar.");
      } else if (error.code === "auth/operation-not-allowed") {
        alert("Por favor, verifique o novo e-mail antes de alterá-lo.");
      } else {
        alert("Alterações realizadas com sucesso!");
      }
    } finally {
      setSalvando(false);
    }
  };

  const handleUploadPhoto = (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("Nenhum arquivo foi selecionado.");
      return;
    }

    setUploading(true);

    const nomeSeguro = file.name.replace(/\//g, "-");
    const storageRef = ref(storageFokus360, `users/${Date.now()}_${nomeSeguro}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progresso do upload: ${progress}%`);
      },
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

          console.log("✅ Foto carregada e URL atualizada:", photoURL);
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
                  Atualize dados de acesso, unidade, perfil e foto do usuário.
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
                  label={`Perfil ${formValues.role || "--"}`}
                  sx={roleChipStyle}
                />

                <Button
                  variant="contained"
                  component="label"
                  disabled={uploading}
                  startIcon={<PhotoCameraIcon />}
                  sx={uploadButtonStyle}
                >
                  {uploading ? "Carregando..." : "Carregar Foto"}

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleUploadPhoto}
                  />
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
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.username}
                    onChange={(e) =>
                      setFormValues({ ...formValues, username: e.target.value })
                    }
                    sx={fieldStyle}
                  />

                  <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={formValues.email}
                    onChange={(e) =>
                      setFormValues({ ...formValues, email: e.target.value })
                    }
                    sx={fieldStyle}
                  />

                  <FormControl fullWidth required sx={fieldStyle}>
                    <InputLabel id="unidade-label">Unidade</InputLabel>
                    <Select
                      labelId="unidade-label"
                      value={formValues.unidade}
                      onChange={(e) =>
                        setFormValues({ ...formValues, unidade: e.target.value })
                      }
                      label="Unidade"
                    >
                      <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                      <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                      <MenuItem value="MATOGROSSO">MATO GROSSO</MenuItem>
                      <MenuItem value="MATOGROSSODOSUL">
                        MATO GROSSO DO SUL
                      </MenuItem>
                      <MenuItem value="PARÁ">PARÁ</MenuItem>
                      <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth required sx={fieldStyle}>
                    <InputLabel id="role-label">Perfil</InputLabel>
                    <Select
                      labelId="role-label"
                      value={formValues.role}
                      onChange={(e) =>
                        setFormValues({ ...formValues, role: e.target.value })
                      }
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
                      <MenuItem value="22">Gerência Juridico</MenuItem>
                      <MenuItem value="23">Coordenador Juridico</MenuItem>
                      <MenuItem value="24">Analista Juridico</MenuItem>

                      <ListSubheader>Logística</ListSubheader>
                      <MenuItem value="25">Gerência Logistica</MenuItem>
                      <MenuItem value="26">Coordenador Logistica</MenuItem>
                      <MenuItem value="27">Analista Logistica</MenuItem>

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
                      <MenuItem value="35">
                        Coordenador Central de Monitoramento
                      </MenuItem>
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
                    fullWidth
                    type="submit"
                    disabled={salvando}
                    startIcon={<SaveIcon />}
                    sx={saveButtonStyle}
                  >
                    {salvando ? "Salvando..." : "Salvar Alterações"}
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
  background:
    "radial-gradient(circle at top right, rgba(49,39,131,0.10), transparent 35%), #fff",
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
  "&:hover": {
    background: "linear-gradient(135deg, #241d66, #5c4df2)",
  },
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

const saveButtonStyle = {
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
  },
};

export default UserDetalhe;