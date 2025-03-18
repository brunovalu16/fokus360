// src/services/notificacoesService.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { dbFokus360 } from "../../src/data/firebase-config"; // ajuste o caminho conforme sua estrutura

export const adicionarNotificacao = async (userId, mensagem) => {
  try {
    await addDoc(collection(dbFokus360, "notificacoes"), {
      userId: userId, // ID do usuário que receberá a notificação
      mensagem: mensagem,
      lido: false,
      timestamp: serverTimestamp(), // pega horário do servidor
    });
    console.log("✅ Notificação adicionada com sucesso");
  } catch (error) {
    console.error("Erro ao adicionar notificação:", error);
  }
};
