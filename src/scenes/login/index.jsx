import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../data/firebase-config";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";

const Login = () => {
  const [open, setOpen] = useState(false); // Controla o modal de redefinição de senha
  const [resetEmail, setResetEmail] = useState(""); // Armazena o e-mail para redefinição
  const [alertReset, setAlertReset] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setAlert({
        open: true,
        message: "Por favor, preencha todos os campos.",
        severity: "error",
      });
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
  
      // Verificar se o e-mail foi confirmado
      if (!user.emailVerified) {
        window.alert("Por favor, verifique seu e-mail antes de fazer login.");
        await auth.signOut(); // Desconecta o usuário
        return;
      }
  
      const userDoc = await getDoc(doc(db, "user", user.uid));
      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
  
        // Armazenar autenticação no localStorage
        localStorage.setItem("token", user.accessToken); // Salva o token no localStorage
        localStorage.setItem("userRole", userRole); // Armazena o papel do usuário (opcional)
  
        // Redirecionar com base no papel do usuário
        navigate(userRole === "07" ? "/projetos" : "/home");
      } else {
        setAlert({
          open: true,
          message: "Usuário não encontrado no Firestore.",
          severity: "error",
        });
      }
    } catch (error) {
      let errorMessage = "Ocorreu um erro inesperado.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado. Verifique o email informado.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta. Tente novamente.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido. Por favor, insira um email válido.";
      }
  
      setAlert({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };
  

  // Função para enviar o e-mail de redefinição de senha
  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setAlertReset({
        open: true,
        message: "Por favor, insira seu e-mail.",
        severity: "error",
      });
      return;
    }
  
    try {
      console.log("Enviando e-mail para:", resetEmail);
      await sendPasswordResetEmail(auth, resetEmail);
      console.log("E-mail enviado com sucesso!");
      setAlertReset({
        open: true,
        message:
          "E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.",
        severity: "success",
      });
      setOpen(false); // Fecha o modal
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição:", error.code, error.message);
      setAlertReset({
        open: true,
        message:
          "Erro ao enviar e-mail de redefinição. Verifique se o e-mail está correto.",
        severity: "error",
      });
    }
  };
  

  return (
    <>
      {/* Modal para redefinição de senha */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="reset-password-modal-title"
        aria-describedby="reset-password-modal-description"
      >
        <Box
          sx={{
            width: "30%",
            backgroundColor: "white",
            padding: 4,
            borderRadius: 3,
            boxShadow: 3,
            textAlign: "center",
            margin: "0 auto",
            marginTop: "10%",
          }}
        >
          <Typography variant="h6" mb={2}>
            Redefinir Senha
          </Typography>
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            variant="outlined"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#312783",
              color: "white",
              "&:hover": { backgroundColor: "#868dfb" },
            }}
            onClick={handlePasswordReset}
          >
            Enviar Email de Redefinição
          </Button>
        </Box>
      </Modal>

      {/* Modal de alerta */}
      <Modal
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        aria-labelledby="alert-modal-title"
        aria-describedby="alert-modal-description"
      >
        <Box
          sx={{
            width: "50%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
            outline: "none",
            background: "transparent",
            boxShadow: "none",
          }}
        >
          <Collapse in={alert.open}>
            <Alert
              icon={<WarningIcon fontSize="inherit" style={{ color: "yellow" }} />}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlert({ ...alert, open: false });
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{
                mb: 2,
                backgroundColor: "#dc2626",
                border: "none",
                color: "white",
                "& .MuiAlert-icon": {
                  color: "yellow",
                },
              }}
            >
              Por favor, verifique seu email e senha...
            </Alert>
          </Collapse>
        </Box>
      </Modal>

      {/* Alerta verde */}
      <Box
        sx={{
          position: "fixed",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        {alertReset.open && (
          <Alert
            severity={alertReset.severity}
            onClose={() => setAlertReset({ ...alertReset, open: false })}
          >
            {alertReset.message}
          </Alert>
        )}
      </Box>

      {/* Formulário de login */}
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundImage: 'url("src/assets/images/backlogin2.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          width: "100vw",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#312783",
            padding: "58px",
            paddingBottom: "64px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottomLeftRadius: "50px",
            transform: "scale(0.8)",
            marginRight: "-95px",
            height: "35%",
          }}
        >
          <img
            src="src/assets/images/logo360verde.png"
            alt="Logo"
            style={{
              width: "450px",
              height: "auto",
            }}
          />
        </Box>

        <Box
          sx={{
            borderTopRightRadius: "50px",
            backgroundColor: "white",
            padding: 4,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: "90%",
            maxWidth: 400,
            textAlign: "center",
            transform: "scale(0.8)",
            marginRight: "370px",
          }}
        >
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="E-mail"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                borderRadius: 5,
                backgroundColor: "#312783",
                color: "white",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#868dfb",
                  boxShadow: "none",
                },
              }}
            >
              Entrar
            </Button>

            {/* Botão "Esqueci a senha" */}
            <Button
              variant="text"
              onClick={() => setOpen(true)}
              sx={{ color: "#312783" }}
            >
              Esqueci a senha
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
