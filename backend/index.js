import admin from "firebase-admin";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import axios from "axios"; // Brevo vai ser via Axios

// Firebase Admin Configuração
let serviceAccount;
if (process.env.FIREBASE_CREDENTIALS) {
  console.log("🔄 Usando credenciais do Firebase pelas variáveis.");
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else {
  console.log("💻 Usando credenciais do Firebase locais.");
  serviceAccount = JSON.parse(fs.readFileSync("./firebase-service-account.json", "utf8"));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://bancopowerbi-default-rtdb.firebaseio.com",
});

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["https://fokus360.grupofokus.com.br", "http://localhost:3000"], // ✅ Frontend domínio e localhost para testes
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);


// Health Check
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
    res.status(200).json({ success: true, message: "E-mail atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar e-mail:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Excluir usuário
app.post("/delete-user", async (req, res) => {
  const { uid } = req.body;
  try {
    if (!uid) throw new Error("UID não fornecido.");

    await admin.auth().deleteUser(uid);
    await admin.firestore().collection("user").doc(uid).delete();

    res.status(200).json({ success: true, message: "Usuário excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Enviar e-mail via Brevo
app.post("/send-task-email", async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) throw new Error("E-mail não fornecido.");

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Fokus360", email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: email }],
        subject: "Nova Tarefa no Fokus360",
        htmlContent: "<p>Você foi marcado como responsável por uma tarefa.</p>",
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`📧 E-mail enviado para: ${email}`);
    res.status(200).json({ success: true, message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Exportação para Vercel
export default app;
