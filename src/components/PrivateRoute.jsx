import React from "react";
import { Navigate } from "react-router-dom";

// Função para verificar autenticação
const isAuthenticated = () => {
  const token = localStorage.getItem("token"); // Verifica se existe um token no localStorage
  return !!token; // Retorna true se o token existir
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />; // Redireciona para login se não estiver autenticado
};

export default PrivateRoute;
