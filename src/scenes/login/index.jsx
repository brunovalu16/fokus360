import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("E-mail:", email, "Senha:", password);

    // Adicionar lógica de autenticação (ex.: Firebase)
    navigate("/dashboard"); // Redirecionar após login bem-sucedido
  };

  return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          //backgroundImage: 'url("src/assets/images/background_home.webp")', // Defina o caminho correto
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
            backgroundColor: "#5f53e5", // Fundo branco ao redor do logo
            padding: "59px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Sombra ao redor
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
              width: "300px", // Tamanho ajustável
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
          border: "1px solid #868dfb",
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
              backgroundColor: "#583cff", // Fundo roxo
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
