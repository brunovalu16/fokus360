import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Garante que os assets sejam carregados corretamente
  build: {
    outDir: "dist",
  },
  server: {
    historyApiFallback: true, // Garante que o React Router funcione corretamente
  },
});
