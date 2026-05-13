import React, { useEffect } from "react";
import { LinkPowerbi } from "../../components/LinkPowerbi";

const AcompanhamentoGrupo = () => {
  return (
    <LinkPowerbi
      url="https://app.powerbi.com/view?r=eyJrIjoiNGQyYWEzODItZWZkYy00MWRiLTgwZDktYjRiNGY5YTI3MzE0IiwidCI6ImFkNDA4MGMwLTRlMjgtNGI0NC05ZTVjLWE1YTk4MzdkNzg1YyJ9"
      descripton="ACOMPANHAMENTO GRUPO"
      title="Relatório de Vendas e Devoluções"
      linkText="Abrir Relatório"
    />
  );
};

export default AcompanhamentoGrupo;
