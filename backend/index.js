// Backend API - Firebase Admin Configuration
import admin from "firebase-admin";
import express from "express";
import SibApiV3Sdk from 'sib-api-v3-sdk';
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

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
// ⚠️ Configure CORS para liberar frontend
app.use(cors({
  origin: ['https://fokus360.grupofokus.com.br', 'http://localhost:3000']
}));

// Test route
app.get("/", (req, res) => {
  res.json({ status: "API funcionando corretamente 🚀" });
});


// Brevo Config
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sender = { email: process.env.BREVO_SENDER_EMAIL, name: "Fokus360" };

app.post('/send-task-email', async (req, res) => {
  const { email, tituloTarefa, assuntoTarefa, prazoTarefa } = req.body;

  if (!email) return res.status(400).send('E-mail obrigatório');

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = {
    sender,
    to: [{ email }],
    subject: `Nova Tarefa: ${tituloTarefa}`,
    htmlContent: `
      <h3>Você recebeu uma nova tarefa no Fokus360</h3>
      <p><strong>Título:</strong> ${tituloTarefa}</p>
      <p><strong>Descrição:</strong> ${assuntoTarefa}</p>
      <p><strong>Prazo:</strong> ${prazoTarefa}</p>
    `,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`📧 E-mail enviado para ${email}`);
    res.status(200).send('E-mail enviado');
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).send('Erro ao enviar e-mail');
  }
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
