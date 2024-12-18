import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, IconButton, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { db, storage, auth } from "../data/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, Timestamp, getDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Modal = ({ open, onClose, onFileUploaded }) => {
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState(""); // Estado para o nome do usuário

  const fileTypes = [
    "Ações",
    "Apresentações",
    "Catálogos",
    "Paineis de vendas",
    "Campanhas",
    "Relatórios",
    "Planilhas",
    "Outros",
  ];

  const states = ["GO", "DF", "TO", "MT", "MS", "PA"];

  // Obter o nome do usuário autenticado ao montar o componente
  useEffect(() => {
    // verfifica o estado do user logado e passa para o fechuser
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
        if (user) {
          
          setUserName(user.displayName || user.email || "Usuário Anônimo");
        }

    return () => unsubscribe();
  });

  }, []);
  
  

  const handleFileUpload = async () => {
    // Validação de campos obrigatórios
    if (!file || !selectedFileType || !selectedState) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      // Upload do arquivo no Firebase Storage
      const storageRef = ref(storage, `arquivos/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Criar o objeto de metadados para salvar no Firestore
      const newFile = {
        uploadedBy: userName, // Nome do usuário
        fileType: selectedFileType,
        state: selectedState,
        fileName: file.name,
        fileURL: downloadURL,
        createdAt: Timestamp.now(),
      };

      // Adicionar o arquivo ao Firestore
      await addDoc(collection(db, "arquivos"), newFile);

      // Notificar o componente pai
      if (onFileUploaded) {
        onFileUploaded(newFile);
      }

      alert("Arquivo enviado com sucesso!");
      onClose(); // Fechar o modal
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Ocorreu um erro ao enviar o arquivo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          width: "430px",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          backgroundColor="#5f53e5"
          padding="10px"
          paddingLeft="15px"
          borderRadius="8px"
          color="white"
          mb={2}
        >
          <Typography variant="h6">Adicionar Arquivo</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>

        <form>
          <TextField
            fullWidth
            label="Tipo de arquivo"
            variant="outlined"
            margin="normal"
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
            select
          >
            {fileTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="file"
            margin="normal"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <TextField
            fullWidth
            label="Unidade"
            variant="outlined"
            margin="normal"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            select
          >
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        </form>

        <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFileUpload}
            disabled={isLoading}
            sx={{
              boxShadow: "none",
              backgroundColor: "#5f53e5",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#6870fa",
                boxShadow: "none",
              },
            }}
          >
            {isLoading ? "Enviando..." : "Salvar"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
            sx={{
              boxShadow: "none",
              backgroundColor: "#f44336",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#e53935",
                boxShadow: "none",
              },
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Modal;
