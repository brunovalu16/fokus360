import React, { useEffect, useState } from "react";
import { Box, Typography, Modal, Alert } from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { Link } from "react-router-dom";
import capaarquivos from "../../../src/assets/images/capaarquivos.webp"
import { getDocs, getDoc, doc, collection } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config"; // Para Fokus360

import { authFokus360 } from "../../data/firebase-config"; // ✅ Removido appFokus360

import { onAuthStateChanged } from "firebase/auth"; // Firebase Auth padrão

import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';

const Capaarquivos = () => {
  const [isUserAssociated, setIsUserAssociated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSolicitanteAssociated, setIsSolicitanteAssociated] = useState(false); // Verificação específica para solicitante
  const [userRole, setUserRole] = useState(null); // Armazena o perfil do usuário
  
  //const authFokus360 = getAuth(appFokus360 );

// Verifica se o usuário está associado a algum projeto
const checkUserAssociation = async (userEmail, userId) => {
  if (!userId) {
    setIsUserAssociated(false);
    return;
  }

  try {
    const projetosSnapshot = await getDocs(collection(dbFokus360, "projetos"));
    let associated = false;

    for (let docSnap of projetosSnapshot.docs) {
      const data = docSnap.data();

      // Verifica colaboradores por userId
      if (Array.isArray(data.colaboradores) && data.colaboradores.includes(userId)) {
        associated = true;
        break;
      }

      // Verifica solicitanteEmail
      if (data.solicitanteEmail === userEmail) {
        associated = true;
        break;
      }

      // ✅ Verifica colaboradorEmail
      if (data.colaboradorEmail === userEmail) {
        associated = true;
        break;
      }

      // Verifica se está em operacional.emails[]
      const operacionais = data.operacional || [];
      for (let operacional of operacionais) {
        if (operacional.emails && operacional.emails.includes(userEmail)) {
          associated = true;
          break;
        }
      }
      if (associated) break;

      // Verifica se está nas tarefas (planoDeAcao.quem)
      const diretrizes = data.diretrizes || [];
      for (let diretriz of diretrizes) {
        const tarefas = diretriz.tarefas || [];
        for (let tarefa of tarefas) {
          const planoDeAcao = tarefa.planoDeAcao || {};
          const responsaveis = planoDeAcao.quem || [];
          if (responsaveis.includes(userId)) {
            associated = true;
            break;
          }
        }
        if (associated) break;
      }
    }

    setIsUserAssociated(associated);
  } catch (error) {
    console.error("Erro ao verificar associação do usuário:", error);
    setIsUserAssociated(false);
  }
};



 // Verifica se o usuário logado é solicitante
 const checkSolicitanteAssociation = async (userEmail) => {
  try {
    const projetosSnapshot = await getDocs(collection(dbFokus360, "projetos"));

    for (let docSnap of projetosSnapshot.docs) {
      const data = docSnap.data();
      if (data.solicitanteEmail === userEmail) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Erro ao verificar associação como solicitante:", error);
    return false;
  }
};


  // Busca o perfil do usuário no Firestore
  const fetchUserRole = async (uid) => {
    if (!uid) return;
  
    try {
      const userDoc = await getDoc(doc(dbFokus360, "user", uid));
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role || null);
      }
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário no Firestore:", error);
    }
  };
  
 

  // Verifica a associação do usuário após logar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        const email = currentUser.email;
        await fetchUserRole(currentUser.uid); // ← passe o ID diretamente
        await checkUserAssociation(email, currentUser.uid);
        setIsSolicitanteAssociated(await checkSolicitanteAssociation(email));
      } else {
        setUserId(null);
        setIsUserAssociated(false);
        setIsSolicitanteAssociated(false);
        setUserRole(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  
  

   // Controla o clique nos links
  const handleLinkClick = (e) => {
    //console.log("UserRole atual:", userRole);
    if (userRole === "08") {
      //console.log("Acesso liberado para Admin.");
      return; // Permite o acesso automaticamente para Admin
    }

    if (!isUserAssociated && !isSolicitanteAssociated) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };


//função para buscar e validar os e-mails nas diretrizes
  const isUserInDiretrizes = (projeto, userEmail) => {
    const estrategicas = projeto.estrategicas || [];
  
    for (let estrategica of estrategicas) {
      // Verifica em estrategica.emails
      if (estrategica.emails && estrategica.emails.includes(userEmail)) {
        return true;
      }
  
      const taticas = estrategica.taticas || [];
      for (let tatica of taticas) {
        // Verifica em tatica.emails
        if (tatica.emails && tatica.emails.includes(userEmail)) {
          return true;
        }
  
        const operacionais = tatica.operacionais || [];
        for (let operacional of operacionais) {
          // Verifica em operacional.emails
          if (operacional.emails && operacional.emails.includes(userEmail)) {
            return true;
          }
        }
      }
    }
    return false;
  };
  


  const hasPermission = userRole === "08" || isUserAssociated || isSolicitanteAssociated;


  return (
    <>
      {/* Modal de Alerta */}
      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Fechar o modal ao clicar fora dele
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
                onClick={() => setIsModalOpen(false)} // Fechar o modal
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
            Nenhum projeto encontrado para este usuário.
          </Alert>
        </Box>
      </Modal>

      {/* Conteúdo Principal */}
      <Box
        sx={{
          marginLeft: "40px",
          marginTop: "10px",
          width: "calc(100% - 80px)", // Para ajustar à tela considerando o margin de 40px
          minHeight: "50vh",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
          overflowX: "hidden",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PlayCircleFilledIcon sx={{ color: "#ffe000", fontSize: 25 }} />
          <Typography color="#858585">FOKUS 360 | ARQUIVOS</Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            marginBottom: "40px",
            marginTop: "15px",
          }}
        ></Box>

        {/* Estrutura da Imagem */}
        <div style={{ position: "relative", width: "100%", top: "-40px" }}>
          <img
            src={capaarquivos}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          />

          {/* Links sobrepostos */}
          <Box
            sx={{
              position: "absolute",
              top: "63%", // Posição para "Novo Projeto"
              left: "10%",
              height: "150px",
            }}
          >
            <Link
              to="/arquivos"
              style={{
                backgroundColor: "transparent",
                color: "transparent",
                textDecoration: "none",
                fontWeight: "bold",
                marginLeft: "5px",
                alignContent: "center",
                paddingRight: "300px",
                paddingBottom: "80px",
              }}
            >
              Novo Projeto
            </Link>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "30%", // Posição para "Resumo Geral"
              right: "5%",
              height: "150px",
            }}
          >
            <Link
              to={hasPermission ? "/planejamentogeral" : ""}
              onClick={handleLinkClick}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "transparent",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                paddingRight: "250px",
                paddingBottom: "20px",
              }}
            >
              Resumo Geral
            </Link>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "42%", // Posição para "Projetos"
              right: "6%",
            }}
          >
            <Link
              to={hasPermission ? "/listaprojetos" : "#"}
              onClick={handleLinkClick}
              style={{
                backgroundColor: "transparent",
                color: "transparent",
                textDecoration: "none",
                fontWeight: "bold",
                paddingRight: "280px",
                paddingBottom: "30px",
              }}
            >
              Projetos
            </Link>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "58%", // Posição para "Fluxograma"
              right: "6%",
            }}
          >
            <Link
              to={hasPermission ? "/eapplanejamento" : "#"}
              onClick={handleLinkClick}
              style={{
                backgroundColor: "transparent",
                color: "transparent",
                textDecoration: "none",
                fontWeight: "bold",
                paddingRight: "280px",
                paddingBottom: "40px",
              }}
            >
              Projetos
            </Link>
          </Box>
        </div>
      </Box>
    </>
  );
};

export default Capaarquivos;
