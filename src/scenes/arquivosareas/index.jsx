import React, { useState, useEffect } from "react";
import { 
  Box, Button, TextField, Select, MenuItem, InputLabel, 
  Avatar, FormControl, Checkbox, ListItemText 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

import { dbFokus360, storageFokus360 } from "../../data/firebase-config";

import { onAuthStateChanged } from "firebase/auth";


import { authFokus360 } from "../../data/firebase-config";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";


// ✅ Importando imagens corretamente
import logoImage from "../../assets/images/icone_logo.png";

const Arquivosareas = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [areasSelecionadas, setAreasSelecionadas] = useState([]);
  const [unidadesSelecionadas , setUnidadesSelecionadas ] = useState([]);
  const [unidade, setUnidade] = useState("");
  const [area, setArea] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(""); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);



  const areas = [
    { id: "CONTABILIDADE", nome: "CONTABILIDADE" },
    { id: "CONTROLADORIA", nome: "CONTROLADORIA" },
    { id: "FINANCEIRO", nome: "FINANCEIRO" },
    { id: "JURIDICO", nome: "JURÍDICO" },
    { id: "LOGISTICA", nome: "LOGÍSTICA" },
    { id: "MARKETING", nome: "MARKETING" },
    { id: "TRADE", nome: "TRADE" },
    { id: "RECURSOSHUMANOS", nome: "RECURSOS HUMANOS" },
    { id: "TI", nome: "TI" },
    { id: "COMERCIAL", nome: "COMERCIAL" },
    { id: "INDUSTRIA", nome: "INDUSTRIA" }
  ];


{/**================================================ */}

  // Lista de roles restritos
const rolesRestritos = [
  "37", "38", "39", "40", "41", "42", "43", "44",
  "45", "46", "47", "48", "49", "50", "51"
];

// Definir quais áreas devem ser exibidas com base no role
const areasDisponiveis = React.useMemo(() => {
  if (!role) return [];
  return rolesRestritos.includes(role)
    ? [{ id: "INDUSTRIA", nome: "INDUSTRIA" }]
    : areas;
}, [role]);




useEffect(() => {
  const unsubscribe = onAuthStateChanged(authFokus360, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(dbFokus360, "user", user.uid));
      if (userDoc.exists()) {
        const dados = userDoc.data();
        setRole(dados.role);
      }
    }
    setLoading(false); // marca que terminou de carregar
  });

  return () => unsubscribe();
}, []);



  {/**================================================ */}

  // Função para atualizar o preview do avatar
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file)); // Gera preview da imagem
    }
  };

  // Upload de foto no Firebase Storage
  const handleUploadPhoto = async () => {
    if (!avatar) return "";

    try {
      const storageRef = ref(storageFokus360, `users/${Date.now()}_${avatar.name}`);
      await uploadBytes(storageRef, avatar);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Erro ao carregar a foto:", error);
      return "";
    }
  };

  // Cadastro de Areas e unidades

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      // Verifica se pelo menos uma unidade ou área foi selecionada
      if (unidadesSelecionadas.length === 0 && areasSelecionadas.length === 0) {
        alert("Selecione ao menos uma Unidade ou uma Área para cadastrar.");
        return;
      }
  
      // Cadastra Unidades (se houver)
      if (unidadesSelecionadas.length > 0) {
        await Promise.all(
          unidadesSelecionadas.map(async (unidade) => {
            await addDoc(collection(dbFokus360, "unidade"), { nome: unidade });
          })
        );
      }
  
      // Cadastra Áreas (se houver)
      if (areasSelecionadas.length > 0) {
        await Promise.all(
          areasSelecionadas.map(async (area) => {
            await addDoc(collection(dbFokus360, "areas"), { nome: area });
          })
        );
      }
  
      alert("Cadastro realizado com sucesso!");
  
      // ✅ Limpa os estados
      setUnidadesSelecionadas([]);
      setAreasSelecionadas([]);
    } catch (error) {
      console.error("Erro ao cadastrar:", error.message);
      alert("Erro ao cadastrar unidades e áreas.");
    }
  };
  
  
  
  if (loading) return (
  <Box sx={{ textAlign: "center", mt: 10 }}>
    <span>Carregando...</span>
  </Box>
);


  return (

    <Box sx={{ transform: "scale(0.8)", transformOrigin: "top center" }}>
      <Box 
        display="flex" flexDirection="row" alignItems="center" justifyContent="center"
        sx={{ backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "80vw", minHeight: "90vh" }}
      >
        

        {/* Formulário de Cadastro */}
        <Box sx={{ borderTopRightRadius: "50px", backgroundColor: "white", padding: 5, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", width: "90%", maxWidth: 400, textAlign: "center" }}>
          <Box component="form" onSubmit={handleCadastro} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            
          

        

        {role && (
          <FormControl fullWidth variant="outlined">
            <InputLabel id="areas-label" sx={{ fontSize: 18 }}>
              Escolha arquivos por área
            </InputLabel>
            <Select
              labelId="areas-label"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              label="Escolha arquivos por área"
              sx={{ fontSize: 16 }}
            >
              {areasDisponiveis.map((area) => (
                <MenuItem key={area.id} value={area.id} sx={{ fontSize: 16 }}>
                  {area.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}




            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                if (!area) return alert("Selecione uma área antes de continuar.");

                if (area === "INDUSTRIA") {
                  navigate("/PainelIndustriasTrade"); // redireciona para a rota desejada
                } else {
                  navigate(`/arquivos?area=${area}`);
                }
              }}
              sx={{
                borderRadius: 2,
                backgroundColor: "#312783",
                color: "white",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#868dfb",
                  boxShadow: "none",
                },
              }}
            >
              ACESSAR ARQUIVOS
            </Button>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Arquivosareas;
