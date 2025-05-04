export const calcularProgressoOperacional = (operacional) => {
  const tarefas = operacional.tarefas || [];

  if (tarefas.length === 0) {
    return operacional.status === "concluida" ? 100 : 0;
  }

  const tarefasConcluidas = tarefas.filter((t) => t.status === "concluida").length;
  const totalPartes = tarefas.length + 1; // +1 pelo checkbox de status

  const progresso = ((tarefasConcluidas + (operacional.status === "concluida" ? 1 : 0)) / totalPartes) * 100;

  return Math.round(progresso);
};

  
  
  
 


export function calcularProgressoTatica(tatica) {
  const operacionais = tatica.operacionais || [];

  let totalPartes = 1; // checkbox da tática
  let concluidas = tatica.status === "concluida" ? 1 : 0;

  operacionais.forEach((op) => {
    const tarefas = op.tarefas || [];

    if (tarefas.length === 0) {
      totalPartes += 1;
      if (op.status === "concluida") concluidas += 1;
    } else {
      totalPartes += tarefas.length;
      concluidas += tarefas.filter((t) => t.status === "concluida").length;
    }
  });

  const progresso = (concluidas / totalPartes) * 100;
  return Math.round(progresso);
}

  

  




  
export function calcularProgressoEstrategica(estrategica) {
  const taticas = estrategica.taticas || [];

  let totalPartes = 1; // checkbox da estratégica
  let concluidas = estrategica.status === "concluida" ? 1 : 0;

  taticas.forEach((tat) => {
    const operacionais = tat.operacionais || [];

    operacionais.forEach((op) => {
      const tarefas = op.tarefas || [];

      if (tarefas.length === 0) {
        totalPartes += 1;
        if (op.status === "concluida") concluidas += 1;
      } else {
        totalPartes += tarefas.length;
        concluidas += tarefas.filter((t) => t.status === "concluida").length;
      }
    });
  });

  const progresso = (concluidas / totalPartes) * 100;
  return Math.round(progresso);
}


  