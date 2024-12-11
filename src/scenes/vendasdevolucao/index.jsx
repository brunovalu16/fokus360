import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Header } from "../../components";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";

const VendasDevolucao = () => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Adicione qualquer lógica relacionada à autenticação ou ao usuário, se necessário
  }, []);

  return (
    <>
      {/* Cabeçalho */}
      <Box sx={{ marginLeft: "40px", paddingTop: "50px" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <AssessmentIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
              <Typography>GERENCIADOR DE RELATÓRIOS</Typography>
            </Box>
          }
        />
      </Box>

      {/* Conteúdo Principal */}
      <Box
        m="40px"
        width="90%"
        minHeight="50vh"
        sx={{
          overflowX: "hidden",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
          <Typography color="#858585">RELATÓRIOS | VENDAS X DEVOLUÇÃO</Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            marginBottom: "10px",
            marginTop: "15px",
          }}
        >
          <Divider
            sx={{
              position: "absolute",
              width: "100%",
              height: "1px",
              backgroundColor: "#ccc",
            }}
          />
          <LocalGroceryStoreIcon
            sx={{
              color: "#5f53e5",
              fontSize: 25,
              zIndex: 1,
              backgroundColor: "#f2f0f0",
              padding: "0 4px",
              marginLeft: "103%",
            }}
          />
        </Box>

        {/* Estrutura do Iframe */}
        <div className="content">
          <iframe
            src="https://app.powerbi.com/view?r=eyJrIjoiNjVhZmViNzMtZTE5NS00YWQ3LWFhNjctNjI3NWExMzdmNmJkIiwidCI6ImFkNDA4MGMwLTRlMjgtNGI0NC05ZTVjLWE1YTk4MzdkNzg1YyJ9"
            width="100%"
            height="700px"
            frameBorder="0"
            scrolling="no"
            title="Relatório de Vendas e Devoluções"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Box>
    </>
  );
};

export default VendasDevolucao;