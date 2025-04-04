import React, { useState, useEffect } from "react";
import { Box, Checkbox, TextField, ListItemText, Select, MenuItem, Accordion, AccordionDetails } from "@mui/material";
import { getFirestore, getDocs, collection } from "firebase/firestore";

const Diretriz = ({ onUpdate }) => {
  const [users, setUsers] = useState([]);
  const [formValues, setFormValues] = useState({
    diretrizNome: "",
    descricaoDiretriz: "",
    colaboradores: [],
    oque: "",
    porque: "",
    quem: [],
    quando: "",
    onde: "",
    como: "",
    valor: "",
  });

  // Carregar Usuários do Firebase
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

  // Manipular mudanças gerais (TextField e Select)
const handleChange = (event) => {
  const { name, value } = event.target;

  setFormValues((prev) => ({
    ...prev,
    [name]: value,
  }));

  onUpdate((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  // Manipular seleção múltipla (Colaboradores)
const handleSelectChange = (event) => {
  const { name, value } = event.target;

  setFormValues((prev) => ({
    ...prev,
    [name]: value,
  }));

  onUpdate((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  // Manipular Orçamento com Formato Monetário
  const handleCurrencyChange = (event) => {
    const { name, value } = event.target;
    const onlyNumbers = value.replace(/[^\d]/g, ""); // Remove não numéricos
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(onlyNumbers / 100); // Formata como moeda

    setFormValues((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    onUpdate((prev) => ({
      ...prev,
      [name]: Number(onlyNumbers) / 100, // Salva como número no estado global
    }));
  };

  // Log para Depuração
  useEffect(() => {
    console.log("Estado Local Atualizado:", formValues);
  }, [formValues]);

  

  return (
    <>
      <Box>
        <Accordion disableGutters sx={{ backgroundColor: "transparent" }}>
          <AccordionDetails>
            <Box component="form" display="flex" flexDirection="column" gap={2}>
              {/* Nome do Projeto */}
              <TextField
                label="Nome da Diretriz"
                name="diretrizNome"
                value={formValues.diretrizNome}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="O que"
                name="oque"
                value={formValues.oque}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Por que"
                name="porque"
                value={formValues.porque}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Quando"
                name="quando"
                value={formValues.quando}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Onde"
                name="onde"
                value={formValues.onde}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Como"
                name="como"
                value={formValues.como}
                onChange={handleChange}
                fullWidth
              />

              {/* Datas e Selects */}
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
                  <MenuItem value="MATOGROSSODOSUL">
                    MATO GROSSO DO SUL
                  </MenuItem>
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
                  <MenuItem value="CONTROLADORIA">CONTROLADORIA</MenuItem>
                  <MenuItem value="LOGISTICA">LOGÍSTICA</MenuItem>
                </Select>

                {/* Colaboradores */}
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

                {/* Descrição */}
                <TextField
                  label="Descricao da Diretriz"
                  name="descricaoDiretriz"
                  value={formValues.descricaoDiretriz}
                  onChange={handleChange}
                  fullWidth
                />
                {/* Orçamento */}
                <TextField
                  label="Orçamento"
                  name="valor"
                  value={formValues.valor}
                  onChange={handleCurrencyChange}
                  fullWidth
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default Diretriz;
