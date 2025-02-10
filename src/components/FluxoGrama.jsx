import React, { useState, useRef } from "react";
import { Box, Typography, Grid, Divider, InputBase, Button, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { jsPDF } from "jspdf";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PrintIcon from "@mui/icons-material/Print";


const StyledInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "#b7b7b7",
  padding: "10px 10px",
  borderBottom: "1px solid #b7b7b7",
  borderLeft: "1px solid #b7b7b7",
  fontWeight: "bold",
  textAlign: "center",
  width: "100%",
  marginTop: "30px",
}));

const CircleProgress = ({ percentage }) => {
  const circleColor =
    percentage === 100
      ? "#4caf50"
      : percentage >= 50
      ? "#ffc107"
      : "#f44336";

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        width: "40px",
        height: "40px",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          border: `6px solid ${circleColor}`,
          backgroundColor: "#fff",
          zIndex: 1,
          marginTop: "30px",
        }}
      ></Box>
    </Box>
  );
};

const FluxoGrama = ({ project }) => {
  console.log("🛠 Dados completos do projeto:", project);
console.log("🛠 Nome do projeto:", project?.nome);
console.log("🛠 Estruturado project:", JSON.stringify(project, null, 2));
  console.log("Dados do projeto recebidos:", project);
  console.log("Estratégicas:", project?.estrategicas);
  const [expanded, setExpanded] = useState(false); // Estado para controlar a expansão da tela
  const containerRef = useRef(); // Referência ao container para PDF e impressão




  if (!project) {
    return (
      <Typography sx={{ textAlign: "center", marginTop: 4 }}>
        Nenhum projeto encontrado.
      </Typography>
    );
  }

  const estrategicas = Array.isArray(project?.diretrizes) ? project.diretrizes : [];
  // ✅ Agora sempre existe, evitando undefined

  const nome = project && project.nome ? project.nome : "Nome do Projeto";
  const diretrizes = project?.diretrizes || [];
  const orcamento = project?.orcamento || "R$ 0,00";


  const orcamentoNumerico = parseFloat(
    orcamento.replace("R$", "").replace(".", "").replace(",", ".")
  ) || 0;

  const orcamentoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(orcamentoNumerico);

  const valorGasto = diretrizes.reduce((total, diretriz) => {
    const valorDiretriz = diretriz.tarefas?.reduce((acc, tarefa) => {
      const valor = parseFloat(
        (tarefa.planoDeAcao?.valor || "R$ 0,00")
          .replace("R$", "")
          .replace(".", "")
          .replace(",", ".")
      );
      return acc + (isNaN(valor) ? 0 : valor);
    }, 0);
    return total + valorDiretriz;
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
        width: expanded ? "100vw" : "100%",
        transform: expanded ? "none" : "scale(0.98)",
        transformOrigin: "top left",
        padding: 4,
        backgroundColor: "#f9f9fb", // Fundo mais moderno
        border: "1px solid #e0e0e0", // Cor suave para borda
        borderRadius: "12px", // Cantos arredondados
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)", // Sombras suaves
        position: expanded ? "fixed" : "relative",
        top: expanded ? 0 : "auto",
        left: expanded ? 0 : "auto",
        right: expanded ? 0 : "auto",
        bottom: expanded ? 0 : "auto",
        zIndex: expanded ? 9999 : "auto",
        height: expanded ? "100vh" : "auto",
        overflowX: "hidden",
        overflowY: "auto",
        marginBottom: "auto",
        
      }}
    >


























<Grid container spacing={6} sx={{ marginTop: "20px", alignItems: "center", marginLeft: "20px", position: "relative" }}>
  {/* Nome do Projeto */}
  <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#555", marginRight: "10px", marginLeft: "-25px" }}>
      Nome do Projeto:
  </Typography>

  <Box
      sx={{
        backgroundColor: "#343A40",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: "5px",
        fontSize: "12px",
        fontWeight: "bold",
        textAlign: "center",
        maxWidth: "100%",
        width: "auto",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
        position: "relative",
        "@media print": {
          WebkitPrintColorAdjust: "exact", // Força a impressão das cores no Safari e Chrome
          printColorAdjust: "exact", // Força em outros navegadores
        },
      }}
    >
      {nome}
    </Box>
  
  {/* Estrutura Hierárquica */}
  {estrategicas.map((estrategica, indexEstr) => (
    <Grid container key={indexEstr} spacing={6}
    sx={{ marginBottom: "30px",
          alignItems: "center",
          position: "relative",
          "@media print": {
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            backgroundColor: "inherit", // Mantém a cor de fundo
            color: "inherit", // Mantém a cor do texto
          }
          }}>

      {/* Coluna 1: Diretriz Estratégica */}
      <Grid item xs={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "10px" }}>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#555", marginBottom: "5px" }}>
          Diretriz Estratégica
        </Typography>
        <Box sx={{
          backgroundColor: "#007BFF", color: "#fff",
          borderRadius: "5px", padding: "8px",
          maxWidth: "100%", width: "100%",
          textAlign: "center", fontSize: "12px",
          position: "relative",
        }}>
          {estrategica.titulo}

          {/* Linha para conectar com táticas se existirem */}
          {estrategica.taticas?.length > 0 && (
              <Box sx={{
                position: "absolute",
                top: "50%",
                left: "100%",
                width: "45px",
                borderTop: "1px dashed #555"
              }} />
          )}
          
          
        </Box>
      </Grid>




{/* Coluna 2: Táticas - Agora com a lógica correta para conexão vertical única */}
<Grid item xs={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "10px" }}>
  {estrategica.taticas?.length > 0 && (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      width: "100%",
      marginY: "35px",
        "@media print": {
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          backgroundColor: "inherit", // Mantém a cor de fundo
          color: "inherit", // Mantém a cor do texto
        }

    }}>
      {/* Linha vertical única conectando todas as Táticas dentro da Estratégica */}
      {estrategica.taticas.length > 1 && (
        <Box sx={{
          position: "absolute",
          left: "-15px",
          top: "0",
          height: "50%",
          marginTop: "49px",
          borderLeft: "1px dashed #555",
        }} />
      )}

      {estrategica.taticas?.map((tatica, indexTat) => {
        const totalOperacionais = tatica.operacionais?.length || 0; // Número de operacionais dentro da tática

        return (
          <Box key={indexTat} sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100%",
            marginBottom: "30px",
            marginTop: "30px",
            "@media print": {
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
              backgroundColor: "inherit", // Mantém a cor de fundo
              color: "inherit", // Mantém a cor do texto
            }

          }}>
            <Box sx={{
              backgroundColor: "#28A745", color: "#fff",
              borderRadius: "5px", padding: "8px",
              maxWidth: "100%", width: "100%",
              textAlign: "center", fontSize: "12px",
              position: "relative",
            }}>
              {tatica.titulo}

              {/* Linha horizontal conectando Tática → Operacionais (só aparece se houver operacionais) */}
              {totalOperacionais > 0 && (
           
                  <Box sx={{
                    position: "absolute",
                    left: "100%",
                    top: "50%",
                    width: "40px",
                    borderTop: "1px dashed #555"
                  }} />
          
              )}

              {/* Linha horizontal conectando cada Tática à linha central */}
              {estrategica.taticas.length > 1 && (
                <Box sx={{
                  position: "absolute",
                  left: "-15px",
                  top: "50%",
                  width: "15px",
                  borderTop: "1px dashed #555"
                }} />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  )}
</Grid>



  
{/* Coluna 3: Operacionais - Agora com a lógica condicional correta para conexão com Tarefas */}
<Grid item xs={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "10px" }}>
  {estrategica.taticas?.map((tatica) => {
    const totalOperacionais = tatica.operacionais?.length || 1; // Número de operacionais dentro da tática

    return (
      <Box key={tatica.titulo} sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "100%",
        marginY: "18px",
        "@media print": {
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          backgroundColor: "inherit", // Mantém a cor de fundo
          color: "inherit", // Mantém a cor do texto
        }

      }}>
        {/* Linha vertical central conectando Tática → Operacionais */}
        {totalOperacionais > 1 && (
          <Box sx={{
            position: "absolute",
            left: "-15px",
            top: "50%",
            height: `${totalOperacionais * 23}px`,
            borderLeft: "1px dashed #555",
            transform: "translateY(-60%)"
          }} />
        )}

        {tatica.operacionais?.map((operacional, indexOp) => {
          const totalTarefas = operacional.tarefas?.length || 0; // Número de tarefas dentro da operacional

          return (
            <Box key={indexOp} sx={{
              backgroundColor: "#DC3545", color: "#fff",
              borderRadius: "5px", padding: "8px",
              maxWidth: "100%", width: "100%",
              textAlign: "center", fontSize: "12px",
              position: "relative",
              marginBottom: "12px"
            }}>
              {operacional.titulo}

              {/* Linha horizontal conectando Operacional → Tarefas (só aparece se houver tarefas) */}
              {totalTarefas > 0 && (
                <>
                <Box sx={{
                  position: "absolute",
                  left: "100%",
                  top: "50%",
                  width: "40px",
                  borderTop: "1px dashed #555"
                }} />
                
                </>
              )}

              {/* Linha horizontal conectando cada Operacional à linha central */}
              {totalOperacionais > 1 && (
                <Box sx={{
                  position: "absolute",
                  left: "-15px",
                  top: "50%",
                  width: "15px",
                  borderTop: "1px dashed #555"
                }} />
              )}
            </Box>
          );
        })}
      </Box>
    );
  })}
</Grid>



      {/* Coluna 4: Tarefas - Agora Centralizadas */}
      <Grid item xs={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "10px" }}>
        {estrategica.taticas?.map((tatica) =>
          tatica.operacionais?.map((operacional) => {
            const totalTarefas = operacional.tarefas?.length || 1;

            return (
              <Box key={operacional.titulo} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                width: "100%",
                marginY: "18px",
                "@media print": {
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                  backgroundColor: "inherit", // Mantém a cor de fundo
                  color: "inherit", // Mantém a cor do texto
                }

              }}>
                {/* Linha vertical central conectando tarefas */}
                {totalTarefas > 1 && (
                  <Box sx={{
                    position: "absolute",
                    left: "-15px",
                    top: "50%",
                    height: `${totalTarefas * 24}px`,
                    borderLeft: "1px dashed #555",
                    transform: "translateY(-60%)"
                  }} />
                )}

                {operacional.tarefas?.map((task, i) => (
                  <Box key={i} sx={{
                    backgroundColor: "#ffb600", color: "#fff",
                    borderRadius: "5px", padding: "8px",
                    maxWidth: "100%", width: "100%",
                    textAlign: "center", fontSize: "12px",
                    marginBottom: "12px",
                    position: "relative",
                  }}>
                    {task.tituloTarefa}

                    {/* Linha horizontal conectando cada tarefa à linha central */}
                    {totalTarefas > 1 && (
                      <Box sx={{
                        position: "absolute",
                        left: "-15px",
                        top: "50%",
                        width: "15px",
                        borderTop: "1px dashed #555",
                      }} />
                    )}
                  </Box>
                ))}
              </Box>
            );
          })
        )}
      </Grid>

    </Grid>
  ))}
</Grid>;





















      {/**<Divider sx={{ my: 4 }} /> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 14,
          fontWeight: "bold",
          alignItems: "center", // Garante alinhamento vertical
          gap: 1,
          //backgroundColor: "#f9f9f9",
          padding: "12px",
          borderTop: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
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

        {/* Total de Diretrizes */}
        <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          Diretrizes:{" "}
          <Box
            sx={{
              marginTop: "3px",
              color: "#2c2c88", // Texto em azul escuro
              fontWeight: "bold",
              marginLeft: "-3px",
            }}
          >
            {diretrizes?.length || 0}
          </Box>
        </Typography>

        {/* Diretrizes Concluídas */}
        <Typography>
          Diretrizes concluídas:{" "}
          <span style={{ color: "#312783", fontWeight: "bold" }}>
            {diretrizes?.filter((diretriz) =>
              Array.isArray(diretriz.tarefas) && diretriz.tarefas.every((tarefa) => tarefa.progresso === 100)
            ).length || 0}
          </span>
        </Typography>

        {/* Total de Tarefas */}
        <Typography>
          Tarefas:{" "}
          <span style={{ color: "#312783", fontWeight: "bold" }}>
            {diretrizes?.reduce(
              (acc, diretriz) => acc + (diretriz.tarefas?.length || 0),
              0
            ) || 0}
          </span>
        </Typography>

        {/* Tarefas Concluídas */}
        <Typography>
          Tarefas Concluídas:{" "}
          <span style={{ color: "#312783", fontWeight: "bold" }}>
            {diretrizes?.reduce(
              (acc, diretriz) =>
                acc +
                (diretriz.tarefas?.filter((tarefa) => tarefa.progresso === 100)
                  .length || 0),
              0
            ) || 0}
          </span>
        </Typography>
      </Box>








      

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
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