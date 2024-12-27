import React, { useEffect } from "react";
import { LinkPowerbi } from "../../components/LinkPowerbi";

const VendasDevolucao = () => {
  return (
    <LinkPowerbi
      url="https://app.powerbi.com/view?r=eyJrIjoiNjVhZmViNzMtZTE5NS00YWQ3LWFhNjctNjI3NWExMzdmNmJkIiwidCI6ImFkNDA4MGMwLTRlMjgtNGI0NC05ZTVjLWE1YTk4MzdkNzg1YyJ9"
      descripton="VENDAS X DEVOLUÇÃO"
      title="Relatório de Vendas e Devoluções"
      linkText="Abrir Relatório"
    />
  );
};

export default VendasDevolucao;
