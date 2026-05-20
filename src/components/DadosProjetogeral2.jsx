import React, { useEffect, useState } from "react";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import { Accordion, AccordionSummary, AccordionDetails, Button, Box, useMediaQuery, useTheme, Typography, CircularProgress } from "@mui/material";
import { tokens } from "../theme";
import PaidIcon from "@mui/icons-material/Paid";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { dbFokus360 as db } from "../data/firebase-config";
import { PieChart } from '@mui/x-charts/PieChart';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Lista from "./Lista";
import FiltrosPlanejamento from "./FiltrosPlanejamento";
import GraficosDiretrizes from "./GraficosDiretrizes"; // ajuste o caminho se necessário


function DadosProjetogeral() {
  const theme = useTheme();
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const [projectId, setProjectId] = useState();

  const [filtroQuem, setFiltroQuem] = useState(null);
  const [dadosQuem, setDadosQuem] = useState([]);

  const [totalEstrategicas, setTotalEstrategicas] = useState(0); // <-- Estado!
  const [totalTaticas, setTotalTaticas] = useState(0);         // <-- Estado!
  const [totalOperacionais, setTotalOperacionais] = useState(0); // <-- Estado!

  // Novos estados para as contagens de CONCLUÍDAS
  const [totalEstrategicasConcluidas, setTotalEstrategicasConcluidas] = useState(0);
  const [totalTaticasConcluidas, setTotalTaticasConcluidas] = useState(0);
  const [totalOperacionaisConcluidos, setTotalOperacionaisConcluidos] = useState(0);
  const [totalTarefasConcluidas, setTotalTarefasConcluidas] = useState(0);



useEffect(() => {
  console.log("🛠️ Estado atual do filtroQuem:", filtroQuem);
}, [filtroQuem]);



// Função para resetar os filtros
const handleLimparFiltros = () => {
  setFiltroSolicitante(null);
  setFiltroColaborador(null);
  setFiltroQuem(null);
};



   //=======================================================================
      
      //FUNÇÕES PARA "PROJETOS POR quem..."

   //=======================================================================
   
 

   useEffect(() => {
    const fetchQuemDados = async () => {
      try {
        const projetosSnapshot = await getDocs(collection(db, "projetos"));
        const quemMap = new Map(); // Armazena os IDs e a contagem de tarefas
  
        projetosSnapshot.forEach((projetoDoc) => {
          const data = projetoDoc.data();
          const diretrizesEstrategicas = data.estrategicas || [];
  
          diretrizesEstrategicas.forEach((diretriz) => {
            const taticas = diretriz.taticas || [];
            taticas.forEach((tatica) => {
              const operacionais = tatica.operacionais || [];
              operacionais.forEach((operacional) => {
                const tarefas = operacional.tarefas || [];
                tarefas.forEach((tarefa) => {
                  const planoDeAcao = tarefa.planoDeAcao || {};
  
                  // ✅ Só itera se quem for array válida
                  if (Array.isArray(planoDeAcao.quem)) {
                    planoDeAcao.quem.forEach((responsavelId) => {
                      if (quemMap.has(responsavelId)) {
                        quemMap.set(responsavelId, quemMap.get(responsavelId) + 1);
                      } else {
                        quemMap.set(responsavelId, 1);
                      }
                    });
                  }
                });
              });
            });
          });
        });
  
        // 🔍 Busca os nomes desses IDs na coleção "user"
        const quemComNomes = await Promise.all(
          Array.from(quemMap.entries()).map(async ([responsavelId, valor]) => {
            const userSnapshot = await getDoc(doc(db, "user", responsavelId));
            const username = userSnapshot.exists()
              ? userSnapshot.data().username
              : null; // ⚠️ Se o usuário foi deletado
  
            // ⚠️ Se o usuário não existir mais, ignore ele
            if (username) {
              return { id: responsavelId, nome: username, valor };
            }
  
            return null;
          })
        );
  
        // 🔥 Remove nulos (usuários excluídos)
        setDadosQuem(quemComNomes.filter(Boolean));
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
           if (data.solicitante) {
            const solicitante = data.solicitante;
            if (solicitantesMap.has(solicitante)) {
              solicitantesMap.set(solicitante, solicitantesMap.get(solicitante) + 1);
            } else {
              solicitantesMap.set(solicitante, 1);
            }
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
        const projetosSnapshot = await getDocs(collection(db, "projetos")); 
        const colaboradoresMap = new Map();
  
        // Itera pelos projetos e mapeia os IDs dos colaboradores
        projetosSnapshot.forEach((projetoDoc) => {
          const projeto = projetoDoc.data();
          (projeto.colaboradores || []).forEach((colaboradorId) => {
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
  
        // Busca os nomes dos colaboradores no Firestore
        const colaboradoresComNomes = await Promise.all(
          Array.from(colaboradoresMap.entries()).map(async ([colaboradorId, valor]) => {
            const userSnapshot = await getDoc(doc(db, "user", colaboradorId));
            const username = userSnapshot.exists()
              ? userSnapshot.data().username
              : "Desconhecido";
  
            // Adicionamos "id: colaboradorId"
            return {
              id: colaboradorId,  // <-- ID para filtrar
              nome: username,     // <-- Nome para exibir
              valor,              // Exemplo: contagem de projetos
            };
          })
        );
  
        // Normaliza os dados para exibir no gráfico (percentual, se desejar)
        const maxValor = Math.max(...colaboradoresComNomes.map((d) => d.valor));
        const dadosNormalizados = colaboradoresComNomes.map((d) => ({
          ...d,
          percentual: maxValor > 0 ? (d.valor / maxValor) * 100 : 0,
        }));
  
        // Atualiza o estado com os dados normalizados (agora inclui id)
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
          const projetosSnapshot = await getDocs(collection(db, "projetos"));
          let estrategicasCount = 0;
          let taticasCount = 0;
          let operacionaisCount = 0;
          let tarefasCount = 0;

          // Contadores para concluídos
          let estrategicasConcluidasCount = 0;
          let taticasConcluidasCount = 0;
          let operacionaisConcluidosCount = 0;
          let tarefasConcluidasCount = 0;

          for (const projetoDoc of projetosSnapshot.docs) {
              const data = projetoDoc.data();
              const diretrizesEstrategicas = data.estrategicas || [];

              estrategicasCount += diretrizesEstrategicas.length;

              for (const diretriz of diretrizesEstrategicas) {
                  const taticas = diretriz.taticas || [];
                  taticasCount += taticas.length;

                  let todasTaticasConcluidas = true; // Flag para diretriz estratégica

                  for (const tatica of taticas) {
                      const operacionais = tatica.operacionais || [];
                      operacionaisCount += operacionais.length;

                      let todosOperacionaisConcluidos = true; // Flag para tática

                      for (const operacional of operacionais) {
                          const tarefas = operacional.tarefas || [];
                          tarefasCount += tarefas.length;

                          let todasTarefasConcluidas = true; // Flag para operacional

                          for (const tarefa of tarefas) {
                              if (tarefa.checkboxState && tarefa.checkboxState.concluida) {
                                  tarefasConcluidasCount++;
                              } else {
                                  todasTarefasConcluidas = false; // Se uma não estiver concluída, essa flag fica false
                              }
                          }

                          // Se todas as tarefas estiverem concluídas, conta o operacional como concluído
                          if (todasTarefasConcluidas && tarefas.length > 0) {
                              operacionaisConcluidosCount++;
                          } else {
                              todosOperacionaisConcluidos = false; // Pelo menos uma não concluída
                          }
                      }

                      // Se todas as operacionais estiverem concluídas, conta a tática como concluída
                      if (todosOperacionaisConcluidos && operacionais.length > 0) {
                          taticasConcluidasCount++;
                      } else {
                          todasTaticasConcluidas = false;
                      }
                  }

                  // Se todas as táticas estiverem concluídas, conta a estratégica como concluída
                  if (todasTaticasConcluidas && taticas.length > 0) {
                      estrategicasConcluidasCount++;
                  }
              }
          }

          // Atualiza os estados com os valores calculados
          setTotalEstrategicas(estrategicasCount);
          setTotalTaticas(taticasCount);
          setTotalOperacionais(operacionaisCount);
          setTotalTarefas(tarefasCount);

          setTotalEstrategicasConcluidas(estrategicasConcluidasCount);
          setTotalTaticasConcluidas(taticasConcluidasCount);
          setTotalOperacionaisConcluidos(operacionaisConcluidosCount);
          setTotalTarefasConcluidas(tarefasConcluidasCount);

          console.log("✅ Estratégicas Concluídas:", estrategicasConcluidasCount);
          console.log("✅ Táticas Concluídas:", taticasConcluidasCount);
      } catch (error) {
          console.error("Erro ao buscar diretrizes e tarefas:", error);
      }
  };

  fetchDiretrizesETarefas();
}, []);


  // BUSCA O CAMPO status "concluida" DA PARTE DE CONCLUÍDAS
useEffect(() => {
  const fetchConclusoes = async () => {
    try {
      const projetosSnapshot = await getDocs(collection(db, "projetos"));

      let estrategicasConcluidas = 0;
      let taticasConcluidas = 0;
      let operacionaisConcluidas = 0;
      let tarefasConcluidas = 0;

      for (const docSnap of projetosSnapshot.docs) {
        const data = docSnap.data();
        const estrategicas = data.estrategicas || [];

        estrategicas.forEach((estrategica) => {
          if (estrategica.status === "concluida") estrategicasConcluidas++;

          const taticas = estrategica.taticas || [];
          taticas.forEach((tatica) => {
            if (tatica.status === "concluida") taticasConcluidas++;

            const operacionais = tatica.operacionais || [];
            operacionais.forEach((operacional) => {
              if (operacional.status === "concluida") operacionaisConcluidas++;

              const tarefas = operacional.tarefas || [];
              tarefas.forEach((tarefa) => {
                if (tarefa.status === "concluida") tarefasConcluidas++;
              });
            });
          });
        });
      }

      setTotalEstrategicasConcluidas(estrategicasConcluidas);
      setTotalTaticasConcluidas(taticasConcluidas);
      setTotalOperacionaisConcluidos(operacionaisConcluidas);
      setTotalTarefasConcluidas(tarefasConcluidas);
    } catch (error) {
      console.error("❌ Erro ao buscar status concluído:", error);
    }
  };

  fetchConclusoes();
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

  const fetchValor = async () => {
    try {
      const projetosSnapshot = await getDocs(collection(db, "projetos"));
      let total = 0;
  
      for (const projetoDoc of projetosSnapshot.docs) {
        const data = projetoDoc.data();
        const estrategicas = data.estrategicas || [];
  
        estrategicas.forEach((estrategica) => {
          const taticas = estrategica.taticas || [];
  
          taticas.forEach((tatica) => {
            const operacionais = tatica.operacionais || [];
  
            operacionais.forEach((operacional) => {
              const tarefas = operacional.tarefas || [];
  
              tarefas.forEach((tarefa) => {
                const planoDeAcao = tarefa.planoDeAcao || {};
                const rawValor = planoDeAcao.valor;
  
                if (rawValor && typeof rawValor === "string") {
                  const valorNumerico = parseFloat(
                    rawValor
                      .replace("R$", "")
                      .replace(/\./g, "")
                      .replace(",", ".")
                      .trim()
                  );
  
                  if (!isNaN(valorNumerico)) {
                    total += valorNumerico;
                  }
                }
              });
            });
          });
        });
      }
  
      setCustoTotal(total);
      console.log("✅ Total de gastos somado:", total);
    } catch (error) {
      console.error("❌ Erro ao buscar valores das tarefas:", error);
    }
  };
  

  useEffect(() => {
    fetchValor(); // <-- CHAME A FUNÇÃO AQUI
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
          
          if (data.orcamento) { 
            // Removendo caracteres desnecessários antes de converter
            const orcamentoString = String(data.orcamento)
              .replace(/[R$\s]/g, "")     // remove "R$" e espaços
              .replace(/\./g, "")         // remove ponto de milhar
              .replace(",", ".");         // transforma vírgula em ponto

  
            const orcamentoNumerico = parseFloat(orcamentoString);
  
            if (!isNaN(orcamentoNumerico)) {
              total += orcamentoNumerico; // Soma corretamente
            } else {
              console.warn("⚠️ Orçamento inválido encontrado:", data.orcamento);
            }
          }
        });
  
        setOrcamentoTotal(total);
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
          //console.error("ID do projeto não encontrado na URL.");
        }
      } catch (error) {
        console.error("Erro ao buscar projectId:", error);
      }
    };
  
    fetchProjectId();
  }, []);












  //=======================================================================
      
      //FUNÇÃO PARA FILTRAR OS "SOLICITANTE" PARA FILTRAR LÁ NA LISTA

   //=====================================================================


  
  const [filtroSolicitante, setFiltroSolicitante] = useState(null);
  // Função chamada ao clicar no botão
  const handleBolinhaClickSolicitante = (nome) => {
    setFiltroSolicitante(nome); // Atualiza o filtro de solicitante
  };


  // Exemplo de item que possui { id: "gAP66jz0EH6pL78uIMUW", nome: "Lucinete" }
  const [filtroColaborador, setFiltroColaborador] = useState(null);

  const handleBolinhaClickColaborador = (colabId) => {
    //console.log("Colaborador clicado (ID):", colabId);
    setFiltroColaborador(colabId);
  };

  const handleBolinhaClickQuem = async (nomeResponsavel) => {
    try {
      console.log("🎯 Clicou em:", nomeResponsavel);
  
      // Buscar o ID correto do usuário no Firestore
      const usersSnapshot = await getDocs(collection(db, "user"));
      const userDoc = usersSnapshot.docs.find(
        (docSnap) => docSnap.data().username === nomeResponsavel
      );
  
      if (!userDoc) {
        console.warn("❌ Usuário não encontrado no Firestore:", nomeResponsavel);
        setFiltroQuem(null);
        return;
      }
  
      const idResponsavel = userDoc.id;
      console.log("✅ ID do responsável encontrado:", idResponsavel);
  
      // Atualizar o estado corretamente
      setFiltroQuem(idResponsavel);
    } catch (error) {
      console.error("❌ Erro ao buscar responsável:", error);
    }
  };
  
  

  
  
  
  
  
 // Busca nomes desses IDs na coleção "Quem"
 useEffect(() => {
  const fetchQuemDados = async () => {
    try {
      const projetosSnapshot = await getDocs(collection(db, "projetos"));
      const quemMap = new Map();

      projetosSnapshot.forEach((projetoDoc) => {
        const data = projetoDoc.data();
        const diretrizesEstrategicas = data.estrategicas || [];

        diretrizesEstrategicas.forEach((diretriz) => {
          const tarefas = diretriz.tarefas || [];

          tarefas.forEach((tarefa) => {
            const planoDeAcao = tarefa.planoDeAcao || {};

            // ✅ Verifica se "quem" é um array antes de iterar
            if (Array.isArray(planoDeAcao.quem)) {
              planoDeAcao.quem.forEach((responsavelId) => {
                if (quemMap.has(responsavelId)) {
                  quemMap.set(responsavelId, quemMap.get(responsavelId) + 1);
                } else {
                  quemMap.set(responsavelId, 1);
                }
              });
            }
          });
        });
      });

      // Busca nomes válidos no Firestore
      const quemComNomes = await Promise.all(
        Array.from(quemMap.entries()).map(async ([responsavelId, valor]) => {
          const userSnapshot = await getDoc(doc(db, "user", responsavelId));
          const username = userSnapshot.exists()
            ? userSnapshot.data().username
            : null; // ⚠️ Ignora se usuário foi apagado

          return username ? { id: responsavelId, nome: username, valor } : null;
        })
      );

      // ⚠️ Remove entradas nulas (usuários que não existem mais)
      setDadosQuem(quemComNomes.filter(Boolean));
    } catch (error) {
      console.error("Erro ao buscar dados de 'quem':", error);
    }
  };

  fetchQuemDados();
}, []);


  // ---------------------------
  // ESTADOS E FUNÇÕES PARA "GERENCIA" (Solicitantes)
  // ---------------------------
  
  useEffect(() => {
    const fetchProjetosPorSolicitante = async () => {
      try {
        const projetosSnapshot = await getDocs(collection(db, "projetos"));
        const solicitantesMap = new Map();
  
        projetosSnapshot.forEach((projetoDoc) => {
          const data = projetoDoc.data();
  
          if (data.solicitante && typeof data.solicitante === "string") {
            const solicitante = data.solicitante.trim();
  
            if (solicitante) {
              if (solicitantesMap.has(solicitante)) {
                solicitantesMap.set(solicitante, solicitantesMap.get(solicitante) + 1);
              } else {
                solicitantesMap.set(solicitante, 1);
              }
            }
          }
        });
  
        // Remove qualquer entrada com nome vazio
        const dados = Array.from(solicitantesMap.entries())
          .filter(([nome]) => nome !== "")
          .map(([nome, valor]) => ({
            nome,
            valor,
          }));
  
        const maxValor = Math.max(...dados.map((d) => d.valor), 1);
        const dadosNormalizados = dados.map((d) => ({
          ...d,
          percentual: (d.valor / maxValor) * 100,
        }));
  
        setDadosGerencia(dadosNormalizados);
      } catch (error) {
        console.error("Erro ao buscar projetos por solicitante:", error);
      }
    };
  
    fetchProjetosPorSolicitante();
  }, []);
  
  // ---------------------------
  // ESTADOS E FUNÇÕES PARA "COLABORADORES"
  // ---------------------------

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        const projetosSnapshot = await getDocs(collection(db, "projetos"));
        const colaboradoresMap = new Map();

        projetosSnapshot.forEach((projetoDoc) => {
          const projeto = projetoDoc.data();
          (projeto.colaboradores || []).forEach((colaboradorId) => {
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

        const colaboradoresComNomes = await Promise.all(
          Array.from(colaboradoresMap.entries()).map(async ([colaboradorId, valor]) => {
            const userSnapshot = await getDoc(doc(db, "user", colaboradorId));
            const username = userSnapshot.exists()
              ? userSnapshot.data().username
              : "Desconhecido";

            return {
              id: colaboradorId,
              nome: username,
              valor
            };
          })
        );

        const maxValor = Math.max(...colaboradoresComNomes.map((d) => d.valor));
        const dadosNormalizados = colaboradoresComNomes.map((d) => ({
          ...d,
          percentual: maxValor > 0 ? (d.valor / maxValor) * 100 : 0
        }));

        setDadosColaboradores(dadosNormalizados);
      } catch (error) {
        console.error("Erro ao buscar dados dos colaboradores:", error);
      }
    };
    fetchColaboradores();
  }, []);










  return (
    <>
      {/* Header */}
      <Box sx={{ marginLeft: "40px", paddingTop: "10px" }}></Box>

      {/* Container Principal */}
      <Box
        sx={{
          marginLeft: "20px",
          marginTop: "10px",
          width: "calc(100% - 45px)",
          minHeight: "50vh",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >































        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns={
            isXlDevices
              ? "repeat(30, 1fr)"
              : isMdDevices
              ? "repeat(6, 1fr)"
              : "repeat(6, 1fr)"
          }
          gridAutoRows="110px"
          gap="8px"
        >
          {/* Statistic Items */}
          {[
            {
              id: "orcamento", // Identificador único
              title: (
                <>
                  <Typography variant="h5" sx={{marginLeft: "-5px", color: "#fff", fontSize: "15px", textAlign: "left" }}>
                    {`R$ ${orcamentoTotal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`}
                  </Typography>
                </>
              ),
              subtitle: (
                <Typography variant="subtitle2" sx={{marginLeft: "-5px", color: "#fff", fontSize: "10px", textAlign: "left", whiteSpace: "nowrap" }}>
                  Orçamento Total
                </Typography>
              ),
              progress: 75,
              //increase: "+14%",
              icon: <PaidIcon sx={{ color: "#fff", fontSize: "40px" }} />,
              backgroundColor: "#312783", // Azul padrão
            },
            {
              title: (
                <Typography variant="h5" sx={{marginLeft: "-5px", color: "#fff", fontSize: "15px", textAlign: "left", whiteSpace: "nowrap" }}>
                  {`R$ ${custoTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`}
                </Typography>
              ),
              subtitle: (
                <Typography variant="subtitle2" sx={{marginLeft: "-5px", color: "#fff", fontSize: "12px", textAlign: "left", whiteSpace: "nowrap" }}>
                  Total de gastos
                </Typography>
              ),
              icon: <PaidIcon sx={{ color: "#fff", fontSize: "40px" }} />,
              backgroundColor:
                custoTotal > orcamentoTotal
                  ? "#f44336" // Vermelho se passou do orçamento
                  : custoTotal === orcamentoTotal
                  ? "#0048ff" // Azul se é exatamente igual
                  : custoTotal >= orcamentoTotal * 0.8
                  ? "#ffb600" // Laranja/Amarelo se acima de 80%
                  : "#00c48c", // Verde abaixo de 80% do orçamento
            },
          ].map((item, index) => (
            <Box
              key={index}
              boxShadow={3}
              borderRadius="20px"
              gridColumn="span 15"
              bgcolor={item.backgroundColor} // Cor dinâmica
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ gap: "15px", position: "relative", maxHeight: "60px" }}
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
                  width: "1px",
                  height: "80%",
                  backgroundColor: "#ffffff4d",
                  position: "absolute",
                  top: "50%",
                  left: "57px", // valor fixo em pixels
                  transform: "translateY(-50%)", // remove o deslocamento horizontal
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


        <GraficosDiretrizes
          quantidadeProjetos={quantidadeProjetos}
          totalEstrategicas={totalEstrategicas}
          totalTaticas={totalTaticas}
          totalOperacionais={totalOperacionais}
          totalTarefas={totalTarefas}
          totalEstrategicasConcluidas={totalEstrategicasConcluidas}
          totalTaticasConcluidas={totalTaticasConcluidas}
          totalOperacionaisConcluidos={totalOperacionaisConcluidos}
          totalTarefasConcluidas={totalTarefasConcluidas}
        />







































        <Accordion
          sx={{
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            margin: "20px 0",
            padding: "10px",
            overflow: "hidden",
            backgroundColor: "#f4f6f8"
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="conteudo-acordion"
            id="cabecalho-acordion"
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#312783" }}
            >
              Filtrar usuários
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* TODO O CONTEÚDO AQUI */}
            {/* Gráfico Horizontal - Projetos por Gerência */}
            <Box
              padding="50px"
              sx={{
                gap: "20px",
                gridColumn: "span 12",
                alignItems: "stretch",
                marginBottom: "-60px",
                backgroundColor: "#f4f6f8"
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
                    marginBottom: "20px", //
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
                  gap: "5px", // Espaço entre os elementos
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
                              ? "#00c48c"
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
                            width: "15px",
                            height: "15px",
                            backgroundColor:
                              index % 4 === 0
                                ? "#00c48c"
                                : index % 4 === 1
                                ? "#ff9800"
                                : index % 4 === 2
                                ? "#1976d2"
                                : "#9c27b0", // Cor dinâmica
                            borderRadius: "50%",
                            position: "absolute",
                            right: "-7px",
                            transform: "translateY(-50%)",
                            marginRight: "5px",
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
                            ? "#00c48c"
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
                        cursor: "pointer",
                        border: "none", // Remove a borda padrão de botão
                        padding: "0", // Remove o preenchimento padrão
                        outline: "none", // Remove o destaque ao focar
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Impede que o clique se propague para elementos superiores
                        handleBolinhaClickSolicitante(item.nome, "solicitante"); // Executa a ação ao clicar
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
                marginBottom: "-60px",
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
                    marginBottom: "20px",
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
                  gap: "5px", // Espaço entre os elementos
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
                              ? "#00c48c"
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
                                ? "#00c48c"
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

                    {/* Número de Projetos */}
                    <Box
                      sx={{
                        minWidth: "25px",
                        backgroundColor:
                          index % 4 === 0
                            ? "#00c48c"
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
                        cursor: "pointer", // Torna o botão clicável
                        border: "none", // Remove a borda padrão de botão
                        padding: "0", // Remove o preenchimento padrão
                        outline: "none", // Remove o destaque ao focar
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBolinhaClickColaborador(item.id, "solicitante");
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
                    Responsáveis
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
                  gap: "5px", // Espaço entre os elementos
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
                              ? "#00c48c"
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
                                ? "#00c48c"
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
                            ? "#00c48c"
                            : index % 4 === 1
                            ? "#ff9800"
                            : index % 4 === 2
                            ? "#1976d2"
                            : "#9c27b0",
                        textAlign: "center",
                        color: "#fff",
                        fontWeight: "bold",
                        lineHeight: "24px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        border: "none",
                        padding: "0",
                        outline: "none",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBolinhaClickQuem(item.nome, "quem");
                      }}
                    >
                      {item.valor}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>


        <FiltrosPlanejamento />


        
        {/* Botão de limpar filtro */}
        <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "20px",
                marginBottom: "10px",
              }}
            >
              <Button
                variant="contained"
                onClick={handleLimparFiltros}
                sx={{
                  backgroundColor: "#3f2cb2",
                  fontSize: "10px",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  boxShadow: "none",
                  marginRight: "45px",
                  "&:hover": { backgroundColor: "#3f2cb2" },
                }}
              >
                Limpar Filtros
              </Button>
            </Box>

        {/** COMPONENTE */}
        <Box marginTop="20px" marginLeft="40px" marginRight="40px">
          {/* Passa o filtro para a Lista */}
          <Lista
            filtroSolicitante={filtroSolicitante}
            filtroColaborador={filtroColaborador}
            filtroQuem={filtroQuem}
            setFiltroSolicitante={setFiltroSolicitante} // Passando o setter
            setFiltroColaborador={setFiltroColaborador} // Passando o setter
            setFiltroQuem={setFiltroQuem} // Passando o setter
          />
        </Box>
      </Box>
    </>
  );
}

export default DadosProjetogeral;