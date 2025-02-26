import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
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
import RelatorioTrade from "./scenes/relatoriotrade";
import Projetos from "./scenes/projetos";
import CadastroProjetos from "./scenes/cadastroprojetos";
import ListaProjetos from "./scenes/listaprojetos";
import Diretriz from "./scenes/diretrizes";
import DashboardProjeto from "./scenes/dashboardprojeto";
import DataProjeto from "./components/DataProjeto";
import UserDetalhe from "./components/UserDetalhe";
import FluxoGrama from "./components/FluxoGrama";
import Listafluxograma from "./scenes/Listafluxograma";
import {
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
} from "./scenes";
import PrivateRoute from "./components/PrivateRoute";
import Roteirizador from "./scenes/roteirizador";

const router = createBrowserRouter(
  [
    {
      element: <AuthLayout />,
      children: [{ path: "/login", element: <Login /> }],
    },
    {
      element: <App />,
      children: [
        { path: "/cadastro", element: <PrivateRoute><Cadastro /></PrivateRoute> },
        { path: "/home", element: <PrivateRoute><Home /></PrivateRoute> },
        { path: "/dashboard", element: <PrivateRoute><Dashboard /></PrivateRoute> },
        { path: "/user", element: <PrivateRoute><User /></PrivateRoute> },
        { path: "/painelindustrias", element: <PrivateRoute><PainelIndustrias /></PrivateRoute> },
        { path: "/roteirizador", element: <PrivateRoute><Roteirizador /></PrivateRoute> },
        { path: "/dashboardprojeto", element: <PrivateRoute><DashboardProjeto /></PrivateRoute> },
        { path: "/vendasdevolucao", element: <PrivateRoute><VendasDevolucao /></PrivateRoute> },
        { path: "/relatoriotrade", element: <PrivateRoute><RelatorioTrade /></PrivateRoute> },
        { path: "/cadastroprojetos", element: <PrivateRoute><CadastroProjetos /></PrivateRoute> },
        { path: "/dataprojeto", element: <PrivateRoute><DataProjeto /></PrivateRoute> },
        { path: "/diretriz", element: <PrivateRoute><Diretriz /></PrivateRoute> },
        { path: "/listaprojetos", element: <PrivateRoute><ListaProjetos /></PrivateRoute> },
        { path: "/projetos", element: <PrivateRoute><Projetos /></PrivateRoute> },
        { path: "/relatorios", element: <PrivateRoute><Relatorios /></PrivateRoute> },
        { path: "/arquivos", element: <PrivateRoute><Arquivos /></PrivateRoute> },
        { path: "/kanban", element: <PrivateRoute><Kanban /></PrivateRoute> },
        { path: "/team", element: <PrivateRoute><Team /></PrivateRoute> },
        { path: "/contacts", element: <PrivateRoute><Contacts /></PrivateRoute> },
        { path: "/invoices", element: <PrivateRoute><Invoices /></PrivateRoute> },
        { path: "/form", element: <PrivateRoute><Form /></PrivateRoute> },
        { path: "/fluxograma", element: <PrivateRoute><FluxoGrama /></PrivateRoute> },
        { path: "/listafluxograma", element: <PrivateRoute><Listafluxograma /></PrivateRoute> },
        { path: "/calendar", element: <PrivateRoute><Calendar /></PrivateRoute> },
        { path: "/bar", element: <PrivateRoute><Bar /></PrivateRoute> },
        { path: "/pie", element: <PrivateRoute><Pie /></PrivateRoute> },
        { path: "/stream", element: <PrivateRoute><Stream /></PrivateRoute> },
        { path: "/line", element: <PrivateRoute><Line /></PrivateRoute> },
        { path: "/faq", element: <PrivateRoute><FAQ /></PrivateRoute> },
        { path: "/geography", element: <PrivateRoute><Geography /></PrivateRoute> },
        { path: "/usuario/editar", element: <PrivateRoute><UserDetalhe /></PrivateRoute> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
