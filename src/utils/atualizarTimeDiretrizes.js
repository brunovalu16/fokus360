import { doc, updateDoc } from "firebase/firestore";
import { dbFokus360 as db } from "../data/firebase-config";

export const atualizarCampoTimeDiretrizes = async (projetoData) => {
  if (!projetoData?.id || !projetoData?.estrategicas) return;

  const hoje = new Date();
  const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  let houveAlteracao = false;

  const estrategicasAtualizadas = (projetoData.estrategicas || []).map((estrategica) => {
    const [anoE, mesE, diaE] = (estrategica.finalizacao || "").split("-").map(Number);
    const prazoE = new Date(anoE, mesE - 1, diaE);
    const timeE = dataAtual <= prazoE ? "no prazo" : "atrasada";

    const taticasAtualizadas = (estrategica.taticas || []).map((tatica) => {
      const [anoT, mesT, diaT] = (tatica.finalizacao || "").split("-").map(Number);
      const prazoT = new Date(anoT, mesT - 1, diaT);
      const timeT = dataAtual <= prazoT ? "no prazo" : "atrasada";

      const operacionaisAtualizadas = (tatica.operacionais || []).map((op) => {
        const [anoO, mesO, diaO] = (op.finalizacao || "").split("-").map(Number);
        const prazoO = new Date(anoO, mesO - 1, diaO);
        const timeO = dataAtual <= prazoO ? "no prazo" : "atrasada";

        if (op.time !== timeO) houveAlteracao = true;
        return { ...op, time: timeO };
      });

      if (tatica.time !== timeT) houveAlteracao = true;
      return { ...tatica, time: timeT, operacionais: operacionaisAtualizadas };
    });

    if (estrategica.time !== timeE) houveAlteracao = true;
    return { ...estrategica, time: timeE, taticas: taticasAtualizadas };
  });

  if (!houveAlteracao) {
    console.log("⚠️ Nenhuma alteração no campo 'time'. Nada foi salvo.");
    return;
  }

  try {
    const projetoRef = doc(db, "projetos", projetoData.id);
    await updateDoc(projetoRef, {
      estrategicas: estrategicasAtualizadas,
      updatedAt: new Date(),
    });
    console.log("⏱️ Campo 'time' atualizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar campo 'time':", error);
  }
};
