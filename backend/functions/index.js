import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Configuração do Nodemailer (use senha de app do Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // variável de ambiente
    pass: process.env.EMAIL_PASS,  // variável de ambiente
  } 
});

// Endpoint para envio de e-mail
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).send("❌ Dados incompletos para envio de e-mail.");
  }

  try {
    await transporter.sendMail({
      from: '"Fokus360" <brunodesigner3@gmail.com>',
      to,
      subject,
      text
    });

    console.log(`✅ Email enviado para: ${to}`);
    res.status(200).send("✅ E-mail enviado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error.message);
    res.status(500).send(`Erro ao enviar e-mail: ${error.message}`);
  }
});

// Exporta a função para o Firebase
export const api = functions.https.onRequest(app);
