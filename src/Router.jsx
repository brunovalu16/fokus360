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
import  Home  from "./scenes/home";
import Arquivos from "./scenes/arquivos";
import VendasDevolucao from "./scenes/vendasdevolucao";
import Projetos from "./scenes/projetos";
import CadastroProjetos from "./scenes/cadastroprojetos";
import  ListaProjetos from "./scenes/listaprojetos";
import Diretriz from "./scenes/diretrizes";
import DashboardProjeto from "./scenes/dashboardprojeto";
import { Team, Invoices, Contacts, Form, Bar, Line, Pie, FAQ, Geography, Calendar, Stream } from "./scenes";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas sem Sidebar */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Route>
        
        {/* Rotas com Sidebar */}
        <Route element={<App />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/painelindustrias" element={<PainelIndustrias />} />
          <Route path="/dashboardprojeto" element={<DashboardProjeto />} />
          <Route path="/vendasdevolucao" element={<VendasDevolucao />} />
          <Route path="/cadastroprojetos" element={<CadastroProjetos />} />
          <Route path="/diretriz" element={<Diretriz />} />
          <Route path="/listaprojetos" element={<ListaProjetos />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/arquivos" element={<Arquivos />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/form" element={<Form />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/pie" element={<Pie />} />
          <Route path="/stream" element={<Stream />} />
          <Route path="/line" element={<Line />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/geography" element={<Geography />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter; 
