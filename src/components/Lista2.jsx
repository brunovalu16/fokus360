import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarColumnsButton } from "@mui/x-data-grid";
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
import { dbFokus360 as db } from "../data/firebase-config";



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

const Lista2 = ({ filtroSolicitante, filtroColaborador, filtroQuem, setFiltroSolicitante, setFiltroColaborador, setFiltroQuem }) => {
  const [dadosColaboradores, setDadosColaboradores] = useState([]);
  const [projetos2, setProjetos2] = useState([]);
  const [projetos2Exibidos, setProjetos2Exibidos] = useState([]);
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
  if (!projetos2.length) {
    // Se não houver projetos, não tente filtrar
    setProjetos2Exibidos([]);
    return;
  }

  let exibidos = [...projetos2];

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
    exibidos = exibidos.filter((proj) =>
      proj.diretrizes?.some((diretriz) =>
        diretriz.taticas?.some((tatica) =>
          tatica.operacionais?.some((operacional) =>
            operacional.tarefas?.some((tarefa) =>
              tarefa.planoDeAcao?.quem?.includes(filtroQuem)
            )
          )
        )
      )
    );
  }
  

  setProjetos2Exibidos(exibidos);
}, [filtroColaborador, filtroSolicitante, filtroQuem, projetos2]);






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
        const rawValor = params.row.valor || "R$ 0,00"; // Pegando do banco
        const rawOrcamento = params.row.orcamento || "R$ 0,00"; // Pegando orçamento
    
        // Converte para número removendo caracteres desnecessários
        const valor = parseFloat(
          rawValor.replace("R$", "").replace(/\./g, "").replace(",", ".")
        ) || 0;
    
        const orcamento = parseFloat(
          rawOrcamento.replace("R$", "").replace(/\./g, "").replace(",", ".")
        ) || 0;
    
        // Define cor de fundo com base no orçamento
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
        <Box
        display="flex"
        gap={1}
        onMouseDown={(e) => e.stopPropagation()} // 🔹 Impede que o clique ative a seleção da célula do DataGrid
        sx={{
          outline: "none !important", // 🔹 Remove qualquer borda preta
          border: "none !important",
          boxShadow: "none !important",
          userSelect: "none",
          "&:focus": {
            outline: "none !important",
            border: "none !important",
            boxShadow: "none !important",
          },
          "&.Mui-focusVisible": {
            boxShadow: "none !important",
            pointerEvents: "none",
          },
        }}
      >
        {/* Botão Editar */}
        <Button
          component={Link}
          size="small"
          to={`/dashboardplanejamento/${row.id}`}
          disableRipple
          disableFocusRipple
          tabIndex={-1} 
          onMouseDown={(e) => e.preventDefault()} 
          sx={{
            color: "#fff",
            backgroundColor: "#583cff",
            fontSize: "0.65rem",
            boxShadow: "none",
            outline: "none !important",
            border: "none",
            userSelect: "none",
            "&:hover": { backgroundColor: "#3f2cb2" },
            "&:active": { backgroundColor: "#3f2cb2" },
            "&:focus": { outline: "none !important", border: "none" },
            "&.Mui-focusVisible": { boxShadow: "none", pointerEvents: "none" },
          }}
        >
          Editar
        </Button>
      
        {/* Botão Deletar */}
        <IconButton
          disableRipple
          disableFocusRipple
          tabIndex={-1} 
          aria-hidden="true"
          onMouseDown={(e) => e.preventDefault()} 
          onClick={(e) => {
            e.currentTarget.blur();
            setConfirmAlert({
              show: true,
              projetoId: row.id,
              message: "Tem certeza de que deseja deletar este projeto?",
              severity: "error",
            });
          }}
          sx={{
            outline: "none !important",
            border: "none !important",
            boxShadow: "none !important",
            userSelect: "none",
            "&:focus": {
              outline: "none !important",
              border: "none !important",
              boxShadow: "none !important",
              backgroundColor: "transparent !important",
            },
            "&.Mui-focusVisible": {
              boxShadow: "none !important",
              pointerEvents: "none",
              backgroundColor: "transparent !important",
            },
          }}
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
  
    let exibidos = [...projetos2];
  
    if (filtroQuem) {
      exibidos = exibidos.filter((proj) => {
        return proj.diretrizes?.some((diretriz) =>
          diretriz.taticas?.some((tatica) =>
            tatica.operacionais?.some((operacional) =>
              operacional.tarefas?.some((tarefa) => {
                console.log(
                  `🧐 Verificando projeto: ${proj.nome || "Sem Nome"}`,
                  "Tarefa:",
                  tarefa.descricao || "Sem Descrição",
                  "Quem:",
                  tarefa.planoDeAcao?.quem
                );
                return tarefa.planoDeAcao?.quem?.includes(filtroQuem);
              })
            )
          )
        );
      });
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
    setProjetos2Exibidos(exibidos);
  }, [filtroQuem, filtroColaborador, filtroSolicitante, projetos2]);
  


//=======================================================================
      
      //FUNÇÃO PARA LISTAR PROJETO POR CADA "SOLICITANTE" NA LISTA

//=======================================================================



const [projetos2Filtrados, setProjetos2Filtrados] = useState([]); // Projetos filtrados

   
// Função para buscar todos os projetos do Firebase
// Função para buscar projetos e mapear responsáveis
const fetchProjetos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "projetos2"));
    const projetosCarregados = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();

        // Verifica se diretrizes existem antes de iterar
        let somaValor = 0;
        if (Array.isArray(data.diretrizes)) {
          data.diretrizes.forEach((diretriz) => {
            if (Array.isArray(diretriz.taticas)) {
              diretriz.taticas.forEach((tatica) => {
                if (Array.isArray(tatica.operacionais)) {
                  tatica.operacionais.forEach((operacional) => {
                    if (Array.isArray(operacional.tarefas)) {
                      operacional.tarefas.forEach((tarefa) => {
                        const rawValor = tarefa.planoDeAcao?.valor || "R$ 0,00";
                        const somenteNumero = parseFloat(
                          rawValor.replace("R$", "").replace(/\./g, "").replace(",", ".")
                        ) || 0;
                        somaValor += somenteNumero;
                      });
                    }
                  });
                }
              });
            }
          });
        }

        // Converte a soma total em formato de moeda "R$ ..."
        const somaFormatada = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(somaValor);

        return {
          id: docSnap.id,
          valor: somaFormatada,
          orcamento: data.orcamento || "R$ 0,00",
          ...data,
        };
      })
    );

    // Mapeamento de colaboradores
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

    // Buscar nomes dos colaboradores do Firestore
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

    // Normaliza os valores
    const maxValor = Math.max(...colaboradoresComNomes.map((d) => d.valor));
    const dadosNormalizados = colaboradoresComNomes.map((d) => ({
      ...d,
      percentual: maxValor > 0 ? (d.valor / maxValor) * 100 : 0,
    }));

    // Atualiza os estados
    setDadosColaboradores(dadosNormalizados);
    setProjetos2(projetosCarregados);
  } catch (error) {
    console.error("❌ Erro ao buscar projetos2:", error);
  }
};

useEffect(() => {
  fetchProjetos();
}, []);










// Filtro de projetos por responsável
useEffect(() => {
  console.log("🎯 Aplicando filtro por quem:", filtroQuem);

  if (filtroQuem) {
    const filtrados = projetos2.filter((proj) => {
      console.log("🔍 Analisando projeto:", proj.nome);

      const diretrizes = proj.diretrizes || [];
      return diretrizes.some((diretriz) => {
        const taticas = diretriz.taticas || [];
        return taticas.some((tatica) => {
          const operacionais = tatica.operacionais || [];
          return operacionais.some((operacional) => {
            const tarefas = operacional.tarefas || [];
            return tarefas.some((tarefa) => {
              const planoDeAcao = tarefa.planoDeAcao || {};
              const responsaveis = planoDeAcao.quem || []; // Sempre garantir que seja array válido

              console.log(`🧐 Projeto: ${proj.nome} | Tarefa: ${tarefa.tituloTarefa || "Sem Descrição"} | Quem:`, responsaveis);

              return Array.isArray(responsaveis) && responsaveis.includes(filtroQuem);
            });
          });
        });
      });
    });

    console.log("✅ Projetos2 filtrados por filtroQuem:", filtrados);
    setProjetos2Exibidos(filtrados);
  } else {
    console.log("🔄 Sem filtroQuem, exibindo todos os projetos2.");
    setProjetos2Exibidos(projetos2);
  }
}, [filtroQuem, projetos2]);






//=======================================================================
      
      //FIM   FUNÇÃO PARA LISTAR PROJETO POR CADA "SOLICITANTE" NA LISTA

//=======================================================================




//=======================================================================
      
      //FUNÇÃO PARA LISTAR PROJETO POR CADA "COLABORADOR" NA LISTA

//=======================================================================


// ------------------
// ESTADOS
// ------------------
const [listaProjetos2, setLista2Projetos] = useState([]); // Armazena todos os projetos
const [projetos2FiltradosColaborador, setProjetos2FiltradosColaborador] = useState([]);



// Lógica de filtro
useEffect(() => {
  console.log("== Aplicando filtro de colaborador ==");
  console.log("Filtro ativo (ID):", filtroColaborador);
  console.log("Projetos disponíveis:", projetos2);

  if (filtroColaborador) {
    const filtrados = projetos2.filter((projeto) =>
      Array.isArray(projeto.colaboradores)
        ? projeto.colaboradores.includes(filtroColaborador)
        : false
    );
    console.log("Projetos filtrados por ID:", filtrados);
    setProjetos2FiltradosColaborador(filtrados);
  } else {
    console.log("Sem filtro, exibindo todos os projetos:", projetos2);
    setProjetos2FiltradosColaborador(projetos2);
  }
}, [filtroColaborador, projetos2]);







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
  rows={projetos2Exibidos}
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

export default Lista2;

