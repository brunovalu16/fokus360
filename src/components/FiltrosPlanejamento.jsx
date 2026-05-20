import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Divider,
  LinearProgress,
} from "@mui/material";

import FlagIcon from "@mui/icons-material/Flag";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import PaidIcon from "@mui/icons-material/Paid";

import { getDocs, collection } from "firebase/firestore";
import { dbFokus360 as db } from "../data/firebase-config";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const FiltrosPlanejamento = ({ estrategicas }) => {
  const [value, setValue] = useState("");
  const [todosProjetos, setTodosProjetos] = useState([]);

  const [estrategicasAtrasadas, setEstrategicasAtrasadas] = useState([]);
  const [taticasAtrasadas, setTaticasAtrasadas] = useState([]);
  const [operacionaisAtrasadas, setOperacionaisAtrasadas] = useState([]);
  const [tarefasAtrasadas, setTarefasAtrasadas] = useState([]);

  const [estrategicasConcluidasAtrasadas, setEstrategicasConcluidasAtrasadas] =
    useState([]);
  const [taticasConcluidasAtrasadas, setTaticasConcluidasAtrasadas] =
    useState([]);
  const [operacionaisConcluidasAtrasadas, setOperacionaisConcluidasAtrasadas] =
    useState([]);
  const [tarefasConcluidasAtrasadas, setTarefasConcluidasAtrasadas] =
    useState([]);

  const [areaSelecionada, setAreaSelecionada] = useState("");
  const [areas, setAreas] = useState([]);

  const [unidades, setUnidades] = useState([]);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");

  const [carregando, setCarregando] = useState(false);

  const buscarTodosProjetos = async () => {
    try {
      setCarregando(true);

      const querySnapshot = await getDocs(collection(db, "projetos"));

      const projetos = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setTodosProjetos(projetos);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarTodosProjetos();
  }, []);

  useEffect(() => {
    const fetchUnidades = async () => {
      const querySnapshot = await getDocs(collection(db, "unidade"));

      const lista = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setUnidades(lista);
    };

    fetchUnidades();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      const querySnapshot = await getDocs(collection(db, "areas"));

      const lista = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setAreas(lista);
    };

    fetchAreas();
  }, []);

  useEffect(() => {
    const buscarAtrasadas = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projetos"));

        const est = [];
        const tat = [];
        const op = [];
        const tar = [];

        snapshot.forEach((docSnap) => {
          const projeto = docSnap.data();
          const estrategicas = projeto.estrategicas || [];

          estrategicas.forEach((estrategica) => {
            if (
              estrategica.statusVisual === "atrasada" &&
              estrategica.status !== "concluida"
            ) {
              est.push(estrategica);
            }

            (estrategica.taticas || []).forEach((tatica) => {
              if (
                tatica.statusVisual === "atrasada" &&
                tatica.status !== "concluida"
              ) {
                tat.push(tatica);
              }

              (tatica.operacionais || []).forEach((opItem) => {
                if (
                  opItem.statusVisual === "atrasada" &&
                  opItem.status !== "concluida"
                ) {
                  op.push(opItem);
                }

                (opItem.tarefas || []).forEach((tarefa) => {
                  if (
                    tarefa.statusVisual === "atrasada" &&
                    tarefa.status !== "concluida"
                  ) {
                    tar.push(tarefa);
                  }
                });
              });
            });
          });
        });

        setEstrategicasAtrasadas(est);
        setTaticasAtrasadas(tat);
        setOperacionaisAtrasadas(op);
        setTarefasAtrasadas(tar);
      } catch (error) {
        console.error("❌ Erro ao buscar diretrizes atrasadas:", error);
      }
    };

    buscarAtrasadas();
  }, []);

  useEffect(() => {
    const buscarConcluidasAtrasadas = async () => {
      const snapshot = await getDocs(collection(db, "projetos"));

      const est = [];
      const tat = [];
      const op = [];
      const tar = [];

      snapshot.forEach((docSnap) => {
        const projeto = docSnap.data();
        const estrategicas = projeto.estrategicas || [];

        estrategicas.forEach((estrategica) => {
          if (
            estrategica.status === "concluida" &&
            estrategica.statusVisual === "atrasada"
          ) {
            est.push(estrategica);
          }

          (estrategica.taticas || []).forEach((tatica) => {
            if (
              tatica.status === "concluida" &&
              tatica.statusVisual === "atrasada"
            ) {
              tat.push(tatica);
            }

            (tatica.operacionais || []).forEach((opItem) => {
              if (
                opItem.status === "concluida" &&
                opItem.statusVisual === "atrasada"
              ) {
                op.push(opItem);
              }

              (opItem.tarefas || []).forEach((tarefa) => {
                if (
                  tarefa.status === "concluida" &&
                  tarefa.statusVisual === "atrasada"
                ) {
                  tar.push(tarefa);
                }
              });
            });
          });
        });
      });

      setEstrategicasConcluidasAtrasadas(est);
      setTaticasConcluidasAtrasadas(tat);
      setOperacionaisConcluidasAtrasadas(op);
      setTarefasConcluidasAtrasadas(tar);
    };

    buscarConcluidasAtrasadas();
  }, []);

  const responsaveisTarefa = (tarefa) => {
    if (Array.isArray(tarefa?.planoDeAcao?.quemEmail)) {
      return tarefa.planoDeAcao.quemEmail.join(", ");
    }

    return tarefa?.planoDeAcao?.quemEmail || "Nenhum responsável";
  };

  const dataFields = (projeto) => (
    <Box sx={datesWrapStyle}>
      <TextField
        label="Data início"
        type="date"
        size="small"
        value={projeto?.dataInicio || ""}
        InputLabelProps={{ shrink: true }}
        disabled
        sx={dateFieldStyle}
      />

      <TextField
        label="Prazo previsto"
        type="date"
        size="small"
        value={projeto?.prazoPrevisto || ""}
        InputLabelProps={{ shrink: true }}
        disabled
        sx={dateFieldStyle}
      />
    </Box>
  );

  const renderLinha = ({
    key,
    tipo,
    titulo,
    responsaveis,
    projeto,
    cor,
    nivel = 0,
  }) => (
    <Box key={key} sx={linhaStyle(nivel, cor)}>
      <Box sx={linhaTipoStyle}>
        <DoubleArrowIcon sx={{ color: cor, fontSize: 22 }} />

        <Typography sx={{ ...linhaTipoTextoStyle, color: cor }}>
          {tipo}
        </Typography>
      </Box>

      <Typography sx={linhaTituloStyle}>{titulo || "-"}</Typography>

      <Typography sx={separadorStyle}>|</Typography>

      <Typography sx={responsavelStyle}>
        <strong>Responsáveis:</strong>{" "}
        <span style={{ fontStyle: "italic", color: "#475569" }}>
          {responsaveis || "Nenhum responsável"}
        </span>
      </Typography>

      {projeto && (
        <>
          <Typography sx={separadorStyle}>|</Typography>
          {dataFields(projeto)}
        </>
      )}
    </Box>
  );

  const renderProjetoTitulo = (projeto) => (
    <Paper key={`titulo-${projeto.id}`} elevation={0} sx={projectTitleStyle}>
      <Box sx={projectIconStyle}>
        <FlagIcon sx={{ color: "#fff", fontSize: 20 }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={projectLabelStyle}>Projeto</Typography>

        <Typography sx={projectNameStyle}>
          {projeto.nome || "Sem nome"}
        </Typography>
      </Box>
    </Paper>
  );

  const renderDiretrizesProjeto = (projeto, pIndex) => (
    <Box key={projeto.id} sx={projectBlockStyle}>
      {renderProjetoTitulo(projeto)}

      {projeto.estrategicas?.map((estrategica, eIndex) =>
        renderLinha({
          key: `est-${pIndex}-${eIndex}`,
          tipo: "Estratégicas",
          titulo: estrategica.titulo,
          responsaveis: (estrategica.emails || []).join(", "),
          projeto,
          cor: "#312783",
          nivel: 0,
        })
      )}

      {projeto.estrategicas?.flatMap((estrategica, eIndex) =>
        estrategica.taticas?.map((tatica, tIndex) =>
          renderLinha({
            key: `tat-${pIndex}-${eIndex}-${tIndex}`,
            tipo: "Táticas",
            titulo: tatica.titulo,
            responsaveis: (tatica.emails || []).join(", "),
            projeto,
            cor: "#00796b",
            nivel: 1,
          })
        )
      )}

      {projeto.estrategicas?.flatMap((estrategica, eIndex) =>
        estrategica.taticas?.flatMap((tatica, tIndex) =>
          tatica.operacionais?.map((op, oIndex) =>
            renderLinha({
              key: `op-${pIndex}-${eIndex}-${tIndex}-${oIndex}`,
              tipo: "Operacionais",
              titulo: op.titulo,
              responsaveis: (op.emails || []).join(", "),
              projeto,
              cor: "#f30c0c",
              nivel: 2,
            })
          )
        )
      )}
    </Box>
  );

  const renderTarefasProjeto = (projeto, pIndex) => (
    <Box key={projeto.id} sx={projectBlockStyle}>
      {renderProjetoTitulo(projeto)}

      {projeto.estrategicas?.flatMap((estrategica, eIndex) =>
        estrategica.taticas?.flatMap((tatica, tIndex) =>
          tatica.operacionais?.flatMap((operacional, oIndex) =>
            operacional.tarefas?.map((tarefa, i) =>
              renderLinha({
                key: `tarefa-${pIndex}-${eIndex}-${tIndex}-${oIndex}-${i}`,
                tipo: "Tarefas",
                titulo: tarefa.tituloTarefa || "-",
                responsaveis: responsaveisTarefa(tarefa),
                projeto,
                cor: "#f57c00",
                nivel: 0,
              })
            )
          )
        )
      )}
    </Box>
  );

  const renderPorStatus = (statusFiltro, statusVisualFiltro, labelFallback) =>
    todosProjetos.map((projeto, pIndex) => (
      <Box key={projeto.id} sx={projectBlockStyle}>
        {renderProjetoTitulo(projeto)}

        {projeto.estrategicas
          ?.filter((e) =>
            statusFiltro
              ? e.status === statusFiltro
              : e.status === "" || e.statusVisual === statusVisualFiltro
          )
          .map((estrategica, i) =>
            renderLinha({
              key: `${labelFallback}-est-${pIndex}-${i}`,
              tipo: "Estratégicas",
              titulo: estrategica.titulo,
              responsaveis: (estrategica.emails || []).join(", "),
              projeto,
              cor: "#312783",
              nivel: 0,
            })
          )}

        {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
          estrategica.taticas
            ?.filter((tatica) =>
              statusFiltro
                ? tatica.status === statusFiltro
                : tatica.status === "" || tatica.statusVisual === statusVisualFiltro
            )
            .map((tatica, tIndex) =>
              renderLinha({
                key: `${labelFallback}-tat-${pIndex}-${estIndex}-${tIndex}`,
                tipo: "Táticas",
                titulo: tatica.titulo,
                responsaveis: (tatica.emails || []).join(", "),
                projeto,
                cor: "#00796b",
                nivel: 1,
              })
            )
        )}

        {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
          estrategica.taticas?.flatMap((tatica, tatIndex) =>
            tatica.operacionais
              ?.filter((op) =>
                statusFiltro
                  ? op.status === statusFiltro
                  : op.status === "" || op.statusVisual === statusVisualFiltro
              )
              .map((op, oIndex) =>
                renderLinha({
                  key: `${labelFallback}-op-${pIndex}-${estIndex}-${tatIndex}-${oIndex}`,
                  tipo: "Operacionais",
                  titulo: op.titulo,
                  responsaveis: (op.emails || []).join(", "),
                  projeto,
                  cor: "#f30c0c",
                  nivel: 2,
                })
              )
          )
        )}

        {projeto.estrategicas?.flatMap((estrategica, estIndex) =>
          estrategica.taticas?.flatMap((tatica, tatIndex) =>
            tatica.operacionais?.flatMap((op, opIndex) =>
              op.tarefas
                ?.filter((tarefa) =>
                  statusFiltro
                    ? tarefa.status === statusFiltro
                    : tarefa.status === "" ||
                      tarefa.statusVisual === statusVisualFiltro
                )
                .map((tarefa, i) =>
                  renderLinha({
                    key: `${labelFallback}-tar-${pIndex}-${estIndex}-${tatIndex}-${opIndex}-${i}`,
                    tipo: "Tarefas",
                    titulo: tarefa.tituloTarefa || "-",
                    responsaveis: responsaveisTarefa(tarefa),
                    projeto,
                    cor: "#f57c00",
                    nivel: 3,
                  })
                )
            )
          )
        )}
      </Box>
    ));

 const renderListaSimples = (titulo, lista, cor, tipo, tarefa = false) => (
  <Box sx={statusBlockStyle}>
    <Box sx={statusHeaderStyle}>
      <DoubleArrowIcon sx={{ color: cor }} />

      <Typography sx={{ ...statusTitleStyle, color: cor }}>
        {titulo}
      </Typography>

      <Chip label={lista.length} sx={statusCounterStyle(cor)} />
    </Box>

    {lista.map((item, i) =>
      renderLinha({
        key: `${tipo}-${i}`,
        tipo,
        titulo: tarefa ? item.tituloTarefa || "-" : item.titulo,
        responsaveis: tarefa
          ? responsaveisTarefa(item)
          : (item.emails || []).join(", "),
        cor,
        nivel: 0,
      })
    )}

    {lista.length === 0 && <Box sx={emptyStyle}>Nenhum registro encontrado.</Box>}
  </Box>
);

  return (
    <Box sx={pageStyle}>
      <Paper elevation={0} sx={mainCardStyle}>
        <Box sx={topBarStyle} />

        <Box sx={contentStyle}>
          <Box sx={headerStyle}>
            <Box sx={headerIconStyle}>
              <FlagIcon sx={{ color: "#fff", fontSize: 30 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={eyebrowStyle}>Painel de filtros</Typography>

              <Typography sx={titleStyle}>
                Variáveis globais de projetos
              </Typography>

              <Typography sx={subtitleStyle}>
                Visão consolidada das diretrizes, tarefas, status, atrasos, áreas
                e unidades.
              </Typography>
            </Box>
          </Box>

          {carregando && <LinearProgress sx={{ mt: 3, borderRadius: 99 }} />}

          <Box sx={summaryGridStyle}>
            <InfoCard
              icon={<TrackChangesIcon />}
              label="Projetos"
              value={todosProjetos.length}
              color="#312783"
            />

            <InfoCard
              icon={<PaidIcon />}
              label="Em atraso"
              value={
                estrategicasAtrasadas.length +
                taticasAtrasadas.length +
                operacionaisAtrasadas.length +
                tarefasAtrasadas.length
              }
              color="#dc2626"
            />

            <InfoCard
              icon={<AssignmentTurnedInIcon />}
              label="Concluídas em atraso"
              value={
                estrategicasConcluidasAtrasadas.length +
                taticasConcluidasAtrasadas.length +
                operacionaisConcluidasAtrasadas.length +
                tarefasConcluidasAtrasadas.length
              }
              color="#f59e0b"
            />
          </Box>

          <Divider sx={{ my: 3, borderColor: "rgba(148,163,184,0.22)" }} />

          <TabContext value={value}>
            <Box sx={tabsBoxStyle}>
              <TabList
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="Filtros de planejamento"
              >
                <Tab
                  value="1"
                  label="Diretrizes"
                  onClick={() => setValue(value === "1" ? "" : "1")}
                />
                <Tab
                  value="2"
                  label="Tarefas"
                  onClick={() => setValue(value === "2" ? "" : "2")}
                />
                <Tab
                  value="3"
                  label="Não iniciadas"
                  onClick={() => setValue(value === "3" ? "" : "3")}
                />
                <Tab
                  value="4"
                  label="Em andamento"
                  onClick={() => setValue(value === "4" ? "" : "4")}
                />
                <Tab
                  value="5"
                  label="Concluídas"
                  onClick={() => setValue(value === "5" ? "" : "5")}
                />
                <Tab
                  value="6"
                  label="Em atraso"
                  onClick={() => setValue(value === "6" ? "" : "6")}
                />
                <Tab
                  value="7"
                  label="Concluídas em atraso"
                  onClick={() => setValue(value === "7" ? "" : "7")}
                />
                <Tab
                  value="8"
                  label="Por áreas"
                  onClick={() => setValue(value === "8" ? "" : "8")}
                />
                <Tab
                  value="9"
                  label="Por unidades"
                  onClick={() => setValue(value === "9" ? "" : "9")}
                />
              </TabList>
            </Box>

            <Box sx={panelWrapperStyle}>
              <TabPanel value="1" sx={tabPanelStyle}>
                {todosProjetos.map(renderDiretrizesProjeto)}
              </TabPanel>

              <TabPanel value="2" sx={tabPanelStyle}>
                {todosProjetos.map(renderTarefasProjeto)}
              </TabPanel>

              <TabPanel value="3" sx={tabPanelStyle}>
                {renderPorStatus(null, "nao_iniciada", "nao")}
              </TabPanel>

              <TabPanel value="4" sx={tabPanelStyle}>
                {renderPorStatus("andamento", null, "and")}
              </TabPanel>

              <TabPanel value="5" sx={tabPanelStyle}>
                {renderPorStatus("concluida", null, "conc")}
              </TabPanel>

              <TabPanel value="6" sx={tabPanelStyle}>
                {renderListaSimples(
                  "Estratégicas",
                  estrategicasAtrasadas,
                  "#312783",
                  "Estratégicas"
                )}

                {renderListaSimples(
                  "Táticas",
                  taticasAtrasadas,
                  "#00796b",
                  "Táticas"
                )}

                {renderListaSimples(
                  "Operacionais",
                  operacionaisAtrasadas,
                  "#ff9800",
                  "Operacionais"
                )}

                {renderListaSimples(
                  "Tarefas",
                  tarefasAtrasadas,
                  "#f57c00",
                  "Tarefas",
                  true
                )}
              </TabPanel>

              <TabPanel value="7" sx={tabPanelStyle}>
                {renderListaSimples(
                  "Concluídas em Atraso - Estratégicas",
                  estrategicasConcluidasAtrasadas,
                  "#312783",
                  "Estratégicas"
                )}

                {renderListaSimples(
                  "Táticas Concluídas em Atraso",
                  taticasConcluidasAtrasadas,
                  "#00796b",
                  "Táticas"
                )}

                {renderListaSimples(
                  "Operacionais Concluídas em Atraso",
                  operacionaisConcluidasAtrasadas,
                  "#ff9800",
                  "Operacionais"
                )}

                {renderListaSimples(
                  "Tarefas Concluídas em Atraso",
                  tarefasConcluidasAtrasadas,
                  "#6a1b9a",
                  "Tarefas",
                  true
                )}
              </TabPanel>

              <TabPanel value="8" sx={tabPanelStyle}>
                <Box sx={filterBoxStyle}>
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel id="select-area-label">Filtrar por Área</InputLabel>

                    <Select
                      labelId="select-area-label"
                      id="select-area"
                      value={areaSelecionada}
                      onChange={(e) => setAreaSelecionada(e.target.value)}
                      label="Filtrar por Área"
                    >
                      <MenuItem value="">
                        <em>Todas as Áreas</em>
                      </MenuItem>

                      {areas.map((area) => (
                        <MenuItem key={area.id} value={area.id}>
                          {area.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {areaSelecionada !== "" && (
                  <>
                    {renderListaPorFiltro(
                      todosProjetos,
                      "areasResponsaveis",
                      areaSelecionada,
                      renderLinha
                    )}
                  </>
                )}
              </TabPanel>

              <TabPanel value="9" sx={tabPanelStyle}>
                <Box sx={filterBoxStyle}>
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel id="select-unidade-label">
                      Filtrar por Unidade
                    </InputLabel>

                    <Select
                      labelId="select-unidade-label"
                      id="select-unidade"
                      value={unidadeSelecionada}
                      onChange={(e) => setUnidadeSelecionada(e.target.value)}
                      label="Filtrar por Unidade"
                    >
                      <MenuItem value="">
                        <em>Todas as Unidades</em>
                      </MenuItem>

                      {unidades.map((unidade) => (
                        <MenuItem key={unidade.id} value={unidade.id}>
                          {unidade.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {unidadeSelecionada !== "" && (
                  <>
                    {renderListaPorFiltro(
                      todosProjetos,
                      "unidades",
                      unidadeSelecionada,
                      renderLinha
                    )}
                  </>
                )}
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </Paper>
    </Box>
  );
};

const renderListaPorFiltro = (todosProjetos, campo, valor, renderLinha) => (
  <>
    <FiltroGrupo
      titulo="Estratégicas"
      cor="#312783"
      tipo="Estratégicas"
      itens={todosProjetos?.flatMap((proj, pIdx) =>
        proj.estrategicas
          ?.filter((e) => (e[campo] || []).includes(valor))
          .map((e, i) => ({
            key: `estrat-${campo}-${pIdx}-${i}`,
            titulo: e.titulo,
            responsaveis: (e.emails || []).join(", "),
          }))
      )}
      renderLinha={renderLinha}
    />

    <FiltroGrupo
      titulo="Táticas"
      cor="#00796b"
      tipo="Táticas"
      itens={todosProjetos?.flatMap((proj, pIdx) =>
        proj.estrategicas?.flatMap((est, i) =>
          est.taticas
            ?.filter((t) => (t[campo] || []).includes(valor))
            .map((t, j) => ({
              key: `tat-${campo}-${pIdx}-${i}-${j}`,
              titulo: t.titulo,
              responsaveis: (t.emails || []).join(", "),
            }))
        )
      )}
      renderLinha={renderLinha}
    />

    <FiltroGrupo
      titulo="Operacionais"
      cor="#ff9800"
      tipo="Operacionais"
      itens={todosProjetos?.flatMap((proj, pIdx) =>
        proj.estrategicas?.flatMap((est, i) =>
          est.taticas?.flatMap((tat, j) =>
            tat.operacionais
              ?.filter((op) => (op[campo] || []).includes(valor))
              .map((op, k) => ({
                key: `op-${campo}-${pIdx}-${i}-${j}-${k}`,
                titulo: op.titulo,
                responsaveis: (op.emails || []).join(", "),
              }))
          )
        )
      )}
      renderLinha={renderLinha}
    />

    <FiltroGrupo
      titulo="Tarefas"
      cor="#6a1b9a"
      tipo="Tarefas"
      itens={todosProjetos?.flatMap((proj, pIdx) =>
        proj.estrategicas?.flatMap((est, i) =>
          est.taticas?.flatMap((tat, j) =>
            tat.operacionais?.flatMap((op, k) =>
              op.tarefas
                ?.filter((t) => (t[campo] || []).includes(valor))
                .map((t, l) => ({
                  key: `tarefa-${campo}-${pIdx}-${i}-${j}-${k}-${l}`,
                  titulo: t.tituloTarefa,
                  responsaveis: Array.isArray(t?.planoDeAcao?.quemEmail)
                    ? t.planoDeAcao.quemEmail.join(", ")
                    : t?.planoDeAcao?.quemEmail || "Nenhum responsável",
                }))
            )
          )
        )
      )}
      renderLinha={renderLinha}
    />
  </>
);

const FiltroGrupo = ({ titulo, cor, tipo, itens = [], renderLinha }) => (
  <Box sx={statusBlockStyle}>
    <Box sx={statusHeaderStyle}>
      <DoubleArrowIcon sx={{ color: cor }} />

      <Typography sx={{ ...statusTitleStyle, color }}>{titulo}</Typography>

      <Chip label={itens.filter(Boolean).length} sx={statusCounterStyle(cor)} />
    </Box>

    {itens
      .filter(Boolean)
      .map((item, index) =>
        renderLinha({
          key: item.key,
          tipo,
          titulo: item.titulo,
          responsaveis: item.responsaveis,
          cor,
          nivel: index % 2,
        })
      )}

    {itens.filter(Boolean).length === 0 && (
      <Box sx={emptyStyle}>Nenhum registro encontrado.</Box>
    )}
  </Box>
);

const InfoCard = ({ icon, label, value, color: cardColor }) => (
  <Paper elevation={0} sx={infoCardStyle}>
    <Box
      sx={{
        ...infoIconStyle,
        color: cardColor,
        backgroundColor: `${cardColor}12`,
      }}
    >
      {icon}
    </Box>

    <Box sx={{ minWidth: 0 }}>
      <Typography sx={infoLabelStyle}>{label}</Typography>
      <Typography sx={infoValueStyle}>{value}</Typography>
    </Box>
  </Paper>
);

const pageStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
};

const mainCardStyle = {
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
  borderRadius: "30px",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
  border: "1px solid rgba(226,232,240,0.95)",

};

const topBarStyle = {
  height: 8,
  background: "linear-gradient(90deg, #312783, #6d5dfc, #00c48c)",
};

const contentStyle = {
  p: { xs: 2, sm: 3, md: 4 },
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  alignItems: { xs: "flex-start", md: "center" },
  flexDirection: { xs: "column", md: "row" },
  gap: 1.8,
};

const headerIconStyle = {
  width: 62,
  height: 62,
  minWidth: 62,
  borderRadius: "20px",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 18px 38px rgba(49,39,131,0.30)",
};

const eyebrowStyle = {
  fontSize: "12px",
  fontWeight: 900,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const titleStyle = {
  fontSize: { xs: 22, md: 30 },
  fontWeight: 950,
  color: "#0f172a",
  lineHeight: 1.1,
};

const subtitleStyle = {
  mt: 0.8,
  color: "#64748b",
  fontSize: 14,
  lineHeight: 1.5,
};

const summaryGridStyle = {
  mt: 3,
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "1fr 1fr",
    lg: "repeat(3, minmax(0, 1fr))",
  },
  gap: 2,
};

const infoCardStyle = {
  p: 2,
  borderRadius: "22px",
  border: "1px solid rgba(226,232,240,0.95)",
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  gap: 1.4,
  boxShadow: "0 14px 34px rgba(15,23,42,0.06)",
};

const infoIconStyle = {
  width: 46,
  height: 46,
  minWidth: 46,
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const infoLabelStyle = {
  fontSize: 12,
  fontWeight: 900,
  color: "#64748b",
  textTransform: "uppercase",
};

const infoValueStyle = {
  fontSize: 25,
  fontWeight: 950,
  color: "#0f172a",
};

const tabsBoxStyle = {
  borderRadius: "20px",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
  overflow: "hidden",
  mb: 2,
  "& .MuiTabs-indicator": {
    background: "linear-gradient(90deg, #312783, #6d5dfc)",
    height: "4px",
    borderRadius: "99px",
  },
  "& .MuiTab-root": {
    minHeight: 56,
    color: "#64748b",
    textTransform: "none",
    fontWeight: 900,
    fontSize: "13px",
    px: 2,
  },
  "& .Mui-selected": {
    color: "#312783 !important",
  },
  "& .MuiTabs-scrollButtons": {
    color: "#312783",
  },
};

const panelWrapperStyle = {
  width: "100%",
  minWidth: 0,
};

const tabPanelStyle = {
  p: { xs: 0, md: 0 },
};

const projectBlockStyle = {
  mb: 3,
  width: "100%",
  minWidth: 0,
};

const projectTitleStyle = {
  p: 1.6,
  mb: 1.5,
  borderRadius: "18px",
  display: "flex",
  alignItems: "center",
  gap: 1.3,
  border: "1px solid rgba(226,232,240,0.95)",
  backgroundColor: "#fff",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
};

const projectIconStyle = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "14px",
  background: "linear-gradient(135deg, #312783, #6d5dfc)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const projectLabelStyle = {
  fontSize: 11,
  fontWeight: 900,
  color: "#64748b",
  textTransform: "uppercase",
};

const projectNameStyle = {
  fontSize: 16,
  fontWeight: 950,
  color: "#0f172a",
};

const linhaStyle = (nivel, cor) => ({
  backgroundColor: "#fff",
  px: { xs: 1.4, md: 2 },
  py: 1.35,
  mb: 1,
  ml: { xs: 0, md: nivel * 2 },
  borderRadius: "16px",
  border: "1px solid rgba(226,232,240,0.95)",
  borderLeft: `5px solid ${cor}`,
  boxShadow: "0 10px 26px rgba(15,23,42,0.05)",
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1.2,
  minWidth: 0,
});

const linhaTipoStyle = {
  display: "flex",
  alignItems: "center",
  gap: 0.7,
  minWidth: 135,
};

const linhaTipoTextoStyle = {
  fontSize: 14,
  fontWeight: 950,
};

const linhaTituloStyle = {
  flex: 1,
  minWidth: 180,
  color: "#0f172a",
  fontSize: 13,
  fontWeight: 800,
  wordBreak: "break-word",
};

const separadorStyle = {
  color: "#cbd5e1",
  fontWeight: 900,
};

const responsavelStyle = {
  flex: 2,
  minWidth: 220,
  fontSize: 13,
  color: "#334155",
  wordBreak: "break-word",
};

const datesWrapStyle = {
  display: "flex",
  gap: 1,
  flexWrap: "wrap",
};

const dateFieldStyle = {
  minWidth: 130,
  maxWidth: 150,
  backgroundColor: "#fff",
  borderRadius: "12px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontWeight: 800,
    fontSize: "12px",
  },
  "& .MuiInputLabel-root": {
    fontSize: "12px",
    fontWeight: 800,
  },
};

const statusBlockStyle = {
  mb: 3,
};

const statusHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 1.4,
};

const statusTitleStyle = {
  fontSize: 17,
  fontWeight: 950,
};

const statusCounterStyle = (color) => ({
  height: 26,
  fontWeight: 900,
  color,
  backgroundColor: `${color}12`,
  border: `1px solid ${color}30`,
});

const filterBoxStyle = {
  mb: 2,
  p: 2,
  borderRadius: "18px",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  boxShadow: "0 10px 26px rgba(15,23,42,0.05)",
};

const emptyStyle = {
  p: 2,
  borderRadius: "16px",
  backgroundColor: "#f8fafc",
  border: "1px dashed rgba(148,163,184,0.45)",
  color: "#64748b",
  fontWeight: 800,
  textAlign: "center",
};

export default FiltrosPlanejamento;