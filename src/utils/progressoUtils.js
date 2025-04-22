export const calcularProgressoOperacional = (operacional) => {
    const tarefas = operacional.tarefas || [];
  
    // Se não tem tarefas, e a operacional está marcada como concluída
    if (tarefas.length === 0) {
      return operacional.status === "concluida" ? 100 : 0;
    }
  
    // Se tem tarefas, soma progresso com base nas tarefas + checkbox concluída
    const tarefasConcluidas = tarefas.filter((t) => t.status === "concluida").length;
    const totalPartes = tarefas.length + 1; // +1 do checkbox da operacional
    const progresso = ((tarefasConcluidas + (operacional.status === "concluida" ? 1 : 0)) / totalPartes) * 100;
  
    return Math.round(progresso);
  };
  
  
  
 


  export function calcularProgressoTatica(tatica) {
    const totalOperacionais = tatica.operacionais?.length || 0;
  
    // Total de etapas: todas as operacionais + o próprio checkbox da tática
    const totalEtapas = totalOperacionais + 1;
  
    // Quantas operacionais estão concluídas?
    const concluidas = tatica.operacionais?.filter(op => op.status === "concluida").length || 0;
  
    // Se o checkbox da tática estiver marcado, soma +1
    const bonus = tatica.status === "concluida" ? 1 : 0;
  
    const progresso = ((concluidas + bonus) / totalEtapas) * 100;
  
    return Math.round(progresso);
  }
  

  




  
  export function calcularProgressoEstrategica(estrategica) {
    const totalTaticas = estrategica.taticas?.length || 0;
  
    // Total de etapas: táticas + checkbox da estratégica
    const totalEtapas = totalTaticas + 1;
  
    // Quantas táticas estão concluídas?
    const concluidas = estrategica.taticas?.filter(tat => tat.status === "concluida").length || 0;
  
    // Se o checkbox da estratégica estiver marcado, soma +1
    const bonus = estrategica.status === "concluida" ? 1 : 0;
  
    const progresso = ((concluidas + bonus) / totalEtapas) * 100;
  
    return Math.round(progresso);
  }
  