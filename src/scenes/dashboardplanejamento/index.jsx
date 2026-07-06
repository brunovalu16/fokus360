import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import "dayjs/locale/pt-br";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { dbFokus360 } from "../../data/firebase-config";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { useParams } from "react-router-dom";

import InformacoesPlanejamento2 from "../../components/InformacoesPlanejamento2";
import BaseDiretriz4 from "../../components/BaseDiretriz4";
import DadosProjeto2 from "../../components/DadosProjeto2";

function DashboardPlanejamento() {
  const { id } = useParams();

  const [projetoData, setProjetoData] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchProjetoEUsuarios = async () => {
      if (!id) return;

      try {
        const docRef = doc(dbFokus360, "projetos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProjetoData({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Projeto não encontrado");
        }

        const querySnapshot = await getDocs(collection(dbFokus360, "user"));

        const listaUsuarios = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          username: doc.data().username,
          photoURL: doc.data().photoURL,
        }));

        setUsers(listaUsuarios);
      } catch (error) {
        console.error("❌ Erro ao buscar projeto ou usuários:", error);
      }
    };

    fetchProjetoEUsuarios();
  }, [id]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            paddingTop: "50px",
          }}
        />

        <Box
          sx={{
            marginLeft: "40px",
            marginTop: "-15px",
            width: "calc(100% - 80px)",
            maxWidth: "calc(100% - 80px)",
            minHeight: "50vh",

            padding: "15px",
            paddingLeft: "30px",

            borderRadius: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            bgcolor: "#f2f0f0",

            overflowX: "hidden",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {projetoData ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  minWidth: 0,
                  overflowX: "hidden",
                  boxSizing: "border-box",
                }}
              >
                <Box
  sx={{
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
    overflowY: "visible",
    boxSizing: "border-box",
  }}
>
  <Box
    sx={{
      zoom: {
        xs: 0.55,
        sm: 0.65,
        md: 0.75,
        lg: 0.85,
        xl: 0.9,
      },
      width: {
        xs: "181.82%",
        sm: "153.85%",
        md: "133.33%",
        lg: "117.65%",
        xl: "111.11%",
      },
      maxWidth: "none",
      transformOrigin: "top left",
    }}
  >
    <DadosProjeto2
      estrategicas={projetoData?.estrategicas || []}
      diretrizes={projetoData?.estrategicas || []}
      orcamento={projetoData?.orcamento}
      dataInicio={projetoData?.dataInicio}
      prazoPrevisto={projetoData?.prazoPrevisto}
      projetoData={projetoData}
      users={users}
    />
  </Box>
</Box>
              </Box>

              <InformacoesPlanejamento2
                projetoData={projetoData}
                onUpdate={() => {}}
              />

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                  marginTop: "50px",
                  marginBottom: "50px",
                  flexWrap: "wrap",
                }}
              >
                <PlayCircleFilledIcon
                  sx={{ color: "#5f53e5", fontSize: 25 }}
                />

                <Typography>DIRETRIZES DO PROJETO</Typography>
              </Box>

              <Box
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  minWidth: 0,
                  overflowX: "hidden",
                  boxSizing: "border-box",
                }}
              >
                <BaseDiretriz4
                  projetoData={projetoData}
                  dataInicio={projetoData.dataInicio}
                  prazoPrevisto={projetoData.prazoPrevisto}
                  onUpdate={(prev) =>
                    setProjetoData((antigo) => ({
                      ...antigo,
                      ...prev,
                    }))
                  }
                />
              </Box>
            </>
          ) : (
            <Typography>Carregando dados do projeto...</Typography>
          )}
        </Box>
      </Box>
    </>
  );
}

export default DashboardPlanejamento;