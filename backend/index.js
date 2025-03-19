// Backend API - Firebase Admin Configuration
import admin from "firebase-admin";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import nodemailer from "nodemailer"; // Coloque no topo

// Verifica se a variável de ambiente FIREBASE_CREDENTIALS existe (Vercel)
let serviceAccount;
if (process.env.FIREBASE_CREDENTIALS) {
  console.log("🔄 Usando credenciais do Firebase a partir das variáveis de ambiente.");
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else {
  console.log("💻 Usando credenciais do Firebase a partir do arquivo local.");
  console.log("✅ Servidor rodando!");
  serviceAccount = JSON.parse(fs.readFileSync("./firebase-service-account.json", "utf8"));
}

// Verifica se a variável de ambiente FIREBASE_DATABASE_URL existe (Vercel)
const databaseURL = process.env.FIREBASE_DATABASE_URL || "https://bancopowerbi-default-rtdb.firebaseio.com";

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

const app = express();

app.use(cors({
  origin: ["https://fokus360.grupofokus.com.br", "http://localhost:3000"], // Libera seu domínio + local
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(bodyParser.json());


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

  try {
    if (!uid) {
      throw new Error("UID não fornecido.");
    }

    console.log(`Recebendo solicitação para excluir UID: ${uid}`);

    // Excluir usuário do Firebase Authentication
    await admin.auth().deleteUser(uid);

    console.log(`Usuário ${uid} excluído do Firebase Authentication.`);

    // Excluir do Firestore
    const db = admin.firestore();
    await db.collection("user").doc(uid).delete();

    console.log(`Usuário ${uid} excluído do Firestore.`);

    res.status(200).json({ success: true, message: "Usuário excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});



// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // coloque no Vercel as variáveis
    pass: process.env.EMAIL_PASS, // senha de app
  },
});

// ROTA para envio de e-mail de notificação
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).send("❌ Dados incompletos.");
  }

  try {
    await transporter.sendMail({
      from: `"Fokus360" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`✅ Email enviado para: ${to}`);
    res.status(200).send("✅ E-mail enviado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error.message);
    res.status(500).send(`Erro ao enviar e-mail: ${error.message}`);
  }
});







// ✅ Exportando o app para a Vercel reconhecer como Serverless Function
export default app;
