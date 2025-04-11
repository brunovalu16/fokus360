import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
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
import Projetos2 from "./scenes/projetos2";
import CadastroProjetos from "./scenes/cadastroprojetos";
import ListaProjetos from "./scenes/listaprojetos";
import ListaProjetos2 from "./scenes/listaprojetos2";
import Diretriz from "./scenes/diretrizes";
import DashboardProjeto from "./scenes/dashboardprojeto";
import DataProjeto from "./components/DataProjeto";
import UserDetalhe from "./components/UserDetalhe";
import FluxoGrama from "./components/FluxoGrama";
import Listafluxograma from "./scenes/Listafluxograma";
import Roteirizacao from "./scenes/roteirizacao";
import Monitoramento from "./scenes/monitoramento";
import CadastroAreas from "./scenes/cadastroAreas";
import Planejamento from "./scenes/planejamento";
import DashboardPlanejamento from "./scenes/dashboardplanejamento";
import DataPlanejamento from "./components/DataPlanejamento";
import {
  Team,
  Invoices,
  Contacts,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
} from "./scenes";
import PrivateRoute from "./components/PrivateRoute";

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
        { path: "/dataplanejamento", element: <PrivateRoute><DataPlanejamento /></PrivateRoute> },
        { path: "/dashboardplanejamento/:id", element: <PrivateRoute><DashboardPlanejamento /></PrivateRoute> },
        { path: "/dashboard", element: <PrivateRoute><Dashboard /></PrivateRoute> },
        { path: "/planejamento", element: <PrivateRoute><Planejamento /></PrivateRoute> },
        { path: "/user", element: <PrivateRoute><User /></PrivateRoute> },
        { path: "/painelindustrias", element: <PrivateRoute><PainelIndustrias /></PrivateRoute> },
        { path: "/dashboardprojeto", element: <PrivateRoute><DashboardProjeto /></PrivateRoute> },
        { path: "/vendasdevolucao", element: <PrivateRoute><VendasDevolucao /></PrivateRoute> },
        { path: "/relatoriotrade", element: <PrivateRoute><RelatorioTrade /></PrivateRoute> },
        { path: "/cadastroprojetos", element: <PrivateRoute><CadastroProjetos /></PrivateRoute> },
        { path: "/dataprojeto", element: <PrivateRoute><DataProjeto /></PrivateRoute> },
        { path: "/diretriz", element: <PrivateRoute><Diretriz /></PrivateRoute> },
        { path: "/listaprojetos", element: <PrivateRoute><ListaProjetos /></PrivateRoute> },
        { path: "/listaprojetos2", element: <PrivateRoute><ListaProjetos2 /></PrivateRoute> },
        { path: "/projetos", element: <PrivateRoute><Projetos /></PrivateRoute> },
        { path: "/projetos2", element: <PrivateRoute><Projetos2 /></PrivateRoute> },
        { path: "/monitoramento", element: <PrivateRoute><Monitoramento /></PrivateRoute> },
        { path: "/relatorios", element: <PrivateRoute><Relatorios /></PrivateRoute> },
        { path: "/roteirizacao", element: <PrivateRoute><Roteirizacao /></PrivateRoute> },
        { path: "/arquivos", element: <PrivateRoute><Arquivos /></PrivateRoute> },
        { path: "/kanban", element: <PrivateRoute><Kanban /></PrivateRoute> },
        { path: "/team", element: <PrivateRoute><Team /></PrivateRoute> },
        { path: "/contacts", element: <PrivateRoute><Contacts /></PrivateRoute> },
        { path: "/invoices", element: <PrivateRoute><Invoices /></PrivateRoute> },
        { path: "/fluxograma", element: <PrivateRoute><FluxoGrama /></PrivateRoute> },
        { path: "/listafluxograma", element: <PrivateRoute><Listafluxograma /></PrivateRoute> },
        { path: "/calendar", element: <PrivateRoute><Calendar /></PrivateRoute> },
        { path: "/cadastroareas", element: <PrivateRoute><CadastroAreas /></PrivateRoute> },
        { path: "/bar", element: <PrivateRoute><Bar /></PrivateRoute> },
        { path: "/pie", element: <PrivateRoute><Pie /></PrivateRoute> },
        { path: "/stream", element: <PrivateRoute><Stream /></PrivateRoute> },
        { path: "/line", element: <PrivateRoute><Line /></PrivateRoute> },
        { path: "/faq", element: <PrivateRoute><FAQ /></PrivateRoute> },
        { path: "/geography", element: <PrivateRoute><Geography /></PrivateRoute> },
        { path: "/usuario/editar", element: <PrivateRoute><UserDetalhe /></PrivateRoute> },
      ],
    },
    // Redirecionamento da rota raiz ("/") para "/login"
    {
      path: "/",
      element: <Navigate to="/login" /> // Redireciona para a página de login
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
