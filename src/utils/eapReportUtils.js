// src/utils/eapReportUtils.js

export const ensureArray = (value) => {
  return Array.isArray(value) ? value : [];
};

export const normalizarTexto = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const uniqueSorted = (items) => {
  return [...new Set(items.filter(Boolean))]
    .map((item) => String(item).trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
};

export const getAreaNamesFromItem = (item = {}, areas = []) => {
  const nomes = [];

  if (Array.isArray(item.areaNomes)) {
    nomes.push(...item.areaNomes);
  }

  if (typeof item.areaNome === "string" && item.areaNome.trim()) {
    nomes.push(
      ...item.areaNome
        .split(",")
        .map((area) => area.trim())
        .filter(Boolean)
    );
  }

  if (item.areaId) {
    const areaObj = areas.find((area) => area.id === item.areaId);
    if (areaObj?.nome) nomes.push(areaObj.nome);
  }

  if (Array.isArray(item.areasResponsaveis)) {
    item.areasResponsaveis.forEach((areaId) => {
      const areaObj = areas.find((area) => area.id === areaId);
      if (areaObj?.nome) nomes.push(areaObj.nome);
    });
  }

  return uniqueSorted(nomes);
};

export const itemPertenceArea = (item = {}, areaNome = "", areas = []) => {
  if (!areaNome || areaNome === "TODAS") return true;

  const areasDoItem = getAreaNamesFromItem(item, areas);
  const areaFiltroNormalizada = normalizarTexto(areaNome);

  return areasDoItem.some(
    (area) => normalizarTexto(area) === areaFiltroNormalizada
  );
};

export const listarAreasDoProjeto = (estrategicas = [], areas = []) => {
  const nomes = [];

  ensureArray(estrategicas).forEach((estrategica) => {
    nomes.push(...getAreaNamesFromItem(estrategica, areas));

    ensureArray(estrategica.taticas).forEach((tatica) => {
      nomes.push(...getAreaNamesFromItem(tatica, areas));
    });
  });

  return uniqueSorted(nomes);
};

export const isItemConcluido = (item = {}) => {
  return (
    item.status === "concluida" ||
    item.checkboxState?.concluida === true ||
    item.concluida === true
  );
};

export const isItemAtrasado = (item = {}) => {
  return item.statusVisual === "atrasada" || item.time === "atrasada";
};

export const getTituloEstrategica = (item = {}) => {
  return item.titulo || item.nome || item.descricao || "Estratégica sem título";
};

export const getTituloTatica = (item = {}) => {
  return item.titulo || item.nome || item.descricao || "Tática sem título";
};

export const getTituloOperacional = (item = {}) => {
  return item.titulo || item.nome || item.descricao || "Operacional sem título";
};

export const getTituloTarefa = (item = {}) => {
  return (
    item.tituloTarefa ||
    item.titulo ||
    item.nome ||
    item.descricao ||
    "Tarefa sem título"
  );
};

export const formatarDataBR = (value) => {
  if (!value) return "-";

  try {
    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleDateString("pt-BR");
    }

    if (typeof value === "string") {
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        const [ano, mes, dia] = value.split("-");
        return `${dia}/${mes}/${ano}`;
      }

      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString("pt-BR");
      }
    }

    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("pt-BR");
    }

    return "-";
  } catch {
    return "-";
  }
};

export const getStatusLabel = (item = {}) => {
  if (isItemConcluido(item)) {
    return isItemAtrasado(item) ? "Concluída atrasada" : "Concluída";
  }

  if (isItemAtrasado(item)) return "Atrasada";

  if (item.status === "andamento") return "Em andamento";

  return "Não iniciada";
};

export const getStatusClass = (item = {}) => {
  if (isItemConcluido(item)) {
    return isItemAtrasado(item) ? "status-concluida-atrasada" : "status-concluida";
  }

  if (isItemAtrasado(item)) return "status-atrasada";

  if (item.status === "andamento") return "status-andamento";

  return "status-nao-iniciada";
};

export const calcularResumoArea = (estrategicas = []) => {
  const taticas = ensureArray(estrategicas).flatMap((e) =>
    ensureArray(e.taticas)
  );

  const operacionais = taticas.flatMap((t) => ensureArray(t.operacionais));

  const tarefas = operacionais.flatMap((o) => ensureArray(o.tarefas));

  const tarefasConcluidas = tarefas.filter(isItemConcluido).length;
  const tarefasAtrasadas = tarefas.filter(isItemAtrasado).length;
  const tarefasPendentes = tarefas.length - tarefasConcluidas;

  const progresso =
    tarefas.length > 0 ? Math.round((tarefasConcluidas / tarefas.length) * 100) : 0;

  return {
    estrategicas: ensureArray(estrategicas).length,
    taticas: taticas.length,
    operacionais: operacionais.length,
    tarefas: tarefas.length,
    tarefasConcluidas,
    tarefasPendentes,
    tarefasAtrasadas,
    progresso,
  };
};

export const montarRelatorioPorArea = (
  estrategicas = [],
  areas = [],
  areaFiltro = "TODAS"
) => {
  const areasDoProjeto = listarAreasDoProjeto(estrategicas, areas);

  const areasParaRelatorio =
    areaFiltro && areaFiltro !== "TODAS"
      ? [areaFiltro]
      : areasDoProjeto.length > 0
      ? areasDoProjeto
      : ["GERAL"];

  return areasParaRelatorio
    .map((areaNome) => {
      const estrategicasDaArea = ensureArray(estrategicas)
        .map((estrategica) => {
          const pertenceEstrategica =
            areaNome === "GERAL" ||
            itemPertenceArea(estrategica, areaNome, areas);

          const taticasFiltradas = ensureArray(estrategica.taticas)
            .filter((tatica) => {
              const areasDaTatica = getAreaNamesFromItem(tatica, areas);

              const pertenceTatica =
                areaNome === "GERAL" || itemPertenceArea(tatica, areaNome, areas);

              const taticaSemAreaDentroDaEstrategica =
                pertenceEstrategica && areasDaTatica.length === 0;

              return pertenceTatica || taticaSemAreaDentroDaEstrategica;
            })
            .map((tatica) => ({
              ...tatica,
              operacionais: ensureArray(tatica.operacionais).map((operacional) => ({
                ...operacional,
                tarefas: ensureArray(operacional.tarefas),
              })),
            }));

          if (!pertenceEstrategica && taticasFiltradas.length === 0) {
            return null;
          }

          return {
            ...estrategica,
            taticas: taticasFiltradas,
          };
        })
        .filter(Boolean);

      return {
        areaNome,
        estrategicas: estrategicasDaArea,
        resumo: calcularResumoArea(estrategicasDaArea),
      };
    })
    .filter((area) => area.estrategicas.length > 0);
};