import React, { useState, useRef } from "react";
import { Box, Typography, Grid, Divider, InputBase, Button, TextField, CircularProgress } from "@mui/material";
import { fontSize, styled } from "@mui/system";
import { jsPDF } from "jspdf";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PrintIcon from "@mui/icons-material/Print";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../data/firebase-config"; // ou onde estiver




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


const [novaEstrategica, setNovaEstrategica] = useState("");
const [descEstrategica, setDescEstrategica] = useState("");

const [projectId, setProjectId] = useState(""); // se você pega de outro lugar






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




  const StatusProgressoEstrategica = ({ taticas }) => {
    if (!taticas || taticas.length === 0) {
      return null; // Se não houver táticas, não exibe nada
    }
  
    // Filtrar apenas as táticas que possuem progresso válido
    const taticasComProgresso = taticas.filter(
      (tatica) => tatica.operacionais && tatica.operacionais.some(op => op.tarefas && op.tarefas.length > 0)
    );
  
    if (taticasComProgresso.length === 0) {
      return null; // Se nenhuma tática tiver progresso válido, não exibe o progresso da Estratégica
    }
  
    // Soma os progressos das táticas válidas e calcula a média
    const progressoTotal = taticasComProgresso.reduce(
      (acc, tatica) => acc + calcularProgressoTatica(tatica), 
      0
    );
    const progressoMedio = Math.round(progressoTotal / taticasComProgresso.length); // Calcula a média apenas das táticas com progresso válido
  
    let color;
    let statusText;
  
    if (progressoMedio === 100) {
      color = "#4CAF50"; // Verde (Concluído)
      statusText = "Concluído";
    } else if (progressoMedio >= 50) {
      color = "#FF9800"; // Laranja (Meio caminho)
      statusText = `${progressoMedio}% concluído`;
    } else if (progressoMedio > 0) {
      color = "#F44336"; // Vermelho (Pouco progresso)
      statusText = `${progressoMedio}% concluído`;
    } else {
      color = "#F44336"; // Vermelho (Não iniciada)
      statusText = "Não iniciada";
    }
  
    return (
      <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: "10px", marginTop: "20px" }}>
        <CircularProgress
          variant="determinate"
          value={progressoMedio}
          sx={{ color }}
          thickness={10}
          size={40}
        />
        <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#9d9d9c" }}>
          {statusText}
        </Typography>
      </Box>
    );
  };


  function calcularProgressoTatica(tatica) {
    const { operacionais = [] } = tatica;
    if (operacionais.length === 0) return 0;
  
    let somaPorcentagens = 0;
  
    for (const op of operacionais) {
      if (!op.tarefas || op.tarefas.length === 0) {
        // sem tarefas => 0%
        somaPorcentagens += 0;
      } else {
        // Para cada tarefa, some 'tarefa.progresso', depois tire a média
        const total = op.tarefas.length;
        const somaProgresso = op.tarefas.reduce((acc, t) => acc + (t.progresso ?? 0), 0);
        // 100% por tarefa = 100 * total
        // Proporção do op = (somaProgresso / (100 * total)) * 100
        const porcentagemOperacional = (somaProgresso / (100 * total)) * 100;
        somaPorcentagens += porcentagemOperacional;
      }
    }
  
    // Média dos operacionais
    return Math.round(somaPorcentagens / operacionais.length);
  }
  


  const StatusProgressoTatica = ({ operacionais }) => {
    if (!operacionais || operacionais.length === 0) {
      return null; // Se não houver operacionais, não exibe nada
    }
  
    // Filtrar apenas as operacionais que têm progresso calculado
    const operacionaisComProgresso = operacionais.filter(op => op.tarefas && op.tarefas.length > 0);
  
    if (operacionaisComProgresso.length === 0) {
      return null; // Se nenhuma operacional tiver tarefas, não exibe o progresso da Tática
    }
  
    // Soma os progressos das operacionais válidas e calcula a média
    const progressoTotal = operacionaisComProgresso.reduce(
      (acc, operacional) => acc + calcularProgressoOperacional(operacional), 
      0
    );
    const progressoMedio = Math.round(progressoTotal / operacionaisComProgresso.length); // Calcula a média apenas das operacionais com progresso válido
  
    let color;
    let statusText;
  
    if (progressoMedio === 100) {
      color = "#4CAF50"; // Verde (Concluído)
      statusText = "Concluído";
    } else if (progressoMedio >= 50) {
      color = "#FF9800"; // Laranja (Meio caminho)
      statusText = `${progressoMedio}% concluído`;
    } else if (progressoMedio > 0) {
      color = "#F44336"; // Vermelho (Pouco progresso)
      statusText = `${progressoMedio}% concluído`;
    } else {
      color = "#F44336"; // Vermelho (Não iniciada)
      statusText = "Não iniciada";
    }
  
    return (
      <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: "10px", marginTop: "20px" }}>
        <CircularProgress
          variant="determinate"
          value={progressoMedio}
          sx={{ color }}
          thickness={10}
          size={40}
        />
        <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#9d9d9c" }}>
          {statusText}
        </Typography>
      </Box>
    );
  };

  

  const calcularProgressoEstrategica = ({ taticas }) => { // Recebe as táticas como argumento
    if (!taticas || taticas.length === 0) {
        return 0; // Se não houver táticas, não exibe nada
    }
  
      // Filtrar apenas as táticas que possuem progresso válido
      const taticasComProgresso = taticas.filter(
        (tatica) => tatica.operacionais && tatica.operacionais.some(op => op.tarefas && op.tarefas.length > 0)
      );
  
      if (taticasComProgresso.length === 0) {
        return 0; // Se nenhuma tática tiver progresso válido, não exibe o progresso da Estratégica
    }
  
    // Soma os progressos das táticas válidas e calcula a média
    const progressoTotal = taticasComProgresso.reduce(
        (acc, tatica) => acc + calcularProgressoTatica(tatica),
        0
    );
    const progressoMedio = Math.round(progressoTotal / taticasComProgresso.length);
    return progressoMedio;
  };


// -------------------------------------
  // Criar nova Diretriz Estratégica
  // -------------------------------------
  const handleAddEstrategica = () => {
    if (!novaEstrategica.trim() || !descEstrategica.trim()) {
      alert("Preencha o nome e a descrição da Diretriz Estratégica!");
      return;
    }
  
    const novaDiretriz = {
      id: `estrategica-${Date.now()}`,
      titulo: novaEstrategica,
      descricao: descEstrategica,
      taticas: [],
    };
  
    setDiretrizes((prev) => [...prev, novaDiretriz]); // 🔹 Agora mantém os dados existentes e adiciona uma nova diretriz
  
   // 🔥 Atualiza no Firestore *sem apagar os dados existentes*
  if (projectId) {
    const docRef = doc(db, "projetos", projectId);
    updateDoc(docRef, {
      diretrizes: arrayUnion(novaDiretriz) // 🔹 Usa arrayUnion para adicionar, *não* sobrescrever
    })
    .then(() => console.log("✅ Nova diretriz adicionada ao Firestore!"))
    .catch((err) => console.error("❌ Erro ao atualizar Firestore:", err));
  }
    
    // Limpa os campos do formulário sem afetar a lista de diretrizes
    setNovaEstrategica("");
    setDescEstrategica("");
  };

  const handleEditTatica = (indexEstrategica, indexTatica, field, value) => {
    setDiretrizes((prevDiretrizes) => {
      const updated = [...prevDiretrizes];
      updated[indexEstrategica].taticas[indexTatica] = {
        ...updated[indexEstrategica].taticas[indexTatica],
        [field]: value,
      };
      return updated;
    });
  };
  
  const handleEditOperacional = (indexEstrategica, indexTatica, indexOperacional, field, value) => {
    setDiretrizes((prevDiretrizes) => {
      const updated = [...prevDiretrizes];
      updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional] = {
        ...updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional],
        [field]: value,
      };
      return updated;
    });
  };
  
  const handleEditTarefa = (indexEstrategica, indexTatica, indexOperacional, indexTarefa, field, value) => {
    setDiretrizes((prevDiretrizes) => {
      const updated = JSON.parse(JSON.stringify(prevDiretrizes)); // 🔹 Cópia profunda
  
      // 🔹 Verifica se a estrutura existe antes de acessar
      if (!updated[indexEstrategica]?.taticas?.[indexTatica]?.operacionais?.[indexOperacional]?.tarefas?.[indexTarefa]) {
        console.error("❌ Erro: Índices inválidos para acessar a estrutura de tarefas.");
        return prevDiretrizes; // Retorna sem alterar caso algo esteja `undefined`
      }
  
      // 🔹 Atualiza corretamente o título da tarefa ou os campos do planoDeAcao
      if (field === "tituloTarefa") {
        updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional].tarefas[indexTarefa].tituloTarefa = value;
      } else {
        updated[indexEstrategica].taticas[indexTatica].operacionais[indexOperacional].tarefas[indexTarefa].planoDeAcao[field] = value;
      }
  
      return updated;
    });
  };

  const handleAddTatica = (indexEstrategica) => {
    const novaTatica = {
      id: `tatica-${Date.now()}`,
      titulo: "Nova Diretriz Tática",
      descricao: "Descrição da diretriz",
      operacionais: [],
    };
    setDiretrizes((prev) => {
      const updated = [...prev];
      updated[indexEstrategica].taticas.push(novaTatica);
      return updated;
    });
  };

  const calcularProgressoOperacional = (operacional) => {
    if (!operacional.tarefas || operacional.tarefas.length === 0) return 0;
  
    const totalProgresso = operacional.tarefas.reduce((acc, tarefa) => acc + (tarefa.progresso || 0), 0);
    return Math.round(totalProgresso / operacional.tarefas.length);
  };
  

  function StatusProgressoTotal({ tarefas }) {
    if (!Array.isArray(tarefas) || tarefas.length === 0) {
      return null; // Retorna nada se "tarefas" for undefined ou vazio
    }
  
    const progressoTotal = tarefas.reduce((acc, tarefa) => {
      if (!tarefa || typeof tarefa !== "object") return acc; // Evita erro se alguma tarefa for undefined
      return acc + calcularProgresso(tarefa);
    }, 0);
    const progressoMedio = Math.round(progressoTotal / tarefas.length); // Calcula a média
  
    let color;
    let statusText;
  
    if (progressoMedio === 100) {
      color = "#4CAF50"; // Verde (Concluído)
      statusText = "Concluído";
    } else if (progressoMedio >= 50) {
      color = "#FF9800"; // Laranja (Meio caminho)
      statusText = `${progressoMedio}% concluído`;
    } else if (progressoMedio > 0) {
      color = "#F44336"; // Vermelho (Pouco progresso)
      statusText = `${progressoMedio}% concluído`;
    } else {
      color = "#F44336"; // Vermelho (Não iniciada)
      statusText = "Não iniciada";
    }
  
    return (
      <Box display="flex" alignItems="center" gap={1} sx={{ marginLeft: "10px", marginTop: "20px" }}>
        <CircularProgress
          variant="determinate"
          value={progressoMedio}
          sx={{ color }}
          thickness={10}
          size={40}
        />
        <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#9d9d9c" }}>
          {statusText}
        </Typography>
      </Box>
    );
  };

  function calcularProgresso(tarefa) {
    if (!tarefa || typeof tarefa !== "object") return 0; // Evita erro se tarefa for undefined
    return tarefa.progresso ?? 0;
  }
  
  


  function countDiretrizes(diretrizes = []) {
    // Cada objeto do array "diretrizes" já é uma Diretriz Estratégica
    return diretrizes.length;
  }
  
  function countDiretrizesConcluidas(diretrizes = []) {
    let concluidas = 0;
  
    for (const diretriz of diretrizes) {
      // Uma Diretriz é concluída se TODAS as suas Táticas estiverem concluídas
      if (isDiretrizConcluida(diretriz)) {
        concluidas++;
      }
    }
  
    return concluidas;
  }


  function countTaticas(diretrizes = []) {
    // Soma total de táticas de cada diretriz
    let total = 0;
    for (const diretriz of diretrizes) {
      total += (diretriz.taticas?.length || 0);
    }
    return total;
  }
  
  function countTaticasConcluidas(diretrizes = []) {
    let concluidas = 0;
  
    for (const diretriz of diretrizes) {
      for (const tatica of diretriz.taticas || []) {
        if (isTaticaConcluida(tatica)) {
          concluidas++;
        }
      }
    }
  
    return concluidas;
  }


  function countOperacionais(diretrizes = []) {
    let total = 0;
    for (const diretriz of diretrizes) {
      for (const tatica of diretriz.taticas || []) {
        total += (tatica.operacionais?.length || 0);
      }
    }
    return total;
  }
  
  function countOperacionaisConcluidos(diretrizes = []) {
    let concluidos = 0;
    for (const diretriz of diretrizes) {
      for (const tatica of diretriz.taticas || []) {
        for (const operacional of tatica.operacionais || []) {
          if (isOperacionalConcluido(operacional)) {
            concluidos++;
          }
        }
      }
    }
    return concluidos;
  }


  function countTarefas(diretrizes = []) {
    let total = 0;
    for (const diretriz of diretrizes) {
      for (const tatica of diretriz.taticas || []) {
        for (const operacional of tatica.operacionais || []) {
          total += (operacional.tarefas?.length || 0);
        }
      }
    }
    return total;
  }
  
  function countTarefasConcluidas(diretrizes = []) {
    let concluidas = 0;
    for (const diretriz of diretrizes) {
      for (const tatica of diretriz.taticas || []) {
        for (const operacional of tatica.operacionais || []) {
          for (const tarefa of operacional.tarefas || []) {
            if (tarefa?.checkboxState?.concluida) {
              concluidas++;
            }
          }
        }
      }
    }
    return concluidas;
  }


  function isOperacionalConcluido(operacional) {
    const tarefas = operacional.tarefas || [];
    if (tarefas.length === 0) return false;
    // Se TODAS as tarefas tiverem progresso 100, então concluído
    return tarefas.every((tarefa) => (tarefa.progresso ?? 0) === 100);
  }
  
  
  function isTaticaConcluida(tatica) {
    const operacionais = tatica.operacionais || [];
    if (operacionais.length === 0) return false;
  
    // TODAS as operacionais precisam estar concluídas
    return operacionais.every(isOperacionalConcluido);
  }
  
  function isDiretrizConcluida(diretriz) {
    const taticas = diretriz.taticas || [];
    if (taticas.length === 0) return false;
  
    // TODAS as táticas precisam estar concluídas
    return taticas.every(isTaticaConcluida);
  }
  
  
  
  
  













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

      


















































<Grid
  container
  spacing={6}
  sx={{
    marginTop: "20px",
    alignItems: "center",
    marginLeft: "20px",
    position: "relative",
  }}
>
  {/* Nome do Projeto */}
  <Typography
    sx={{
      fontSize: "12px",
      fontWeight: "bold",
      color: "#555",
      marginRight: "10px",
      marginLeft: "-25px",
    }}
  >
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
    <Grid
      container
      key={indexEstr}
      spacing={6}
      sx={{
        marginBottom: "30px",
        alignItems: "center",
        position: "relative",
        "@media print": {
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          backgroundColor: "inherit", // Mantém a cor de fundo
          color: "inherit", // Mantém a cor do texto
        },
      }}
    >
      {/* Coluna 1: Diretriz Estratégica */}
      <Grid
        item
        xs={2}
        sx={{
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "10px",
        }}
      >
        
        <Box>
          <Box
            sx={{
              backgroundColor: "#007BFF",
              color: "#fff",
              borderRadius: "5px",
              padding: "8px",
              maxWidth: "100%",
              width: "100%",
              textAlign: "center",
              fontSize: "12px",
              position: "relative",
              marginBottom: "120px",
            }}
          >
            {estrategica.titulo}
            {/* Linha para conectar com táticas se existirem */}
            {estrategica.taticas?.length > 0 && (
              <>
              <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5px",
            position: "relative", // 🔹 Mantém alinhamento com o bloco azul
          }}
        >
          <StatusProgressoEstrategica taticas={estrategica.taticas} />
        </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "100%",
                  width: "45px",
                  borderTop: "1px dashed #555",
                }}
              />
              </>
            )}
          </Box>
        </Box>
      </Grid>














      

      {/* Coluna 2: Táticas */}
      <Grid
        item
        xs={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "10px",
        }}
      >
        {estrategica.taticas?.length > 0 && (
          <Box
            sx={{
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
                backgroundColor: "inherit",
                color: "inherit",
              },
            }}
          >
            {/* Linha vertical única conectando todas as Táticas dentro da Estratégica */}
            {estrategica.taticas.length > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  left: "-15px",
                  top: "0",
                  height: "50%",
                  marginTop: "49px",
                  borderLeft: "1px dashed #555",
                }}
              />
            )}

            {estrategica.taticas?.map((tatica, indexTat) => {
              const totalOperacionais = tatica.operacionais?.length || 0;

              return (
                <Box
                  key={indexTat}
                  sx={{
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
                      backgroundColor: "inherit",
                      color: "inherit",
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#28A745",
                      color: "#fff",
                      borderRadius: "5px",
                      padding: "8px",
                      maxWidth: "100%",
                      width: "100%",
                      textAlign: "center",
                      fontSize: "12px",
                      position: "relative",
                      display: "flex",
                      marginBottom: "100px",
                    }}
                  >
                    {tatica.titulo}

                    {/* Linha horizontal conectando Tática → Operacionais */}
                    {totalOperacionais > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: "100%",
                          top: "50%",
                          width: "40px",
                          borderTop: "1px dashed #555",
                        }}
                      />
                    )}

                    {/* Linha horizontal conectando cada Tática à linha central */}
                    {estrategica.taticas.length > 1 && (
                      <>
                        {/* Progresso da Tática */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "5px", // 🔹 Ajuste fino para alinhar melhor
                            position: "relative",
                          }}
                        >
                          <StatusProgressoTatica operacionais={tatica.operacionais} />
                        </Box>

                        <Box
                          sx={{
                            position: "absolute",
                            left: "-15px",
                            top: "50%",
                            width: "15px",
                            borderTop: "1px dashed #555",
                          }}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Grid>













      {/* Coluna 3: Operacionais */}
      <Grid
        item
        xs={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "10px",
        }}
      >
        {estrategica.taticas?.map((tatica) => {
          const totalOperacionais = tatica.operacionais?.length || 1;

          return (
            <Box
              key={tatica.titulo}
              sx={{
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
                  backgroundColor: "inherit",
                  color: "inherit",
                },
              }}
            >
              {/* Linha vertical central conectando Tática → Operacionais */}
              {totalOperacionais > 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    left: "-15px",
                    top: "50%",
                    height: `${totalOperacionais * 40}px`,
                    borderLeft: "1px dashed #555",
                    transform: "translateY(-80%)",
                  }}
                />
              )}

              {tatica.operacionais?.map((operacional, indexOp) => {
                const totalTarefas = operacional.tarefas?.length || 0;

                return (
                  <React.Fragment key={indexOp}>
                    <Box
                      sx={{
                        backgroundColor: "#DC3545",
                        color: "#fff",
                        borderRadius: "5px",
                        padding: "8px",
                        maxWidth: "100%",
                        width: "100%",
                        textAlign: "center",
                        fontSize: "12px",
                        position: "relative",
                        marginBottom: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "50px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "10px",
                          color: "#fff",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {operacional.titulo}
                      </Typography>

                      {/* Linha horizontal conectando Operacional → Tarefas */}
                      {totalTarefas > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            left: "100%",
                            top: "50%",
                            width: "40px",
                            borderTop: "1px dashed #555",
                            transform: "translateY(-50%)",
                          }}
                        />
                      )}

                      {/* Linha horizontal conectando cada Operacional à linha central */}
                      {totalOperacionais > 1 && (
                        <>
                        {/* Progresso do Operacional */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "5px",
                        position: "relative",
                      }}
                    >
                      <StatusProgressoTotal tarefas={operacional.tarefas || []} />

                    </Box>
                          <Box
                            sx={{
                              position: "absolute",
                              left: "-15px",
                              top: "50%",
                              width: "15px",
                              borderTop: "1px dashed #555",
                              transform: "translateY(-50%)",
                            }}
                          />
                        </>
                      )}
                    </Box>

                  </React.Fragment>
                );
              })}
            </Box>
          );
        })}
      </Grid>














      

      {/* Coluna 4: Tarefas */}
      <Grid
        item
        xs={3}
        sx={{
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "10px",
        }}
      >
        {estrategica.taticas?.map((tatica) =>
          tatica.operacionais?.map((operacional) => {
            const totalTarefas = operacional.tarefas?.length || 1;

            return (
              <React.Fragment key={operacional.titulo}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    width: "100%",
                    marginY: "5px",
                    "@media print": {
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      backgroundColor: "inherit",
                      color: "inherit",
                    },
                  }}
                >
                  {/* Linha vertical central conectando tarefas */}
                  {totalTarefas > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: "-15px",
                        top: "50%",
                        height: `${totalTarefas * 47}px`,
                        borderLeft: "1px dashed #555",
                        transform: "translateY(-85%)",
                      }}
                    />
                  )}
                  

                  {operacional.tarefas?.map((task, i) => (
                    <React.Fragment key={i}>
                      <Box
                        sx={{
                          backgroundColor: "#ffb600",
                          color: "#fff",
                          borderRadius: "5px",
                          padding: "8px",
                          maxWidth: "100%",
                          width: "100%",
                          textAlign: "center",
                          fontSize: "12px",
                          marginBottom: "30px",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "65px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "10px",
                            color: "#555",
                          }}
                        >
                          {task.tituloTarefa}
                        </Typography>
                        

                        {/* Linha horizontal conectando cada tarefa à linha central */}
                        {totalTarefas > 1 && (
                          <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "-15px",
                              position: "relative",
                              marginRight: "-95px",
                            }}
                          >
                            <StatusProgressoTotal tarefas={operacional.tarefas} />
                          </Box>

                            <Box
                              sx={{
                                position: "absolute",
                                left: "-15px",
                                top: "50%",
                                width: "15px",
                                borderTop: "1px dashed #555",
                                transform: "translateY(-50%)",
                              }}
                            />
                          </>
                        )}
                    
                      </Box>
                    </React.Fragment>
                  ))}

                  {/* Progresso das Tarefas */}
                 
                </Box>
              </React.Fragment>
            );
          })
        )}
      </Grid>
    </Grid>
  ))}
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
              color: "#2c2c88",
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