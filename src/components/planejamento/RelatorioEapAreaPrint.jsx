// src/components/planejamento/RelatorioEapAreaPrint.jsx

import React from "react";
import styled from "styled-components";

import {
  ensureArray,
  formatarDataBR,
  getStatusClass,
  getStatusLabel,
  getTituloEstrategica,
  getTituloOperacional,
  getTituloTarefa,
  getTituloTatica,
} from "../../utils/eapReportUtils";

import {
  calcularProgressoEstrategica,
  calcularProgressoTatica,
  calcularProgressoOperacional,
} from "../../utils/progressoUtils";

const COLORS = {
  purple: "#312783",
  purpleDark: "#20175f",
  blue: "#0069f7",
  green: "#00c48c",
  red: "#fa4f58",
  yellow: "#ffbb00",
  orange: "#ff8a00",
  gray: "#64748b",
};

const Root = styled.div.attrs({
  className: "eap-print-root",
})`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
`;

const PrintPage = styled.section.attrs({
  className: "eap-print-page",
})`
  width: 100%;
  min-height: 760px;
  background: #ffffff;
  border-radius: 24px;
  padding: 22px;
  margin-bottom: 28px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.16);
  box-sizing: border-box;
  overflow: hidden;
  page-break-after: always;
  break-after: page;

  &:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  @media print {
    width: 100%;
    min-height: auto;
    margin: 0;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
    overflow: visible;
  }
`;

const Header = styled.div`
  min-height: 105px;
  padding: 22px 26px;
  border-radius: 22px;
  background:
    radial-gradient(circle at top right, rgba(0, 196, 140, 0.45), transparent 28%),
    linear-gradient(135deg, #312783 0%, #0069f7 52%, #00c48c 100%);
  color: #ffffff;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    right: -90px;
    bottom: -110px;
    width: 260px;
    height: 260px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
  }

  @media print {
    border-radius: 14px;
  }
`;

const HeaderLeft = styled.div`
  position: relative;
  z-index: 2;
`;

const Brand = styled.div`
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 2px;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 900;
  line-height: 1.1;
  margin-top: 8px;
  max-width: 760px;
`;

const ProjectName = styled.div`
  font-size: 12px;
  font-weight: 600;
  opacity: 0.92;
  margin-top: 8px;
  max-width: 780px;
`;

const HeaderRight = styled.div`
  min-width: 210px;
  text-align: right;
  position: relative;
  z-index: 2;
`;

const AreaBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 16px;
  border-radius: 999px;
  background: #ffffff;
  color: #312783;
  font-weight: 900;
  font-size: 14px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  margin-bottom: 10px;
`;

const HeaderInfo = styled.div`
  font-size: 11px;
  font-weight: 600;
  opacity: 0.95;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-top: 14px;
  margin-bottom: 14px;

  @media print {
    gap: 8px;
  }
`;

const SummaryCardBox = styled.div`
  min-height: 76px;
  border-radius: 16px;
  padding: 12px 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-top: 5px solid ${({ $color }) => $color || COLORS.purple};
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
  box-sizing: border-box;

  @media print {
    box-shadow: none;
  }
`;

const SummaryValue = styled.div`
  font-size: 25px;
  font-weight: 900;
  line-height: 1;
  color: ${({ $color }) => $color || COLORS.purple};
`;

const SummaryLabel = styled.div`
  font-size: 10px;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 900;
  margin-top: 7px;
`;

const SummarySubtitle = styled.div`
  font-size: 9px;
  color: #64748b;
  margin-top: 2px;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 14px 0;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 800;
  color: #475569;
  padding: 5px 9px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;

  span {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    display: inline-block;
    background: ${({ $color }) => $color};
  }
`;

const Tree = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Level = styled.div`
  border-radius: 16px;
  background: ${({ $background }) => $background || "#ffffff"};
  border: 1px solid #e2e8f0;
  border-left: 8px solid ${({ $color }) => $color};
  margin-left: ${({ $marginLeft }) => $marginLeft || "0"};
  overflow: hidden;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);

  @media print {
    box-shadow: none;
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const LevelHeader = styled.div`
  padding: 10px 12px;
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 14px;
  align-items: center;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
`;

const LevelKicker = styled.div`
  font-size: 9px;
  font-weight: 900;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const LevelTitle = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.25;
  margin-top: 2px;
`;

const LevelProgress = styled.div`
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 8px;
  align-items: center;
`;

const Percent = styled.div`
  font-size: 11px;
  font-weight: 900;
  color: #0f172a;
  text-align: right;
`;

const ProgressWrap = styled.div`
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 999px;
  width: ${({ $value }) => `${Math.min(Math.max($value, 0), 100)}%`};
  background: ${({ $color }) => $color};
`;

const Children = styled.div`
  padding: 10px 10px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Empty = styled.div`
  font-size: 10px;
  color: #94a3b8;
  font-weight: 600;
  padding: 8px;
`;

const TasksBox = styled.div`
  padding: 10px;
`;

const SectionLabel = styled.div`
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #64748b;
  margin-bottom: 7px;
`;

const TaskRowBox = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr 132px;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 10px;
  background: #fffdf3;
  border: 1px solid #fde68a;
  margin-bottom: 6px;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const TaskNumber = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #ffbb00;
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
`;

const TaskTitle = styled.div`
  font-size: 10.5px;
  color: #111827;
  font-weight: 800;
  line-height: 1.25;
`;

const TaskMeta = styled.div`
  font-size: 8.5px;
  color: #64748b;
  margin-top: 2px;
`;

const StatusPill = styled.div`
  justify-self: end;
  min-width: 108px;
  text-align: center;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 8.5px;
  font-weight: 900;
  text-transform: uppercase;
  white-space: nowrap;

  &.status-concluida {
    background: #dcfce7;
    color: #166534;
  }

  &.status-concluida-atrasada {
    background: #ffedd5;
    color: #c2410c;
  }

  &.status-atrasada {
    background: #fee2e2;
    color: #b91c1c;
  }

  &.status-andamento {
    background: #dbeafe;
    color: #1d4ed8;
  }

  &.status-nao-iniciada {
    background: #e2e8f0;
    color: #475569;
  }
`;

const Footer = styled.div`
  margin-top: 14px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  text-align: right;
  font-size: 8.5px;
  color: #94a3b8;
  font-weight: 600;
`;

const safePercent = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.round(number);
};

const ProgressBar = ({ value = 0, color = COLORS.blue }) => {
  const percent = safePercent(value);

  return (
    <ProgressWrap>
      <ProgressFill $value={percent} $color={color} />
    </ProgressWrap>
  );
};

const SummaryCard = ({ label, value, color, subtitle }) => {
  return (
    <SummaryCardBox $color={color}>
      <SummaryValue $color={color}>{value}</SummaryValue>
      <SummaryLabel>{label}</SummaryLabel>
      {subtitle && <SummarySubtitle>{subtitle}</SummarySubtitle>}
    </SummaryCardBox>
  );
};

const HeaderRelatorio = ({ projeto, areaNome, resumo, pageNumber, totalPages }) => {
  return (
    <Header>
      <HeaderLeft>
        <Brand>FOKUS 360</Brand>
        <Title>EAP DO PLANEJAMENTO ESTRATÉGICO</Title>
        <ProjectName>{projeto?.nome || "Projeto sem nome"}</ProjectName>
      </HeaderLeft>

      <HeaderRight>
        <AreaBadge>{areaNome}</AreaBadge>
        <HeaderInfo>Emissão: {new Date().toLocaleDateString("pt-BR")}</HeaderInfo>
        <HeaderInfo>
          Página {pageNumber} de {totalPages}
        </HeaderInfo>
        <HeaderInfo>
          Progresso da área: <strong>{resumo.progresso}%</strong>
        </HeaderInfo>
      </HeaderRight>
    </Header>
  );
};

const Legenda = () => {
  return (
    <Legend>
      <LegendItem $color={COLORS.blue}>
        <span />
        Estratégica
      </LegendItem>

      <LegendItem $color={COLORS.green}>
        <span />
        Tática
      </LegendItem>

      <LegendItem $color={COLORS.red}>
        <span />
        Operacional
      </LegendItem>

      <LegendItem $color={COLORS.yellow}>
        <span />
        Tarefa
      </LegendItem>
    </Legend>
  );
};

const TarefaRow = ({ tarefa, index }) => {
  const prazo =
    tarefa.finalizacao ||
    tarefa.prazo ||
    tarefa.dataFinalizacao ||
    tarefa.dataFim ||
    null;

  const responsavel =
    tarefa.responsavel ||
    tarefa.colaborador ||
    tarefa.quem ||
    tarefa.usuario ||
    "-";

  return (
    <TaskRowBox>
      <TaskNumber>{index + 1}</TaskNumber>

      <div>
        <TaskTitle>{getTituloTarefa(tarefa)}</TaskTitle>
        <TaskMeta>
          Responsável: <strong>{responsavel}</strong> · Prazo:{" "}
          <strong>{formatarDataBR(prazo)}</strong>
        </TaskMeta>
      </div>

      <StatusPill className={getStatusClass(tarefa)}>
        {getStatusLabel(tarefa)}
      </StatusPill>
    </TaskRowBox>
  );
};

const OperacionalBlock = ({ operacional, index }) => {
  const progressoOperacional = safePercent(
    calcularProgressoOperacional(operacional)
  );

  return (
    <Level
      $color={COLORS.red}
      $marginLeft="18px"
      $background="#fffafa"
    >
      <LevelHeader>
        <div>
          <LevelKicker>Operacional {index + 1}</LevelKicker>
          <LevelTitle>{getTituloOperacional(operacional)}</LevelTitle>
        </div>

        <LevelProgress>
          <Percent>{progressoOperacional}%</Percent>
          <ProgressBar value={progressoOperacional} color={COLORS.red} />
        </LevelProgress>
      </LevelHeader>

      <TasksBox>
        <SectionLabel>Tarefas</SectionLabel>

        {ensureArray(operacional.tarefas).length === 0 ? (
          <Empty>Nenhuma tarefa cadastrada.</Empty>
        ) : (
          ensureArray(operacional.tarefas).map((tarefa, tarefaIndex) => (
            <TarefaRow
              key={tarefa.id || `${operacional.id}-tarefa-${tarefaIndex}`}
              tarefa={tarefa}
              index={tarefaIndex}
            />
          ))
        )}
      </TasksBox>
    </Level>
  );
};

const TaticaBlock = ({ tatica, index }) => {
  const progressoTatica = safePercent(calcularProgressoTatica(tatica));

  return (
    <Level
      $color={COLORS.green}
      $marginLeft="18px"
      $background="#fbfffd"
    >
      <LevelHeader>
        <div>
          <LevelKicker>Tática {index + 1}</LevelKicker>
          <LevelTitle>{getTituloTatica(tatica)}</LevelTitle>
        </div>

        <LevelProgress>
          <Percent>{progressoTatica}%</Percent>
          <ProgressBar value={progressoTatica} color={COLORS.green} />
        </LevelProgress>
      </LevelHeader>

      <Children>
        {ensureArray(tatica.operacionais).length === 0 ? (
          <Empty>Nenhum operacional cadastrado.</Empty>
        ) : (
          ensureArray(tatica.operacionais).map((operacional, operacionalIndex) => (
            <OperacionalBlock
              key={operacional.id || `${tatica.id}-operacional-${operacionalIndex}`}
              operacional={operacional}
              index={operacionalIndex}
            />
          ))
        )}
      </Children>
    </Level>
  );
};

const EstrategicaBlock = ({ estrategica, index }) => {
  const progressoEstrategica = safePercent(
    calcularProgressoEstrategica(estrategica)
  );

  return (
    <Level $color={COLORS.blue} $background="#ffffff">
      <LevelHeader>
        <div>
          <LevelKicker>Estratégica {index + 1}</LevelKicker>
          <LevelTitle>{getTituloEstrategica(estrategica)}</LevelTitle>
        </div>

        <LevelProgress>
          <Percent>{progressoEstrategica}%</Percent>
          <ProgressBar value={progressoEstrategica} color={COLORS.blue} />
        </LevelProgress>
      </LevelHeader>

      <Children>
        {ensureArray(estrategica.taticas).length === 0 ? (
          <Empty>Nenhuma tática cadastrada para esta área.</Empty>
        ) : (
          ensureArray(estrategica.taticas).map((tatica, taticaIndex) => (
            <TaticaBlock
              key={tatica.id || `${estrategica.id}-tatica-${taticaIndex}`}
              tatica={tatica}
              index={taticaIndex}
            />
          ))
        )}
      </Children>
    </Level>
  );
};

const AreaPage = ({ projeto, area, pageNumber, totalPages }) => {
  const { areaNome, estrategicas, resumo } = area;

  return (
    <PrintPage>
      <HeaderRelatorio
        projeto={projeto}
        areaNome={areaNome}
        resumo={resumo}
        pageNumber={pageNumber}
        totalPages={totalPages}
      />

      <SummaryGrid>
        <SummaryCard
          label="Progresso"
          value={`${resumo.progresso}%`}
          color={COLORS.purple}
          subtitle="Conclusão geral da área"
        />

        <SummaryCard
          label="Estratégicas"
          value={resumo.estrategicas}
          color={COLORS.blue}
          subtitle="Direcionadores"
        />

        <SummaryCard
          label="Táticas"
          value={resumo.taticas}
          color={COLORS.green}
          subtitle="Planos de execução"
        />

        <SummaryCard
          label="Operacionais"
          value={resumo.operacionais}
          color={COLORS.red}
          subtitle="Frentes operacionais"
        />

        <SummaryCard
          label="Tarefas"
          value={resumo.tarefas}
          color={COLORS.yellow}
          subtitle={`${resumo.tarefasConcluidas} concluídas`}
        />

        <SummaryCard
          label="Atrasadas"
          value={resumo.tarefasAtrasadas}
          color={COLORS.orange}
          subtitle="Pontos de atenção"
        />
      </SummaryGrid>

      <Legenda />

      <Tree>
        {ensureArray(estrategicas).map((estrategica, estrategicaIndex) => (
          <EstrategicaBlock
            key={estrategica.id || `estrategica-${estrategicaIndex}`}
            estrategica={estrategica}
            index={estrategicaIndex}
          />
        ))}
      </Tree>

      <Footer>
        FOKUS 360 · Relatório EAP por Área · Documento gerado automaticamente
      </Footer>
    </PrintPage>
  );
};

const RelatorioEapAreaPrint = ({ projeto, relatorioAreas = [] }) => {
  return (
    <Root>
      {relatorioAreas.map((area, index) => (
        <AreaPage
          key={area.areaNome || `area-${index}`}
          projeto={projeto}
          area={area}
          pageNumber={index + 1}
          totalPages={relatorioAreas.length}
        />
      ))}
    </Root>
  );
};

export default RelatorioEapAreaPrint;