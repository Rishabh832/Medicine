import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/static/frontend/',   
  build: {
    outDir: '../../Backends/Medicine/static/frontend',
    emptyOutDir: true,
  }
})