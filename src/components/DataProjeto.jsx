import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, Checkbox, CircularProgress, ListItemText, Accordion, AccordionSummary, AccordionDetails, TextField, Select, IconButton, MenuItem, Button } from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "dayjs/locale/pt-br"; // define o idioma português para dayjs
import  Header  from "../components/Header";
import DadosProjeto from "../components/DadosProjeto";
import { getFirestore, getDocs, collection, doc, getDoc, updateDoc  } from "firebase/firestore";
import { db } from "../data/firebase-config"; // Atualize o caminho conforme necessário




 // FUNÇÃO DO GRÁFICO
 const ProgressStatus = ({ checkState }) => {
  const totalFields = 8; // Número fixo de checkbox por tarefa
  const relevantKeys = Object.keys(checkState).slice(0, totalFields); // Obtém apenas as chaves relevantes (8 primeiras)
  const completedFields = relevantKeys.filter((key) => checkState[key]).length; // Conta os checkboxes marcados

  const status =
    completedFields === 0
      ? { color: "#fff", text: "Em aberto" }
      : completedFields === totalFields
      ? { color: "#98f713", text: "Finalizado" }
      : { color: "#00f6fc", text: "Em andamento" };

  return (
    <Box
      marginTop="30px"
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        justifyContent: 'center',
        maxWidth: "25%",
        marginLeft: "auto",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#5f53e5",
        transform: "scale(0.7)", // Reduz o tamanho proporcionalmente
        transformOrigin: "center", // Mantém o centro como origem para escalonamento
      }}
    >
      <CircularProgress
        variant="determinate"
        value={(completedFields / totalFields) * 100} // Progresso proporcional
        sx={{ color: status.color }}
        thickness={10}
        size={30}
      />
      <Typography
        variant="h5"
        sx={{ color: status.color, fontWeight: "bold" }}
      >
        {status.text}
      </Typography>
    </Box>
  );
};

// FIM DA FUNÇÃO DO GRÁFICO



 function DataProjeto() {
   const [users, setUsers] = useState([]);

   // Estados locais para cada campo, para manipular
   const [nomeProjeto, setNomeProjeto] = useState("");
   const [dataInicio, setDataInicio] = useState("");
   const [prazoPrevisto, setPrazoPrevisto] = useState("");
   const [descricao, setDescricao] = useState("");
   const [checkState, setCheckState] = useState({});
   const [oQue, setOque] = useState("");
   const [como, setComo] = useState("");
   const [porQue, setPorQue] = useState("");
   const [solicitante, setSolicitante] = useState({ solicitante: "" });
   const [unidade, setUnidade] = useState({ unidade: [] });
   const [categoria, setCategoria] = useState({ categoria: [] });
   const [colaboradores, setColaboradores] = useState({ colaboradores: [] });
   const [orcamento, setOrcamento] = useState({ orcamento: "" });
   const [quem, setQuem] = useState({ quem: [] });
   const [valor, setValor] = useState({ valor: "" });
   const [projectId, setProjectId] = useState("");
   const [tituloTarefa, setTituloTarefa] = useState("");
   const [quando, setQuando] = useState("");
   const [onde, setOnde] = useState("");
   const [diretrizTitulo, setDiretrizTitulo] = useState("");
   const [diretrizDescricao, setDiretrizDescricao] = useState("");
  
   // Armazenar todas as diretrizes
   const [diretrizes, setDiretrizes] = useState([]);

   // Buscar o projectId automaticamente
   useEffect(() => {
     const fetchProjectId = async () => {
       try {
         const querySnapshot = await getDocs(collection(db, "projetos"));
         if (!querySnapshot.empty) {
           const firstDoc = querySnapshot.docs[0]; // Obtém o primeiro documento
           setProjectId(firstDoc.id); // Define o projectId
         } else {
           console.error("Nenhum projeto encontrado.");
         }
       } catch (error) {
         console.error("Erro ao buscar projectId:", error);
       }
     };

     fetchProjectId();
   }, []);

   // Buscar os dados do projeto usando o projectId
   useEffect(() => {
     if (!projectId) return;

     const fetchProjectData = async () => {
       try {
         const docRef = doc(db, "projetos", projectId);
         const docSnap = await getDoc(docRef);

         if (docSnap.exists()) {
           const data = docSnap.data();

           // Atualiza os estados básicos
           setNomeProjeto(data.nome || "");
           setDataInicio(data.dataInicio || "");
           setPrazoPrevisto(data.prazoPrevisto || "");
           setUnidade({ unidade: data.unidade || "" });
           setCategoria({ categoria: data.categoria || "" });
           setSolicitante({ solicitante: data.solicitante || "" });
           setDescricao(data.descricao || "");
           setOrcamento({ orcamento: data.orcamento || "" });
           setColaboradores({ colaboradores: data.colaboradores || [] });

           // Armazena todas as diretrizes no estado
           setDiretrizes(data.diretrizes || []);
         } else {
           console.error("Documento não encontrado.");
         }
       } catch (error) {
         console.error("Erro ao buscar dados do projeto:", error);
       }
     };

     fetchProjectData();
   }, [projectId]);

   // Atualizar o estado local das diretrizes quando o usuário altera um campo
   const handleDiretrizChange = (index, field, value) => {
     const updatedDiretrizes = [...diretrizes];
     updatedDiretrizes[index][field] = value;
     setDiretrizes(updatedDiretrizes);
   };

   // Atualizar tarefas dentro de uma diretriz
   const handleTarefaChange = (
     diretrizIndex,
     tarefaIndex,
     fieldPath,
     value
   ) => {
     setDiretrizes((prevDiretrizes) => {
       const updatedDiretrizes = [...prevDiretrizes];
       const fieldKeys = fieldPath.split(".");
       let current = updatedDiretrizes[diretrizIndex].tarefas[tarefaIndex];
       for (let i = 0; i < fieldKeys.length - 1; i++) {
         current = current[fieldKeys[i]];
       }
       current[fieldKeys[fieldKeys.length - 1]] = value;
       return updatedDiretrizes;
     });
   };

   const handleChange = (event) => {
     const { name, value } = event.target;
     setUnidade((prev) => ({ ...prev, [name]: value }));
     onUpdate((prev) => ({ ...prev, [name]: value }));
   };

   const handleChangeSolicitante = (event) => {
     const { name, value } = event.target;
     setSolicitante((prev) => ({ ...prev, [name]: value }));
     //onUpdate((prev) => ({ ...prev, [name]: value }));
   };

   const handleChangeCategoria = (event) => {
     const { name, value } = event.target;
     setCategoria((prev) => ({ ...prev, [name]: value }));
     //onUpdate((prev) => ({ ...prev, [name]: value }));
   };

   const handleChangeColaboradores = (event) => {
     const { name, value } = event.target;
     setColaboradores((prev) => ({ ...prev, [name]: value }));
     //onUpdate((prev) => ({ ...prev, [name]: value }));
   };

   const handleChangeQuem = (event) => {
     const { name, value } = event.target;
     setQuem((prev) => ({ ...prev, [name]: value }));
     //onUpdate((prev) => ({ ...prev, [name]: value }));
   };

   // Função de formato monetário para o campo "orçamento"
   const handleCurrencyChange = (event) => {
     const { name, value } = event.target;
     const onlyNumbers = value.replace(/[^\d]/g, "");
     const formattedValue = new Intl.NumberFormat("pt-BR", {
       style: "currency",
       currency: "BRL",
     }).format(onlyNumbers / 100);

     setOrcamento((prev) => ({ ...prev, [name]: formattedValue }));
     onUpdate((prev) => ({
       ...prev,
       [name]: Number(onlyNumbers) / 100, // salva como número no pai
     }));
   };

   // Função de formato monetário para o campo "Valor"
   const handleCurrencyChangeValor = (event) => {
    const { name, value } = event.target;
    const onlyNumbers = value.replace(/[^\d]/g, "");
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(onlyNumbers / 100);

    setValor((prev) => ({ ...prev, [name]: formattedValue }));
    onUpdate((prev) => ({
      ...prev,
      [name]: Number(onlyNumbers) / 100, // salva como número no pai
    }));
  };

   // Função de Data - dia/mês/ano
   const handleDataChange = (value, setState) => {
     // Remove tudo que não for número
     const numericValue = value.replace(/\D/g, "");

     // Formata no padrão dd/mm/aaaa
     if (numericValue.length <= 2) {
       setState(numericValue); // Apenas o dia
     } else if (numericValue.length <= 4) {
       setState(`${numericValue.slice(0, 2)}/${numericValue.slice(2)}`); // Dia/Mês
     } else if (numericValue.length <= 8) {
       setState(
         `${numericValue.slice(0, 2)}/${numericValue.slice(
           2,
           4
         )}/${numericValue.slice(4, 8)}` // Dia/Mês/Ano
       );
     }
   };

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

   // Função para alternar o estado do checkbox
   const handleCheckChange = (key) => {
     setCheckState((prevState) => ({
       ...prevState,
       [key]: !prevState[key], // Alterna o estado do checkbox
     }));
   };

   // Renderização dos checkboxes dentro do JSX
   {
     checkState && Object.keys(checkState).length > 0 ? (
       Object.keys(checkState).map((fieldKey) => (
         <Checkbox
           key={fieldKey}
           checked={checkState[fieldKey]}
           onChange={() => handleCheckChange(fieldKey)}
         />
       ))
     ) : (
       <Typography variant="body2" color="textSecondary">
         Nenhum campo disponível para marcar.
       </Typography>
     );
   }

   // Função para salvar as alterações no Firestore
   const handleSave = async () => {
     try {
       if (!projectId) {
         alert("Projeto não encontrado!");
         return;
       }

       const updatedDiretrizes = diretrizes.map((diretriz, diretrizIndex) => ({
         ...diretriz,
         tarefas: diretriz.tarefas?.map((tarefa, tarefaIndex) => ({
           ...tarefa,
           planoDeAcao: {
             ...tarefa.planoDeAcao,
             quem: tarefa.planoDeAcao.quem || [],
           },
         })),
       }));

       const docRef = doc(db, "projetos", projectId);
       await updateDoc(docRef, {
         nome: nomeProjeto,
         dataInicio,
         prazoPrevisto,
         unidade: unidade.unidade,
         categoria: categoria.categoria,
         solicitante: solicitante.solicitante,
         descricao,
         orcamento: orcamento.orcamento,
         diretrizes: updatedDiretrizes,
       });

       alert("Dados salvos com sucesso!");
     } catch (error) {
       console.error("Erro ao salvar os dados:", error);
       alert("Erro ao salvar os dados. Tente novamente.");
     }
   };

   return (
     <>
       {/* Header */}
       <Box sx={{ marginLeft: "20px", paddingTop: "50px" }}>
         <Header
           title={
             <Box display="flex" alignItems="center" gap={1}>
               <PlayCircleFilledWhiteIcon
                 sx={{ color: "#5f53e5", fontSize: 40, marginLeft: "20px" }}
               />
               <Typography>
                 {nomeProjeto || "Nome do projeto não definido"}
               </Typography>
             </Box>
           }
         />

         {/* Componente DadosProjeto (já existente) */}
         <DadosProjeto />

         {/* Bloco cinza contendo os campos */}
         <Box
           sx={{
             padding: "30px",
             marginTop: "40px",
             backgroundColor: "#f2f0f0",
           }}
         >












           {/* Seção: ADICIONAR INFORMAÇÕES DO PROJETO */}












           <Box mb={3} sx={{ marginBottom: "50px" }}>
             <Box display="flex" alignItems="center" mb={2}>
               <PlayCircleFilledWhiteIcon
                 sx={{ color: "#22d3ee", fontSize: 25, marginRight: 1 }}
               />
               <Typography variant="h6">INFORMAÇÕES DO PROJETO</Typography>
             </Box>

             <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
               <TextField
                 fullWidth
                 label="Nome do projeto"
                 placeholder="Nome do projeto"
                 value={nomeProjeto}
                 onChange={(e) => setNomeProjeto(e.target.value)}
               />

               {/* Campos de datas e selects num row flex */}
               <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                 {/* Data Início */}
                 <TextField
                   fullWidth
                   label="Data início"
                   placeholder="dd/mm/aaaa"
                   value={dataInicio}
                   onChange={(e) =>
                     handleDataChange(e.target.value, setDataInicio)
                   }
                   inputProps={{ maxLength: 10 }} // Limita o número de caracteres
                 />
                 {/* Prazo Previsto */}
                 <TextField
                   fullWidth
                   label="Prazo previsto"
                   placeholder="dd/mm/aaaa"
                   value={prazoPrevisto}
                   onChange={(e) =>
                     handleDataChange(e.target.value, setPrazoPrevisto)
                   }
                   inputProps={{ maxLength: 10 }} // Limita o número de caracteres
                 />

                 {/* Selecione a unidade do projeto */}
                 <Select
                   name="unidade"
                   value={unidade.unidade}
                   onChange={(e) => setUnidade({ unidade: e.target.value })}
                   displayEmpty
                   sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
                 >
                   <MenuItem value="" disabled>
                     Unidade do projeto
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
               </Box>

               {/*  solicitante, categoria, colaboradores */}
               <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                 {/* solicitante */}
                 <Select
                   name="solicitante"
                   value={solicitante.solicitante}
                   onChange={handleChangeSolicitante}
                   displayEmpty
                   sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
                 >
                   <MenuItem value="">Solicitante do projeto</MenuItem>
                   {users.map((user) => (
                     <MenuItem key={user.id} value={user.username}>
                       {user.username}
                     </MenuItem>
                   ))}
                 </Select>

                 {/* categoria */}
                 <Select
                   name="categoria"
                   value={categoria.categoria}
                   onChange={handleChangeCategoria}
                   displayEmpty
                   sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
                 >
                   <MenuItem value="" disabled>
                     Categoria do projeto
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

                 {/* colaboradores */}
                 <Select
                   multiple
                   name="colaboradores"
                   value={colaboradores.colaboradores || []}
                   onChange={handleChangeColaboradores}
                   displayEmpty
                   sx={{ flex: "1 1 calc(33.33% - 16px)", minWidth: "200px" }}
                   renderValue={(selected) =>
                     selected.length === 0
                       ? "Colaboradores do projeto"
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
                         checked={colaboradores.colaboradores.includes(user.id)}
                       />
                       <ListItemText primary={user.username} />
                     </MenuItem>
                   ))}
                 </Select>
               </Box>

               <TextField
                 fullWidth
                 label="Descricao do projeto"
                 placeholder="Descricao do projeto"
                 multiline
                 rows={2}
                 value={descricao}
                 onChange={(e) => setDescricao(e.target.value)}
               />
               <TextField
                 label="Orçamento"
                 name="orcamento"
                 value={orcamento.orcamento}
                 onChange={handleCurrencyChange}
                 fullWidth
               />
             </Box>
           </Box>









           {/* Seção: DIRETRIZES DO PROJETO */}












           <Box>
             <Box display="flex" alignItems="center" mb={1}>
               <PlayCircleFilledWhiteIcon
                 sx={{ color: "#5f53e5", fontSize: 25, marginRight: 1 }}
               />
               <Typography variant="h6">DIRETRIZES DO PROJETO</Typography>
             </Box>

             {/* lista de diretrizes adicionadas  */}

             <Box sx={{ marginTop: 2 }}>
               {diretrizes.map((diretriz, diretrizIndex) => (
                 <Accordion
                   key={diretrizIndex}
                   disableGutters
                   sx={{
                     backgroundColor: "transparent",
                     borderRadius: "8px",
                     boxShadow: "none",
                     marginBottom: "10px",
                   }}
                 >
                   {/* Cabeçalho roxo */}
                   <AccordionSummary
                     expandIcon={<ExpandMoreIcon sx={{ color: "#b7b7b7" }} />}
                     sx={{
                       borderRadius: "8px",
                       backgroundColor: "#5f53e5",
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "space-between",
                       boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                     }}
                   >
                     {/* Título e descrição da diretriz */}
                     <Box sx={{ flex: 1, textAlign: "left" }}>
                       <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                         {diretriz.descricao || "Descrição não definida"}
                       </Typography>
                       <Typography sx={{ color: "#d6d6d6", fontSize: "0.9em" }}>
                         {diretriz.descricao || "Descrição não definida"}
                       </Typography>
                     </Box>
                     {/* Campo de Valor */}
                     <Typography
                       sx={{
                         color: "#d6d6d6",
                         fontSize: "1.2em",
                         alignContent: "center",
                         marginRight: "10px",
                       }}
                     >
                       Valor gasto:
                     </Typography>
                     <Typography
                       sx={{
                         color: "#00f6fc",
                         fontWeight: "bold",
                         fontSize: "1.2em",
                         alignContent: "center",
                         marginRight: "60px",
                       }}
                     >
                       {valor.valor || "R$ 0,00"}
                     </Typography> 
                   </AccordionSummary>

















                   {/* Ao expandir, mostra o campo "Digite uma tarefa..." e os 5W2H */}












                       {/* Progresso  */}
                       <ProgressStatus checkState={checkState} /> 
                     



                   <AccordionDetails>
                     {/* Campo para adicionar tarefa */}
                     {diretriz.tarefas?.map((tarefa, tarefaIndex) => {
                       // Gerar o estado filtrado dos checkboxes relacionados à tarefa
                       const tarefaCheckState = Object.keys(checkState)
                         .filter((key) =>
                           key.startsWith(
                             `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}`
                           )
                         )
                         .reduce((acc, key) => {
                           acc[key] = checkState[key];
                           return acc;
                         }, {}); // Verifique se as chaves ou vírgulas estão corretas aqui.

                       return (
                         <Box key={tarefaIndex} sx={{ marginBottom: "20px" }}>

                           {/* Input Tarefa */}
                           <Box
                             sx={{
                               display: "flex",
                               gap: 1,
                               marginBottom: "20px",
                             }}
                           >
                             <TextField
                               label="Tarefa"
                               fullWidth
                               value={tarefa.tituloTarefa || ""}
                               onChange={(e) =>
                                 handleTarefaChange(
                                   diretrizIndex,
                                   tarefaIndex,
                                   "tituloTarefa",
                                   e.target.value
                                 )
                               }
                               sx={{
                                 marginTop: "20px",
                                 "& .MuiOutlinedInput-root": {
                                   "& fieldset": {
                                     borderColor: "#5f54e7", // Define a cor da borda
                                     borderWidth: "3px", // Espessura da borda
                                   },
                                   "&:hover fieldset": {
                                     borderColor: "#5f54e7", // Cor da borda ao passar o mouse
                                     borderWidth: "2px", // Espessura da borda ao passar o mouse
                                   },
                                   "&.Mui-focused fieldset": {
                                     borderColor: "#5f54e7", // Cor da borda ao focar
                                     borderWidth: "3px", // Espessura da borda ao focar
                                   },
                                 },
                               }}
                             />
                             <Checkbox
                               checked={
                                 checkState[
                                   `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}`
                                 ] || false
                               }
                               onChange={() =>
                                 handleCheckChange(
                                   `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}`
                                 )
                               }
                             />
                           </Box>











                           {/* Seção: Plano de Ação (5W2H) */}












                           
                           <Box
                             display="flex"
                             alignItems="center"
                             mb={1}
                             sx={{ marginBottom: "40px", marginTop: "40px" }}
                           >
                             <PlayCircleFilledWhiteIcon
                               sx={{
                                 color: "#5f53e5",
                                 fontSize: 25,
                                 marginRight: 1,
                               }}
                             />
                             <Typography variant="h6">
                               Plano de Ação (5W2H)
                             </Typography>
                           </Box>

                           {/* Campos 5W2H com Checkboxes */}
                           <Box
                             sx={{
                               display: "flex",
                               flexDirection: "column",
                               gap: 2,
                             }}
                           >
                             {/* Campo O que? */}
                             <Box
                               sx={{
                                 display: "flex",
                                 gap: 1,
                                 alignItems: "center",
                               }}
                             >
                               <TextField
                                 label="O que?"
                                 fullWidth
                                 value={tarefa.planoDeAcao?.oQue || ""}
                                 onChange={(e) =>
                                   handleTarefaChange(
                                     diretrizIndex,
                                     tarefaIndex,
                                     "planoDeAcao.oQue",
                                     e.target.value
                                   )
                                 }
                               />
                               <Checkbox
                                 checked={
                                   checkState[
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-oque`
                                   ] || false
                                 }
                                 onChange={() =>
                                   handleCheckChange(
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-oque`
                                   )
                                 }
                               />
                             </Box>

                             {/* Campo Por que? */}
                             <Box
                               sx={{
                                 display: "flex",
                                 gap: 1,
                                 alignItems: "center",
                               }}
                             >
                               <TextField
                                 label="Por que?"
                                 fullWidth
                                 value={tarefa.planoDeAcao?.porQue || ""}
                                 onChange={(e) =>
                                   handleTarefaChange(
                                     diretrizIndex,
                                     tarefaIndex,
                                     "planoDeAcao.porQue",
                                     e.target.value
                                   )
                                 }
                               />
                               <Checkbox
                                 checked={
                                   checkState[
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-porque`
                                   ] || false
                                 }
                                 onChange={() =>
                                   handleCheckChange(
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-porque`
                                   )
                                 }
                               />
                             </Box>
                             <Box
                               sx={{
                                 display: "flex",
                                 gap: 1,
                                 alignItems: "center",
                               }}
                             >
                               <Select
                                 multiple
                                 name="quem"
                                 value={tarefa.planoDeAcao?.quem || []} // Conectado ao campo correto da tarefa
                                 onChange={(e) =>
                                   handleTarefaChange(
                                     diretrizIndex,
                                     tarefaIndex,
                                     "planoDeAcao.quem",
                                     e.target.value
                                   )
                                 }
                                 displayEmpty
                                 sx={{
                                   flex: "1 1 calc(33.33% - 16px)",
                                   minWidth: "200px",
                                 }}
                                 renderValue={(selected) =>
                                   selected.length === 0
                                     ? "Selecione responsáveis"
                                     : selected
                                         .map(
                                           (id) =>
                                             users.find(
                                               (user) => user.id === id
                                             )?.username || "Desconhecido"
                                         )
                                         .join(", ")
                                 }
                               >
                                 {users.map((user) => (
                                   <MenuItem key={user.id} value={user.id}>
                                     {/* Checkbox para seleção */}
                                     <Checkbox
                                       checked={
                                         tarefa.planoDeAcao?.quem?.includes(
                                           user.id
                                         ) || false
                                       } // Verifica corretamente se o ID está na lista
                                       onChange={() =>
                                         handleCheckChange(
                                           `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-quem-${user.id}`
                                         )
                                       }
                                     />
                                     {/* Nome do usuário */}
                                     <ListItemText primary={user.username} />
                                   </MenuItem>
                                 ))}
                               </Select>
                               <Checkbox
                                 checked={
                                   checkState[
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-quem`
                                   ] || false
                                 }
                                 onChange={() =>
                                   handleCheckChange(
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-quem`
                                   )
                                 }
                               />
                             </Box>

                             {/* Campo Quando? */}
                             <Box
                               sx={{
                                 display: "flex",
                                 gap: 1,
                                 alignItems: "center",
                               }}
                             >
                               <TextField
                                 label="Quando?"
                                 fullWidth
                                 value={tarefa.planoDeAcao?.quando || ""}
                                 onChange={(e) =>
                                   handleTarefaChange(
                                     diretrizIndex,
                                     tarefaIndex,
                                     "planoDeAcao.quando",
                                     e.target.value
                                   )
                                 }
                               />
                               <Checkbox
                                 checked={
                                   checkState[
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-quando`
                                   ] || false
                                 }
                                 onChange={() =>
                                   handleCheckChange(
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-quando`
                                   )
                                 }
                               />
                             </Box>

                             {/* Campo Onde? */}
                             <Box
                               sx={{
                                 display: "flex",
                                 gap: 1,
                                 alignItems: "center",
                               }}
                             >
                               <TextField
                                 label="Onde?"
                                 fullWidth
                                 value={tarefa.planoDeAcao?.onde || ""}
                                 onChange={(e) =>
                                   handleTarefaChange(
                                     diretrizIndex,
                                     tarefaIndex,
                                     "planoDeAcao.onde",
                                     e.target.value
                                   )
                                 }
                               />
                               <Checkbox
                                 checked={
                                   checkState[
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-onde`
                                   ] || false
                                 }
                                 onChange={() =>
                                   handleCheckChange(
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-onde`
                                   )
                                 }
                               />
                             </Box>

                             {/* Campo Como? */}
                             <Box
                               sx={{
                                 display: "flex",
                                 gap: 1,
                                 alignItems: "center",
                               }}
                             >
                               <TextField
                                 label="Como?"
                                 fullWidth
                                 value={tarefa.planoDeAcao?.como || ""}
                                 onChange={(e) =>
                                   handleTarefaChange(
                                     diretrizIndex,
                                     tarefaIndex,
                                     "planoDeAcao.como",
                                     e.target.value
                                   )
                                 }
                               />
                               <Checkbox
                                 checked={
                                   checkState[
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-como`
                                   ] || false
                                 }
                                 onChange={() =>
                                   handleCheckChange(
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-como`
                                   )
                                 }
                               />
                             </Box>

                             {/* Campo Valor */}
                             <Box
                               sx={{
                                 display: "flex",
                                 gap: 1,
                                 alignItems: "center",
                               }}
                             >
                               <TextField
                                 label="Valor"
                                 fullWidth
                                 value={tarefa.planoDeAcao?.valor || ""}
                                 onChange={(e) => {
                                   const rawValue = e.target.value; // Valor bruto do input
                                   const onlyNumbers = rawValue.replace(
                                     /[^\d]/g,
                                     ""
                                   ); // Remove caracteres não numéricos
                                   const formattedValue = new Intl.NumberFormat(
                                     "pt-BR",
                                     {
                                       style: "currency",
                                       currency: "BRL",
                                     }
                                   ).format(Number(onlyNumbers) / 100); // Formata como moeda

                                   handleTarefaChange(
                                     diretrizIndex,
                                     tarefaIndex,
                                     "planoDeAcao.valor",
                                     formattedValue // Passa o valor formatado
                                   );
                                 }}
                               />
                               <Checkbox
                                 checked={
                                   checkState[
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-valor`
                                   ] || false
                                 }
                                 onChange={() =>
                                   handleCheckChange(
                                     `diretriz-${diretrizIndex}-tarefa-${tarefaIndex}-valor`
                                   )
                                 }
                               />
                             </Box>
                           </Box>
                         </Box>
                       );
                     })}
                   </AccordionDetails>
                 </Accordion>
               ))}












               {/*  BOTÃO SALVAR ALTERAÇÕES   */}














               <Box
                 sx={{
                   display: "flex",
                   justifyContent: "flex-end",
                   marginTop: 5,
                 }}
               >
                 <Button
                   variant="contained"
                   color="primary"
                   onClick={handleSave}
                   sx={{
                     backgroundColor: "#5f54e7",
                     fontSize: "10px",
                     fontWeight: "bold",
                     borderRadius: "5px",
                     padding: "10px 20px",
                     boxShadow: "none",
                     "&:hover": { backgroundColor: "#3f2cb2" },
                   }}
                 >
                   Salvar Alterações
                 </Button>
               </Box>
             </Box>
           </Box>
         </Box>
       </Box>
     </>
   );
 }

 export default DataProjeto;