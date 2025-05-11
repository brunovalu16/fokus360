export const calcularProgressoOperacional = (operacional) => {
  const tarefas = operacional.tarefas || [];

  if (tarefas.length === 0) {
    return operacional.status === "concluida" ? 100 : 0;
  }

  const total = tarefas.length + 1;
  const concluidas = tarefas.filter(t => t.status === "concluida").length + 
    (operacional.status === "concluida" ? 1 : 0);

  return Math.round((concluidas / total) * 100);
};











export function calcularProgressoArea(areaNome, estrategicas) {
  if (!areaNome || !estrategicas?.length) return 0;

  const taticasDaArea = estrategicas
    .flatMap(e => e.taticas || [])
    .filter(t => t.areaNome?.toLowerCase() === areaNome.toLowerCase());

  if (taticasDaArea.length === 0) return 0;

  const soma = taticasDaArea.reduce((total, tatica) => {
    return total + calcularProgressoTatica(tatica);
  }, 0);

  return Math.round(soma / taticasDaArea.length);
}
  
  
  
 


// calcularProgressoTatica
export function calcularProgressoTatica(tatica) {
  const operacionais = tatica.operacionais || [];

  let totalPartes = 1; // a própria tática
  let concluidas = tatica.status === "concluida" ? 1 : 0;

  operacionais.forEach(op => {
    totalPartes += 1; // checkbox da operacional
    if (op.status === "concluida") concluidas += 1;

    const tarefas = op.tarefas || [];

    tarefas.forEach(t => {
      totalPartes += 1;
      if (t.status === "concluida") concluidas += 1;
    });
  });

  return totalPartes === 0 ? 0 : Math.round((concluidas / totalPartes) * 100);
}









  

  




  
export function calcularProgressoEstrategica(estrategica) {
  const taticas = estrategica.taticas || [];

  let totalPartes = 1; // Checkbox da estratégica
  let concluidas = estrategica.status === "concluida" ? 1 : 0;

  taticas.forEach(tat => {
    totalPartes += 1; // Checkbox da tática
    if (tat.status === "concluida") concluidas += 1;

    const operacionais = tat.operacionais || [];
    operacionais.forEach(op => {
      totalPartes += 1; // Checkbox da operacional
      if (op.status === "concluida") concluidas += 1;

      const tarefas = op.tarefas || [];
      tarefas.forEach(t => {
        totalPartes += 1;
        if (t.status === "concluida") concluidas += 1;
      });
    });
  });

  return Math.round((concluidas / totalPartes) * 100);
}






  export function calcularMediaProgressoGeral(estrategicas) {
  const taticas = estrategicas
    .flatMap(e => e.taticas || [])
    .filter(t => t.areaNome); // ignora táticas sem área

  if (taticas.length === 0) return 0;

  const soma = taticas.reduce((acc, tat) => acc + calcularProgressoTatica(tat), 0);
  return Math.round(soma / taticas.length);
}