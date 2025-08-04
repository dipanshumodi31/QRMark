import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/QRMark/',  // ✅ THIS is required for GitHub Pages to serve correctly
  build: {
    outDir: 'dist',
  }
})
