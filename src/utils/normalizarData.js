export const normalizarData = (data) => {
  if (typeof data === "string") {
    const [ano, mes, dia] = data.split("-").map(Number);
    return new Date(ano, mes - 1, dia); // zera hora
  }
  if (data instanceof Date) {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
  }
  return null;
};
