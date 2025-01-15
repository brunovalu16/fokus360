import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Lista from "../components/Lista";

const DadosProjeto = ({
  orcamento,
  valorGasto,
  totalDiretrizes,
  totalTarefas,
  diretrizes,
}) => {
  const calcularProgressoValorGasto = () => {
    const valorOrcamentoNumerico =
      parseFloat(orcamento.replace("R$", "").replace(".", "").replace(",", ".")) || 0;

    const valorGastoNumerico =
      parseFloat(valorGasto.replace("R$", "").replace(".", "").replace(",", ".")) || 0;

    if (valorOrcamentoNumerico === 0) return 0;

    return (valorGastoNumerico / valorOrcamentoNumerico) * 100;
  };

  const definirCorValorGasto = () => {
    const progresso = calcularProgressoValorGasto();

    if (progresso <= 70) {
      return "#4caf50"; // Verde
    } else if (progresso > 70 && progresso <= 100) {
      return "#ffeb3b"; // Amarelo
    } else {
      return "#f44336"; // Vermelho
    }
  };

  const progressoValorGasto = calcularProgressoValorGasto();

  // Função para calcular o total de tarefas concluídas
  const calcularTotalTarefasConcluidas = (diretrizes) => {
    return diretrizes.reduce((acc, diretriz) => {
      return (
        acc +
        (diretriz.tarefas?.filter((tarefa) => tarefa.progresso === 100).length || 0)
      );
    }, 0);
  };
  
  const totalTarefasConcluidas = calcularTotalTarefasConcluidas(diretrizes || []);

  // Criar Função para Calcular o Progresso Geral
  const calcularProgressoGeral = (diretrizIndex) => {
    const diretriz = diretrizes[diretrizIndex]; // Pega a diretriz pelo índice
    const totalTarefas = diretriz.tarefas.length; // Total de tarefas dentro da diretriz

    if (totalTarefas === 0) return 0; // Evita divisão por zero

    // Soma os progressos de todas as tarefas
    const progressoTotal = diretriz.tarefas.reduce((acc, tarefa) => {
      return acc + (tarefa.progresso || 0); // Adiciona o progresso de cada tarefa
    }, 0);

    // Calcula a média percentual
    return Math.round(progressoTotal / totalTarefas);
  };
  

  const items = [
    {
      title: orcamento,
      subtitle: "Orçamento",
      progress: 0,
      icon: <PaidIcon sx={{ color: "#fff", fontSize: "50px" }} />,
      progressColor: "#4caf50",
    },
    {
      title: valorGasto,
      subtitle: "Valor gasto",
      icon: <PaidIcon sx={{ color: "#fff", fontSize: "50px" }} />,
      progressColor: definirCorValorGasto(), // Define a cor da bola com base no progresso
      customIndicator: (
        <Box
          sx={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: definirCorValorGasto(), // Cor da bola
          }}
        />
      ),
    },    
    {
      title: `Total de diretrizes: ${totalDiretrizes || 0}  \nDiretrizes Concluídas: ${
        diretrizes.filter(
          (d) => calcularProgressoGeral(diretrizes.indexOf(d)) === 100
        ).length || 0
      }`, // Inclui total e as concluídas no título
      icon: <AssignmentTurnedInIcon sx={{ color: "#fff", fontSize: "50px" }} />,
      /**
      progress:
        totalDiretrizes > 0
          ? (diretrizes.filter(
              (d) => calcularProgressoGeral(diretrizes.indexOf(d)) === 100
            ).length /
              totalDiretrizes) *
            100
          : 0, // Progresso em porcentagem
      
      progressColor:
        diretrizes.filter(
          (d) => calcularProgressoGeral(diretrizes.indexOf(d)) === 100
        ).length === totalDiretrizes
          ? "#4caf50" // Verde se todas as diretrizes estão finalizadas
          : "#f44336", // Vermelho caso contrário
      */
    },    
    {
      title: `Total de tarefas: ${totalTarefas || 0} \nTarefas Concluídas: ${totalTarefasConcluidas || 0}`, // Inclui o total e as concluídas no título
      //subtitle: "Tarefas concluídas",
      icon: <AssignmentTurnedInIcon sx={{ color: "#fff", fontSize: "50px" }} />,
      /** 
      progress: totalTarefas > 0 ? (totalTarefasConcluidas / totalTarefas) * 100 : 0, // Progresso em porcentagem
      progressColor:
        totalTarefasConcluidas === totalTarefas
          ? "#4caf50" // Verde quando todas estão concluídas
          : "#f44336", // Vermelho caso contrário
      */
    },
    
  ];

  return (
    <Box
      sx={{
        marginLeft: "40px",
        marginTop: "-15px",
        width: "calc(100% - 100px)",
        minHeight: "50vh",
        padding: "15px",
        paddingLeft: "30px",
        borderRadius: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        bgcolor: "#f2f0f0",
        overflowX: "hidden",
      }}
    >
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap="8px"
        paddingBottom="20px"
        paddingTop="20px"
        borderRadius="20px"
        sx={{
          overflowX: "hidden",
        }}
      >
        {items.map((item, index) => (
          <Box
          key={index}
          boxShadow={3}
          borderRadius="20px"
          bgcolor={item.title === valorGasto ? definirCorValorGasto() : "#312783"} // Altera o fundo com base no item
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          padding="10px"
          minWidth="200px"
            sx={{
              textAlign: "center",
              overflow: "hidden",
              minHeight: "140px",
              flexShrink: 0,
              maxWidth: "100%",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                minWidth: "50px",
                height: "50px",
              }}
            >
              {item.icon}
            </Box>

            <Box
              sx={{
                width: "2px",
                height: "80%",
                backgroundColor: "#ffffff4d",
                margin: "0 10px",
              }}
            />

            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              sx={{
                flex: 1,
                textAlign: "center",
                marginLeft: "10px",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#fff", fontSize: "13px", whiteSpace: "pre-line", textJustify: "inter-word", textAlign: "left", }}
              >
                {item.title}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "#fff", fontSize: "13px", textJustify: "inter-word", textAlign: "left",  }}>
                {item.subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      {/** COMPONENTE */}
      <Lista />
    </Box>
  );
};

export default DadosProjeto;
