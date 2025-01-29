import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: '/', // Define a base corretamente
  server: {
    historyApiFallback: true, // Garante que o React Router funcione
  },
});
