import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages normalmente sirve en /NOMBRE_DEL_REPO/.
  // Cambia el fallback si tu repositorio no se llama "proyecto2".
  // Usa base: '/' para dominio propio o repositorio de usuario/organizacion en la raiz.
  base: process.env.VITE_BASE_PATH ?? '/proyecto2/',
});
