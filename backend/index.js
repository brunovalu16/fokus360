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

    // (Opcional) Enviar o link de verificação por e-mail usando um serviço de envio (ex.: Nodemailer)
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




// Inicializa o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});