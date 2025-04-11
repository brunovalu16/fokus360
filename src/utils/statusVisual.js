export const calcularStatusVisual = (prazoPrevisto) => {
    if (!prazoPrevisto) return "no_prazo"; // Retorna "no_prazo" caso prazoPrevisto seja nulo ou indefinido
  
    // Usando diretamente a data atual do navegador
    const dataAtual = new Date();  // A data do navegador
    const dataPrazo = new Date(prazoPrevisto); // Converte o prazo para data
  
    // Comparando se a data atual é menor ou igual ao prazo
    if (dataAtual.getTime() <= dataPrazo.getTime()) {
      return "no_prazo"; // verde
    }
  
    return "atrasada"; // vermelho
  };
  