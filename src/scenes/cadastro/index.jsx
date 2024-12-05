import React, { useState } from "react";
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Cadastro = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();
    console.log("Username:", username, "E-mail:", email, "Senha:", password, "Perfil:", role);

    // Adicionar lógica de cadastro (ex.: Firebase)
    navigate("/dashboard"); // Redirecionar após cadastro bem-sucedido
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: 'url("/assets/img/background_home.webp")', // Defina o caminho correto
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          backgroundColor: "#5f53e5",
          padding: "93px",
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
            width: "400px",
            height: "auto",
          }}
        />
      </Box>

      {/* Formulário de Cadastro */}
      <Box
        sx={{
          borderTopRightRadius: "50px",
          backgroundColor: "white",
          padding: 4,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          width: "90%",
          maxWidth: 400,
          textAlign: "center",
          border: "1px solid #868dfb",
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
          {/* 
        <Typography variant="h5" mb={3}>
          Cadastro
        </Typography>
        */}
        <Box
          component="form"
          onSubmit={handleCadastro}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
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
              <MenuItem value="05">Indústria</MenuItem>
              <MenuItem value="06">Diretoria Trade</MenuItem>
              <MenuItem value="07">Gerência Trade</MenuItem>
              <MenuItem value="08">Coordenação Trade</MenuItem>
              <MenuItem value="09">Colaborador Trade</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              borderRadius: 5,
              backgroundColor: "#583cff",
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
  );
};

export default Cadastro;
