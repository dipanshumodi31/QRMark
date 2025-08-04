import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add base if your app is not at the root of the domain (e.g., example.com/my-app/)
  // base: '/',
  build: {
    outDir: 'dist', // Ensure this matches the outputDirectory in vercel.json
  }
})