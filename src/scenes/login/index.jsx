import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Importar do Firestore
import { auth, db } from "../../data/firebase-config"; // Importar do arquivo de configuração



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar perfil do usuário no Firestore
      const userDoc = await getDoc(doc(db, "user", user.uid));
      if (userDoc.exists()) {
        const userRole = userDoc.data().role;

        // Redirecionamento com base no perfil
        if (userRole === "07") {
          navigate("/projetos");
        } else {
          navigate("/home");
        }
      } else {
        alert("Usuário não encontrado no banco de dados.");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error.code, error.message);
      alert(`Erro ao realizar login: ${error.message}`);
    }
  };
    

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: 'url("src/assets/images/backlogin2.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#312783",
          padding: "58px",
          paddingBottom: "64px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottomLeftRadius: "50px",
          transform: "scale(0.8)",
          marginRight: "-95px",
          height: "35%",
        }}
      >
        <img
          src="src/assets/images/logo360verde.png"
          alt="Logo"
          style={{
            width: "450px",
            height: "auto",
          }}
        />
      </Box>

      <Box
        sx={{
          borderTopRightRadius: "50px",
          backgroundColor: "white",
          padding: 4,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: "90%",
          maxWidth: 400,
          textAlign: "center",
          transform: "scale(0.8)",
          marginRight: "370px",
        }}
      >
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              borderRadius: 5,
              backgroundColor: "#312783",
              color: "white",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#868dfb",
                boxShadow: "none",
              },
            }}
          >
            Entrar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;