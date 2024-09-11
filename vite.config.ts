import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config'; // Importar configuración de Vitest

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', 
    setupFiles: './src/tests/calculator.text.tsx', 
    globals: true, 
  },
});
