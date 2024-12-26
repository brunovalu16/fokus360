import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../data/firebase-config.js";  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // handle - função de ação de clique
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
   
    logar();
  };
  
  

  // função de logar // signInWithEmailAndPassword - esse é o método de autenticação
  const logar = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Redirecionar após login bem-sucedido
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }
  

  return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundImage: 'url("src/assets/images/backlogin2.webp")', // Defina o caminho correto
          //backgroundColor: "#312783",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed", // Fixa o background
          width: "100vw", // Largura total da viewport
          minHeight: "100vh", // Altura mínima da viewport
        }}
      >


        <Box
          sx={{
            backgroundColor: "#312783", // Fundo branco ao redor do logo
            padding: "58px",
            paddingBottom: "64px",
            //boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Sombra ao redor
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottomLeftRadius: "50px",
            transform: "scale(0.8)", //Reduz todo o conteúdo em 90% do tamanho original.
            marginRight: "-95px", // Margem direita para separar o logo do formulário
            height: "35%",
          }}
        >
          <img
            src="src/assets/images/logo360verde.png"
            alt="Logo"
            style={{
              width: "450px", // Tamanho ajustável
              height: "auto",
            }}
          />
      </Box>

      <Box
        sx={{
          borderTopRightRadius: "50px",
          backgroundColor: "white",
          padding: 4,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Sombra leve
          width: "90%", // Responsivo
          maxWidth: 400, // Largura máxima
          textAlign: "center",
          transform: "scale(0.8)", //Reduz todo o conteúdo em 90% do tamanho original.
          marginRight: "370px"
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
            InputLabelProps={{
              style: { color: "#c2c2c2" }, // Cor do texto do rótulo
            }}
            InputProps={{
              style: { color: "#c2c2c2", borderColor: "#c2c2c2" }, // Cor do texto do campo e da borda
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#c2c2c2", // Cor da borda
                  borderRadius: 5,
                },
                "&:hover fieldset": {
                  borderColor: "#c2c2c2", // Cor da borda no hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#c2c2c2", // Cor da borda quando focado
                },
              },
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#c2c2c2", // Cor da borda
                  borderRadius: 5,
                },
                "&:hover fieldset": {
                  borderColor: "#c2c2c2", // Cor da borda ao passar o mouse
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#c2c2c2", // Cor da borda ao focar
                },
              },
              "& .MuiInputBase-input": {
                color: "#c2c2c2", // Cor do texto digitado
              },
              "& .MuiInputLabel-root": {
                color: "#c2c2c2", // Cor do label
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#c2c2c2", // Cor do label ao focar
              },
            }}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              borderRadius: 5,
              backgroundColor: "#312783", // Fundo roxo
              color: "white", // Texto branco
              boxShadow: "none", // Remove a sombra
              "&:hover": {
                backgroundColor: "#868dfb", // Fundo mais claro ao passar o mouse
                boxShadow: "none", // Garante que não haverá sombra ao passar o mouse
              },
            }}
          >
            Entrar
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "30px",
            }}
          >
            <img
              src="src/assets/images/fokus360cinza.png"
              alt="Logo"
              style={{
                width: "50%",
                height: "auto",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
