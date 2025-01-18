import React, { useState } from "react";
import { Box, Button, TextField, Modal, Typography  } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Importar do Firestore
import { auth, db } from "../../data/firebase-config"; // Importar do arquivo de configuração
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';





const Login = () => {
  const [open, setOpen] = React.useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ email: "", password: "" }); // Estado para armazenar os erros
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "user", user.uid));
      if (userDoc.exists()) {
        const userRole = userDoc.data().role;

        if (userRole === "07") {
          navigate("/projetos");
        } else {
          navigate("/home");
        }
      } else {
        setAlert({
          open: true,
          message: "Por favor, preencha todos os campos.",
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
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Credenciais inválidas. Tente novamente.";
      }

      setAlert({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };
  
    

  return (
    <>
      <Modal
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        aria-labelledby="alert-modal-title"
        aria-describedby="alert-modal-description"
      >
        <Box
          sx={{
            width: "50%", // Ajusta o tamanho horizontal
            height: "100vh", // Ocupar a altura total da tela
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto", // Garante o alinhamento horizontal
            outline: "none", // Remove o contorno padrão do modal
            background: "transparent", // Define o fundo transparente, se necessário
            boxShadow: "none", // Remove sombras ao redor
          }}
        >
          <Collapse in={alert.open}>
            <Alert
              icon={
                <WarningIcon
                  fontSize="inherit"
                  style={{ color: "yellow" }} // Cor amarela para o ícone
                />
              }
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlert({ ...alert, open: false }); // Fechar o alerta e o modal
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{
                mb: 2,
                backgroundColor: "#dc2626", // Fundo vermelho
                border: "none",
                color: "white", // Texto em branco
                "& .MuiAlert-icon": {
                  color: "yellow", // Garantia de que o ícone fique amarelo
                },
              }}
            >
              Por favor, verifique seu email e senha...
            </Alert>
          </Collapse>
        </Box>
      </Modal>

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
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;