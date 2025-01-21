import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"; // Correção na importação do Storage
import { db } from "../data/firebase-config";
import { useLocation } from "react-router-dom";
import { Divider } from "@mui/material";

const UserDetalhe = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id"); // Obtém o ID do usuário da URL

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    role: "",
    unidade: "",
    photoURL: "",
  });

  const [uploading, setUploading] = useState(false); // Estado para controle do upload de foto

  // Função para buscar os dados do usuário
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      const docRef = doc(db, "user", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormValues({
          username: docSnap.data().username || "",
          email: docSnap.data().email || "",
          role: docSnap.data().role || "",
          unidade: docSnap.data().unidade || "",
          photoURL: docSnap.data().photoURL || "",
        });
      } else {
        console.log("Usuário não encontrado.");
      }
    };
    fetchUserDetails();
  }, [userId]);

  // Função para salvar as alterações
  const handleUser = async (e) => {
    e.preventDefault();
    try {
      // Referência ao documento do usuário no Firestore
      const userRef = doc(db, "user", userId);

      // Atualiza os campos no banco de dados
      await updateDoc(userRef, {
        username: formValues.username,
        email: formValues.email,
        role: formValues.role,
        unidade: formValues.unidade,
        photoURL: formValues.photoURL,
      });

      console.log("Dados do usuário atualizados com sucesso!");
      alert("Usuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar os dados do usuário:", error);
      alert("Erro ao atualizar os dados. Tente novamente.");
    }
  };

  // Função para carregar foto
  const handleUploadPhoto = (event) => {
    const file = event.target.files[0]; // Obtém o arquivo selecionado
    if (!file) {
      console.error("Nenhum arquivo foi selecionado.");
      return;
    }
  
    setUploading(true); // Define o estado de upload como verdadeiro
    const storage = getStorage();
    const storageRef = ref(storage, `users/${userId}/${file.name}`); // Caminho no Storage
  
    // Inicia o upload
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calcula o progresso do upload
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progresso do upload: ${progress}%`);
      },
      (error) => {
        console.error("Erro ao carregar a foto:", error);
        setUploading(false); // Restaura o estado de upload
      },
      async () => {
        // Upload concluído
        try {
          const photoURL = await getDownloadURL(uploadTask.snapshot.ref); // Obtém a URL da foto
  
          // Atualiza o campo photoURL no Firestore
          const userRef = doc(db, "user", userId);
          await updateDoc(userRef, { photoURL });
  
          // Atualiza o estado para refletir a nova foto
          setFormValues((prev) => ({ ...prev, photoURL }));
          console.log("Foto carregada e URL atualizada:", photoURL);
        } catch (error) {
          console.error("Erro ao atualizar o Firestore:", error);
        } finally {
          setUploading(false); // Restaura o estado de upload
        }
      }
    );
  };
  

  
  

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="flex-start"
      justifyContent="center"
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: { xs: 2, md: 4 },
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Card com Informações do Usuário */}
      <Box
  sx={{
    width: { xs: "100%", md: "30%" },
    backgroundColor: "white",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    padding: 3,
    textAlign: "center",
    marginRight: { md: 4 },
    marginBottom: { xs: 4, md: 0 },
    display: "flex",           // Ativa Flexbox no container
    flexDirection: "column",   // Empilha itens verticalmente
    alignItems: "center",      // Centraliza horizontalmente
  }}
>
  <Avatar
    alt={formValues.username || "Nome do Usuário"}
    src={formValues.photoURL || ""}
    sx={{
      width: 100,
      height: 100,
      marginBottom: 2,               // Espaçamento inferior
      border: "4px solid #312783",
    }}
  />
  <Typography variant="h4" fontWeight="bold" color="#312783">
    {formValues.username || "Nome do Usuário"}
  </Typography>

  <Box
    sx={{
      display: "flex",
      alignItems: "center",    // Alinha verticalmente os itens no centro
      justifyContent: "center",// Centraliza horizontalmente
      mt: 2,                   // Margin-top para espaçamento
    }}
  >
    <Typography sx={{ marginRight: "5px", marginTop: "-13px" }}>
      Unidade:
    </Typography>
    <Typography variant="body2" color="textSecondary" mb={2} marginTop="5px">
      {formValues.unidade || "Unidade"}
    </Typography>
  </Box>

  <Button
  variant="text"
  component="label"
  disabled={uploading} // Desabilita o botão enquanto o upload está em progresso
  sx={{
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: "bold",
    border: "1px solid",
    width: "90%",
    mt: 2,
    color: "#fff",              // Define a cor do texto principal como branca
    backgroundColor: "#312783",
    "&:hover": {
      backgroundColor: "#312783",
      color: "#fff",
      boxShadow: "none",
    },
    "&.Mui-disabled": {         // Estilização específica para estado desabilitado
      color: "#fff",            // Garante que o texto permaneça branco
      backgroundColor: "#312783", // Mantém a mesma cor de fundo se necessário
      opacity: 1,               // Remove a opacidade padrão para elementos desabilitados, se desejado
    },
  }}
>
  {uploading ? "Carregando..." : "Carregar Foto"}
  <input
    type="file"
    hidden
    accept="image/*"
    onChange={handleUploadPhoto} // Função de upload
  />
</Button>

</Box>


      {/* Formulário de Cadastro */}
      <Box
        sx={{
          width: { xs: "100%", md: "40%" },
          backgroundColor: "white",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: 5,
          padding: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#312783",
            color: "white",
            fontWeight: "bold",
          }}
        >
          <Typography
            variant="h4"
            mb={1}
            marginTop="10px"
            fontWeight="bold"
            color="#fff"
            fontSize="27px"
          >
            Perfil
          </Typography>
          <Typography
            variant="h4"
            mb={1}
            marginTop="10px"
            marginLeft="5px"
            color="#b7b7b7"
          >
            do usuário
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="textSecondary"
          mb={3}
          marginTop="10px"
          marginBottom="30px"
        >
          Informações do usuário
        </Typography>
        <Box
          component="form"
          onSubmit={handleUser}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              required
              value={formValues.username}
              onChange={(e) =>
                setFormValues({ ...formValues, username: e.target.value })
              }
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
              sx={{ flex: 1 }}
            />
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl fullWidth required>
              <InputLabel id="unidade-label">Unidade</InputLabel>
              <Select
                labelId="unidade-label"
                value={formValues.unidade} // Agora está correto
                onChange={(e) =>
                  setFormValues({ ...formValues, unidade: e.target.value })
                }
                label="Unidade"
              >
                <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                <MenuItem value="MATOGROSSO">MATO GROSSO</MenuItem>
                <MenuItem value="MATOGROSSODOSUL">MATO GROSSO DO SUL</MenuItem>
                <MenuItem value="PARÁ">PARÁ</MenuItem>
                <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl fullWidth required>
              <InputLabel id="role-label">Perfil</InputLabel>
              <Select
                labelId="role-label"
                value={formValues.role}
                onChange={(e) =>
                  setFormValues({ ...formValues, role: e.target.value })
                }
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
          </Box>
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              width: "30%",
              marginTop: 2,
              marginBottom: 4,
              color: "white",
              marginLeft: "auto",
              backgroundColor: "#312783",
              boxShadow: "none",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#483dbd",
                boxShadow: "none",
              },
            }}
          >
            SALVAR
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetalhe;
