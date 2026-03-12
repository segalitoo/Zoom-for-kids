import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src/zoom-app',
  base: '/Zoom-for-kids/app/',
  build: {
    outDir: '../../docs/app',
    emptyOutDir: true,
  },
});
