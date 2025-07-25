import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, IconButton, MenuItem, ListSubheader  } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { storageFokus360 } from "../data/firebase-config"; // ✅ Usa a instância correta


import { dbFokus360,  authFokus360 } from "../data/firebase-config";



import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, Timestamp, getDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Modal = ({ open, onClose, onFileUploaded }) => {
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState(""); // Estado para o nome do usuário
   const [areaSelecionada, setAreaSelecionada] = useState("");



  //carregar areas
 const areas = [
  { id: "CONTABILIDADE", nome: "CONTABILIDADE" },
  { id: "CONTROLADORIA", nome: "CONTROLADORIA" },
  { id: "FINANCEIRO", nome: "FINANCEIRO" },
  { id: "JURIDICO", nome: "JURÍDICO" },
  { id: "LOGISTICA", nome: "LOGÍSTICA" },
  { id: "MARKETING", nome: "MARKETING" },
  { id: "TRADE", nome: "TRADE" },
  // Substituindo TRADE por lista de indústrias:
  { id: "37", nome: "Ajinomoto" },
  { id: "38", nome: "AB Mauri" },
  { id: "39", nome: "Adoralle" },
  { id: "40", nome: "Bettanin" },
  { id: "41", nome: "Mars" },
  { id: "42", nome: "Mars Pet" },
  { id: "43", nome: "M. Dias" },
  { id: "44", nome: "SCJhonson" },
  { id: "45", nome: "UAU Ingleza" },
  { id: "46", nome: "Danone" },
  { id: "47", nome: "Ypê" },
  { id: "48", nome: "Adoralle" },
  { id: "49", nome: "Fini" },
  { id: "50", nome: "Heinz" },
  { id: "51", nome: "Red Bull" },
  { id: "RECURSOSHUMANOS", nome: "RECURSOS HUMANOS" },
  { id: "TI", nome: "TI" },
  { id: "COMERCIAL", nome: "COMERCIAL" },
  { id: "INDUSTRIA", nome: "INDUSTRIA" },
];




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
    const unsubscribe = onAuthStateChanged(authFokus360, (user) => { // ✅ Agora usa authFokus360 corretamente
      if (user) {
        setUserName(user.displayName || user.email || "Usuário Anônimo");
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  
  

  const handleFileUpload = async () => {
    // Validação de campos obrigatórios
    if (!file || !selectedFileType || !selectedState || !areaSelecionada) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      // Upload do arquivo no Firebase Storage
      const storageRef = ref(storageFokus360, `arquivos/${file.name}`); // ✅ Agora usa storageFokus360 corretamente

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Criar o objeto de metadados para salvar no Firestore
     // Encontra o objeto da área selecionada
    const areaInfo = areas.find(area => area.id === areaSelecionada);

    const newFile = {
      uploadedBy: userName,
      fileType: selectedFileType,
      state: selectedState,
      area: areaInfo?.nome || areaSelecionada, // salva o nome da área ou o id caso não ache
      role: !isNaN(areaSelecionada) ? areaSelecionada : null, // se for indústria, salva o role
      fileName: file.name,
      fileURL: downloadURL,
      createdAt: Timestamp.now(),
    };



      // Adicionar o arquivo ao Firestore
      await addDoc(collection(dbFokus360, "arquivos"), newFile); // ✅ Agora usa dbFokus360 corretamente


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

          <TextField
            fullWidth
            label="Área"
            variant="outlined"
            margin="normal"
            value={areaSelecionada}
            onChange={(e) => setAreaSelecionada(e.target.value)}
            select
          >
            {/* Áreas comuns */}
            {areas
              .filter(area => isNaN(area.id))
              .map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.nome}
                </MenuItem>
              ))}

            {/* Cabeçalho para indústrias */}
            <ListSubheader sx={{ color: "#5f53e5" }}>Indústrias</ListSubheader>

            {/* Indústrias */}
            {areas
              .filter(area => !isNaN(area.id))
              .map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.nome}
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
