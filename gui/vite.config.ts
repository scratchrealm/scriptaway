import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  base: "https://scratchrealm.github.io/scriptaway",
  define: {
    'process.env': {}
  },
  // see https://stackoverflow.com/questions/75883720/504-outdated-optimize-dep-while-using-react-vite
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
})
