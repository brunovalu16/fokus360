import React, { useState, useRef } from "react";
import { Box, Typography, Grid, Divider, InputBase, Button } from "@mui/material";
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

  const estrategicas = project?.diretrizes || [];
  // ✅ Agora sempre existe, evitando undefined

  const {
    nome = project?.nome || "Nome do Projeto",
    diretrizes = [],
    orcamento = project?.orcamento || "R$ 0,00",
  } = project;

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






















<Grid container spacing={2} alignItems="center" sx={{ marginBottom: "50px" }}>
  <Grid item xs={3}>
    <Typography sx={{ fontSize: "9px", color: "#555", marginTop: "60px", marginBottom: "-28px", marginLeft: "10px" }}>
      Projeto
    </Typography>
    <StyledInput defaultValue={nome} disabled sx={{
      backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #dcdcdc",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    }} />
  </Grid>

  <Grid item xs={9}>
    {estrategicas.map((estrategica, indexEstr) =>
      estrategica.taticas.map((tatica, indexTat) =>
        tatica.operacionais.map((operacional, indexOp) => {
          const progressoOperacional =
            operacional.tarefas.reduce((acc, tarefa) => acc + (tarefa.progresso || 0), 0) /
            (operacional.tarefas.length || 1);

          return (
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }} key={`${indexEstr}-${indexTat}-${indexOp}`}>
              
              <Grid item xs={3}>
                <Typography sx={{ fontSize: "9px", color: "#555", marginTop: "60px", marginBottom: "-28px", marginLeft: "10px" }}>
                  Diretriz Estratégica
                </Typography>
                <StyledInput defaultValue={estrategica.titulo} disabled sx={{
                  backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #dcdcdc",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }} />
              </Grid>

              <Grid item xs={3}>
                <Typography sx={{ fontSize: "9px", color: "#555", marginTop: "60px", marginBottom: "-28px", marginLeft: "10px" }}>
                  Diretriz Tática
                </Typography>
                <StyledInput defaultValue={tatica.titulo} disabled sx={{
                  backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #dcdcdc",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }} />
              </Grid>

              <Grid item xs={3}>
                <Typography sx={{ fontSize: "9px", color: "#555", marginTop: "60px", marginBottom: "-28px", marginLeft: "10px" }}>
                  Diretriz Operacional
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <StyledInput defaultValue={operacional.titulo} disabled sx={{
                    backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #dcdcdc",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", width: "120%"
                  }} />
                  <CircleProgress percentage={Math.round(progressoOperacional)} />
                </Box>
              </Grid>

              <Grid item xs={3}>
                <Typography sx={{ fontSize: "9px", color: "#555", marginLeft: "10px", marginTop: "65px" }}>
                  Tarefas
                </Typography>
                {operacional.tarefas.map((task, i) => (
                  <Box key={i} sx={{
                    marginTop: "-28px", display: "flex", alignItems: "center",
                    mb: 1, justifyContent: "space-between"
                  }}>
                    <StyledInput defaultValue={task.tituloTarefa} disabled sx={{
                      marginTop: "30px", backgroundColor: "#fff", borderRadius: "8px",
                      border: "1px solid #dcdcdc", width: "100%",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", marginRight: "3px"
                    }} />
                    <CircleProgress percentage={task.progresso || 0} />
                    <Typography sx={{
                      ml: 2, color: "#555", padding: "6px 12px",
                      textAlign: "center", minWidth: "1px", width: "20px",
                      marginTop: "30px", marginLeft: "-5px", fontWeight: "bold"
                    }}>
                      <Typography sx={{ fontSize: "10px" }}>Valor</Typography>
                      {task.planoDeAcao?.valor || "R$ 0,00"}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          );
        })
      )
    )}
  </Grid>
</Grid>











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
