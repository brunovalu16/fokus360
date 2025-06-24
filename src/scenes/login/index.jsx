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
import { authFokus360, dbFokus360 as db } from "../../data/firebase-config"; // ✅ Removido appFokus360


import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import background from "../../assets/images/backlogin4.webp";
import logo from "../../assets/images/fokus360cinza.png";


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
        authFokus360,
        email,
        password
      );
      const user = userCredential.user;
  
      // Verificar se o e-mail foi confirmado
      if (!user.emailVerified) {
        window.alert("Por favor, verifique seu e-mail antes de fazer login.");
        await authFokus360.signOut(); // Desconecta o usuário
        return;
      }
  
      const userDoc = await getDoc(doc(db, "user", user.uid));
      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        
        // Armazenar autenticação no localStorage
        localStorage.setItem("userId", user.uid); // 👈 salva o ID do usuário logado
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
      await sendPasswordResetEmail(authFokus360, resetEmail);
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
            backgroundColor: "#fff",
            padding: 4,
            borderRadius: 3,
            boxShadow: 3,
            textAlign: "center",
            margin: "0 auto",
            marginTop: "10%",
          }}
        >
          <Typography variant="h6" mb={2} sx={{ color: "#a7a7a7" }}>
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
              "&:hover": { backgroundColor: "#312783" },
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
          backgroundImage: `url(${background})`,
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
            padding: "30px",
            paddingBottom: "50px",
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
            src={logo}
            alt="Logo"
            style={{
              width: "380px",
              height: "auto",
            }}
          />
        </Box>

        <Box
          sx={{
            borderTopRightRadius: "50px",
            borderBottomLeftRadius: "50px",
            background: "radial-gradient(circle, #fff, #f7f7f7)",
            padding: 4,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
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
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <TextField
              label="E-mail"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#aaaaaa',
                    borderRadius: "20px",
                  },
                  '&:hover fieldset': {
                    borderColor: '#aaaaaa',
                    borderRadius: "20px",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#aaaaaa',
                  },
                  color: '#aaaaaa',
                },
                '& .MuiInputLabel-root': {
                  color: '#b6b6b6',
                  
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#b6b6b6',
                  
                },
                '& .MuiOutlinedInput-input': {
                  color: '#b6b6b6',
                  
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#b6b6b6',
                  opacity: 1,
                  
                },
              }}
            />

            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#aaaaaa',
                    borderRadius: "20px",
                  },
                  '&:hover fieldset': {
                    borderColor: '#aaaaaa',
                    borderRadius: "20px",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#aaaaaa',
                  },
                  color: '#b6b6b6',
                },
                '& .MuiInputLabel-root': {
                  color: '#b6b6b6',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#b6b6b6',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#b6b6b6',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#b6b6b6',
                  opacity: 1,
                },
              }}
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
              sx={{ color: "#949494" }}
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
