import React, { useEffect, useMemo, useState } from "react";
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
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import PaidIcon from "@mui/icons-material/Paid";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { getDocs, collection } from "firebase/firestore";
import { dbFokus360 } from "../data/firebase-config";

const FiltrosPlanejamento3 = ({ estrategicas, projetoSelecionado }) => {
  const [value, setValue] = useState("");
  const [todosProjetos, setTodosProjetos] = useState([]);

  const [estrategicasAtrasadas, setEstrategicasAtrasadas] = useState([]);
  const [taticasAtrasadas, setTaticasAtrasadas] = useState([]);
  const [operacionaisAtrasadas, setOperacionaisAtrasadas] = useState([]);
  const [tarefasAtrasadas, setTarefasAtrasadas] = useState([]);

  const [areas, setAreas] = useState([]);
  const [areaSelecionada, setAreaSelecionada] = useState("");

  const [unidades, setUnidades] = useState([]);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");

  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const projetoAtual = useMemo(() => {
    return todosProjetos.find((p) => p.id === projetoSelecionado) || null;
  }, [todosProjetos, projetoSelecionado]);

  const buscarDadosBase = async () => {
    setCarregando(true);

    try {
      const [projetosSnap, areasSnap, unidadesSnap, usuariosSnap] =
        await Promise.all([
          getDocs(collection(dbFokus360, "projetos")),
          getDocs(collection(dbFokus360, "areas")),
          getDocs(collection(dbFokus360, "unidade")),
          getDocs(collection(dbFokus360, "usuarios")),
        ]);

      const projetos = projetosSnap.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        .filter((projeto) => !projetoSelecionado || projeto.id === projetoSelecionado);

      setTodosProjetos(projetos);

      setAreas(
        areasSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
      );

      setUnidades(
        unidadesSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
      );

      setUsuarios(
        usuariosSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarDadosBase();
  }, [projetoSelecionado]);

  const isAtrasada = (item) => {
    const status = item.status || "";
    const statusVisual = item.statusVisual || "";
    const time = item.time || "";

    if (status === "concluida") return false;

    const regra1 =
      statusVisual === "atrasada" && (status === "" || status === "atrasada");
    const regra2 = time === "atrasada";

    return regra1 || regra2;
  };

  useEffect(() => {
    if (!projetoAtual) {
      setEstrategicasAtrasadas([]);
      setTaticasAtrasadas([]);
      setOperacionaisAtrasadas([]);
      setTarefasAtrasadas([]);
      return;
    }

    const est = [];
    const tat = [];
    const op = [];
    const tar = [];

    (projetoAtual.estrategicas || []).forEach((estrategica) => {
      if (isAtrasada(estrategica)) est.push(estrategica);

      (estrategica.taticas || []).forEach((tatica) => {
        if (isAtrasada(tatica)) tat.push(tatica);

        (tatica.operacionais || []).forEach((operacional) => {
          if (isAtrasada(operacional)) op.push(operacional);

          (operacional.tarefas || []).forEach((tarefa) => {
            if (isAtrasada(tarefa)) tar.push(tarefa);
          });
        });
      });
    });

    setEstrategicasAtrasadas(est);
    setTaticasAtrasadas(tat);
    setOperacionaisAtrasadas(op);
    setTarefasAtrasadas(tar);
  }, [projetoAtual]);

  const responsaveisTarefa = (tarefa) => {
    const quemEmail = tarefa?.planoDeAcao?.quemEmail;

    if (Array.isArray(quemEmail)) return quemEmail.join(", ") || "Nenhum responsável";
    if (typeof quemEmail === "string") return quemEmail || "Nenhum responsável";

    return "Nenhum responsável";
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
    inicio = "",
    prazo = "",
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

      {(projeto || inicio || prazo) && (
        <>
          <Typography sx={separadorStyle}>|</Typography>

          {projeto ? (
            dataFields(projeto)
          ) : (
            <Box sx={datesWrapStyle}>
              <TextField
                label="Data início"
                type="date"
                size="small"
                value={inicio || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={dateFieldStyle}
              />

              <TextField
                label="Prazo previsto"
                type="date"
                size="small"
                value={prazo || ""}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={dateFieldStyle}
              />
            </Box>
          )}
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

  const renderPorStatus = (statusFiltro, statusVisualFiltro, prefixo) =>
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
              key: `${prefixo}-est-${pIndex}-${i}`,
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
                key: `${prefixo}-tat-${pIndex}-${estIndex}-${tIndex}`,
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
                  key: `${prefixo}-op-${pIndex}-${estIndex}-${tatIndex}-${oIndex}`,
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
                    : tarefa.status === "" || tarefa.statusVisual === statusVisualFiltro
                )
                .map((tarefa, i) =>
                  renderLinha({
                    key: `${prefixo}-tar-${pIndex}-${estIndex}-${tatIndex}-${opIndex}-${i}`,
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

      {lista.length === 0 && (
        <Box sx={emptyStyle}>Nenhum registro encontrado.</Box>
      )}
    </Box>
  );

  const renderConcluidasEmAtraso = () => {
    if (!projetoAtual) return null;

    const estrategicasConcluidas =
      projetoAtual.estrategicas?.filter(
        (e) => e.status === "concluida" && e.statusVisual === "atrasada"
      ) || [];

    const taticasConcluidas =
      projetoAtual.estrategicas?.flatMap((e) =>
        (e.taticas || []).filter(
          (t) => t.status === "concluida" && t.statusVisual === "atrasada"
        )
      ) || [];

    const operacionaisConcluidas =
      projetoAtual.estrategicas?.flatMap((e) =>
        e.taticas?.flatMap((t) =>
          (t.operacionais || []).filter(
            (o) => o.status === "concluida" && o.statusVisual === "atrasada"
          )
        )
      ) || [];

    const tarefasConcluidas =
      projetoAtual.estrategicas?.flatMap((e) =>
        e.taticas?.flatMap((t) =>
          t.operacionais?.flatMap((op) =>
            (op.tarefas || []).filter(
              (tar) =>
                tar.status === "concluida" && tar.statusVisual === "atrasada"
            )
          )
        )
      ) || [];

    const blocos = [
      {
        titulo: "Estratégicas",
        cor: "#312783",
        dados: estrategicasConcluidas,
        tipo: "Estratégicas",
      },
      {
        titulo: "Táticas",
        cor: "#00796b",
        dados: taticasConcluidas,
        tipo: "Táticas",
      },
      {
        titulo: "Operacionais",
        cor: "#f44336",
        dados: operacionaisConcluidas,
        tipo: "Operacionais",
      },
      {
        titulo: "Tarefas",
        cor: "#f28e2b",
        dados: tarefasConcluidas,
        tipo: "Tarefas",
        tarefa: true,
      },
    ];

    return blocos.map((bloco) => (
      <Box key={bloco.titulo} sx={statusBlockStyle}>
        <Box sx={statusHeaderStyle}>
          <DoubleArrowIcon sx={{ color: bloco.cor }} />

          <Typography sx={{ ...statusTitleStyle, color: bloco.cor }}>
            {bloco.titulo}
          </Typography>

          <Chip label={bloco.dados.length} sx={statusCounterStyle(bloco.cor)} />
        </Box>

        {bloco.dados.map((item, i) =>
          renderLinha({
            key: `${bloco.tipo}-${i}`,
            tipo: bloco.tipo,
            titulo: bloco.tarefa
              ? item.tituloTarefa || item.titulo || "-"
              : item.titulo || "-",
            responsaveis: bloco.tarefa
              ? responsaveisTarefa(item)
              : (item.emails || []).join(", "),
            cor: bloco.cor,
            nivel: 0,
            inicio: item.criacao || "",
            prazo: item.finalizacao || "",
          })
        )}

        {bloco.dados.length === 0 && (
          <Box sx={emptyStyle}>Nenhum registro encontrado.</Box>
        )}
      </Box>
    ));
  };

  const renderPorArea = () => {
    if (!projetoAtual || !areaSelecionada) return null;

    const areaNomeSelecionada =
      areas.find((area) => area.id === areaSelecionada)?.nome || "";

    const estrategicasFiltradas =
      projetoAtual.estrategicas?.filter(
        (e) => e.areaNome === areaNomeSelecionada
      ) || [];

    const taticasFiltradas =
      projetoAtual.estrategicas?.flatMap((e) =>
        e.taticas?.filter((t) => t.areaNome === areaNomeSelecionada) || []
      ) || [];

    const operacionaisFiltradas =
      projetoAtual.estrategicas?.flatMap((e) =>
        e.taticas?.flatMap(
          (t) =>
            t.operacionais?.filter(
              (op) => op.areaNome === areaNomeSelecionada
            ) || []
        ) || []
      ) || [];

    const tarefasFiltradas =
      projetoAtual.estrategicas?.flatMap((e) =>
        e.taticas?.flatMap(
          (t) =>
            t.operacionais?.flatMap(
              (op) =>
                op.tarefas?.filter(
                  (tar) => tar.areaNome === areaNomeSelecionada
                ) || []
            ) || []
        ) || []
      ) || [];

    return (
      <>
        {renderListaSimples("Estratégicas", estrategicasFiltradas, "#312783", "Estratégicas")}
        {renderListaSimples("Táticas", taticasFiltradas, "#00796b", "Táticas")}
        {renderListaSimples("Operacionais", operacionaisFiltradas, "#f44336", "Operacionais")}
        {renderListaSimples("Tarefas", tarefasFiltradas, "#f28e2b", "Tarefas", true)}
      </>
    );
  };

  const renderPorUnidade = () => {
    if (!projetoAtual || !unidadeSelecionada) return null;

    const estrategicasFiltradas =
      projetoAtual.estrategicas?.filter((e) =>
        (e.unidades || []).includes(unidadeSelecionada)
      ) || [];

    const taticasFiltradas =
      projetoAtual.estrategicas?.flatMap((e) =>
        e.taticas?.filter((t) =>
          (t.unidades || []).includes(unidadeSelecionada)
        ) || []
      ) || [];

    const operacionaisFiltradas =
      projetoAtual.estrategicas?.flatMap((e) =>
        e.taticas?.flatMap(
          (t) =>
            t.operacionais?.filter((op) =>
              (op.unidades || []).includes(unidadeSelecionada)
            ) || []
        ) || []
      ) || [];

    const tarefasFiltradas =
      projetoAtual.estrategicas?.flatMap((e) =>
        e.taticas?.flatMap(
          (t) =>
            t.operacionais?.flatMap(
              (op) =>
                op.tarefas?.filter((tar) =>
                  (tar.unidades || []).includes(unidadeSelecionada)
                ) || []
            ) || []
        ) || []
      ) || [];

    return (
      <>
        {renderListaSimples("Estratégicas", estrategicasFiltradas, "#312783", "Estratégicas")}
        {renderListaSimples("Táticas", taticasFiltradas, "#00796b", "Táticas")}
        {renderListaSimples("Operacionais", operacionaisFiltradas, "#f44336", "Operacionais")}
        {renderListaSimples("Tarefas", tarefasFiltradas, "#f28e2b", "Tarefas", true)}
      </>
    );
  };

  const renderResponsaveis = () => {
    if (!projetoAtual) return null;

    const blocos = [
      {
        titulo: "Estratégicas",
        cor: "#312783",
        dados: projetoAtual.estrategicas || [],
        tipo: "Estratégicas",
      },
      {
        titulo: "Táticas",
        cor: "#00796b",
        dados: projetoAtual.estrategicas?.flatMap((e) => e.taticas || []) || [],
        tipo: "Táticas",
      },
      {
        titulo: "Operacionais",
        cor: "#f44336",
        dados:
          projetoAtual.estrategicas?.flatMap(
            (e) => e.taticas?.flatMap((t) => t.operacionais || []) || []
          ) || [],
        tipo: "Operacionais",
      },
      {
        titulo: "Tarefas",
        cor: "#f28e2b",
        dados:
          projetoAtual.estrategicas?.flatMap(
            (e) =>
              e.taticas?.flatMap(
                (t) =>
                  t.operacionais?.flatMap((o) => o.tarefas || []) || []
              ) || []
          ) || [],
        tipo: "Tarefas",
        tarefa: true,
      },
    ];

    return blocos.map((bloco) => (
      <Box key={bloco.titulo} sx={statusBlockStyle}>
        <Box sx={statusHeaderStyle}>
          <DoubleArrowIcon sx={{ color: bloco.cor }} />

          <Typography sx={{ ...statusTitleStyle, color: bloco.cor }}>
            {bloco.titulo}
          </Typography>

          <Chip label={bloco.dados.length} sx={statusCounterStyle(bloco.cor)} />
        </Box>

        {bloco.dados.map((item, i) =>
          renderLinha({
            key: `${bloco.tipo}-${i}`,
            tipo: bloco.tipo,
            titulo: bloco.tarefa ? item.tituloTarefa || "-" : item.titulo || "-",
            responsaveis: bloco.tarefa
              ? responsaveisTarefa(item)
              : (item.emails || []).join(", "),
            cor: bloco.cor,
            nivel: 0,
          })
        )}

        {bloco.dados.length === 0 && (
          <Box sx={emptyStyle}>Nenhum registro encontrado.</Box>
        )}
      </Box>
    ));
  };

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
              <Typography sx={eyebrowStyle}>FOKUS 360</Typography>

              <Typography sx={titleStyle}>
                Variáveis globais do projeto
              </Typography>

              <Typography sx={subtitleStyle}>
                Acompanhe diretrizes, tarefas, responsáveis, áreas, unidades e atrasos do projeto selecionado.
              </Typography>
            </Box>
          </Box>

          {carregando && <LinearProgress sx={{ mt: 3, borderRadius: 99 }} />}

          <Box sx={summaryGridStyle}>
            <InfoCard
              icon={<TrackChangesIcon />}
              label="Projeto"
              value={projetoAtual ? 1 : 0}
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
              label="Usuários"
              value={usuarios.length}
              color="#00a86b"
            />
          </Box>

          <Divider sx={{ my: 3, borderColor: "rgba(148,163,184,0.22)" }} />

          <TabContext value={value}>
            <Box sx={tabsBoxStyle}>
              <TabList
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="Filtros do projeto"
              >
                <Tab value="1" label="Diretrizes" onClick={() => setValue(value === "1" ? "" : "1")} />
                <Tab value="2" label="Tarefas" onClick={() => setValue(value === "2" ? "" : "2")} />
                <Tab value="3" label="Não iniciadas" onClick={() => setValue(value === "3" ? "" : "3")} />
                <Tab value="4" label="Em andamento" onClick={() => setValue(value === "4" ? "" : "4")} />
                <Tab value="5" label="Concluídas" onClick={() => setValue(value === "5" ? "" : "5")} />
                <Tab value="6" label="Em atraso" onClick={() => setValue(value === "6" ? "" : "6")} />
                <Tab value="7" label="Concluídas em atraso" onClick={() => setValue(value === "7" ? "" : "7")} />
                <Tab value="8" label="Por áreas" onClick={() => setValue(value === "8" ? "" : "8")} />
                <Tab value="9" label="Por unidades" onClick={() => setValue(value === "9" ? "" : "9")} />
                <Tab value="10" label="Responsáveis" onClick={() => setValue(value === "10" ? "" : "10")} />
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
                {renderListaSimples("Estratégicas", estrategicasAtrasadas, "#312783", "Estratégicas")}
                {renderListaSimples("Táticas", taticasAtrasadas, "#00796b", "Táticas")}
                {renderListaSimples("Operacionais", operacionaisAtrasadas, "#f44336", "Operacionais")}
                {renderListaSimples("Tarefas", tarefasAtrasadas, "#f57c00", "Tarefas", true)}
              </TabPanel>

              <TabPanel value="7" sx={tabPanelStyle}>
                {renderConcluidasEmAtraso()}
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

                {renderPorArea()}
              </TabPanel>

              <TabPanel value="9" sx={tabPanelStyle}>
                <Box sx={filterBoxStyle}>
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel id="select-unidade-label">Filtrar por Unidade</InputLabel>

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

                {renderPorUnidade()}
              </TabPanel>

              <TabPanel value="10" sx={tabPanelStyle}>
                {renderResponsaveis()}
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </Paper>
    </Box>
  );
};

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
  boxShadow: "0 28px 80px rgba(15,23,42,0.12)",
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

const statusCounterStyle = (statusColor) => ({
  height: 26,
  fontWeight: 900,
  color: statusColor,
  backgroundColor: `${statusColor}12`,
  border: `1px solid ${statusColor}30`,
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

export default FiltrosPlanejamento3;