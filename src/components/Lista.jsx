import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { db } from "../data/firebase-config"; // Atualize o caminho conforme necessário
import Alert from '@mui/material/Alert';
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { getDocs, getDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { Margin } from "@mui/icons-material";


// Tradução dos textos da Toolbar e rodapé
const localeText = {
  toolbarColumns: "Colunas",
  toolbarFilters: "Filtros",
  toolbarDensity: "Densidade",
  toolbarExport: "Exportar",
  footerRowSelected: (count) => (count === 1 ? `` : ``),
  footerTotalRows: "Linhas totais:",
  footerPaginationRowsPerPage: "Linhas por página:",
};

// Barra de ferramentas personalizada
const CustomToolbar = () => (
  <GridToolbarContainer
  sx={{
    padding: "8px",
    borderRadius: "5px",
    backgroundColor: "#f4f6f8",
    marginBottom: "10px",
    overflow: "visible", // Garante que o conteúdo extrapole os limites do contêiner
    position: "relative", // Define o contexto posicional
    zIndex: 1, // Eleva o contêiner para evitar sobreposição de outros elementos
  }}
>
  <GridToolbarColumnsButton
    sx={{
      color: "#727681",
      "&:hover": { color: "#3f51b5" },
      zIndex: 2, // Garante que o botão fique acima de outros elementos
    }}
  />
  <GridToolbarFilterButton
  sx={{
    paddingTop: "10px",
    color: "#727681",
    "&:hover": { color: "#3f51b5" },
    overflow: "visible", // Garante que o conteúdo extrapole
    position: "relative", // Contexto posicional para o tooltip
  }}
/>

  <GridToolbarExport
    sx={{
      color: "#727681",
      "&:hover": { color: "#3f51b5" },
      zIndex: 2, // Eleva o botão exportar também
    }}
  />
</GridToolbarContainer>
);

const Lista = ({ filtroSolicitante, filtroColaborador, filtroQuem, setFiltroSolicitante, setFiltroColaborador, setFiltroQuem }) => {
  const [dadosColaboradores, setDadosColaboradores] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [projetosExibidos, setProjetosExibidos] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState(null); // Filtro para os projetos
  const [checkedRows, setCheckedRows] = useState({});
  const [projetoListe, setProjetoList] = useState([]);
  const [confirmAlert, setConfirmAlert] = useState({
    show: false,
    projetoId: null,
    message: "",
    severity: "success", // ou "error" dependendo do caso
  });

  //console.log("Valor de filtroQuem:", filtroQuem);

  
  

// Função para resetar os filtros
const handleLimparFiltros = () => {
  setFiltroSolicitante(null);
  setFiltroColaborador(null);
  setFiltroQuem(null);
};

// Atualiza os projetos exibidos com base nos filtros
useEffect(() => {
  if (!projetos.length) {
    // Se não houver projetos, não tente filtrar
    setProjetosExibidos([]);
    return;
  }

  let exibidos = [...projetos];

  if (filtroColaborador && filtroSolicitante && filtroQuem) {
    exibidos = exibidos.filter(
      (proj) =>
        Array.isArray(proj.colaboradores) &&
        proj.colaboradores.includes(filtroColaborador) &&
        proj.solicitante === filtroSolicitante &&
        Array.isArray(proj.quem) &&
        proj.quem.includes(filtroQuem)
    );
  } else if (filtroColaborador && filtroSolicitante) {
    exibidos = exibidos.filter(
      (proj) =>
        Array.isArray(proj.colaboradores) &&
        proj.colaboradores.includes(filtroColaborador) &&
        proj.solicitante === filtroSolicitante
    );
  } else if (filtroColaborador) {
    exibidos = exibidos.filter(
      (proj) =>
        Array.isArray(proj.colaboradores) &&
        proj.colaboradores.includes(filtroColaborador)
    );
  } else if (filtroSolicitante) {
    exibidos = exibidos.filter((proj) => proj.solicitante === filtroSolicitante);
  } else if (filtroQuem) {
    exibidos = exibidos.filter(
      (proj) => Array.isArray(proj.quem) && proj.quem.includes(filtroQuem)
    );
  }

  setProjetosExibidos(exibidos);
}, [filtroColaborador, filtroSolicitante, filtroQuem, projetos]);






//função para deletar o projeto


  const handleDeleteProjeto = async () => {
   
  
    if (!confirmAlert.projetoId) {
      
      return;
    }
  
    try {
      const projetoRef = doc(db, "projetos", confirmAlert.projetoId);
      await deleteDoc(projetoRef);
  
      //console.log(`Projeto ${confirmAlert.projetoId} deletado com sucesso!`);
  
      fetchProjetos();
      setConfirmAlert({ show: false, projetoId: null });
    } catch (error) {
      //console.error("Erro ao deletar o projeto:", error.message);
    }
  };
  
  
  
 

  

  

  const handleCheckboxChange = (id, isChecked) =>
    setCheckedRows((prev) => ({ ...prev, [id]: isChecked }));

  const columns = [
    {
      field: "nome",
      headerName: "Nome do projeto",
      flex: 1.1,
    },
    {
      field: "solicitante",
      headerName: "Solicitante",
      flex: 1,
    },
    {
      field: "dataInicio",
      headerName: "Data Início",
      flex: 0.8,
      renderCell: (params) => {
        const parseDate = (dateString) => {
          if (!dateString || typeof dateString !== "string") return null;
    
          // Verifica o formato da data e ajusta para Date
          if (dateString.includes("/")) {
            const [day, month, year] = dateString.split("/").map(Number);
            return new Date(year, month - 1, day);
          } else if (dateString.includes("-")) {
            const [year, month, day] = dateString.split("-").map(Number);
            return new Date(year, month - 1, day);
          }
          return null;
        };
    
        const dataInicio = parseDate(params.row.dataInicio);
    
        return (
          <Box>
            {dataInicio
              ? dataInicio.toLocaleDateString("pt-BR", { timeZone: "UTC" })
              : "Data inválida"}
          </Box>
        );
      },
    },
    {
      field: "dataFim",
      headerName: "Projeto finalizado",
      flex: 0.8,
      renderCell: (params) => {
        const parseDate = (dateString) => {
          if (!dateString || typeof dateString !== "string") return null;
    
          // Verifica e formata a data para UTC
          if (dateString.includes("/")) {
            const [day, month, year] = dateString.split("/").map(Number);
            return new Date(Date.UTC(year, month - 1, day)); // Formato brasileiro ajustado para UTC
          } else if (dateString.includes("-")) {
            const [year, month, day] = dateString.split("-").map(Number);
            return new Date(Date.UTC(year, month - 1, day)); // Formato ISO ajustado para UTC
          }
          return null;
        };
    
        let dataFim = null;
        let prazoPrevisto = null;
        let backgroundColor = "#4CAF50"; // Verde por padrão
    
        try {
          // Parseia as datas no formato UTC
          dataFim = parseDate(params.row.dataFim);
          prazoPrevisto = parseDate(params.row.prazoPrevisto);
    
          if (!dataFim || isNaN(dataFim.getTime())) {
            throw new Error("DataFim inválida");
          }
    
          if (!prazoPrevisto || isNaN(prazoPrevisto.getTime())) {
            throw new Error("PrazoPrevisto inválido");
          }
    
          // Comparação apenas de datas (ignora horário)
          if (dataFim.getTime() === prazoPrevisto.getTime()) {
            backgroundColor = "#3f51b5"; // Azul (datas iguais)
          } else if (dataFim > prazoPrevisto) {
            backgroundColor = "#f44336"; // Vermelho (dataFim ultrapassou prazoPrevisto)
          } else if (
            (prazoPrevisto - dataFim) / (1000 * 60 * 60 * 24) <= 4
          ) {
            backgroundColor = "#FFC107"; // Amarelo (prazo próximo de expirar)
          }
        } catch (error) {
          
        }
    
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "bold",
            }}
          >
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor,
              }}
            />
            {dataFim
              ? dataFim.toLocaleDateString("pt-BR", { timeZone: "UTC" })
              : "Em andamento"}
          </Box>
        );
      },
    },
    
    {
      field: "prazoPrevisto",
      headerName: "Prazo previsto",
      flex: 0.8,
      renderCell: (params) => {
        const parseDate = (dateString) => {
          if (!dateString || typeof dateString !== "string") return null;
    
          if (dateString.includes("/")) {
            // Formato DD/MM/YYYY
            const [day, month, year] = dateString.split("/").map(Number);
            return new Date(year, month - 1, day);
          } else if (dateString.includes("-")) {
            // Formato YYYY-MM-DD
            return new Date(dateString); // O JavaScript já lida com este formato
          }
          return null; // Caso não seja nenhum dos formatos esperados
        };
    
        try {
          const prazoPrevisto = parseDate(params.row.prazoPrevisto);
    
          if (!prazoPrevisto) throw new Error("Prazo previsto inválido");
    
          return (
            <Box>
              {prazoPrevisto.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
            </Box>
          );
        } catch (error) {
          
          return <Box>Data inválida</Box>;
        }
      },
    },
    {
      field: "valor",
      headerName: "Gasto atual",
      flex: 0.9,
      renderCell: (params) => {
        // Define valores padrão caso os campos estejam ausentes
        const rawValor = params.row.valor || "0"; // Garante que valor exista
        const rawOrcamento = params.row.orcamento || "0"; // Garante que orçamento exista
    
        // Converte valores para números, removendo caracteres desnecessários
        const valor = parseFloat(
          String(rawValor).replace("R$", "").replace(/\./g, "").replace(",", ".")
        );
    
        const orcamento = parseFloat(
          String(rawOrcamento).replace("R$", "").replace(/\./g, "").replace(",", ".")
        );
    
        // Define cor de fundo com base no valor e orçamento
        let backgroundColor = "#4CAF50"; // Verde por padrão
        if (valor === orcamento) {
          backgroundColor = "#0048ff"; // Azul
        } else if (valor > orcamento) {
          backgroundColor = "#f44336"; // Vermelho
        } else if (valor >= orcamento * 0.8) {
          backgroundColor = "#FFC107"; // Amarelo
        }
    
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "bold",
            }}
          >
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor,
              }}
            />
            {valor.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Box>
        );
      },
    },
    
   
    

    {
      field: "orcamento",
      headerName: "Orçamento",
      flex: 0.7,
      renderCell: (params) => {
        let orcamento = 0;
    
        try {
          // Remove os caracteres não numéricos, exceto vírgula e ponto
          const rawOrcamento = params.row.orcamento || "0";
          const cleanedOrcamento = rawOrcamento
            .replace(/[^\d,.-]/g, "") // Remove caracteres não numéricos, exceto separadores
            .replace(/\./g, "") // Remove o separador de milhares
            .replace(",", "."); // Substitui a vírgula por ponto para decimais
          
          orcamento = parseFloat(cleanedOrcamento); // Converte para número decimal
        } catch (error) {
          
        }
    
        return (
          <Box>
            {Number.isNaN(orcamento)
              ? "Valor inválido"
              : orcamento.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
          </Box>
        );
      },
    },
    {
      field: "ativo",
      headerName: "Ativo",
      flex: 0.4,
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Checkbox
              checked
              onChange={(event) =>
                handleCheckboxChange(params.row.id, event.target.checked)
              }
              sx={{ color: "#312783", "&.Mui-checked": { color: "#312783" } }}
            />
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 0.9,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
            component={Link}
            size="small"
            to={`/dashboardprojeto?id=${row.id}`}
            sx={{
              color: "#fff",
              backgroundColor: "#583cff",
              fontSize: "0.65rem",
              "&:hover": { backgroundColor: "#3f2cb2" },
            }}
          >
            Editar
          </Button>
          <IconButton
            onClick={() =>
              setConfirmAlert({
                show: true,
                projetoId: row.id,
                message: "Tem certeza de que deseja deletar este projeto?",
                severity: "error",
              })
            }
          >
            <DeleteForeverSharpIcon sx={{ fontSize: 25, color: "#f44336" }} />
          </IconButton>
        </Box>
      ),
    },
    
  ];




















//=======================================================================
      
      //FUNÇÃO PARA AGRUPAR TODAS AS 3 FUNÇÕES PARA PASSAR PARA O DATAGRID

//=======================================================================




 

  useEffect(() => {
    //console.log("Aplicando filtros: filtroQuem:", filtroQuem, "filtroColaborador:", filtroColaborador, "filtroSolicitante:", filtroSolicitante);
  
    let exibidos = [...projetos];
  
    if (filtroQuem) {
      exibidos = exibidos.filter((proj) =>
        Array.isArray(proj.quem) && proj.quem.includes(filtroQuem)
      );
    }
    if (filtroColaborador) {
      exibidos = exibidos.filter((proj) =>
        Array.isArray(proj.colaboradores) &&
        proj.colaboradores.includes(filtroColaborador)
      );
    }
    if (filtroSolicitante) {
      exibidos = exibidos.filter((proj) => proj.solicitante === filtroSolicitante);
    }
  
    //console.log("Projetos exibidos após filtro:", exibidos);
    setProjetosExibidos(exibidos);
  }, [filtroQuem, filtroColaborador, filtroSolicitante, projetos]);
  


//=======================================================================
      
      //FUNÇÃO PARA LISTAR PROJETO POR CADA "SOLICITANTE" NA LISTA

//=======================================================================



const [projetosFiltrados, setProjetosFiltrados] = useState([]); // Projetos filtrados

   
// Função para buscar todos os projetos do Firebase
// Função para buscar projetos e mapear responsáveis
const fetchProjetos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "projetos"));
    const projetosCarregados = querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();

      // 1) SOMAR VALOR DENTRO DE DIRETRIZES
      let somaValor = 0;
      const diretrizes = data.diretrizes || [];
      diretrizes.forEach((dir) => {
        const tarefas = dir.tarefas || [];
        tarefas.forEach((t) => {
          const raw = t.planoDeAcao?.valor || "R$ 0,00";
          // Converte a string (ex: "R$ 1.555,55") para número
          const somenteNumero = parseFloat(
            raw.replace("R$", "").replace(/\./g, "").replace(",", ".")
          ) || 0;
          somaValor += somenteNumero;
        });
      });

      // Converte a soma total em formato de moeda "R$ ..."
      const somaFormatada = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(somaValor);

      // 2) MANTER ORÇAMENTO NO FORMATO ORIGINAL (STRING)
      const orcamentoString = data.orcamento || "R$ 0,00";

      return {
        id: docSnap.id,
        // Agora 'valor' será a soma de TODAS as tarefas
        valor: somaFormatada,
        // Deixe o orçamento como string
        orcamento: orcamentoString,
        ...data,
      };
    });

    // 3) LÓGICA DE COLABORADORES
    const colaboradoresMap = new Map();
    for (const projeto of projetosCarregados) {
      if (Array.isArray(projeto.colaboradores)) {
        for (const colaboradorId of projeto.colaboradores) {
          colaboradoresMap.set(
            colaboradorId,
            (colaboradoresMap.get(colaboradorId) || 0) + 1
          );
        }
      }
    }

    const colaboradoresComNomes = await Promise.all(
      Array.from(colaboradoresMap.entries()).map(async ([colaboradorId, valor]) => {
        const userSnapshot = await getDoc(doc(db, "user", colaboradorId));
        const username = userSnapshot.exists()
          ? userSnapshot.data().username
          : "Desconhecido";
        return {
          id: colaboradorId,
          nome: username,
          valor,
        };
      })
    );

    const maxValor = Math.max(...colaboradoresComNomes.map((d) => d.valor));
    const dadosNormalizados = colaboradoresComNomes.map((d) => ({
      ...d,
      percentual: maxValor > 0 ? (d.valor / maxValor) * 100 : 0,
    }));

    // Armazena no estado
    setDadosColaboradores(dadosNormalizados);

    // Finalmente, define os projetos (com 'valor' já somado e formatado)
    setProjetos(projetosCarregados);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
  }
};

useEffect(() => {
  fetchProjetos();
}, []);









// Filtro de projetos por responsável
useEffect(() => {
  console.log("Aplicando filtro por quem:", filtroQuem);

  if (filtroQuem) {
    const filtrados = projetos.filter((proj) => {
      console.log("Analisando projeto:", proj);

      const diretrizes = proj.diretrizes || [];
      return diretrizes.some((diretriz) => {
        const tarefas = diretriz.tarefas || [];
        return tarefas.some((tarefa) => {
          const planoDeAcao = tarefa.planoDeAcao || {};
          console.log("IDs encontrados no 'quem':", planoDeAcao.quem); // Loga os IDs no campo "quem"
          return Array.isArray(planoDeAcao.quem) && planoDeAcao.quem.includes(filtroQuem); // Verifica se o ID está em "quem"
        });
      });
    });

    console.log("Projetos filtrados por filtroQuem:", filtrados);
    setProjetosExibidos(filtrados);
  } else {
    console.log("Sem filtroQuem, exibindo todos os projetos.");
    setProjetosExibidos(projetos);
  }
}, [filtroQuem, projetos]);




//=======================================================================
      
      //FIM   FUNÇÃO PARA LISTAR PROJETO POR CADA "SOLICITANTE" NA LISTA

//=======================================================================




//=======================================================================
      
      //FUNÇÃO PARA LISTAR PROJETO POR CADA "COLABORADOR" NA LISTA

//=======================================================================


// ------------------
// ESTADOS
// ------------------
const [listaProjetos, setListaProjetos] = useState([]); // Armazena todos os projetos
const [projetosFiltradosColaborador, setProjetosFiltradosColaborador] = useState([]);



// Lógica de filtro
useEffect(() => {
  console.log("== Aplicando filtro de colaborador ==");
  console.log("Filtro ativo (ID):", filtroColaborador);
  console.log("Projetos disponíveis:", projetos);

  if (filtroColaborador) {
    const filtrados = projetos.filter((projeto) =>
      Array.isArray(projeto.colaboradores)
        ? projeto.colaboradores.includes(filtroColaborador)
        : false
    );
    console.log("Projetos filtrados por ID:", filtrados);
    setProjetosFiltradosColaborador(filtrados);
  } else {
    console.log("Sem filtro, exibindo todos os projetos:", projetos);
    setProjetosFiltradosColaborador(projetos);
  }
}, [filtroColaborador, projetos]);







//=======================================================================
      
      //FIM   FUNÇÃO PARA LISTAR PROJETO POR CADA "COLABORADOR" NA LISTA

//=======================================================================


















  return (
    <>


    


    
  {confirmAlert.show && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(255, 255, 255, 0.8)", // Fundo branco opaco
      zIndex: 999, // Fundo abaixo do alerta
    }}
  >
    <Alert
      variant="filled"
      severity={confirmAlert.severity}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // Centraliza no centro da tela
        zIndex: 1000, // Garante que o alerta esteja acima do fundo
        width: "60%", // Define a largura da caixa
        maxWidth: "800px",
        padding: "20px", // Adiciona espaçamento interno
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Adiciona sombra para destaque
        display: "flex", // Alinha os itens horizontalmente
        flexDirection: "row",
        alignItems: "center", // Alinha verticalmente
        gap: "20px", // Espaçamento entre texto e botões
      }}
      icon={
        <ReportProblemIcon
          style={{
            fontSize: "2.5rem", // Aumenta o tamanho do ícone
            color: "#ffe500", // Cor do ícone
            marginLeft: "10px", //
          }}
        >
          !
        </ReportProblemIcon>
      }
    >
    <Box sx={{
        display: "flex", // Define o layout como flexbox
        flexDirection: "row", // Alinha os elementos na horizontal
        alignItems: "center", // Alinha verticalmente
        justifyContent: "space-between", // Espaçamento entre os elementos
        gap: "180px", // Espaçamento entre os dois <Box>
      }}>
      <Box
        sx={{
          color: "#fff",
          flex: "1", // O texto ocupa o espaço restante
          textAlign: "left", // Alinha o texto à esquerda
          display: "flex",
          fontSize: "14px"
        }}
      >
        Tem certeza de que deseja excluir esse projeto?
      </Box>

      {/* Botões à frente do texto */}
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#d32f2f",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          onClick={handleDeleteProjeto}
        >
          Sim
        </button>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#d32f2f",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          onClick={() => setConfirmAlert({ show: false, projetoId: null })}
        >
          Não
        </button>
      </div>
      </Box>
    </Alert>
  </div>
)}









    
<DataGrid
  rows={projetosExibidos}
  columns={columns}
  components={{ Toolbar: CustomToolbar }}
  localeText={localeText}
  initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
  pageSizeOptions={[5, 10, 20, 50]} // Adicione as opções aqui
  sx={{
    marginLeft: "-13px",
    marginTop: "5px",
    width: "calc(100% - -10px)",
    minHeight: "50vh",
    padding: "15px",
    paddingLeft: "30px",
    borderRadius: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    bgcolor: "#f2f0f0",
    overflowX: "hidden",
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#312783",
      color: "#bcbcbc",
      fontSize: "13px",
    },
  }}
/>

    </>
  );
};

export default Lista;

