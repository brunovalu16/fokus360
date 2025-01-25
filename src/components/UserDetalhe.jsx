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
} from "firebase/storage";
import { useLocation } from "react-router-dom";
import { auth, db } from "../data/firebase-config";
import { updateEmail, updatePassword } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth";


const UserDetalhe = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id"); // Obtém o ID do usuário da URL
  const [senhaLocal, setSenhaLocal] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

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
    if (userId) {
      const fetchUserDetails = async () => {
        const userDoc = await getDoc(doc(db, "user", userId));
        if (userDoc.exists()) {
          setOriginalEmail(userDoc.data().email);
          setFormValues({
            username: userDoc.data().username || "",
            email: userDoc.data().email || "",
            role: userDoc.data().role || "",
            unidade: userDoc.data().unidade || "",
            photoURL: userDoc.data().photoURL || "",
          });
        }
      };
      fetchUserDetails();
    }
  }, [userId]);

  // Função para salvar as alterações
  const handleUser = async (e) => {
    e.preventDefault();
  
    try {
      // Referência ao Firestore
      const userRef = doc(db, "user", userId);
  
      // Verifica se o e-mail foi alterado
      const emailChanged = formValues.email !== originalEmail;
  
      // Atualiza os campos no Firestore
      await updateDoc(userRef, {
        username: formValues.username,
        email: formValues.email,
        role: formValues.role,
        unidade: formValues.unidade,
        photoURL: formValues.photoURL,
      });
  
      if (emailChanged) {
        // Gera o link de verificação para o novo e-mail
        const response = await fetch("http://localhost:5000/update-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: userId,
            newEmail: formValues.email,
          }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          alert(
            "E-mail atualizado com sucesso!"
          );
        } else {
          alert(
            `Erro ao atualizar o e-mail no servidor: ${data.message || "Tente novamente."}`
          );
        }
      } else {
        alert("Dados do usuário atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar o e-mail no Firebase Authentication:", error.message);
  
      if (error.code === "auth/requires-recent-login") {
        alert("Sua sessão expirou. Faça login novamente para continuar.");
      } else if (error.code === "auth/operation-not-allowed") {
        alert("Por favor, verifique o novo e-mail antes de alterá-lo.");
      } else {
        alert("Erro ao atualizar os dados. Verifique as permissões e tente novamente.");
      }
    }
  };
  
  
  
  
  
  
  
  
  
  
  

  // Função para carregar foto
  const handleUploadPhoto = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("Nenhum arquivo foi selecionado.");
      return;
    }

    setUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `users/${userId}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progresso do upload: ${progress}%`);
      },
      (error) => {
        console.error("Erro ao carregar a foto:", error);
        setUploading(false);
      },
      async () => {
        try {
          const photoURL = await getDownloadURL(uploadTask.snapshot.ref);
          const userRef = doc(db, "user", userId);
          await updateDoc(userRef, { photoURL });
          setFormValues((prev) => ({ ...prev, photoURL }));
          console.log("Foto carregada e URL atualizada:", photoURL);
        } catch (error) {
          console.error("Erro ao atualizar o Firestore:", error);
        } finally {
          setUploading(false);
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          alt={formValues.username || "Nome do Usuário"}
          src={formValues.photoURL || ""}
          sx={{
            width: 100,
            height: 100,
            marginBottom: 2,
            border: "4px solid #312783",
          }}
        />
        <Typography variant="h4" fontWeight="bold" color="#312783">
          {formValues.username || "Nome do Usuário"}
        </Typography>
        <Typography sx={{ marginTop: 2 }}>Unidade: {formValues.unidade}</Typography>
        <Button
          variant="text"
          component="label"
          disabled={uploading}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: "bold",
            border: "1px solid",
            width: "90%",
            mt: 2,
            color: "#fff",
            backgroundColor: "#312783",
            "&:hover": {
              backgroundColor: "#312783",
              color: "#fff",
            },
          }}
        >
          {uploading ? "Carregando..." : "Carregar Foto"}
          <input type="file" hidden accept="image/*" onChange={handleUploadPhoto} />
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
          />
          <FormControl fullWidth required>
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
              <MenuItem value="MATOGROSSODOSUL">MATO GROSSO DO SUL</MenuItem>
              <MenuItem value="PARÁ">PARÁ</MenuItem>
              <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
            </Select>
          </FormControl>
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
