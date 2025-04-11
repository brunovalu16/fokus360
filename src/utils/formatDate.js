export const getDataHojeFormatada = () => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();
    return `${ano}-${mes}-${dia}`; // Ex: "2025-04-10"
  };
  