import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()],  assetsInclude: ["**/*.JPG", "**/*.jpg", "**/*.JPEG", "**/*.jpeg"], server: { port: 5173, proxy: { '/api': 'https://medcore-7629.onrender.com' } } });
