import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("E-mail:", email, "Senha:", password);

    // Aqui você pode adicionar a lógica de autenticação, como Firebase.
    // Se a autenticação for bem-sucedida:
    navigate("/dashboard"); // Redirecione para a página principal após login.
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ backgroundColor: "#5f53e5", padding: 2 }}
    >
      <Typography variant="h4" mb={2}>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "background.paper",
          padding: 4,
          borderRadius: 2,
          boxShadow: 1,
        }}
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
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
