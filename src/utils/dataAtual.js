  // utils/dataAtual.js
export const buscarDataAtualUTC = async () => {
  try {
    // Usa o horário local como UTC (sem depender de API externa)
    const agora = new Date();
    return agora;
  } catch (error) {
    console.error("Erro ao buscar data local:", error);
    return new Date(); // fallback
  }
};
