import React from "react";
import { Box, Typography, Grid, Divider, InputBase, Toolbar, IconButton } from "@mui/material";
import { styled } from "@mui/system";

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

  // Converter o orçamento para número
  const orcamentoNumerico = parseFloat(
    orcamento.replace("R$", "").replace(".", "").replace(",", ".")
  ) || 0;

  // Formatar o orçamento
  const orcamentoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(orcamentoNumerico);

  // Calcular valor gasto somando os valores de todas as tarefas
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

  // Formatar valor gasto
  const valorGastoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorGasto);

  // Lógica de cores para o valor gasto
  const definirCorValorGasto = () => {
    const progresso = (valorGasto / orcamentoNumerico) * 100;
    if (progresso <= 50) {
      return "#4caf50"; // Verde
    } else if (progresso > 50 && progresso <= 100) {
      return "#ffc107"; // Amarelo
    } else {
      return "#f44336"; // Vermelho
    }
  };

  return (

    
    <Box
      sx={{
        transform: "scale(0.98)",
        transformOrigin: "top left",
        padding: 3,
        paddingTop: "0%",
        fontFamily: "Arial",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: 4,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Nome do Projeto */}
        <Grid item xs={3}>
          <StyledInput defaultValue={nome} disabled />
        </Grid>

        {/* Diretrizes e Tarefas */}
        <Grid item xs={9}>
          {diretrizes.map((diretriz, index) => {
            const progressoDiretriz = diretriz.tarefas.reduce(
              (acc, tarefa) => acc + (tarefa.progresso || 0),
              0
            ) / (diretriz.tarefas.length || 1); // Calcular progresso médio
            return (
              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
                key={index}
              >
                {/* Nome da Diretriz com Gráfico */}
                <Grid item xs={4}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StyledInput defaultValue={diretriz.descricao} disabled />
                    <CircleProgress percentage={Math.round(progressoDiretriz)} />
                  </Box>
                </Grid>

                {/* Linha Pontilhada */}
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

                {/* Nome das Tarefas */}
                <Grid item xs={6}>
                  {diretriz.tarefas.map((task, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        justifyContent: "space-between", // Garante alinhamento horizontal
                      }}
                    >
                      <StyledInput
                        defaultValue={task.tituloTarefa}
                        disabled
                        sx={{ width: "60%" }} // Ajusta largura do input
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
                          minWidth: "95px", // Garante largura mínima
                          marginTop: "30px",
                        }}
                      >
                        {task.planoDeAcao?.valor || "R$ 0,00"}{" "}
                        {/* Mostra o valor da tarefa */}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>

      {/* Rodapé */}
      <Divider sx={{ my: 4 }} />
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
    <span style={{ color: "#2c2c88", fontWeight: "bold" }}>{orcamentoFormatado}</span>
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
    <span style={{ color: "#2c2c88", fontWeight: "bold"  }}>{diretrizes?.length || 0}</span>
  </Typography>

  {/* Diretrizes Concluídas */}
  <Typography>
    Diretrizes concluídas:{" "}
    <span style={{ color: "#312783", fontWeight: "bold"  }}>
      {
        diretrizes?.filter((diretriz) =>
          diretriz.tarefas.every((tarefa) => tarefa.progresso === 100)
        ).length || 0
      }
    </span>
  </Typography>

  {/* Total de Tarefas */}
  <Typography>
    Tarefas:{" "}
    <span style={{ color: "#312783", fontWeight: "bold"  }}>
      {diretrizes?.reduce(
        (acc, diretriz) => acc + (diretriz.tarefas?.length || 0),
        0
      ) || 0}
    </span>
  </Typography>

  {/* Tarefas Concluídas */}
  <Typography>
    Tarefas Concluídas:{" "}
    <span style={{ color: "#312783", fontWeight: "bold"  }}>
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

    </Box>
  );
};

export default FluxoGrama;
