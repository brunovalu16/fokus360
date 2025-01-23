import React, { useState, useRef } from "react";
import { Box, Typography, Grid, Divider, InputBase, Button } from "@mui/material";
import { styled } from "@mui/system";
import { jsPDF } from "jspdf";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";


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
  const [expanded, setExpanded] = useState(false); // Estado para controlar a expansão da tela
  const containerRef = useRef(); // Referência ao container para PDF e impressão

  if (!project) {
    return (
      <Typography sx={{ textAlign: "center", marginTop: 4 }}>
        Nenhum projeto encontrado.
      </Typography>
    );
  }

  const {
    nome = "Nome do Projeto",
    diretrizes = [],
    orcamento = "R$ 0,00", // Orçamento vindo do banco como string formatada
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
        width: expanded ? "100vw" : "110%", // Usa 100vw quando expandido
        transform: expanded ? "none" : "scale(0.98)",
        transformOrigin: "top left",
        padding: 3,
        paddingTop: "0%",
        fontFamily: "Arial",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: 4,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        position: expanded ? "fixed" : "relative",
        top: expanded ? 0 : "auto",
        left: expanded ? 0 : "auto",
        right: expanded ? 0 : "auto",
        bottom: expanded ? 0 : "auto",
        zIndex: expanded ? 9999 : "auto",
        height: expanded ? "100vh" : "auto",
        overflow: "auto",
      }}
    >
      <Grid container spacing={2} alignItems="center"
      sx={{ marginBottom: "50px" }}
      >
        <Grid item xs={3}>
          <StyledInput defaultValue={nome} disabled />
        </Grid>

        <Grid item xs={9}>
          {diretrizes.map((diretriz, index) => {
            const progressoDiretriz =
              diretriz.tarefas.reduce(
                (acc, tarefa) => acc + (tarefa.progresso || 0),
                0
              ) / (diretriz.tarefas.length || 1);
            return (
              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
                key={index}
              >
                <Grid item xs={4}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StyledInput defaultValue={diretriz.descricao} disabled />
                    <CircleProgress percentage={Math.round(progressoDiretriz)} />
                  </Box>
                </Grid>

                <Grid item xs={1}>
                  <Box
                    sx={{
                      height: "2px",
                      width: "100%",
                      borderTop: "2px dashed #ccc",
                      position: "relative",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      marginTop: "30px",
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  {diretriz.tarefas.map((task, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <StyledInput
                        defaultValue={task.tituloTarefa}
                        disabled
                        sx={{ width: "60%" }}
                      />
                      <CircleProgress percentage={task.progresso || 0} />
                      <Typography
                        sx={{
                          ml: 2,
                          color: "#333",
                          padding: "6px 12px",
                          borderBottom: "1px solid #b7b7b7",
                          borderLeft: "1px solid #b7b7b7",
                          textAlign: "center",
                          minWidth: "95px",
                          marginTop: "30px",
                        }}
                      >
                        {task.planoDeAcao?.valor || "R$ 0,00"}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>

      {/**<Divider sx={{ my: 4 }} /> */}
      <Box
        sx={{
          //display: "flex",
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
          <span style={{ color: "#2c2c88", fontWeight: "bold" }}>
            {orcamentoFormatado}
          </span>
        </Typography>

        {/* Valor Gasto com Indicador */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>
            Valor gasto:{" "}
            <span style={{ color: "#000" }}>{valorGastoFormatado}</span>
          </Typography>
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor:
                valorGasto <= orcamentoNumerico * 0.5
                  ? "#4caf50" // Verde
                  : valorGasto <= orcamentoNumerico
                  ? "#ffc107" // Amarelo
                  : "#f44336", // Vermelho
            }}
          ></Box>
        </Box>

        {/* Total de Diretrizes */}
        <Typography>
          Diretrizes:{" "}
          <span style={{ color: "#2c2c88", fontWeight: "bold" }}>
            {diretrizes?.length || 0}
          </span>
        </Typography>

        {/* Diretrizes Concluídas */}
        <Typography>
          Diretrizes concluídas:{" "}
          <span style={{ color: "#312783", fontWeight: "bold" }}>
            {diretrizes?.filter((diretriz) =>
              diretriz.tarefas.every((tarefa) => tarefa.progresso === 100)
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
        sx={{
          minWidth: "auto", // Remove o espaço extra do botão
          padding: 0, // Remove o preenchimento interno
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


        <Button variant="contained" color="secondary" onClick={handlePrint}
        sx={{ 
          backgroundColor: "#312783",
          color: "#fff",
            "&:hover": {
              backgroundColor: "#312783"
            }, }}
        >
          Imprimir
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
