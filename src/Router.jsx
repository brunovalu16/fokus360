import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import AuthLayout from "../src/components/AuthLayout";
import Login from "./scenes/login";
import Cadastro from "./scenes/cadastro";
import User from "./scenes/usuario";
import Dashboard from "./scenes/dashboard";
import Relatorios from "./scenes/relatorios";
import PainelIndustrias from "./scenes/painel-industrias";
import Kanban from "./scenes/kanban";
import Home from "./scenes/home";
import Arquivos from "./scenes/arquivos";
import VendasDevolucao from "./scenes/vendasdevolucao";
import Projetos from "./scenes/projetos";
import CadastroProjetos from "./scenes/cadastroprojetos";
import ListaProjetos from "./scenes/listaprojetos";
import Diretriz from "./scenes/diretrizes";
import DashboardProjeto from "./scenes/dashboardprojeto";
import DataProjeto from "./components/DataProjeto";
import UserDetalhe from "./components/UserDetalhe";
import FluxoGrama from "./components/FluxoGrama";
import Listafluxograma from "./scenes/Listafluxograma";
import { Team, Invoices, Contacts, Form, Bar, Line, Pie, FAQ, Geography, Calendar, Stream } from "./scenes";
import PrivateRoute from "./components/PrivateRoute"; // Importando o componente PrivateRoute

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas sem Sidebar */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rotas com Sidebar */}
        <Route element={<App />}>
          {/* Rota protegida para cadastro */}
          <Route
            path="/cadastro"
            element={
              <PrivateRoute>
                <Cadastro />
              </PrivateRoute>
            }
          />
          {/* Outras rotas protegidas */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path="/painelindustrias"
            element={
              <PrivateRoute>
                <PainelIndustrias />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboardprojeto"
            element={
              <PrivateRoute>
                <DashboardProjeto />
              </PrivateRoute>
            }
          />
          <Route
            path="/vendasdevolucao"
            element={
              <PrivateRoute>
                <VendasDevolucao />
              </PrivateRoute>
            }
          />
          <Route
            path="/cadastroprojetos"
            element={
              <PrivateRoute>
                <CadastroProjetos />
              </PrivateRoute>
            }
          />
          <Route
            path="/dataprojeto"
            element={
              <PrivateRoute>
                <DataProjeto />
              </PrivateRoute>
            }
          />
          <Route
            path="/diretriz"
            element={
              <PrivateRoute>
                <Diretriz />
              </PrivateRoute>
            }
          />
          <Route
            path="/listaprojetos"
            element={
              <PrivateRoute>
                <ListaProjetos />
              </PrivateRoute>
            }
          />
          <Route
            path="/projetos"
            element={
              <PrivateRoute>
                <Projetos />
              </PrivateRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <Relatorios />
              </PrivateRoute>
            }
          />
          <Route
            path="/arquivos"
            element={
              <PrivateRoute>
                <Arquivos />
              </PrivateRoute>
            }
          />
          <Route
            path="/kanban"
            element={
              <PrivateRoute>
                <Kanban />
              </PrivateRoute>
            }
          />
          <Route
            path="/team"
            element={
              <PrivateRoute>
                <Team />
              </PrivateRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <PrivateRoute>
                <Contacts />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <Invoices />
              </PrivateRoute>
            }
          />
          <Route
            path="/form"
            element={
              <PrivateRoute>
                <Form />
              </PrivateRoute>
            }
          />
          <Route
            path="/fluxograma"
            element={
              <PrivateRoute>
                <FluxoGrama />
              </PrivateRoute>
            }
          />
          <Route
            path="/listafluxograma"
            element={
              <PrivateRoute>
                <Listafluxograma />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <Calendar />
              </PrivateRoute>
            }
          />
          <Route
            path="/bar"
            element={
              <PrivateRoute>
                <Bar />
              </PrivateRoute>
            }
          />
          <Route
            path="/pie"
            element={
              <PrivateRoute>
                <Pie />
              </PrivateRoute>
            }
          />
          <Route
            path="/stream"
            element={
              <PrivateRoute>
                <Stream />
              </PrivateRoute>
            }
          />
          <Route
            path="/line"
            element={
              <PrivateRoute>
                <Line />
              </PrivateRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <PrivateRoute>
                <FAQ />
              </PrivateRoute>
            }
          />
          <Route
            path="/geography"
            element={
              <PrivateRoute>
                <Geography />
              </PrivateRoute>
            }
          />
          <Route
            path="/usuario/editar"
            element={
              <PrivateRoute>
                <UserDetalhe />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
