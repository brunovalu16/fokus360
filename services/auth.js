export const isAuthenticated = () => {
    const token = localStorage.getItem("token"); // Substitua por cookies ou outro método se preferir
    return !!token; // Retorna `true` se o token existir
  };
  