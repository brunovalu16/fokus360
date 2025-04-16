import React, { useEffect, useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FluxoGrama from "../../components/FluxoGrama";
import { getDocs, collection } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config";

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { InputAdornment } from "@mui/material";


const Listafluxograma = () => {
  const [searchText, setSearchText] = useState(""); // Texto do filtro
  const [projects, setProjects] = useState([]); // Todos os projetos
  const [filteredProject, setFilteredProject] = useState(null); // Projeto filtrado

  // Função para buscar todos os projetos do Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(dbFokus360, "projetos2")); // Em vez de db

        const projectsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error("Erro ao buscar projetos2:", error);
      }
    };
    fetchProjects();
  }, []);

  // Função para filtrar o projeto pelo nome
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredProject(null); // Não filtrar se o campo estiver vazio
      return;
    }

    const filtered = projects.find((project) =>
      project.nome.toLowerCase().includes(searchText.toLowerCase().trim())
    );
    setFilteredProject(filtered || null);
  }, [searchText, projects]);

  return (
    <>
      <Box
        sx={{
          marginRight: "45px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: "40px",
          paddingTop: "50px",
          paddingBottom: "40px",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <AccountTreeIcon sx={{ color: "#5f53e5", fontSize: 30 }} />
          <Typography sx={{ color: "#858585" }}>
          EAP - Estrutura Analítica do Projeto
          </Typography>
        </Box>
        <TextField
      variant="outlined"
      size="small"
      placeholder="Filtrar por nome do projeto"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <ArrowRightIcon style={{ color: "#312783" }} />
          </InputAdornment>
        ),
        style: {
          color: "#9e9e9e", // Texto digitado em cinza
          border: "none", // Remove a borda padrão preta
        },
      }}
      sx={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        width: "300px",
        marginRight: "30px",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            border: "none", // Remove a borda do campo
          },
          "&:hover fieldset": {
            border: "none", // Sem borda ao passar o mouse
          },
          "&.Mui-focused fieldset": {
            border: "none", // Sem borda ao focar
          },
        },
      }}
    />
      </Box>

      <Box
        sx={{
          marginLeft: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "calc(100% - 80px)",
          minHeight: "50vh",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
          overflowX: "hidden",
        }}
      >
        {filteredProject ? (
          <Box>
          {filteredProject?.id ? (
            <FluxoGrama projectId={filteredProject.id} />
          ) : (
            <Typography>Selecione um projeto para visualizar.</Typography>
          )}
        </Box>
        ) : (
          <Typography sx={{ color: "#949393" }}>Digite o nome de um projeto para filtrar.</Typography>
        )}
      </Box>
    </>
  );
};

export default Listafluxograma;
