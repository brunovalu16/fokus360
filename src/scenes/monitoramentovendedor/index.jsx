import React, { useEffect } from "react";
import { LinkPowerbi } from "../../components/LinkPowerbi";

const MonitoramentoVendedor = () => {
  return (
    <LinkPowerbi
      url="https://app.powerbi.com/view?r=eyJrIjoiODUxOWU1MTctYWFjMS00ZThjLTg0OTktNmMzNjgxMGYwYzRlIiwidCI6ImFkNDA4MGMwLTRlMjgtNGI0NC05ZTVjLWE1YTk4MzdkNzg1YyJ9"
      descripton="VENDAS X DEVOLUÇÃO"
      title="Relatório de Vendas e Devoluções"
      linkText="Abrir Relatório"
    />
  );
};

export default MonitoramentoVendedor;
