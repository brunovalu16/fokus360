import React, { useState } from "react";
import { 
  Box, Button, TextField, Select, MenuItem, InputLabel, 
  Avatar, FormControl, Checkbox, ListItemText 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

import { dbFokus360, storageFokus360 } from "../../data/firebase-config";

import { authFokus360 } from "../../data/firebase-config";

import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";


// ✅ Importando imagens corretamente
import logoImage from "../../assets/images/icone_logo.png";

const CadastroAreas = () => {
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


  const areas = [
    { id: "CONTABILIDADE", nome: "CONTABILIDADE" },
    { id: "CONTROLADORIA", nome: "CONTROLADORIA" },
    { id: "FINANCEIRO", nome: "FINANCEIRO" },
    { id: "JURIDICO", nome: "JURÍDICO" },
    { id: "LOGISTICA", nome: "LOGÍSTICA" },
    { id: "MARKETING", nome: "MARKETING" },
    { id: "TRADE", nome: "TRADE" },
    { id: "RECURSOSHUMANOS", nome: "RECURSOS HUMANOS" },
    { id: "TI", nome: "TI" }
  ];

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
  
  
  
  

  return (
    <Box sx={{ transform: "scale(0.8)", transformOrigin: "top center" }}>
      <Box 
        display="flex" flexDirection="row" alignItems="center" justifyContent="center"
        sx={{ backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "80vw", minHeight: "90vh" }}
      >
        

        {/* Formulário de Cadastro */}
        <Box sx={{ borderTopRightRadius: "50px", backgroundColor: "white", padding: 5, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", width: "90%", maxWidth: 400, textAlign: "center" }}>
          <Box component="form" onSubmit={handleCadastro} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            
          

        

          <FormControl fullWidth>
            <InputLabel id="areas-label">Cadastrar Áreas do Grupo Fokus</InputLabel>
            <Select
              labelId="areas-label"
              multiple
              value={areasSelecionadas}
              onChange={(event) => setAreasSelecionadas(event.target.value)}
              renderValue={(selected) =>
                selected.length === 0
                  ? "Selecione as áreas responsáveis"
                  : selected.map(
                      (id) => areas.find((area) => area.id === id)?.nome || "Desconhecida"
                    ).join(", ")
              }
            >
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  <Checkbox checked={areasSelecionadas.includes(area.id)} />
                  <ListItemText primary={area.nome} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="unidade-label">Cadastrar Unidades do Grupo Fokus</InputLabel>
            <Select
              labelId="unidade-label"
              multiple
              value={unidadesSelecionadas}
              onChange={(event) => setUnidadesSelecionadas(event.target.value)}
              renderValue={(selected) =>
                selected.length === 0
                  ? "Selecione as unidades"
                  : selected.join(", ")
              }
            >
              {[
                "BRASÍLIA",
                "GOIÁS",
                "MATO GROSSO",
                "MATO GROSSO DO SUL",
                "PARÁ",
                "TOCANTINS"
              ].map((nome) => (
                <MenuItem key={nome} value={nome}>
                  <Checkbox checked={unidadesSelecionadas.includes(nome)} />
                  <ListItemText primary={nome} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>



            

            <Button 
              variant="contained" type="submit" fullWidth
              sx={{ borderRadius: 2, backgroundColor: "#312783", color: "white", boxShadow: "none", "&:hover": { backgroundColor: "#868dfb", boxShadow: "none" } }}
            >
              CADASTRAR
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CadastroAreas;
