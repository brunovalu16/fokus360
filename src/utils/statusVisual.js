export const calcularStatusVisual = (prazoPrevisto, createdAt, status) => {
  const hoje = new Date();
  const prazo = new Date(prazoPrevisto);
  const criado = createdAt ? new Date(createdAt) : hoje;

  if (status === "concluida") {
    return "no_prazo"; // ✅ sempre verde
  }

  if (status === "andamento") {
    return hoje <= prazo ? "no_prazo" : "atrasada"; // ✅ ok
  }

  if (!status || status === "nao_iniciada" || status === "") {
    return "nao_iniciada"; // ✅ devolve exatamente o status, sem inventar
  }

  // Fallback
  return "nao_iniciada";
};
