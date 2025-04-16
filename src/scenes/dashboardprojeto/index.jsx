import React from "react";
import { Box } from "@mui/material";


import DataProjeto from "../../components/DataProjeto";

function DashboardProjeto() {
  return (
    <>
      {/* Header */}
      <Box
        sx={{
          paddingTop: "50px",
        }}
      >
        {/* Componente <DadosProjeto /> */}
        <DataProjeto />

      </Box>
    </>
  );
}

export default DashboardProjeto;
