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
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";

/**
 *  InformacoesProjeto
 *
 *  Recebe:
 *    - onUpdate( (prev) => ({ ...prev, ... }) ) => para atualizar no pai
 */
const InformacoesProjeto = ({ onUpdate, LimpaEstado }) => {
  const [users, setUsers] = useState([]);

  const [formValues, setFormValues] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    prazoPrevisto: "",
    unidade: "",
    solicitante: "",
    categoria: "",
    colaboradores: [],
    responsavel: "",
    orcamento: "",
  });

  // Carregar usuários do Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "user"));
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

  // Monitorando a mensagem para limpar os inputs
  useEffect(() => {
    if (LimpaEstado) {
      setFormValues({
        nome: "",
        descricao: "",
        dataInicio: "",
        prazoPrevisto: "",
        unidade: "",
        solicitante: "",
        categoria: "",
        colaboradores: [],
        responsavel: "",
        orcamento: "",
      });
    }
  }, [LimpaEstado]);

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
      // Validações básicas
      if (!formValues.nome) {
        alert("O nome do projeto é obrigatório!");
        return;
      }

      // Converte datas para o formato ISO (yyyy-MM-dd)
      const formatarDataParaISO = (data) => {
        if (!data) return "";
        const [ano, mes, dia] = data.split("-"); // Ajuste para tratar o input tipo "date"
        return `${ano}-${mes}-${dia}`;
      };

      const dataInicioISO = formatarDataParaISO(formValues.dataInicio);
      const prazoPrevistoISO = formatarDataParaISO(formValues.prazoPrevisto);

      // Atualiza os valores formatados
      const projetoFormatado = {
        ...formValues,
        dataInicio: dataInicioISO,
        prazoPrevisto: prazoPrevistoISO,
      };

      // Salva no Firestore
      const db = getFirestore();
      await addDoc(collection(db, "projetos"), projetoFormatado);

      alert("Projeto salvo com sucesso!");
      setFormValues({
        nome: "",
        descricao: "",
        dataInicio: "",
        prazoPrevisto: "",
        unidade: "",
        solicitante: "",
        categoria: "",
        colaboradores: [],
        responsavel: "",
        orcamento: "",
      });
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
                value={formValues.colaboradores || []}
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

              {/* Orçamento (formato monetário) */}
              <TextField
                label="Orçamento"
                name="orcamento"
                value={formValues.orcamento || ""}
                onChange={handleCurrencyChangeOrcamento}
                fullWidth
              />
            </Box>

           
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default InformacoesProjeto;