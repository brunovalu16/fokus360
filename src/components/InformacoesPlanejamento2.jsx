import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  TextField,
  ListItemText,
  Select,
  MenuItem,
  Accordion,
  AccordionDetails,
  Button,
} from "@mui/material";
import { dbFokus360 } from "../data/firebase-config"; // ✅ Usa a instância correta
import { getDocs, collection, addDoc, doc, setDoc, updateDoc   } from "firebase/firestore";
import { getApps } from "firebase/app";
console.log("Apps Inicializados:", getApps()); // ✅ Deve exibir os apps carregados



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

  const [showAlert, setShowAlert] = useState(false);
  const [mensagem, setMensagem] = useState(false);


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
  }
}, [projetoData]);




 //Função para adicionar projetos
 const handleAdicionarProjeto = async () => {
  try {
    if (!formValues.nome.trim()) {
      alert("O nome do projeto é obrigatório!");
      return;
    }

    // Montar estrutura em ÁRVORE
    const projetoData = {
      nome: formValues.nome,
      descricao: formValues.descricao,
      dataInicio: formValues.dataInicio,
      prazoPrevisto: formValues.prazoPrevisto,
      unidade: formValues.unidade,
      solicitante: formValues.solicitante,
      solicitanteEmail: formValues.solicitanteEmail,
      colaboradorEmail: formValues.colaboradorEmail,
      categoria: formValues.categoria,
      colaboradores: formValues.colaboradores,
      orcamento: formValues.orcamento,
      createdAt: new Date(),
      diretrizes: (formValues.estrategicas || []).map((estrategica) => ({
        id: estrategica.id?.toString() || Date.now().toString(),
        titulo: estrategica.titulo || "",
        descricao: estrategica.descricao || "",
        emails: estrategica.emails || [],
        areas: formValues.areasResponsaveis || [],
        unidade: formValues.unidade,
        taticas: (estrategica.taticas || []).map((tatica) => ({
          id: tatica.id?.toString() || Date.now().toString(),
          titulo: tatica.titulo || "",
          descricao: tatica.descricao || "",
          emails: tatica.emails || [],
          areas: formValues.areastaticasSelecionadas || [],
          unidade: formValues.unidade,
          operacionais: (tatica.operacionais || []).map((operacional) => ({
            id: operacional.id?.toString() || Date.now().toString(),
            titulo: operacional.titulo || "",
            descricao: operacional.descricao || "",
            emails: operacional.emails || [],
            areas: formValues.areasoperacionalSelecionadas || [],
            unidade: formValues.unidade,
            tarefas: (operacional.tarefas || []).map((tarefa) => ({
              id: tarefa.id?.toString() || Date.now().toString(),
              tituloTarefa: tarefa.tituloTarefa || "",
              planoDeAcao: {
                oQue: tarefa.planoDeAcao?.oQue || "",
                porQue: tarefa.planoDeAcao?.porQue || "",
                quem: tarefa.planoDeAcao?.quem || [],
                quemEmail: tarefa.planoDeAcao?.quemEmail || [],
                quando: tarefa.planoDeAcao?.quando || "",
                onde: tarefa.planoDeAcao?.onde || "",
                como: tarefa.planoDeAcao?.como || "",
                valor: tarefa.planoDeAcao?.valor || "",
              },
            })),
          })),
        })),
      })),
    };

    // Salvar no Firestore
    if (projetoData?.id) {
      const projetoRef = doc(dbFokus360, "projetos", projetoData.id);
      await updateDoc(projetoRef, projetoData);
    } else {
      const projetoRef = doc(collection(dbFokus360, "projetos"));
      await setDoc(projetoRef, projetoData);
    }
    

    // ---------------------------
    // Enviar E-MAILS + NOTIFICAÇÕES
    // ---------------------------
    let emailsToNotify = [];

    if (formValues.colaboradorEmail) {
      const colaboradores = formValues.colaboradorEmail.split(/[,;]/).map(e => e.trim());
      emailsToNotify = [...emailsToNotify, ...colaboradores];
    }

    (formValues.estrategicas || []).forEach(estrategica => {
      (estrategica.taticas || []).forEach(tatica => {
        (tatica.operacionais || []).forEach(op => {
          (op.tarefas || []).forEach(tarefa => {
            if (tarefa.planoDeAcao?.quemEmail) {
              const responsaveis = tarefa.planoDeAcao.quemEmail.split(/[,;]/).map(e => e.trim());
              emailsToNotify = [...emailsToNotify, ...responsaveis];
            }
          });
        });
      });
    });

    emailsToNotify = [...new Set(emailsToNotify.filter(email => email))];

    if (emailsToNotify.length > 0) {
      await fetch('https://fokus360-backend.vercel.app/send-project-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: emailsToNotify,
          tituloProjeto: formValues.nome,
          descricaoProjeto: formValues.descricao,
        }),
      });

      await fetch('https://fokus360-backend.vercel.app/send-project-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: formValues.colaboradores,
          mensagem: `Você foi adicionado ao projeto: ${formValues.nome}`,
        }),
      });
    }

    setShowAlert(true);
    setMensagem(true);
    console.log("✅ Projeto adicionado no formato ÁRVORE!");

  } catch (error) {
    console.error("❌ Erro ao adicionar projeto:", error.message);
    alert("Erro ao adicionar projeto. Tente novamente.");
  }
};

  
  


  

  // Carregar usuários do Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        
        const querySnapshot = await getDocs(collection(dbFokus360, "user")); // ✅ Agora está correto

        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          username: doc.data().username,
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
    fetchUsers();
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
                sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
              />

              {/* Unidade */}
              <Select
                name="unidade"
                value={formValues.unidade}
                onChange={handleChange}
                displayEmpty
                sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
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

              {/* Solicitante */}
              <Select
                name="solicitante"
                value={formValues.solicitante}
                onChange={handleChange}
                displayEmpty
                sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
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

              {/* Categoria */}
              <Select
                name="categoria"
                value={formValues.categoria}
                onChange={handleChange}
                displayEmpty
                sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
              >
                <MenuItem value="" disabled>
                  Selecione uma categoria
                </MenuItem>
                <MenuItem value="ADMINISTRATIVO">ADMINISTRATIVO</MenuItem>
                <MenuItem value="COMERCIAL">COMERCIAL</MenuItem>
                <MenuItem value="CONTABILIDADE">CONTABILIDADE</MenuItem>
                <MenuItem value="CONTROLADORIA">CONTROLADORIA</MenuItem>
                <MenuItem value="DEPARTAMENTOPESSOAL">
                  DEPARTAMENTO PESSOAL
                </MenuItem>
                <MenuItem value="DIRETORIA">DIRETORIA</MenuItem>
                <MenuItem value="ESTRATEGIADENEGOCIOS">
                  ESTRATÉGIA DE NEGÓCIOS
                </MenuItem>
                <MenuItem value="FINANCEIRO">FINANCEIRO</MenuItem>
                <MenuItem value="RECURSOSHUMANOS">RECURSOS HUMANOS</MenuItem>
                <MenuItem value="LOGISTICA">LOGÍSTICA</MenuItem>
              </Select>

              {/* Colaboradores (múltipla seleção) */}
              <Select
                multiple
                name="colaboradores"
                value={formValues.colaboradores}
                onChange={handleSelectChange}
                displayEmpty
                sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
                renderValue={(selected) =>
                  selected.length === 0
                    ? "Selecione colaboradores"
                    : selected
                        .map(
                          (id) =>
                            users.find((user) => user.id === id)?.username ||
                            "Desconhecido"
                        )
                        .join(", ")
                }
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox
                      checked={formValues.colaboradores.includes(user.id)}
                    />
                    <ListItemText primary={user.username} />
                  </MenuItem>
                ))}
              </Select>

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
            </Box>

            <Box display="flex" justifyContent="flex-end" marginTop="20px">
              <Button
                onClick={handleAdicionarProjeto}
                variant="contained"
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