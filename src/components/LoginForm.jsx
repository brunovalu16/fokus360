import React, { useState } from "react";
import "./LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("E-mail:", email, "Senha:", password);
    // Aqui você pode integrar o Firebase ou outro serviço
  };

  return (
    <div id="loginPage" className="log">
      <form id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>

      <div className="brand">
        <img src="/assets/img/logo_fpb_cor.png" alt="Logo" style={{ width: "110%", height: "70%" }} />
      </div>
    </div>
  );
};

export default LoginForm;
