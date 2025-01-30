import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: './', // Corrige o carregamento de arquivos estáticos
  server: {
    historyApiFallback: true, // Garante que o React Router funcione
  },
});
