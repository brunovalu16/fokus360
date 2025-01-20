import React from "react";
import { Box } from "@mui/material";

import UserDetalhe from "../../components/UserDetalhe";

function User() {
  return (
    <>
      {/* Header */}
      <Box>
        {/* Componente <DadosProjeto /> */}
        <UserDetalhe />

      </Box>
    </>
  );
}

export default User;