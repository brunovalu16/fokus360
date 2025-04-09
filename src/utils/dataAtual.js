export const buscarDataAtualUTC = async () => {
    try {
      const response = await fetch("http://worldtimeapi.org/api/ip");
      const data = await response.json();
      return new Date(data.utc_datetime);
    } catch (error) {
      console.error("Erro ao buscar data UTC:", error);
      return new Date(); // fallback: data do sistema
    }
  };
  