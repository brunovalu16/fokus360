export const calcularStatusVisualPorStatus = (status, dataFinalizacao) => {
  if (!status || !dataFinalizacao) return "";

  const hoje = new Date();
  const [ano, mes, dia] = dataFinalizacao.split("-").map(Number);
  const prazo = new Date(ano, mes - 1, dia); // ✅ trata como data específica da diretriz

  if (status === "concluida" || status === "andamento") {
    return prazo >= hoje ? "no_prazo" : "atrasada";
  }

  return "";
};
