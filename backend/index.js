// Backend API - Firebase Admin Configuration
import admin from "firebase-admin";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./firebase-service-account.json", "utf8")
);

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bancopowerbi-default-rtdb.firebaseio.com",
});

// Rota para atualizar a senha
app.post("/update-email", async (req, res) => {
  const { uid, newEmail } = req.body;

  try {
    // Atualizar o e-mail no Firebase Authentication
    await admin.auth().updateUser(uid, { email: newEmail });

    // Gerar link de verificação de e-mail
    const emailVerificationLink = await admin.auth().generateEmailVerificationLink(newEmail);

    console.log(`Link de verificação enviado: ${emailVerificationLink}`);

    res.status(200).json({
      success: true,
      message: "E-mail atualizado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao atualizar o e-mail:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Rota para excluir o usuário do Firebase Authentication e Firestore
app.post("/delete-user", async (req, res) => {
  const { uid } = req.body;

  console.log(`Recebendo solicitação para excluir UID: ${uid}`);

  try {
    if (!uid) {
      throw new Error("UID não fornecido.");
    }

    // Verificar se o usuário existe no Firebase Authentication
    const userRecord = await admin.auth().getUser(uid).catch((error) => {
      if (error.code === "auth/user-not-found") {
        console.log(`Usuário com UID ${uid} não encontrado no Authentication.`);
        return null;
      }
      throw error;
    });

    if (!userRecord) {
      // O usuário não existe no Authentication, mas ainda pode estar no Firestore
      const db = admin.firestore();
      const userDoc = await db.collection("user").doc(uid).get();
      if (!userDoc.exists) {
        throw new Error("Usuário não encontrado no Authentication ou Firestore.");
      }

      // Excluir somente do Firestore
      await db.collection("user").doc(uid).delete();
      console.log(`Usuário com UID ${uid} excluído apenas do Firestore.`);
      return res.status(200).json({
        success: true,
        message: "Usuário excluído apenas do Firestore.",
      });
    }

    // Excluir do Firebase Authentication
    await admin.auth().deleteUser(uid);
    console.log(`Usuário com UID ${uid} excluído do Firebase Authentication.`);

    // Excluir do Firestore
    const db = admin.firestore();
    await db.collection("user").doc(uid).delete();
    console.log(`Usuário com UID ${uid} excluído do Firestore.`);

    res.status(200).json({ success: true, message: "Usuário excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir usuário no backend:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});






// Inicializa o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
