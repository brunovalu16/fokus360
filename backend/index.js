// Backend API - Firebase Admin Configuration
import admin from "firebase-admin";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";

// Verifica se a variável de ambiente FIREBASE_CREDENTIALS existe (Vercel)
let serviceAccount;
if (process.env.FIREBASE_CREDENTIALS) {
  console.log("🔄 Usando credenciais do Firebase a partir das variáveis de ambiente.");
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else {
  console.log("💻 Usando credenciais do Firebase a partir do arquivo local.");
  serviceAccount = JSON.parse(fs.readFileSync("./firebase-service-account.json", "utf8"));
}

// Verifica se a variável de ambiente FIREBASE_DATABASE_URL existe (Vercel)
const databaseURL = process.env.FIREBASE_DATABASE_URL || "https://bancopowerbi-default-rtdb.firebaseio.com";

// Inicializa o Firebase Admin SDK
if (!admin.apps.length) { // Evita erro de inicialização duplicada no dev
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL,
  });
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.json({ status: "API funcionando corretamente 🚀" });
});

// Atualizar e-mail
app.post("/update-email", async (req, res) => {
  const { uid, newEmail } = req.body;
  try {
    await admin.auth().updateUser(uid, { email: newEmail });
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

// Excluir usuário
app.post("/delete-user", async (req, res) => {
  const { uid } = req.body;
  try {
    if (!uid) {
      throw new Error("UID não fornecido.");
    }
    console.log(`Recebendo solicitação para excluir UID: ${uid}`);
    await admin.auth().deleteUser(uid);
    console.log(`Usuário ${uid} excluído do Firebase Authentication.`);

    const db = admin.firestore();
    await db.collection("user").doc(uid).delete();
    console.log(`Usuário ${uid} excluído do Firestore.`);

    res.status(200).json({ success: true, message: "Usuário excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Export para Vercel
export default app;
