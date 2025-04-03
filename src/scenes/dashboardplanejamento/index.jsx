
import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import "dayjs/locale/pt-br";
import Header from "../../components/Header";
import { getDoc, doc } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import InformacoesPlanejamento from "../../components/InformacoesPlanejamento";
import BaseDiretriz4 from "../../components/BaseDiretriz4";
import DadosProjeto2 from "../../components/DadosProjeto2";
import { useParams } from "react-router-dom";


function DashboardPlanejamento() {

  const { id } = useParams();
  const [projetoData, setProjetoData] = useState(null);
  const [loading, setLoading] = useState(true);


  //busca os dados do projeto
  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const docRef = doc(dbFokus360, "projetos", id); // O ID que vem pela rota
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProjetoData({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Projeto não encontrado");
        }
      } catch (error) {
        console.error("❌ Erro ao buscar projeto:", error);
      }
    };
  
    fetchProjeto();
  }, [id]);



  return (
    <>
  {/* Header */}
  <Box
    sx={{
      marginLeft: "40px",
      paddingTop: "50px",
    }}
  >
    <Header
      title={
        <Box display="flex" alignItems="center" gap={1}>
          <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
          <Typography>GERENCIADOR DE RELATÓRIOS</Typography>
        </Box>
      }
    />
  </Box>

  <Box
    sx={{
      marginLeft: "40px",
      marginTop: "-15px",
      width: "calc(100% - 80px)",
      minHeight: "50vh",
      padding: "15px",
      paddingLeft: "30px",
      borderRadius: "20px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      bgcolor: "#f2f0f0",
      overflowX: "hidden",
      position: "relative",
    }}
  >
    <DadosProjeto2 />

    <Box display="flex" alignItems="center" gap={1} sx={{ marginTop: "50px", marginBottom: "50px" }}>
      <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
      <Typography>INFORMAÇÕES DO PROJETO</Typography>
    </Box>

    {projetoData ? (
      <>
        <InformacoesPlanejamento projetoData={projetoData} />

        <Box display="flex" alignItems="center" gap={1} sx={{ marginTop: "50px", marginBottom: "50px" }}>
          <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
          <Typography>DIRETRIZES DO PROJETO</Typography>
        </Box>

        <BaseDiretriz4 projetoData={projetoData} />
      </>
    ) : (
      <Typography>Carregando dados do projeto...</Typography>
    )}
  </Box>
</>
  
  );
};



export default DashboardPlanejamento;
