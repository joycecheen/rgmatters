import { defineConfig } from 'vite'

export default defineConfig({
  base: '/rgmatters/',
  optimizeDeps: {
    exclude: ['fsevents'],
  },
  build: {
    rollupOptions: {
        external: ['fsevents'],
        output: {
        manualChunks: {
          vendor: ['vite']
        }
      }
    }
  },
  server: {
    historyApiFallback: true
  }
})