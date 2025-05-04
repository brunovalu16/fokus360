export const calcularStatusVisual = (finalizacao, createdAt, status) => {
  const hoje = new Date();
  const prazo = new Date(finalizacao); // ⬅️ compara com a data da própria diretriz ou tarefa
  const criado = createdAt ? new Date(createdAt) : hoje;

  if (status === "concluida") {
    return "no_prazo"; // ✅ concluída sempre fica verde
  }

  if (status === "andamento") {
    return hoje <= prazo ? "no_prazo" : "atrasada"; // ✅ compara com finalizacao local
  }

  if (!status || status === "nao_iniciada" || status === "") {
    return "nao_iniciada"; // ✅ mantém status original
  }

  return "nao_iniciada"; // fallback
};
