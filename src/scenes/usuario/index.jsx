import React, { useState } from "react";
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Avatar } from "@mui/material";

const User = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleUser = (e) => {
    e.preventDefault();
    console.log("Username:", username, "E-mail:", email, "Senha:", password, "Perfil:", role);
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
        padding: { xs: 2, md: 4 }, // Ajuste de padding para telas menores
        overflowX: "hidden", // Remove qualquer rolagem horizontal
        boxSizing: "border-box", // Inclui padding e bordas dentro do tamanho total
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
        }}
      >
        <Avatar
          alt="Sofia Rivers"
          //src="/assets/images/icone_logo.png"
          sx={{
            width: 100,
            height: 100,
            margin: "0 auto 16px",
            border: "2px solid #583cff",
          }}
        />
        <Typography variant="h6" fontWeight="bold">
          Elton Fernandes
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={2}>
         Grupo Fokus Goiás
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Inteligência de Mercado
        </Typography>
        <Button
          variant="text"
          sx={{
            color: "#583cff",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Carregar foto
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
        <Typography variant="h4" mb={3}>
          Perfil do usuário
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
         Informações do usuário
        </Typography>
        <Box
          component="form"
          onSubmit={handleUser}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              required
              sx={{ flex: 1 }}
            />
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Email address"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Phone number"
              type="tel"
              variant="outlined"
              fullWidth
              sx={{ flex: 1 }}
            />
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl fullWidth required sx={{ flex: 1 }}>
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="State"
              >
                <MenuItem value="CA">California</MenuItem>
                <MenuItem value="NY">New York</MenuItem>
                <MenuItem value="TX">Texas</MenuItem>
              </Select>
            </FormControl>
            <TextField label="City" variant="outlined" fullWidth sx={{ flex: 1 }} />
          </Box>
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              backgroundColor: "#583cff",
              color: "white",
              borderRadius: 5,
              "&:hover": {
                backgroundColor: "#868dfb",
              },
            }}
          >
            EDITAR USUÁRIO
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default User;
