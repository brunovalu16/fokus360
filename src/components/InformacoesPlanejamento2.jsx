import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  TextField,
  ListItemText,
  Select,
  MenuItem,
  Typography,
  Accordion,
  AccordionDetails,
  Button,
} from "@mui/material";
import { FormControl, InputLabel, ListItemAvatar, Avatar  } from "@mui/material";

import { dbFokus360 } from "../data/firebase-config"; // ✅ Usa a instância correta
import { getDocs, collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { getApps } from "firebase/app";



/**
 *  InformacoesProjeto
 *
 *  Recebe:
 *    - onUpdate( (prev) => ({ ...prev, ... }) ) => para atualizar no pai
 */
const InformacoesPlanejamento2 = ({ projetoData, onUpdate, onSaveProjectId   }) => {
  const [users, setUsers] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [colaboradorEmail, setColaboradorEmail] = useState("");
  const [areas, setAreas] = useState([]);
  const [unidade, setUnidade] = useState([]);
  const [dataFim, setDataFim] = useState("");
  
  //Estado para gerenciar perfil de usuario para poder alterar os campos de datas
  const [perfilUsuario, setPerfilUsuario] = useState(""); // Guarda o perfil do usuário logado


  const [formValues, setFormValues] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    prazoPrevisto: "",
    unidade: "",
    solicitante: "",
    solicitanteEmail: "", // Adicionado para o e-mail do solicitante
    colaboradorEmail: "",
    categoria: "",
    colaboradores: [],
    responsavel: "",
    orcamento: "",
  });




//preencher os campos normalmente vindo do banco
useEffect(() => {
  if (projetoData) {
    setFormValues((prev) => ({
      ...prev,
      nome: projetoData.nome || "",
      descricao: projetoData.descricao || "",
      dataInicio: projetoData.dataInicio || "",
      prazoPrevisto: projetoData.prazoPrevisto || "",
      unidade: projetoData.unidade || "",
      solicitante: projetoData.solicitante || "",
      solicitanteEmail: projetoData.solicitanteEmail || "",
      colaboradorEmail: projetoData.colaboradorEmail || "",
      categoria: projetoData.categoria || "",
      colaboradores: projetoData.colaboradores || [],
      responsavel: projetoData.responsavel || "",
      orcamento: projetoData.orcamento || "",
    }));
    setAreas(projetoData.areasResponsaveis || []);
    setUnidade(projetoData.unidade || []);
    setDataFim(projetoData.dataFim || "");
  }
}, [projetoData]);



//função para formatar a data quando o usuario digita no input finalização do projeto
const formatarData = (value) => {
  let digits = value.replace(/\D/g, ""); // Remove tudo que não é número

  if (digits.length > 2 && digits.length <= 4) {
    digits = digits.replace(/(\d{2})(\d{1,2})/, "$1/$2");
  } else if (digits.length > 4) {
    digits = digits.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
  }

  setDataFim(digits);
};







//Função para atualizar no banco as modificações do usuarios nos campos
const handleUpdate = async () => {
  if (!projetoData?.id) {
    alert("ID do projeto não encontrado!");
    return;
  }

  try {
    const formatarDataParaISO = (data) => {
      if (!data) return "";
      const [ano, mes, dia] = data.split("-");
      return `${ano}-${mes}-${dia}`;
    };

    const dataInicioISO = formatarDataParaISO(formValues.dataInicio);
    const prazoPrevistoISO = formatarDataParaISO(formValues.prazoPrevisto);

    const projetoAtualizado = {
      ...formValues,
      dataInicio: dataInicioISO,
      prazoPrevisto: prazoPrevistoISO,
      dataFim: dataFim, 
      updatedAt: new Date(),
    };

    const projetoRef = doc(dbFokus360, "projetos", projetoData.id);

await setDoc(projetoRef, projetoAtualizado, { merge: true });



// =========================
// BUSCA USUÁRIOS SELECIONADOS
// =========================
const colaboradoresSelecionados = users.filter((user) =>
  formValues.colaboradores.includes(user.id)
);

// =========================
// EMAILS
// =========================
const emails = colaboradoresSelecionados
  .map((user) => user.email)
  .filter(Boolean);

// =========================
// IDS USUÁRIOS
// =========================
const userIds = colaboradoresSelecionados.map((user) => user.id);



// =========================
// ENVIA EMAILS
// =========================
if (emails.length > 0) {
  await fetch("https://fokus360-backend.vercel.app/send-project-emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emails,
      tituloProjeto: formValues.nome,
      descricaoProjeto: formValues.descricao,
    }),
  });
}



// =========================
// ENVIA NOTIFICAÇÕES
// =========================
if (userIds.length > 0) {
  await fetch("https://fokus360-backend.vercel.app/send-project-notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userIds,
      mensagem: `Você foi atualizado no projeto: ${formValues.nome}`,
    }),
  });
}

alert("Projeto atualizado com sucesso!");


  } catch (error) {
    console.error("Erro ao atualizar o projeto:", error);
    alert("Erro ao atualizar o projeto.");
  }
};

  
  


  

  // Carregar usuários do Firebase
  useEffect(() => {
    const buscarPerfilUsuario = async () => {
      try {
        const userIdLogado = localStorage.getItem("userId");
  
        if (!userIdLogado) {
          console.warn("userId não encontrado no localStorage.");
          return;
        }
  
        const userDocRef = doc(dbFokus360, "user", userIdLogado);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const role = userDocSnap.data().role;
          //console.log("Perfil carregado:", role);
          setPerfilUsuario(role?.toString().padStart(2, "0"));
        } else {
          console.warn("Documento do usuário não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil do usuário logado:", error);
      }
    };
  
    buscarPerfilUsuario();
  }, []);
  
  
  //COmpara se o usuario é perfil 08 e libera a edição dos campos de datas
  const podeEditarDatas = perfilUsuario === "08";


  // Carregar todos os usuários para popular o Select de solicitante
useEffect(() => {
  const carregarUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(dbFokus360, "user"));
      const listaUsuarios = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        username: doc.data().username,
        photoURL: doc.data().photoURL,
        email: doc.data().email,
      }));  
      setUsers(listaUsuarios);
    } catch (error) {
      console.error("Erro ao carregar usuários para o Select:", error);
    }
  };

  carregarUsuarios();
}, []);



 

  // Atualiza local e já dispara onUpdate para o pai
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    onUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    onUpdate((prev) => ({ ...prev, [name]: value }));
  };

  // Função para formato monetário
  const handleCurrencyChangeOrcamento = (event) => {
    const rawValue = event.target.value; // Valor bruto do input
    const onlyNumbers = rawValue.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(onlyNumbers) / 100); // Formata como moeda

    // Atualiza o estado local com o valor formatado
    setFormValues((prev) => ({
      ...prev,
      orcamento: formattedValue, // Salva o valor formatado no estado
    }));

    // Salva o valor formatado diretamente no banco
    onUpdate((prev) => ({
      ...prev,
      orcamento: formattedValue, // Salva o valor formatado no banco
    }));
  };

  // Função para salvar os dados no Firestore
  const handleSave = async () => {
    try {
      if (!formValues.nome) {
        alert("O nome do projeto é obrigatório!");
        return;
      }
  
      const formatarDataParaISO = (data) => {
        if (!data) return "";
        const [ano, mes, dia] = data.split("-");
        return `${ano}-${mes}-${dia}`;
      };
  
      const dataInicioISO = formatarDataParaISO(formValues.dataInicio);
      const prazoPrevistoISO = formatarDataParaISO(formValues.prazoPrevisto);
  
      const projetoFormatado = {
        ...formValues,
        dataInicio: dataInicioISO,
        prazoPrevisto: prazoPrevistoISO,
        dataFim: dataFim,
      };
  
      const docRef = await addDoc(collection(dbFokus360, "projetos"), projetoFormatado);
  
      alert("Projeto salvo com sucesso!");
  
      // 👉 Envia o ID para o componente pai
      if (onSaveProjectId) {
        onSaveProjectId(docRef.id);
      }
  
      // ❗️ NÃO limpa os campos aqui, para poder continuar criando diretrizes
  
    } catch (error) {
      console.error("Erro ao salvar o projeto:", error);
      alert("Erro ao salvar o projeto. Tente novamente.");
    }
  };
  
  //console.log("perfilUsuario:", perfilUsuario);
  //console.log("podeEditarDatas:", perfilUsuario?.toString().padStart(2, "0") === "08");
  
  return (
    <Box>
      {/* Você pode usar ou não Accordion por fora, mas deixei para ficar similar ao seu código */}
      <Accordion
        disableGutters
        sx={{ backgroundColor: "transparent" }}
        expanded
      >
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Nome do Projeto */}
            <TextField
              label="Nome do projeto"
              name="nome"
              value={formValues.nome}
              onChange={handleChange}
              fullWidth
            />

            {/* Linha de campos */}
            <Box display="flex" gap={2} flexWrap="wrap">
              {/* Data Início */}
              <TextField
                label="Data início"
                name="dataInicio"
                type="date"
                value={formValues.dataInicio}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                disabled={!podeEditarDatas} // 👈 Aqui é o que faltava!
                sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
              />


              {/* Prazo Previsto */}
              <TextField
                label="Prazo previsto"
                name="prazoPrevisto"
                type="date"
                value={formValues.prazoPrevisto}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                disabled={!podeEditarDatas} // 👈 Aqui também
                sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
              />


              {/* Unidade */}
              <FormControl fullWidth sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}>
                <InputLabel shrink id="label-unidade">Unidade</InputLabel>
                <Select
                  labelId="label-unidade"
                  name="unidade"
                  value={formValues.unidade}
                  onChange={handleChange}
                  displayEmpty
                  notched
                  label="Unidade"
                >
                  <MenuItem value="" disabled>
                    Selecione a unidade do projeto
                  </MenuItem>
                  <MenuItem value="BRASÍLIA">BRASÍLIA</MenuItem>
                  <MenuItem value="GOIÁS">GOIÁS</MenuItem>
                  <MenuItem value="MATOGROSSO">MATO GROSSO</MenuItem>
                  <MenuItem value="MATOGROSSODOSUL">MATO GROSSO DO SUL</MenuItem>
                  <MenuItem value="PARA">PARÁ</MenuItem>
                  <MenuItem value="TOCANTINS">TOCANTINS</MenuItem>
                </Select>
              </FormControl>

              {/* Solicitante */}
              <FormControl fullWidth sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}>
                <InputLabel shrink id="label-solicitante">Solicitante</InputLabel>
                <Select
                  labelId="label-solicitante"
                  name="solicitante"
                  value={formValues.solicitante}
                  onChange={handleChange}
                  displayEmpty
                  notched
                  label="Solicitante"
                >
                  <MenuItem value="" disabled>
                    Selecione o solicitante
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.username}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Categoria */}
              <FormControl
  fullWidth
  variant="outlined"
  sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
>
  <InputLabel id="label-categoria">Área responsável</InputLabel>
  <Select
    labelId="label-categoria"
    name="categoria"
    value={formValues.categoria}
    onChange={handleChange}
    label="Área responsável"
  >
    <MenuItem value="ADMINISTRATIVO">ADMINISTRATIVO</MenuItem>
    <MenuItem value="COMERCIAL">COMERCIAL</MenuItem>
    <MenuItem value="CONTABILIDADE">CONTABILIDADE</MenuItem>
    <MenuItem value="CONTROLADORIA">CONTROLADORIA</MenuItem>
    <MenuItem value="DEPARTAMENTOPESSOAL">DEPARTAMENTO PESSOAL</MenuItem>
    <MenuItem value="DIRETORIA">DIRETORIA</MenuItem>
    <MenuItem value="ESTRATEGIADENEGOCIOS">ESTRATÉGIA DE NEGÓCIOS</MenuItem>
    <MenuItem value="FINANCEIRO">FINANCEIRO</MenuItem>
    <MenuItem value="RECURSOSHUMANOS">RECURSOS HUMANOS</MenuItem>
    <MenuItem value="LOGISTICA">LOGÍSTICA</MenuItem>
  </Select>
</FormControl>



              {/* Colaboradores (múltipla seleção) */}
              <FormControl fullWidth sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}>
  <InputLabel shrink id="label-colaboradores">Colaboradores</InputLabel>
  <Select
    labelId="label-colaboradores"
    multiple
    name="colaboradores"
    value={formValues.colaboradores}
    onChange={handleSelectChange}
    displayEmpty
    notched
    label="Colaboradores"
    renderValue={(selected) => (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        {selected.map((id) => {
          const user = users.find((u) => u.id === id);
          return (
            <Avatar
              key={id}
              src={user?.photoURL}
              alt={user?.username}
              sx={{ width: 30, height: 30, border: "2px solid #312783" }}
            />
          );
        })}
      </Box>
    )}
  >
    <MenuItem value="" disabled>
      Selecione colaboradores
    </MenuItem>

    {users.map((user) => (
      <MenuItem key={user.id} value={user.id}>
        <Checkbox checked={formValues.colaboradores.includes(user.id)} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={user.photoURL}
            alt={user.username}
            sx={{
              bgcolor: user.photoURL ? "transparent" : "#9e9e9e",
              width: 32,
              height: 32,
              fontSize: "14px",
              border: "2px solid #312783",
            }}
            imgProps={{ referrerPolicy: "no-referrer" }}
          >
            {!user.photoURL && user.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {user.username}
          </Typography>
        </Box>
      </MenuItem>
    ))}
  </Select>
</FormControl>




              {/* Descrição do projeto */}
              <TextField
                label="Descricao do projeto"
                name="descricao"
                value={formValues.descricao}
                onChange={handleChange}
                fullWidth
              />
              {/* Descrição do projeto email */}
              <TextField
                label="E-mail do Solicitante"
                name="solicitanteEmail" // Nome associado ao estado para o e-mail do solicitante
                value={formValues.solicitanteEmail} // Valor do e-mail do solicitante
                onChange={handleChange} // Atualiza o estado ao alterar o campo
                fullWidth
              />
              <TextField
                label="E-mail dos colaboradores"
                name="colaboradorEmail" // Nome associado ao estado para o e-mail do solicitante
                value={formValues.colaboradorEmail} // Valor do e-mail do solicitante
                onChange={handleChange} // Atualiza o estado ao alterar o campo
                fullWidth
              />

              {/* Orçamento (formato monetário) */}
              <TextField
                label="Orçamento"
                name="orcamento"
                value={formValues.orcamento || ""}
                onChange={handleCurrencyChangeOrcamento}
                fullWidth
              />

                          {/* Data FInalização projeto*/}
                              <TextField
                                fullWidth
                                label="Data de finalização do projeto"
                                placeholder="dd/mm/aaaa"
                                value={dataFim}
                                onChange={(e) => formatarData(e.target.value)}
                                inputProps={{ maxLength: 10 }}
                              />
            </Box>

            <Box display="flex" justifyContent="flex-end" marginTop="20px">
              <Button
                variant="contained"
                onClick={handleUpdate}
                sx={{
                  backgroundColor: "#5f53e5",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#5f53e5",
                  },
                }}
              >
                SALVAR INFORMAÇÕES DO PROJETO
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default InformacoesPlanejamento2;