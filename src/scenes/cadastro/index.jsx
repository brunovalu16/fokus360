import React, { useState } from "react";
import { 
  Box, Button, TextField, Select, MenuItem, InputLabel, 
  Avatar, FormControl 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

import { dbFokus360, storageFokus360 } from "../../data/firebase-config";

import { authFokus360 } from "../../data/firebase-config";

import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ✅ Importando imagens corretamente
import logoImage from "../../assets/images/icone_logo.png";

const Cadastro = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [unidade, setUnidade] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(""); 
  const navigate = useNavigate();

  // Função para atualizar o preview do avatar
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file)); // Gera preview da imagem
    }
  };

  // Upload de foto no Firebase Storage
  const handleUploadPhoto = async () => {
    if (!avatar) return "";

    try {
      const storageRef = ref(storageFokus360, `users/${Date.now()}_${avatar.name}`);
      await uploadBytes(storageRef, avatar);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Erro ao carregar a foto:", error);
      return "";
    }
  };

  // Cadastro de usuário
  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(authFokus360, email, password);
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
        photoURL
      };

      await setDoc(doc(dbFokus360, "user", userCredential.user.uid), userData);

      alert("Usuário cadastrado com sucesso! Verifique seu e-mail para confirmar.");
      navigate("/cadastro");
    } catch (error) {
      alert(`Erro ao cadastrar usuário, email já cadastrado.`);
    }
  };

  return (
    <Box sx={{ transform: "scale(0.8)", transformOrigin: "top center" }}>
      <Box 
        display="flex" flexDirection="row" alignItems="center" justifyContent="center"
        sx={{ backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "80vw", minHeight: "90vh" }}
      >
        {/* ✅ Logo - Agora Importada */}
        <Box sx={{ backgroundColor: "#312783", padding: "192px", paddingRight: "80px", borderBottomLeftRadius: "50px" }}>
          <img src={logoImage} alt="Logo" style={{ width: "75%", height: "auto", marginRight: "100px" }} />
        </Box>

        {/* Formulário de Cadastro */}
        <Box sx={{ borderTopRightRadius: "50px", backgroundColor: "white", padding: 5, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", width: "90%", maxWidth: 400, textAlign: "center" }}>
          <Box component="form" onSubmit={handleCadastro} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            
            {/* Avatar */}
            <Box textAlign="center" mb={2}>
              <Avatar src={avatarPreview || ""} alt="Avatar do Usuário" sx={{ width: 100, height: 100, margin: "0 auto", border: "2px solid #9d9d9c", borderRadius: 5 }} />
              <Button 
                variant="outlined" component="label"
                sx={{ textTransform: "none", marginBottom: 2, marginTop: "10px", backgroundColor: "#312783", color: "#fff", border: "none", width: "50%", borderRadius: "10px" }}
              >
                Selecionar Foto
                <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              </Button>
            </Box>

            <TextField label="Nome" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth required />
            <TextField label="E-mail" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
            <TextField label="Senha" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />

            <FormControl fullWidth required>
              <InputLabel id="unidade-label">Unidade</InputLabel>
              <Select labelId="unidade-label" value={unidade} onChange={(e) => setUnidade(e.target.value)}>
                <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                <MenuItem value="MATOGROSSO">MATO GROSSO</MenuItem>
                <MenuItem value="MATOGROSSODOSUL">MATO GROSSO DO SUL</MenuItem>
                <MenuItem value="PARA">PARÁ</MenuItem>
                <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel id="role-label">Perfil</InputLabel>
              <Select labelId="role-label" value={role} onChange={(e) => setRole(e.target.value)}>
                <MenuItem value="01">Diretoria</MenuItem>
                <MenuItem value="02">Gerente</MenuItem>
                <MenuItem value="03">Supervisor</MenuItem>
                <MenuItem value="04">Vendedor</MenuItem>
                <MenuItem value="06">Industria</MenuItem>
                <MenuItem value="07">Projetos</MenuItem>
                <MenuItem value="08">Admin</MenuItem>
                {/**Trade */}
                <MenuItem value="09">Coordenador Trade</MenuItem>
                <MenuItem value="10">Gerência Trade</MenuItem>
                <MenuItem value="11">Analista Trade</MenuItem>
                {/**Contabilidade */}
                <MenuItem value="12">Gerência Contabilidade</MenuItem>
                <MenuItem value="13">Coordenador Contabilidade</MenuItem>
                <MenuItem value="14">Analista Contabilidade</MenuItem>
                {/**Controladoria */}
                <MenuItem value="15">Gerência Controladoria</MenuItem>
                <MenuItem value="16">Coordenador Controladoria</MenuItem>
                <MenuItem value="17">Analista Controladoria</MenuItem>
                <MenuItem value="18">Analista 2 Controladoria</MenuItem>
                {/**Financeiro */}
                <MenuItem value="19">Gerência Financeiro</MenuItem>
                <MenuItem value="20">Coordenador Financeiro</MenuItem>
                <MenuItem value="21">Analista Financeiro</MenuItem>
                {/**Juridico */}
                <MenuItem value="22">Gerência Juridico</MenuItem>
                <MenuItem value="23">Coordenador Juridico</MenuItem>
                <MenuItem value="24">Analista Juridico</MenuItem>
                {/**Logistica */}
                <MenuItem value="25">Gerência Logistica</MenuItem>
                <MenuItem value="26">Coordenador Logistica</MenuItem>
                <MenuItem value="27">Analista Logistica</MenuItem>
                {/**Marketing */}
                <MenuItem value="28">Gerência Marketing</MenuItem>
                <MenuItem value="29">Coordenador Marketing</MenuItem>
                <MenuItem value="30">Analista Marketing</MenuItem>
                {/**Recursos Humanos */}
                <MenuItem value="31">Gerência Recursos Humanos</MenuItem>
                <MenuItem value="32">Coordenador Recursos Humanos</MenuItem>
                <MenuItem value="33">Analista Recursos Humanos</MenuItem>
                {/**Central de Monitoramento */}
                <MenuItem value="34">Gerência Central de Monitoramento</MenuItem>
                <MenuItem value="35">Coordenador Central de Monitoramento</MenuItem>
                <MenuItem value="36">Analista Central de Monitoramento</MenuItem>
              </Select>
            </FormControl>

            <Button 
              variant="contained" type="submit" fullWidth
              sx={{ borderRadius: 2, backgroundColor: "#312783", color: "white", boxShadow: "none", "&:hover": { backgroundColor: "#868dfb", boxShadow: "none" } }}
            >
              CADASTRAR
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Cadastro;
