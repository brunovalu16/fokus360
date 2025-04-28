import { doc, updateDoc } from "firebase/firestore";
import { dbFokus360 as db } from "../data/firebase-config";

export const atualizarCampoTimeDiretrizes = async (projetoData) => {
  if (!projetoData?.id || !projetoData?.estrategicas || !projetoData?.prazoPrevisto) return;

  // 🔥 Extrair manualmente ano, mês e dia da string "2025-04-28"
  const [ano, mes, dia] = projetoData.prazoPrevisto.split("-").map(Number);
  const prazo = new Date(ano, mes - 1, dia); // mês -1 porque no JS Janeiro = 0

  const hoje = new Date();
  const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  const novaTime = dataAtual <= prazo ? "no prazo" : "atrasada";

  let houveAlteracao = false;

  const estrategicasAtualizadas = (projetoData.estrategicas || []).map((estrategica) => {
    const taticasAtualizadas = (estrategica.taticas || []).map((tatica) => {
      const operacionaisAtualizadas = (tatica.operacionais || []).map((op) => {
        if (op.time !== novaTime) houveAlteracao = true;
        return { ...op, time: novaTime };
      });

      if (tatica.time !== novaTime) houveAlteracao = true;
      return { ...tatica, time: novaTime, operacionais: operacionaisAtualizadas };
    });

    if (estrategica.time !== novaTime) houveAlteracao = true;
    return { ...estrategica, time: novaTime, taticas: taticasAtualizadas };
  });

  if (!houveAlteracao) {
    console.log("⚠️ Nenhuma alteração no campo 'time'. Nada foi salvo.");
    return;
  }

  try {
    const projetoRef = doc(db, "projetos", projetoData.id);
    await updateDoc(projetoRef, {
      estrategicas: estrategicasAtualizadas,
      updatedAt: new Date(), // Atualiza timestamp
    });
    console.log("⏱️ Campo 'time' atualizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar campo 'time':", error);
  }
};
