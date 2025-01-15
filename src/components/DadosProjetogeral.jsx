import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Box, useMediaQuery, useTheme, Typography, CircularProgress } from "@mui/material";
import { tokens } from "../theme";
import PaidIcon from "@mui/icons-material/Paid";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { db } from "../data/firebase-config"; // Atualize o caminho conforme necessário

import Lista from "../components/Lista";

function DadosProjetogeral() {
  const theme = useTheme();
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");








   //=======================================================================
      
      //FUNÇÕES PARA "PROJETOS POR quem..."

   //=======================================================================
   const [dadosQuem, setDadosQuem] = useState([]);

   useEffect(() => {
    const fetchQuemDados = async () => {
      try {
        const projetosSnapshot = await getDocs(collection(db, "projetos")); // Acessa a coleção "projetos"
        const quemMap = new Map();
  
        projetosSnapshot.forEach((projetoDoc) => {
          const data = projetoDoc.data();
          const diretrizes = data.diretrizes || [];
  
          diretrizes.forEach((diretriz) => {
            const tarefas = diretriz.tarefas || [];
            tarefas.forEach((tarefa) => {
              const planoDeAcao = tarefa.planoDeAcao || {};
              const responsaveis = planoDeAcao.quem || []; // Lista de responsáveis
  
              responsaveis.forEach((responsavel) => {
                // Incrementa a contagem para cada responsável (quem)
                if (quemMap.has(responsavel)) {
                  quemMap.set(responsavel, quemMap.get(responsavel) + 1);
                } else {
                  quemMap.set(responsavel, 1);
                }
              });
            });
          });
        });
  
        // Converte o Map para um array de objetos
        const dados = Array.from(quemMap.entries()).map(([nome, valor]) => ({
          nome,
          valor,
        }));
  
        // Normaliza os valores para o gráfico (baseado no maior número de tarefas)
        const maxValor = Math.max(...dados.map((d) => d.valor));
        const dadosNormalizados = dados.map((d) => ({
          ...d,
          percentual: (d.valor / maxValor) * 100, // Percentual da barra
        }));
  
        setDadosQuem(dadosNormalizados); // Atualiza o estado com os dados normalizados
      } catch (error) {
        console.error("Erro ao buscar dados de 'quem':", error);
      }
    };
  
    fetchQuemDados();
  }, []);
  

   
//=======================================================================
      
      //FIM  FUNÇÕES PARA "PROJETOS POR quem...

   //=======================================================================














  



  //=======================================================================
      
      //FUNÇÕES PARA "PROJETOS POR GERENCIA"

   //=======================================================================
   const [dadosGerencia, setDadosGerencia] = useState([]);

   useEffect(() => {
     const fetchProjetosPorSolicitante = async () => {
       try {
         const projetosSnapshot = await getDocs(collection(db, "projetos")); // Acessa a coleção "projetos"
         const solicitantesMap = new Map();
   
         projetosSnapshot.forEach((projetoDoc) => {
           const data = projetoDoc.data();
           const solicitante = data.solicitante || "Não informado";
   
           // Incrementa a contagem de projetos para cada solicitante
           if (solicitantesMap.has(solicitante)) {
             solicitantesMap.set(solicitante, solicitantesMap.get(solicitante) + 1);
           } else {
             solicitantesMap.set(solicitante, 1);
           }
         });
   
         // Converte o Map para um array de objetos
         const dados = Array.from(solicitantesMap.entries()).map(([nome, valor]) => ({
           nome,
           valor,
         }));
   
         // Normaliza os valores para o gráfico (baseado no maior número de projetos)
         const maxValor = Math.max(...dados.map((d) => d.valor));
         const dadosNormalizados = dados.map((d) => ({
           ...d,
           percentual: (d.valor / maxValor) * 100, // Percentual da barra
         }));
   
         setDadosGerencia(dadosNormalizados); // Atualiza o estado com os dados normalizados
       } catch (error) {
         console.error("Erro ao buscar projetos por solicitante:", error);
       }
     };
   
     fetchProjetosPorSolicitante();
   }, []);
   
//=======================================================================
      
      //FIM  FUNÇÕES PARA "PROJETOS POR GERENCIA"

   //=======================================================================












    //=======================================================================
      
      //FUNÇÕES PARA "PROJETOS POR colaboradores"

   //=======================================================================
   const [dadosColaboradores, setDadosColaboradores] = useState([]);

   useEffect(() => {
     const fetchColaboradores = async () => {
       try {
         const projetosSnapshot = await getDocs(collection(db, "projetos")); // Acessa a coleção de projetos
         const colaboradoresMap = new Map();
   
         projetosSnapshot.forEach((projetoDoc) => {
           const projeto = projetoDoc.data();
   
           (projeto.colaboradores || []).forEach((colaboradorId) => {
             // Incrementa a contagem de projetos para cada colaborador
             if (colaboradoresMap.has(colaboradorId)) {
               colaboradoresMap.set(
                 colaboradorId,
                 colaboradoresMap.get(colaboradorId) + 1
               );
             } else {
               colaboradoresMap.set(colaboradorId, 1);
             }
           });
         });
   
         // Normaliza os dados para exibir no gráfico
         const dados = Array.from(colaboradoresMap.entries()).map(
           ([colaboradorId, valor]) => ({
             nome: colaboradorId,
             valor,
           })
         );
   
         const maxValor = Math.max(...dados.map((d) => d.valor));
         const dadosNormalizados = dados.map((d) => ({
           ...d,
           percentual: (d.valor / maxValor) * 100, // Percentual baseado no maior valor
         }));
   
         setDadosColaboradores(dadosNormalizados);
       } catch (error) {
         console.error("Erro ao buscar dados dos colaboradores:", error);
       }
     };
   
     fetchColaboradores();
   }, []);
   
   
//=======================================================================
      
      //FIM  FUNÇÕES PARA "PROJETOS POR colaboradores"

   //=======================================================================

















//=======================================================================
      
      //FUNÇÕES PARA PARA BUSCAR INFORMAÇÕES DE VALOR, DIRETRIZES, TAREFAS

   //=======================================================================


// Função para buscar totais de diretrizes e tarefas
  const [totalDiretrizes, setTotalDiretrizes] = useState(0);
  const [totalTarefas, setTotalTarefas] = useState(0);

  useEffect(() => {
    const fetchDiretrizesETarefas = async () => {
      try {
        const projetosSnapshot = await getDocs(collection(db, "projetos")); // Acessa a coleção "projetos"
        let diretrizesCount = 0;
        let tarefasCount = 0;

        projetosSnapshot.forEach((projetoDoc) => {
          const data = projetoDoc.data();

          // Soma as diretrizes no projeto
          const diretrizes = data.diretrizes || [];
          diretrizesCount += diretrizes.length;

          // Soma as tarefas dentro de cada diretriz
          diretrizes.forEach((diretriz) => {
            const tarefas = diretriz.tarefas || [];
            tarefasCount += tarefas.length;
          });
        });

        // Atualiza os estados com os totais
        setTotalDiretrizes(diretrizesCount);
        setTotalTarefas(tarefasCount);
      } catch (error) {
        console.error("Erro ao buscar diretrizes e tarefas:", error);
      }
    };

    fetchDiretrizesETarefas();
  }, []);
  


  // RECEBE A QUANTIDADE DE PROJETOS
  const [quantidadeProjetos, setQuantidadeProjetos] = useState(0);

  useEffect(() => {
    const fetchQuantidadeProjetos = async () => {
      try {
        const projetosSnapshot = await getDocs(collection(db, "projetos")); // Acesse a coleção "projetos"
        setQuantidadeProjetos(projetosSnapshot.size); // Atualize o estado com o número de documentos
      } catch (error) {
        console.error("Erro ao buscar quantidade de projetos:", error);
      }
    };
  
    fetchQuantidadeProjetos();
  }, []);
  


 // RECEBE O VALOR SOMADO DE "VALOR"  DO BANCO
  const [custoTotal, setCustoTotal] = useState(0);

  useEffect(() => {
    const fetchValor = async () => {
      try {
        const projetosSnapshot = await getDocs(collection(db, "projetos")); // Coleção de projetos
        let total = 0;
  
        for (const projetoDoc of projetosSnapshot.docs) {
          console.log("Projeto ID:", projetoDoc.id, projetoDoc.data());
          const data = projetoDoc.data();
  
          // Acessa o array de diretrizes no documento do projeto
          const diretrizes = data.diretrizes || [];
          diretrizes.forEach((diretriz) => {
            console.log("Diretriz:", diretriz);
  
            // Acessa o array de tarefas dentro de cada diretriz
            const tarefas = diretriz.tarefas || [];
            tarefas.forEach((tarefa) => {
              console.log("Tarefa:", tarefa);
  
              // Acessa o campo planoDeAcao dentro de cada tarefa
              const planoDeAcao = tarefa.planoDeAcao;
              if (planoDeAcao?.valor) {
                console.log("Valor encontrado:", planoDeAcao.valor);
                const valor = parseFloat(
                  planoDeAcao.valor
                    .replace("R$", "")
                    .replace(/\./g, "") // Remove os pontos dos milhares
                    .replace(",", ".") // Substitui a vírgula pelo ponto decimal
                );
                total += valor; // Soma o valor
              } else {
                console.warn("Campo 'valor' não encontrado:", planoDeAcao);
              }
            });
          });
        }
  
        console.log("Total Calculado:", total);
        setCustoTotal(total); // Atualiza o estado com o valor total
      } catch (error) {
        console.error("Erro ao buscar valores:", error);
      }
    };
  
    fetchValor();
  }, []);
  
  


  // RECEBE O VALOR "ORÇAMENTO" DO BANCO

  const [orcamentoTotal, setOrcamentoTotal] = useState(0);

  useEffect(() => {
    const fetchOrcamentos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projetos")); 
        let total = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const orcamento = parseFloat(
            data.orcamento.replace("R$", "").replace(".", "").replace(",", ".")
          );
          total += orcamento; // Soma os valores de orçamento
        });

        setOrcamentoTotal(total); // Atualiza o estado com o valor total
      } catch (error) {
        console.error("Erro ao buscar orçamentos:", error);
      }
    };

    fetchOrcamentos();
  }, []);


  //=======================================================================
      
      //FIM  FUNÇÕES PARA PARA BUSCAR INFORMAÇÕES DE VALOR, DIRETRIZES, TAREFAS

   //=======================================================================















  // Buscar o projectId automaticamente
  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search); // Obtém parâmetros da URL
        const idFromUrl = urlParams.get("id");
  
        if (idFromUrl) {
          setProjectId(idFromUrl); // Define o ID obtido da URL
        } else {
          console.error("ID do projeto não encontrado na URL.");
        }
      } catch (error) {
        console.error("Erro ao buscar projectId:", error);
      }
    };
  
    fetchProjectId();
  }, []);

  return (
    <>
      {/* Header */}
      <Box sx={{ marginLeft: "40px", paddingTop: "10px" }}></Box>

      {/* Container Principal */}
      <Box
        sx={{
          marginLeft: "40px",
          width: "calc(100% - 80px)",
          minHeight: "50vh",
          padding: "15px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
          overflow: "visible",
          marginBottom: "30px",
        }}
      >
        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns={
            isXlDevices
              ? "repeat(12, 1fr)"
              : isMdDevices
              ? "repeat(6, 1fr)"
              : "repeat(6, 1fr)"
          }
          gridAutoRows="140px"
          gap="20px"
        >
          {/* Statistic Items */}
          {[
            {
              id: "orcamento", // Identificador único
              title: `R$ ${orcamentoTotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`,
              subtitle: "Orçamento total",
              progress: 75,
              //increase: "+14%",
              icon: <PaidIcon sx={{ color: "#fff", fontSize: "40px" }} />,
              backgroundColor: "#312783", // Azul padrão
            },
            {
              title: `R$ ${custoTotal.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`,
              subtitle: "Total de gastos",
              progress: 75,
              //increase: "+14%",
              icon: <PaidIcon sx={{ color: "#fff", fontSize: "40px" }} />,
              backgroundColor:
                custoTotal <= 10000
                  ? "#4caf50" // Verde para valores baixos
                  : custoTotal <= 50000
                  ? "#ff9800" // Laranja para valores médios
                  : "#f44336", // Vermelho para valores altos
            },

            {
              id: "projetos",
              title: `Total de projetos: ${quantidadeProjetos.toLocaleString(
                "pt-BR"
              )}`, // Exibe a quantidade de projetos formatada
              //subtitle: "Total de projetos",
              progress: 30,
              //increase: "+5%",
              icon: (
                <AssignmentTurnedInIcon
                  sx={{ color: "#fff", fontSize: "40px" }}
                />
              ),
              backgroundColor: "#312783", // Azul padrão
            },
            {
              id: "diretrizes",
              title: `Total de diretrizes: ${totalDiretrizes.toLocaleString(
                "pt-BR"
              )}\nTotal de tarefas: ${totalTarefas.toLocaleString("pt-BR")}`, // Formatação em duas linhas
              //subtitle: "Resumo de diretrizes e tarefas",
              progress: 30,
              icon: (
                <AssignmentTurnedInIcon
                  sx={{ color: "#fff", fontSize: "40px" }}
                />
              ),
              backgroundColor: "#312783", // Azul padrão
            },
          ].map((item, index) => (
            <Box
              key={index}
              boxShadow={3}
              borderRadius="20px"
              gridColumn="span 3"
              bgcolor={item.backgroundColor} // Cor dinâmica
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="20px"
              sx={{ gap: "10px", position: "relative" }}
            >
              {/* Ícone à Esquerda */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ minWidth: "60px", height: "60px" }}
              >
                {item.icon}
              </Box>

              {/* Linha Vertical */}
              <Box
                sx={{
                  width: "2px",
                  height: "80%",
                  backgroundColor: "#ffffff4d",
                  margin: "0 2px",
                }}
              />

              {/* Texto no Meio */}
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                sx={{ flex: 1 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontSize: "11px",
                    whiteSpace: "pre-line",
                    textJustify: "inter-word",
                    textAlign: "left",
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#fff",
                    fontSize: "9px",
                    textJustify: "inter-word",
                    textAlign: "left",
                  }}
                >
                  {item.subtitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#8bc34a",
                    fontSize: "9px",
                    textJustify: "inter-word",
                    textAlign: "left",
                  }}
                >
                  {item.increase}
                </Typography>
              </Box>

              {/* Gráfico à Direita */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ minWidth: "60px", height: "60px" }}
              ></Box>
            </Box>
          ))}
        </Box>















        {/* Gráfico Horizontal - Projetos por Gerência */}














        <Box
          padding="50px"
          sx={{
            gap: "20px",
            gridColumn: "span 12",
            alignItems: "stretch",
          }}
        >
          {/* Coluna Esquerda - Título */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            marginLeft="10px"
          >
            <Box
              sx={{
                display: "flex", // Alinha os elementos em linha
                alignItems: "center", // Alinha verticalmente ao centro
                gap: "10px", // Espaço entre os elementos
                marginBottom: "30px", //
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "#312783",
                  whiteSpace: "nowrap", // Evita quebra de linha
                }}
              >
                Projetos
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#afaeae",
                  whiteSpace: "nowrap", // Evita quebra de linha
                }}
              >
                por Solicitantes
              </Typography>
            </Box>
          </Box>

          {/* Coluna Direita - Gráficos com Linhas e Bolinhas */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px", // Espaço entre os elementos
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            {dadosGerencia.map((item, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap="10px"
                sx={{ width: "100%" }}
              >
                {/* Nome do Solicitante */}
                <Typography
                  sx={{
                    minWidth: "120px",
                    color: "#9d9d9c",
                  }}
                >
                  {item.nome}
                </Typography>

                {/* Linha de Progresso */}
                <Box
                  sx={{
                    flex: 1,
                    height: "3px",
                    backgroundColor: "#e8e5e5",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: `${item.percentual}%`, // Proporção da barra
                      backgroundColor:
                        index % 4 === 0
                          ? "#4caf50"
                          : index % 4 === 1
                          ? "#ff9800"
                          : index % 4 === 2
                          ? "#1976d2"
                          : "#9c27b0", // Cor dinâmica
                      height: "100%",
                      borderRadius: "4px",
                    }}
                  >
                    {/* Bolinha no Final */}
                    <Box
                      sx={{
                        width: "10px",
                        height: "10px",
                        backgroundColor:
                          index % 4 === 0
                            ? "#4caf50"
                            : index % 4 === 1
                            ? "#ff9800"
                            : index % 4 === 2
                            ? "#1976d2"
                            : "#9c27b0", // Cor dinâmica
                        borderRadius: "50%",
                        position: "absolute",
                        right: "-7px",
                        transform: "translateY(-50%)",
                        marginRight: "10px",
                      }}
                    />
                  </Box>
                </Box>

                {/* Número de Projetos */}
                <Box
                  sx={{
                    minWidth: "25px",
                    backgroundColor:
                      index % 4 === 0
                        ? "#4caf50"
                        : index % 4 === 1
                        ? "#ff9800"
                        : index % 4 === 2
                        ? "#1976d2"
                        : "#9c27b0", // Cor dinâmica
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    lineHeight: "24px",
                    borderRadius: "50%",
                  }}
                >
                  {item.valor}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>













        {/* Gráfico Horizontal - Projetos por colaboradores */}


















        <Box
  padding="50px"
  sx={{
    gap: "20px",
    gridColumn: "span 12",
    alignItems: "stretch",
  }}
>
  {/* Coluna Esquerda - Título */}
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="flex-start"
    marginLeft="10px"
  >
    <Box
      sx={{
        display: "flex", // Alinha os elementos em linha
        alignItems: "center", // Alinha verticalmente ao centro
        gap: "10px", // Espaço entre os elementos
        marginBottom: "30px",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#312783",
          whiteSpace: "nowrap", // Evita quebra de linha
        }}
      >
        Projetos
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: "#afaeae",
          whiteSpace: "nowrap", // Evita quebra de linha
        }}
      >
        por Colaboradores
      </Typography>
    </Box>
  </Box>

  {/* Coluna Direita - Gráficos com Linhas e Bolinhas */}
  <Box
    sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "20px", // Espaço entre os elementos
      paddingLeft: "10px",
      paddingRight: "10px",
    }}
  >
    {dadosColaboradores.map((item, index) => (
      <Box
        key={index}
        display="flex"
        alignItems="center"
        gap="10px"
        sx={{ width: "100%" }}
      >
        {/* Nome do Colaborador */}
        <Typography
          sx={{
            minWidth: "120px",
            color: "#9d9d9c",
          }}
        >
          {item.nome ? item.nome : "Colaborador desconhecido"}
        </Typography>

        {/* Linha de Progresso */}
        <Box
          sx={{
            flex: 1,
            height: "3px",
            backgroundColor: "#e8e5e5",
            borderRadius: "4px",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: `${item.percentual}%`, // Proporção da barra
              backgroundColor:
                index % 4 === 0
                  ? "#4caf50"
                  : index % 4 === 1
                  ? "#ff9800"
                  : index % 4 === 2
                  ? "#1976d2"
                  : "#9c27b0", // Cor dinâmica
              height: "100%",
              borderRadius: "4px",
            }}
          >
            {/* Bolinha no Final */}
            <Box
              sx={{
                width: "10px",
                height: "10px",
                backgroundColor:
                  index % 4 === 0
                    ? "#4caf50"
                    : index % 4 === 1
                    ? "#ff9800"
                    : index % 4 === 2
                    ? "#1976d2"
                    : "#9c27b0", // Cor dinâmica
                borderRadius: "50%",
                position: "absolute",
                right: "-7px",
                transform: "translateY(-50%)",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={() => setColaboradorFiltrado(item.nome)} // Define o colaborador filtrado
            />
          </Box>
        </Box>

        {/* Número de Projetos */}
        <Box
          sx={{
            minWidth: "25px",
            backgroundColor:
              index % 4 === 0
                ? "#4caf50"
                : index % 4 === 1
                ? "#ff9800"
                : index % 4 === 2
                ? "#1976d2"
                : "#9c27b0", // Cor dinâmica
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
            lineHeight: "24px",
            borderRadius: "50%",
          }}
        >
          {item.valor}
        </Box>
      </Box>
    ))}
  </Box>
</Box>











        {/* Gráfico Horizontal - Projetos por quem... */}












        

        <Box
          padding="50px"
          sx={{
            gap: "20px",
            gridColumn: "span 12",
            alignItems: "stretch",
          }}
        >
          {/* Coluna Esquerda - Título */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            marginLeft="10px"
          >
            <Box
              sx={{
                display: "flex", // Alinha os elementos em linha
                alignItems: "center", // Alinha verticalmente ao centro
                gap: "10px", // Espaço entre os elementos
                marginBottom: "30px",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "#312783",
                  whiteSpace: "nowrap", // Evita quebra de linha
                }}
              >
                Projetos
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#afaeae",
                  whiteSpace: "nowrap", // Evita quebra de linha
                }}
              >
                por Tarefas
              </Typography>
            </Box>
          </Box>

          {/* Coluna Direita - Gráficos com Linhas e Bolinhas */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px", // Espaço entre os elementos
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            {dadosQuem.map((item, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap="10px"
                sx={{ width: "100%" }}
              >
                {/* Nome do Responsável */}
                <Typography
                  sx={{
                    minWidth: "120px",
                    color: "#9d9d9c",
                  }}
                >
                  {item.nome}
                </Typography>

                {/* Linha de Progresso */}
                <Box
                  sx={{
                    flex: 1,
                    height: "3px",
                    backgroundColor: "#e8e5e5",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: `${item.percentual}%`, // Proporção da barra
                      backgroundColor:
                        index % 4 === 0
                          ? "#4caf50"
                          : index % 4 === 1
                          ? "#ff9800"
                          : index % 4 === 2
                          ? "#1976d2"
                          : "#9c27b0", // Cor dinâmica
                      height: "100%",
                      borderRadius: "4px",
                    }}
                  >
                    {/* Bolinha no Final */}
                    <Box
                      sx={{
                        width: "10px",
                        height: "10px",
                        backgroundColor:
                          index % 4 === 0
                            ? "#4caf50"
                            : index % 4 === 1
                            ? "#ff9800"
                            : index % 4 === 2
                            ? "#1976d2"
                            : "#9c27b0", // Cor dinâmica
                        borderRadius: "50%",
                        position: "absolute",
                        right: "-7px",
                        transform: "translateY(-50%)",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                </Box>

                {/* Número de Tarefas */}
                <Box
                  sx={{
                    minWidth: "25px",
                    backgroundColor:
                      index % 4 === 0
                        ? "#4caf50"
                        : index % 4 === 1
                        ? "#ff9800"
                        : index % 4 === 2
                        ? "#1976d2"
                        : "#9c27b0", // Cor dinâmica
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    lineHeight: "24px",
                    borderRadius: "50%",
                  }}
                >
                  {item.valor}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/** COMPONENTE */}
        <Box marginTop="20px" marginLeft="40px" marginRight="40px">
          <Lista />
        </Box>
      </Box>
    </>
  );
}

export default DadosProjetogeral;
