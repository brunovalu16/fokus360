import admin from "firebase-admin";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Ajustar o caminho do arquivo JSON para ser compatível com Vercel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verifica se estamos rodando localmente ou na Vercel
const isLocal = process.env.NODE_ENV !== "production";

let serviceAccount;
if (isLocal) {
  serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, "../firebase-service-account.json"), "utf8"));
} else {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Rota para atualizar o e-mail do usuário
app.post("/update-email", async (req, res) => {
  const { uid, newEmail } = req.body;
  try {
    await admin.auth().updateUser(uid, { email: newEmail });
    const emailVerificationLink = await admin.auth().generateEmailVerificationLink(newEmail);
    console.log(`Link de verificação enviado: ${emailVerificationLink}`);
    res.status(200).json({ success: true, message: "E-mail atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar o e-mail:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rota para excluir usuário
app.post("/delete-user", async (req, res) => {
  const { uid } = req.body;
  try {
    if (!uid) throw new Error("UID não fornecido.");

    await admin.auth().deleteUser(uid);
    await admin.firestore().collection("user").doc(uid).delete();
    console.log(`Usuário ${uid} excluído.`);
    
    res.status(200).json({ success: true, message: "Usuário excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default app;
