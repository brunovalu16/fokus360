import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../data/firebase-config.js";

// linha para reCAPTCHA
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null); // Estado para o token do reCAPTCHA
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }
    if (!recaptchaToken) {
      alert("Por favor, resolva o reCAPTCHA antes de fazer login.");
      return;
    }

    logar();
  };

  const logar = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      console.error("Erro ao fazer login:", error.code, error.message);

      switch (error.code) {
        case "auth/user-not-found":
          alert("E-mail não encontrado. Verifique e tente novamente.");
          break;
        case "auth/wrong-password":
          alert("Senha incorreta. Tente novamente.");
          break;
        case "auth/invalid-email":
          alert("E-mail inválido. Verifique o formato do e-mail.");
          break;
        case "auth/too-many-requests":
          alert("Muitas tentativas de login. Tente novamente mais tarde.");
          break;
        case "auth/invalid-credential":
          alert("Credenciais inválidas. Verifique o e-mail e a senha.");
          break;
        default:
          alert("Erro ao realizar login. Tente novamente mais tarde.");
          break;
      }
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

          {/* Componente reCAPTCHA 
          <ReCAPTCHA
            sitekey="6LfIHa0qAAAAAH4vkrVTj27HR9Ygsv6WYv4FKcA9" // Minha chave do site reCAPTCHA
            onChange={(token) => setRecaptchaToken(token)}
            onExpired={() => setRecaptchaToken(null)}
          />
          */}
          

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
