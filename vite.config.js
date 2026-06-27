import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/supabase-proxy': {
        target: 'https://jsdfxytuwshwcmlrzpjf.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-proxy/, ''),
      },
    },
  },
})
