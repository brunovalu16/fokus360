export function calcularProgressoPorArea(estrategicas) {
  const progressoPorArea = {};

  estrategicas.forEach((estrategica) => {
    (estrategica.taticas || []).forEach((tatica) => {
      const area = tatica.areaNome || "Sem Área";
      const progresso = calcularProgressoTatica(tatica);

      if (!progressoPorArea[area]) {
        progressoPorArea[area] = { soma: 0, total: 0 };
      }

      progressoPorArea[area].soma += progresso;
      progressoPorArea[area].total += 1;
    });
  });

  // Transformar em array com médias arredondadas
  return Object.entries(progressoPorArea).map(([area, { soma, total }]) => ({
    area,
    progresso: Math.round(soma / total)
  }));
}
