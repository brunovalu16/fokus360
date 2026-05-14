import React, {  useRef } from "react";
import { Box, Typography, Grid, Divider, InputBase, Button } from "@mui/material";
import { jsPDF } from "jspdf";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PrintIcon from "@mui/icons-material/Print";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { dbFokus360 as db } from "../data/firebase-config"; // ✅ Correto para Fokus360
import DadosProjeto from "./DadosProjeto";


const StyledInput = (props) => (
  <InputBase
    {...props}
    sx={{
      backgroundColor: "transparent",
      color: "#b7b7b7",
      padding: "10px 10px",
      borderBottom: "1px solid #b7b7b7",
      borderLeft: "1px solid #b7b7b7",
      fontWeight: "bold",
      textAlign: "center",
      width: "100%",
      marginTop: "30px",
      ...(props.sx || {}),

      "& input": {
        textAlign: "center",
        fontWeight: "bold",
      },

      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "#fff",
        opacity: 1,
      },
    }}
  />
);

const FluxoGrama = ({ projectId  }) => {
  const [project, setProject] = useState(null);
  const [expanded, setExpanded] = useState(false); // Estado para controlar a expansão da tela
  const containerRef = useRef(); // Referência ao container para PDF e impressão




  useEffect(() => {
    const fetchData = async () => {
        if (!projectId) {
            console.log("⚠️ projectId está vazio, não foi possível buscar dados.");
            return;
        }

        console.log("🔄 Buscando projeto do Firestore com ID:", projectId);
        const docRef = doc(db, "projetos2", projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("✅ Projeto encontrado no Firestore:", docSnap.data());
            setProject(docSnap.data());
        } else {
            console.log("❌ Nenhum projeto encontrado no Firestore para este ID.");
        }
    };

    fetchData();
}, [projectId]);





  if (!project) {
    return <Typography sx={{ textAlign: "center", marginTop: 4 }}>Nenhum projeto encontrado.</Typography>;
  }





  if (!project) {
    return (
      <Typography sx={{ textAlign: "center", marginTop: 4 }}>
        Nenhum projeto encontrado.
      </Typography>
    );
  }

  const estrategicas = project?.diretrizes || [];
console.log("🧐 Estratégicas:", estrategicas);
  // ✅ Agora sempre existe, evitando undefined

  estrategicas.forEach((estrategica, index) => {
    console.log(`🔹 Estratégica ${index + 1}:`, estrategica?.titulo || "❌ Não encontrado");
    (estrategica.taticas || []).forEach((tatica, i) => {
      console.log(`   🔸 Tática ${i + 1}:`, tatica?.titulo || "❌ Não encontrado");
      (tatica.operacionais || []).forEach((operacional, j) => {
        console.log(`      ⚡ Operacional ${j + 1}:`, operacional?.titulo || "❌ Não encontrado");
        (operacional.tarefas || []).map((tarefa, k) => {
          console.log(`         ✅ Tarefa ${k + 1}:`, tarefa?.tituloTarefa || "❌ Não encontrado");
        });
      });
    });
  });
  

  const {
    nome = project?.nome || "Nome do Projeto",
    diretrizes = [],
    orcamento = project?.orcamento || "R$ 0,00",
  } = project;

  const orcamentoNumerico = parseFloat(
    (orcamento || "R$ 0,00").replace("R$", "").replace(".", "").replace(",", ".")
  ) || 0;
  
  const orcamentoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(orcamentoNumerico);
  
  
  
  const valorGasto = (project.diretrizes || []).reduce((total, diretriz) => {
    return total + (diretriz.taticas || []).reduce((tatTotal, tatica) => {
      return tatTotal + (tatica.operacionais || []).reduce((opTotal, operacional) => {
        return opTotal + (operacional.tarefas || []).reduce((acc, tarefa) => {
          const valor = parseFloat(
            (tarefa.planoDeAcao?.valor || "R$ 0,00").replace("R$", "").replace(".", "").replace(",", ".")
          );
          return acc + (isNaN(valor) ? 0 : valor);
        }, 0);
      }, 0);
    }, 0);
  }, 0);
  
  
  const valorGastoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorGasto);
  

  const handleExpand = () => setExpanded(!expanded);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(containerRef.current, {
      callback: function (doc) {
        doc.save("fluxograma.pdf");
      },
      x: 10,
      y: 10,
    });
  };

















  return (
    <Box
      ref={containerRef}
      sx={{
        width: expanded ? "100vw" : "100%", // Maior na visualização normal e quase toda tela ao expandir
        maxWidth: expanded ? "none" : "1900px", // Mantém um limite máximo na visualização normal
        transform: expanded ? "none" : "scale(1)", // Mantém o tamanho real na visualização normal
        transformOrigin: "top left",
        padding: 4,
        backgroundColor: "#f9f9fb", // Fundo mais moderno
        border: "1px solid #e0e0e0", // Cor suave para borda
        borderRadius: "12px", // Cantos arredondados
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)", // Sombras suaves
        position: expanded ? "fixed" : "relative",
        top: expanded ? 0 : "auto",
        left: expanded ? "50%" : "auto", // Centraliza no modo expandido
        transform: expanded ? "translateX(-50%)" : "none", // Mantém centralizado ao expandir
        right: expanded ? 0 : "auto",
        bottom: expanded ? 0 : "auto",
        zIndex: expanded ? 9999 : "auto",
        height: expanded ? "100vh" : "auto", // Reduz um pouco a altura ao expandir para evitar muito espaço vertical
        overflowX: expanded ? "auto" : "hidden", // Permite rolagem horizontal somente ao expandir
        overflowY: "auto",
        marginBottom: "auto",
        display: "flex", // Mantém a flexibilidade do layout
        flexDirection: "row", // Mantém os elementos lado a lado
        flexWrap: "wrap", // Permite quebra de linha quando necessário
        justifyContent: "center", // Centraliza os elementos horizontalmente
        alignItems: "flex-start", // Mantém alinhamento superior correto
      }}
    >


{estrategicas?.map((estrategica, indexEstr) => (
  <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }} key={indexEstr}>
    {/* 📌 Estratégica */}
    {/* 📌 Estratégica */}
<Grid item xs={3} sx={{ display: "flex", alignItems: "center", gap: 0, marginLeft: "40px" }}>
  <Box>
    <Typography sx={{ fontSize: "9px", color: "#555", marginTop: "60px", marginBottom: "-28px", marginLeft: "10px" }}>
      Diretriz Estratégica
    </Typography>
    <StyledInput
      value={estrategica?.titulo ?? "⚠️ Sem título"}
      disabled
      sx={{ backgroundColor: "#312783", borderRadius: "8px", border: "1px solid #dcdcdc", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        
        // Estilos para impressão
        '@media print': {
          backgroundColor: '#312783 !important', // Força a cor de fundo na impressão
          WebkitPrintColorAdjust: 'exact', // Para Safari e Chrome
          printColorAdjust: 'exact',         // Padrão mais recente
          color: 'white !important', 
         }, // Força a cor do texto na impressão

        // Estilos adicionais para garantir que o texto seja branco em todos os estados
        '& .MuiInputBase-input': { // Estiliza o input interno
            color: 'white',
        },
        '& .Mui-disabled': { // Estiliza quando desabilitado
            WebkitTextFillColor: '#00ebf7', // Necessário para navegadores baseados em WebKit (Chrome, Safari)
            color: 'white', //Para outros navegadores.
        },

        "& .MuiFormLabel-root": { //Para labels, se existirem
            color: 'white'
        },
          "& .Mui-disabled.MuiFormLabel-root": { //Para label desabilitada, se existirem
            color: 'white'
        },

      }}
    />
  </Box>

  {/* 📊 Gráfico de Progresso da Diretriz Estratégica */}
  <Box sx={{ marginTop: "60px" }}>
    <CircleProgress percentage={Math.round(
      estrategica?.taticas?.reduce((acc, tatica) =>
        acc + (tatica?.operacionais?.reduce((accT, operacional) =>
          accT + (operacional?.tarefas?.length > 0
            ? operacional?.tarefas?.reduce((accO, tarefa) => accO + (tarefa?.progresso || 0), 0) / operacional?.tarefas?.length
            : 0), 0) / (tatica?.operacionais?.length || 1)
        ), 0) / (estrategica?.taticas?.length || 1)
    )} />
  </Box>
</Grid>


    {/* 📌 Renderizamos as Táticas COM as Operacionais dentro */}
    <Grid item xs={8}>
      {estrategica?.taticas?.map((tatica, indexTat) => (
        <Grid container spacing={1} alignItems="center" key={indexTat} sx={{ mb: 1 }}>
          
          {/* 📌 Diretriz Tática */}
          <Grid item xs={3} sx={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div>
              <Typography sx={{ fontSize: "9px", color: "#555", marginTop: "40px", marginBottom: "-28px", marginLeft: "10px" }}>
                Diretriz Tática
              </Typography>
              <StyledInput 
                value={tatica?.titulo || "⚠️ Sem título"} 
                disabled 
                sx={{
                  backgroundColor: "#4caf50", borderRadius: "8px", border: "1px solid #dcdcdc",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                     
                  // Estilos para impressão
                  '@media print': {
                    backgroundColor: '#4caf50 !important', // Força a cor de fundo na impressão
                    WebkitPrintColorAdjust: 'exact', // Para Safari e Chrome
                    printColorAdjust: 'exact',         // Padrão mais recente
                    color: 'white !important', 
                   }, // Força a cor do texto na impressão

                    // Estilos adicionais para garantir que o texto seja branco em todos os estados
                    '& .MuiInputBase-input': { // Estiliza o input interno
                      color: 'white',
                  },
                  '& .Mui-disabled': { // Estiliza quando desabilitado
                      WebkitTextFillColor: '#a1ff00', // Necessário para navegadores baseados em WebKit (Chrome, Safari)
                      color: 'white', //Para outros navegadores.
                  },

                  "& .MuiFormLabel-root": { //Para labels, se existirem
                      color: 'white'
                  },
                    "& .Mui-disabled.MuiFormLabel-root": { //Para label desabilitada, se existirem
                      color: 'white'
                  },
                }} 
              />
            </div>

            {/* 📊 Gráfico de Progresso da Diretriz Tática */}
            <Box sx={{ marginTop: "40px" }}>
              <CircleProgress percentage={Math.round(
                tatica?.operacionais?.reduce((acc, operacional) => 
                  acc + (operacional?.tarefas?.length > 0 
                    ? operacional?.tarefas?.reduce((accT, tarefa) => accT + (tarefa?.progresso || 0), 0) / operacional?.tarefas?.length
                    : 0), 0) 
                / (tatica?.operacionais?.length || 1)
              )} />
            </Box>
          </Grid>

          {/* 📌 Diretrizes Operacionais associadas corretamente às Táticas */}
          <Grid item xs={9}>
            {tatica?.operacionais?.map((operacional, indexOp) => (
              <Grid container spacing={2} alignItems="center" key={indexOp} sx={{ mb: 1 }}>
                
                {/* 📌 Diretriz Operacional */}
                <Grid item xs={5} sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <Box>
                    <Typography sx={{ fontSize: "9px", color: "#555", marginTop: "40px", marginBottom: "-28px", marginLeft: "10px" }}>
                      Diretriz Operacional
                    </Typography>
                    <StyledInput 
                      value={operacional?.titulo || "⚠️ Sem título"} 
                      disabled 
                      sx={{ backgroundColor: "#d32f2f", borderRadius: "8px", border: "1px solid #dcdcdc", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                         
                        // Estilos para impressão
                      '@media print': {
                        backgroundColor: '#d32f2f !important', // Força a cor de fundo na impressão
                        WebkitPrintColorAdjust: 'exact', // Para Safari e Chrome
                        printColorAdjust: 'exact',         // Padrão mais recente
                        color: 'white !important', 
                      }, // Força a cor do texto na impressão
                        
                        
                        // Estilos adicionais para garantir que o texto seja branco em todos os estados
                         '& .MuiInputBase-input': { // Estiliza o input interno
                          color: 'white',
                      },
                      '& .Mui-disabled': { // Estiliza quando desabilitado
                          WebkitTextFillColor: '#ff8c8c', // Necessário para navegadores baseados em WebKit (Chrome, Safari)
                          color: 'white', //Para outros navegadores.
                      },

                      "& .MuiFormLabel-root": { //Para labels, se existirem
                          color: 'white'
                      },
                        "& .Mui-disabled.MuiFormLabel-root": { //Para label desabilitada, se existirem
                          color: 'white'
                      },
                      }} />
                  </Box>

                  {/* 📊 Gráfico de Progresso da Diretriz Operacional */}
                  <Box sx={{ marginTop: "40px" }}>
                    <CircleProgress percentage={Math.round(
                      operacional?.tarefas?.reduce((accT, tarefa) => accT + (tarefa.progresso || 0), 0) 
                      / (operacional?.tarefas?.length || 1)
                    )} />
                  </Box>
                </Grid>

                {/* 📌 Lista de Tarefas dentro da Operacional */}
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: "9px", color: "#555", marginTop: "40px" }}>
                    Tarefas
                  </Typography>
                  <Box sx={{ display: "flex", marginRight: "20px", flexDirection: "column", gap: 0, marginTop: "-25px" }}>
                    {operacional?.tarefas?.map((tarefa, indexTarefa) => (
                      <Box key={indexTarefa} sx={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: "120px"
                      }}>
                        <StyledInput value={tarefa?.tituloTarefa || "⚠️ Sem título"} disabled sx={{
                          backgroundColor: "#ffb600", borderRadius: "8px", border: "1px solid #dcdcdc",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", width: "100%",
                            
                          // Estilos para impressão
                          '@media print': {
                            backgroundColor: '#ffb600 !important', // Força a cor de fundo na impressão
                            WebkitPrintColorAdjust: 'exact', // Para Safari e Chrome
                            printColorAdjust: 'exact',         // Padrão mais recente
                            color: 'white !important', 
                          }, // Força a cor do texto na impressão
                                  
                                  
                          // Estilos adicionais para garantir que o texto seja branco em todos os estados
                            '& .MuiInputBase-input': { // Estiliza o input interno
                              color: 'white',
                          },
                          '& .Mui-disabled': { // Estiliza quando desabilitado
                              WebkitTextFillColor: '#faff00', // Necessário para navegadores baseados em WebKit (Chrome, Safari)
                              color: 'white', //Para outros navegadores.
                          },

                          "& .MuiFormLabel-root": { //Para labels, se existirem
                              color: 'white'
                          },
                            "& .Mui-disabled.MuiFormLabel-root": { //Para label desabilitada, se existirem
                              color: 'white'
                          },
                        }} />

                        {/* 📊 Gráfico de progresso da Tarefa */}
                        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: "-60px"}}>
                          <Box sx={{ marginTop: "15px" }}>
                            <CircleProgress percentage={tarefa.progresso || 0} />
                          </Box>
                          <Typography sx={{ fontSize: "10px", color: "#555", marginTop: "30px", marginLeft: '10px' }}>
                            Valor: {tarefa?.planoDeAcao?.valor || "R$ 0,00"}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid>
  </Grid>
))}























      {/**<Divider sx={{ my: 4 }} /> */}
      <Box
        sx={{
          width: "30%",
          justifyContent: "space-between",
          fontSize: 14,
          fontWeight: "bold",
          alignItems: "center", // Garante alinhamento vertical
          gap: 1,
          //backgroundColor: "#f9f9f9",
          padding: "12px",
          borderTop: "1px solid #ccc",

          color: "#9d9d9c",
        }}
      >
        {/* Orçamento */}
        <Typography>
          Orçamento:{" "}
          <span style={{ color: "#4caf50", fontWeight: "bold" }}>
            {orcamentoFormatado}
          </span>
        </Typography>

        {/* Valor Gasto com Indicador */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>Valor gasto:</Typography>
          <Typography
            sx={{
              color:
                valorGasto <= orcamentoNumerico * 0.5
                  ? "#4caf50" // Verde
                  : valorGasto <= orcamentoNumerico
                  ? "#ffc107" // Amarelo
                  : "#f44336", // Vermelho
              fontWeight: "bold",
            }}
          >
            {valorGastoFormatado}
          </Typography>
          <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <rect
              width="20"
              height="20"
              rx="2" /* Para bordas arredondadas */
              fill={
                valorGasto <= orcamentoNumerico * 0.5
                  ? "#4caf50" // Verde
                  : valorGasto <= orcamentoNumerico
                  ? "#ffc107" // Amarelo
                  : "#f44336" // Vermelho
              }
            />
          </svg>
        </Box>




{/* Diretrizes Estratégicas */}
<Typography sx={{ display: "flex", alignItems: "center" }}>
  Diretrizes Estratégicas:{" "}
  <Box
    sx={{
      marginTop: "3px",
      color: "#2c2c88",
      fontWeight: "bold",
      marginLeft: "-3px",
    }}
  >
    {Array.isArray(project?.diretrizes) ? project.diretrizes.length : 0}
  </Box>
</Typography>

{/* Diretrizes Táticas */}
<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  Diretrizes Táticas:{" "}
  <Box
    sx={{
      marginTop: "3px",
      color: "#2c2c88",
      fontWeight: "bold",
      marginLeft: "-3px",
    }}
  >
    {Array.isArray(project?.diretrizes)
      ? project.diretrizes.reduce(
          (acc, diretriz) => acc + (Array.isArray(diretriz.taticas) ? diretriz.taticas.length : 0),
          0
        )
      : 0}
  </Box>
</Typography>

{/* Diretrizes Operacionais */}
<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  Diretrizes Operacionais:{" "}
  <Box
    sx={{
      marginTop: "3px",
      color: "#2c2c88",
      fontWeight: "bold",
      marginLeft: "-3px",
    }}
  >
    {Array.isArray(project?.diretrizes)
      ? project.diretrizes.reduce(
          (acc, diretriz) =>
            acc +
            (Array.isArray(diretriz.taticas)
              ? diretriz.taticas.reduce(
                  (accT, tatica) => accT + (Array.isArray(tatica.operacionais) ? tatica.operacionais.length : 0),
                  0
                )
              : 0),
          0
        )
      : 0}
  </Box>
</Typography>


{/* Diretrizes Concluídas */}


</Box>




<Box
        sx={{
          width: "30%",
          fontSize: 14,
          fontWeight: "bold",
          alignItems: "center", // Garante alinhamento vertical
          gap: 1,
          //backgroundColor: "#f9f9f9",
          padding: "12px",
          borderTop: "1px solid #ccc",
          //borderBottom: "1px solid #ccc",
          color: "#9d9d9c",
        }}
      >
{/* Diretrizes Estratégicas Concluídas */}
<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  Diretrizes Estratégicas Concluídas:{" "}
  <Box
    sx={{
      marginTop: "3px",
      color: "#4caf50",
      fontWeight: "bold",
      marginLeft: "-3px",
    }}
  >
    {Array.isArray(project?.diretrizes)
      ? project.diretrizes.filter((diretriz) =>
          diretriz.taticas?.every((tatica) =>
            tatica.operacionais?.length > 0 && // Garantir que tem operacionais
            tatica.operacionais?.every((operacional) =>
              operacional.tarefas?.length > 0 &&
              operacional.tarefas?.every((tarefa) => tarefa.progresso === 100)
            )
          )
        ).length
      : 0}
  </Box>
</Typography>

{/* Diretrizes Táticas Concluídas (🚨 CORRIGIDO) */}
<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  Diretrizes Táticas Concluídas:{" "}
  <Box
    sx={{
      marginTop: "3px",
      color: "#4caf50",
      fontWeight: "bold",
      marginLeft: "-3px",
    }}
  >
    {Array.isArray(project?.diretrizes)
      ? project.diretrizes.reduce(
          (acc, diretriz) =>
            acc +
            (Array.isArray(diretriz.taticas)
              ? diretriz.taticas.filter((tatica) =>
                  tatica.operacionais?.length > 0 && // Garantir que há operacionais
                  tatica.operacionais.every((operacional) =>
                    operacional.tarefas?.length > 0 && // Garantir que há tarefas
                    operacional.tarefas.every((tarefa) => tarefa.progresso === 100)
                  )
                ).length
              : 0),
          0
        )
      : 0}
  </Box>
</Typography>


{/* Diretrizes Operacionais Concluídas */}
<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  Diretrizes Operacionais Concluídas:{" "}
  <Box
    sx={{
      marginTop: "3px",
      color: "#4caf50",
      fontWeight: "bold",
      marginLeft: "-3px",
    }}
  >
    {Array.isArray(project?.diretrizes)
      ? project.diretrizes.reduce(
          (acc, diretriz) =>
            acc +
            (diretriz.taticas?.reduce(
              (accT, tatica) =>
                accT +
                (tatica.operacionais?.filter((operacional) =>
                  Array.isArray(operacional.tarefas) &&  // Verifica se existem tarefas
                  operacional.tarefas.length > 0 &&  // Garante que há tarefas na operacional
                  operacional.tarefas.every((tarefa) => tarefa.progresso === 100) // Todas concluídas
                ).length || 0),
              0
            ) || 0),
          0
        )
      : 0}
  </Box>
</Typography>


{/* Total de Tarefas */}
<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  Total de Tarefas:{" "}
  <Box
    sx={{
      marginTop: "3px",
      color: "#2c2c88",
      fontWeight: "bold",
      marginLeft: "-3px",
    }}
  >
    {Array.isArray(project?.diretrizes)
      ? project.diretrizes.reduce(
          (acc, diretriz) =>
            acc +
            (diretriz.taticas?.reduce(
              (accT, tatica) =>
                accT +
                (tatica.operacionais?.reduce(
                  (accO, operacional) =>
                    accO + (Array.isArray(operacional.tarefas) ? operacional.tarefas.length : 0),
                  0
                ) || 0),
              0
            ) || 0),
          0
        )
      : 0}
  </Box>
</Typography>




{/* Tarefas Concluídas */}
<Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  Tarefas Concluídas:{" "}
  <Box
    sx={{
      marginTop: "3px",
      color: "#4caf50",
      fontWeight: "bold",
      marginLeft: "-3px",
    }}
  >
    {Array.isArray(project?.diretrizes)
      ? project.diretrizes.reduce(
          (acc, diretriz) =>
            acc +
            (diretriz.taticas?.reduce(
              (accT, tatica) =>
                accT +
                (tatica.operacionais?.reduce(
                  (accO, operacional) =>
                    accO +
                    (Array.isArray(operacional.tarefas)
                      ? operacional.tarefas.filter((tarefa) => tarefa.progresso === 100).length
                      : 0),
                  0
                ) || 0),
              0
            ) || 0),
          0
        )
      : 0}
  </Box>
</Typography>
</Box>




      








      

      <Box sx={{ mt: 7, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          onClick={handleExpand}
          disableRipple // Remove o efeito de clique
          sx={{
            minWidth: "auto", // Remove o espaço extra do botão
            padding: 0, // Remove o preenchimento interno
            "&:hover": {
              backgroundColor: "transparent", // Garante que não haja efeito ao passar o mouse
            },
            "& .MuiButton-startIcon": {
              margin: 0, // Remove o espaço entre o ícone e o botão
            },
          }}
        >
          {expanded ? (
            <FullscreenExitIcon sx={{ fontSize: 32, color: "#312783" }} /> // Aumenta o tamanho do ícone
          ) : (
            <FullscreenIcon sx={{ fontSize: 32, color: "#312783" }} /> // Aumenta o tamanho do ícone
          )}
      </Button>



        

        <Button
          onClick={handlePrint}
          disableRipple // Remove o efeito de clique
          sx={{
            backgroundColor: "transparent", // Remove o fundo
            border: "none", // Remove bordas padrão
            padding: "8px", // Espaço interno para tornar o botão clicável
            minWidth: "auto", // Ajusta o tamanho ao conteúdo
            "&:hover": {
              backgroundColor: "#f9f9fb", // Efeito de hover suave
            },
          }}
        >
          <PrintIcon sx={{ color: "#312783", fontSize: "24px" }} />
        </Button>



        {/** 
        <Button variant="contained" color="success" onClick={handleSavePDF}>
          Salvar PDF
        </Button>
        */}
      </Box>
    </Box>
  );
};

export default FluxoGrama;