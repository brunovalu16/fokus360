import React, { useState } from "react";
import { Box, Button, TextField, Select, MenuItem, InputLabel, Avatar, FormControl, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../data/firebase-config.js";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { storage } from "../../data/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Cadastro = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [unidade, setUnidade] = useState("");
  const [avatar, setAvatar] = useState(null); // Estado para armazenar o URL da imagem do avatar
  const [avatarFile, setAvatarFile] = useState(null); // Estado para armazenar o arquivo
  const [avatarPreview, setAvatarPreview] = useState(""); // Preview da imagem selecionada
  const navigate = useNavigate();

// Função para atualizar o preview do avatar
const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file)); // Gera preview da imagem
  }
};

//Função de Upload da Foto
// Função para upload da foto no Firebase Storage
const handleUploadPhoto = async () => {
  if (!avatar) {
    console.error("Nenhum arquivo selecionado.");
    return "";
  }

  try {
    const storageRef = ref(storage, `users/${Date.now()}_${avatar.name}`);
    await uploadBytes(storageRef, avatar); // Faz o upload do arquivo
    const downloadURL = await getDownloadURL(storageRef); // Obtém a URL pública
    console.log("URL da foto:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Erro ao carregar a foto:", error);
    throw error;
  }
};

 // Função para cadastrar o usuário
 const handleCadastro = async (e) => {
  e.preventDefault();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuário criado com sucesso:", userCredential.user);

    let photoURL = "";
    if (avatar) {
      photoURL = await handleUploadPhoto(); // Faz o upload da foto e obtém a URL
    }

    if (userCredential) {
      const user = userCredential.user.uid;
      const userData = {
        username,
        email,
        role,
        unidade,
        photoURL, // Salva a URL da foto
      };
      await setDoc(doc(db, "user", user), userData);

      alert("Usuário cadastrado com sucesso!");
    }

    navigate("/cadastro");
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error.message);
  }
};
  
  

  return (
    <Box
    sx={{
      transform: "scale(0.8)",
      transformOrigin: "top center", // Define o ponto de origem da transformação
    }}
  >
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        //backgroundColor: "#312783",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        width: "80vw",
        minHeight: "90vh",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          backgroundColor: "#312783",
          padding: "232px",
          paddingRight: "80px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottomLeftRadius: "50px",
        }}
      >
        <img
          src="src/assets/images/icone_logo.png"
          alt="Logo"
          style={{
            width: "75%",
            height: "auto",
            marginRight: "100px",
          }}
        />
      </Box>

      {/* Formulário de Cadastro */}
      <Box
        sx={{
          borderTopRightRadius: "50px",
          backgroundColor: "white",
          padding: 5,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: "90%",
          maxWidth: 400,
          textAlign: "center",
          //border: "1px solid #868dfb",
        }}
      >
        <img
          src="src/assets/images/fokus360cinza.png"
          alt="Logo"
          style={{
            width: "200px", // Tamanho ajustável
            height: "auto",
            marginBottom: 23,
          }}
        />
        <Box
          component="form"
          onSubmit={handleCadastro}
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          {/* Campo de Avatar */}
          <Box textAlign="center" mb={2}>
          <Avatar
          src={avatarPreview || ""} // Pode deixar em branco ou usar uma imagem padrão
          alt="Avatar do Usuário"
          sx={{
            width: 100,
            height: 100,
            margin: "0 auto",
            border: "2px solid #9d9d9c",
            borderRadius: 5, // Formato quadrado
          }}
        />

        <Button
          variant="outlined"
          component="label"
          sx={{
            textTransform: "none",
            marginBottom: 2,
            marginTop: "10px",
            backgroundColor: "#312783",
            color: "#fff",
            border: "none",
            width: "50%",
            borderRadius: "10px",
          }}
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
          <TextField
            label="Nome"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            InputLabelProps={{
              style: { color: "#c2c2c2" }, // Cor do texto do rótulo
            }}
          />
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            InputLabelProps={{
              style: { color: "#c2c2c2" }, // Cor do texto do rótulo
            }}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            InputLabelProps={{
              style: { color: "#c2c2c2" }, // Cor do texto do rótulo
            }}
          />
          <FormControl fullWidth required>
            <InputLabel id="unidade-label">Unidade</InputLabel>
            <Select
              labelId="unidade-label"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              label="Perfil"
            >
              <MenuItem value="" disabled>
                Selecione a unidade do projeto
              </MenuItem>
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
            <Select
              labelId="role-label"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Perfil"
            >
              <MenuItem value="01">Diretoria</MenuItem>
              <MenuItem value="02">Gerente</MenuItem>
              <MenuItem value="03">Supervisor</MenuItem>
              <MenuItem value="04">Vendedor</MenuItem>
              <MenuItem value="05">Trade</MenuItem>
              <MenuItem value="06">Indústria</MenuItem>
              <MenuItem value="07">Projetos</MenuItem>
              <MenuItem value="08">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              borderRadius: 2,
              backgroundColor: "#312783",
              color: "white",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#868dfb",
                boxShadow: "none",
              },
            }}
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
