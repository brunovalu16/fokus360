export const calcularStatusVisualPorStatus = (status, prazoPrevisto) => {
    if (!status || !prazoPrevisto) return "";
  
    const hoje = new Date();
    const prazo = new Date(prazoPrevisto);
  
    if (status === "concluida" || status === "andamento") {
      return prazo >= hoje ? "no_prazo" : "atrasada";
    }
  
    return "";
  };
  