/**
 * Retorna o statusVisual ("no_prazo" ou "atrasada") com base na data atual local e prazo previsto
 * @param {string} prazoPrevisto - formato esperado: "yyyy-mm-dd"
 * @returns {"no_prazo" | "atrasada"}
 */
export const calcularStatusVisual = (prazoPrevisto) => {
    if (!prazoPrevisto) return "no_prazo";
  
    const agora = new Date();
    const [ano, mes, dia] = prazoPrevisto.split("-");
    const dataPrazo = new Date(`${ano}-${mes}-${dia}T23:59:59`);
  
    return agora <= dataPrazo ? "no_prazo" : "atrasada";
  };
  