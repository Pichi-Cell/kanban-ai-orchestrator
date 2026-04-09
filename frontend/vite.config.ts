import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      // Explicitly bridge the Docker OS variable into Vite
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
    }
  }
})
