import admin from "firebase-admin";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import axios from "axios"; // Brevo API

// Firebase Admin Configuration
let serviceAccount;
if (process.env.FIREBASE_CREDENTIALS) {
  console.log("🔄 Usando credenciais do Firebase a partir das variáveis de ambiente.");
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else {
  console.log("💻 Usando credenciais do Firebase a partir do arquivo local.");
  serviceAccount = JSON.parse(fs.readFileSync("./firebase-service-account.json", "utf8"));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://bancopowerbi-default-rtdb.firebaseio.com",
});

const app = express();
app.use(bodyParser.json());

// ✅ Middleware CORS configurado corretamente:
app.use(cors({
  origin: ["https://fokus360.grupofokus.com.br", "http://localhost:3000"],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
}));

// Health Check
app.get("/", (req, res) => {
  res.json({ status: "API funcionando corretamente 🚀" });
});

// ✅ ROTA - Enviar e-mail via BREVO:
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
        htmlContent: "<p>Você foi marcado como responsável por uma tarefa no Fokus360.</p>",
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
    console.error("Erro ao enviar e-mail:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
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
    res.status(500).json({ success: false, message: error.message });
  }
});

// Exporta
export default app;
